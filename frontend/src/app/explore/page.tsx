"use client";

import React, { useState, useMemo } from "react";
import { ExploreOrbitalHero } from "@/components/explore/orbital-explore-hero";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  MOCK_TOKENS,
  MOCK_PROJECTS,
  MOCK_PRESALES,
  MOCK_FAIR_LAUNCHES,
  MOCK_AIRDROPS,
  MOCK_STAKING_POOLS,
} from "@/lib/mock-data";
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
      tokens: MOCK_TOKENS.length,
      projects: MOCK_PROJECTS.length,
      presales: MOCK_PRESALES.length,
      launches: MOCK_FAIR_LAUNCHES.length,
      airdrops: MOCK_AIRDROPS.length,
      staking: MOCK_STAKING_POOLS.length,
      total:
        MOCK_TOKENS.length +
        MOCK_PROJECTS.length +
        MOCK_PRESALES.length +
        MOCK_FAIR_LAUNCHES.length +
        MOCK_AIRDROPS.length +
        MOCK_STAKING_POOLS.length,
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
    return MOCK_TOKENS.filter((t) => {
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
    return MOCK_PROJECTS.filter((p) => {
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
    return MOCK_PRESALES.filter((ps) => {
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
    return MOCK_FAIR_LAUNCHES.filter((fl) => {
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
    return MOCK_AIRDROPS.filter((a) => {
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
    return MOCK_STAKING_POOLS.filter((s) => {
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
  const topGainer = MOCK_TOKENS.reduce((best, t) =>
    (t.market.priceChange24h ?? -Infinity) > (best.market.priceChange24h ?? -Infinity) ? t : best
  );
  const topGainerChange = topGainer.market.priceChange24h ?? 0;
  const livePresales = MOCK_PRESALES.filter((p) => p.status === "live").length;
  const liveLaunches = MOCK_FAIR_LAUNCHES.filter((l) => l.status === "live").length;
  const topPool = MOCK_STAKING_POOLS.filter((p) => p.status === "active").reduce<
    (typeof MOCK_STAKING_POOLS)[number] | null
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
      href: "/tokens",
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
      note: `${MOCK_PROJECTS.filter((p) => p.verificationStatus === "audit_available").length} with audit available`,
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
      note: `${countActive(MOCK_AIRDROPS, "active")} active`,
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
  const featuredPresale = MOCK_PRESALES.find((p) => p.status === "live") ?? MOCK_PRESALES[0];
  const otherPresales = MOCK_PRESALES.filter((p) => p.id !== featuredPresale?.id);

  return (
    <>
      <ExploreOrbitalHero />
      <div
        id="explore-discovery-content"
        className="mx-auto w-full max-w-[1800px] space-y-14 px-4 py-10 sm:px-6 lg:px-8"
      >
        {/* 1. Masthead: one title line, one notice line, one pulse line */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Explore</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Discovery Hub</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Six ways into the ProMiners ecosystem. Search everything at once, or jump straight into a sector.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 gap-1.5 border-border/60 text-xs hover:bg-secondary/60"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")} />
                <span>Refresh Index</span>
              </Button>
              <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
                <Link href="/tokens/create">
                  <Plus className="h-3.5 w-3.5" /> Deploy Token
                </Link>
              </Button>
            </div>
          </div>

          <p
            role="note"
            className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              <strong className="font-semibold text-foreground">Phase 1 demonstration environment.</strong> Discovery
              telemetry and asset metrics are simulated from centralized mock models. Live on-chain indexing and pricing
              feeds will be integrated in subsequent phases.
            </span>
          </p>
        </header>

        {/* 2. Search: the primary action of the page */}
        <section aria-label="Search and filter" className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens, projects, presales, airdrops, vaults (e.g., 'PMIN', 'Aurora', 'Ethereum')..."
              aria-label="Search discovery assets"
              className="h-14 w-full rounded-2xl bg-secondary/40 pl-12 pr-12 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-border/60 transition focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Category tabs: horizontal scroll on small screens */}
            <div
              className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0"
              role="group"
              aria-label="Category filter"
            >
              {categoryTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveCategory(t.key)}
                  aria-pressed={activeCategory === t.key}
                  className={cn(
                    "shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                    activeCategory === t.key
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label} <span className="font-mono opacity-60">{t.count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick filters">
              {quickFilters.map((f) => (
                <button
                  key={f.key}
                  aria-pressed={quickFilter === f.key}
                  onClick={() => setQuickFilter(f.key)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs transition-colors",
                    quickFilter === f.key
                      ? "bg-primary/15 font-semibold text-primary ring-1 ring-primary/40"
                      : "text-muted-foreground ring-1 ring-border/60 hover:text-foreground hover:ring-border"
                  )}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {isFilteringActive && (
            <div
              className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
              aria-live="polite"
            >
              <span>
                Showing <strong className="text-foreground">{totalMatchingCount}</strong> matching assets
                {query && <span> for &ldquo;{query}&rdquo;</span>}
                {quickFilter !== "all" && <span> with filter [{quickFilter}]</span>}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 gap-1 text-xs text-primary hover:bg-primary/10 hover:text-primary/80"
              >
                <X className="h-3 w-3" /> Clear All Filters
              </Button>
            </div>
          )}
        </section>

        {/* 3. Results / default atlas */}
        {totalMatchingCount === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8 text-primary/70" />}
            title="No discovery assets match your criteria"
            description={
              query
                ? `We couldn't find any tokens, projects, or campaigns matching "${searchQuery}". Try loosening your search terms or resetting filters.`
                : "Nothing matches the selected category and filter combination. Try a different filter or reset them."
            }
            action={
              <Button onClick={resetFilters} size="sm" className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
                <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
              </Button>
            }
          />
        ) : isFilteringActive ? (
          <div className="space-y-12">
            {show("tokens") && filteredTokens.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="primary" icon={<Coins className="h-4 w-4" />} title={`Matching Tokens (${filteredTokens.length})`} href="/tokens" linkLabel="Full Token Directory" />
                <TokenTable tokens={filteredTokens} />
              </section>
            )}
            {show("projects") && filteredProjects.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="cyan" icon={<Briefcase className="h-4 w-4" />} title={`Matching Projects (${filteredProjects.length})`} href="/explore/projects" linkLabel="Full Project Directory" />
                <ProjectList projects={filteredProjects} />
              </section>
            )}
            {show("presales") && filteredPresales.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="amber" icon={<Rocket className="h-4 w-4" />} title={`Matching Presales (${filteredPresales.length})`} href="/explore/presales" linkLabel="All Presales" />
                <ul className="divide-y divide-border/40">
                  {filteredPresales.map((ps) => (
                    <PresaleRow key={ps.id} ps={ps} />
                  ))}
                </ul>
              </section>
            )}
            {show("launches") && filteredLaunches.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="emerald" icon={<Sparkles className="h-4 w-4" />} title={`Matching Fair Launches (${filteredLaunches.length})`} href="/explore/launches" linkLabel="All Launches" />
                <ul className="divide-y divide-border/40">
                  {filteredLaunches.map((fl) => (
                    <LaunchRow key={fl.id} fl={fl} />
                  ))}
                </ul>
              </section>
            )}
            {show("airdrops") && filteredAirdrops.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="rose" icon={<Gift className="h-4 w-4" />} title={`Matching Airdrops (${filteredAirdrops.length})`} href="/explore/airdrops" linkLabel="All Airdrops" />
                <ul className="divide-y divide-border/40">
                  {filteredAirdrops.map((air) => (
                    <AirdropRow key={air.id} air={air} />
                  ))}
                </ul>
              </section>
            )}
            {show("staking") && filteredStaking.length > 0 && (
              <section className="space-y-2">
                <SectionHead accent="violet" icon={<Layers className="h-4 w-4" />} title={`Matching Staking Pools (${filteredStaking.length})`} href="/explore/staking" linkLabel="All Staking Pools" />
                <ul className="divide-y divide-border/40">
                  {filteredStaking.map((pool) => (
                    <StakingRow key={pool.id} pool={pool} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-20">
            {/* A. The atlas: six sectors as an editorial index, not six cards */}
            <section aria-labelledby="explore-atlas" className="space-y-2">
              <h2 id="explore-atlas" className="sr-only">
                Discovery sectors
              </h2>
              <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-14">
                {atlas.map((s, i) => {
                  const a = ACCENTS[s.accent];
                  return (
                    <li key={s.href} className="border-t border-border/50 last:border-b lg:[&:nth-last-child(2)]:border-b">
                      <Link href={s.href} className="group relative flex items-start gap-4 py-6 sm:gap-5">
                        <span className="w-6 pt-1 font-mono text-xs text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                        <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", a.iconBox)}>
                          {s.icon}
                        </span>
                        <span className="min-w-0 flex-1 space-y-1">
                          <span className={cn("block text-lg font-semibold text-foreground transition-colors", a.hoverText)}>
                            {s.title}
                          </span>
                          <span className="block text-sm leading-relaxed text-muted-foreground">{s.description}</span>
                          <span className={cn("block pt-1 font-mono text-[11px]", a.text)}>{s.note}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1 text-right">
                          <span className="font-mono text-2xl font-semibold leading-none text-foreground">{s.count}</span>
                          <span className="text-[11px] text-muted-foreground">{s.noun}</span>
                          <ArrowRight className={cn("mt-2 h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1", a.hoverText)} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* B. Markets & builders: a market table beside a project list */}
            <section className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-16">
              <div className="space-y-2">
                <SectionHead accent="primary" icon={<Coins className="h-4 w-4" />} title="Featured Tokens" href="/tokens" linkLabel={`All ${categoryCounts.tokens} tokens`} large />
                <TokenTable tokens={MOCK_TOKENS} />
              </div>
              <div className="space-y-2">
                <SectionHead accent="cyan" icon={<Briefcase className="h-4 w-4" />} title="Projects & Protocols" href="/explore/projects" linkLabel={`All ${categoryCounts.projects} projects`} large />
                <ProjectList projects={MOCK_PROJECTS.slice(0, 6)} showTokens />
              </div>
            </section>

            {/* C. Launchpad: one featured raise with progress, the rest as compact rows */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Rocket className="h-4 w-4 text-amber-400" /> Launchpad Opportunities
                  </h2>
                  <p className="text-xs text-muted-foreground">Capital raises, from capped presales to fair launches.</p>
                </div>
                <div className="flex items-center gap-5 text-xs font-medium">
                  <Link href="/explore/presales" className="text-amber-400 hover:underline">
                    All Presales →
                  </Link>
                  <Link href="/explore/launches" className="text-emerald-400 hover:underline">
                    All Launches →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
                {featuredPresale && <FeaturedRaise ps={featuredPresale} />}
                <ul className="divide-y divide-border/40 self-start">
                  {otherPresales.slice(0, 3).map((ps) => (
                    <PresaleRow key={ps.id} ps={ps} />
                  ))}
                  {MOCK_FAIR_LAUNCHES.slice(0, 2).map((fl) => (
                    <LaunchRow key={fl.id} fl={fl} />
                  ))}
                </ul>
              </div>
            </section>

            {/* D. Rewards & yield */}
            <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-2">
                <SectionHead accent="rose" icon={<Gift className="h-4 w-4" />} title="Airdrop Discovery" href="/explore/airdrops" linkLabel={`All ${categoryCounts.airdrops} campaigns`} large />
                <ul className="divide-y divide-border/40">
                  {MOCK_AIRDROPS.slice(0, 5).map((air) => (
                    <AirdropRow key={air.id} air={air} />
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <SectionHead accent="violet" icon={<Layers className="h-4 w-4" />} title="Staking Vaults" href="/explore/staking" linkLabel={`All ${categoryCounts.staking} vaults`} large />
                <ul className="divide-y divide-border/40">
                  {MOCK_STAKING_POOLS.slice(0, 5).map((pool) => (
                    <StakingRow key={pool.id} pool={pool} />
                  ))}
                </ul>
              </div>
            </section>

            {/* E. Closing call to action: a single band, no nested boxes */}
            <section className="flex flex-col gap-6 border-t border-border/50 pt-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Build on ProMiners</p>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Ready to launch your token or list your protocol?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{CTA_COPY}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="h-10 bg-primary text-xs font-semibold text-primary-foreground">
                  <Link href="/tokens/create">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Create Token
                  </Link>
                </Button>
                {!isConnected ? (
                  <Button variant="outline" onClick={() => openModal("CONNECT_WALLET")} className="h-10 gap-1.5 border-border/60 text-xs">
                    <Wallet className="h-3.5 w-3.5 text-primary" /> Connect Wallet
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="h-10 border-border/60 text-xs">
                    <Link href="/launchpad/presales/create">Launch Presale</Link>
                  </Button>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
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
      <Link href={href} className={cn("inline-flex items-center gap-1 text-xs font-medium hover:underline", a.text)}>
        {linkLabel} <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function Monogram({ label, accent }: { label: string; accent: Accent }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold",
        ACCENTS[accent].iconBox
      )}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}

function TokenTable({ tokens }: { tokens: (typeof MOCK_TOKENS)[number][] }) {
  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,2fr)_1.2fr_1fr_0.9fr] gap-4 border-b border-border/50 px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:grid">
        <span>Token</span>
        <span>Network</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h</span>
      </div>
      <ul className="divide-y divide-border/40">
        {tokens.map((token) => {
          const change = token.market.priceChange24h || 0;
          return (
            <li key={token.id}>
              <Link
                href={`/tokens/${token.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-secondary/40 md:grid-cols-[minmax(0,2fr)_1.2fr_1fr_0.9fr]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Monogram label={token.symbol} accent="primary" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {token.name}
                    </span>
                    <span className="block truncate font-mono text-[11px] text-muted-foreground">
                      {token.symbol} · <span className="capitalize">{token.standard}</span>
                    </span>
                  </span>
                </span>
                <span className="hidden truncate text-xs text-muted-foreground md:block">{token.network}</span>
                <span className="text-right font-mono text-sm font-semibold text-foreground">${token.market.price}</span>
                <span className={cn("text-right font-mono text-xs", change >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {change >= 0 ? "+" : ""}
                  {token.market.priceChange24h}%
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProjectList({ projects, showTokens }: { projects: (typeof MOCK_PROJECTS)[number][]; showTokens?: boolean }) {
  return (
    <ul className="divide-y divide-border/40">
      {projects.map((proj) => (
        <li key={proj.id}>
          <Link
            href={`/projects/${proj.id}`}
            className="group flex items-start gap-3 rounded-lg px-3 py-3.5 transition-colors hover:bg-secondary/40"
          >
            <Monogram label={proj.name} accent="cyan" />
            <span className="min-w-0 flex-1 space-y-1">
              <span className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-cyan-400">
                  {proj.name}
                </span>
                {proj.verificationStatus === "audit_available" && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Audit available
                  </span>
                )}
              </span>
              <span className="line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{proj.description}</span>
              {showTokens && proj.tokenIds.length > 0 && (
                <span className="flex flex-wrap gap-1.5 pt-0.5">
                  {proj.tokenIds.map((t) => (
                    <span key={t} className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      ${t.toUpperCase()}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeaturedRaise({ ps }: { ps: (typeof MOCK_PRESALES)[number] }) {
  const raised = amount(ps.totalRaised);
  const hard = amount(ps.hardCap);
  const soft = amount(ps.softCap);
  const pct = ratio(raised, hard);
  const softPos = ratio(soft, hard);
  const ends = shortDate(ps.endTime);
  return (
    <Link
      href={`/launchpad/presales/${ps.id}`}
      className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/[0.10] via-card/60 to-transparent p-6 shadow-[0_20px_60px_-30px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/20 transition hover:ring-amber-500/50 sm:p-8"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">Featured presale</span>
          <StatusBadge status={ps.status} />
        </div>
        <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">{ps.title}</h3>
        {ps.description && <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{ps.description}</p>}
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">Total raised</div>
            <div className="font-mono text-3xl font-bold text-foreground">{ps.totalRaised ?? "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Hard cap</div>
            <div className="font-mono text-lg font-semibold text-muted-foreground">{ps.hardCap ?? "—"}</div>
          </div>
        </div>

        {pct !== null ? (
          <div className="space-y-1.5">
            <div className="relative">
              <Progress value={pct} accent="amber" label={`${ps.title} raised toward hard cap`} />
              {softPos !== null && (
                <span
                  aria-hidden
                  className="absolute -top-1 h-3.5 w-px bg-foreground/60"
                  style={{ left: `${Math.round(softPos * 100)}%` }}
                />
              )}
            </div>
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>{Math.round(pct * 100)}% of hard cap</span>
              {ps.softCap && <span>Soft cap {ps.softCap}</span>}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Progress is unavailable: cap data is missing for this round.</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{ps.network}</span>
            {typeof ps.participantCount === "number" && <span>{ps.participantCount} participants</span>}
            {ends && <span>Ends {ends}</span>}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
            View presale room <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
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
}: {
  href: string;
  eyebrow: string;
  eyebrowAccent: Accent;
  status: string;
  title: string;
  children?: React.ReactNode;
  right?: React.ReactNode;
}) {
  const a = ACCENTS[eyebrowAccent];
  return (
    <li>
      <Link
        href={href}
        className="group flex items-start justify-between gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-secondary/40"
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

function PresaleRow({ ps }: { ps: (typeof MOCK_PRESALES)[number] }) {
  const pct = ratio(amount(ps.totalRaised), amount(ps.hardCap));
  const start = shortDate(ps.startTime);
  return (
    <RowShell
      href={`/launchpad/presales/${ps.id}`}
      eyebrow="Presale"
      eyebrowAccent="amber"
      status={ps.status}
      title={ps.title}
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-sm font-semibold text-amber-400">{ps.totalRaised ?? "—"}</span>
          <span className="block font-mono text-[11px] text-muted-foreground">of {ps.hardCap ?? "—"}</span>
        </span>
      }
    >
      {pct !== null ? (
        <span className="block pr-2">
          <Progress value={pct} accent="amber" label={`${ps.title} raised toward hard cap`} />
        </span>
      ) : (
        start && <span className="block text-[11px] text-muted-foreground">Starts {start}</span>
      )}
      <span className="block text-[11px] text-muted-foreground">{ps.network}</span>
    </RowShell>
  );
}

function LaunchRow({ fl }: { fl: (typeof MOCK_FAIR_LAUNCHES)[number] }) {
  return (
    <RowShell
      href={`/launchpad/launches/${fl.id}`}
      eyebrow="Fair launch"
      eyebrowAccent="emerald"
      status={fl.status}
      title={fl.title}
      right={
        <span className="block space-y-0.5">
          <span className="block font-mono text-sm font-semibold text-emerald-400">{fl.tokenId.toUpperCase()}</span>
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

function AirdropRow({ air }: { air: (typeof MOCK_AIRDROPS)[number] }) {
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

function StakingRow({ pool }: { pool: (typeof MOCK_STAKING_POOLS)[number] }) {
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
