/**
 * Live smoke test: hits the real public Polymarket + Kalshi APIs through one
 * unified client and prints normalized markets. Run with `pnpm smoke`.
 *
 * Requires the core package to be built first (`pnpm --filter @prediction-kit/core build`).
 */
import { createClient, kalshi, polymarket } from '@prediction-kit/core';

function fmtVolume(volume: number | undefined): string {
  return Math.round(volume ?? 0).toLocaleString('en-US');
}

async function main(): Promise<void> {
  const client = createClient({ providers: [polymarket(), kalshi()] });

  console.log('→ Trending markets across Polymarket + Kalshi:\n');
  const trending = await client.getTrendingMarkets({ limit: 10 });
  for (const m of trending) {
    const pct = `${(m.probability * 100).toFixed(0)}%`.padStart(4);
    console.log(`  [${m.source.padEnd(10)}] ${pct}  vol ${fmtVolume(m.volume).padStart(12)}  ${m.title}`);
  }

  const first = trending[0];
  if (first) {
    console.log(`\n→ Re-fetching "${first.id}" by id…`);
    const one = await client.getMarket(first.id);
    console.log(`  ${one.source}: ${one.title} — ${(one.probability * 100).toFixed(1)}%`);
  }

  console.log(`\n✓ Smoke test OK — ${trending.length} markets normalized through one interface.`);
}

main().catch((err) => {
  console.error('\n✗ Smoke test failed:', err);
  process.exit(1);
});
