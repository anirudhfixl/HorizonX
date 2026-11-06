import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function GoogleGeminiEffectDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start as Tokens enters the viewport; finish as Projects approaches the top.
    // This ties the draw sequence to the visible feature rail, not the full section.
    offset: ["start 82%", "start 8%"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.5, 1]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.5, 1]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.5, 1]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.5, 1]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.5, 1]);

  return (
    <section
      ref={ref}
      aria-label="HorizonX ecosystem animation"
      className="relative mb-24 min-h-[720px] w-full overflow-visible bg-transparent pb-16 pt-0 sm:mb-28 sm:min-h-[760px] sm:pb-20 lg:mb-32 lg:min-h-[780px] lg:pb-24"
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
