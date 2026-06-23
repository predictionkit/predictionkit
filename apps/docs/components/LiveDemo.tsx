'use client';

import { useMemo, useState } from 'react';
import { createClient, kalshi, polymarket } from '@prediction-kit/core';
import { PredictionKitProvider, TrendingMarkets } from '@prediction-kit/react';

/**
 * Interactive demo that runs entirely in the browser. The adapters are pointed
 * at this site's same-origin proxy routes (`/api/polymarket`, `/api/kalshi`) so
 * they work despite the providers' CORS policies. This dogfoods the full stack:
 * provider → client → context → hooks → components.
 */
export function LiveDemo() {
  const client = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return createClient({
      providers: [
        polymarket({ baseUrl: `${origin}/api/polymarket` }),
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
      <TrendingMarkets key={reloadKey} limit={limit} />
    </PredictionKitProvider>
  );
}
