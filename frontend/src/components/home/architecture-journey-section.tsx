import {
  ArrowRight,
  Blocks,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HOME_PRINCIPLES } from "@/data";

const PRINCIPLE_DETAILS = [
  {
    tag: "WORKFLOW",
    action: "Explore token tools",
    href: "/tokens/create",
    nodes: ["Create", "Configure", "Launch"],
    accent: "indigo",
  },
  {
    tag: "SELF-CUSTODY",
    action: "View wallet workspace",
    href: "/account/wallets",
    nodes: ["Connect", "Review", "Approve"],
    accent: "sky",
  },
  {
    tag: "TRANSPARENCY",
    action: "Explore the ecosystem",
    href: "/explore",
    nodes: ["Review", "Understand", "Decide"],
    accent: "emerald",
  },
] as const;

const ICONS = {
  blocks: Blocks,
  wallet: Wallet,
  "shield-check": ShieldCheck,
} as const;

export function ArchitectureJourneySection() {
  return (
    <section
      aria-labelledby="architecture-heading"
      className="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mb-12 flex w-full justify-center sm:mb-14">
        <div className="mx-auto max-w-[780px] text-center">
          <h2
            id="architecture-heading"
            className="text-balance text-[clamp(2.5rem,5vw,4.35rem)] font-medium leading-[1.04] tracking-[-.067em] text-white"
          >
            More than tools.
            <span className="block bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
              A place to build.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[680px] text-[13px] leading-[1.85] text-[#aaa6bd] sm:text-[15px]">
            Build your project with the essentials in one place. Create your token,
            bring it to market and give your community ways to take part as you grow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {HOME_PRINCIPLES.map((item, index) => {
          const Icon = ICONS[item.icon];
          const detail = PRINCIPLE_DETAILS[index];
          const accent =
            detail.accent === "indigo"
              ? "text-indigo-300 border-indigo-400/20 bg-indigo-400/[.08] group-hover:border-indigo-300/35"
              : detail.accent === "sky"
                ? "text-sky-300 border-sky-400/20 bg-sky-400/[.08] group-hover:border-sky-300/35"
                : "text-emerald-300 border-emerald-400/20 bg-emerald-400/[.08] group-hover:border-emerald-300/35";
          const hoverText =
            detail.accent === "indigo"
              ? "group-hover:text-indigo-200"
              : detail.accent === "sky"
                ? "group-hover:text-sky-200"
                : "group-hover:text-emerald-200";

          return (
            <article
              key={item.title}
              className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[10px] border border-white/[.09] bg-[linear-gradient(145deg,rgba(20,22,35,.82),rgba(10,11,20,.92)_70%,rgba(39,31,66,.24))] p-6 shadow-[0_18px_48px_rgba(0,0,0,.18)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/[.18] hover:shadow-[0_24px_58px_rgba(0,0,0,.28)] sm:p-7 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-400/[.07] blur-[70px] transition-opacity duration-300 group-hover:opacity-150"
              />

              <div className="relative flex items-start justify-between gap-4 border-b border-white/[.08] pb-5">
                <span className={`grid h-11 w-11 place-items-center rounded-xl border ${accent} transition-colors duration-300`}>
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[.12em] ${accent}`}>
                  {detail.tag}
                </span>
              </div>

              <div className="relative mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em] text-white/40">
                <span className={hoverText}>{String(index + 1).padStart(2, "0")}</span>
                <span className="h-px w-5 bg-white/15" />
                <span>{item.eyebrow}</span>
              </div>

              <h3 className={`relative mt-3 text-[21px] font-semibold leading-tight tracking-[-.04em] text-white transition-colors duration-300 ${hoverText}`}>
                {item.title}
              </h3>
              <p className="relative mt-3 max-w-[390px] text-[13px] leading-[1.8] text-[#aaa6bd]">
                {item.description}
              </p>

              <div className="relative mt-auto pt-7">
                <div className="mb-5 flex flex-wrap items-center gap-1.5">
                  {detail.nodes.map((node, nodeIndex) => (
                    <span key={node} className="inline-flex items-center gap-1.5">
                      <span className="rounded-md border border-white/[.09] bg-white/[.035] px-2 py-1.5 font-mono text-[9px] text-white/65">
                        {node}
                      </span>
                      {nodeIndex < detail.nodes.length - 1 && (
                        <span aria-hidden="true" className="text-[10px] text-white/25">→</span>
                      )}
                    </span>
                  ))}
                </div>

                <Link
                  to={detail.href}
                  className={`flex min-h-10 items-center justify-between border-t border-white/[.09] pt-4 text-[11px] font-semibold text-white/65 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${hoverText}`}
                >
                  {detail.action}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-5 rounded-[10px] border border-white/[.09] bg-[linear-gradient(100deg,rgba(18,19,31,.82),rgba(12,13,23,.88))] px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300/40 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-300" />
          </span>
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[.19em] text-violet-200/75">
              One connected Web3 workspace
            </p>
            <p className="mt-1 text-[13px] font-medium text-white/85">
              Create, launch and participate in one ecosystem.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/[.08] py-4 text-[10px] font-mono text-white/45 lg:border-y-0 lg:border-x lg:px-8 lg:py-1">
          <span>Token creation</span>
          <span>Self-custody</span>
          <span>Community participation</span>
        </div>

        <Link
          to="/explore"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/[.14] bg-white/[.045] px-4 text-[10px] font-semibold text-white/85 transition-colors hover:border-violet-200/35 hover:bg-violet-200/[.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          Explore ecosystem
          <ArrowRight className="h-3.5 w-3.5 text-violet-200" />
        </Link>
      </div>
    </section>
  );
}
