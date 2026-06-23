import type { Metadata } from 'next';
import { LiveDemo } from '../../components/LiveDemo';

export const metadata: Metadata = { title: 'Live Demo — PredictionKit' };

export default function DemoPage() {
  return (
    <div>
      <h1>Live demo</h1>
      <p className="lead">
        Real, live markets fetched in your browser from Polymarket and Kalshi through one client and
        rendered with <code>&lt;TrendingMarkets&gt;</code>.
      </p>
      <p>
        This page runs the actual published packages. Requests are routed through this site&rsquo;s
        proxy so they work despite the providers&rsquo; CORS policies — otherwise it&rsquo;s the same
        code you&rsquo;d write in your app.
      </p>
      <LiveDemo />
    </div>
  );
}
