"use client";

import React, { useState, useMemo } from "react";
import { ExploreOrbitalHero } from "@/components/explore/orbital-explore-hero";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  return (
    <>
      <ExploreOrbitalHero />
      <div id="explore-discovery-content" className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header & Demonstration Notice */}
      <div className="space-y-4">
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
                className="h-8 gap-1.5 text-xs border-border/60 hover:bg-secondary/60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
                <span>Refresh Index</span>
              </Button>
              <Button asChild size="sm" className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground font-semibold">
                <Link href="/tokens/create">
                  <Plus className="h-3.5 w-3.5" /> Deploy Token
                </Link>
              </Button>
            </div>
          }
        />

        {/* Phase 1 Demonstration Alert */}
        <div className="flex items-center gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground">Phase 1 Demonstration Environment:</strong> Discovery telemetry and asset
            metrics are simulated from centralized mock models. Live on-chain indexing and pricing feeds will be integrated in
            subsequent phases.
          </span>
        </div>
      </div>

      {/* 2. High-Level Discovery Ecosystem Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Indexed Ecosystem Assets"
          value={`${categoryCounts.total} Assets`}
          subtitle="Across 6 Discovery Categories"
          icon={<Compass className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Top Gaining Token"
          value="+14.2%"
          trend="up"
          change="PMIN"
          subtitle="ProMiners Governance ($1.48)"
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
        />
        <MetricCard
          title="Active Launchpad Deals"
          value={`${categoryCounts.presales + categoryCounts.launches} Sales`}
          subtitle="1 Live Presale • 1 Fair Launch"
          icon={<Rocket className="h-4 w-4 text-amber-400" />}
        />
        <MetricCard
          title="Max Staking APY"
          value="38.2%"
          change="AURA"
          trend="up"
          subtitle="Single-sided & LP Vaults"
          icon={<Layers className="h-4 w-4 text-violet-400" />}
        />
      </div>

      {/* 3. Six Hero Discovery Category Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Discovery Categories</h2>
            <p className="text-xs text-muted-foreground">
              Select a category to explore dedicated directories and launch modules.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            6 Specialized Sectors
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Tokens */}
          <Link
            href="/explore/tokens"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <Coins className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.tokens} Tokens
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Token Explorer
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Browse ERC-20 utility, governance, DePIN, and AI compute tokens with verified smart contracts.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
              <span>Explore Tokens</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Projects */}
          <Link
            href="/explore/projects"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-cyan-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.projects} Projects
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-cyan-400 transition-colors">
              Project Directory
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Discover verified decentralized foundations, protocol teams, and infrastructure builders.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <span>View Directory</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Presales */}
          <Link
            href="/explore/presales"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Rocket className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.presales} Presales
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-amber-400 transition-colors">
              Presale Rounds
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Participate in vetted early-stage fundraising rounds with transparent soft/hard caps and timeline monitoring.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>Discover Presales</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Fair Launches */}
          <Link
            href="/explore/launches"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.launches} Launches
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">
              Fair Launches
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Community-first liquidity distribution with zero private seed allocation and anti-snipe safeguards.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>View Fair Launches</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Airdrops */}
          <Link
            href="/explore/airdrops"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-rose-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-rose-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                <Gift className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.airdrops} Campaigns
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-rose-400 transition-colors">
              Airdrop Discovery
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Claim verified rewards, testnet incentives, referral pools, and cryptographic merkle tree distributions.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-400">
              <span>Explore Airdrops</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Staking Pools */}
          <Link
            href="/explore/staking"
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-violet-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-violet-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                {categoryCounts.staking} Pools
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-violet-400 transition-colors">
              Staking Vaults
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Earn automated protocol yields and liquidity mining rewards across single-sided and multi-token pools.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
              <span>Explore Staking</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Universal Discovery Search & Filtering Bar */}
      <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens, projects, presales, airdrops, vaults (e.g., 'PMIN', 'Aurora', 'Ethereum')..."
              className="w-full rounded-xl border border-border/70 bg-secondary/30 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
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

          {/* Quick Filter Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
              Filter By:
            </span>
            <Button
              variant={quickFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilter("all")}
              className="h-8 text-xs border-border/60"
            >
              All Assets
            </Button>
            <Button
              variant={quickFilter === "live" ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilter("live")}
              className="h-8 text-xs border-border/60 gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live / Active
            </Button>
            <Button
              variant={quickFilter === "audited" ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilter("audited")}
              className="h-8 text-xs border-border/60 gap-1.5"
            >
              <ShieldCheck className="h-3 w-3 text-primary" />
              Audited Only
            </Button>
            <Button
              variant={quickFilter === "ethereum" ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilter("ethereum")}
              className="h-8 text-xs border-border/60"
            >
              Ethereum / Sepolia
            </Button>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            All Categories ({categoryCounts.total})
          </button>
          <button
            onClick={() => setActiveCategory("tokens")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "tokens"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Tokens ({categoryCounts.tokens})
          </button>
          <button
            onClick={() => setActiveCategory("projects")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "projects"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Projects ({categoryCounts.projects})
          </button>
          <button
            onClick={() => setActiveCategory("presales")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "presales"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Presales ({categoryCounts.presales})
          </button>
          <button
            onClick={() => setActiveCategory("launches")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "launches"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Fair Launches ({categoryCounts.launches})
          </button>
          <button
            onClick={() => setActiveCategory("airdrops")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "airdrops"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Airdrops ({categoryCounts.airdrops})
          </button>
          <button
            onClick={() => setActiveCategory("staking")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "staking"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Staking Pools ({categoryCounts.staking})
          </button>
        </div>

        {/* Filter State Bar */}
        {isFilteringActive && (
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{totalMatchingCount}</strong> matching assets
              {query && <span> for &ldquo;{query}&rdquo;</span>}
              {quickFilter !== "all" && <span> with filter [{quickFilter}]</span>}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
            >
              <X className="h-3 w-3" /> Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* 5. Discovery Content Views: Empty State OR Filtered Results OR Curated Showcase */}
      {totalMatchingCount === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-primary/70" />}
          title="No discovery assets match your criteria"
          description={`We couldn't find any tokens, projects, or campaigns matching "${searchQuery}". Try loosening your search terms or resetting filters.`}
          action={
            <Button onClick={resetFilters} size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
              <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
            </Button>
          }
        />
      ) : isFilteringActive ? (
        /* Unified Filtered Results View */
        <div className="space-y-10">
          {/* Filtered Tokens */}
          {(activeCategory === "all" || activeCategory === "tokens") && filteredTokens.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-foreground text-sm">Matching Tokens ({filteredTokens.length})</h3>
                </div>
                <Link href="/explore/tokens" className="text-xs text-primary hover:underline font-medium">
                  View Full Token Explorer →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredTokens.map((token) => (
                  <div
                    key={token.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">{token.name}</span>
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {token.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{token.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-border/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span>${token.market.price}</span>
                        <span className={(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                          {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}
                          {token.market.priceChange24h}%
                        </span>
                      </div>
                      <Button asChild size="sm" variant="outline" className="w-full text-xs h-7 border-border/60">
                        <Link href={`/tokens/${token.id}`}>Token Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Projects */}
          {(activeCategory === "all" || activeCategory === "projects") && filteredProjects.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-bold text-foreground text-sm">Matching Projects ({filteredProjects.length})</h3>
                </div>
                <Link href="/explore/projects" className="text-xs text-cyan-400 hover:underline font-medium">
                  View Full Project Directory →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground text-sm">{proj.name}</h4>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{proj.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Owner: {proj.ownerAddress}
                      </span>
                      <Button asChild size="sm" variant="outline" className="text-xs h-7 border-border/60">
                        <Link href={`/projects/${proj.id}`}>Project Overview</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Presales */}
          {(activeCategory === "all" || activeCategory === "presales") && filteredPresales.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-amber-400" />
                  <h3 className="font-bold text-foreground text-sm">Matching Presales ({filteredPresales.length})</h3>
                </div>
                <Link href="/explore/presales" className="text-xs text-amber-400 hover:underline font-medium">
                  View All Presales →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {filteredPresales.map((ps) => (
                  <div
                    key={ps.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-amber-500/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground line-clamp-1">{ps.title}</span>
                        <StatusBadge status={ps.status} />
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Target Hardcap:</span>
                          <span className="font-mono text-foreground">{ps.hardCap}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total Raised:</span>
                          <span className="font-mono text-primary font-semibold">{ps.totalRaised}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full text-xs h-7 mt-3 border-border/60">
                      <Link href={`/launchpad/presales/${ps.id}`}>View Presale</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Fair Launches */}
          {(activeCategory === "all" || activeCategory === "launches") && filteredLaunches.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-foreground text-sm">Matching Fair Launches ({filteredLaunches.length})</h3>
                </div>
                <Link href="/explore/launches" className="text-xs text-emerald-400 hover:underline font-medium">
                  View All Launches →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredLaunches.map((fl) => (
                  <div
                    key={fl.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{fl.title}</span>
                        <StatusBadge status={fl.status} />
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Network: {fl.network}</span>
                        <span className="font-mono">Token: {fl.tokenId.toUpperCase()}</span>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full text-xs h-7 mt-3 border-border/60">
                      <Link href={`/launchpad/launches/${fl.id}`}>Launch Room</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Airdrops */}
          {(activeCategory === "all" || activeCategory === "airdrops") && filteredAirdrops.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-rose-400" />
                  <h3 className="font-bold text-foreground text-sm">Matching Airdrops ({filteredAirdrops.length})</h3>
                </div>
                <Link href="/explore/airdrops" className="text-xs text-rose-400 hover:underline font-medium">
                  View All Airdrops →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredAirdrops.map((air) => (
                  <div
                    key={air.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-rose-500/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground line-clamp-1">{air.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {air.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{air.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-emerald-400">{air.totalReward}</span>
                      <Button asChild size="sm" variant="outline" className="text-xs h-7 border-border/60">
                        <Link href={`/airdrops/campaigns/${air.id}`}>Campaign Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Staking Pools */}
          {(activeCategory === "all" || activeCategory === "staking") && filteredStaking.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-400" />
                  <h3 className="font-bold text-foreground text-sm">Matching Staking Pools ({filteredStaking.length})</h3>
                </div>
                <Link href="/explore/staking" className="text-xs text-violet-400 hover:underline font-medium">
                  View All Staking Pools →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {filteredStaking.map((pool) => (
                  <div
                    key={pool.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-violet-500/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">{pool.name}</span>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Estimated APY:</span>
                        <span className="font-mono font-bold text-emerald-400">{pool.apy}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Lock Period:</span>
                        <span>{(pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} Days` : "Flexible"}</span>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full text-xs h-7 mt-3 border-border/60">
                      <Link href={`/staking/pools/${pool.id}`}>Stake into Vault</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Curated Default Showcase (Categorized Overview) */
        <div className="space-y-12">
          {/* Section A: Featured Tokens */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Featured Tokens</h2>
              </div>
              <Link href="/explore/tokens" className="text-xs font-medium text-primary hover:underline">
                View All {categoryCounts.tokens} Tokens →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_TOKENS.map((token) => (
                <div
                  key={token.id}
                  className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-primary/50 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {token.name}
                      </span>
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {token.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {token.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground">${token.market.price}</span>
                      <span className={(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{token.network}</span>
                      <span className="capitalize">{token.standard}</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full text-xs h-8 border-border/60">
                      <Link href={`/tokens/${token.id}`}>Token Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section B: Featured Protocols & Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                <h2 className="text-base font-bold text-foreground">Featured Projects & Protocols</h2>
              </div>
              <Link href="/explore/projects" className="text-xs font-medium text-cyan-400 hover:underline">
                View Project Directory ({categoryCounts.projects}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {MOCK_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm hover:border-cyan-500/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-base">{proj.name}</h3>
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tokenIds.map((t) => (
                        <span key={t} className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          ${t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Owner: {proj.ownerAddress}
                    </span>
                    <Button asChild size="sm" variant="outline" className="text-xs border-border/60">
                      <Link href={`/projects/${proj.id}`}>Explore Protocol</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Launchpad Spotlight (Presales & Fair Launches) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-bold text-foreground">Launchpad Opportunities</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/explore/presales" className="text-xs font-medium text-amber-400 hover:underline">
                  All Presales →
                </Link>
                <Link href="/explore/launches" className="text-xs font-medium text-emerald-400 hover:underline">
                  All Launches →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Highlight Presale 1 */}
              {MOCK_PRESALES.slice(0, 2).map((ps) => (
                <div
                  key={ps.id}
                  className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-amber-500/50 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">{ps.title}</span>
                      <StatusBadge status={ps.status} />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Target Hardcap:</span>
                        <span className="font-mono text-foreground font-semibold">{ps.hardCap}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Raised:</span>
                        <span className="font-mono text-primary font-semibold">{ps.totalRaised}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-full text-xs border-border/60">
                    <Link href={`/launchpad/presales/${ps.id}`}>View Presale Room</Link>
                  </Button>
                </div>
              ))}

              {/* Highlight Fair Launch 1 */}
              {MOCK_FAIR_LAUNCHES.slice(0, 1).map((fl) => (
                <div
                  key={fl.id}
                  className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-emerald-500/50 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">{fl.title}</span>
                      <StatusBadge status={fl.status} />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Format:</span>
                        <span className="text-emerald-400 font-medium">Fair Liquidity Launch</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Network:</span>
                        <span className="font-mono">{fl.network}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-full text-xs border-border/60">
                    <Link href={`/launchpad/launches/${fl.id}`}>Launch Dashboard</Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Rewards & Yield (Airdrops & Staking Vaults) */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Airdrop Hub Preview */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-rose-400" /> Airdrop Discovery
                </span>
                <Link href="/explore/airdrops" className="text-xs text-rose-400 hover:underline">
                  All Campaigns ({categoryCounts.airdrops}) →
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Participate in active community incentives, testnet reward pools, and cryptographic claims.
              </p>
              <div className="space-y-2.5">
                {MOCK_AIRDROPS.map((air) => (
                  <div
                    key={air.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-border transition-colors text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{air.title}</div>
                      <div className="text-muted-foreground font-mono text-[11px] capitalize">{air.type} distribution</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono font-bold">{air.totalReward}</div>
                      <Link
                        href={`/airdrops/campaigns/${air.id}`}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Claim Portal →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staking Vaults Preview */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-violet-400" /> Staking Vaults Discovery
                </span>
                <Link href="/explore/staking" className="text-xs text-violet-400 hover:underline">
                  All Vaults ({categoryCounts.staking}) →
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Stake protocol tokens and liquidity pairs into audited vaults for yield distribution.
              </p>
              <div className="space-y-2.5">
                {MOCK_STAKING_POOLS.map((pool) => (
                  <div
                    key={pool.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-border transition-colors text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{pool.name}</div>
                      <div className="text-muted-foreground text-[11px]">
                        {(pool.lockPeriodDays ?? 0) > 0 ? `${pool.lockPeriodDays} Days Lock` : "Flexible Unlock"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono font-bold">{pool.apy} APY</div>
                      <Link
                        href={`/staking/pools/${pool.id}`}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Deposit Vault →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section E: Discovery Ecosystem Action Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/70 to-card/90 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" /> ProMiners Launch Architecture
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Ready to launch your token or list your decentralized protocol?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Use our standardized creation wizards to deploy ERC-20 tokens, establish fair launches, or configure airdrop merkle distribution contracts on Ethereum Sepolia.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="bg-primary text-primary-foreground font-semibold text-xs h-9">
                  <Link href="/tokens/create">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Create Token
                  </Link>
                </Button>
                {!isConnected ? (
                  <Button
                    variant="outline"
                    onClick={() => openModal("CONNECT_WALLET")}
                    className="border-border/60 text-xs h-9 gap-1.5"
                  >
                    <Wallet className="h-3.5 w-3.5 text-primary" /> Connect Wallet
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="border-border/60 text-xs h-9">
                    <Link href="/launchpad/presales/create">
                      Launch Presale
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
