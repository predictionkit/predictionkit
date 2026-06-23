import type { CSSProperties } from 'react';
import type { Market } from '@prediction-kit/core';
import { useMarket } from '../hooks';
import { cx, StatusMessage } from './internal';
import { ProbabilityBadge } from './ProbabilityBadge';

export interface MarketCardProps {
  /** A market to render directly. */
  market?: Market;
  /** Or a namespaced id to fetch (requires a `<PredictionKitProvider>`). */
  marketId?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Displays a market's title, probability, source, and status. Pass either a
 * `market` object or a `marketId` to fetch.
 */
export function MarketCard({ market, marketId, className, style }: MarketCardProps) {
  if (market) {
    return <MarketCardView market={market} className={className} style={style} />;
  }
  if (marketId) {
    return <FetchedMarketCard id={marketId} className={className} style={style} />;
  }
  throw new Error('MarketCard requires either a `market` or a `marketId` prop.');
}

function FetchedMarketCard({
  id,
  className,
  style,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { data, loading, error } = useMarket(id);
  if (loading) return <StatusMessage kind="loading">Loading market…</StatusMessage>;
  if (error) return <StatusMessage kind="error">{error.message}</StatusMessage>;
  if (!data) return <StatusMessage kind="empty">Market not found.</StatusMessage>;
  return <MarketCardView market={data} className={className} style={style} />;
}

function MarketCardView({
  market,
  className,
  style,
}: {
  market: Market;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <article className={cx('pk-card', className)} style={style}>
      {market.image ? (
        <img className="pk-card__image" src={market.image} alt="" loading="lazy" />
      ) : null}
      <div className="pk-card__body">
        <h3 className="pk-card__title">
          {market.url ? (
            <a href={market.url} target="_blank" rel="noreferrer">
              {market.title}
            </a>
          ) : (
            market.title
          )}
        </h3>
        <div className="pk-card__meta">
          <ProbabilityBadge probability={market.probability} />
          <span className="pk-card__source" data-source={market.source}>
            {market.source}
          </span>
          <span className={cx('pk-card__status', `pk-card__status--${market.status}`)}>
            {market.status}
          </span>
        </div>
      </div>
    </article>
  );
}
