import type { Market, PredictionClient } from '@prediction-kit/core';

/** Deterministic sample markets so stories render offline. */
export const sampleMarkets: Market[] = [
  {
    id: 'polymarket:253591',
    source: 'polymarket',
    nativeId: '253591',
    title: 'Will BTC close above $100k on Dec 31, 2026?',
    probability: 0.62,
    volume: 4821342.55,
    liquidity: 382144.7,
    status: 'open',
    endDate: '2026-12-31T12:00:00Z',
    url: 'https://polymarket.com/event/will-btc-close-above-100k',
    outcomes: [
      { label: 'Yes', probability: 0.62 },
      { label: 'No', probability: 0.38 },
    ],
  },
  {
    id: 'kalshi:KXHIGHNY-26MAR15-T75',
    source: 'kalshi',
    nativeId: 'KXHIGHNY-26MAR15-T75',
    title: 'NYC high temperature 75°F or above on Mar 15?',
    probability: 0.565,
    volume: 12500,
    status: 'open',
    endDate: '2026-03-15T23:59:00Z',
    url: 'https://kalshi.com/markets/KXHIGHNY-26MAR15-T75',
    outcomes: [
      { label: 'Yes', probability: 0.565 },
      { label: 'No', probability: 0.435 },
    ],
  },
  {
    id: 'polymarket:998877',
    source: 'polymarket',
    nativeId: '998877',
    title: 'Will a new AI model top the leaderboard this quarter?',
    probability: 0.41,
    volume: 982344.1,
    status: 'closed',
    url: 'https://polymarket.com/event/ai-leaderboard',
    outcomes: [
      { label: 'Yes', probability: 0.41 },
      { label: 'No', probability: 0.59 },
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
  };
}
