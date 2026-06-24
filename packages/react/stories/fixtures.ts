import type { Market, PredictionClient, PricePoint } from '@prediction-kit/core';

/** Deterministic synthetic probability walk, for offline chart stories. */
export function samplePriceHistory(end = 0.62, days = 30): PricePoint[] {
  const points: PricePoint[] = [];
  const now = Date.UTC(2026, 5, 24);
  let p = Math.max(0.02, end - 0.18);
  for (let i = days; i >= 0; i--) {
    // gentle deterministic wobble trending toward `end`
    p += (end - p) * 0.12 + Math.sin(i * 1.3) * 0.015;
    p = Math.min(0.98, Math.max(0.02, p));
    points.push({ t: now - i * 86_400_000, p: Number(p.toFixed(4)) });
  }
  return points;
}

/**
 * Real markets captured from the live Polymarket + Kalshi APIs (June 2026),
 * chosen for far-off resolution dates so the links stay valid. Probabilities
 * and volumes are point-in-time snapshots; the `url`s are the same form the
 * adapters generate (`/event/<event-slug>` for Polymarket,
 * `/markets/<series-ticker>` for Kalshi).
 */
export const sampleMarkets: Market[] = [
  {
    id: 'polymarket:567688',
    source: 'polymarket',
    nativeId: '567688',
    title: 'Netanyahu out by end of 2026?',
    probability: 0.545,
    volume: 1609748.68,
    liquidity: 70654.63,
    status: 'open',
    endDate: '2026-12-31T00:00:00Z',
    url: 'https://polymarket.com/event/netanyahu-out-before-2027',
    outcomes: [
      { label: 'Yes', probability: 0.545 },
      { label: 'No', probability: 0.455 },
    ],
  },
  {
    id: 'kalshi:KXPRESPERSON-28-GNEWS',
    source: 'kalshi',
    nativeId: 'KXPRESPERSON-28-GNEWS',
    title: '2028 U.S. Presidential Election winner? — Gavin Newsom',
    probability: 0.135,
    volume: 3061047.79,
    category: 'Elections',
    status: 'open',
    endDate: '2029-11-07T15:00:00Z',
    url: 'https://kalshi.com/markets/kxpresperson',
    outcomes: [
      { label: 'Yes', probability: 0.135 },
      { label: 'No', probability: 0.865 },
    ],
  },
  {
    id: 'polymarket:898411',
    source: 'polymarket',
    nativeId: '898411',
    title: "Will George Russell be the 2026 F1 Drivers' Champion?",
    probability: 0.145,
    volume: 2236074.94,
    liquidity: 77676.85,
    status: 'open',
    endDate: '2026-12-06T00:00:00Z',
    url: 'https://polymarket.com/event/2026-f1-drivers-champion',
    outcomes: [
      { label: 'Yes', probability: 0.145 },
      { label: 'No', probability: 0.855 },
    ],
  },
  {
    id: 'polymarket:679018',
    source: 'polymarket',
    nativeId: '679018',
    title: 'Will Marine Le Pen win the 2027 French presidential election?',
    probability: 0.065,
    volume: 828698.15,
    liquidity: 128006.13,
    status: 'open',
    endDate: '2027-04-30T00:00:00Z',
    url: 'https://polymarket.com/event/next-french-presidential-election',
    outcomes: [
      { label: 'Yes', probability: 0.065 },
      { label: 'No', probability: 0.935 },
    ],
  },
];

/** An in-memory client implementing the core interface for stories. */
export function mockClient(markets: Market[] = sampleMarkets): PredictionClient {
  return {
    providers: [],
    async getMarket(id: string): Promise<Market> {
      const market = markets.find((m) => m.id === id);
      if (!market) throw new Error(`Market not found: ${id}`);
      return market;
    },
    async getMarkets({ limit } = {}): Promise<Market[]> {
      return typeof limit === 'number' ? markets.slice(0, limit) : markets;
    },
    async getTrendingMarkets({ limit } = {}): Promise<Market[]> {
      return typeof limit === 'number' ? markets.slice(0, limit) : markets;
    },
    async getPriceHistory(id) {
      const market = markets.find((m) => m.id === id);
      const source = market?.source ?? 'polymarket';
      return { marketId: id, source, points: samplePriceHistory(market?.probability ?? 0.5) };
    },
  };
}
