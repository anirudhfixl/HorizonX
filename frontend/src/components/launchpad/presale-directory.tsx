"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { Token, Project } from "@/types";
import {
  Rocket,
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
} from "lucide-react";

export type PresaleSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "progress-desc"
  | "raised-desc";

export interface PresaleDirectoryProps {
  mode?: "canonical" | "explore";
}

// Helper to compute progress percentage from raised and cap strings (e.g. "118.5 ETH" / "150 ETH")
export function calculateProgress(totalRaised?: string, hardCap?: string): number {
  if (!totalRaised || !hardCap) return 0;
  const raisedNum = parseFloat(totalRaised.replace(/[^0-9.]/g, ""));
  const capNum = parseFloat(hardCap.replace(/[^0-9.]/g, ""));
  if (isNaN(raisedNum) || isNaN(capNum) || capNum === 0) return 0;
  return Math.min(100, Math.max(0, (raisedNum / capNum) * 100));
}

// Helper to extract numeric value from string (e.g. "118.5 ETH" -> 118.5)
export function parseAmount(val?: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export function PresaleDirectory({ mode = "canonical" }: PresaleDirectoryProps) {
  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<PresaleSortOption>("date-desc");
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

  // Unique categories derived from presales and linked tokens
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    MOCK_PRESALES.forEach((ps) => {
      if (ps.category) set.add(ps.category);
      const token = tokenMap.get(ps.tokenId);
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

  // Filtered presales
  const filteredPresales = useMemo(() => {
    return MOCK_PRESALES.filter((ps) => {
      const token = tokenMap.get(ps.tokenId);
      const project = ps.projectId ? projectMap.get(ps.projectId) : undefined;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = ps.title.toLowerCase().includes(q);
        const matchesDesc = ps.description?.toLowerCase().includes(q) ?? false;
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
      if (statusFilter !== "all" && ps.status !== statusFilter) {
        return false;
      }

      // 3. Network Filter (D-04 Scope)
      if (networkFilter === "sepolia") {
        const net = ps.network.toLowerCase();
        if (!net.includes("sepolia") && net !== "ethereum") return false;
      } else if (networkFilter !== "all") {
        if (ps.network !== networkFilter) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "all") {
        const cat = ps.category || token?.category;
        if (cat !== categoryFilter) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, networkFilter, categoryFilter, tokenMap, projectMap]);

  // Sorted presales
  const sortedPresales = useMemo(() => {
    return [...filteredPresales].sort((a, b) => {
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
          const progA = calculateProgress(a.totalRaised, a.hardCap);
          const progB = calculateProgress(b.totalRaised, b.hardCap);
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
  }, [filteredPresales, sortBy]);

  // Pagination Math
  const totalItems = sortedPresales.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedPresales = sortedPresales.slice(startIndex, startIndex + pageSize);

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
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title={mode === "canonical" ? "All Presales" : "Presales Discovery"}
        description={
          mode === "canonical"
            ? "Browse and discover verified initial token presales. Filter by status, network, and raised progress."
            : "Explore live, scheduled, and past presales across the ProMiners ecosystem. Non-custodial escrow and transparent metrics."
        }
        breadcrumbs={
          mode === "canonical"
            ? [
                { label: "Launchpad", href: "/launchpad" },
                { label: "Presales" },
              ]
            : [
                { label: "Explore", href: "/explore" },
                { label: "Presales" },
              ]
        }
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/launchpad/presales/create">
              <Plus className="h-3.5 w-3.5" /> Create Presale
            </Link>
          </Button>
        }
        badge={
          <Badge variant="outline" className="border-primary/40 text-primary">
            {MOCK_PRESALES.length} Campaigns Listed
          </Badge>
        }
      />

      {/* 2. D-04 Scope & Demo Notice Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong className="text-foreground">Demonstration Data Notice:</strong> Presale metrics, allocations, contribution caps,
              and fundraising progress are simulated for demonstration. Per Architecture Decision{" "}
              <strong className="text-foreground">D-04</strong>, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only approved and supported EVM wallet network. Ecosystem metadata indicates protocol deployment origins and does not imply wallet connectivity or transaction support for non-Sepolia networks.
            </span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px] self-start sm:self-auto shrink-0">
            D-04: Sepolia (11155111) Only
          </Badge>
        </div>
      </div>

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Total Presales</span>
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{MOCK_PRESALES.length}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Campaigns listed</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Live Now</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PRESALES.filter((ps) => ps.status === "live").length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active contributions</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Sepolia Active</span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PRESALES.filter((ps) => ps.network.toLowerCase().includes("sepolia")).length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active D-04 scope</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Total Raised</span>
            <Coins className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PRESALES.reduce((acc, ps) => acc + parseAmount(ps.totalRaised), 0).toFixed(1)} ETH
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Simulated ecosystem volume</p>
        </div>
      </div>

      {/* 4. Controls Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input (4 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by presale title, token ($QNET), or project..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 bg-secondary/30 border-border/70 text-xs text-foreground placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses ({MOCK_PRESALES.length})</option>
              <option value="live">Live Only</option>
              <option value="scheduled">Scheduled Only</option>
              <option value="ended">Ended Only</option>
              <option value="finalized">Finalized</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Network Filter (2 cols) - D-04 Sepolia scope restriction */}
          <div className="lg:col-span-2">
            <select
              value={networkFilter}
              onChange={(e) => handleNetworkChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by network"
            >
              <option value="all">All Networks ({MOCK_PRESALES.length})</option>
              <option value="sepolia">Ethereum Sepolia (11155111 — Active)</option>
            </select>
          </div>

          {/* Category Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode & Reset (2 cols) */}
          <div className="lg:col-span-2 flex items-center justify-end gap-2">
            <div className="flex items-center rounded-lg border border-border/70 bg-secondary/30 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                title="Reset all filters"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Secondary controls row: Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Showing active opportunities on Ethereum Sepolia & catalog discovery</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as PresaleSortOption)}
              className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Sort presales"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="progress-desc">Highest Progress</option>
              <option value="raised-desc">Most Raised</option>
              <option value="name-asc">Title (A → Z)</option>
              <option value="name-desc">Title (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Results Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          Showing <span className="font-semibold text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(startIndex + pageSize, totalItems)}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalItems}</span> presales
          {hasActiveFilters && " (filtered)"}
        </div>

        <div className="flex items-center gap-2">
          <span>Per page:</span>
          {[4, 6, 12].map((size) => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                pageSize === size
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Main Presentation (Grid or Table) */}
      {paginatedPresales.length === 0 ? (
        <EmptyState
          icon={<Rocket className="h-10 w-10 text-muted-foreground/60" />}
          title="No presales found"
          description={
            hasActiveFilters
              ? "No presale campaigns match your search and filter criteria. Try resetting your filters."
              : "No presale opportunities are currently listed."
          }
          action={
            hasActiveFilters ? (
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-2">
                Clear All Filters
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === "grid" ? (
        /* GRID PRESENTATION */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedPresales.map((ps) => {
            const token = tokenMap.get(ps.tokenId);
            const project = ps.projectId ? projectMap.get(ps.projectId) : undefined;
            const progress = calculateProgress(ps.totalRaised, ps.hardCap);
            const isSepolia =
              ps.network.toLowerCase().includes("sepolia") ||
              ps.network.toLowerCase() === "ethereum";

            return (
              <div
                key={ps.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Card Header: Network Badge & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={isSepolia ? "default" : "secondary"}
                      className={`text-[10px] ${
                        isSepolia
                          ? "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40"
                          : "bg-secondary text-muted-foreground"
                      }`}
                      title={
                        isSepolia
                          ? "D-04 Approved Network (11155111)"
                          : "Catalog Origin — Non-active network per D-04"
                      }
                    >
                      {ps.network}
                    </Badge>
                    <StatusBadge status={ps.status} />
                  </div>

                  {/* Title & Token Identity */}
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30 flex items-center justify-center font-bold text-foreground text-sm shrink-0">
                      {getInitials(ps.title)}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-tight">
                        {ps.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {token ? (
                          <Link
                            href={`/tokens/${token.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline font-semibold"
                            title={`Inspect ${token.name}`}
                          >
                            ${token.symbol}
                            <span className="text-[10px] text-muted-foreground font-normal">
                              ({token.name})
                            </span>
                          </Link>
                        ) : (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            ${ps.tokenId.toUpperCase()}
                          </span>
                        )}

                        {(ps.category || token?.category) && (
                          <span className="text-[10px] text-muted-foreground/80 bg-secondary/60 px-1.5 py-0.5 rounded">
                            {ps.category || token?.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {ps.description ||
                      token?.description ||
                      project?.description ||
                      "Initial decentralized offering with non-custodial smart contract lockup."}
                  </p>

                  {/* Fundraising Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-primary" /> Raised:
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {ps.totalRaised} / <span className="text-muted-foreground">{ps.hardCap}</span>
                      </span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Softcap: {ps.softCap}</span>
                      <span className="font-mono font-medium text-primary">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Contributor and Allocation Info */}
                  <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div>
                      <span>Min Allocation:</span>
                      <p className="font-mono font-semibold text-foreground">
                        {ps.minContribution || "0.1 ETH"}
                      </p>
                    </div>
                    <div>
                      <span>Max Allocation:</span>
                      <p className="font-mono font-semibold text-foreground">
                        {ps.maxContribution || "3.0 ETH"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span>{ps.participantCount} Contributors</span>
                  </span>
                  <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                    <Link href={`/launchpad/presales/${ps.id}`}>
                      {ps.status === "live" ? "Participate →" : "View Details →"}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE PRESENTATION */
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-secondary/40 text-muted-foreground border-b border-border/60 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => handleSortClick("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Presale Campaign</span>
                      {sortBy === "name-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "name-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Network
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => handleSortClick("progress")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Progress & Raised</span>
                      {sortBy === "progress-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Softcap / Hardcap
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => handleSortClick("date")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Schedule</span>
                      {sortBy === "date-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "date-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedPresales.map((ps) => {
                  const token = tokenMap.get(ps.tokenId);
                  const progress = calculateProgress(ps.totalRaised, ps.hardCap);
                  const isSepolia =
                    ps.network.toLowerCase().includes("sepolia") ||
                    ps.network.toLowerCase() === "ethereum";

                  return (
                    <tr
                      key={ps.id}
                      className="hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30 flex items-center justify-center font-bold text-foreground text-xs shrink-0">
                            {getInitials(ps.title)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                              <Link href={`/launchpad/presales/${ps.id}`}>{ps.title}</Link>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                              {token ? (
                                <Link
                                  href={`/tokens/${token.id}`}
                                  className="text-primary hover:underline font-semibold"
                                >
                                  ${token.symbol}
                                </Link>
                              ) : (
                                <span>${ps.tokenId.toUpperCase()}</span>
                              )}
                              <span>•</span>
                              <span>{ps.participantCount} Contributors</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={isSepolia ? "default" : "secondary"}
                          className={`text-[10px] ${
                            isSepolia
                              ? "bg-primary/20 text-primary border border-primary/40"
                              : "bg-secondary text-muted-foreground"
                          }`}
                          title={
                            isSepolia
                              ? "D-04 Approved Network (11155111)"
                              : "Catalog Origin — Non-active network per D-04"
                          }
                        >
                          {ps.network}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={ps.status} />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1 min-w-[140px]">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="font-bold text-foreground">{ps.totalRaised}</span>
                            <span className="text-primary font-semibold">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        <div>
                          <span>Soft: {ps.softCap}</span>
                        </div>
                        <div>
                          <span>Hard: {ps.hardCap}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                          <span>{ps.startTime ? ps.startTime.slice(0, 10) : ps.createdAt}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60 hover:border-primary">
                          <Link href={`/launchpad/presales/${ps.id}`}>Inspect</Link>
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

      {/* 7. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{effectivePage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage === 1}
              className="h-8 px-2 text-xs border-border/60"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={effectivePage === num ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(num)}
                className={`h-8 w-8 text-xs p-0 ${
                  effectivePage === num
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage === totalPages}
              className="h-8 px-2 text-xs border-border/60"
              aria-label="Next page"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
