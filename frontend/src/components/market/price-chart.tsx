import React, { useId, useMemo, useRef, useState } from "react";

export interface ChartPoint {
  t: number;
  v: number;
  vol?: number;
}

export interface PriceChartProps {
  points: ChartPoint[];
  /** Formats values on the axis and readout. */
  formatValue: (v: number) => string;
  formatTime: (t: number) => string;
  /** Shown above the chart when the pointer is not on it. */
  height?: number;
  showVolume?: boolean;
  ariaLabel: string;
}

const W = 1000;

/**
 * Responsive SVG area chart with a pointer readout. Drawn with plain SVG so it adds
 * no dependency. It plots whatever points it is given and knows nothing about tokens,
 * so Presales, Staking and Exchange can reuse it.
 */
export function PriceChart({ points, formatValue, formatTime, height = 280, showVolume = true, ariaLabel }: PriceChartProps) {
  const gradId = useId().replace(/:/g, "");
  const box = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const vs = points.map((p) => p.v);
    const lo = Math.min(...vs);
    const hi = Math.max(...vs);
    const pad = (hi - lo || hi * 0.02 || 1) * 0.12;
    const min = lo - pad;
    const max = hi + pad;
    const x = (i: number) => (i / Math.max(1, points.length - 1)) * W;
    const y = (v: number) => height - ((v - min) / (max - min)) * height;
    const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
    const maxVol = Math.max(1, ...points.map((p) => p.vol ?? 0));
    return { min, max, lo, hi, x, y, line, maxVol };
  }, [points, height]);

  if (points.length < 2) return null;
  const first = points[0];
  const last = points[points.length - 1];
  const up = last.v >= first.v;
  const active = hover ?? points.length - 1;
  const cur = points[active];

  const onMove = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(ratio * (points.length - 1)));
  };

  const ticks = [geo.hi, (geo.hi + geo.lo) / 2, geo.lo];

  return (
    <figure className={`mx-chart ${up ? "is-up" : "is-down"}`} aria-label={ariaLabel}>
      <figcaption className="mx-chart__readout" aria-live="off">
        <b>{formatValue(cur.v)}</b>
        <span>{formatTime(cur.t)}</span>
      </figcaption>
      <div
        className="mx-chart__plot"
        ref={box}
        style={{ height }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onPointerDown={onMove}
      >
        <ul className="mx-chart__axis" aria-hidden="true">
          {ticks.map((t, i) => (
            <li key={i}>{formatValue(t)}</li>
          ))}
        </ul>
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className="mx-chart__stop" stopOpacity="0.22" />
              <stop offset="1" className="mx-chart__stop" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} className="mx-chart__grid" x1="0" x2={W} y1={height * f} y2={height * f} vectorEffect="non-scaling-stroke" />
          ))}
          <polygon points={`0,${height} ${geo.line} ${W},${height}`} fill={`url(#${gradId})`} />
          <polyline className="mx-chart__line" points={geo.line} fill="none" vectorEffect="non-scaling-stroke" />
          {hover != null && (
            <line className="mx-chart__cursor" x1={geo.x(active)} x2={geo.x(active)} y1="0" y2={height} vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        {hover != null && (
          <span
            className="mx-chart__dot"
            style={{ left: `${(active / (points.length - 1)) * 100}%`, top: `${(geo.y(cur.v) / height) * 100}%` }}
          />
        )}
      </div>
      {showVolume && (
        <svg className="mx-chart__volume" viewBox={`0 0 ${W} 48`} preserveAspectRatio="none" aria-hidden="true">
          {points.map((p, i) => {
            const bw = W / points.length;
            const h = ((p.vol ?? 0) / geo.maxVol) * 44;
            return <rect key={i} x={i * bw + bw * 0.15} width={bw * 0.7} y={48 - h} height={h} data-active={i === active} />;
          })}
        </svg>
      )}
    </figure>
  );
}
