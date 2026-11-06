import React, { useState, useEffect, Suspense } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

// Lazily load WebGL/Three.js canvas so Three.js vendor bundle is not forced into initial page load
const LazyCanvasRevealEffect = React.lazy(() =>
  import("@/components/ui/canvas-reveal-effect").then((m) => ({ default: m.CanvasRevealEffect }))
);

type CardSpotlightProps = React.HTMLAttributes<HTMLDivElement> & {
  radius?: number;
  color?: string;
  colors?: number[][];
};

export const CardSpotlight = ({
  children,
  radius = 260,
  color = "rgba(139, 92, 246, 0.16)",
  colors = [[139, 92, 246], [99, 102, 241]],
  className,
  ...props
}: CardSpotlightProps) => {
  const mouseX = useMotionValue(-radius);
  const mouseY = useMotionValue(-radius);
  const [isHovering, setIsHovering] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Check if the device has a fine pointer (desktop mouse).
    // On mobile touch devices, skip WebGL loading entirely to save ~924 KB of Three.js
    // and rely on the sleek CSS radial spotlight fallback.
    if (typeof window !== "undefined" && window.matchMedia) {
      const query = window.matchMedia("(hover: hover) and (pointer: fine)");
      setCanHover(query.matches);
      const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
      query.addEventListener("change", handler);
      return () => query.removeEventListener("change", handler);
    }
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  };

  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 78%)`;

  return (
    <div
      className={cn(
        "group/spotlight relative isolate overflow-hidden border border-white/[.09] bg-[#0b0915]",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => canHover && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-150 group-hover/spotlight:opacity-100"
        style={{ backgroundColor: color, maskImage, WebkitMaskImage: maskImage }}
      >
        {isHovering && canHover ? (
          <Suspense fallback={null}>
            <LazyCanvasRevealEffect
              animationSpeed={12}
              containerClassName="absolute inset-0 bg-transparent"
              colors={colors}
              dotSize={2}
              showGradient={false}
            />
          </Suspense>
        ) : null}
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,.055),transparent_65%)] opacity-80" />
      {children}
    </div>
  );
};
