# PredictionKit

> One normalized API and a set of React components for prediction-market data — regardless of provider.

PredictionKit lets you drop prediction-market data from **Polymarket** and **Kalshi** into a React app
through a single, provider-agnostic interface. Read a market from either source and you get the same
normalized shape; render it with headless, accessible components you can style however you like.

```tsx
import { createClient, polymarket, kalshi } from '@prediction-kit/core';
import { PredictionKitProvider, TrendingMarkets } from '@prediction-kit/react';

const client = createClient({ providers: [polymarket(), kalshi()] });

export function App() {
  return (
    <PredictionKitProvider client={client}>
      <TrendingMarkets limit={10} />
    </PredictionKitProvider>
  );
}
```

## Packages

| Package | Description |
| --- | --- |
| [`@prediction-kit/core`](./packages/core) | Provider-agnostic SDK: normalized data model + Polymarket & Kalshi adapters. Zero React dependency. |
| [`@prediction-kit/react`](./packages/react) | Headless React components and hooks built on the core client. |

## Why

Every prediction-market provider has its own API shape, auth model, and quirks (Polymarket returns
stringified JSON arrays; Kalshi uses a series→events→markets hierarchy with string `*_dollars` prices).
PredictionKit hides all of that behind one `Market` type and three methods — `getMarket`,
`getMarkets`, `getTrendingMarkets` — so you never need to know where the data came from.

## Development

This is a [Turborepo](https://turbo.build/) monorepo managed with [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run unit tests
pnpm typecheck
pnpm lint
pnpm smoke        # hit the real public APIs and print normalized markets
pnpm storybook    # explore the React components
```

## Status

Early v1: read-only data, Polymarket + Kalshi adapters, core + React packages. Charts, a docs site,
and npm publishing are on the roadmap.

## License

MIT
