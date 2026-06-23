import type { ReactNode } from 'react';
import type { Market } from '@prediction-kit/core';
import { useTrendingMarkets } from '../hooks';
import { StatusMessage } from './internal';
import { MarketList } from './MarketList';

export interface TrendingMarketsProps {
  /** Maximum number of markets to show. */
  limit?: number;
  /** Provider-specific category filter. */
  category?: string;
  className?: string;
  emptyMessage?: string;
  renderItem?: (market: Market) => ReactNode;
}

/**
 * Fetches and renders trending markets across all configured providers.
 * Requires a `<PredictionKitProvider>` above it.
 */
export function TrendingMarkets({
  limit,
  category,
  className,
  emptyMessage = 'No trending markets right now.',
  renderItem,
}: TrendingMarketsProps) {
  const { data, loading, error } = useTrendingMarkets({ limit, category });
  if (loading) return <StatusMessage kind="loading">Loading trending markets…</StatusMessage>;
  if (error) return <StatusMessage kind="error">{error.message}</StatusMessage>;
  return (
    <MarketList
      markets={data ?? []}
      className={className}
      emptyMessage={emptyMessage}
      renderItem={renderItem}
    />
  );
}
