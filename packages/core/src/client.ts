import type { PredictionProvider } from './provider';
import type { ListOptions, Market, ProviderSource } from './types';

export interface ClientOptions {
  /** One adapter per provider you want to read from. */
  providers: PredictionProvider[];
}

/**
 * A unified, provider-agnostic client. Reads route to the right provider by id
 * prefix; list/trending calls fan out to every provider in parallel and merge
 * the results by descending volume.
 */
export interface PredictionClient {
  /** The registered provider adapters. */
  readonly providers: readonly PredictionProvider[];
  /** Fetch a single market by its namespaced id, e.g. `"polymarket:253591"`. */
  getMarket(id: string): Promise<Market>;
  /** List markets across all providers, highest-volume first. */
  getMarkets(opts?: ListOptions): Promise<Market[]>;
  /** List trending markets across all providers, highest-volume first. */
  getTrendingMarkets(opts?: ListOptions): Promise<Market[]>;
}

function parseId(id: string): { source: ProviderSource; nativeId: string } {
  const idx = id.indexOf(':');
  if (idx <= 0) {
    throw new Error(`Invalid market id "${id}". Expected the form "<source>:<nativeId>".`);
  }
  return { source: id.slice(0, idx) as ProviderSource, nativeId: id.slice(idx + 1) };
}

function mergeByVolume(markets: Market[]): Market[] {
  return [...markets].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
}

export function createClient({ providers }: ClientOptions): PredictionClient {
  if (providers.length === 0) {
    throw new Error('createClient requires at least one provider.');
  }
  const bySource = new Map<ProviderSource, PredictionProvider>(
    providers.map((p) => [p.source, p]),
  );

  /** Run a per-provider call across all providers, ignoring individual failures. */
  async function fanOut(
    call: (provider: PredictionProvider) => Promise<Market[]>,
    limit?: number,
  ): Promise<Market[]> {
    const settled = await Promise.allSettled(providers.map(call));
    const markets: Market[] = [];
    for (const result of settled) {
      if (result.status === 'fulfilled') markets.push(...result.value);
    }
    const merged = mergeByVolume(markets);
    return typeof limit === 'number' ? merged.slice(0, limit) : merged;
  }

  return {
    providers,

    async getMarket(id: string): Promise<Market> {
      const { source, nativeId } = parseId(id);
      const provider = bySource.get(source);
      if (!provider) {
        throw new Error(`No provider registered for source "${source}".`);
      }
      return provider.getMarket(nativeId);
    },

    getMarkets(opts: ListOptions = {}): Promise<Market[]> {
      return fanOut((p) => p.getMarkets(opts), opts.limit);
    },

    getTrendingMarkets(opts: ListOptions = {}): Promise<Market[]> {
      return fanOut((p) => p.getTrendingMarkets(opts), opts.limit);
    },
  };
}
