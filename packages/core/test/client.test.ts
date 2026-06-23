import { describe, expect, it } from 'vitest';
import { createClient } from '../src/client';
import type { PredictionProvider } from '../src/provider';
import type { Market, ProviderSource } from '../src/types';

function makeMarket(source: ProviderSource, nativeId: string, volume: number): Market {
  return {
    id: `${source}:${nativeId}`,
    source,
    nativeId,
    title: `${source} ${nativeId}`,
    probability: 0.5,
    volume,
    status: 'open',
  };
}

function stubProvider(
  source: ProviderSource,
  markets: Market[],
  overrides: Partial<PredictionProvider> = {},
): PredictionProvider {
  return {
    source,
    async getMarket(nativeId) {
      const market = markets.find((m) => m.nativeId === nativeId);
      if (!market) throw new Error(`not found: ${nativeId}`);
      return market;
    },
    async getMarkets() {
      return markets;
    },
    async getTrendingMarkets() {
      return markets;
    },
    ...overrides,
  };
}

describe('createClient', () => {
  it('throws when constructed with no providers', () => {
    expect(() => createClient({ providers: [] })).toThrow(/at least one provider/);
  });

  it('routes getMarket to the provider named in the id prefix', async () => {
    const client = createClient({
      providers: [
        stubProvider('polymarket', [makeMarket('polymarket', '1', 100)]),
        stubProvider('kalshi', [makeMarket('kalshi', 'ABC', 50)]),
      ],
    });
    const market = await client.getMarket('kalshi:ABC');
    expect(market.source).toBe('kalshi');
    expect(market.nativeId).toBe('ABC');
  });

  it('rejects malformed ids', async () => {
    const client = createClient({ providers: [stubProvider('polymarket', [])] });
    await expect(client.getMarket('no-colon')).rejects.toThrow(/Invalid market id/);
  });

  it('rejects ids for unregistered providers', async () => {
    const client = createClient({ providers: [stubProvider('polymarket', [])] });
    await expect(client.getMarket('kalshi:ABC')).rejects.toThrow(/No provider registered/);
  });

  it('fans out and merges markets sorted by descending volume', async () => {
    const client = createClient({
      providers: [
        stubProvider('polymarket', [makeMarket('polymarket', '1', 100)]),
        stubProvider('kalshi', [makeMarket('kalshi', 'A', 500), makeMarket('kalshi', 'B', 5)]),
      ],
    });
    const markets = await client.getMarkets();
    expect(markets.map((m) => m.volume)).toEqual([500, 100, 5]);
  });

  it('respects the limit across merged providers', async () => {
    const client = createClient({
      providers: [
        stubProvider('polymarket', [makeMarket('polymarket', '1', 100)]),
        stubProvider('kalshi', [makeMarket('kalshi', 'A', 500)]),
      ],
    });
    const markets = await client.getMarkets({ limit: 1 });
    expect(markets).toHaveLength(1);
    expect(markets[0]?.volume).toBe(500);
  });

  it('ignores a failing provider instead of failing the whole call', async () => {
    const failing = stubProvider('kalshi', [], {
      async getMarkets() {
        throw new Error('provider down');
      },
    });
    const client = createClient({
      providers: [stubProvider('polymarket', [makeMarket('polymarket', '1', 100)]), failing],
    });
    const markets = await client.getMarkets();
    expect(markets).toHaveLength(1);
    expect(markets[0]?.source).toBe('polymarket');
  });
});
