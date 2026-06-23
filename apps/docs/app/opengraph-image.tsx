import { ImageResponse } from 'next/og';

// Generates og:image AND twitter:image for the site (Next maps both from this file).
export const alt = 'PredictionKit — prediction-market data for React';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b1020 0%, #14213d 55%, #1d4ed8 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 34, color: '#93c5fd', fontWeight: 600 }}>PredictionKit</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>
          Prediction-market data for React, normalized.
        </div>
        <div style={{ fontSize: 32, color: '#cbd5e1', marginTop: 28 }}>
          One API + headless components · Polymarket + Kalshi · TypeScript
        </div>
        <div style={{ fontSize: 26, color: '#93c5fd', marginTop: 'auto' }}>predictionkit.dev</div>
      </div>
    ),
    { ...size },
  );
}
