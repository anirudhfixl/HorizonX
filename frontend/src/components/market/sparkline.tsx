import React from "react";

export interface SparklineProps {
  values: number[];
  /** Colours the line with the gain or loss colour. */
  up?: boolean;
  fill?: boolean;
  className?: string;
}

export function Sparkline({ values, up = true, fill = false, className }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(2)},${(28 - ((v - min) / span) * 26).toFixed(2)}`);
  const line = pts.join(" ");
  return (
    <svg
      className={`mx-spark ${up ? "is-up" : "is-down"} ${className ?? ""}`}
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {fill && <polygon className="mx-spark__fill" points={`0,30 ${line} 100,30`} />}
      <polyline className="mx-spark__line" points={line} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
