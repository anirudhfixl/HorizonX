import React, { useState, useMemo } from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStakingPools, useTokens, useProjects } from "@/api";
import { Token, Project } from "@/types";
import {
  Layers,
  Search,
  X,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Info,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
export type StakingSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "apy-desc"
  | "apy-asc"
  | "staked-desc"
  | "lock-asc"
  | "lock-desc";

export interface StakingPoolDirectoryProps {
  mode?: "canonical" | "explore";
}

// Helper to extract numeric APY percentage (e.g. "24.5%" -> 24.5)
export function parseApy(apy?: string): number {
  if (!apy) return 0;
  const num = parseFloat(apy.replace(/%/g, "").replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

// Helper to extract numeric staked quantity (e.g. "18,400,000 PMIN" -> 18400000)
export function parseStakedAmount(val?: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/,/g, "").replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

// Helper to format lockup display text
export function formatLockDuration(lockPeriodDays?: number): {
  isFlexible: boolean;
  label: string;
} {
  if (lockPeriodDays === undefined || lockPeriodDays === 0) {
    return { isFlexible: true, label: "Flexible (No Lock)" };
  }
  return { isFlexible: false, label: `${lockPeriodDays} Days Lock` };
}

export function StakingPoolDirectory({ mode = "canonical" }: StakingPoolDirectoryProps) {
  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lockFilter, setLockFilter] = useState("all");
  const [sortBy, setSortBy] = useState<StakingSortOption>("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">(mode === "canonical" ? "table" : "grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(9);

  const { data: pools = [] } = useStakingPools();
  const { data: tokens = [] } = useTokens();
  const { data: projects = [] } = useProjects();
  const STAKING_POOLS = pools as any[];
  const TOKENS = tokens as Token[];
  const PROJECTS = projects as Project[];

  // Fast token and project metadata lookups
  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, [TOKENS]);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    PROJECTS.forEach((p) => map.set(p.id, p));
    return map;
  }, [PROJECTS]);

  // Unique categories derived from pools and linked tokens
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    STAKING_POOLS.forEach((pool) => {
      if (pool.category) set.add(pool.category);
      const token = tokenMap.get(pool.tokenId);
      if (token?.category) set.add(token.category);
    });
    return Array.from(set).sort();
  }, [tokenMap]);

  // Filter change handlers with immediate page reset
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleNetworkChange = (value: string) => {
    setNetworkFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleLockChange = (value: string) => {
    setLockFilter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setNetworkFilter("all");
    setCategoryFilter("all");
    setLockFilter("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  // Filtered pools
  const filteredPools = useMemo(() => {
    return STAKING_POOLS.filter((pool) => {
      const token = tokenMap.get(pool.tokenId);
      const project = pool.projectId ? projectMap.get(pool.projectId) : undefined;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pool.name.toLowerCase().includes(q);
        const matchesDesc = pool.description?.toLowerCase().includes(q) ?? false;
        const matchesTokenName = token?.name.toLowerCase().includes(q) ?? false;
        const matchesTokenSymbol = token?.symbol.toLowerCase().includes(q) ?? false;
        const matchesProject = project?.name.toLowerCase().includes(q) ?? false;
        const matchesNetwork = pool.network?.toLowerCase().includes(q) ?? false;

        if (
          !matchesName &&
          !matchesDesc &&
          !matchesTokenName &&
          !matchesTokenSymbol &&
          !matchesProject &&
          !matchesNetwork
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "all" && pool.status !== statusFilter) {
        return false;
      }

      // 3. Network Filter (D-04 Scope)
      if (networkFilter === "sepolia") {
        const net = pool.network.toLowerCase();
        if (!net.includes("sepolia") && net !== "ethereum") return false;
      } else if (networkFilter !== "all") {
        if (pool.network !== networkFilter) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "all") {
        const cat = pool.category || token?.category;
        if (cat !== categoryFilter) return false;
      }

      // 5. Lock Duration Filter
      if (lockFilter === "flexible") {
        if (pool.lockPeriodDays !== undefined && pool.lockPeriodDays > 0) return false;
      } else if (lockFilter === "locked") {
        if (!pool.lockPeriodDays || pool.lockPeriodDays === 0) return false;
      }

      return true;
    });
  }, [STAKING_POOLS, searchQuery, statusFilter, networkFilter, categoryFilter, lockFilter, tokenMap, projectMap]);

  // Sorted pools
  const sortedPools = useMemo(() => {
    return [...filteredPools].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-desc":
          return (
            new Date(b.startTime || b.createdAt).getTime() -
            new Date(a.startTime || a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.startTime || a.createdAt).getTime() -
            new Date(b.startTime || b.createdAt).getTime()
          );
        case "apy-desc": {
          const apyA = parseApy(a.apy);
          const apyB = parseApy(b.apy);
          return apyB - apyA;
        }
        case "apy-asc": {
          const apyA = parseApy(a.apy);
          const apyB = parseApy(b.apy);
          return apyA - apyB;
        }
        case "staked-desc": {
          const stakedA = parseStakedAmount(a.totalStaked);
          const stakedB = parseStakedAmount(b.totalStaked);
          return stakedB - stakedA;
        }
        case "lock-asc": {
          const lockA = a.lockPeriodDays || 0;
          const lockB = b.lockPeriodDays || 0;
          return lockA - lockB;
        }
        case "lock-desc": {
          const lockA = a.lockPeriodDays || 0;
          const lockB = b.lockPeriodDays || 0;
          return lockB - lockA;
        }
        default:
          return 0;
      }
    });
  }, [filteredPools, sortBy]);

  // Paginated slice
  const totalItems = sortedPools.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPools = sortedPools.slice(startIndex, endIndex);

  // Feature distinct pool families so cohort variants do not occupy every featured slot.
  const featuredPools = useMemo(() => {
    const ranked = [...STAKING_POOLS].filter((pool) => pool.apy).sort((a, b) => parseApy(b.apy) - parseApy(a.apy));
    const seenFamilies = new Set<string>();
    return ranked.filter((pool) => {
      const family = pool.name.toLowerCase().replace(/\s*[·-]\s*cohort\s+[ivxlcdm0-9]+\s*$/i, "").replace(/\s+cohort\s+[ivxlcdm0-9]+\s*$/i, "").trim();
      if (seenFamilies.has(family)) return false;
      seenFamilies.add(family);
      return true;
    }).slice(0, 5);
  }, [STAKING_POOLS]);

  const activePoolCount = STAKING_POOLS.filter((pool) => pool.status === "active").length;
  const pendingPoolCount = STAKING_POOLS.filter((pool) => pool.status === "pending").length;
  const endedPoolCount = STAKING_POOLS.filter((pool) => pool.status === "ended").length;
  const draftPoolCount = STAKING_POOLS.filter((pool) => pool.status === "draft").length;
  const activePoolShare = STAKING_POOLS.length ? Math.round((activePoolCount / STAKING_POOLS.length) * 100) : 0;
  const sepoliaPoolCount = STAKING_POOLS.filter(
    (pool) => pool.network?.toLowerCase().includes("sepolia") || pool.network?.toLowerCase() === "ethereum"
  ).length;
  const flexiblePoolCount = STAKING_POOLS.filter((pool) => !pool.lockPeriodDays || pool.lockPeriodDays === 0).length;
  const mostParticipatedPool = [...STAKING_POOLS].sort((a, b) => (b.stakerCount || 0) - (a.stakerCount || 0))[0];

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (statusFilter !== "all") count++;
    if (networkFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (lockFilter !== "all") count++;
    return count;
  }, [searchQuery, statusFilter, networkFilter, categoryFilter, lockFilter]);

  // Total depositors across all pools
  const totalStakersCount = useMemo(() => {
    return STAKING_POOLS.reduce((acc, p) => acc + (p.stakerCount || 0), 0);
  }, [STAKING_POOLS]);

  return (
    <div className={mode === "canonical" ? "staking-page space-y-7" : "mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-7"}>
      {mode === "canonical" && <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "Pools" }]} />}
      <PageHeader
        title="Staking Pool Discovery"
        description="Explore staking opportunities across HorizonX. Compare listed reward rates, pool activity, networks, and lock terms."
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Discover opportunities</span>
            <h2 className="mt-1 text-base font-semibold text-foreground">Top listed staking pools</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">Highest listed APY · Distinct pool types</span>
        </div>
        {featuredPools.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {featuredPools.map((pool, index) => {
              const token = tokenMap.get(pool.tokenId);
              const isSepolia = pool.network.toLowerCase().includes("sepolia") || pool.network.toLowerCase() === "ethereum";
              return (
                <Link key={pool.id} to={`/staking/pools/${pool.id}`} className="flex min-h-[142px] flex-col justify-between rounded-xl border border-border/60 bg-card/45 p-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{index === 0 ? "Highest APY" : `#${index + 1} by APY`}</span>
                      <StatusBadge status={pool.status} />
                    </div>
                    <h3 className="mt-3 line-clamp-2 min-h-[34px] text-xs font-semibold leading-snug text-foreground text-foreground">{pool.name.replace(/\s*[·-]\s*Cohort\s+[IVXLCDM0-9]+\s*$/i, "")}</h3>
                    <p className="mt-1 text-[10px] text-muted-foreground">{token?.symbol || pool.tokenId.toUpperCase()} <span className="mx-1 text-border">·</span> {isSepolia ? "Sepolia" : pool.network}</p>
                  </div>
                  <div className="mt-3 flex items-end justify-between border-t border-border/40 pt-2.5">
                    <div><span className="block text-[9px] uppercase tracking-wider text-muted-foreground">Listed APY</span><span className="mt-0.5 block font-mono text-lg font-semibold text-emerald-400">{pool.apy || "—"}</span></div>
                    <span className="mb-1 text-[10px] text-muted-foreground ">View pool ↗</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">Featured pool data will appear here when APY listings are available.</div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Pool catalog</span><span className="rounded-lg bg-primary/10 p-2 text-primary"><Layers className="h-4 w-4" /></span></div>
          <div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-tight text-foreground">{STAKING_POOLS.length}</span><span className="text-[10px] text-muted-foreground">total listings</span></div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-secondary/70">
            <span className="bg-emerald-400" style={{ width: `${STAKING_POOLS.length ? activePoolCount / STAKING_POOLS.length * 100 : 0}%` }} />
            <span className="bg-amber-400" style={{ width: `${STAKING_POOLS.length ? pendingPoolCount / STAKING_POOLS.length * 100 : 0}%` }} />
            <span className="bg-zinc-500" style={{ width: `${STAKING_POOLS.length ? endedPoolCount / STAKING_POOLS.length * 100 : 0}%` }} />
            <span className="bg-slate-700" style={{ width: `${STAKING_POOLS.length ? draftPoolCount / STAKING_POOLS.length * 100 : 0}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
            <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />{activePoolCount} active</span>
            <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />{pendingPoolCount} pending</span>
            <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" />{endedPoolCount} ended</span>
            <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-700" />{draftPoolCount} draft</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Active pools</span><span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400"><TrendingUp className="h-4 w-4" /></span></div>
          <div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-tight text-foreground">{activePoolCount}</span><span className="text-[10px] text-emerald-400">{activePoolShare}% of catalog</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/70"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${activePoolShare}%` }} /></div>
          <p className="mt-2 text-[10px] text-muted-foreground">Pools currently marked as active</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Sepolia network</span><span className="rounded-lg bg-violet-500/10 p-2 text-violet-400"><CheckCircle2 className="h-4 w-4" /></span></div>
          <div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-tight text-foreground">{sepoliaPoolCount}</span><span className="text-[10px] text-muted-foreground">of {STAKING_POOLS.length} pool listings</span></div>
          <div className="mt-3 flex items-center gap-2"><span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] font-medium text-violet-300">Chain ID 11155111</span><span className="text-[9px] text-muted-foreground">Active EVM network</span></div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Recorded depositors</span><span className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400"><Users className="h-4 w-4" /></span></div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{totalStakersCount.toLocaleString()}</div>
          <p className="mt-1 truncate text-[10px] text-muted-foreground">{mostParticipatedPool ? `Most participated: ${mostParticipatedPool.name}` : "Across all listed pools"}</p>
          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[10px]"><span className="text-muted-foreground">Top pool participation</span><span className="font-mono font-semibold text-foreground">{mostParticipatedPool?.stakerCount?.toLocaleString() ?? "—"}</span></div>
        </div>
      </section>

      <div className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.045] px-4 py-3 sm:flex-row sm:items-start">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div>
          <p className="text-xs font-semibold text-amber-300">Demonstration data · Network scope</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">APYs, staked amounts, lock schedules, and depositor counts are catalog demonstration figures, not guaranteed returns or proof of live staking. Ethereum Sepolia (Chain ID 11155111) is the active EVM wallet network; other network listings are discovery metadata only.</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
        <div className="border-b border-border/60 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2"><h2 className="text-base font-semibold text-foreground">Explore all pools</h2><span className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">Full catalog</span></div>
              <p className="mt-1 text-xs text-muted-foreground">Search, compare, and narrow down pools by the criteria that matter to you.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px] flex-1 xl:w-[340px] xl:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" placeholder="Search pool, token, project, or network..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} className="h-9 border-border/60 bg-secondary/30 pl-9 pr-9 text-xs" />
                {searchQuery && <button type="button" onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
              </div>
              <div className="flex h-9 items-center rounded-lg border border-border/60 bg-secondary/30 p-0.5">
                <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className={`h-8 px-2.5 text-xs ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} aria-label="Table view"><List className="mr-1.5 h-3.5 w-3.5" /> Table</Button>
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={`h-8 px-2.5 text-xs ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} aria-label="Grid view"><LayoutGrid className="mr-1.5 h-3.5 w-3.5" /> Grid</Button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { label: "Status", value: statusFilter, onChange: handleStatusChange, options: [["all", "All statuses"], ["active", "Active"], ["pending", "Pending"], ["ended", "Ended"], ["draft", "Draft"]] },
              { label: "Network", value: networkFilter, onChange: handleNetworkChange, options: [["all", "All networks"], ["sepolia", "Ethereum Sepolia (Active)"]] },
              { label: "Category", value: categoryFilter, onChange: handleCategoryChange, options: [["all", "All categories"], ...uniqueCategories.map((category) => [category, category])] },
              { label: "Lock type", value: lockFilter, onChange: handleLockChange, options: [["all", "All lock types"], ["flexible", "Flexible"], ["locked", "Fixed lock"]] },
              { label: "Sort by", value: sortBy, onChange: (value: string) => { setSortBy(value as StakingSortOption); setCurrentPage(1); }, options: [["date-desc", "Newest first"], ["date-asc", "Oldest first"], ["apy-desc", "Highest APY"], ["apy-asc", "Lowest APY"], ["staked-desc", "Most staked"], ["lock-asc", "Shortest lock"], ["lock-desc", "Longest lock"], ["name-asc", "Name A–Z"], ["name-desc", "Name Z–A"]] },
            ].map((filter) => (
              <label key={filter.label} className="block min-w-0">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{filter.label}</span>
                <select value={filter.value} onChange={(e) => filter.onChange(e.target.value)} className="h-9 w-full rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground outline-none transition-colors focus:border-primary">
                  {filter.options.map(([value, label]) => <option key={value} value={value} className="bg-card text-foreground">{label}</option>)}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span>Showing <strong className="font-semibold text-foreground">{totalItems > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong className="font-semibold text-foreground">{totalItems}</strong> matching pools</span>
              {activeFiltersCount > 0 && <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{activeFiltersCount} active filters</span>}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">Reset filters</Button>}
              <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))} className="h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground outline-none" aria-label="Items per page">
                <option value={6}>6 / page</option><option value={9}>9 / page</option><option value={12}>12 / page</option>
              </select>
            </div>
          </div>
        </div>

        {paginatedPools.length === 0 ? (
          <div className="p-8"><EmptyState icon={<Layers className="h-7 w-7 text-primary/70" />} title="No Staking Pools Found" description="No pools match your current search or filters. Adjust your criteria or reset filters to see more results." action={<Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">Reset filters</Button>} /></div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-border/60 bg-secondary/25 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-5 py-3.5">Pool / Asset</th><th className="px-4 py-3.5">Network</th><th className="px-4 py-3.5">Lock terms</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Listed APY</th><th className="px-4 py-3.5">Total staked</th><th className="px-4 py-3.5">Depositors</th><th className="px-5 py-3.5 text-right"> </th></tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedPools.map((pool) => {
                  const token = tokenMap.get(pool.tokenId);
                  const isSepolia = pool.network.toLowerCase().includes("sepolia") || pool.network.toLowerCase() === "ethereum";
                  const lockInfo = formatLockDuration(pool.lockPeriodDays);
                  return (
                    <tr key={pool.id} className="group transition-colors hover:bg-secondary/20">
                      <td className="px-5 py-3.5"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">{token?.symbol?.[0] || pool.tokenId[0]?.toUpperCase() || "S"}</span><div className="min-w-0"><Link to={`/staking/pools/${pool.id}`} className="block truncate text-xs font-semibold text-foreground transition-colors group-hover:text-primary">{pool.name}</Link><span className="mt-1 block truncate text-[10px] font-mono text-muted-foreground">{token?.symbol || pool.tokenId.toUpperCase()} · {pool.category || "Staking pool"}</span></div></div></td>
                      <td className="px-4 py-3.5"><span className={`rounded-md border px-2 py-1 text-[10px] ${isSepolia ? "border-primary/20 bg-primary/10 text-primary" : "border-border/50 bg-secondary/30 text-muted-foreground"}`}>{isSepolia ? "Sepolia" : pool.network}</span></td>
                      <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">{lockInfo.isFlexible ? <Unlock className="h-3 w-3 text-emerald-400" /> : <Lock className="h-3 w-3 text-amber-400" />}{lockInfo.isFlexible ? "Flexible" : `${pool.lockPeriodDays} days`}</span></td>
                      <td className="px-4 py-3.5"><StatusBadge status={pool.status} /></td>
                      <td className="px-4 py-3.5"><span className="font-mono text-sm font-bold text-emerald-400">{pool.apy || "—"}</span></td>
                      <td className="px-4 py-3.5 font-mono text-foreground">{pool.totalStaked || "—"}</td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{pool.stakerCount !== undefined ? pool.stakerCount.toLocaleString() : "—"}</td>
                      <td className="px-5 py-3.5 text-right"><Button asChild size="sm" variant="outline" className="h-8 border-border/60 px-3 text-[11px]"><Link to={`/staking/pools/${pool.id}`}>{pool.status === "active" ? "View pool" : "Details"} <span className="ml-1">↗</span></Link></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
            {paginatedPools.map((pool) => {
              const token = tokenMap.get(pool.tokenId);
              const project = pool.projectId ? projectMap.get(pool.projectId) : undefined;
              const lockInfo = formatLockDuration(pool.lockPeriodDays);
              const isSepolia = pool.network.toLowerCase().includes("sepolia") || pool.network.toLowerCase() === "ethereum";
              return (
                <article key={pool.id} className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-4 transition-all hover:border-primary/50">
                  <div>
                    <div className="flex items-center justify-between gap-2"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${isSepolia ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{isSepolia ? "Ethereum Sepolia" : pool.network}</span><StatusBadge status={pool.status} /></div>
                    <div className="mt-3 flex items-center gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{token?.symbol?.[0] || pool.tokenId[0]?.toUpperCase() || "S"}</span><div className="min-w-0"><Link to={`/staking/pools/${pool.id}`} className="block truncate text-sm font-semibold text-foreground hover:text-primary">{pool.name}</Link><span className="text-[10px] font-mono text-muted-foreground">{token?.symbol || pool.tokenId.toUpperCase()}{project ? ` · ${project.name}` : ""}</span></div></div>
                    <div className="mt-4 flex items-end justify-between rounded-xl border border-emerald-500/15 bg-emerald-500/[0.045] p-3"><div><span className="block text-[9px] uppercase tracking-wider text-muted-foreground">Listed APY</span><span className="mt-0.5 block font-mono text-xl font-bold text-emerald-400">{pool.apy || "—"}</span></div><div className="text-right"><span className="block text-[9px] uppercase tracking-wider text-muted-foreground">Lock terms</span><span className="mt-1 inline-flex items-center gap-1 text-xs text-foreground">{lockInfo.isFlexible ? <Unlock className="h-3 w-3 text-emerald-400" /> : <Lock className="h-3 w-3 text-amber-400" />}{lockInfo.isFlexible ? "Flexible" : `${pool.lockPeriodDays} days`}</span></div></div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-secondary/30 p-2"><span className="block text-[9px] text-muted-foreground">Total staked</span><span className="mt-1 block truncate font-mono text-foreground">{pool.totalStaked || "—"}</span></div><div className="rounded-lg bg-secondary/30 p-2"><span className="block text-[9px] text-muted-foreground">Depositors</span><span className="mt-1 block font-mono text-foreground">{pool.stakerCount?.toLocaleString() ?? "—"}</span></div></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3"><span className="truncate text-[10px] text-muted-foreground">{pool.category || "Staking pool"}</span><Button asChild size="sm" className="h-8 bg-primary px-3 text-[11px] text-primary-foreground"><Link to={`/staking/pools/${pool.id}`}>View details</Link></Button></div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-muted-foreground">Showing <strong className="font-semibold text-foreground">{totalItems > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong className="font-semibold text-foreground">{totalItems}</strong> matching pools</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage <= 1} className="h-8 px-3 text-xs disabled:opacity-40"><ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous</Button>
              <span className="px-1 text-xs text-muted-foreground">Page {safeCurrentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage >= totalPages} className="h-8 px-3 text-xs disabled:opacity-40">Next <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
