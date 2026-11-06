import React, { useState, useMemo } from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataArtwork } from "@/components/shared/data-artwork";
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
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);

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

        if (
          !matchesName &&
          !matchesDesc &&
          !matchesTokenName &&
          !matchesTokenSymbol &&
          !matchesProject
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

  // Sort toggle helper for table headers
  const toggleSort = (field: "name" | "apy" | "staked" | "lock" | "date") => {
    if (field === "name") {
      setSortBy((prev) => (prev === "name-asc" ? "name-desc" : "name-asc"));
    } else if (field === "apy") {
      setSortBy((prev) => (prev === "apy-desc" ? "apy-asc" : "apy-desc"));
    } else if (field === "staked") {
      setSortBy((prev) => (prev === "staked-desc" ? "name-asc" : "staked-desc"));
    } else if (field === "lock") {
      setSortBy((prev) => (prev === "lock-asc" ? "lock-desc" : "lock-asc"));
    } else if (field === "date") {
      setSortBy((prev) => (prev === "date-desc" ? "date-asc" : "date-desc"));
    }
    setCurrentPage(1);
  };

  // Total depositors across all pools
  const totalStakersCount = useMemo(() => {
    return STAKING_POOLS.reduce((acc, p) => acc + (p.stakerCount || 0), 0);
  }, []);

  return (
    <div className={mode === "canonical" ? "staking-page space-y-8" : "mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8"}>
      {mode === "canonical" && <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "Pools" }]} />}
      {/* 1. Page Header */}
      <PageHeader
        title={mode === "canonical" ? "All Staking Pools" : "Staking Pool Discovery"}
        description={
          mode === "canonical"
            ? "Browse verified non-custodial staking vaults, single-asset reward pools, and ecosystem yield programs."
            : "Earn simulated yields by staking project tokens in verified, non-custodial reward vaults across the ecosystem."
        }
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link to="/staking/my">
                <Layers className="h-3.5 w-3.5 mr-1" /> My Positions
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold hover:bg-primary/90"
            >
              <Link to="/staking/pools/create">
                <Plus className="h-3.5 w-3.5" /> Deploy Staking Pool
              </Link>
            </Button>
          </div>
        }
      />

      {/* 2. Demonstration Data & D-04 Architecture Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Info className="h-4 w-4 shrink-0" />
          <span>Demonstration Data & Network Scope Notice (Architecture Decision D-04)</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          All staking APYs, TVL figures, total staked amounts, lock schedules, and reward distributions displayed
          are simulated demonstration data. Per <strong>Architecture Decision D-04</strong>,
          <strong> Ethereum Sepolia (Chain ID: 11155111)</strong> is the only active EVM wallet network.
          Non-Sepolia listings (e.g. Arbitrum One, Base, Polygon) reflect future catalog metadata and do not imply
          active wallet, staking, or transaction support on those networks. No real cryptocurrency or yield is generated.
        </p>
      </div>

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Pools</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {STAKING_POOLS.length}
          </div>
          <p className="text-[11px] text-muted-foreground">Yield vaults cataloged</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Vaults</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {STAKING_POOLS.filter((pool) => pool.status === "active").length}
          </div>
          <p className="text-[11px] text-muted-foreground">Currently accruing yield</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sepolia Active (D-04)</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            {
              STAKING_POOLS.filter(
                (pool) =>
                  pool.network.toLowerCase().includes("sepolia") ||
                  pool.network.toLowerCase() === "ethereum"
              ).length
            }
          </div>
          <p className="text-[11px] text-muted-foreground">Chain ID 11155111</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Simulated Depositors</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {totalStakersCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Community participants</p>
        </div>
      </div>

      {/* 4. Filter and Control Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by pool, token, project, or description..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 bg-secondary/30 border-border/60 text-xs h-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick toggle controls (View mode & Page size) */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border/60 bg-secondary/30 p-0.5">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-7 w-7 p-0 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={`h-7 w-7 p-0 ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              aria-label="Items per page"
            >
              <option value={4} className="bg-card text-foreground">
                4 / page
              </option>
              <option value={6} className="bg-card text-foreground">
                6 / page
              </option>
              <option value={12} className="bg-card text-foreground">
                12 / page
              </option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns & Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-border/40">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Statuses
              </option>
              <option value="active" className="bg-card text-foreground">
                Active
              </option>
              <option value="pending" className="bg-card text-foreground">
                Pending
              </option>
              <option value="ended" className="bg-card text-foreground">
                Ended
              </option>
              <option value="draft" className="bg-card text-foreground">
                Draft
              </option>
            </select>
          </div>

          {/* Network Filter (D-04 Strict Scope) */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Network
            </label>
            <select
              value={networkFilter}
              onChange={(e) => handleNetworkChange(e.target.value)}
              className="w-full h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Networks
              </option>
              <option value="sepolia" className="bg-card text-foreground">
                Ethereum Sepolia (11155111 — Active)
              </option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Categories
              </option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Lock Duration Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Lock Type
            </label>
            <select
              value={lockFilter}
              onChange={(e) => handleLockChange(e.target.value)}
              className="w-full h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Lock Types
              </option>
              <option value="flexible" className="bg-card text-foreground">
                Flexible (No Lock)
              </option>
              <option value="locked" className="bg-card text-foreground">
                Fixed Duration Lock
              </option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as StakingSortOption);
                setCurrentPage(1);
              }}
              className="w-full h-8 rounded-lg border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="date-desc" className="bg-card text-foreground">
                Newest Created
              </option>
              <option value="date-asc" className="bg-card text-foreground">
                Oldest Created
              </option>
              <option value="apy-desc" className="bg-card text-foreground">
                APY (Highest first)
              </option>
              <option value="apy-asc" className="bg-card text-foreground">
                APY (Lowest first)
              </option>
              <option value="staked-desc" className="bg-card text-foreground">
                Total Staked (Highest)
              </option>
              <option value="lock-asc" className="bg-card text-foreground">
                Lockup (Shortest first)
              </option>
              <option value="lock-desc" className="bg-card text-foreground">
                Lockup (Longest first)
              </option>
              <option value="name-asc" className="bg-card text-foreground">
                Pool Name (A to Z)
              </option>
              <option value="name-desc" className="bg-card text-foreground">
                Pool Name (Z to A)
              </option>
            </select>
          </div>
        </div>

        {/* Results count & Clear filters indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}
            </span>{" "}
            of <span className="font-semibold text-foreground">{totalItems}</span> pools
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium">
                {activeFiltersCount} {activeFiltersCount === 1 ? "filter" : "filters"} applied
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* 5. Directory Content: Grid vs Table vs Empty State */}
      {paginatedPools.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-7 w-7 text-primary/70" />}
          title="No Staking Pools Found"
          description="No staking vaults match your active filter criteria. Try adjusting your search query, status, network, or lock type filters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs border-border/60"
            >
              Reset Filters
            </Button>
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPools.map((pool) => {
            const token = tokenMap.get(pool.tokenId);
            const project = pool.projectId ? projectMap.get(pool.projectId) : undefined;
            const isSepolia =
              pool.network.toLowerCase().includes("sepolia") ||
              pool.network.toLowerCase() === "ethereum";
            const lockInfo = formatLockDuration(pool.lockPeriodDays);

            return (
              <div
                key={pool.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-lg space-y-4"
              >
                <DataArtwork src={(pool as typeof pool & { image?: string }).image} alt={`${pool.name} staking pool`} className="h-36 w-full rounded-xl border border-border/40" fallbackLabel="Staking pool" />
                {/* Header: Network, Category & Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                          isSepolia
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground border border-border/40"
                        }`}
                        title={
                          isSepolia
                            ? "Supported on Ethereum Sepolia (Chain ID: 11155111)"
                            : "Catalog discovery metadata only — no wallet connection"
                        }
                      >
                        {isSepolia ? "Ethereum Sepolia (D-04)" : `${pool.network} (Catalog)`}
                      </span>
                      {pool.category && (
                        <span className="rounded bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {pool.category}
                        </span>
                      )}
                      {pool.source && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${pool.origin === 'external' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {pool.source}
                        </span>
                      )}
                    </div>
                    <StatusBadge status={pool.status} />
                  </div>

                  {/* Pool Title & Description */}
                  <div>
                    <h3 className="font-semibold text-foreground text-sm hover:text-primary transition-colors line-clamp-1">
                      <Link to={`/staking/pools/${pool.id}`}>{pool.name}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {pool.description || "Audited non-custodial staking vault with block-by-block reward issuance."}
                    </p>
                  </div>

                  {/* Token & Project Association */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                        {token?.symbol?.[0] || pool.tokenId[0]?.toUpperCase() || "S"}
                      </div>
                      <div className="truncate">
                        <Link
                          to={`/tokens/${pool.tokenId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {token?.name || pool.tokenId}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {token?.symbol || pool.tokenId.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {project && (
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-[11px] text-muted-foreground hover:text-primary truncate max-w-[120px] text-right"
                      >
                        {project.name}
                      </Link>
                    )}
                  </div>

                  {/* APY Highlight Callout */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <span>Est. Reward APY</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${pool.origin === 'external' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {pool.origin === 'external' ? 'DefiLlama Yields' : 'Simulated'}
                        </span>
                      </div>
                      <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                        {pool.apy || "0%"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">Lockup Terms</div>
                      <div className="inline-flex items-center gap-1 text-xs font-mono font-medium text-foreground mt-0.5">
                        {lockInfo.isFlexible ? (
                          <>
                            <Unlock className="h-3 w-3 text-emerald-400" />
                            <span>Flexible</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 text-amber-400" />
                            <span>{pool.lockPeriodDays} Days</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Staking Metrics Grid */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Staked:</span>
                      <span className="font-mono font-semibold text-foreground">
                        {pool.totalStaked || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Min Deposit:</span>
                      <span className="font-mono text-foreground">
                        {pool.minStake || "No min"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Depositors:</span>
                      <span className="font-mono text-foreground">
                        {pool.stakerCount !== undefined ? pool.stakerCount.toLocaleString() : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ID: {pool.id}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                  >
                    <Link to={`/staking/pools/${pool.id}`}>
                      {pool.status === "active" ? "Stake Asset" : "View Vault"}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-medium">
                <tr>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Pool / Token</span>
                      {sortBy === "name-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "name-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Network & Category</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("lock")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Lockup</span>
                      {sortBy === "lock-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "lock-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("apy")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Est. APY (Simulated)</span>
                      {sortBy === "apy-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "apy-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("staked")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Staked</span>
                      {sortBy === "staked-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Depositors</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {paginatedPools.map((pool) => {
                  const token = tokenMap.get(pool.tokenId);
                  const isSepolia =
                    pool.network.toLowerCase().includes("sepolia") ||
                    pool.network.toLowerCase() === "ethereum";
                  const lockInfo = formatLockDuration(pool.lockPeriodDays);

                  return (
                    <tr
                      key={pool.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Pool / Token */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {token?.symbol?.[0] || pool.tokenId[0]?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <Link
                              to={`/staking/pools/${pool.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors block"
                            >
                              {pool.name}
                            </Link>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {token?.symbol || pool.tokenId.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Network & Category */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono ${
                              isSepolia
                                ? "bg-primary/15 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground border border-border/40"
                            }`}
                          >
                            {isSepolia ? "Sepolia (D-04)" : pool.network}
                          </span>
                          {pool.category && (
                            <div className="text-[11px] text-muted-foreground">
                              {pool.category}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Lock Duration */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 font-mono text-xs">
                          {lockInfo.isFlexible ? (
                            <>
                              <Unlock className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Flexible</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-amber-400" />
                              <span className="text-foreground">{pool.lockPeriodDays} Days</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={pool.status} />
                      </td>

                      {/* APY */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {pool.apy || "0%"}
                        </span>
                      </td>

                      {/* Total Staked */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-medium text-foreground">
                          {pool.totalStaked || "0"}
                        </span>
                      </td>

                      {/* Depositors */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-muted-foreground">
                          {pool.stakerCount !== undefined ? pool.stakerCount.toLocaleString() : "—"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          asChild
                          size="sm"
                          className="h-7 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                        >
                          <Link to={`/staking/pools/${pool.id}`}>
                            {pool.status === "active" ? "Stake" : "View"}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{safeCurrentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="h-8 px-2 text-xs border-border/60 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={safeCurrentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 p-0 text-xs font-mono ${
                  safeCurrentPage === pageNum
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {pageNum}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="h-8 px-2 text-xs border-border/60 disabled:opacity-40"
              aria-label="Next page"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
