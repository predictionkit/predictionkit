import type { PredictionProvider } from '../provider';
import type { ListOptions, Market, MarketOutcome } from '../types';
import { HttpClient } from '../util/http';
import { clamp01, num } from '../util/normalize';

const GAMMA_BASE = 'https://gamma-api.polymarket.com';
const SITE = 'https://polymarket.com';

/** Subset of the Gamma API market object we rely on. */
interface GammaMarket {
  id: string;
  question: string;
  slug?: string;
  /** Stringified JSON array, e.g. `"[\"Yes\",\"No\"]"`. */
  outcomes?: string;
  /** Stringified JSON array of 0–1 prices, e.g. `"[\"0.62\",\"0.38\"]"`. */
  outcomePrices?: string;
  volumeNum?: number;
  volume?: string | number;
  volume24hr?: number;
  liquidityNum?: number;
  liquidity?: string | number;
  active?: boolean;
  closed?: boolean;
  startDate?: string;
  endDate?: string;
  image?: string;
  category?: string;
}

interface GammaEvent {
  id: string;
  title?: string;
  slug?: string;
  markets?: GammaMarket[];
}

export interface PolymarketOptions {
  /** Override the Gamma API base URL. */
  baseUrl?: string;
  /** Minimum ms between requests (client-side throttle). Defaults to 0. */
  minIntervalMs?: number;
  /** Override the `fetch` implementation (useful for tests). */
  fetchImpl?: typeof fetch;
}

/** Parse one of Polymarket's stringified JSON array fields. */
function parseStringArray(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function deriveOutcomes(market: GammaMarket): { probability: number; outcomes?: MarketOutcome[] } {
  const labels = parseStringArray(market.outcomes);
  const prices = parseStringArray(market.outcomePrices);
  const outcomes: MarketOutcome[] = labels.map((label, i) => ({
    label,
    probability: clamp01(num(prices[i]) ?? 0),
  }));
  const yes = outcomes.find((o) => o.label.toLowerCase() === 'yes');
  const probability = yes?.probability ?? outcomes[0]?.probability ?? 0;
  return { probability, outcomes: outcomes.length ? outcomes : undefined };
}

function normalizeMarket(market: GammaMarket): Market {
  const { probability, outcomes } = deriveOutcomes(market);
  return {
    id: `polymarket:${market.id}`,
    source: 'polymarket',
    nativeId: market.id,
    title: market.question,
    probability,
    volume: num(market.volumeNum ?? market.volume),
    liquidity: num(market.liquidityNum ?? market.liquidity),
    category: market.category,
    status: market.closed ? 'resolved' : market.active === false ? 'closed' : 'open',
    endDate: market.endDate,
    image: market.image,
    url: market.slug ? `${SITE}/event/${market.slug}` : undefined,
    outcomes,
  };
}

/**
 * Read-only Polymarket adapter backed by the public Gamma API. No
 * authentication is required for any of these endpoints.
 */
export function polymarket(options: PolymarketOptions = {}): PredictionProvider {
  const http = new HttpClient({
    baseUrl: options.baseUrl ?? GAMMA_BASE,
    minIntervalMs: options.minIntervalMs ?? 0,
    fetchImpl: options.fetchImpl,
  });

  return {
    source: 'polymarket',

    async getMarket(nativeId: string): Promise<Market> {
      const market = await http.get<GammaMarket>(`/markets/${encodeURIComponent(nativeId)}`);
      return normalizeMarket(market);
    },

    async getMarkets(opts: ListOptions = {}): Promise<Market[]> {
      const markets = await http.get<GammaMarket[]>('/markets', {
        active: true,
        closed: false,
        order: 'volume',
        ascending: false,
        limit: opts.limit ?? 20,
        tag_id: opts.category,
      });
      return markets.map(normalizeMarket);
    },

    async getTrendingMarkets(opts: ListOptions = {}): Promise<Market[]> {
      const limit = opts.limit ?? 20;
      const events = await http.get<GammaEvent[]>('/events', {
        active: true,
        closed: false,
        order: 'volume_24hr',
        ascending: false,
        limit,
      });
      const markets: Market[] = [];
      for (const event of events) {
        const market = event.markets?.find((m) => m.active && !m.closed) ?? event.markets?.[0];
        if (market) markets.push(normalizeMarket(market));
      }
      return markets.slice(0, limit);
    },
  };
}
