import { describe, expect, it } from 'vitest';
import { polymarket } from '../src/providers/polymarket';
import { mockFetch } from './helpers';

const market = {
  id: '253591',
  question: 'Will BTC close above $100k on Dec 31, 2026?',
  slug: 'will-btc-close-above-100k',
  outcomes: '["Yes", "No"]',
  outcomePrices: '["0.62", "0.38"]',
  volumeNum: 4821342.55,
  volume24hr: 215403.12,
  liquidityNum: 382144.7,
  active: true,
  closed: false,
  endDate: '2026-12-31T12:00:00Z',
  image: 'https://example.com/btc.png',
  events: [{ slug: 'what-price-will-btc-hit', title: 'BTC price' }],
};

describe('polymarket adapter', () => {
  it('normalizes a single market and parses stringified array fields', async () => {
    const provider = polymarket({ fetchImpl: mockFetch([['/markets/253591', market]]) });
    const result = await provider.getMarket('253591');

    expect(result).toMatchObject({
      id: 'polymarket:253591',
      source: 'polymarket',
      nativeId: '253591',
      title: market.question,
      probability: 0.62,
      volume: 4821342.55,
      liquidity: 382144.7,
      status: 'open',
      endDate: '2026-12-31T12:00:00Z',
    });
    expect(result.url).toBe('https://polymarket.com/event/what-price-will-btc-hit');
    expect(result.outcomes).toEqual([
      { label: 'Yes', probability: 0.62 },
      { label: 'No', probability: 0.38 },
    ]);
  });

  it('lists markets', async () => {
    const provider = polymarket({ fetchImpl: mockFetch([['/markets', [market]]]) });
    const markets = await provider.getMarkets({ limit: 5 });
    expect(markets).toHaveLength(1);
    expect(markets[0]?.probability).toBe(0.62);
  });

  it('flattens trending events into markets', async () => {
    const events = [{ id: 'e1', title: 'BTC', slug: 'btc', markets: [market] }];
    const provider = polymarket({ fetchImpl: mockFetch([['/events', events]]) });
    const markets = await provider.getTrendingMarkets({ limit: 5 });
    expect(markets).toHaveLength(1);
    expect(markets[0]?.id).toBe('polymarket:253591');
  });

  it('maps closed markets to resolved', async () => {
    const closed = { ...market, active: false, closed: true };
    const provider = polymarket({ fetchImpl: mockFetch([['/markets/253591', closed]]) });
    const result = await provider.getMarket('253591');
    expect(result.status).toBe('resolved');
  });

  it('fetches price history via the CLOB token id and normalizes to ms', async () => {
    const withTokens = { ...market, clobTokenIds: '["yes-token-123", "no-token-456"]' };
    const provider = polymarket({
      fetchImpl: mockFetch([
        // market lookup (to resolve the Yes token), then CLOB history
        ['/markets/253591', withTokens],
        ['/prices-history', { history: [{ t: 1700000000, p: 0.6 }, { t: 1700003600, p: 0.65 }] }],
      ]),
    });
    const history = await provider.getPriceHistory('253591', { interval: '1w' });
    expect(history.marketId).toBe('polymarket:253591');
    expect(history.source).toBe('polymarket');
    expect(history.points).toEqual([
      { t: 1700000000000, p: 0.6 },
      { t: 1700003600000, p: 0.65 },
    ]);
  });

  it('returns empty history when the market has no CLOB token', async () => {
    const provider = polymarket({ fetchImpl: mockFetch([['/markets/253591', market]]) });
    const history = await provider.getPriceHistory('253591');
    expect(history.points).toEqual([]);
  });
});
