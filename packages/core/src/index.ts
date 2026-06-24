export type {
  Market,
  MarketOutcome,
  MarketStatus,
  ProviderSource,
  ListOptions,
  PriceInterval,
  PricePoint,
  PriceHistory,
  PriceHistoryOptions,
} from './types';
export type { PredictionProvider } from './provider';
export type { PredictionClient, ClientOptions } from './client';
export { createClient } from './client';

export { polymarket } from './providers/polymarket';
export type { PolymarketOptions } from './providers/polymarket';
export { kalshi } from './providers/kalshi';
export type { KalshiOptions } from './providers/kalshi';

export { HttpClient, HttpError } from './util/http';
export type { HttpClientOptions, QueryParams } from './util/http';
export { clamp01, num } from './util/normalize';
