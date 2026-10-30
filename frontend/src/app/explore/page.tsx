"use client";

import React, { useState, useMemo } from "react";
import { ExploreOrbitalHero } from "@/components/explore/orbital-explore-hero";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
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
  Compass,
  Coins,
  Briefcase,
  Rocket,
  Sparkles,
  Gift,
  Layers,
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Plus,
  RefreshCw,
  Wallet,
  CheckCircle2,
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

  const stats: { label: string; value: string; note: string; icon: React.ReactNode; change?: string }[] = [
    {
      label: "Indexed Ecosystem Assets",
      value: `${categoryCounts.total} Assets`,
      note: "Across 6 Discovery Categories",
      icon: <Compass className="h-4 w-4 text-primary" />,
    },
    {
      label: "Top Gaining Token",
      value: "+14.2%",
      change: "PMIN",
      note: "ProMiners Governance ($1.48)",
      icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    },
    {
      label: "Active Launchpad Deals",
      value: `${categoryCounts.presales + categoryCounts.launches} Sales`,
      note: "1 Live Presale • 1 Fair Launch",
      icon: <Rocket className="h-4 w-4 text-amber-400" />,
    },
    {
      label: "Max Staking APY",
      value: "38.2%",
      change: "AURA",
      note: "Single-sided & LP Vaults",
      icon: <Layers className="h-4 w-4 text-violet-400" />,
    },
  ];

  const categoryTabs: { key: CategoryFilter; label: string; count: number }[] = [
    { key: "all", label: "All Categories", count: categoryCounts.total },
    { key: "tokens", label: "Tokens", count: categoryCounts.tokens },
    { key: "projects", label: "Projects", count: categoryCounts.projects },
    { key: "presales", label: "Presales", count: categoryCounts.presales },
    { key: "launches", label: "Fair Launches", count: categoryCounts.launches },
    { key: "airdrops", label: "Airdrops", count: categoryCounts.airdrops },
    { key: "staking", label: "Staking Pools", count: categoryCounts.staking },
  ];

  const quickFilters: { key: QuickFilter; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: "All Assets" },
    { key: "live", label: "Live / Active", icon: <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> },
    { key: "audited", label: "Audited Only", icon: <ShieldCheck className="h-3 w-3 text-primary" /> },
    { key: "ethereum", label: "Ethereum / Sepolia" },
  ];

  const categoryCards: {
    href: string;
    accent: Accent;
    icon: React.ReactNode;
    title: string;
    count: string;
    description: string;
    cta: string;
  }[] = [
    {
      href: "/explore/tokens",
      accent: "primary",
      icon: <Coins className="h-5 w-5" />,
      title: "Token Explorer",
      count: `${categoryCounts.tokens} Tokens`,
      description: "Browse ERC-20 utility, governance, DePIN, and AI compute tokens with verified smart contracts.",
      cta: "Explore Tokens",
    },
    {
      href: "/explore/projects",
      accent: "cyan",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Project Directory",
      count: `${categoryCounts.projects} Projects`,
      description: "Discover verified decentralized foundations, protocol teams, and infrastructure builders.",
      cta: "View Directory",
    },
    {
      href: "/explore/presales",
      accent: "amber",
      icon: <Rocket className="h-5 w-5" />,
      title: "Presale Rounds",
      count: `${categoryCounts.presales} Presales`,
      description:
        "Participate in vetted early-stage fundraising rounds with transparent soft/hard caps and timeline monitoring.",
      cta: "Discover Presales",
    },
    {
      href: "/explore/launches",
      accent: "emerald",
      icon: <Sparkles className="h-5 w-5" />,
      title: "Fair Launches",
      count: `${categoryCounts.launches} Launches`,
      description: "Community-first liquidity distribution with zero private seed allocation and anti-snipe safeguards.",
      cta: "View Fair Launches",
    },
    {
      href: "/explore/airdrops",
      accent: "rose",
      icon: <Gift className="h-5 w-5" />,
      title: "Airdrop Discovery",
      count: `${categoryCounts.airdrops} Campaigns`,
      description:
        "Claim verified rewards, testnet incentives, referral pools, and cryptographic merkle tree distributions.",
      cta: "Explore Airdrops",
    },
    {
      href: "/explore/staking",
      accent: "violet",
      icon: <Layers className="h-5 w-5" />,
      title: "Staking Vaults",
      count: `${categoryCounts.staking} Pools`,
      description:
        "Earn automated protocol yields and liquidity mining rewards across single-sided and multi-token pools.",
      cta: "Explore Staking",
    },
  ];

  const show = (cat: CategoryFilter) => activeCategory === "all" || activeCategory === cat;

  return (
    <>
      <ExploreOrbitalHero />
      <div
        id="explore-discovery-content"
        className="mx-auto w-full max-w-[1800px] space-y-12 px-4 py-10 sm:px-6 lg:px-8"
      >
        {/* 1. Header, actions & demonstration notice */}
        <header className="space-y-4">
          <PageHeader
            title="Discovery Hub"
            description="Explore verified tokens, emergent protocols, launchpad sales, airdrop campaigns, and high-yield staking vaults across the ProMiners ecosystem."
            breadcrumbs={[{ label: "Explore" }]}
            actions={
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-9 gap-1.5 border-border/60 text-xs hover:bg-secondary/60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
                  <span>Refresh Index</span>
                </Button>
                <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
                  <Link href="/tokens/create">
                    <Plus className="h-3.5 w-3.5" /> Deploy Token
                  </Link>
                </Button>
              </div>
            }
          />

          <div
            role="note"
            className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-foreground">Phase 1 Demonstration Environment:</strong> Discovery telemetry and
              asset metrics are simulated from centralized mock models. Live on-chain indexing and pricing feeds will be
              integrated in subsequent phases.
            </span>
          </div>
        </header>

        {/* 2. Ecosystem snapshot: one divided strip instead of four boxed cards */}
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "space-y-1.5 p-4 sm:p-5",
                i % 2 === 1 && "border-l border-border/50",
                i >= 2 && "border-t border-border/50 lg:border-t-0",
                i > 0 && "lg:border-l lg:border-border/50"
              )}
            >
              <dt className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {s.icon}
                <span className="truncate">{s.label}</span>
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">{s.value}</span>
                {s.change && (
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    {s.change}
                  </span>
                )}
              </dd>
              <p className="text-xs text-muted-foreground/80">{s.note}</p>
            </div>
          ))}
        </dl>

        {/* 3. Discovery categories */}
        <section aria-labelledby="explore-categories" className="space-y-5">
          <SectionTitle
            id="explore-categories"
            title="Discovery Categories"
            description="Select a category to explore dedicated directories and launch modules."
            aside="6 Specialized Sectors"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map((c) => {
              const a = ACCENTS[c.accent];
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={cn(
                    "group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 transition-all hover:bg-card/90 hover:shadow-lg",
                    a.hoverBorder
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
                        a.iconBox
                      )}
                    >
                      {c.icon}
                    </div>
                    <span className="rounded-full border border-border/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {c.count}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3 className={cn("text-base font-bold text-foreground transition-colors", a.hoverText)}>{c.title}</h3>
                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs font-semibold", a.text)}>
                    <span>{c.cta}</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Search & filters: a single toolbar, no nested boxes */}
        <section aria-label="Search and filter" className="space-y-4 border-y border-border/50 py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-2xl flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tokens, projects, presales, airdrops, vaults (e.g., 'PMIN', 'Aurora', 'Ethereum')..."
                aria-label="Search discovery assets"
                className="h-11 w-full rounded-xl border border-border/70 bg-secondary/30 pl-10 pr-10 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick filters">
              <span className="mr-1 hidden text-xs font-medium text-muted-foreground xl:inline">Filter By:</span>
              {quickFilters.map((f) => (
                <Button
                  key={f.key}
                  variant={quickFilter === f.key ? "default" : "outline"}
                  size="sm"
                  aria-pressed={quickFilter === f.key}
                  onClick={() => setQuickFilter(f.key)}
                  className="h-9 gap-1.5 border-border/60 text-xs"
                >
                  {f.icon}
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category tabs: horizontal scroll on small screens, wrap on desktop */}
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            role="group"
            aria-label="Category filter"
          >
            {categoryTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveCategory(t.key)}
                aria-pressed={activeCategory === t.key}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  activeCategory === t.key
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {t.label} <span className="font-mono opacity-80">({t.count})</span>
              </button>
            ))}
          </div>

          {isFilteringActive && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground" aria-live="polite">
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

        {/* 5. Results: empty state, filtered results, or curated showcase */}
        {totalMatchingCount === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8 text-primary/70" />}
            title="No discovery assets match your criteria"
            description={`We couldn't find any tokens, projects, or campaigns matching "${searchQuery}". Try loosening your search terms or resetting filters.`}
            action={
              <Button onClick={resetFilters} size="sm" className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
                <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
              </Button>
            }
          />
        ) : isFilteringActive ? (
          <div className="space-y-12">
            {show("tokens") && filteredTokens.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="primary"
                  icon={<Coins className="h-4 w-4" />}
                  title={`Matching Tokens (${filteredTokens.length})`}
                  href="/explore/tokens"
                  linkLabel="View Full Token Explorer →"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredTokens.map((token) => (
                    <TokenCard key={token.id} token={token} />
                  ))}
                </div>
              </section>
            )}

            {show("projects") && filteredProjects.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="cyan"
                  icon={<Briefcase className="h-4 w-4" />}
                  title={`Matching Projects (${filteredProjects.length})`}
                  href="/explore/projects"
                  linkLabel="View Full Project Directory →"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredProjects.map((proj) => (
                    <ProjectCard key={proj.id} proj={proj} cta="Project Overview" />
                  ))}
                </div>
              </section>
            )}

            {show("presales") && filteredPresales.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="amber"
                  icon={<Rocket className="h-4 w-4" />}
                  title={`Matching Presales (${filteredPresales.length})`}
                  href="/explore/presales"
                  linkLabel="View All Presales →"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredPresales.map((ps) => (
                    <PresaleCard key={ps.id} ps={ps} cta="View Presale" />
                  ))}
                </div>
              </section>
            )}

            {show("launches") && filteredLaunches.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="emerald"
                  icon={<Sparkles className="h-4 w-4" />}
                  title={`Matching Fair Launches (${filteredLaunches.length})`}
                  href="/explore/launches"
                  linkLabel="View All Launches →"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredLaunches.map((fl) => (
                    <div
                      key={fl.id}
                      className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-emerald-500/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground">{fl.title}</span>
                        <StatusBadge status={fl.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Network: {fl.network}</span>
                        <span className="font-mono">Token: {fl.tokenId.toUpperCase()}</span>
                      </div>
                      <Button asChild size="sm" variant="outline" className="mt-auto h-8 w-full border-border/60 text-xs">
                        <Link href={`/launchpad/launches/${fl.id}`}>Launch Room</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {show("airdrops") && filteredAirdrops.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="rose"
                  icon={<Gift className="h-4 w-4" />}
                  title={`Matching Airdrops (${filteredAirdrops.length})`}
                  href="/explore/airdrops"
                  linkLabel="View All Airdrops →"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredAirdrops.map((air) => (
                    <div
                      key={air.id}
                      className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-rose-500/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="line-clamp-1 text-sm font-semibold text-foreground">{air.title}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                          {air.type}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{air.description}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                        <span className="font-mono text-xs font-semibold text-emerald-400">{air.totalReward}</span>
                        <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs">
                          <Link href={`/airdrops/campaigns/${air.id}`}>Campaign Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {show("staking") && filteredStaking.length > 0 && (
              <section className="space-y-4">
                <ResultHeader
                  accent="violet"
                  icon={<Layers className="h-4 w-4" />}
                  title={`Matching Staking Pools (${filteredStaking.length})`}
                  href="/explore/staking"
                  linkLabel="View All Staking Pools →"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredStaking.map((pool) => (
                    <div
                      key={pool.id}
                      className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-violet-500/50"
                    >
                      <span className="line-clamp-1 text-sm font-semibold text-foreground">{pool.name}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <Stat label="Estimated APY" value={pool.apy} valueClass="text-emerald-400 font-bold" />
                        <Stat
                          label="Lock Period"
                          value={(pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} Days` : "Flexible"}
                        />
                      </div>
                      <Button asChild size="sm" variant="outline" className="mt-auto h-8 w-full border-border/60 text-xs">
                        <Link href={`/staking/pools/${pool.id}`}>Stake into Vault</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            {/* A: Featured tokens */}
            <section className="space-y-4">
              <ResultHeader
                accent="primary"
                icon={<Coins className="h-4 w-4" />}
                title="Featured Tokens"
                href="/explore/tokens"
                linkLabel={`View All ${categoryCounts.tokens} Tokens →`}
                large
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {MOCK_TOKENS.map((token) => (
                  <TokenCard key={token.id} token={token} detailed />
                ))}
              </div>
            </section>

            {/* B: Featured projects */}
            <section className="space-y-4">
              <ResultHeader
                accent="cyan"
                icon={<Briefcase className="h-4 w-4" />}
                title="Featured Projects & Protocols"
                href="/explore/projects"
                linkLabel={`View Project Directory (${categoryCounts.projects}) →`}
                large
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {MOCK_PROJECTS.map((proj) => (
                  <ProjectCard key={proj.id} proj={proj} cta="Explore Protocol" showTokens />
                ))}
              </div>
            </section>

            {/* C: Launchpad */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Rocket className="h-4 w-4 text-amber-400" /> Launchpad Opportunities
                </h2>
                <div className="flex items-center gap-4">
                  <Link href="/explore/presales" className="text-xs font-medium text-amber-400 hover:underline">
                    All Presales →
                  </Link>
                  <Link href="/explore/launches" className="text-xs font-medium text-emerald-400 hover:underline">
                    All Launches →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {MOCK_PRESALES.slice(0, 2).map((ps) => (
                  <PresaleCard key={ps.id} ps={ps} cta="View Presale Room" />
                ))}
                {MOCK_FAIR_LAUNCHES.slice(0, 1).map((fl) => (
                  <div
                    key={fl.id}
                    className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-emerald-500/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="line-clamp-1 text-sm font-semibold text-foreground">{fl.title}</span>
                      <StatusBadge status={fl.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Stat label="Format" value="Fair Liquidity Launch" valueClass="text-emerald-400 font-medium" mono={false} />
                      <Stat label="Network" value={fl.network} />
                    </div>
                    <Button asChild size="sm" variant="outline" className="mt-auto h-8 w-full border-border/60 text-xs">
                      <Link href={`/launchpad/launches/${fl.id}`}>Launch Dashboard</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* D: Rewards & yield: two lists, one divider each, no card-in-card */}
            <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Gift className="h-4 w-4 text-rose-400" /> Airdrop Discovery
                  </h2>
                  <Link href="/explore/airdrops" className="text-xs font-medium text-rose-400 hover:underline">
                    All Campaigns ({categoryCounts.airdrops}) →
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  Participate in active community incentives, testnet reward pools, and cryptographic claims.
                </p>
                <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50">
                  {MOCK_AIRDROPS.map((air) => (
                    <li key={air.id} className="flex items-center justify-between gap-4 p-4 text-xs transition-colors hover:bg-secondary/30">
                      <div className="min-w-0 space-y-0.5">
                        <div className="truncate text-sm font-semibold text-foreground">{air.title}</div>
                        <div className="font-mono text-[11px] capitalize text-muted-foreground">{air.type} distribution</div>
                      </div>
                      <div className="shrink-0 space-y-0.5 text-right">
                        <div className="font-mono font-bold text-emerald-400">{air.totalReward}</div>
                        <Link href={`/airdrops/campaigns/${air.id}`} className="text-[11px] text-primary hover:underline">
                          Claim Portal →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Layers className="h-4 w-4 text-violet-400" /> Staking Vaults Discovery
                  </h2>
                  <Link href="/explore/staking" className="text-xs font-medium text-violet-400 hover:underline">
                    All Vaults ({categoryCounts.staking}) →
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stake protocol tokens and liquidity pairs into audited vaults for yield distribution.
                </p>
                <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50">
                  {MOCK_STAKING_POOLS.map((pool) => (
                    <li key={pool.id} className="flex items-center justify-between gap-4 p-4 text-xs transition-colors hover:bg-secondary/30">
                      <div className="min-w-0 space-y-0.5">
                        <div className="truncate text-sm font-semibold text-foreground">{pool.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {(pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} Days Lock` : "Flexible Unlock"}
                        </div>
                      </div>
                      <div className="shrink-0 space-y-0.5 text-right">
                        <div className="font-mono font-bold text-emerald-400">{pool.apy} APY</div>
                        <Link href={`/staking/pools/${pool.id}`} className="text-[11px] text-primary hover:underline">
                          Deposit Vault →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* E: Call to action */}
            <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/70 to-card/90 p-6 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> ProMiners Launch Architecture
                  </div>
                  <h2 className="text-lg font-bold text-foreground sm:text-xl">
                    Ready to launch your token or list your decentralized protocol?
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {CTA_COPY}
                  </p>
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

const ACCENTS: Record<Accent, { text: string; hoverText: string; hoverBorder: string; iconBox: string; cardHover: string }> = {
  primary: {
    text: "text-primary",
    hoverText: "group-hover:text-primary",
    hoverBorder: "hover:border-primary/50 hover:shadow-primary/5",
    iconBox: "border-primary/20 bg-primary/10 text-primary",
    cardHover: "hover:border-primary/50",
  },
  cyan: {
    text: "text-cyan-400",
    hoverText: "group-hover:text-cyan-400",
    hoverBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/5",
    iconBox: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    cardHover: "hover:border-cyan-500/50",
  },
  amber: {
    text: "text-amber-400",
    hoverText: "group-hover:text-amber-400",
    hoverBorder: "hover:border-amber-500/50 hover:shadow-amber-500/5",
    iconBox: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    cardHover: "hover:border-amber-500/50",
  },
  emerald: {
    text: "text-emerald-400",
    hoverText: "group-hover:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
    iconBox: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    cardHover: "hover:border-emerald-500/50",
  },
  rose: {
    text: "text-rose-400",
    hoverText: "group-hover:text-rose-400",
    hoverBorder: "hover:border-rose-500/50 hover:shadow-rose-500/5",
    iconBox: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    cardHover: "hover:border-rose-500/50",
  },
  violet: {
    text: "text-violet-400",
    hoverText: "group-hover:text-violet-400",
    hoverBorder: "hover:border-violet-500/50 hover:shadow-violet-500/5",
    iconBox: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    cardHover: "hover:border-violet-500/50",
  },
};

const CTA_COPY =
  "Use our standardized creation wizards to deploy ERC-20 tokens, establish fair launches, or configure airdrop merkle distribution contracts on Ethereum Sepolia.";

function SectionTitle({
  id,
  title,
  description,
  aside,
}: {
  id: string;
  title: string;
  description: string;
  aside?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div className="space-y-1">
        <h2 id={id} className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
      </div>
      {aside && <span className="font-mono text-xs text-muted-foreground">{aside}</span>}
    </div>
  );
}

function ResultHeader({
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
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
      <h2 className={cn("flex items-center gap-2 font-bold text-foreground", large ? "text-lg" : "text-sm")}>
        <span className={a.text}>{icon}</span>
        {title}
      </h2>
      <Link href={href} className={cn("text-xs font-medium hover:underline", a.text)}>
        {linkLabel}
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
  mono = true,
}: {
  label: string;
  value?: string;
  valueClass?: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("truncate text-sm text-foreground", mono && "font-mono", valueClass)}>{value}</div>
    </div>
  );
}

function TokenCard({ token, detailed }: { token: (typeof MOCK_TOKENS)[number]; detailed?: boolean }) {
  const change = token.market.priceChange24h || 0;
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/50">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {token.name}
          </span>
          <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {token.symbol}
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{token.description}</p>
      </div>
      <div className="mt-auto space-y-3 border-t border-border/40 pt-3">
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="font-bold text-foreground">${token.market.price}</span>
          <span className={cn("text-xs", change >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {change >= 0 ? "+" : ""}
            {token.market.priceChange24h}%
          </span>
        </div>
        {detailed && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{token.network}</span>
            <span className="capitalize">{token.standard}</span>
          </div>
        )}
        <Button asChild size="sm" variant="outline" className="h-8 w-full border-border/60 text-xs">
          <Link href={`/tokens/${token.id}`}>Token Details</Link>
        </Button>
      </div>
    </div>
  );
}

function ProjectCard({
  proj,
  cta,
  showTokens,
}: {
  proj: (typeof MOCK_PROJECTS)[number];
  cta: string;
  showTokens?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-cyan-500/50">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-foreground">{proj.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{proj.description}</p>
        {showTokens && (
          <div className="flex flex-wrap gap-1.5">
            {proj.tokenIds.map((t) => (
              <span key={t} className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                ${t.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
        <span className="truncate font-mono text-[11px] text-muted-foreground">Owner: {proj.ownerAddress}</span>
        <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs">
          <Link href={`/projects/${proj.id}`}>{cta}</Link>
        </Button>
      </div>
    </div>
  );
}

function PresaleCard({ ps, cta }: { ps: (typeof MOCK_PRESALES)[number]; cta: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-amber-500/50">
      <div className="flex items-start justify-between gap-3">
        <span className="line-clamp-1 text-sm font-semibold text-foreground">{ps.title}</span>
        <StatusBadge status={ps.status} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Target Hardcap" value={ps.hardCap} />
        <Stat label="Total Raised" value={ps.totalRaised} valueClass="text-primary font-semibold" />
      </div>
      <Button asChild size="sm" variant="outline" className="mt-auto h-8 w-full border-border/60 text-xs">
        <Link href={`/launchpad/presales/${ps.id}`}>{cta}</Link>
      </Button>
    </div>
  );
}
