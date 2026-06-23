import type { ListOptions, Market } from '@prediction-kit/core';
import { usePredictionClient } from '../context';
import { useAsync } from './useAsync';
import type { AsyncState } from './useAsync';

export type { AsyncState } from './useAsync';
export { useAsync } from './useAsync';

/** Fetch a single market by its namespaced id (e.g. `"polymarket:253591"`). */
export function useMarket(id: string): AsyncState<Market> {
  const client = usePredictionClient();
  return useAsync(() => client.getMarket(id), [client, id]);
}

/** Fetch a list of markets across all configured providers. */
export function useMarkets(options: ListOptions = {}): AsyncState<Market[]> {
  const client = usePredictionClient();
  return useAsync(() => client.getMarkets(options), [client, options.limit, options.category]);
}

/** Fetch trending markets across all configured providers. */
export function useTrendingMarkets(options: ListOptions = {}): AsyncState<Market[]> {
  const client = usePredictionClient();
  return useAsync(
    () => client.getTrendingMarkets(options),
    [client, options.limit, options.category],
  );
}
