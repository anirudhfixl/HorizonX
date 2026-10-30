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
import { Token } from "@/types";
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

      {/* 2. D-04 Scope & Demo Notice Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong className="text-foreground">Demonstration Data Notice:</strong> Project listings, verification tiers,
              and ecosystem affiliations are simulated for demonstration. Per Architecture Decision{" "}
              <strong className="text-foreground">D-04</strong>, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only approved and supported EVM wallet network. Ecosystem metadata reflects protocol origins and does not imply wallet connectivity or transaction support for non-Sepolia networks.
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
            <span className="text-xs font-medium">Total Protocols</span>
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{MOCK_PROJECTS.length}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Ecosystem projects</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Sepolia Ecosystem</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PROJECTS.filter((p) => p.ecosystem?.toLowerCase().includes("sepolia")).length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active D-04 scope</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Security Audited</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PROJECTS.filter((p) => p.verificationStatus === "audit_available" || p.verificationStatus === "contract_source_verified").length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Audited or verified</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Linked Tokens</span>
            <Coins className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_PROJECTS.reduce((acc, p) => acc + p.tokenIds.length, 0)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Catalog tokens</p>
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
              placeholder="Search by project name, description, or token ($PMIN)..."
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

          {/* Category Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by category"
            >
              <option value="all">All Categories ({MOCK_PROJECTS.length})</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ecosystem Filter (2 cols) - D-04 Sepolia scope restriction */}
          <div className="lg:col-span-2">
            <select
              value={ecosystemFilter}
              onChange={(e) => handleEcosystemChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by ecosystem"
            >
              <option value="all">All Ecosystems ({MOCK_PROJECTS.length})</option>
              <option value="sepolia">Ethereum Sepolia (11155111 — Active)</option>
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Only</option>
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

        {/* Secondary controls row: Sorting & Verification filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span>Filter Verification:</span>
            <select
              value={verificationFilter}
              onChange={(e) => handleVerificationChange(e.target.value)}
              className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Filter by verification"
            >
              <option value="all">All Verification Tiers</option>
              <option value="audited">Security Audited</option>
              <option value="source_verified">Source Code Verified</option>
              <option value="reviewed">Protocol Reviewed</option>
              <option value="not_reviewed">Not Reviewed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProjectSortOption)}
              className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Sort projects"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="tokens-desc">Most Linked Tokens</option>
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
          of <span className="font-semibold text-foreground">{totalItems}</span> projects
          {hasActiveFilters && " (filtered)"}
        </div>

        <div className="flex items-center gap-2">
          <span>Per page:</span>
          {[6, 12, 24].map((size) => (
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
        /* GRID PRESENTATION */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProjects.map((proj) => {
            // Linked tokens lookup
            const linkedTokens = proj.tokenIds
              .map((id) => tokenMap.get(id))
              .filter((t): t is Token => Boolean(t));

            const isSepolia =
              proj.ecosystem?.toLowerCase().includes("sepolia") ||
              proj.ecosystem?.toLowerCase() === "ethereum";

            return (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Card Header: Avatar, Name, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30 flex items-center justify-center font-bold text-foreground text-sm shrink-0">
                        {getInitials(proj.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-foreground text-base leading-tight">
                            {proj.name}
                          </h3>
                          {proj.websiteUrl && (
                            <a
                              href={proj.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Official Website"
                              aria-label={`Official website for ${proj.name}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          Owner: {proj.ownerAddress}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={proj.status} />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {proj.description || "No description provided."}
                  </p>

                  {/* Metadata Tags: Category, Ecosystem, Verification */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {proj.category && (
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {proj.category}
                      </Badge>
                    )}

                    {proj.ecosystem && (
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
                        {proj.ecosystem}
                      </Badge>
                    )}

                    {proj.verificationStatus === "audit_available" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" /> Audited
                      </span>
                    )}

                    {proj.verificationStatus === "contract_source_verified" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-medium bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" /> Verified Source
                      </span>
                    )}
                  </div>

                  {/* Linked Tokens Section */}
                  <div className="pt-3 border-t border-border/40 space-y-1.5">
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
                            className="inline-flex items-center gap-1 rounded bg-secondary/70 hover:bg-primary/20 hover:border-primary/40 border border-border/60 px-2 py-0.5 font-mono text-[10px] text-foreground transition-colors"
                            title={`Inspect ${t.name} ($${t.symbol})`}
                          >
                            <span>${t.symbol}</span>
                            <span className="text-[9px] text-muted-foreground">({t.name})</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground/70 italic">
                        No tokens currently associated
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {proj.createdAt}
                  </span>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60 hover:border-primary">
                    <Link href={`/projects/${proj.id}`}>Project Overview →</Link>
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
                      <span>Project</span>
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
                    Category
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Ecosystem
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status & Verification
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => handleSortClick("tokens")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Linked Tokens</span>
                      {sortBy === "tokens-desc" ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 cursor-pointer hover:text-foreground"
                    onClick={() => handleSortClick("date")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Created</span>
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
                {paginatedProjects.map((proj) => {
                  const linkedTokens = proj.tokenIds
                    .map((id) => tokenMap.get(id))
                    .filter((t): t is Token => Boolean(t));

                  const isSepolia =
                    proj.ecosystem?.toLowerCase().includes("sepolia") ||
                    proj.ecosystem?.toLowerCase() === "ethereum";

                  return (
                    <tr
                      key={proj.id}
                      className="hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30 flex items-center justify-center font-bold text-foreground text-xs shrink-0">
                            {getInitials(proj.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-foreground group-hover:text-primary transition-colors">
                              <Link href={`/projects/${proj.id}`}>{proj.name}</Link>
                              {proj.websiteUrl && (
                                <a
                                  href={proj.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                  title="Official Website"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {proj.ownerAddress}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {proj.category ? (
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {proj.category}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {proj.ecosystem ? (
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
                            {proj.ecosystem}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
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

                      <td className="py-3.5 px-4">
                        {linkedTokens.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {linkedTokens.map((t) => (
                              <Link
                                key={t.id}
                                href={`/tokens/${t.id}`}
                                className="inline-block rounded bg-secondary/70 hover:bg-primary/20 hover:border-primary/40 border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground transition-colors"
                              >
                                ${t.symbol}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/70 italic">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                        {proj.createdAt}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60 hover:border-primary">
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
