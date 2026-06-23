import type { HTMLAttributes } from 'react';
import { cx } from './internal';

export interface ProbabilityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Probability in the range 0–1. */
  probability: number;
  /** Number of decimal places to show. Defaults to 0. */
  precision?: number;
}

/**
 * Renders a probability (0–1) as a percentage badge, e.g. `72%`. Pure and
 * data-only — pass a `probability` and style it however you like.
 */
export function ProbabilityBadge({
  probability,
  precision = 0,
  className,
  ...rest
}: ProbabilityBadgeProps) {
  const pct = Math.max(0, Math.min(100, probability * 100));
  const value = Number(pct.toFixed(precision));
  const label = `${pct.toFixed(precision)}%`;

  return (
    <span
      className={cx('pk-badge', className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={`Probability ${label}`}
      {...rest}
    >
      {label}
    </span>
  );
}
