import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-150 group-hover/spotlight:opacity-100"
        style={{ backgroundColor: color, maskImage, WebkitMaskImage: maskImage }}
      >
        {isHovering ? (
          <CanvasRevealEffect
            animationSpeed={12}
            containerClassName="absolute inset-0 bg-transparent"
            colors={colors}
            dotSize={2}
            showGradient={false}
          />
        ) : null}
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,.055),transparent_65%)] opacity-80" />
      {children}
    </div>
  );
};
