import Link from 'next/link';
import { MarketList } from '@prediction-kit/react';
import { Example } from '../components/Example';
import { sampleMarkets } from '../lib/sample';

const quickStart = `import { createClient, polymarket, kalshi } from '@prediction-kit/core';
import { PredictionKitProvider, TrendingMarkets } from '@prediction-kit/react';
import '@prediction-kit/react/styles.css';

const client = createClient({ providers: [polymarket(), kalshi()] });

export function App() {
  return (
    <PredictionKitProvider client={client}>
      <TrendingMarkets limit={10} />
    </PredictionKitProvider>
  );
}`;

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <h1>Prediction-market data for React, normalized.</h1>
        <p className="lead">
          One API and a set of headless components for prediction markets — across Polymarket and
          Kalshi, without caring which one the data came from.
        </p>
        <div className="badges">
          <span className="pill">TypeScript-first</span>
          <span className="pill">Headless &amp; accessible</span>
          <span className="pill">No API keys</span>
          <span className="pill">Polymarket + Kalshi</span>
        </div>
        <div className="row">
          <Link className="cta" href="/getting-started">
            Get started →
          </Link>
          <Link className="cta secondary" href="/demo">
            Live demo
          </Link>
        </div>
      </section>

      <h2>Quick start</h2>
      <pre>
        <code>{quickStart}</code>
      </pre>

      <Example label="Rendered output (sample data)">
        <MarketList markets={sampleMarkets} />
      </Example>

      <h2>Why PredictionKit</h2>
      <div className="features">
        <div className="feature">
          <h3>One normalized model</h3>
          <p>
            Every market is the same <code>Market</code> shape — id, title, probability, volume,
            status — regardless of provider.
          </p>
        </div>
        <div className="feature">
          <h3>Provider-agnostic</h3>
          <p>
            <code>createClient</code> fans out across providers and merges results. Add a provider
            without touching your UI.
          </p>
        </div>
        <div className="feature">
          <h3>Headless components</h3>
          <p>
            Unstyled by default with a stable <code>pk-*</code> class on every element and an
            optional theme. Style it your way.
          </p>
        </div>
        <div className="feature">
          <h3>Read-only, no auth</h3>
          <p>Both providers&rsquo; market-data endpoints are public — ship without credentials.</p>
        </div>
      </div>
    </div>
  );
}
