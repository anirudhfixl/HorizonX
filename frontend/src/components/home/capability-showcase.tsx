"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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

const offerings = [
  {
    number: "01",
    eyebrow: "TOKEN STUDIO",
    icon: Coins,
    title: "Bring your token to life.",
    description:
      "Set up the essentials, review the details and move from an idea to a deployed token through a guided flow.",
    href: "/tokens/create",
    action: "Create a token",
    surface: "bg-[#21151d]",
    glow: "rgba(236, 72, 153, 0.18)",
    colors: [[236, 72, 153], [168, 85, 247]],
  },
  {
    number: "02",
    eyebrow: "LAUNCHPAD",
    icon: Rocket,
    title: "Take your project to market.",
    description:
      "Shape a launch, configure a presale and give supporters a clear way to discover your project.",
    href: "/launchpad",
    action: "Explore launches",
    surface: "bg-[#171a25]",
    glow: "rgba(99, 102, 241, 0.2)",
    colors: [[99, 102, 241], [59, 130, 246]],
  },
  {
    number: "03",
    eyebrow: "COMMUNITY CAMPAIGNS",
    icon: Gift,
    title: "Turn attention into participation.",
    description:
      "Create airdrop campaigns, define participation requirements and bring your community into the journey.",
    href: "/airdrops",
    action: "View campaigns",
    surface: "bg-[#241316]",
    glow: "rgba(248, 113, 113, 0.18)",
    colors: [[248, 113, 113], [217, 70, 239]],
  },
  {
    number: "04",
    eyebrow: "STAKING",
    icon: Layers3,
    title: "Give holders a reason to stay.",
    description:
      "Explore staking pools and participation options that help keep your ecosystem active beyond launch.",
    href: "/staking",
    action: "Explore staking",
    surface: "bg-[#171b20]",
    glow: "rgba(45, 212, 191, 0.16)",
    colors: [[45, 212, 191], [99, 102, 241]],
  },
  {
    number: "05",
    eyebrow: "WALLET & ASSETS",
    icon: Wallet,
    title: "Keep your assets in view.",
    description:
      "Connect your wallet and review supported assets and balances from one dedicated workspace.",
    href: "/account/wallets",
    action: "Open wallet",
    surface: "bg-[#1c1727]",
    glow: "rgba(167, 139, 250, 0.2)",
    colors: [[167, 139, 250], [96, 165, 250]],
  },
  {
    number: "06",
    eyebrow: "MARKET DISCOVERY",
    icon: Blocks,
    title: "Find what is moving.",
    description:
      "Browse tokens and market activity to discover projects and keep up with the wider ecosystem.",
    href: "/exchange",
    action: "Explore markets",
    surface: "bg-[#1b1b1a]",
    glow: "rgba(251, 191, 36, 0.15)",
    colors: [[251, 191, 36], [249, 115, 22]],
  },
];

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
      cycleWidthRef.current = (first.offsetWidth + gap) * offerings.length;
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
          {[...offerings, ...offerings, ...offerings].map((item, index) => {
            const Icon = item.icon;
            return (
              <CardSpotlight
                key={`${item.number}-${index}`}
                radius={260}
                color={item.glow}
                colors={item.colors}
                data-capability-card
                className={`group relative min-h-[360px] w-[min(82vw,340px)] shrink-0 snap-start overflow-hidden rounded-[5px] border border-white/[.12] ${item.surface} p-0 shadow-[0_18px_50px_rgba(0,0,0,.16)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/25 sm:min-h-[390px] sm:w-[340px] lg:w-[360px]`}
              >
                <Link
                  href={item.href}
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
