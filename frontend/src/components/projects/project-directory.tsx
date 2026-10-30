"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { Project, Token } from "@/types";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Search,
  X,
  LayoutGrid,
  List,
  ShieldCheck,
  ExternalLink,
  Coins,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Info,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export type ProjectSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "tokens-desc";

export interface ProjectDirectoryProps {
  mode?: "canonical" | "explore";
}

export function ProjectDirectory({ mode = "canonical" }: ProjectDirectoryProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ecosystemFilter, setEcosystemFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<ProjectSortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Map of tokenId -> Token for fast relationship lookup
  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    MOCK_TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  // Unique categories derived from centralized mock data
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    MOCK_PROJECTS.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, []);

  // Filter Change Handlers with immediate page reset
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleEcosystemChange = (value: string) => {
    setEcosystemFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleVerificationChange = (value: string) => {
    setVerificationFilter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setEcosystemFilter("all");
    setStatusFilter("all");
    setVerificationFilter("all");
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  // Filter Projects
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q) ?? false;
        
        // Match symbols or names of linked tokens
        const matchesToken = p.tokenIds.some((tId) => {
          const t = tokenMap.get(tId);
          if (!t) return false;
          return (
            t.symbol.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q)
          );
        });

        if (!matchesName && !matchesDesc && !matchesToken) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false;
      }

      // 3. Ecosystem Filter (D-04 Scope: Sepolia only or all)
      if (ecosystemFilter === "sepolia") {
        const eco = (p.ecosystem || "").toLowerCase();
        if (!eco.includes("sepolia") && eco !== "ethereum") return false;
      } else if (ecosystemFilter !== "all") {
        if (p.ecosystem !== ecosystemFilter) return false;
      }

      // 4. Status Filter
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }

      // 5. Verification Filter
      if (verificationFilter === "audited") {
        if (p.verificationStatus !== "audit_available") return false;
      } else if (verificationFilter === "source_verified") {
        if (p.verificationStatus !== "contract_source_verified") return false;
      } else if (verificationFilter === "reviewed") {
        if (p.verificationStatus !== "project_reviewed") return false;
      } else if (verificationFilter === "not_reviewed") {
        if (p.verificationStatus !== "not_reviewed") return false;
      }

      return true;
    });
  }, [searchQuery, categoryFilter, ecosystemFilter, statusFilter, verificationFilter, tokenMap]);

  // Sort Projects
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "tokens-desc":
          return b.tokenIds.length - a.tokenIds.length;
        default:
          return 0;
      }
    });
  }, [filteredProjects, sortBy]);

  // Pagination Math
  const totalItems = sortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    categoryFilter !== "all" ||
    ecosystemFilter !== "all" ||
    statusFilter !== "all" ||
    verificationFilter !== "all";

  // Table header sort handler
  const handleSortClick = (field: "name" | "date" | "tokens") => {
    if (field === "name") {
      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc");
    } else if (field === "date") {
      setSortBy(sortBy === "date-desc" ? "date-asc" : "date-desc");
    } else if (field === "tokens") {
      setSortBy(sortBy === "tokens-desc" ? "name-asc" : "tokens-desc");
    }
  };

  const isSepoliaProject = (proj: Project) =>
    Boolean(
      proj.ecosystem?.toLowerCase().includes("sepolia") || proj.ecosystem?.toLowerCase() === "ethereum"
    );

  const linkedTokensOf = (proj: Project) =>
    proj.tokenIds.map((id) => tokenMap.get(id)).filter((t): t is Token => Boolean(t));

  const stats = [
    {
      label: "Total Protocols",
      value: MOCK_PROJECTS.length,
      note: "Ecosystem projects",
      icon: <Briefcase className="h-4 w-4 text-primary" />,
    },
    {
      label: "Sepolia Ecosystem",
      value: MOCK_PROJECTS.filter((p) => p.ecosystem?.toLowerCase().includes("sepolia")).length,
      note: "Active D-04 scope",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    },
    {
      label: "Security Audited",
      value: MOCK_PROJECTS.filter(
        (p) => p.verificationStatus === "audit_available" || p.verificationStatus === "contract_source_verified"
      ).length,
      note: "Audited or verified",
      icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
    },
    {
      label: "Linked Tokens",
      value: MOCK_PROJECTS.reduce((acc, p) => acc + p.tokenIds.length, 0),
      note: "Catalog tokens",
      icon: <Coins className="h-4 w-4 text-amber-400" />,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Page header */}
      <PageHeader
        title={mode === "canonical" ? "Project Directory" : "Explore Projects"}
        description={
          mode === "canonical"
            ? "Browse and discover verified decentralized protocols, developer DAOs, and crypto ecosystem projects on ProMiners."
            : "Explore verified decentralized protocols, developer DAOs, and crypto ecosystem projects across ProMiners."
        }
        breadcrumbs={
          mode === "canonical"
            ? [{ label: "Projects" }]
            : [
                { label: "Explore", href: "/explore" },
                { label: "Projects" },
              ]
        }
        badge={
          <Badge variant="outline" className="border-primary/40 text-primary">
            {MOCK_PROJECTS.length} Protocols Listed
          </Badge>
        }
      />

      {/* 2. D-04 scope & demo notice */}
      <div
        role="note"
        className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong className="text-foreground">Demonstration Data Notice:</strong> Project listings, verification
            tiers, and ecosystem affiliations are simulated for demonstration. Per Architecture Decision{" "}
            <strong className="text-foreground">D-04</strong>, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only
            approved and supported EVM wallet network. Ecosystem metadata reflects protocol origins and does not imply
            wallet connectivity or transaction support for non-Sepolia networks.
          </span>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 self-start border-primary/30 font-mono text-[11px] text-primary sm:self-auto"
        >
          D-04: Sepolia (11155111) Only
        </Badge>
      </div>

      {/* 3. Summary: one divided strip */}
      <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "space-y-1 p-4 sm:p-5",
              i % 2 === 1 && "border-l border-border/50",
              i >= 2 && "border-t border-border/50 lg:border-t-0",
              i > 0 && "lg:border-l lg:border-border/50"
            )}
          >
            <dt className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
              <span>{s.label}</span>
              {s.icon}
            </dt>
            <dd className="font-mono text-2xl font-bold tracking-tight text-foreground">{s.value}</dd>
            <p className="text-[11px] text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </dl>

      {/* 4. Filters: one flat panel, labelled controls */}
      <section aria-label="Search and filters" className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by project name, description, or token ($PMIN)..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search projects"
            className="h-11 border-border/70 bg-secondary/30 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect label="Category" ariaLabel="Filter by category" value={categoryFilter} onChange={handleCategoryChange}>
            <option value="all">All Categories ({MOCK_PROJECTS.length})</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FilterSelect>

          {/* D-04 scope restriction preserved */}
          <FilterSelect label="Ecosystem" ariaLabel="Filter by ecosystem" value={ecosystemFilter} onChange={handleEcosystemChange}>
            <option value="all">All Ecosystems ({MOCK_PROJECTS.length})</option>
            <option value="sepolia">Ethereum Sepolia (11155111 — Active)</option>
          </FilterSelect>

          <FilterSelect label="Status" ariaLabel="Filter by status" value={statusFilter} onChange={handleStatusChange}>
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="pending">Pending Only</option>
          </FilterSelect>

          <FilterSelect
            label="Verification"
            ariaLabel="Filter by verification"
            value={verificationFilter}
            onChange={handleVerificationChange}
          >
            <option value="all">All Verification Tiers</option>
            <option value="audited">Security Audited</option>
            <option value="source_verified">Source Code Verified</option>
            <option value="reviewed">Protocol Reviewed</option>
            <option value="not_reviewed">Not Reviewed</option>
          </FilterSelect>

          <FilterSelect
            label="Sort by"
            ariaLabel="Sort projects"
            value={sortBy}
            onChange={(v) => setSortBy(v as ProjectSortOption)}
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="tokens-desc">Most Linked Tokens</option>
          </FilterSelect>
        </div>
      </section>

      {/* 5. Results bar: count, page size, view toggle, reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div aria-live="polite">
          Showing <span className="font-semibold text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
          <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> projects
          {hasActiveFilters && " (filtered)"}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-primary"
              title="Reset all filters"
            >
              <X className="h-3 w-3" /> Reset
            </Button>
          )}

          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            {[6, 12, 24].map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                aria-pressed={pageSize === size}
                className={cn(
                  "rounded px-2 py-1 text-xs transition-colors",
                  pageSize === size
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "bg-secondary/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-lg border border-border/70 bg-secondary/30 p-0.5" role="group" aria-label="View mode">
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={cn(
                "rounded-md p-1.5 text-xs transition-colors",
                viewMode === "grid" ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              className={cn(
                "rounded-md p-1.5 text-xs transition-colors",
                viewMode === "table" ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
              aria-label="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Results */}
      {paginatedProjects.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-10 w-10 text-muted-foreground/60" />}
          title="No projects found"
          description={
            hasActiveFilters
              ? "No projects match your active search and filter criteria. Try resetting your filters."
              : "No project entries are currently available in the directory."
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedProjects.map((proj) => {
            const linkedTokens = linkedTokensOf(proj);
            return (
              <article
                key={proj.id}
                className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                {/* Identity + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={proj.name} className="h-11 w-11 rounded-xl text-sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-base font-bold leading-tight text-foreground">{proj.name}</h3>
                        {proj.websiteUrl && (
                          <a
                            href={proj.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                            title="Official Website"
                            aria-label={`Official website for ${proj.name}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        Owner: {proj.ownerAddress}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={proj.status} />
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {proj.description || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {proj.category && (
                    <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">
                      {proj.category}
                    </Badge>
                  )}
                  {proj.ecosystem && <EcosystemBadge proj={proj} isSepolia={isSepoliaProject(proj)} />}
                  <VerificationPill status={proj.verificationStatus} />
                </div>

                {/* Linked tokens */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-primary" /> Associated Tokens:
                    </span>
                    <span className="font-mono text-[10px]">
                      {linkedTokens.length} {linkedTokens.length === 1 ? "token" : "tokens"}
                    </span>
                  </div>
                  {linkedTokens.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedTokens.map((t) => (
                        <Link
                          key={t.id}
                          href={`/tokens/${t.id}`}
                          className="inline-flex items-center gap-1 rounded border border-border/60 bg-secondary/70 px-2 py-0.5 font-mono text-[10px] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/20"
                          title={`Inspect ${t.name} ($${t.symbol})`}
                        >
                          <span>${t.symbol}</span>
                          <span className="text-[9px] text-muted-foreground">({t.name})</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] italic text-muted-foreground/70">No tokens currently associated</div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {proj.createdAt}
                  </span>
                  <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs hover:border-primary">
                    <Link href={`/projects/${proj.id}`}>Project Overview →</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-xs text-foreground">
              <caption className="sr-only">Project directory</caption>
              <thead className="border-b border-border/60 bg-secondary/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th
                    scope="col"
                    aria-sort={sortBy === "name-asc" ? "ascending" : sortBy === "name-desc" ? "descending" : "none"}
                    className="px-4 py-3.5"
                  >
                    <button
                      onClick={() => handleSortClick("name")}
                      className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Project</span>
                      {sortBy === "name-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "name-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Ecosystem
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status & Verification
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortBy === "tokens-desc" ? "descending" : "none"}
                    className="px-4 py-3.5"
                  >
                    <button
                      onClick={() => handleSortClick("tokens")}
                      className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Linked Tokens</span>
                      {sortBy === "tokens-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortBy === "date-desc" ? "descending" : sortBy === "date-asc" ? "ascending" : "none"}
                    className="px-4 py-3.5"
                  >
                    <button
                      onClick={() => handleSortClick("date")}
                      className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Created</span>
                      {sortBy === "date-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : sortBy === "date-asc" ? (
                        <ChevronUp className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedProjects.map((proj) => {
                  const linkedTokens = linkedTokensOf(proj);
                  return (
                    <tr key={proj.id} className="group transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={proj.name} className="h-9 w-9 rounded-lg text-xs" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-foreground transition-colors group-hover:text-primary">
                              <Link href={`/projects/${proj.id}`}>{proj.name}</Link>
                              {proj.websiteUrl && (
                                <a
                                  href={proj.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                  title="Official Website"
                                  aria-label={`Official website for ${proj.name}`}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground">{proj.ownerAddress}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {proj.category ? (
                          <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">
                            {proj.category}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {proj.ecosystem ? <EcosystemBadge proj={proj} isSepolia={isSepoliaProject(proj)} /> : "—"}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={proj.status} />
                          {proj.verificationStatus === "audit_available" && (
                            <span className="text-emerald-400" title="Security Audited">
                              <ShieldCheck className="h-4 w-4" />
                            </span>
                          )}
                          {proj.verificationStatus === "contract_source_verified" && (
                            <span className="text-cyan-400" title="Source Verified">
                              <ShieldCheck className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {linkedTokens.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {linkedTokens.map((t) => (
                              <Link
                                key={t.id}
                                href={`/tokens/${t.id}`}
                                className="inline-block rounded border border-border/60 bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/20"
                              >
                                ${t.symbol}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-muted-foreground/70">None</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                        {proj.createdAt}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs hover:border-primary">
                          <Link href={`/projects/${proj.id}`}>Inspect</Link>
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

      {/* 7. Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{effectivePage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage === 1}
              className="h-8 px-2 text-xs border-border/60"
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
                aria-label={`Page ${num}`}
                aria-current={effectivePage === num ? "page" : undefined}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  effectivePage === num
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "border-border/60 text-muted-foreground"
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
              className="h-8 px-2 text-xs border-border/60"
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

/* ------------------------------------------------------------------ */
/* Local presentational helpers (no state, no data)                    */
/* ------------------------------------------------------------------ */

function FilterSelect({
  label,
  ariaLabel,
  value,
  onChange,
  children,
}: {
  label: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-10 w-full min-w-0 rounded-lg border border-border/70 bg-secondary/30 px-3 text-xs text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {children}
      </select>
    </label>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center border border-primary/30 bg-gradient-to-br from-primary/20 to-amber-500/10 font-bold text-foreground",
        className
      )}
    >
      {initials}
    </div>
  );
}

function EcosystemBadge({ proj, isSepolia }: { proj: Project; isSepolia: boolean }) {
  return (
    <Badge
      variant={isSepolia ? "default" : "secondary"}
      className={cn(
        "text-[10px]",
        isSepolia
          ? "border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
          : "bg-secondary text-muted-foreground"
      )}
      title={isSepolia ? "D-04 Approved Network (11155111)" : "Catalog Origin — Non-active network per D-04"}
    >
      {proj.ecosystem}
    </Badge>
  );
}

function VerificationPill({ status }: { status?: Project["verificationStatus"] }) {
  if (status === "audit_available") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
        <ShieldCheck className="h-3 w-3" /> Audited
      </span>
    );
  }
  if (status === "contract_source_verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
        <ShieldCheck className="h-3 w-3" /> Verified Source
      </span>
    );
  }
  return null;
}
