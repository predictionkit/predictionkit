import { describe, expect, it } from 'vitest';
import { kalshi } from '../src/providers/kalshi';
import { mockFetch } from './helpers';

const market = {
  ticker: 'KXHIGHNY-26MAR15-T75',
  event_ticker: 'KXHIGHNY-26MAR15',
  yes_sub_title: '75°F or above',
  status: 'active',
  yes_bid_dollars: '0.5500',
  yes_ask_dollars: '0.5800',
  last_price_dollars: '0.5600',
  volume_fp: '12500.00',
  volume_24h_fp: '3200.00',
  liquidity_dollars: '45000.00',
  close_time: '2026-03-15T23:59:00Z',
};

// No throttle in tests, so the adapter resolves immediately.
const opts = { minIntervalMs: 0 };

describe('kalshi adapter', () => {
  it('normalizes a market and derives probability from the bid/ask midpoint', async () => {
    const provider = kalshi({
      ...opts,
      fetchImpl: mockFetch([['/markets/KXHIGHNY', { market }]]),
    });
    const result = await provider.getMarket('KXHIGHNY-26MAR15-T75');

    expect(result).toMatchObject({
      id: 'kalshi:KXHIGHNY-26MAR15-T75',
      source: 'kalshi',
      title: '75°F or above',
      probability: 0.565, // (0.55 + 0.58) / 2
      volume: 12500,
      liquidity: 45000,
      status: 'open',
      endDate: '2026-03-15T23:59:00Z',
    });
    expect(result.outcomes?.[0]?.label).toBe('Yes');
    expect(result.outcomes?.[0]?.probability).toBeCloseTo(0.565, 6);
    expect(result.outcomes?.[1]?.label).toBe('No');
    expect(result.outcomes?.[1]?.probability).toBeCloseTo(0.435, 6);
  });

  it('lists markets from events and composes the title from event + sub-title', async () => {
    const events = {
      events: [
        {
          event_ticker: 'KXHIGHNY-26MAR15',
          title: 'NYC high temperature on Mar 15',
          category: 'Climate',
          markets: [market],
        },
      ],
    };
    const provider = kalshi({ ...opts, fetchImpl: mockFetch([['/events', events]]) });
    const markets = await provider.getMarkets();
    expect(markets).toHaveLength(1);
    expect(markets[0]?.source).toBe('kalshi');
    expect(markets[0]?.title).toBe('NYC high temperature on Mar 15 — 75°F or above');
    expect(markets[0]?.category).toBe('Climate');
    expect(markets[0]?.url).toBe('https://kalshi.com/markets/kxhighny');
  });

  it('sorts trending markets by 24h volume client-side', async () => {
    const low = { ...market, ticker: 'LOW', volume_24h_fp: '10.0' };
    const high = { ...market, ticker: 'HIGH', volume_24h_fp: '9999.0' };
    const events = {
      events: [{ event_ticker: 'E1', title: 'Weather', markets: [low, high] }],
    };
    const provider = kalshi({ ...opts, fetchImpl: mockFetch([['/events', events]]) });
    const markets = await provider.getTrendingMarkets({ limit: 5 });
    expect(markets.map((m) => m.nativeId)).toEqual(['HIGH', 'LOW']);
  });

  it('maps settled markets to resolved', async () => {
    const settled = { ...market, status: 'settled' };
    const provider = kalshi({ ...opts, fetchImpl: mockFetch([['/markets/KX', { market: settled }]]) });
    const result = await provider.getMarket('KX');
    expect(result.status).toBe('resolved');
  });
});
