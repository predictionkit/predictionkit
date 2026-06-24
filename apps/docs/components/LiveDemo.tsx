'use client';

import { useMemo, useState } from 'react';
import { createClient, kalshi, polymarket } from '@prediction-kit/core';
import { MarketList, PredictionKitProvider, useTrendingMarkets } from '@prediction-kit/react';
import { ProbabilityChart } from '@prediction-kit/charts';

/**
 * Interactive demo that runs entirely in the browser. Adapters are pointed at
 * this site's same-origin proxy routes so they work despite the providers' CORS
 * policies. Dogfoods the full stack: provider → client → hooks → components →
 * charts (including historical prices via the CLOB / candlesticks proxies).
 */
export function LiveDemo() {
  const client = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return createClient({
      providers: [
        polymarket({
          baseUrl: `${origin}/api/polymarket`,
          clobBaseUrl: `${origin}/api/polymarket-clob`,
        }),
        kalshi({ baseUrl: `${origin}/api/kalshi` }),
      ],
    });
  }, []);

  const [limit, setLimit] = useState(10);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <PredictionKitProvider client={client}>
      <div className="controls">
        <label>
          Show
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          markets
        </label>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
          ↻ Refresh
        </button>
      </div>
      <DemoBody key={reloadKey} limit={limit} />
    </PredictionKitProvider>
  );
}

function DemoBody({ limit }: { limit: number }) {
  const { data, loading, error } = useTrendingMarkets({ limit });
  const top = data?.[0];

  return (
    <div>
      {top && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ margin: '0 0 2px', fontSize: '1rem' }}>{top.title}</h3>
          <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '0.85rem' }}>
            {top.source} · probability over the last 3 months
          </p>
          <ProbabilityChart marketId={top.id} interval="3m" height={220} />
        </div>
      )}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading markets…</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error.message}</p>
      ) : (
        <MarketList markets={data ?? []} />
      )}
    </div>
  );
}
