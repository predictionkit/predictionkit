import type { PriceInterval } from '../types';

/**
 * Maps a normalized {@link PriceInterval} to provider-specific query params:
 * - `seconds` — Kalshi lookback window (`end_ts - seconds`)
 * - `kalshiPeriod` — Kalshi candlestick `period_interval` (must be 1, 60, or 1440)
 * - `polyInterval` — Polymarket CLOB named window (it rejects long `startTs/endTs` ranges)
 * - `polyFidelity` — Polymarket CLOB resolution, in minutes
 */
export const INTERVALS: Record<
  PriceInterval,
  {
    seconds: number;
    kalshiPeriod: 1 | 60 | 1440;
    polyInterval: '1d' | '1w' | '1m' | 'max';
    polyFidelity: number;
  }
> = {
  '1d': { seconds: 86_400, kalshiPeriod: 60, polyInterval: '1d', polyFidelity: 15 },
  '1w': { seconds: 604_800, kalshiPeriod: 60, polyInterval: '1w', polyFidelity: 60 },
  '1m': { seconds: 2_592_000, kalshiPeriod: 1440, polyInterval: '1m', polyFidelity: 240 },
  '3m': { seconds: 7_776_000, kalshiPeriod: 1440, polyInterval: 'max', polyFidelity: 720 },
  all: { seconds: 31_536_000, kalshiPeriod: 1440, polyInterval: 'max', polyFidelity: 1440 },
};

export const DEFAULT_INTERVAL: PriceInterval = '1w';
