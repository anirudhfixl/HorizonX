import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { EarthHero } from "@/components/home/earth-hero";
import { GoogleGeminiEffectDemo } from "@/components/home/google-gemini-effect-demo";
import { CapabilityShowcase } from "@/components/home/capability-showcase";
import { WalletConnectSection } from "@/components/home/wallet-connect-section";

const principles = [
  {
    icon: Blocks,
    eyebrow: "THE FOUNDATION",
    title: "One path from idea to launch",
    description: "Bring token setup, launch planning and community activity into a connected workflow instead of juggling disconnected tools.",
  },
  {
    icon: Wallet,
    eyebrow: "YOUR ASSETS",
    title: "Your wallet stays yours",
    description: "Connect when you choose and use your wallet to access the parts of the ecosystem relevant to your project.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "CLEAR DECISIONS",
    title: "Clarity at every step",
    description: "See the key details behind project actions and participation flows before you decide what to do next.",
  },
];

export default function Home() {
  return (
    <main className="min-w-0 overflow-hidden bg-[#080711] text-[#f4f1ff]">
      <EarthHero />

      <div className="relative bg-[radial-gradient(ellipse_75%_420px_at_50%_0%,rgba(112,85,190,.12),transparent_75%),#080711]">
        <GoogleGeminiEffectDemo />

        <CapabilityShowcase />

        <section
          aria-labelledby="journey-heading"
          className="relative isolate mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-18 lg:grid-cols-[.82fr_1.18fr] lg:gap-20 lg:px-12 lg:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/4 -z-10 h-72 w-72 rounded-full bg-violet-500/[.06] blur-[100px]"
          />

          <div className="relative lg:sticky lg:top-28">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-violet-300/70" />
              <p className="text-[10px] font-bold uppercase tracking-[.26em] text-violet-300/85">
                Built around the journey
              </p>
            </div>

            <h2
              id="journey-heading"
              className="max-w-[560px] text-balance text-[clamp(2.65rem,4vw,4.15rem)] font-medium leading-[1.04] tracking-[-.065em] text-white"
            >
              More than tools.
              <span className="mt-1 block bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                A place to build.
              </span>
            </h2>

            <p className="mt-6 max-w-[440px] text-[14px] leading-[1.9] text-[#aaa6bd] sm:text-[15px]">
              Build your project with the essentials in one place. Create your token, bring it to market and give your community ways to take part as you grow.
            </p>

            <Link
              href="/explore"
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-violet-200/25 bg-violet-300/[.08] px-6 text-[12px] font-semibold text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition-[transform,border-color,background-color,color] duration-300 hover:-translate-y-0.5 hover:border-violet-200/50 hover:bg-violet-300/[.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080711] motion-reduce:transform-none motion-reduce:transition-none"
            >
              Explore HorizonX
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>

            <div className="mt-9 flex items-center gap-3 border-t border-white/[.09] pt-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300/35 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300" />
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[.2em] text-white/40">
                One connected Web3 workspace
              </span>
            </div>
          </div>

          <div className="relative min-w-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(139,92,246,.11),transparent_68%)] blur-2xl"
            />

            <div className="mb-4 flex items-center justify-between border-b border-white/[.10] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-white/45">
                The HorizonX approach
              </p>
              <span className="font-mono text-[10px] tracking-[.16em] text-violet-200/55">
                03 PRINCIPLES
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {principles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group relative isolate overflow-hidden rounded-2xl border border-white/[.09] bg-[linear-gradient(115deg,rgba(255,255,255,.045),rgba(255,255,255,.015)_58%,rgba(139,92,246,.035))] p-5 shadow-[0_12px_36px_rgba(0,0,0,.12)] transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-violet-200/25 hover:shadow-[0_18px_42px_rgba(0,0,0,.22)] sm:p-6 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-12 -z-10 h-36 w-36 rounded-full bg-violet-400/[.08] blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                    />
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-violet-200/15 bg-violet-200/[.07] text-violet-100 transition-[transform,border-color,background-color] duration-300 group-hover:scale-[1.04] group-hover:border-violet-200/30 group-hover:bg-violet-200/[.13] motion-reduce:transform-none motion-reduce:transition-none">
                        <Icon aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.6} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[10px] font-semibold tracking-[.18em] text-violet-300/70">
                            0{index + 1}
                          </span>
                          <span aria-hidden="true" className="h-px w-5 bg-white/15" />
                          <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-white/40">
                            {item.eyebrow}
                          </span>
                        </div>

                        <h3 className="text-[16px] font-semibold tracking-[-.02em] text-white sm:text-[17px]">
                          {item.title}
                        </h3>
                        <p className="mt-2 max-w-[520px] text-[13px] leading-[1.85] text-[#aaa6bd] sm:text-[13.5px]">
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight
                        aria-hidden="true"
                        className="mt-1 hidden h-4 w-4 shrink-0 text-white/25 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-violet-200 sm:block motion-reduce:transition-none"
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="text-[9px] font-semibold uppercase tracking-[.2em] text-white/35">
                Designed for the full project lifecycle
              </span>
              <span className="font-mono text-[10px] tracking-wider text-violet-200/50">
                01 <span className="text-white/25">/</span> 03
              </span>
            </div>
          </div>
        </section>

        <WalletConnectSection />

      </div>
    </main>
  );
}
