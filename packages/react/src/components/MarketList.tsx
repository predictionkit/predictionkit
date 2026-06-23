import type { ReactNode } from 'react';
import type { ListOptions, Market } from '@prediction-kit/core';
import { useMarkets } from '../hooks';
import { cx, StatusMessage } from './internal';
import { MarketCard } from './MarketCard';

export interface MarketListProps {
  /** Markets to render directly. */
  markets?: Market[];
  /** Or fetch options (requires a `<PredictionKitProvider>`). */
  options?: ListOptions;
  className?: string;
  /** Message shown when there are no markets. */
  emptyMessage?: string;
  /** Custom renderer for each market. Defaults to `<MarketCard>`. */
  renderItem?: (market: Market) => ReactNode;
}

/**
 * Renders a list of markets. Pass `markets` to render directly, or `options` to
 * fetch them across all configured providers.
 */
export function MarketList({
  markets,
  options,
  className,
  emptyMessage = 'No markets found.',
  renderItem,
}: MarketListProps) {
  if (markets) {
    return (
      <MarketListView
        markets={markets}
        className={className}
        emptyMessage={emptyMessage}
        renderItem={renderItem}
      />
    );
  }
  return (
    <FetchedMarketList
      options={options}
      className={className}
      emptyMessage={emptyMessage}
      renderItem={renderItem}
    />
  );
}

function FetchedMarketList({
  options,
  className,
  emptyMessage,
  renderItem,
}: Omit<MarketListProps, 'markets'>) {
  const { data, loading, error } = useMarkets(options);
  if (loading) return <StatusMessage kind="loading">Loading markets…</StatusMessage>;
  if (error) return <StatusMessage kind="error">{error.message}</StatusMessage>;
  return (
    <MarketListView
      markets={data ?? []}
      className={className}
      emptyMessage={emptyMessage}
      renderItem={renderItem}
    />
  );
}

function MarketListView({
  markets,
  className,
  emptyMessage = 'No markets found.',
  renderItem,
}: Omit<MarketListProps, 'options'>) {
  if (!markets || markets.length === 0) {
    return <StatusMessage kind="empty">{emptyMessage}</StatusMessage>;
  }
  return (
    <ul className={cx('pk-list', className)}>
      {markets.map((market) => (
        <li key={market.id} className="pk-list__item">
          {renderItem ? renderItem(market) : <MarketCard market={market} />}
        </li>
      ))}
    </ul>
  );
}
