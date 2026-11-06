import React from "react";

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Native Browser Scrolling Provider.
 * Lenis has been completely removed in favor of native, immediate browser scrolling.
 * This passthrough component preserves backward compatibility without RAF loops or interpolation.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}

export default SmoothScrollProvider;
