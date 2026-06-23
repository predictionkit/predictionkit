# @prediction-kit/core

> Provider-agnostic SDK for reading prediction-market data from Polymarket and Kalshi through one normalized model.

Part of [PredictionKit](https://github.com/predictionkit/predictionkit). Zero React dependency — use it
anywhere (Node, edge, browser). All endpoints used here are public; **no API keys required**.

## Install

```bash
npm install @prediction-kit/core
```

## Usage

```ts
import { createClient, polymarket, kalshi } from '@prediction-kit/core';

const client = createClient({
  providers: [polymarket(), kalshi()],
});

// List markets across every provider, highest-volume first
const markets = await client.getMarkets({ limit: 20 });

// Trending markets across every provider
const trending = await client.getTrendingMarkets({ limit: 10 });

// Fetch one market by its namespaced id
const market = await client.getMarket('polymarket:253591');
```

Every result is the same normalized shape regardless of source:

```ts
interface Market {
  id: string;            // "<source>:<nativeId>", e.g. "kalshi:KXHIGHNY-26MAR15-T75"
  source: 'polymarket' | 'kalshi';
  nativeId: string;
  title: string;
  probability: number;   // 0–1 (Yes outcome)
  volume?: number;
  liquidity?: number;
  category?: string;
  status: 'open' | 'closed' | 'resolved';
  endDate?: string;      // ISO 8601
  image?: string;
  url?: string;
  outcomes?: { label: string; probability: number }[];
}
```

## API

### `createClient({ providers })`

Returns a `PredictionClient`:

| Method | Description |
| --- | --- |
| `getMarket(id)` | Fetch one market by namespaced id; routes to the right provider by prefix. |
| `getMarkets(opts?)` | Fan out to all providers in parallel and merge by descending volume. |
| `getTrendingMarkets(opts?)` | Same, for trending markets. |

`opts` is `{ limit?: number; category?: string }`. A failing provider is skipped rather than failing
the whole call.

### Providers

- `polymarket(options?)` — public Gamma API. Handles Polymarket's stringified-JSON-array fields.
- `kalshi(options?)` — public v2 REST API. Discovers markets via the `events` endpoint (clean titles
  and categories, unlike the raw markets listing), uses the post-2026 fixed-point `*_dollars` fields,
  derives Yes probability from the bid/ask midpoint, and sorts client-side (Kalshi has no server sort). Throttled to stay under rate limits.

Both accept `{ baseUrl?, minIntervalMs?, fetchImpl? }`. Pass `fetchImpl` to inject a custom/mocked fetch.

## Custom providers

Implement the `PredictionProvider` interface and pass it to `createClient` — the React components and
hooks will work with it unchanged.

## License

MIT
