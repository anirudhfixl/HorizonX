"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { Token, Project, Presale } from "@/types";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
  Rows3,
  Table2,
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

// ---------------------------------------------------------------------------
// Presentation helpers (display only; derived from the stored record)
// ---------------------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed UTC date so server and client render identically. */
function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function isSepoliaNetwork(network: string): boolean {
  const n = network.toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

const CONCLUDED = ["ended", "finalized", "failed", "cancelled"];

function scheduleText(ps: Presale): string {
  switch (ps.status) {
    case "live":
      return `Closes ${fmtDate(ps.endTime)}`;
    case "scheduled":
      return `Opens ${fmtDate(ps.startTime)} · closes ${fmtDate(ps.endTime)}`;
    case "draft":
      return `Planned ${fmtDate(ps.startTime)} – ${fmtDate(ps.endTime)}`;
    default:
      return `Closed ${fmtDate(ps.endTime)}`;
  }
}

function railClass(status: string): string {
  if (status === "live") return "bg-emerald-400";
  if (status === "scheduled") return "bg-amber-400";
  if (status === "draft") return "bg-transparent border-l-2 border-dashed border-muted-foreground/50";
  if (status === "failed" || status === "cancelled") return "bg-destructive";
  return "bg-zinc-600";
}

function fillClass(status: string): string {
  if (status === "live") return "bg-primary";
  if (status === "scheduled" || status === "draft") return "bg-amber-400/70";
  return "bg-zinc-500";
}

function softCapOutcome(ps: Presale): "met" | "not met" | null {
  if (!CONCLUDED.includes(ps.status) || !ps.softCap || !ps.totalRaised) return null;
  return parseAmount(ps.totalRaised) >= parseAmount(ps.softCap) ? "met" : "not met";
}

function NetworkChip({ network }: { network: string }) {
  const ok = isSepoliaNetwork(network);
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px]",
        ok ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
      )}
      title={ok ? "D-04 approved network (11155111)" : "Catalog origin — not an active network per D-04"}
    >
      {network}
    </span>
  );
}

function SaleBar({ ps, thin }: { ps: Presale; thin?: boolean }) {
  const progress = calculateProgress(ps.totalRaised, ps.hardCap);
  const soft = ps.softCap && ps.hardCap ? calculateProgress(ps.softCap, ps.hardCap) : null;
  return (
    <div
      className={cn("relative w-full rounded-full bg-secondary", thin ? "h-1.5" : "h-2")}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label={`${ps.title}: ${progress.toFixed(0)}% of hard cap`}
    >
      <div className={cn("h-full rounded-full", fillClass(ps.status))} style={{ width: `${progress}%` }} />
      {soft !== null && soft > 0 && soft < 100 && (
        <span
          className="absolute -top-1 h-[calc(100%+8px)] w-px bg-foreground/60"
          style={{ left: `${soft}%` }}
          title={`Soft cap ${ps.softCap}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "ended", label: "Ended" },
  { value: "finalized", label: "Finalized" },
];

const selectCls =
  "rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

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

  // Single matching rule (unchanged logic). `skip` lets facet counts reuse it.
  const matchesPresale = (
    ps: Presale,
    skip?: "status" | "network"
  ): boolean => {
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

      if (!matchesTitle && !matchesDesc && !matchesTokenName && !matchesTokenSymbol && !matchesProject) {
        return false;
      }
    }

    // 2. Status Filter
    if (skip !== "status" && statusFilter !== "all" && ps.status !== statusFilter) {
      return false;
    }

    // 3. Network Filter (D-04 Scope)
    if (skip !== "network") {
      if (networkFilter === "sepolia") {
        const net = ps.network.toLowerCase();
        if (!net.includes("sepolia") && net !== "ethereum") return false;
      } else if (networkFilter !== "all") {
        if (ps.network !== networkFilter) return false;
      }
    }

    // 4. Category Filter
    if (categoryFilter !== "all") {
      const cat = ps.category || token?.category;
      if (cat !== categoryFilter) return false;
    }

    return true;
  };

  // Filtered presales
  const filteredPresales = useMemo(() => {
    return MOCK_PRESALES.filter((ps) => matchesPresale(ps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, networkFilter, categoryFilter, tokenMap, projectMap]);

  // Live facet counts (same rule, ignoring the facet being counted)
  const statusCounts = useMemo(() => {
    const base = MOCK_PRESALES.filter((ps) => matchesPresale(ps, "status"));
    const counts: Record<string, number> = { all: base.length };
    base.forEach((ps) => {
      counts[ps.status] = (counts[ps.status] || 0) + 1;
    });
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, networkFilter, categoryFilter, tokenMap, projectMap]);

  const networkCounts = useMemo(() => {
    const base = MOCK_PRESALES.filter((ps) => matchesPresale(ps, "network"));
    return { all: base.length, sepolia: base.filter((ps) => isSepoliaNetwork(ps.network)).length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter, tokenMap, projectMap]);

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

  const ariaSort = (asc: PresaleSortOption, desc: PresaleSortOption): "ascending" | "descending" | "none" =>
    sortBy === asc ? "ascending" : sortBy === desc ? "descending" : "none";

  const tokenLabel = (ps: Presale) => {
    const token = tokenMap.get(ps.tokenId);
    return token ? (
      <Link
        href={`/tokens/${token.id}`}
        className="font-mono text-xs font-semibold text-primary hover:underline"
        title={`Inspect ${token.name}`}
      >
        ${token.symbol}
        <span className="ml-1 font-normal text-muted-foreground">({token.name})</span>
      </Link>
    ) : (
      <span className="font-mono text-xs text-muted-foreground">${ps.tokenId.toUpperCase()}</span>
    );
  };

  const listedCount = MOCK_PRESALES.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Link
            href={mode === "canonical" ? "/launchpad" : "/explore"}
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
          >
            ← {mode === "canonical" ? "Launchpad" : "Explore"}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {mode === "canonical" ? "All Presales" : "Presales Discovery"}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {mode === "canonical"
              ? "Browse and discover verified initial token presales. Filter by status, network, and raised progress."
              : "Explore live, scheduled, and past presales across the ProMiners ecosystem. Non-custodial escrow and transparent metrics."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{listedCount} campaigns listed</span>
          <Button asChild size="lg" className="h-10 gap-1.5 bg-primary px-4 text-sm font-semibold text-primary-foreground">
            <Link href="/launchpad/presales/create">
              <Plus className="h-4 w-4" /> Create Presale
            </Link>
          </Button>
        </div>
      </header>

      {/* Demonstration / D-04 notice */}
      <div className="mt-6 flex items-start gap-3 border-l-2 border-primary/60 py-0.5 pl-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Demonstration data notice:</strong> Presale metrics, allocations,
          contribution caps, and fundraising progress are simulated for demonstration. Per Architecture Decision{" "}
          <strong className="text-foreground">D-04</strong>, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only
          approved and supported EVM wallet network. Ecosystem metadata indicates protocol deployment origins and does
          not imply wallet connectivity or transaction support for non-Sepolia networks.
        </p>
      </div>

      {/* Discovery controls */}
      <section aria-label="Find presales" className="mt-10 space-y-4">
        {/* Sale state tabs (same values as the previous status filter) */}
        <div role="tablist" aria-label="Sale status" className="-mx-1 flex gap-1 overflow-x-auto border-b border-border/60 px-1">
          {STATUS_TABS.map((t) => {
            const active = statusFilter === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleStatusChange(t.value)}
                className={cn(
                  "relative shrink-0 px-3 pb-3 pt-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  active ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
                <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">{statusCounts[t.value] ?? 0}</span>
                {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by presale title, token ($QNET), or project..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search presales"
              className="h-10 border-border bg-secondary/40 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground/70"
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

          <div role="group" aria-label="Filter by network" className="inline-flex rounded-lg bg-secondary/60 p-1">
            {[
              { value: "all", label: "All networks", n: networkCounts.all },
              { value: "sepolia", label: "Sepolia", n: networkCounts.sepolia },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => handleNetworkChange(o.value)}
                aria-pressed={networkFilter === o.value}
                title={o.value === "sepolia" ? "Ethereum Sepolia (11155111 — Active)" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  networkFilter === o.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {o.label} <span className="ml-0.5 font-mono text-[10px] opacity-70">{o.n}</span>
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={cn(selectCls, "h-10")}
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

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span> presales
            {hasActiveFilters && " (filtered)"}
            {hasActiveFilters && (
              <button onClick={handleResetFilters} className="ml-3 font-medium text-primary hover:underline" title="Reset all filters">
                Reset
              </button>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <label className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PresaleSortOption)}
                className={selectCls}
                aria-label="Sort presales"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="progress-desc">Highest Progress</option>
                <option value="raised-desc">Most Raised</option>
                <option value="name-asc">Title (A → Z)</option>
                <option value="name-desc">Title (Z → A)</option>
              </select>
            </label>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              {[4, 6, 12].map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  aria-pressed={pageSize === size}
                  className={cn(
                    "rounded px-2 py-0.5 transition-colors",
                    pageSize === size ? "bg-primary font-semibold text-primary-foreground" : "bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center rounded-lg bg-secondary/60 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:text-foreground"
                )}
                title="Detailed view"
                aria-label="Grid View"
                aria-pressed={viewMode === "grid"}
              >
                <Rows3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:text-foreground"
                )}
                title="Table view"
                aria-label="Table View"
                aria-pressed={viewMode === "table"}
              >
                <Table2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section aria-label="Presale results" className="mt-6">
        {paginatedPresales.length === 0 ? (
          <div className="border-y border-border/60 py-16 text-center">
            <h2 className="text-base font-semibold text-foreground">No presales found</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {hasActiveFilters
                ? "No presale campaigns match your search and filter criteria. Try resetting your filters."
                : "No presale opportunities are currently listed."}
            </p>
            {hasActiveFilters && (
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-4">
                Clear All Filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {paginatedPresales.map((ps) => {
              const token = tokenMap.get(ps.tokenId);
              const project = ps.projectId ? projectMap.get(ps.projectId) : undefined;
              const progress = calculateProgress(ps.totalRaised, ps.hardCap);
              const description = ps.description || token?.description || project?.description;
              const outcome = softCapOutcome(ps);
              return (
                <li key={ps.id} className="relative">
                  <span aria-hidden="true" className={cn("absolute inset-y-4 left-0 w-0.5 rounded-full", railClass(ps.status))} />
                  <div className="grid gap-x-10 gap-y-5 py-6 pl-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                    {/* Identity */}
                    <div className="min-w-0 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={ps.status} />
                        <NetworkChip network={ps.network} />
                        {(ps.category || token?.category) && (
                          <span className="text-[11px] text-muted-foreground">{ps.category || token?.category}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold leading-snug text-foreground">
                        <Link href={`/launchpad/presales/${ps.id}`} className="hover:text-primary">
                          {ps.title}
                        </Link>
                      </h3>
                      <div>{tokenLabel(ps)}</div>
                      {description && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
                    </div>

                    {/* Sale terms */}
                    <div className="min-w-0 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {ps.totalRaised ?? "—"}
                            <span className="font-normal text-muted-foreground"> / {ps.hardCap ?? "—"}</span>
                          </span>
                          <span className="font-mono text-xs font-medium text-primary">{progress.toFixed(0)}%</span>
                        </div>
                        <SaleBar ps={ps} />
                        <p className="text-[11px] text-muted-foreground">
                          Raised against hard cap{outcome ? ` · soft cap ${outcome}` : ""}
                        </p>
                      </div>

                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-4">
                        <div>
                          <dt className="text-muted-foreground">Soft cap</dt>
                          <dd className="font-mono font-medium text-foreground">{ps.softCap ?? "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Min</dt>
                          <dd className="font-mono font-medium text-foreground">{ps.minContribution ?? "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Max</dt>
                          <dd className="font-mono font-medium text-foreground">{ps.maxContribution ?? "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Contributors</dt>
                          <dd className="font-mono font-medium text-foreground">
                            {typeof ps.participantCount === "number" ? ps.participantCount.toLocaleString("en-US") : "—"}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground">{scheduleText(ps)}</span>
                        <Link
                          href={`/launchpad/presales/${ps.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          {ps.status === "live" ? "Participate" : "View Details"} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="overflow-x-auto border-y border-border/60">
            <table className="w-full min-w-[860px] text-left text-xs text-foreground">
              <thead className="border-b border-border/60 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" aria-sort={ariaSort("name-asc", "name-desc")} className="py-3 pr-4">
                    <button type="button" onClick={() => handleSortClick("name")} className="flex items-center gap-1 hover:text-foreground">
                      <span>Presale Campaign</span>
                      {sortBy === "name-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "name-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Network
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" aria-sort={sortBy === "progress-desc" ? "descending" : "none"} className="px-4 py-3">
                    <button type="button" onClick={() => handleSortClick("progress")} className="flex items-center gap-1 hover:text-foreground">
                      <span>Progress &amp; Raised</span>
                      {sortBy === "progress-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Softcap / Hardcap
                  </th>
                  <th scope="col" aria-sort={ariaSort("date-asc", "date-desc")} className="px-4 py-3">
                    <button type="button" onClick={() => handleSortClick("date")} className="flex items-center gap-1 hover:text-foreground">
                      <span>Schedule</span>
                      {sortBy === "date-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "date-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="py-3 pl-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedPresales.map((ps) => {
                  const progress = calculateProgress(ps.totalRaised, ps.hardCap);
                  return (
                    <tr key={ps.id} className="group transition-colors hover:bg-foreground/[0.03]">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-stretch gap-3">
                          <span aria-hidden="true" className={cn("w-0.5 shrink-0 rounded-full", railClass(ps.status))} />
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary">
                              <Link href={`/launchpad/presales/${ps.id}`}>{ps.title}</Link>
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                              {tokenMap.get(ps.tokenId) ? (
                                <Link href={`/tokens/${ps.tokenId}`} className="font-semibold text-primary hover:underline">
                                  ${tokenMap.get(ps.tokenId)!.symbol}
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
                      <td className="px-4 py-3.5">
                        <NetworkChip network={ps.network} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={ps.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="min-w-[140px] space-y-1.5">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="font-semibold text-foreground">{ps.totalRaised}</span>
                            <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
                          </div>
                          <SaleBar ps={ps} thin />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                        <div>Soft: {ps.softCap}</div>
                        <div>Hard: {ps.hardCap}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{scheduleText(ps)}</td>
                      <td className="py-3.5 pl-4 text-right">
                        <Link href={`/launchpad/presales/${ps.id}`} className="font-semibold text-primary hover:underline">
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
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
              className="h-8 px-2 text-xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={effectivePage === num ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(num)}
                aria-current={effectivePage === num ? "page" : undefined}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  effectivePage === num ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage === totalPages}
              className="h-8 px-2 text-xs"
              aria-label="Next page"
            >
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
