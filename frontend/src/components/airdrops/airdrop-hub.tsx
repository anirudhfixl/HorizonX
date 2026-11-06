import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useState, useMemo, useSyncExternalStore } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAirdrops, useTokens, useProjects } from "@/api";
import {
  readSessionAirdropsRaw,
  subscribeSessionAirdrops,
  parseSessionAirdrops,
  getAirdropProvenance,
  isSepoliaNetwork,
  calculateAirdropKpis,
  calculateClaimProgress,
  filterAirdropCampaigns,
  type HubFilterPreset,
} from "@/lib/airdrop-storage";
import {
  Gift,
  Plus,
  ShieldCheck,
  Users,
  Search,
  X,
  RotateCcw,
  SearchX,
  ArrowRight,
  Info,
  Calendar,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function AirdropHub() {
  const { data: airdrops = [] } = useAirdrops();
  const { data: tokens = [] } = useTokens();
  const { data: projects = [] } = useProjects();
  const allAirdrops = airdrops as any[];
  const TOKENS = tokens as any[];
  const PROJECTS = projects as any[];

  // 2. Token & Project lookup maps for quick symbol/name resolution
  const tokenMap = useMemo(() => {
    const map = new Map();
    TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, [TOKENS]);

  const projectMap = useMemo(() => {
    const map = new Map();
    PROJECTS.forEach((p) => map.set(p.id, p));
    return map;
  }, [PROJECTS]);

  // 3. Dynamic KPIs computed strictly from available campaign data
  const kpis = useMemo(() => {
    return calculateAirdropKpis(allAirdrops);
  }, [allAirdrops]);

  // 4. Search and quick filter preset state
  const [searchQuery, setSearchQuery] = useState("");
  const [activePreset, setActivePreset] = useState<HubFilterPreset>("all");

  const isFiltered = searchQuery.trim() !== "" || activePreset !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActivePreset("all");
  };

  // 5. Filtered campaigns for display
  const displayedCampaigns = useMemo(() => {
    return filterAirdropCampaigns(allAirdrops, {
      searchQuery,
      preset: activePreset,
    });
  }, [allAirdrops, searchQuery, activePreset]);

  // Counts for preset chips
  const sepoliaCount = useMemo(() => {
    return allAirdrops.filter((a) => isSepoliaNetwork(a.network)).length;
  }, [allAirdrops]);

  return (
    <div className="airdrop-page w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-7 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops" }]} />
      {/* Page Header */}
      <PageHeader
        title="Airdrop Hub"
        description="Discover token distributions, review campaign activity, and inspect the available campaign records. Catalog and browser-session entries are demonstration data until connected to a verified backend."
        breadcrumbs={[{ label: "Airdrops" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link to="/airdrops/claim">Claim Rewards</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60 gap-1.5">
              <Link to="/airdrops/campaigns">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" /> All Campaigns
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
              <Link to="/airdrops/campaigns/create">
                <Plus className="h-3.5 w-3.5" /> Launch Airdrop
              </Link>
            </Button>
          </div>
        }
      />

      {/* Dynamic KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Active Campaigns"
          value={String(kpis.activeCampaigns)}
          change={`${kpis.sepoliaActiveCampaigns} Sepolia Live`}
          trend="up"
          subtitle={`From ${kpis.totalCampaigns} registered pools`}
          icon={<ShieldCheck className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Recorded Claims"
          value={kpis.totalClaimed.toLocaleString()}
          change={`${kpis.overallClaimRate}% Claimed`}
          trend="up"
          subtitle={`From ${kpis.totalRecipients.toLocaleString()} eligible recipients`}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Supported Transaction Network"
          value="1"
          change="Sepolia"
          trend="neutral"
          subtitle="Ethereum Sepolia · Chain ID 11155111"
          icon={<Layers className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Clear Data Provenance & Simulation Disclosure Banner */}
      <div className="flex items-start sm:items-center gap-2.5 px-4 py-3 rounded-xl border border-border/60 bg-secondary/20 text-xs text-muted-foreground backdrop-blur-md">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Data Transparency:</strong> Metrics and pools reflect stored catalog
          demonstration data and temporary browser session creations. Ethereum Sepolia (Chain ID: 11155111) is the
          supported transaction network under Architecture Decision D-04.
        </p>
      </div>

      {/* Discovery & Instant Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by title, token, or category..."
            className="pl-9 pr-8 h-9 text-xs bg-secondary/30 border-border/60 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={activePreset === "all" ? "default" : "outline"}
            onClick={() => setActivePreset("all")}
            className={cn(
              "h-8 px-3 text-xs font-semibold gap-1.5 border-border/60",
              activePreset === "all" && "bg-primary text-primary-foreground"
            )}
          >
            All Campaigns
            <span className="text-[10px] opacity-80 font-mono">({allAirdrops.length})</span>
          </Button>
          <Button
            size="sm"
            variant={activePreset === "live" ? "default" : "outline"}
            onClick={() => setActivePreset("live")}
            className={cn(
              "h-8 px-3 text-xs font-semibold gap-1.5 border-border/60",
              activePreset === "live" && "bg-primary text-primary-foreground"
            )}
          >
            Live Only
            <span className="text-[10px] opacity-80 font-mono">({kpis.activeCampaigns})</span>
          </Button>
          <Button
            size="sm"
            variant={activePreset === "sepolia" ? "default" : "outline"}
            onClick={() => setActivePreset("sepolia")}
            className={cn(
              "h-8 px-3 text-xs font-semibold gap-1.5 border-border/60",
              activePreset === "sepolia" && "bg-primary text-primary-foreground"
            )}
          >
            Sepolia Only
            <span className="text-[10px] opacity-80 font-mono">({sepoliaCount})</span>
          </Button>

          {isFiltered && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleResetFilters}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Campaigns Listing Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Airdrop Campaign Directory</h2>
            <span className="text-xs text-muted-foreground font-mono">
              ({displayedCampaigns.length} of {allAirdrops.length})
            </span>
          </div>
          <Link
            to="/airdrops/campaigns"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all campaigns <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {displayedCampaigns.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No Airdrop Campaigns Match Your Criteria"
            description="Try modifying your search keywords or reset active filters to view all available distribution campaigns."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetFilters}
                className="text-xs border-border/60 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset All Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {displayedCampaigns.map((air) => {
              const token = tokenMap.get(air.tokenId);
              const project = air.projectId ? projectMap.get(air.projectId) : undefined;
              const isSepolia = isSepoliaNetwork(air.network);
              const provenance = getAirdropProvenance(air);
              const progress = calculateClaimProgress(air.claimedCount, air.recipientCount);

              return (
                <div
                  key={air.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Top Chips Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-mono border",
                            isSepolia
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground border-border/40"
                          )}
                        >
                          {air.network}
                        </span>
                        <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                          {air.type}
                        </span>
                        {air.category && (
                          <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/30">
                            {air.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <ProvenanceBadge
                          kind={air.origin === "external" ? "simulated" : provenance}
                          label={air.source || (air.origin === "external" ? "DefiLlama Airdrop Registry" : undefined)}
                        />
                        <StatusBadge status={air.status} />
                      </div>
                    </div>

                    {/* Campaign Identity */}
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center font-bold text-sm text-primary font-mono shadow-inner">
                        {token ? token.symbol.slice(0, 3) : air.title.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/airdrops/campaigns/${air.id}`}
                          className="font-bold text-foreground text-sm hover:text-primary transition-colors line-clamp-1 group-hover:text-primary"
                        >
                          {air.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          {token ? (
                            <Link
                              to={`/tokens/${token.id}`}
                              className="font-mono text-primary hover:underline font-semibold"
                            >
                              ${token.symbol}
                            </Link>
                          ) : (
                            <span className="font-mono text-foreground font-semibold">
                              {air.tokenId.toUpperCase()}
                            </span>
                          )}
                          {project && (
                            <>
                              <span className="text-muted-foreground/60">•</span>
                              <Link
                                to={`/projects/${project.id}`}
                                className="hover:text-foreground truncate"
                              >
                                {project.name}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {air.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {air.description}
                      </p>
                    )}

                    {/* Reward Pool & Claim Progress */}
                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Reward Pool</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {air.totalReward || "TBD"}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            progress >= 100
                              ? "bg-emerald-400"
                              : progress > 0
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span>
                          Claimed: <strong className="font-mono text-foreground">{air.claimedCount?.toLocaleString() || "0"}</strong>
                        </span>
                        <span>
                          Total: <strong className="font-mono text-foreground">{air.recipientCount?.toLocaleString() || "0"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/70" />
                      {air.status === "pending"
                        ? `Starts: ${air.startTime?.slice(0, 10) || "TBD"}`
                        : `Expires: ${air.endTime?.slice(0, 10) || "TBD"}`}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="h-7 text-xs bg-primary text-primary-foreground font-semibold px-3 gap-1 hover:brightness-110"
                    >
                      <Link to={`/airdrops/campaigns/${air.id}`}>
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
