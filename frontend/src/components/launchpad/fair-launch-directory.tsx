"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_FAIR_LAUNCHES, MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { Token, Project } from "@/types";
import {
  Sparkles,
  Search,
  X,
  LayoutGrid,
  List,
  Plus,
  Coins,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Info,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Flame,
} from "lucide-react";

export type FairLaunchSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "progress-desc"
  | "raised-desc";

export interface FairLaunchDirectoryProps {
  mode?: "canonical" | "explore";
}

// Helper to compute progress percentage against soft cap (e.g. "42.5 ETH" / "25 ETH" -> 170%)
export function calculateProgress(totalRaised?: string, softCap?: string): number {
  if (!totalRaised || !softCap) return 0;
  const raisedNum = parseFloat(totalRaised.replace(/[^0-9.]/g, ""));
  const capNum = parseFloat(softCap.replace(/[^0-9.]/g, ""));
  if (isNaN(raisedNum) || isNaN(capNum) || capNum === 0) return 0;
  return Math.round((raisedNum / capNum) * 100);
}

// Helper to extract numeric amount from string (e.g. "42.5 ETH" -> 42.5)
export function parseAmount(val?: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export function FairLaunchDirectory({ mode = "canonical" }: FairLaunchDirectoryProps) {
  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<FairLaunchSortOption>("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Maps for fast token and project metadata lookups
  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    MOCK_TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    MOCK_PROJECTS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Unique categories derived from launches and linked tokens
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    MOCK_FAIR_LAUNCHES.forEach((fl) => {
      if (fl.category) set.add(fl.category);
      const token = tokenMap.get(fl.tokenId);
      if (token?.category) set.add(token.category);
    });
    return Array.from(set).sort();
  }, [tokenMap]);

  // Filter Change Handlers with immediate page reset
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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setNetworkFilter("all");
    setCategoryFilter("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  // Filtered fair launches
  const filteredLaunches = useMemo(() => {
    return MOCK_FAIR_LAUNCHES.filter((fl) => {
      const token = tokenMap.get(fl.tokenId);
      const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = fl.title.toLowerCase().includes(q);
        const matchesDesc = fl.description?.toLowerCase().includes(q) ?? false;
        const matchesTokenName = token?.name.toLowerCase().includes(q) ?? false;
        const matchesTokenSymbol = token?.symbol.toLowerCase().includes(q) ?? false;
        const matchesProject = project?.name.toLowerCase().includes(q) ?? false;

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesTokenName &&
          !matchesTokenSymbol &&
          !matchesProject
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "all" && fl.status !== statusFilter) {
        return false;
      }

      // 3. Network Filter (D-04 Scope)
      if (networkFilter === "sepolia") {
        const net = fl.network.toLowerCase();
        if (!net.includes("sepolia") && net !== "ethereum") return false;
      } else if (networkFilter !== "all") {
        if (fl.network !== networkFilter) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "all") {
        const cat = fl.category || token?.category;
        if (cat !== categoryFilter) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, networkFilter, categoryFilter, tokenMap, projectMap]);

  // Sorted fair launches
  const sortedLaunches = useMemo(() => {
    return [...filteredLaunches].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
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
        case "progress-desc": {
          const progA = calculateProgress(a.totalRaised, a.softCap);
          const progB = calculateProgress(b.totalRaised, b.softCap);
          return progB - progA;
        }
        case "raised-desc": {
          const raisedA = parseAmount(a.totalRaised);
          const raisedB = parseAmount(b.totalRaised);
          return raisedB - raisedA;
        }
        default:
          return 0;
      }
    });
  }, [filteredLaunches, sortBy]);

  // Pagination Math
  const totalItems = sortedLaunches.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedLaunches = sortedLaunches.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    networkFilter !== "all" ||
    categoryFilter !== "all";

  // Table header click sort
  const handleSortClick = (field: "name" | "date" | "progress" | "raised") => {
    if (field === "name") {
      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc");
    } else if (field === "date") {
      setSortBy(sortBy === "date-desc" ? "date-asc" : "date-desc");
    } else if (field === "progress") {
      setSortBy(sortBy === "progress-desc" ? "name-asc" : "progress-desc");
    } else if (field === "raised") {
      setSortBy(sortBy === "raised-desc" ? "name-asc" : "raised-desc");
    }
  };

  // Helper for initial avatar generator
  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title={mode === "canonical" ? "All Fair Launches" : "Fair Launches Discovery"}
        description={
          mode === "canonical"
            ? "Public token offerings with 100% fair distribution, locked founder allocations, and automated DEX liquidity pool setup."
            : "Equal-opportunity decentralized launches without private allocations, seed rounds, or team pre-mines."
        }
        breadcrumbs={
          mode === "canonical"
            ? [
                { label: "Launchpad", href: "/launchpad" },
                { label: "Fair Launches" },
              ]
            : [
                { label: "Explore", href: "/explore" },
                { label: "Fair Launches" },
              ]
        }
        actions={
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold hover:bg-primary/90"
          >
            <Link href="/launchpad/launches/create">
              <Plus className="h-3.5 w-3.5" /> Create Fair Launch
            </Link>
          </Button>
        }
      />

      {/* 2. Demonstration Data & D-04 Architecture Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Info className="h-4 w-4 shrink-0" />
          <span>Demonstration Data & Network Scope Notice (Architecture Decision D-04)</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          All fair launch offerings, contribution goals, participant metrics, and progress percentages
          displayed are simulated demonstration data. Per <strong>Architecture Decision D-04</strong>,
          <strong> Ethereum Sepolia (Chain ID: 11155111)</strong> is the only active EVM wallet network.
          Non-Sepolia listings (e.g. Base, Arbitrum One, Polygon) reflect future catalog metadata and do not imply
          active wallet or transaction support on those chains. No real funds are raised or required.
        </p>
      </div>

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Offerings</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {MOCK_FAIR_LAUNCHES.length}
          </div>
          <p className="text-[11px] text-muted-foreground">Decentralized fair launches</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Live Now</span>
            <Flame className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "live").length}
          </div>
          <p className="text-[11px] text-muted-foreground">Accepting contributions</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sepolia Active (D-04)</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            {
              MOCK_FAIR_LAUNCHES.filter(
                (fl) =>
                  fl.network.toLowerCase().includes("sepolia") ||
                  fl.network === "Ethereum"
              ).length
            }
          </div>
          <p className="text-[11px] text-muted-foreground">Chain ID 11155111</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Raised (Simulated)</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {MOCK_FAIR_LAUNCHES.reduce((acc, fl) => acc + parseAmount(fl.totalRaised), 0).toFixed(1)}{" "}
            ETH
          </div>
          <p className="text-[11px] text-muted-foreground">Demonstration pools</p>
        </div>
      </div>

      {/* 4. Controls Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md space-y-4">
        {/* Top bar: Search + View Mode */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by launch title, token, symbol or description..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 text-xs bg-secondary/30 border-border/60 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border/60 bg-secondary/30 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-9 rounded-lg border border-border/60 bg-secondary/30 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              aria-label="Page Size"
            >
              <option value={4} className="bg-card text-foreground">
                4 per page
              </option>
              <option value={6} className="bg-card text-foreground">
                6 per page
              </option>
              <option value={12} className="bg-card text-foreground">
                12 per page
              </option>
            </select>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Statuses
              </option>
              <option value="live" className="bg-card text-foreground">
                Live
              </option>
              <option value="scheduled" className="bg-card text-foreground">
                Scheduled
              </option>
              <option value="ended" className="bg-card text-foreground">
                Ended
              </option>
              <option value="finalized" className="bg-card text-foreground">
                Finalized
              </option>
              <option value="draft" className="bg-card text-foreground">
                Draft
              </option>
            </select>
          </div>

          {/* D-04 Network Scope Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Network:</span>
            <select
              value={networkFilter}
              onChange={(e) => handleNetworkChange(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
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
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
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

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FairLaunchSortOption)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="date-desc" className="bg-card text-foreground">
                Newest First
              </option>
              <option value="date-asc" className="bg-card text-foreground">
                Oldest First
              </option>
              <option value="name-asc" className="bg-card text-foreground">
                Name (A to Z)
              </option>
              <option value="name-desc" className="bg-card text-foreground">
                Name (Z to A)
              </option>
              <option value="progress-desc" className="bg-card text-foreground">
                Highest Progress
              </option>
              <option value="raised-desc" className="bg-card text-foreground">
                Total Raised
              </option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
            >
              <X className="h-3 w-3 mr-1" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* 5. Listing Presentation (Grid or Table) */}
      {paginatedLaunches.length === 0 ? (
        <EmptyState
          icon={<Coins className="h-7 w-7 text-primary/70" />}
          title="No Fair Launches Found"
          description="No fair launches match your current filters and search query. Try broadening your keywords or resetting filters."
          action={
            hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs border-border/60"
              >
                Reset All Filters
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLaunches.map((fl) => {
            const token = tokenMap.get(fl.tokenId);
            const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
            const progress = calculateProgress(fl.totalRaised, fl.softCap);
            const isSepolia =
              fl.network.toLowerCase().includes("sepolia") || fl.network === "Ethereum";

            return (
              <div
                key={fl.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Card Header: Network + Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                          isSepolia
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "bg-muted text-muted-foreground border border-border/40"
                        }`}
                      >
                        {fl.network}
                      </span>
                      {fl.category && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-secondary/40 text-muted-foreground px-1.5 py-0"
                        >
                          {fl.category}
                        </Badge>
                      )}
                    </div>
                    <StatusBadge status={fl.status} />
                  </div>

                  {/* Title & Token Identity */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center font-bold text-sm text-primary font-mono shadow-inner">
                      {token ? token.symbol.slice(0, 3) : getInitials(fl.title)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/launchpad/launches/${fl.id}`}
                        className="font-bold text-foreground text-sm hover:text-primary transition-colors line-clamp-1 group-hover:text-primary"
                      >
                        {fl.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        {token ? (
                          <Link
                            href={`/tokens/${token.id}`}
                            className="font-mono text-primary hover:underline font-semibold"
                          >
                            ${token.symbol}
                          </Link>
                        ) : (
                          <span className="font-mono text-foreground font-semibold">
                            {fl.tokenId.toUpperCase()}
                          </span>
                        )}
                        {project && (
                          <>
                            <span className="text-muted-foreground/60">•</span>
                            <Link
                              href={`/projects/${project.id}`}
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
                  {fl.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {fl.description}
                    </p>
                  )}

                  {/* Progress Bar & Allocation Info */}
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Softcap Progress</span>
                      <span className="font-mono font-bold text-foreground">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 100
                            ? "bg-emerald-400"
                            : progress > 0
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                      <span>Raised: <strong className="font-mono text-foreground">{fl.totalRaised || "0 ETH"}</strong></span>
                      <span>Softcap: <strong className="font-mono text-foreground">{fl.softCap || "TBD"}</strong></span>
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary/30 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Total Selling</span>
                      <span className="font-mono font-semibold text-foreground truncate block">
                        {fl.totalSelling || "Public Allocation"}
                      </span>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                        <Users className="h-3 w-3" /> Participants
                      </span>
                      <span className="font-mono font-semibold text-foreground block">
                        {fl.participantCount ? fl.participantCount.toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>

                  {/* Time metadata */}
                  {(fl.startTime || fl.endTime) && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {fl.status === "scheduled" ? "Starts:" : "Ends:"}
                      </span>
                      <span className="text-foreground">
                        {fl.status === "scheduled"
                          ? fl.startTime?.slice(0, 10)
                          : fl.endTime?.slice(0, 10) || "TBD"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ID: {fl.id}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                  >
                    <Link href={`/launchpad/launches/${fl.id}`}>Inspect Launch</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/20 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th
                    onClick={() => handleSortClick("name")}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Launch / Token</span>
                      {sortBy === "name-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                      {sortBy === "name-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th className="py-3 px-3">Network & Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th
                    onClick={() => handleSortClick("raised")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Raised / Softcap</span>
                      {sortBy === "raised-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("progress")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Progress</span>
                      {sortBy === "progress-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th className="py-3 px-3">Participants</th>
                  <th
                    onClick={() => handleSortClick("date")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Timeline</span>
                      {sortBy === "date-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                      {sortBy === "date-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedLaunches.map((fl) => {
                  const token = tokenMap.get(fl.tokenId);
                  const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
                  const progress = calculateProgress(fl.totalRaised, fl.softCap);
                  const isSepolia =
                    fl.network.toLowerCase().includes("sepolia") || fl.network === "Ethereum";

                  return (
                    <tr
                      key={fl.id}
                      className="hover:bg-secondary/10 transition-colors group"
                    >
                      {/* Name & Token */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono">
                            {token ? token.symbol.slice(0, 3) : getInitials(fl.title)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/launchpad/launches/${fl.id}`}
                              className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {fl.title}
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              {token ? (
                                <Link
                                  href={`/tokens/${token.id}`}
                                  className="font-mono text-primary hover:underline font-semibold"
                                >
                                  ${token.symbol}
                                </Link>
                              ) : (
                                <span className="font-mono text-foreground font-semibold">
                                  {fl.tokenId.toUpperCase()}
                                </span>
                              )}
                              {project && (
                                <>
                                  <span className="text-muted-foreground/60">•</span>
                                  <span className="truncate">{project.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Network & Category */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono ${
                              isSepolia
                                ? "bg-primary/10 text-primary border border-primary/30"
                                : "bg-muted text-muted-foreground border border-border/40"
                            }`}
                          >
                            {fl.network}
                          </span>
                          {fl.category && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {fl.category}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={fl.status} />
                      </td>

                      {/* Raised / Softcap */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="text-foreground font-semibold">
                          {fl.totalRaised || "0 ETH"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Soft: {fl.softCap || "TBD"}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-3">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="font-semibold text-foreground">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                progress >= 100
                                  ? "bg-emerald-400"
                                  : progress > 0
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Participants */}
                      <td className="py-3.5 px-3 font-mono text-foreground">
                        {fl.participantCount ? fl.participantCount.toLocaleString() : "0"}
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-muted-foreground">
                        {fl.status === "scheduled"
                          ? `Starts: ${fl.startTime?.slice(0, 10) || "TBD"}`
                          : `Ends: ${fl.endTime?.slice(0, 10) || "TBD"}`}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-border/60 hover:border-primary/50"
                        >
                          <Link href={`/launchpad/launches/${fl.id}`}>Inspect</Link>
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
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
            <strong className="text-foreground">
              {Math.min(startIndex + pageSize, totalItems)}
            </strong>{" "}
            of <strong className="text-foreground">{totalItems}</strong> fair launches
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage <= 1}
              className="h-8 px-2.5 text-xs border-border/60"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={effectivePage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 p-0 text-xs ${
                  effectivePage === page
                    ? "bg-primary text-primary-foreground font-bold"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage >= totalPages}
              className="h-8 px-2.5 text-xs border-border/60"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
