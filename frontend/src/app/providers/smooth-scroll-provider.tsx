import React, { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // When the user requests reduced motion, bypass Lenis interpolation completely
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        prevent: (node: Node) => {
          if (node instanceof HTMLElement) {
            return (
              Boolean(node.closest("[data-lenis-prevent]")) ||
              Boolean(node.closest('[role="dialog"]')) ||
              Boolean(node.closest('[data-state="open"]'))
            );
          }
          return false;
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrollProvider;
