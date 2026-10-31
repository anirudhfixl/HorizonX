"use client";

import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function GoogleGeminiEffectDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.62], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.62], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.62], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.62], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.62], [0, 1.2]);

  return (
    <section
      ref={ref}
      aria-label="HorizonX ecosystem animation"
      className="relative h-[58vh] min-h-[340px] w-full overflow-clip bg-transparent pt-0 sm:h-[64vh] sm:min-h-[390px] lg:h-[68vh] lg:min-h-[420px]"
    >
      <GoogleGeminiEffect
        title="Build with HorizonX"
        description="One connected ecosystem to create, launch and grow what comes next."
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </section>
  );
}
