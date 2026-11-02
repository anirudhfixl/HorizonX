import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Coins,
  Gift,
  Layers3,
  Rocket,
  Wallet,
} from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { HOME_CAPABILITIES } from "@/data";
import { Link } from "react-router-dom";

export function CapabilityShowcase() {
  const railRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const resettingRef = useRef(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measureAndCenter = () => {
      const first = rail.querySelector<HTMLElement>("[data-capability-card]");
      if (!first) return;
      const styles = window.getComputedStyle(rail);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      cycleWidthRef.current = (first.offsetWidth + gap) * HOME_CAPABILITIES.length;
      rail.scrollLeft = cycleWidthRef.current;
    };

    measureAndCenter();
    window.addEventListener("resize", measureAndCenter);
    return () => window.removeEventListener("resize", measureAndCenter);
  }, []);

  const handleRailScroll = () => {
    const rail = railRef.current;
    const cycle = cycleWidthRef.current;
    if (!rail || !cycle || resettingRef.current) return;

    if (rail.scrollLeft <= 1) {
      resettingRef.current = true;
      rail.scrollLeft += cycle;
      requestAnimationFrame(() => { resettingRef.current = false; });
    } else if (rail.scrollLeft >= cycle * 2 - 1) {
      resettingRef.current = true;
      rail.scrollLeft -= cycle;
      requestAnimationFrame(() => { resettingRef.current = false; });
    }
  };

  const move = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-capability-card]");
    const styles = window.getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const distance = card ? card.offsetWidth + gap : 360;
    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full px-5 pb-5 pt-2 sm:px-8 sm:pb-6 sm:pt-3 lg:px-12 lg:pt-4">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[760px]">
            <h2 className="text-balance text-[clamp(2.55rem,4.3vw,4.65rem)] font-medium leading-[1.02] tracking-[-.067em] text-white">
              Everything your project needs.
              <span className="mt-1 block bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                Connected from day one.
              </span>
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3 self-end md:pb-1">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-violet-300/70" />
              <p className="text-[9px] font-bold uppercase tracking-[.25em] text-violet-200/75 sm:text-[10px]">
                The HorizonX ecosystem
              </p>
            </div>
            <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll capabilities left"
              onClick={() => move("left")}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.04] text-white/80 transition hover:border-violet-200/40 hover:bg-violet-200/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll capabilities right"
              onClick={() => move("right")}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.04] text-white/80 transition hover:border-violet-200/40 hover:bg-violet-200/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          onScroll={handleRailScroll}
          className="capability-rail -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:gap-4 sm:px-8 lg:-mx-12 lg:px-12"
          aria-label="HorizonX platform capabilities"
        >
          {[...HOME_CAPABILITIES, ...HOME_CAPABILITIES, ...HOME_CAPABILITIES].map((item, index) => {
            const Icon = ({ coins: Coins, rocket: Rocket, gift: Gift, layers3: Layers3, wallet: Wallet, blocks: Blocks } as const)[item.icon];
            return (
              <CardSpotlight
                key={`${item.number}-${index}`}
                radius={260}
                color={item.glow}
                colors={item.colors.map((color) => [...color])}
                data-capability-card
                className={`group relative min-h-[360px] w-[min(82vw,340px)] shrink-0 snap-start overflow-hidden rounded-[5px] border border-white/[.12] ${item.surface} p-0 shadow-[0_18px_50px_rgba(0,0,0,.16)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/25 sm:min-h-[390px] sm:w-[340px] lg:w-[360px]`}
              >
                <Link
                  to={item.href}
                  className="relative z-10 flex min-h-[360px] flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300 sm:min-h-[390px] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-semibold tracking-[.22em] text-white/45">
                        {item.number}
                      </span>
                      <p className="mt-3 text-[9px] font-bold uppercase tracking-[.2em] text-white/55">
                        {item.eyebrow}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center border border-white/20 bg-black/10 text-white/90">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                  </div>

                  <div className="mt-auto max-w-[290px] pb-1">
                    <h3 className="text-[27px] font-medium leading-[1.08] tracking-[-.055em] text-white sm:text-[29px]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[13px] leading-[1.8] text-white/70 sm:text-[13.5px]">
                      {item.description}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold text-white transition-colors group-hover:text-violet-100">
                      {item.action}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Link>
              </CardSpotlight>
            );
          })}
        </div>

      </div>
    </section>
  );
}
