import type { PredictionProvider } from '../provider';
import type { ListOptions, Market, MarketStatus } from '../types';
import { HttpClient } from '../util/http';
import { clamp01, num } from '../util/normalize';

const API_BASE = 'https://external-api.kalshi.com/trade-api/v2';
const SITE = 'https://kalshi.com';

/**
 * Subset of the Kalshi v2 market object we rely on. Prices are strings in the
 * post-2026 fixed-point `*_dollars` fields (0.00–1.00); counts are `*_fp`.
 */
interface KalshiMarket {
  ticker: string;
  event_ticker?: string;
  title?: string;
  yes_sub_title?: string;
  status?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
  volume_fp?: string;
  volume_24h_fp?: string;
  liquidity_dollars?: string;
  open_interest_fp?: string;
  close_time?: string;
}

/** An event groups related markets and carries the human-readable question. */
interface KalshiEvent {
  event_ticker: string;
  title?: string;
  sub_title?: string;
  category?: string;
  series_ticker?: string;
  markets?: KalshiMarket[];
}

interface KalshiMarketResponse {
  market: KalshiMarket;
}

interface KalshiEventResponse {
  event: KalshiEvent;
}

interface KalshiEventsResponse {
  events: KalshiEvent[];
  cursor?: string;
}

/** Context from a market's parent event used to build a title and URL. */
interface EventContext {
  title?: string;
  category?: string;
  seriesTicker?: string;
}

export interface KalshiOptions {
  /** Override the Kalshi API base URL. */
  baseUrl?: string;
  /** Minimum ms between requests (client-side throttle). Defaults to ~70ms. */
  minIntervalMs?: number;
  /** Override the `fetch` implementation (useful for tests). */
  fetchImpl?: typeof fetch;
}

/** Map a raw Kalshi status string to a normalized {@link MarketStatus}. */
function mapStatus(status?: string): MarketStatus {
  switch (status) {
    case 'settled':
    case 'finalized':
    case 'determined':
      return 'resolved';
    case 'closed':
    case 'inactive':
    case 'paused':
      return 'closed';
    default:
      return 'open';
  }
}

/** Yes probability as the bid/ask midpoint, falling back to last/single side. */
function yesProbability(m: KalshiMarket): number {
  const bid = num(m.yes_bid_dollars);
  const ask = num(m.yes_ask_dollars);
  if (bid != null && ask != null) return clamp01((bid + ask) / 2);
  const last = num(m.last_price_dollars);
  if (last != null) return clamp01(last);
  return clamp01(ask ?? bid ?? 0);
}

/**
 * Build a readable title. The question lives on the parent event; the
 * per-outcome label (e.g. a candidate name) lives on the market's
 * `yes_sub_title`. Combine them when both exist.
 */
function composeTitle(eventTitle: string | undefined, m: KalshiMarket): string {
  const base = eventTitle?.trim();
  const sub = m.yes_sub_title?.trim();
  if (base && sub) return `${base} — ${sub}`;
  return base || sub || m.title?.trim() || m.ticker;
}

/** The series ticker is the prefix of an event/market ticker before the first `-`. */
function deriveSeries(ticker?: string): string | undefined {
  return ticker?.split('-')[0] || undefined;
}

/**
 * Kalshi's public market pages live under the series, e.g.
 * `kalshi.com/markets/<series-ticker>`. We build that reliable form from the
 * series ticker (the full market ticker is not a valid page URL).
 */
function marketUrl(m: KalshiMarket, seriesTicker?: string): string | undefined {
  const series = seriesTicker ?? deriveSeries(m.event_ticker) ?? deriveSeries(m.ticker);
  return series ? `${SITE}/markets/${series.toLowerCase()}` : undefined;
}

function normalizeMarket(m: KalshiMarket, ctx: EventContext = {}): Market {
  const probability = yesProbability(m);
  return {
    id: `kalshi:${m.ticker}`,
    source: 'kalshi',
    nativeId: m.ticker,
    title: composeTitle(ctx.title, m),
    probability,
    volume: num(m.volume_fp),
    liquidity: num(m.liquidity_dollars),
    category: ctx.category,
    status: mapStatus(m.status),
    endDate: m.close_time,
    url: marketUrl(m, ctx.seriesTicker),
    outcomes: [
      { label: 'Yes', probability },
      { label: 'No', probability: clamp01(1 - probability) },
    ],
  };
}

/** Flatten nested-market events into market + event-context pairs. */
function collect(events: KalshiEvent[]): Array<{ m: KalshiMarket; ctx: EventContext }> {
  const out: Array<{ m: KalshiMarket; ctx: EventContext }> = [];
  for (const event of events) {
    const ctx: EventContext = {
      title: event.title,
      category: event.category,
      seriesTicker: event.series_ticker,
    };
    for (const m of event.markets ?? []) {
      out.push({ m, ctx });
    }
  }
  return out;
}

/**
 * Read-only Kalshi adapter backed by the public v2 REST API (no auth required).
 *
 * Discovery goes through `/events?with_nested_markets=true` rather than
 * `/markets`: the bare markets listing is dominated by auto-generated
 * "multivariate" parlay markets with no volume and concatenated titles, whereas
 * events expose real markets with a clean question title and category. Kalshi
 * has no server-side sort, so listing/trending sort client-side by volume.
 */
export function kalshi(options: KalshiOptions = {}): PredictionProvider {
  const http = new HttpClient({
    baseUrl: options.baseUrl ?? API_BASE,
    // Kalshi's basic read tier is ~15–20 req/s; ~70ms keeps us comfortably under.
    minIntervalMs: options.minIntervalMs ?? 70,
    fetchImpl: options.fetchImpl,
  });

  // Fetch enough events to sort meaningfully, capped at the API's max of 200.
  const eventPageSize = (limit: number) => Math.min(200, Math.max(limit, 50));

  async function fetchEvents(limit: number, category?: string): Promise<KalshiEvent[]> {
    const res = await http.get<KalshiEventsResponse>('/events', {
      status: 'open',
      with_nested_markets: true,
      limit: eventPageSize(limit),
      series_ticker: category,
    });
    return res.events ?? [];
  }

  return {
    source: 'kalshi',

    async getMarket(nativeId: string): Promise<Market> {
      const { market } = await http.get<KalshiMarketResponse>(
        `/markets/${encodeURIComponent(nativeId)}`,
      );
      let ctx: EventContext = {};
      if (market.event_ticker) {
        try {
          const { event } = await http.get<KalshiEventResponse>(
            `/events/${encodeURIComponent(market.event_ticker)}`,
          );
          ctx = {
            title: event?.title,
            category: event?.category,
            seriesTicker: event?.series_ticker,
          };
        } catch {
          // Event lookup is best-effort; fall back to the market's own fields.
        }
      }
      return normalizeMarket(market, ctx);
    },

    async getMarkets(opts: ListOptions = {}): Promise<Market[]> {
      const limit = opts.limit ?? 20;
      const collected = collect(await fetchEvents(limit, opts.category));
      collected.sort((a, b) => (num(b.m.volume_fp) ?? 0) - (num(a.m.volume_fp) ?? 0));
      return collected.slice(0, limit).map(({ m, ctx }) => normalizeMarket(m, ctx));
    },

    async getTrendingMarkets(opts: ListOptions = {}): Promise<Market[]> {
      const limit = opts.limit ?? 20;
      const collected = collect(await fetchEvents(200, opts.category));
      collected.sort((a, b) => (num(b.m.volume_24h_fp) ?? 0) - (num(a.m.volume_24h_fp) ?? 0));
      return collected.slice(0, limit).map(({ m, ctx }) => normalizeMarket(m, ctx));
    },
  };
}
