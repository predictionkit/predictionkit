import type { Metadata } from 'next';
import Link from 'next/link';
import { NavLink } from '../components/NavLink';
import '@prediction-kit/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'PredictionKit — prediction-market data for React',
  description:
    'One normalized API and headless React components for prediction-market data from Polymarket and Kalshi.',
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
