import {
  ArrowUpRight,
  Blocks,
  Coins,
  Compass,
  Gift,
  Handshake,
  Layers3,
  Network,
  Rocket,
  Wallet,
} from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import SocialCards, { type FanCardItem } from "@/components/ui/card-fan-carousel";
import { HOME_CAPABILITIES } from "@/data";
import { Link } from "react-router-dom";

const CAPABILITY_ICONS = {
  coins: Coins,
  rocket: Rocket,
  gift: Gift,
  layers3: Layers3,
  wallet: Wallet,
  blocks: Blocks,
  network: Network,
  handshake: Handshake,
  compass: Compass,
} as const;

export function CapabilityShowcase() {
  const cards: FanCardItem[] = HOME_CAPABILITIES.map((item) => {
    const Icon = CAPABILITY_ICONS[item.icon];
    return {
      id: item.number,
      content: (
        <CardSpotlight
          radius={260}
          color={item.glow}
          colors={item.colors.map((color) => [...color])}
          className={`group relative h-full w-full overflow-hidden rounded-[24px] border border-white/[.12] ${item.surface} p-0 shadow-[0_18px_50px_rgba(0,0,0,.2)] transition-[border-color,filter] duration-300 hover:border-white/25`}
        >
          <Link
            to={item.href}
            className="relative z-10 flex h-full flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300 sm:p-7"
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
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-black/10 text-white/90">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
            </div>

            <div className="mt-auto max-w-[290px] pb-1">
              <h3 className="text-[25px] font-medium leading-[1.08] tracking-[-.055em] text-white sm:text-[27px]">
                {item.title}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.8] text-white/70 sm:text-[13.5px]">
                {item.description}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold text-white transition-colors group-hover:text-violet-100">
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
      ),
    };
  });

  return (
    <section className="relative w-full overflow-hidden px-4 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-3 lg:px-8 lg:pt-4">
      <div className="mx-auto max-w-[1760px]">
        <div className="mx-auto mb-1 flex w-full max-w-[1400px] flex-col gap-5 md:mb-0">
          <div className="w-full">
            <h2 className="whitespace-nowrap text-center text-[clamp(1.75rem,3.65vw,3.55rem)] font-medium leading-[1.08] tracking-[-.067em] text-white">
              Everything your project needs.
              <span className="ml-[0.22em] inline bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                Connected from day one.
              </span>
            </h2>
          </div>

        </div>
        <SocialCards cards={cards} />
      </div>
    </section>
  );
}
