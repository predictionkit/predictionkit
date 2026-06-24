import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { PriceInterval, PricePoint } from '@prediction-kit/core';
import { usePriceHistory } from '@prediction-kit/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ProbabilityChartProps {
  /** Render these points directly. */
  data?: PricePoint[];
  /** Or fetch by namespaced market id (requires a `<PredictionKitProvider>`). */
  marketId?: string;
  /** Lookback window when fetching. Defaults to `1w`. */
  interval?: PriceInterval;
  /** Chart height in px. Defaults to 240. */
  height?: number;
  /** Line/area color. Defaults to the accent blue. */
  color?: string;
  showGrid?: boolean;
  showAxes?: boolean;
  className?: string;
  style?: CSSProperties;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const fmtDateTime = (t: number) =>
  new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric' });

/**
 * An area chart of a market's Yes probability over time. Pass `data` directly,
 * or a `marketId` to fetch via the PredictionKit client.
 */
export function ProbabilityChart(props: ProbabilityChartProps) {
  if (props.data) return <ChartView points={props.data} {...props} />;
  if (props.marketId) return <FetchedChart {...props} marketId={props.marketId} />;
  throw new Error('ProbabilityChart requires either a `data` or a `marketId` prop.');
}

function FetchedChart(props: ProbabilityChartProps & { marketId: string }) {
  const { data, loading, error } = usePriceHistory(props.marketId, { interval: props.interval });
  if (loading) return <Placeholder height={props.height}>Loading chart…</Placeholder>;
  if (error)
    return (
      <Placeholder height={props.height} error>
        {error.message}
      </Placeholder>
    );
  if (!data || data.points.length === 0)
    return <Placeholder height={props.height}>No price history available.</Placeholder>;
  return <ChartView points={data.points} {...props} />;
}

function ChartView({
  points,
  height = 240,
  color = '#2563eb',
  showGrid = true,
  showAxes = true,
  className,
  style,
}: ProbabilityChartProps & { points: PricePoint[] }) {
  const chartData = useMemo(
    () => points.map((pt) => ({ t: pt.t, pct: Number((pt.p * 100).toFixed(2)) })),
    [points],
  );

  return (
    <div className={cx('pk-chart', className)} style={style}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="pkProbabilityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          )}
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={fmtDate}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            minTickGap={40}
            hide={!showAxes}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={40}
            hide={!showAxes}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Probability']}
            labelFormatter={(label) => fmtDateTime(Number(label))}
          />
          <Area
            type="monotone"
            dataKey="pct"
            stroke={color}
            strokeWidth={2}
            fill="url(#pkProbabilityFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Placeholder({
  height = 240,
  error,
  children,
}: {
  height?: number;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cx('pk-chart', 'pk-chart--placeholder', error && 'pk-chart--error')}
      role={error ? 'alert' : 'status'}
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: error ? '#dc2626' : '#6b7280',
        fontSize: 14,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
