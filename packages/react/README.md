# @prediction-kit/react

> Headless, accessible React components and hooks for prediction-market data — built on [`@prediction-kit/core`](../core).

Components are **unstyled by default** and fully usable without any CSS. An optional minimal theme is
available, and every element keeps a stable `pk-*` class plus `className` passthrough so you can restyle
freely.

## Install

```bash
npm install @prediction-kit/react @prediction-kit/core react react-dom
```

## Usage

Wrap your app in a provider holding a core client, then drop in components:

```tsx
import { createClient, polymarket, kalshi } from '@prediction-kit/core';
import { PredictionKitProvider, TrendingMarkets } from '@prediction-kit/react';
import '@prediction-kit/react/styles.css'; // optional default theme

const client = createClient({ providers: [polymarket(), kalshi()] });

export function App() {
  return (
    <PredictionKitProvider client={client}>
      <TrendingMarkets limit={10} />
    </PredictionKitProvider>
  );
}
```

## Components

### `<ProbabilityBadge>`

Renders a 0–1 probability as a percentage. Pure — no provider needed.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `probability` | `number` | — | Probability in 0–1. |
| `precision` | `number` | `0` | Decimal places. |

```tsx
<ProbabilityBadge probability={0.72} />        // 72%
<ProbabilityBadge probability={0.6234} precision={1} /> // 62.3%
```

### `<MarketCard>`

Title, probability, source, and status. Pass a `market` object **or** a `marketId` to fetch.

| Prop | Type | Description |
| --- | --- | --- |
| `market` | `Market` | A market to render directly. |
| `marketId` | `string` | A namespaced id to fetch (needs a provider). |
| `className` / `style` | — | Style overrides. |

```tsx
<MarketCard market={market} />
<MarketCard marketId="polymarket:253591" />
```

### `<MarketList>`

Renders many markets. Pass `markets` directly or `options` to fetch.

| Prop | Type | Description |
| --- | --- | --- |
| `markets` | `Market[]` | Render these directly. |
| `options` | `ListOptions` | Fetch options when `markets` is omitted. |
| `emptyMessage` | `string` | Shown when empty. |
| `renderItem` | `(m: Market) => ReactNode` | Custom item renderer. |

### `<TrendingMarkets>`

Fetches and renders trending markets across all providers.

| Prop | Type | Description |
| --- | --- | --- |
| `limit` | `number` | Max markets. |
| `category` | `string` | Provider-specific filter. |
| `renderItem` | `(m: Market) => ReactNode` | Custom item renderer. |

## Hooks

`useMarket(id)`, `useMarkets(options?)`, `useTrendingMarkets(options?)` each return
`{ data, loading, error }`. Use them to build custom UI:

```tsx
function MyWidget() {
  const { data, loading, error } = useTrendingMarkets({ limit: 5 });
  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;
  return <MyList markets={data} />;
}
```

## Customization

Override CSS variables (on `:root` or any ancestor), target the `pk-*` classes, or pass `className` /
`renderItem`. Skip `styles.css` entirely to style from scratch.

```css
:root {
  --pk-accent: #7c3aed;
  --pk-radius: 4px;
  --pk-badge-bg: #f5f3ff;
  --pk-badge-fg: #6d28d9;
}
```

## Develop

```bash
pnpm storybook   # explore every component
```

## License

MIT
