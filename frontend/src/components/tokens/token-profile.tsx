"use client";

import React from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { TokenDetailShell } from "./token-detail-shell";
import { cn } from "@/lib/utils";
import type {
  Token,
  TokenMarketData,
  Project,
  Presale,
  FairLaunch,
  AirdropCampaign,
  StakingPool,
  VerificationStatus,
} from "@/types";
import {
  ChevronRight,
  ExternalLink,
  FileCode2,
} from "lucide-react";

export type TokenProfileData = Token & { market: TokenMarketData };

interface TokenProfileProps {
  token: TokenProfileData;
  project?: Project;
  presales: Presale[];
  fairLaunches: FairLaunch[];
  airdrops: AirdropCampaign[];
  stakingPools: StakingPool[];
}

// ─── Helpers (exported for tests & cross-module consumers) ────────────────────

const NOT_PUBLISHED = "—";

/** Compact currency; missing values are shown as an em dash instead of $0.00. */
export function formatMoney(val?: number): string {
  if (val === undefined || val === null || Number.isNaN(val)) return NOT_PUBLISHED;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
  if (val > 0 && val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

/** Parses a stored supply string such as "100,000,000". Returns undefined when it is not a plain number. */
export function parseSupply(value?: string): number | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isFinite(n) ? n : undefined;
}

export function getExplorerBaseUrl(network: string): string {
  const n = (network || "").toLowerCase();
  if (n.includes("sepolia") || n === "ethereum") return "https://sepolia.etherscan.io";
  if (n.includes("arbitrum")) return "https://arbiscan.io";
  if (n.includes("base")) return "https://basescan.org";
  return "https://polygonscan.com";
}

export function isSepoliaNetwork(network: string): boolean {
  const n = (network || "").toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

const VERIFICATION_STEPS: {
  key: VerificationStatus;
  label: string;
  detail: string;
}[] = [
  { key: "not_reviewed", label: "Not reviewed", detail: "No review is recorded for this token in the catalog." },
  { key: "project_reviewed", label: "Project reviewed", detail: "The project behind this token has a catalog review. This is not a contract audit." },
  { key: "contract_source_verified", label: "Source verified", detail: "The catalog records the contract source as verified." },
  { key: "audit_available", label: "Audit available", detail: "The catalog records that an audit exists. The report itself is not shown here." },
];

export function verificationIndex(status?: VerificationStatus): number {
  const i = VERIFICATION_STEPS.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}

const TONES = [
  { tile: "from-orange-500/25 to-orange-500/5 text-orange-300", glow: "bg-orange-500/15" },
  { tile: "from-sky-500/25 to-sky-500/5 text-sky-300", glow: "bg-sky-500/15" },
  { tile: "from-emerald-500/25 to-emerald-500/5 text-emerald-300", glow: "bg-emerald-500/15" },
  { tile: "from-violet-500/25 to-violet-500/5 text-violet-300", glow: "bg-violet-500/15" },
  { tile: "from-rose-500/25 to-rose-500/5 text-rose-300", glow: "bg-rose-500/15" },
  { tile: "from-amber-500/25 to-amber-500/5 text-amber-300", glow: "bg-amber-500/15" },
];

export function toneFor(category?: string) {
  const s = category || "General";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TokenProfile({
  token,
  project,
  presales,
  fairLaunches,
  airdrops,
  stakingPools,
}: TokenProfileProps) {
  const sepolia = isSepoliaNetwork(token.network);
  const market = token.market;

  const totalSupplyNum = parseSupply(token.totalSupply);
  const circulating = market?.circulatingSupply;
  const circulatingPct =
    circulating !== undefined && totalSupplyNum
      ? Math.max(0, Math.min(100, (circulating / totalSupplyNum) * 100))
      : undefined;
  const fdv = totalSupplyNum !== undefined && market?.price !== undefined ? totalSupplyNum * market.price : undefined;

  const verifIdx = verificationIndex(token.verificationStatus);

  const ecosystemCount = presales.length + fairLaunches.length + airdrops.length + stakingPools.length;

  type Utility = {
    key: string;
    kind: string;
    title: string;
    detail: string;
    href: string;
    status?: string;
    emphasis?: string;
  };

  const utilities: Utility[] = [
    ...presales.map((p) => ({
      key: `presale-${p.id}`,
      kind: "Presale",
      title: p.title,
      detail: p.hardCap ? `Hard cap ${p.hardCap}${p.totalRaised ? ` · raised ${p.totalRaised}` : ""}` : "Cap not published",
      href: `/launchpad/presales/${p.id}`,
      status: p.status,
    })),
    ...fairLaunches.map((f) => ({
      key: `launch-${f.id}`,
      kind: "Fair launch",
      title: f.title,
      detail: f.totalSelling ? `Selling ${f.totalSelling}${f.totalRaised ? ` · raised ${f.totalRaised}` : ""}` : "Allocation not published",
      href: `/launchpad/launches/${f.id}`,
      status: f.status,
    })),
    ...airdrops.map((a) => ({
      key: `airdrop-${a.id}`,
      kind: "Airdrop",
      title: a.title,
      detail: a.totalReward ? `Reward pool ${a.totalReward}` : "Pool not published",
      href: `/airdrops/campaigns/${a.id}`,
      status: a.status,
    })),
    ...stakingPools.map((s) => ({
      key: `pool-${s.id}`,
      kind: "Staking",
      title: s.name,
      detail: s.totalStaked ? `Total staked ${s.totalStaked}` : "Staked pool",
      href: `/staking/pools/${s.id}`,
      emphasis: s.apy ? `${s.apy} APY` : undefined,
      status: s.status,
    })),
  ];

  const marketRows = [
    {
      label: "Simulated price",
      value: formatMoney(market?.price),
      sub:
        market?.priceChange24h !== undefined
          ? `${market.priceChange24h >= 0 ? "+" : ""}${market.priceChange24h}% 24h`
          : undefined,
      tone: market?.priceChange24h === undefined ? undefined : market.priceChange24h >= 0 ? "up" : "down",
    },
    { label: "Market cap (Simulated)", value: formatMoney(market?.marketCap) },
    { label: "24h volume (Simulated)", value: formatMoney(market?.volume24h) },
    { label: "Liquidity (Simulated)", value: formatMoney(market?.liquidity) },
  ];

  return (
    <TokenDetailShell token={token} project={project} activeTab="overview">
      <div className="space-y-12">
        {/* ─── 1. Description & Core Profile ─────────────────────────────── */}
        <section aria-label="Token overview" className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div className="space-y-4">
            <Eyebrow>Token Profile</Eyebrow>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              About {token.name}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {token.description || "No official description has been registered for this token in the platform catalog."}
            </p>

            {token.features && token.features.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Declared Token Features
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {token.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-xs text-foreground font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Parent Project Card */}
          <div className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
            <Eyebrow>Parent Project</Eyebrow>
            {project ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-sm shadow-sm",
                      toneFor(project.category).tile
                    )}
                  >
                    {project.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {project.name}
                    </Link>
                    <span className="text-xs text-muted-foreground block">
                      {project.category || "Ecosystem Project"}
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs text-foreground hover:bg-secondary/40">
                    <Link href={`/projects/${project.id}`}>
                      <span>View Project Profile</span>
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 text-xs text-muted-foreground">
                Standalone token. No dedicated project profile is currently linked in the catalog.
              </div>
            )}
          </div>
        </section>

        {/* ─── 2. Supply & Market Telemetry (Simulated) ──────────────────── */}
        <section aria-labelledby="supply-heading" className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 border-t border-border/40 pt-8">
          <div>
            <Eyebrow>Catalog Supply</Eyebrow>
            <h2 id="supply-heading" className="sr-only">Supply</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {token.totalSupply || NOT_PUBLISHED}
              </span>
              <span className="font-mono text-sm font-medium text-muted-foreground">{token.symbol}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total supply recorded in platform metadata {token.decimals !== undefined ? `· ${token.decimals} decimals` : ""}
            </p>

            <div className="mt-6 rounded-2xl border border-border/40 bg-secondary/15 p-4 space-y-3">
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span>Circulating Supply</span>
                <span className="font-mono font-semibold text-foreground">
                  {circulating !== undefined
                    ? `${new Intl.NumberFormat("en-US").format(circulating)} ${token.symbol}`
                    : "Not published"}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-secondary/60"
                role={circulatingPct !== undefined ? "progressbar" : undefined}
                aria-valuenow={circulatingPct !== undefined ? Math.round(circulatingPct) : undefined}
                aria-valuemin={circulatingPct !== undefined ? 0 : undefined}
                aria-valuemax={circulatingPct !== undefined ? 100 : undefined}
                aria-label="Circulating share of total supply"
              >
                {circulatingPct !== undefined ? (
                  <div className="h-full rounded-full bg-primary" style={{ width: `${circulatingPct}%` }} />
                ) : (
                  <div className="h-full w-full bg-[repeating-linear-gradient(135deg,transparent_0,transparent_6px,rgba(255,255,255,0.04)_6px,rgba(255,255,255,0.04)_12px)]" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {circulatingPct !== undefined
                  ? `${circulatingPct.toFixed(1)}% of total catalog supply recorded as circulating`
                  : "Circulating supply ratio not published for this catalog asset."}
              </p>
            </div>
          </div>

          {/* Market Strip */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Eyebrow>Market Telemetry</Eyebrow>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                Simulated Figures
              </span>
            </div>

            <dl className="divide-y divide-border/40 border-y border-border/40">
              {marketRows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5 text-xs">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd className="text-right">
                    <span className="font-mono text-sm font-semibold text-foreground">{r.value}</span>
                    {r.sub ? (
                      <span
                        className={cn(
                          "ml-2 font-mono text-xs",
                          r.tone === "up" ? "text-emerald-400" : "text-rose-400"
                        )}
                      >
                        {r.sub}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-xs">
                <dt className="text-muted-foreground">
                  Fully Diluted Value (Sim)
                </dt>
                <dd className="font-mono text-sm font-semibold text-foreground">{formatMoney(fdv)}</dd>
              </div>
            </dl>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Market figures are demonstration values from platform catalog simulations, not a live decentralized exchange feed
              {market?.lastUpdated ? ` (simulated update: ${market.lastUpdated})` : ""}.
            </p>
          </div>
        </section>

        {/* ─── 3. Contract Summary Card ──────────────────────────────────── */}
        <section aria-label="Contract summary" className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Eyebrow>Technical Contract Summary</Eyebrow>
              <h3 className="text-base font-bold text-foreground">
                ERC-20 Contract Specification &amp; ABI
              </h3>
              <p className="text-xs text-muted-foreground">
                Inspect raw base units, EIP-20 standard interfaces, compiler build information, and verified bytecode.
              </p>
            </div>
            <Button asChild size="sm" className="bg-primary text-primary-foreground font-semibold text-xs h-9">
              <Link href={`/tokens/${token.id}/contract`}>
                <FileCode2 className="mr-1.5 h-3.5 w-3.5" />
                <span>Open Contract Inspector</span>
              </Link>
            </Button>
          </div>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-border/30 pt-4 text-xs">
            <div>
              <dt className="text-muted-foreground">Standard</dt>
              <dd className="font-mono font-medium text-foreground mt-0.5">{token.standard || "ERC-20"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Decimals</dt>
              <dd className="font-mono font-medium text-foreground mt-0.5">{token.decimals ?? 18}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Verification Tier</dt>
              <dd className="font-medium text-primary mt-0.5">{VERIFICATION_STEPS[verifIdx].label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Network</dt>
              <dd className="font-medium text-foreground mt-0.5">{sepolia ? "Ethereum Sepolia" : token.network}</dd>
            </div>
          </dl>
        </section>

        {/* ─── 4. In the Ecosystem (Genuine Utilities) ───────────────────── */}
        <section aria-labelledby="eco-heading" className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12 border-t border-border/40 pt-8">
          <div>
            <Eyebrow>Ecosystem Utility</Eyebrow>
            <h2 id="eco-heading" className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Where ${token.symbol} is Used
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Presales, fair launches, airdrops, and staking pools registered in the ProMiners platform that reference this token or its parent project.
            </p>
          </div>

          <div>
            {ecosystemCount > 0 ? (
              <ul className="divide-y divide-border/40 border-y border-border/40">
                {utilities.map((u) => (
                  <li key={u.key}>
                    <Link
                      href={u.href}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-4 transition-colors hover:bg-secondary/20 px-2 rounded-lg"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{u.kind}</span>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {u.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground mt-0.5">{u.detail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {u.emphasis ? (
                          <span className="font-mono text-xs font-semibold text-emerald-400">{u.emphasis}</span>
                        ) : null}
                        {u.status ? <StatusBadge status={u.status} /> : null}
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-border/40 bg-card/20 p-8 text-center">
                <p className="text-sm font-medium text-foreground">No Campaigns Active</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No presales, fair launches, airdrop campaigns, or staking pools currently reference ${token.symbol}.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── 5. D-04 Architecture Decision Notice ───────────────────────── */}
        <p className="border-l-2 border-primary/40 pl-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">Architecture Decision D-04: </strong>
          {sepolia ? (
            <>
              Ethereum Sepolia (Chain ID 11155111) is the only network supported for Web3 wallet connectivity. All market figures and price charts are simulated demonstration data.
            </>
          ) : (
            <>
              This token is cataloged on {token.network} for cross-module discovery only. Web3 wallet connectivity is supported solely on Ethereum Sepolia.
            </>
          )}
        </p>
      </div>
    </TokenDetailShell>
  );
}
