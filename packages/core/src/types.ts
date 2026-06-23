/** The prediction-market providers PredictionKit can read from. */
export type ProviderSource = 'polymarket' | 'kalshi';

/**
 * Lifecycle of a market, normalized across providers.
 * - `open`     — currently tradeable
 * - `closed`   — trading has ended but the outcome is not yet final
 * - `resolved` — the outcome is settled/final
 */
export type MarketStatus = 'open' | 'closed' | 'resolved';

/** A single possible outcome of a market with its implied probability (0–1). */
export interface MarketOutcome {
  label: string;
  /** Implied probability in the range 0–1. */
  probability: number;
}

/**
 * A prediction market, normalized so it looks identical regardless of which
 * provider it came from.
 */
export interface Market {
  /** Globally unique id, namespaced as `"<source>:<nativeId>"`. */
  id: string;
  /** Which provider this market came from. */
  source: ProviderSource;
  /** The provider's own id for this market (without the source prefix). */
  nativeId: string;
  /** Human-readable market question/title. */
  title: string;
  /** Implied probability of the "Yes" outcome, in the range 0–1. */
  probability: number;
  /** Total traded volume, if available. */
  volume?: number;
  /** Available liquidity, if available. */
  liquidity?: number;
  /** Provider category/tag, if available. */
  category?: string;
  /** Normalized lifecycle status. */
  status: MarketStatus;
  /** ISO 8601 timestamp for when the market closes/resolves, if available. */
  endDate?: string;
  /** Image/icon URL, if available. */
  image?: string;
  /** Canonical link to the market on the provider's site, if known. */
  url?: string;
  /** All outcomes with their probabilities, if available. */
  outcomes?: MarketOutcome[];
}

/** Options for listing markets. */
export interface ListOptions {
  /** Maximum number of markets to return. */
  limit?: number;
  /**
   * Provider-specific category filter. For Polymarket this is a Gamma `tag_id`;
   * for Kalshi this is a `series_ticker`.
   */
  category?: string;
}
