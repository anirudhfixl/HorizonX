import React from "react";
import { AssetMark } from "./asset-mark";

export interface AssetIdentityProps {
  symbol: string;
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  /** Text under the name; defaults to nothing. */
  meta?: React.ReactNode;
}

/** Logo with symbol and name, the standard way an asset is named in lists. */
export function AssetIdentity({ symbol, name, logoUrl, size = "md", meta }: AssetIdentityProps) {
  return (
    <span className="mx-identity">
      <AssetMark symbol={symbol} logoUrl={logoUrl} size={size} />
      <span className="mx-identity__text">
        <b>{symbol}</b>
        <small>{name}</small>
        {meta && <span className="mx-identity__meta">{meta}</span>}
      </span>
    </span>
  );
}
