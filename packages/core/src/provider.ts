import type {
  ListOptions,
  Market,
  PriceHistory,
  PriceHistoryOptions,
  ProviderSource,
} from './types';

/**
 * A read-only adapter for a single prediction-market provider. Each adapter is
 * responsible for fetching from its provider's API and returning data in the
 * normalized {@link Market} shape, hiding all provider-specific complexity.
 */
export interface PredictionProvider {
  /** The provider this adapter reads from. */
  readonly source: ProviderSource;
  /** Fetch a single market by the provider's native id. */
  getMarket(nativeId: string): Promise<Market>;
  /** List markets, most relevant/highest-volume first. */
  getMarkets(opts?: ListOptions): Promise<Market[]>;
  /** List currently trending markets (typically by recent volume). */
  getTrendingMarkets(opts?: ListOptions): Promise<Market[]>;
  /** Fetch the Yes-probability time series for a market. */
  getPriceHistory(nativeId: string, opts?: PriceHistoryOptions): Promise<PriceHistory>;
}
