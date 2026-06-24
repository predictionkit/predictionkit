import type { Metadata } from 'next';
import { MarketCard, MarketList, ProbabilityBadge } from '@prediction-kit/react';
import { ProbabilityChart } from '@prediction-kit/charts';
import { Example } from '../../components/Example';
import { sampleMarkets, samplePriceHistory } from '../../lib/sample';

export const metadata: Metadata = { title: 'Components — PredictionKit' };

export default function ComponentsPage() {
  return (
    <div>
      <h1>Components</h1>
      <p className="lead">
        Headless and accessible. Pass data directly (shown here) or let them fetch via a{' '}
        <code>&lt;PredictionKitProvider&gt;</code>.
      </p>

      <h2>ProbabilityBadge</h2>
      <p>Renders a 0–1 probability as a percentage. Pure — no provider needed.</p>
      <pre>
        <code>{`<ProbabilityBadge probability={0.72} />`}</code>
      </pre>
      <Example label="ProbabilityBadge">
        <div className="row">
          {[0.05, 0.25, 0.5, 0.72, 0.95].map((p) => (
            <ProbabilityBadge key={p} probability={p} />
          ))}
        </div>
      </Example>

      <h2>MarketCard</h2>
      <p>
        Title, probability, source, and status. Pass a <code>market</code> object or a{' '}
        <code>marketId</code> to fetch.
      </p>
      <pre>
        <code>{`<MarketCard market={market} />`}</code>
      </pre>
      <Example label="MarketCard">
        <MarketCard market={sampleMarkets[0]} />
      </Example>

      <h2>MarketList</h2>
      <p>Renders many markets. Pass an array or fetch options.</p>
      <pre>
        <code>{`<MarketList markets={markets} />`}</code>
      </pre>
      <Example label="MarketList">
        <MarketList markets={sampleMarkets} />
      </Example>

      <h2>TrendingMarkets</h2>
      <p>
        Fetches trending markets across all providers (requires a provider). See it running on the{' '}
        <a href="/demo">live demo</a>.
      </p>
      <pre>
        <code>{`<TrendingMarkets limit={10} />`}</code>
      </pre>

      <h2>ProbabilityChart</h2>
      <p>
        From <code>@prediction-kit/charts</code> — an area chart of a market&rsquo;s probability over
        time (Recharts). Pass <code>data</code> or a <code>marketId</code> + <code>interval</code> to
        fetch. See a live one on the <a href="/demo">demo</a>.
      </p>
      <pre>
        <code>{`<ProbabilityChart marketId="kalshi:KXPRESPERSON-28-GNEWS" interval="1m" />`}</code>
      </pre>
      <Example label="ProbabilityChart (sample data)">
        <ProbabilityChart data={samplePriceHistory(0.62)} height={240} />
      </Example>
    </div>
  );
}
