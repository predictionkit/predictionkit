export { PredictionKitProvider, usePredictionClient } from './context';
export type { PredictionKitProviderProps } from './context';

export {
  useAsync,
  useMarket,
  useMarkets,
  useTrendingMarkets,
  usePriceHistory,
} from './hooks';
export type { AsyncState } from './hooks';

export * from './components';

// Re-export the core types most consumers need so they don't have to import
// from two packages for basic usage.
export type {
  Market,
  MarketOutcome,
  MarketStatus,
  ListOptions,
  PriceInterval,
  PricePoint,
  PriceHistory,
  PriceHistoryOptions,
} from '@prediction-kit/core';
