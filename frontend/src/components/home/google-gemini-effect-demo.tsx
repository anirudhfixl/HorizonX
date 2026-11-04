import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function GoogleGeminiEffectDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.78], [0, 1]);

  return (
    <section
      ref={ref}
      aria-label="HorizonX ecosystem animation"
      className="relative mb-24 h-[58vh] min-h-[max(340px,calc(27.78vw+7rem))] w-full overflow-clip bg-transparent pt-0 sm:mb-28 sm:h-[64vh] sm:min-h-[max(390px,calc(27.78vw+7rem))] lg:mb-32 lg:h-[68vh] lg:min-h-[max(420px,calc(27.78vw+7rem))]"
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
