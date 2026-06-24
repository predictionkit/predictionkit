# @prediction-kit/charts

> Recharts-based charts for prediction-market data, built on [`@prediction-kit/core`](../core) and [`@prediction-kit/react`](../react).

Part of [PredictionKit](https://github.com/predictionkit/predictionkit).

## Install

```bash
npm install @prediction-kit/charts @prediction-kit/react @prediction-kit/core react react-dom recharts
```

`recharts` is a peer dependency.

## Usage

Pass data directly:

```tsx
import { ProbabilityChart } from '@prediction-kit/charts';

<ProbabilityChart data={history.points} height={260} />;
```

Or fetch by market id (inside a `<PredictionKitProvider>`):

```tsx
import { createClient, polymarket, kalshi } from '@prediction-kit/core';
import { PredictionKitProvider } from '@prediction-kit/react';
import { ProbabilityChart } from '@prediction-kit/charts';

const client = createClient({ providers: [polymarket(), kalshi()] });

<PredictionKitProvider client={client}>
  <ProbabilityChart marketId="kalshi:KXPRESPERSON-28-GNEWS" interval="1m" />
</PredictionKitProvider>;
```

## `<ProbabilityChart>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `PricePoint[]` | — | Render these points directly. |
| `marketId` | `string` | — | Or fetch by namespaced id (needs a provider). |
| `interval` | `'1d' \| '1w' \| '1m' \| '3m' \| 'all'` | `'1w'` | Lookback window when fetching. |
| `height` | `number` | `240` | Chart height in px. |
| `color` | `string` | accent blue | Line/area color. |
| `showGrid` / `showAxes` | `boolean` | `true` | Toggle grid / axes. |
| `className` / `style` | — | — | Container overrides. |

## License

MIT
