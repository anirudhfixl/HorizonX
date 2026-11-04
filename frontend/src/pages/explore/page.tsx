import "./explore-page.css";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { ExploreOrbitalHero } from "@/components/explore/orbital-explore-hero";
import AxleBloom from "@/components/explore/axle-bloom";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  TOKENS,
  PROJECTS,
  PRESALES,
  FAIR_LAUNCHES,
  AIRDROPS,
  STAKING_POOLS,
} from "@/data";
import {
  Coins,
  Briefcase,
  Rocket,
  Sparkles,
  Gift,
  Layers,
  Search,
  X,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

type CategoryFilter =
  | "all"
  | "tokens"
  | "projects"
  | "presales"
  | "launches"
  | "airdrops"
  | "staking";

type QuickFilter = "all" | "live" | "audited" | "ethereum";

export default function ExploreHubPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Category counts
  const categoryCounts = useMemo(
    () => ({
      tokens: TOKENS.length,
      projects: PROJECTS.length,
      presales: PRESALES.length,
      launches: FAIR_LAUNCHES.length,
      airdrops: AIRDROPS.length,
      staking: STAKING_POOLS.length,
      total:
        TOKENS.length +
        PROJECTS.length +
        PRESALES.length +
        FAIR_LAUNCHES.length +
        AIRDROPS.length +
        STAKING_POOLS.length,
    }),
    []
  );

  // Handle simulated refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setQuickFilter("all");
  };

  // Normalized search query
  const query = searchQuery.trim().toLowerCase();

  // Filtered Assets Computation
  const filteredTokens = useMemo(() => {
    return TOKENS.filter((t) => {
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.symbol.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query) ?? false) ||
        t.network.toLowerCase().includes(query);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? t.status === "active"
          : quickFilter === "audited"
          ? t.verificationStatus === "audit_available"
          : quickFilter === "ethereum"
          ? t.network.toLowerCase().includes("ethereum")
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query) ?? false);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? p.status === "active"
          : quickFilter === "audited"
          ? p.verificationStatus === "audit_available"
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  const filteredPresales = useMemo(() => {
    return PRESALES.filter((ps) => {
      const matchesSearch =
        !query ||
        ps.title.toLowerCase().includes(query) ||
        ps.network.toLowerCase().includes(query);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? ps.status === "live"
          : quickFilter === "ethereum"
          ? ps.network.toLowerCase().includes("ethereum")
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  const filteredLaunches = useMemo(() => {
    return FAIR_LAUNCHES.filter((fl) => {
      const matchesSearch =
        !query ||
        fl.title.toLowerCase().includes(query) ||
        fl.network.toLowerCase().includes(query);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? fl.status === "live"
          : quickFilter === "ethereum"
          ? fl.network.toLowerCase().includes("ethereum")
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  const filteredAirdrops = useMemo(() => {
    return AIRDROPS.filter((a) => {
      const matchesSearch =
        !query ||
        a.title.toLowerCase().includes(query) ||
        (a.description?.toLowerCase().includes(query) ?? false) ||
        a.network.toLowerCase().includes(query);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? a.status === "active"
          : quickFilter === "ethereum"
          ? a.network.toLowerCase().includes("ethereum")
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  const filteredStaking = useMemo(() => {
    return STAKING_POOLS.filter((s) => {
      const matchesSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.network.toLowerCase().includes(query);

      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "live"
          ? s.status === "active"
          : quickFilter === "ethereum"
          ? s.network.toLowerCase().includes("ethereum")
          : true;

      return matchesSearch && matchesQuick;
    });
  }, [query, quickFilter]);

  // Total matching count in active view
  const totalMatchingCount = useMemo(() => {
    let count = 0;
    if (activeCategory === "all" || activeCategory === "tokens") count += filteredTokens.length;
    if (activeCategory === "all" || activeCategory === "projects") count += filteredProjects.length;
    if (activeCategory === "all" || activeCategory === "presales") count += filteredPresales.length;
    if (activeCategory === "all" || activeCategory === "launches") count += filteredLaunches.length;
    if (activeCategory === "all" || activeCategory === "airdrops") count += filteredAirdrops.length;
    if (activeCategory === "all" || activeCategory === "staking") count += filteredStaking.length;
    return count;
  }, [
    activeCategory,
    filteredTokens.length,
    filteredProjects.length,
    filteredPresales.length,
    filteredLaunches.length,
    filteredAirdrops.length,
    filteredStaking.length,
  ]);

  const isFilteringActive = query.length > 0 || activeCategory !== "all" || quickFilter !== "all";

  // Snapshot figures are derived from the same data sets that feed the cards below,
  // so they can never drift from what the page actually lists.
  const topGainer = TOKENS.reduce((best, t) =>
    (t.market.priceChange24h ?? -Infinity) > (best.market.priceChange24h ?? -Infinity) ? t : best
  );
  const topGainerChange = topGainer.market.priceChange24h ?? 0;
  const livePresales = PRESALES.filter((p) => p.status === "live").length;
  const liveLaunches = FAIR_LAUNCHES.filter((l) => l.status === "live").length;
  const topPool = STAKING_POOLS.filter((p) => p.status === "active").reduce<
    (typeof STAKING_POOLS)[number] | null
  >((best, p) => (!best || (parseFloat(p.apy ?? "0") || 0) > (parseFloat(best.apy ?? "0") || 0) ? p : best), null);

  const countActive = (items: { status: string }[], ...live: string[]) =>
    items.filter((i) => live.includes(i.status)).length;

  // Atlas entries: every figure is derived from the same data sets used below.
  const atlas: {
    href: string;
    accent: Accent;
    icon: React.ReactNode;
    title: string;
    count: number;
    noun: string;
    description: string;
    note: string;
  }[] = [
    {
      href: "/explore/tokens",
      accent: "primary",
      icon: <Coins className="h-5 w-5" />,
      title: "Token Explorer",
      count: categoryCounts.tokens,
      noun: "tokens",
      description: "ERC-20 utility, governance, DePIN and AI compute tokens with contract details.",
      note: `Top 24h: ${topGainer.symbol} ${topGainerChange >= 0 ? "+" : ""}${topGainerChange}%`,
    },
    {
      href: "/explore/projects",
      accent: "cyan",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Project Directory",
      count: categoryCounts.projects,
      noun: "projects",
      description: "Protocol teams, foundations and infrastructure builders behind the tokens.",
      note: `${PROJECTS.filter((p) => p.verificationStatus === "audit_available").length} with audit available`,
    },
    {
      href: "/explore/presales",
      accent: "amber",
      icon: <Rocket className="h-5 w-5" />,
      title: "Presale Rounds",
      count: categoryCounts.presales,
      noun: "presales",
      description: "Early-stage fundraising rounds with soft and hard caps and a clear timeline.",
      note: `${livePresales} live now`,
    },
    {
      href: "/explore/launches",
      accent: "emerald",
      icon: <Sparkles className="h-5 w-5" />,
      title: "Fair Launches",
      count: categoryCounts.launches,
      noun: "launches",
      description: "Community-first liquidity distribution with no private seed allocation.",
      note: `${liveLaunches} live now`,
    },
    {
      href: "/explore/airdrops",
      accent: "rose",
      icon: <Gift className="h-5 w-5" />,
      title: "Airdrop Discovery",
      count: categoryCounts.airdrops,
      noun: "campaigns",
      description: "Reward campaigns, testnet incentives and merkle-tree distributions to claim.",
      note: `${countActive(AIRDROPS, "active")} active`,
    },
    {
      href: "/explore/staking",
      accent: "violet",
      icon: <Layers className="h-5 w-5" />,
      title: "Staking Vaults",
      count: categoryCounts.staking,
      noun: "pools",
      description: "Single-sided and multi-token pools with their APY and lock terms.",
      note: topPool ? `Top APY ${topPool.apy}` : "No active pools",
    },
  ];

  const categoryTabs: { key: CategoryFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: categoryCounts.total },
    { key: "tokens", label: "Tokens", count: categoryCounts.tokens },
    { key: "projects", label: "Projects", count: categoryCounts.projects },
    { key: "presales", label: "Presales", count: categoryCounts.presales },
    { key: "launches", label: "Fair Launches", count: categoryCounts.launches },
    { key: "airdrops", label: "Airdrops", count: categoryCounts.airdrops },
    { key: "staking", label: "Staking", count: categoryCounts.staking },
  ];

  const quickFilters: { key: QuickFilter; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: "All Assets" },
    { key: "live", label: "Live / Active", icon: <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> },
    { key: "audited", label: "Audited Only", icon: <ShieldCheck className="h-3 w-3 text-primary" /> },
    { key: "ethereum", label: "Ethereum / Sepolia" },
  ];

  const show = (cat: CategoryFilter) => activeCategory === "all" || activeCategory === cat;

  // Launchpad spotlight: prefer a live presale; the rest become compact rows.
  const featuredPresale = PRESALES.find((p) => p.status === "live") ?? PRESALES[0];
  const otherPresales = PRESALES.filter((p) => p.id !== featuredPresale?.id);

  return (
    <div className="explore-page">
      <ExploreOrbitalHero />
      <main
        id="explore-discovery-content"
        className="mx-auto w-full max-w-[1800px] space-y-14 px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-8"
      >
            {/* B. NEXORA-inspired discovery showcase: token rails framing the project spotlight. */}
            <section className="hx-discover-showcase" aria-label="Trending tokens and featured projects">
              <TokenMarketRail tokens={TOKENS} direction="right" railLabel="Trending Tokens" />
              <div className="hx-project-spotlight">
                <ProjectSpotlightWaves />
                <div className="hx-project-spotlight__fade-x" />
                <div className="hx-project-spotlight__fade-y" />
                <div className="hx-project-spotlight__inner">
                  <div className="hx-project-spotlight__projects hx-project-spotlight__wheel">
                    <AxleBloom />
                  </div>
                  <div className="hx-project-spotlight__intro">
                    <p className="hx-project-spotlight__eyebrow">The network builders</p>
                    <h2>Projects &amp; <span>Protocols</span></h2>
                    <p className="hx-project-spotlight__description">
                      Discover the teams building the infrastructure, applications and protocols
                      that connect the HorizonX ecosystem.
                    </p>
                    <div className="hx-project-spotlight__facts">
                      <div><span>Projects</span><strong>{categoryCounts.projects}</strong></div>
                      <div><span>Audits available</span><strong>{PROJECTS.filter((project) => project.verificationStatus === "audit_available").length}</strong></div>
                      <div><span>Ecosystems</span><strong>{new Set(PROJECTS.map((project) => project.ecosystem).filter(Boolean)).size}</strong></div>
                    </div>
                    <Link to="/explore/projects" className="hx-project-spotlight__all">
                      Explore all projects <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <TokenMarketRail tokens={TOKENS} direction="left" railLabel="Market Snapshot" />
            </section>

            {/* C. Launchpad: one featured raise with progress, the rest as compact rows */}
            <section className="hx-launchpad-opportunities" aria-labelledby="hx-launchpad-title">
              <div className="hx-launchpad-opportunities__header">
                <div className="hx-launchpad-opportunities__heading">
                  <span className="hx-launchpad-opportunities__kicker">Launchpad / Discover</span>
                  <h2 id="hx-launchpad-title"><Rocket aria-hidden="true" /> Launchpad Opportunities</h2>
                  <p>Capital raises, from capped presales to fair launches.</p>
                </div>
                <div className="hx-launchpad-opportunities__links">
                  <Link to="/explore/presales">All Presales <ArrowUpRight aria-hidden="true" /></Link>
                  <Link to="/explore/launches">All Launches <ArrowUpRight aria-hidden="true" /></Link>
                </div>
              </div>

              <div className="hx-launchpad-opportunities__grid">
                {featuredPresale && <FeaturedRaise ps={featuredPresale} />}
                <ul className="hx-launchpad-opportunities__list">
                  {otherPresales.slice(0, 3).map((ps) => (
                    <PresaleRow key={ps.id} ps={ps} />
                  ))}
                  {FAIR_LAUNCHES.slice(0, 2).map((fl) => (
                    <LaunchRow key={fl.id} fl={fl} />
                  ))}
                </ul>
              </div>
            </section>

            {/* D. Rewards & yield — NEXORA-inspired artwork mosaics. */}
            <section className="grid grid-cols-1 gap-12">
              <div className="hx-nx-discovery space-y-3">
                <SectionHead accent="rose" icon={<Gift className="h-4 w-4" />} title="Airdrop Discovery" href="/explore/airdrops" linkLabel={`All ${categoryCounts.airdrops} campaigns`} large />
                <AirdropMosaic campaigns={AIRDROPS.slice(0, 5)} />
              </div>
              <div className="hx-nx-discovery space-y-3">
                <SectionHead accent="violet" icon={<Layers className="h-4 w-4" />} title="Staking Vaults" href="/explore/staking" linkLabel={`All ${categoryCounts.staking} vaults`} large />
                <StakingMosaic pools={STAKING_POOLS.slice(0, 6)} />
              </div>
            </section>

            {/* E. Closing call to action: a single band, no nested boxes */}
            <section className="flex flex-col gap-6 border-t border-border/50 pt-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Build on HorizonX</p>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Ready to launch your token or list your protocol?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{CTA_COPY}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="h-10 bg-primary text-xs font-semibold text-primary-foreground">
                  <Link to="/tokens/create">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Create Token
                  </Link>
                </Button>
                {!isConnected ? (
                  <Button variant="outline" onClick={() => openModal("CONNECT_WALLET")} className="h-10 gap-1.5 border-border/60 text-xs">
                    <Wallet className="h-3.5 w-3.5 text-primary" /> Connect Wallet
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="h-10 border-border/60 text-xs">
                    <Link to="/launchpad/presales/create">Launch Presale</Link>
                  </Button>
                )}
              </div>
            </section>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page-local presentational helpers (no logic, no data of their own)  */
/* ------------------------------------------------------------------ */

type Accent = "primary" | "cyan" | "amber" | "emerald" | "rose" | "violet";

const ACCENTS: Record<Accent, { text: string; hoverText: string; iconBox: string; bar: string }> = {
  primary: { text: "text-primary", hoverText: "group-hover:text-primary", iconBox: "bg-primary/10 text-primary", bar: "bg-primary" },
  cyan: { text: "text-cyan-400", hoverText: "group-hover:text-cyan-400", iconBox: "bg-cyan-500/10 text-cyan-400", bar: "bg-cyan-400" },
  amber: { text: "text-amber-400", hoverText: "group-hover:text-amber-400", iconBox: "bg-amber-500/10 text-amber-400", bar: "bg-amber-400" },
  emerald: { text: "text-emerald-400", hoverText: "group-hover:text-emerald-400", iconBox: "bg-emerald-500/10 text-emerald-400", bar: "bg-emerald-400" },
  rose: { text: "text-rose-400", hoverText: "group-hover:text-rose-400", iconBox: "bg-rose-500/10 text-rose-400", bar: "bg-rose-400" },
  violet: { text: "text-violet-400", hoverText: "group-hover:text-violet-400", iconBox: "bg-violet-500/10 text-violet-400", bar: "bg-violet-400" },
};

const CTA_COPY =
  "Use our standardized creation wizards to deploy ERC-20 tokens, establish fair launches, or configure airdrop merkle distribution contracts on Ethereum Sepolia.";

/** Parses the leading number of strings such as "118.5 ETH"; null when absent. */
function amount(value?: string): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** 0..1 ratio only when both figures exist in the data and the divisor is positive. */
function ratio(part?: number | null, whole?: number | null): number | null {
  if (part == null || whole == null || whole <= 0) return null;
  return Math.min(1, Math.max(0, part / whole));
}

/** Deterministic (UTC) short date so server and client render identically. */
function shortDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

function Progress({ value, accent, label }: { value: number; accent: Accent; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80"
    >
      <div className={cn("h-full rounded-full", ACCENTS[accent].bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionHead({
  accent,
  icon,
  title,
  href,
  linkLabel,
  large,
}: {
  accent: Accent;
  icon: React.ReactNode;
  title: string;
  href: string;
  linkLabel: string;
  large?: boolean;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 pb-2">
      <h2 className={cn("flex items-center gap-2 font-bold text-foreground", large ? "text-lg" : "text-base")}>
        <span className={a.text}>{icon}</span>
        {title}
      </h2>
      <Link to={href} className={cn("inline-flex items-center gap-1 text-xs font-medium hover:underline", a.text)}>
        {linkLabel} <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function TokenMarketRail({
  tokens,
  direction,
  railLabel,
}: {
  tokens: (typeof TOKENS)[number][];
  direction: "left" | "right";
  railLabel: string;
}) {
  const formatCompact = (value?: number) => {
    if (value === undefined || value === null) return "—";
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const renderToken = (token: (typeof TOKENS)[number], duplicate = false) => {
    const change = token.market.priceChange24h ?? 0;
    const positive = change >= 0;
    const points = positive
      ? "1,20 6,16 11,18 16,10 21,13 26,7 31,11 36,5 41,9 47,3"
      : "1,4 6,8 11,6 16,14 21,11 26,19 31,16 36,22 41,18 47,26";

    return (
      <li key={`${duplicate ? "duplicate-" : ""}${token.id}`} className="hx-token-rail__item">
        <Link
          to={`/tokens/${token.id}`}
          tabIndex={duplicate ? -1 : undefined}
          aria-hidden={duplicate || undefined}
          aria-label={duplicate ? undefined : `${token.name} (${token.symbol}), market cap ${formatCompact(token.market.marketCap)}, ${positive ? "up" : "down"} ${Math.abs(change).toFixed(2)} percent in 24 hours`}
          className="hx-token-rail__card group"
        >
          <span className="hx-token-rail__top">
            <span className="hx-token-rail__identity">
              <span className="hx-token-rail__glyph" aria-hidden="true">{token.symbol.slice(0, 1)}</span>
              <span className="hx-token-rail__copy">
                <span className="hx-token-rail__name">{token.name}</span>
                <span className="hx-token-rail__symbol">${token.symbol}</span>
              </span>
            </span>
            <svg className={`hx-token-rail__spark ${positive ? "is-positive" : "is-negative"}`} viewBox="0 0 50 30" aria-hidden="true">
              <polyline points={points} fill="none" stroke={positive ? "#39d6a0" : "#fb7185"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hx-token-rail__metrics">
            <span className="hx-token-rail__price">${Number(token.market.price).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
            <span className={`hx-token-rail__change ${positive ? "is-positive" : "is-negative"}`}>
              {positive ? "▲" : "▼"} {positive ? "+" : ""}{change.toFixed(2)}%
            </span>
          </span>
          <ArrowUpRight className="hx-token-rail__arrow" aria-hidden="true" />
        </Link>
      </li>
    );
  };

  return (
    <section className={`hx-token-rail hx-token-rail--${direction}`} aria-label={railLabel}>
      <div className="hx-token-rail__heading">
        <div className="hx-token-rail__heading-copy">
          <span className="hx-token-rail__eyebrow"><span className="hx-token-rail__live-dot" /> MARKET WATCH <span className="hx-token-rail__eyebrow-divider" /> 24H PERFORMANCE</span>
          <h2>{railLabel}</h2>
          <p>Explore the assets drawing attention across the ecosystem.</p>
        </div>
        <Link to="/explore/tokens" className="hx-token-rail__all">View all {tokens.length} tokens <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      <div className="hx-token-rail__viewport" role="region" aria-label={`Automatically scrolling ${railLabel}`}>
        <div className="hx-token-rail__track">
          <ul className="hx-token-rail__group">{tokens.map((token) => renderToken(token))}</ul>
          <ul className="hx-token-rail__group" aria-hidden="true">{tokens.map((token) => renderToken(token, true))}</ul>
        </div>
      </div>
    </section>
  );
}

/** Local canvas port of NEXORA's Aceternity-style WavyBackground. */
function ProjectSpotlightWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let time = 0;
    let frame = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.save();
      context.filter = "blur(10px)";
      context.globalAlpha = 0.5;
      colors.forEach((color, index) => {
        context.beginPath();
        context.lineWidth = 50;
        context.strokeStyle = color;
        for (let x = 0; x <= width + 5; x += 5) {
          const nx = x / Math.max(width, 1);
          const y = height * 0.5
            + Math.sin(nx * 5.8 + time + index * 0.72) * (height * 0.105)
            + Math.sin(nx * 11.5 - time * 0.62 + index * 0.45) * (height * 0.035);
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      });
      context.restore();
    };

    const render = () => {
      time += 0.002;
      draw();
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hx-project-spotlight__canvas" aria-hidden="true" />;
}

function FeaturedRaise({ ps }: { ps: (typeof PRESALES)[number] }) {
  const raised = amount(ps.totalRaised);
  const hard = amount(ps.hardCap);
  const soft = amount(ps.softCap);
  const pct = ratio(raised, hard);
  const softPos = ratio(soft, hard);
  const ends = shortDate(ps.endTime);
  return (
    <Link to={`/launchpad/presales/${ps.id}`} className="hx-launch-featured group">
      <div className="hx-launch-featured__ambient" aria-hidden="true" />
      <div className="hx-launch-featured__top">
        <span className="hx-launch-featured__eyebrow">Featured presale</span>
        <StatusBadge status={ps.status} />
      </div>

      <div className="hx-launch-featured__identity">
        <span className="hx-launch-featured__token-mark" aria-hidden="true">{ps.tokenId.slice(0, 1).toUpperCase()}</span>
        <div>
          <h3>{ps.title}</h3>
          <p>{ps.description}</p>
        </div>
      </div>

      <div className="hx-launch-featured__bottom">
        <div className="hx-launch-featured__metrics">
          <div>
            <span className="hx-launch-featured__metric-label">Total raised</span>
            <strong>{ps.totalRaised ?? "—"}</strong>
          </div>
          <div className="hx-launch-featured__hardcap">
            <span className="hx-launch-featured__metric-label">Hard cap</span>
            <strong>{ps.hardCap ?? "—"}</strong>
          </div>
        </div>

        {pct !== null ? (
          <div className="hx-launch-featured__progress">
            <div className="hx-launch-featured__progress-track">
              <Progress value={pct} accent="violet" label={`${ps.title} raised toward hard cap`} />
              {softPos !== null && (
                <span
                  aria-hidden="true"
                  className="hx-launch-featured__soft-marker"
                  style={{ left: `${Math.round(softPos * 100)}%` }}
                />
              )}
            </div>
            <div className="hx-launch-featured__progress-meta">
              <span>{Math.round(pct * 100)}% of hard cap</span>
              {ps.softCap && <span>Soft cap {ps.softCap}</span>}
            </div>
          </div>
        ) : (
          <p className="hx-launch-featured__missing">Progress is unavailable: cap data is missing for this round.</p>
        )}

        <div className="hx-launch-featured__footer">
          <div>
            <span>{ps.network}</span>
            {typeof ps.participantCount === "number" && <span>{ps.participantCount.toLocaleString("en-US")} participants</span>}
            {ends && <span>Ends {ends}</span>}
          </div>
          <span className="hx-launch-featured__action">View presale room <ArrowRight aria-hidden="true" /></span>
        </div>
      </div>
    </Link>
  );
}

function RowShell({
  href,
  eyebrow,
  eyebrowAccent,
  status,
  title,
  children,
  right,
  rowClassName,
}: {
  href: string;
  eyebrow: string;
  eyebrowAccent: Accent;
  status: string;
  title: string;
  children?: React.ReactNode;
  right?: React.ReactNode;
  rowClassName?: string;
}) {
  const a = ACCENTS[eyebrowAccent];
  return (
    <li>
      <Link
        to={href}
        className={cn("group flex items-start justify-between gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-secondary/40", rowClassName)}
      >
        <span className="min-w-0 flex-1 space-y-2">
          <span className="flex items-center gap-2.5">
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", a.text)}>{eyebrow}</span>
            <StatusBadge status={status} />
          </span>
          <span className={cn("block truncate text-sm font-semibold text-foreground transition-colors", a.hoverText)}>
            {title}
          </span>
          {children}
        </span>
        {right && <span className="shrink-0 text-right">{right}</span>}
      </Link>
    </li>
  );
}

function PresaleRow({ ps }: { ps: (typeof PRESALES)[number] }) {
  const pct = ratio(amount(ps.totalRaised), amount(ps.hardCap));
  const start = shortDate(ps.startTime);
  return (
    <RowShell
      href={`/launchpad/presales/${ps.id}`}
      eyebrow="Presale"
      eyebrowAccent="violet"
      status={ps.status}
      title={ps.title}
      rowClassName="hx-launch-row hx-launch-row--presale"
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-sm font-semibold text-violet-300">{ps.totalRaised ?? "—"}</span>
          <span className="block font-mono text-[11px] text-muted-foreground">of {ps.hardCap ?? "—"}</span>
        </span>
      }
    >
      {pct !== null ? (
        <span className="block pr-2">
          <Progress value={pct} accent="violet" label={`${ps.title} raised toward hard cap`} />
        </span>
      ) : (
        start && <span className="block text-[11px] text-muted-foreground">Starts {start}</span>
      )}
      <span className="block text-[11px] text-muted-foreground">{ps.network}</span>
    </RowShell>
  );
}

function LaunchRow({ fl }: { fl: (typeof FAIR_LAUNCHES)[number] }) {
  return (
    <RowShell
      href={`/launchpad/launches/${fl.id}`}
      eyebrow="Fair launch"
      eyebrowAccent="cyan"
      status={fl.status}
      title={fl.title}
      rowClassName="hx-launch-row hx-launch-row--fair"
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-sm font-semibold text-cyan-300">{fl.tokenId.toUpperCase()}</span>
          <span className="block text-[11px] text-muted-foreground">token</span>
        </span>
      }
    >
      <span className="block text-[11px] text-muted-foreground">
        {fl.network}
        {typeof fl.participantCount === "number" && ` · ${fl.participantCount} participants`}
      </span>
    </RowShell>
  );
}

function CampaignStatus({ status }: { status: string }) {
  const label = status === "active" ? "Active" : status === "pending" ? "Pending" : status === "ended" ? "Ended" : status === "draft" ? "Draft" : status;
  return (
    <span className={`hx-nx-status hx-nx-status--${status}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

function AirdropMosaic({ campaigns }: { campaigns: (typeof AIRDROPS)[number][] }) {
  return (
    <ul className="hx-nx-airdrop-grid" aria-label="Featured airdrop campaigns">
      {campaigns.map((air, index) => {
        const claimed = ratio(air.claimedCount, air.recipientCount);
        return (
          <li key={air.id} className={`hx-nx-art-tile hx-nx-airdrop-tile hx-nx-airdrop-tile--${index}`}>
            <Link to={`/airdrops/campaigns/${air.id}`} className="hx-nx-art-link">
              <span className="hx-nx-artwork" aria-hidden="true" />
              <span className="hx-nx-art-scrim" aria-hidden="true" />
              <ArrowUpRight className="hx-nx-art-arrow" aria-hidden="true" />
              <span className="hx-nx-art-copy">
                <span className="hx-nx-art-meta">
                  <span className="hx-nx-art-kicker">{air.type.replace(/-/g, " ")} distribution</span>
                  <CampaignStatus status={air.status} />
                </span>
                <span className="hx-nx-art-title">{air.title}</span>
                {index === 0 && air.description ? <span className="hx-nx-art-description">{air.description}</span> : null}
                <span className="hx-nx-art-bottom">
                  <span className="hx-nx-art-value">{air.totalReward ?? "Reward details unavailable"}</span>
                  <span className="hx-nx-art-network">{air.network}</span>
                </span>
                {claimed !== null ? (
                  <span className="hx-nx-art-progress">
                    <span className="hx-nx-art-progress-track"><span style={{ width: `${Math.round(claimed * 100)}%` }} /></span>
                    <span className="hx-nx-art-progress-label">{(air.claimedCount ?? 0).toLocaleString()} of {(air.recipientCount ?? 0).toLocaleString()} claimed</span>
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function StakingMosaic({ pools }: { pools: (typeof STAKING_POOLS)[number][] }) {
  return (
    <ul className="hx-nx-staking-grid" aria-label="Featured staking vaults">
      {pools.map((pool, index) => {
        const lock = (pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} day lock` : "Flexible unlock";
        return (
          <li key={pool.id} className={`hx-nx-art-tile hx-nx-staking-tile hx-nx-staking-tile--${index}`}>
            <Link to={`/staking/pools/${pool.id}`} className="hx-nx-art-link">
              <span className="hx-nx-artwork" aria-hidden="true" />
              <span className="hx-nx-art-scrim" aria-hidden="true" />
              <ArrowUpRight className="hx-nx-art-arrow" aria-hidden="true" />
              <span className="hx-nx-art-copy">
                <span className="hx-nx-art-meta">
                  <span className="hx-nx-art-kicker">{pool.category ?? "Staking pool"}</span>
                  <CampaignStatus status={pool.status} />
                </span>
                <span className="hx-nx-art-title">{pool.name}</span>
                <span className="hx-nx-staking-apy">{pool.apy ?? "—"}<small>APY</small></span>
                <span className="hx-nx-art-bottom">
                  <span className="hx-nx-art-value">{pool.totalStaked ?? "Staked amount unavailable"}</span>
                  <span className="hx-nx-art-network">{lock}</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function AirdropRow({ air }: { air: (typeof AIRDROPS)[number] }) {
  const claimed = ratio(air.claimedCount, air.recipientCount);
  return (
    <RowShell
      href={`/airdrops/campaigns/${air.id}`}
      eyebrow={`${air.type} distribution`}
      eyebrowAccent="rose"
      status={air.status}
      title={air.title}
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-sm font-bold text-emerald-400">{air.totalReward ?? "—"}</span>
          <span className="block text-[11px] text-rose-400">Claim portal →</span>
        </span>
      }
    >
      {claimed !== null ? (
        <span className="block space-y-1 pr-2">
          <Progress value={claimed} accent="rose" label={`${air.title} claimed`} />
          <span className="block font-mono text-[11px] text-muted-foreground">
            {air.claimedCount} of {air.recipientCount} claimed
          </span>
        </span>
      ) : (
        air.description && <span className="line-clamp-1 block text-[11px] text-muted-foreground">{air.description}</span>
      )}
    </RowShell>
  );
}

function StakingRow({ pool }: { pool: (typeof STAKING_POOLS)[number] }) {
  const lock = (pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} days lock` : "Flexible unlock";
  return (
    <RowShell
      href={`/staking/pools/${pool.id}`}
      eyebrow="Staking pool"
      eyebrowAccent="violet"
      status={pool.status}
      title={pool.name}
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-xl font-bold leading-none text-emerald-400">{pool.apy ?? "—"}</span>
          <span className="block text-[11px] text-muted-foreground">APY</span>
        </span>
      }
    >
      <span className="block text-[11px] text-muted-foreground">
        {lock}
        {pool.totalStaked && ` · ${pool.totalStaked} staked`}
      </span>
    </RowShell>
  );
}
