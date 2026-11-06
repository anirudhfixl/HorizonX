import React from "react";

function hue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export interface AssetMarkProps {
  /** Used for the fallback initial and colour. */
  symbol: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
}

/** Logo, or a quiet monogram when the asset has none. */
export function AssetMark({ symbol, logoUrl, size = "md" }: AssetMarkProps) {
  const [failed, setFailed] = React.useState(false);
  const h = hue(symbol);
  const showImage = Boolean(logoUrl && !failed);
  return (
    <span
      className={`mx-mark mx-mark--${size}`}
      style={showImage ? undefined : { background: `hsl(${h} 34% 22%)`, color: `hsl(${h} 70% 82%)` }}
      aria-hidden="true"
    >
      {showImage ? <img src={logoUrl} alt="" onError={() => setFailed(true)} loading="lazy" /> : symbol.slice(0, 1)}
    </span>
  );
}
