import type { Metadata } from 'next';
import Link from 'next/link';
import { NavLink } from '../components/NavLink';
import '@prediction-kit/react/styles.css';
import './globals.css';

const SITE_URL = 'https://predictionkit.dev';
const DESCRIPTION =
  'One normalized API and headless React components for prediction-market data from Polymarket and Kalshi. TypeScript-first, accessible, no API keys.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PredictionKit — prediction-market data for React',
    template: '%s · PredictionKit',
  },
  description: DESCRIPTION,
  keywords: [
    'prediction markets',
    'polymarket',
    'kalshi',
    'react',
    'react components',
    'typescript',
    'sdk',
    'polymarket api',
    'kalshi api',
    'betting odds',
    'forecasting',
    'headless ui',
  ],
  authors: [{ name: 'Jack Knoell' }],
  creator: 'Jack Knoell',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'PredictionKit',
    title: 'PredictionKit — prediction-market data for React',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PredictionKit — prediction-market data for React',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const nav = [
  { href: '/', label: 'Home' },
  { href: '/getting-started', label: 'Getting Started' },
  { href: '/components', label: 'Components' },
  { href: '/providers', label: 'Providers' },
  { href: '/demo', label: 'Live Demo' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <aside className="sidebar">
            <Link href="/" className="brand">
              Prediction<span>Kit</span>
            </Link>
            <nav>
              {nav.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
            <div className="spacer" />
            <a className="gh" href="https://github.com/predictionkit/predictionkit">
              GitHub ↗
            </a>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
