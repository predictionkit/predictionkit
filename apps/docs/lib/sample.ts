import type { Market } from '@prediction-kit/core';

/** Deterministic real-market snapshots used for the static component examples. */
export const sampleMarkets: Market[] = [
  {
    id: 'polymarket:567688',
    source: 'polymarket',
    nativeId: '567688',
    title: 'Netanyahu out by end of 2026?',
    probability: 0.545,
    volume: 1609748.68,
    status: 'open',
    endDate: '2026-12-31T00:00:00Z',
    url: 'https://polymarket.com/event/netanyahu-out-before-2027',
    outcomes: [
      { label: 'Yes', probability: 0.545 },
      { label: 'No', probability: 0.455 },
    ],
  },
  {
    id: 'kalshi:KXPRESPERSON-28-GNEWS',
    source: 'kalshi',
    nativeId: 'KXPRESPERSON-28-GNEWS',
    title: '2028 U.S. Presidential Election winner? — Gavin Newsom',
    probability: 0.135,
    volume: 3061047.79,
    category: 'Elections',
    status: 'open',
    endDate: '2029-11-07T15:00:00Z',
    url: 'https://kalshi.com/markets/kxpresperson',
    outcomes: [
      { label: 'Yes', probability: 0.135 },
      { label: 'No', probability: 0.865 },
    ],
  },
  {
    id: 'polymarket:898411',
    source: 'polymarket',
    nativeId: '898411',
    title: "Will George Russell be the 2026 F1 Drivers' Champion?",
    probability: 0.145,
    volume: 2236074.94,
    status: 'open',
    endDate: '2026-12-06T00:00:00Z',
    url: 'https://polymarket.com/event/2026-f1-drivers-champion',
    outcomes: [
      { label: 'Yes', probability: 0.145 },
      { label: 'No', probability: 0.855 },
    ],
  },
];
