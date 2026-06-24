# @prediction-kit/core

## 0.2.0

### Minor Changes

- Add historical price data. `getPriceHistory(id, { interval })` is now available on the client and the provider interface, with `PriceHistory`, `PricePoint`, and `PriceInterval` types. Polymarket reads the CLOB prices-history endpoint (keyed by the Yes token id); Kalshi reads candlesticks under the derived series.

## 0.1.1

### Patch Changes

- Broaden npm keywords and refresh README/package metadata for discoverability. No runtime or API changes.

## 0.1.0

### Minor Changes

- Initial public release. `@prediction-kit/core` provides a provider-agnostic SDK for prediction-market data with Polymarket and Kalshi adapters behind one normalized model.
