"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
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
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  FileCode2,
  Activity,
  Share2,
  Wallet,
  Check,
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

// ─── Helpers (exported for tests) ─────────────────────────────────────────────

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

function shorten(addr: string): string {
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

// ─── Small presentational pieces ──────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

function SpecRow({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="text-xs text-muted-foreground">
        {label}
        {hint ? <span className="block text-[11px] text-muted-foreground/70">{hint}</span> : null}
      </dt>
      <dd className="min-w-0 text-sm text-foreground">{children}</dd>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TokenProfile({
  token,
  project,
  presales,
  fairLaunches,
  airdrops,
  stakingPools,
}: TokenProfileProps) {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();

  const [shared, setShared] = React.useState(false);

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);
  const tone = toneFor(token.category);
  const market = token.market;

  const totalSupplyNum = parseSupply(token.totalSupply);
  const circulating = market?.circulatingSupply;
  const circulatingPct =
    circulating !== undefined && totalSupplyNum
      ? Math.max(0, Math.min(100, (circulating / totalSupplyNum) * 100))
      : undefined;
  const fdv = totalSupplyNum !== undefined && market?.price !== undefined ? totalSupplyNum * market.price : undefined;

  const verifIdx = verificationIndex(token.verificationStatus);
  const isOwner =
    isConnected &&
    !!userAddress &&
    !!token.creatorAddress &&
    userAddress.toLowerCase() === token.creatorAddress.toLowerCase();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      toast.success("Link copied", { description: window.location.href });
      setTimeout(() => setShared(false), 1800);
    } catch {
      toast.error("Copy failed", { description: "Clipboard access was denied by the browser." });
    }
  };

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
      key: `stake-${s.id}`,
      kind: "Staking",
      title: s.name,
      detail: s.lockPeriodDays ? `${s.lockPeriodDays}-day lock` : "Flexible lock",
      href: `/staking/pools/${s.id}`,
      status: s.status,
      emphasis: s.apy ? `${s.apy} APY` : undefined,
    })),
  ];

  const marketRows: { label: string; value: string; sub?: string; tone?: "up" | "down" }[] = [
    {
      label: "Price",
      value: market?.price !== undefined ? `$${market.price}` : NOT_PUBLISHED,
      sub:
        market?.priceChange24h !== undefined
          ? `${market.priceChange24h >= 0 ? "+" : ""}${market.priceChange24h}% 24h`
          : undefined,
      tone: market?.priceChange24h === undefined ? undefined : market.priceChange24h >= 0 ? "up" : "down",
    },
    { label: "Market cap", value: formatMoney(market?.marketCap) },
    { label: "24h volume", value: formatMoney(market?.volume24h) },
    { label: "Liquidity", value: formatMoney(market?.liquidity) },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/tokens" className="hover:text-foreground">Tokens</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tokens/explore" className="hover:text-foreground">Explore</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{token.symbol}</span>
      </nav>

      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <header className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-b from-secondary/40 to-transparent px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div
          aria-hidden
          className={cn("pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl", tone.glow)}
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
            <div
              aria-hidden
              className={cn(
                "flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br font-mono text-2xl font-bold tracking-tight shadow-lg shadow-black/30 sm:h-28 sm:w-28 sm:text-3xl",
                tone.tile
              )}
            >
              {token.symbol.slice(0, 4)}
            </div>
            <div className="min-w-0">
              <Eyebrow>{token.category || "Token"} · {token.standard || "ERC-20"}</Eyebrow>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {token.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {token.description || "No description has been published for this token."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={token.status} />
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    sepolia ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  {sepolia ? "Ethereum Sepolia" : token.network}
                </span>
                <span className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {VERIFICATION_STEPS[verifIdx].label}
                </span>
                {isOwner ? (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                    You created this token
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <Button asChild size="sm" className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
              <Link href={`/exchange/tokens/${token.id}`}>Trade {token.symbol}</Link>
            </Button>
            {token.contractAddress ? (
              <a
                href={`${explorerBase}/token/${token.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-secondary/50 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Explorer <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleShare}
            >
              {shared ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="mr-1 h-3.5 w-3.5" />}
              {shared ? "Copied" : "Share"}
            </Button>
            {isConnected ? (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary/10 px-3 font-mono text-xs text-primary">
                <Wallet className="h-3.5 w-3.5" />
                {userAddress ? shorten(userAddress) : "Connected"}
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => openModal("CONNECT_WALLET")}
              >
                <Wallet className="mr-1 h-3.5 w-3.5 text-primary" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── Record views (existing routes) ───────────────────────────────── */}
      <nav aria-label="Token record views" className="mt-6 flex items-center gap-1 overflow-x-auto text-sm">
        <span
          aria-current="page"
          className="shrink-0 rounded-full bg-primary/15 px-4 py-1.5 font-medium text-primary"
        >
          Overview
        </span>
        <Link
          href={`/tokens/${token.id}/contract`}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <FileCode2 className="h-3.5 w-3.5" /> Contract &amp; source
        </Link>
        <Link
          href={`/tokens/${token.id}/activity`}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <Activity className="h-3.5 w-3.5" /> Activity &amp; holders
        </Link>
      </nav>

      {/* ── Supply ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="supply-heading" className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Supply</Eyebrow>
          <h2 id="supply-heading" className="sr-only">Supply</h2>
          <p className="mt-3 break-words font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {token.totalSupply || NOT_PUBLISHED}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {token.symbol} total supply as recorded in the catalog
            {token.decimals !== undefined ? ` · ${token.decimals} decimals` : ""}
          </p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-xs text-muted-foreground">
              <span>Circulating</span>
              <span className="font-mono text-foreground">
                {circulating !== undefined
                  ? `${new Intl.NumberFormat("en-US").format(circulating)} ${token.symbol}`
                  : "Not published"}
              </span>
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary/60"
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
            <p className="mt-2 text-[11px] text-muted-foreground">
              {circulatingPct !== undefined
                ? `${circulatingPct.toFixed(1)}% of total supply`
                : "The catalog has no circulating-supply figure for this token, so no share is shown."}
            </p>
          </div>
        </div>

        {/* Market data: one open strip, clearly labelled */}
        <div>
          <div className="flex items-center justify-between">
            <Eyebrow>Market</Eyebrow>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
              Simulated figures
            </span>
          </div>
          <dl className="mt-3 divide-y divide-border/40">
            {marketRows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-muted-foreground">{r.label}</dt>
                <dd className="text-right">
                  <span className="font-mono text-lg font-semibold text-foreground">{r.value}</span>
                  {r.sub ? (
                    <span
                      className={cn(
                        "ml-2 font-mono text-xs",
                        r.tone === "up" ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {r.sub}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-xs text-muted-foreground">
                Fully diluted value
                <span className="block text-[11px] text-muted-foreground/70">Total supply × price</span>
              </dt>
              <dd className="font-mono text-lg font-semibold text-foreground">{formatMoney(fdv)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Market figures are demonstration values from the mock catalog, not a live feed
            {market?.lastUpdated ? ` (last updated ${market.lastUpdated})` : ""}.
          </p>
        </div>
      </section>

      {/* ── Contract passport + verification ─────────────────────────────── */}
      <section aria-labelledby="passport-heading" className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <Eyebrow>Contract passport</Eyebrow>
          <h2 id="passport-heading" className="sr-only">Contract passport</h2>
          <dl className="mt-3 divide-y divide-border/40 border-y border-border/40">
            <SpecRow label="Contract address">
              {token.contractAddress ? (
                <span className="flex items-center gap-1">
                  <code className="min-w-0 break-all font-mono text-[13px]">{token.contractAddress}</code>
                  <CopyButton value={token.contractAddress} label="contract address" />
                </span>
              ) : (
                <span className="text-muted-foreground">No contract address recorded for this token</span>
              )}
            </SpecRow>
            <SpecRow label="Network">
              {sepolia ? "Ethereum Sepolia" : token.network}
              {sepolia ? <span className="ml-2 font-mono text-xs text-muted-foreground">Chain ID 11155111</span> : null}
            </SpecRow>
            <SpecRow label="Standard">{token.standard || NOT_PUBLISHED}</SpecRow>
            <SpecRow label="Decimals">
              <span className="font-mono">{token.decimals ?? NOT_PUBLISHED}</span>
            </SpecRow>
            <SpecRow label="Creator">
              {token.creatorAddress ? (
                <span className="flex items-center gap-1">
                  <code className="min-w-0 break-all font-mono text-[13px]">{token.creatorAddress}</code>
                  <CopyButton value={token.creatorAddress} label="creator address" />
                </span>
              ) : (
                <span className="text-muted-foreground">Not recorded</span>
              )}
            </SpecRow>
            <SpecRow label="Catalog record">
              <span className="font-mono text-[13px]">{token.id}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                Created {token.createdAt} · updated {token.updatedAt}
              </span>
            </SpecRow>
            {token.features && token.features.length > 0 ? (
              <SpecRow label="Features">
                <span className="flex flex-wrap gap-1.5">
                  {token.features.map((f) => (
                    <span key={f} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {f}
                    </span>
                  ))}
                </span>
              </SpecRow>
            ) : null}
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            {token.contractAddress ? (
              <a
                href={`${explorerBase}/token/${token.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View on {sepolia ? "Sepolia Etherscan" : "block explorer"} <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : null}
            <Link href={`/tokens/${token.id}/contract`} className="inline-flex items-center gap-1 text-primary hover:underline">
              Contract &amp; source <ChevronRight className="h-3 w-3" />
            </Link>
            <Link href={`/tokens/${token.id}/activity`} className="inline-flex items-center gap-1 text-primary hover:underline">
              Activity &amp; holders <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div>
          <Eyebrow>Verification</Eyebrow>
          <ol className="relative mt-4 space-y-5" aria-label="Verification tier scale">
            {VERIFICATION_STEPS.map((step, i) => {
              const reached = i <= verifIdx;
              const current = i === verifIdx;
              return (
                <li key={step.key} className="relative flex gap-4" aria-current={current ? "step" : undefined}>
                  {i < VERIFICATION_STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[9px] top-5 h-[calc(100%+0.75rem)] w-px",
                        i < verifIdx ? "bg-primary/60" : "bg-border/60"
                      )}
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className={cn(
                      "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      current
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : reached
                        ? "bg-primary/40 text-primary-foreground"
                        : "bg-secondary/60"
                    )}
                  >
                    {reached ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <div className={cn(!reached && "opacity-60")}>
                    <p className={cn("text-sm font-medium", current ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                      {current ? <span className="ml-2 text-[11px] font-normal text-primary">Current tier</span> : null}
                    </p>
                    {current ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
            The tier is the value stored on this catalog record. ProMiners does not run an on-chain check on this page.
          </p>
        </div>
      </section>

      {/* ── Ecosystem ────────────────────────────────────────────────────── */}
      <section aria-labelledby="eco-heading" className="mt-14 grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow>In the ecosystem</Eyebrow>
          <h2 id="eco-heading" className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Where {token.symbol} is used
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Presales, fair launches, airdrops and staking pools in the catalog that reference this token or its project.
          </p>

          <div className="mt-6 border-t border-border/40 pt-5">
            <p className="text-xs text-muted-foreground">Parent project</p>
            {project ? (
              <Link href={`/projects/${project.id}`} className="group mt-2 flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold",
                    toneFor(project.category).tile
                  )}
                >
                  {project.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">
                    {project.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {project.category || "Project"}
                  </span>
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Standalone token. No project profile is linked in the catalog.
              </p>
            )}
            {project?.websiteUrl ? (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Official website <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          {ecosystemCount > 0 ? (
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {utilities.map((u) => (
                <li key={u.key}>
                  <Link
                    href={u.href}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[7rem_1fr_auto_auto]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{u.kind}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">
                        {u.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{u.detail}</span>
                    </span>
                    <span className="hidden items-center gap-3 sm:flex">
                      {u.emphasis ? (
                        <span className="font-mono text-sm font-semibold text-emerald-400">{u.emphasis}</span>
                      ) : null}
                      {u.status ? <StatusBadge status={u.status} /> : null}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    {/* On small screens status moves under the title */}
                    <span className="col-span-3 flex items-center gap-3 sm:hidden">
                      {u.emphasis ? (
                        <span className="font-mono text-sm font-semibold text-emerald-400">{u.emphasis}</span>
                      ) : null}
                      {u.status ? <StatusBadge status={u.status} /> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-y border-border/40 py-10 text-center">
              <p className="text-sm font-medium text-foreground">No campaigns linked</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No presale, fair launch, airdrop or staking pool in the catalog references {token.symbol}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Disclosure ───────────────────────────────────────────────────── */}
      <p className="mt-14 border-l-2 border-primary/40 pl-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">D-04: </span>
        {sepolia ? (
          <>
            Ethereum Sepolia (Chain ID 11155111) is the only network with wallet connectivity. Market figures and
            contract actions in this milestone are demonstrations.
          </>
        ) : (
          <>
            This token is cataloged on {token.network} for discovery only. Wallet connectivity is supported solely on
            Ethereum Sepolia, and market figures are demonstrations.
          </>
        )}
      </p>
    </div>
  );
}
