import React, { useState, useMemo } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataArtwork } from "@/components/shared/data-artwork";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROJECTS, TOKENS } from "@/data";
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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectBreadcrumb, ProjectSectionNav } from "@/components/projects/project-section-nav";

export type ProjectSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "tokens-desc";

export interface ProjectDirectoryProps {
  mode?: "canonical" | "explore";
}

type FilterState = {
  searchQuery: string;
  category: string;
  ecosystem: string;
  status: string;
  verification: string;
};

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Map of tokenId -> Token for fast relationship lookup
  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  // Unique categories derived from centralized mock data
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    PROJECTS.forEach((p) => {
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

  // Single source of truth for matching; identical rules to the previous inline filter.
  const projectMatches = (p: Project, f: FilterState): boolean => {
    // 1. Search Query
    if (f.searchQuery.trim()) {
      const q = f.searchQuery.toLowerCase().trim();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesDesc = p.description?.toLowerCase().includes(q) ?? false;

      // Match symbols or names of linked tokens
      const matchesToken = p.tokenIds.some((tId) => {
        const t = tokenMap.get(tId);
        if (!t) return false;
        return t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
      });

      if (!matchesName && !matchesDesc && !matchesToken) return false;
    }

    // 2. Category Filter
    if (f.category !== "all" && p.category !== f.category) return false;

    // 3. Ecosystem Filter (D-04 Scope: Sepolia only or all)
    if (f.ecosystem === "sepolia") {
      const eco = (p.ecosystem || "").toLowerCase();
      if (!eco.includes("sepolia") && eco !== "ethereum") return false;
    } else if (f.ecosystem !== "all") {
      if (p.ecosystem !== f.ecosystem) return false;
    }

    // 4. Status Filter
    if (f.status !== "all" && p.status !== f.status) return false;

    // 5. Verification Filter
    if (f.verification === "audited") {
      if (p.verificationStatus !== "audit_available") return false;
    } else if (f.verification === "source_verified") {
      if (p.verificationStatus !== "contract_source_verified") return false;
    } else if (f.verification === "reviewed") {
      if (p.verificationStatus !== "project_reviewed") return false;
    } else if (f.verification === "not_reviewed") {
      if (p.verificationStatus !== "not_reviewed") return false;
    }

    return true;
  };

  const currentFilters: FilterState = {
    searchQuery,
    category: categoryFilter,
    ecosystem: ecosystemFilter,
    status: statusFilter,
    verification: verificationFilter,
  };

  // Filter Projects
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) =>
      projectMatches(p, {
        searchQuery,
        category: categoryFilter,
        ecosystem: ecosystemFilter,
        status: statusFilter,
        verification: verificationFilter,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryFilter, ecosystemFilter, statusFilter, verificationFilter, tokenMap]);

  // Facet counts: how many projects each option would show given the *other* active filters.
  const facetCount = (key: keyof FilterState, value: string) =>
    PROJECTS.filter((p) => projectMatches(p, { ...currentFilters, [key]: value })).length;

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

  const activeFilterCount = [categoryFilter, ecosystemFilter, statusFilter, verificationFilter].filter(
    (v) => v !== "all"
  ).length;

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

  const toneOf = (proj: Project) => {
    const idx = proj.category ? uniqueCategories.indexOf(proj.category) : -1;
    return idx < 0 ? NEUTRAL_TONE : TONES[idx % TONES.length];
  };

  const categoryOptions = [
    { value: "all", label: "All categories", count: facetCount("category", "all") },
    ...uniqueCategories.map((c) => ({ value: c, label: c, count: facetCount("category", c) })),
  ];
  const verificationOptions = [
    { value: "all", label: "Any tier" },
    { value: "audited", label: "Audit available" },
    { value: "source_verified", label: "Source verified" },
  ].map((o) => ({ ...o, count: facetCount("verification", o.value) }));
  const statusOptions = [
    { value: "all", label: "Any status" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
  ].map((o) => ({ ...o, count: facetCount("status", o.value) }));
  const ecosystemOptions = [
    { value: "all", label: "All ecosystems" },
    { value: "sepolia", label: "Ethereum Sepolia (11155111)" },
  ].map((o) => ({ ...o, count: facetCount("ecosystem", o.value) }));

  const activeChips: { label: string; clear: () => void }[] = [];
  if (categoryFilter !== "all") activeChips.push({ label: categoryFilter, clear: () => handleCategoryChange("all") });
  if (verificationFilter !== "all")
    activeChips.push({
      label: verificationOptions.find((o) => o.value === verificationFilter)?.label ?? verificationFilter,
      clear: () => handleVerificationChange("all"),
    });
  if (statusFilter !== "all")
    activeChips.push({ label: `${statusFilter === "active" ? "Active" : "Pending"} only`, clear: () => handleStatusChange("all") });
  if (ecosystemFilter !== "all") activeChips.push({ label: "Ethereum Sepolia", clear: () => handleEcosystemChange("all") });

  const sepoliaCount = PROJECTS.filter(isSepoliaProject).length;

  return (
    <div className="project-directory-page mx-0 min-w-0 w-full max-w-none space-y-8 px-[clamp(1rem,2.25vw,2.5rem)] pb-20 pt-0">
      {mode === "canonical" && (
        <div className="project-directory-context">
          <ProjectSectionNav />
          <ProjectBreadcrumb current="Directory" />
        </div>
      )}
      {/* 1. Masthead */}
      <header className="space-y-5">
        {mode === "explore" && (
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Explore
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {mode === "canonical" ? "Projects" : "Explore · Projects"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {mode === "canonical" ? "Project Directory" : "Explore Projects"}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {mode === "canonical"
                ? "Browse and discover verified decentralized protocols, developer DAOs, and crypto ecosystem projects on HorizonX."
                : "Explore verified decentralized protocols, developer DAOs, and crypto ecosystem projects across HorizonX."}
            </p>
          </div>
          <dl className="flex items-end gap-8 font-mono">
            <div>
              <dd className="text-4xl font-semibold leading-none text-foreground">{PROJECTS.length}</dd>
              <dt className="mt-1.5 font-sans text-[11px] text-muted-foreground">protocols listed</dt>
            </div>
            <div>
              <dd className="text-4xl font-semibold leading-none text-primary">{sepoliaCount}</dd>
              <dt className="mt-1.5 font-sans text-[11px] text-muted-foreground">on Sepolia</dt>
            </div>
          </dl>
        </div>

      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
        {/* 2. Facet rail */}
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground ring-1 ring-border/60 lg:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </span>
            {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <div className={cn("space-y-7 pt-5 lg:block lg:pt-0", filtersOpen ? "block" : "hidden")}>
            <FacetGroup label="Category" ariaLabel="Filter by category" options={categoryOptions} value={categoryFilter} onChange={handleCategoryChange} />
            <FacetGroup label="Verification" ariaLabel="Filter by verification" options={verificationOptions} value={verificationFilter} onChange={handleVerificationChange} />
            <FacetGroup label="Status" ariaLabel="Filter by status" options={statusOptions} value={statusFilter} onChange={handleStatusChange} />
            <FacetGroup label="Ecosystem" ariaLabel="Filter by ecosystem" options={ecosystemOptions} value={ecosystemFilter} onChange={handleEcosystemChange} />
          </div>
        </aside>

        {/* 3. Results column */}
        <div className="min-w-0 space-y-6">
          <section aria-label="Search" className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by project name, description, or token ($PMIN)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search projects"
                className="h-12 rounded-2xl border-border/60 bg-secondary/40 pl-12 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
                {activeChips.map((c) => (
                  <button
                    key={c.label}
                    onClick={c.clear}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/30 transition-colors hover:bg-primary/20"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label} <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Results bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3 text-xs text-muted-foreground">
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

              <label className="flex items-center gap-1.5">
                <span>Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProjectSortOption)}
                  aria-label="Sort projects"
                  className="h-8 rounded-lg border border-border/70 bg-secondary/30 px-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="name-asc">Name (A → Z)</option>
                  <option value="name-desc">Name (Z → A)</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="tokens-desc">Most Linked Tokens</option>
                </select>
              </label>

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

          {/* Results */}
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
            <ul className="grid grid-cols-1 gap-x-12 2xl:grid-cols-2">
              {paginatedProjects.map((proj) => {
                const linkedTokens = linkedTokensOf(proj);
                const tone = toneOf(proj);
                return (
                  <li key={proj.id} className="group relative border-b border-border/40 py-7 first:pt-2 transition-colors">
                    <div className="flex gap-5">
                      <DataArtwork src={(proj as typeof proj & { image?: string }).image} alt={`${proj.name} project`} className="h-28 w-36 shrink-0 rounded-xl border border-border/50" fallbackLabel="Project" />
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                                <Link to={`/projects/${proj.id}`} className="after:absolute after:inset-0">
                                  {proj.name}
                                </Link>
                              </h3>
                              {proj.websiteUrl && (
                                <a
                                  href={proj.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative z-10 shrink-0 text-muted-foreground transition-colors hover:text-primary"
                                  title="Official Website"
                                  aria-label={`Official website for ${proj.name}`}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                              {proj.category && <span className={cn("font-semibold", tone.text)}>{proj.category}</span>}
                              {proj.category && proj.ecosystem && <span aria-hidden>·</span>}
                              {proj.ecosystem && <EcosystemMark proj={proj} isSepolia={isSepoliaProject(proj)} />}
                            </p>
                          </div>
                          <StatusBadge status={proj.status} />
                        </div>

                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {proj.description || "No description provided."}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                          <VerificationMark status={proj.verificationStatus} />
                          {linkedTokens.length > 0 ? (
                            <span className="relative z-10 flex flex-wrap items-center gap-1.5">
                              {linkedTokens.map((t) => (
                                <Link
                                  key={t.id}
                                  to={`/tokens/${t.id}`}
                                  className="inline-flex items-center gap-1 rounded-md bg-secondary/70 px-2 py-0.5 font-mono text-[11px] text-foreground transition-colors hover:bg-primary/20"
                                  title={`Inspect ${t.name} ($${t.symbol})`}
                                >
                                  ${t.symbol}
                                </Link>
                              ))}
                            </span>
                          ) : (
                            <span className="text-[11px] italic text-muted-foreground/70">No tokens currently associated</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1 font-mono text-[11px] text-muted-foreground">
                          <span title="Project owner">{proj.ownerAddress}</span>
                          <span className="flex items-center gap-3">
                            <span>Listed {proj.createdAt}</span>
                            <span className="inline-flex items-center gap-0.5 font-sans font-semibold text-primary">
                              Overview <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-xs text-foreground">
                <caption className="sr-only">Project directory</caption>
                <thead className="border-b border-border/60 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th
                      scope="col"
                      aria-sort={sortBy === "name-asc" ? "ascending" : sortBy === "name-desc" ? "descending" : "none"}
                      className="px-3 py-3.5"
                    >
                      <button onClick={() => handleSortClick("name")} className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground">
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
                    <th scope="col" className="px-3 py-3.5">Category</th>
                    <th scope="col" className="px-3 py-3.5">Ecosystem</th>
                    <th scope="col" className="px-3 py-3.5">Status & Verification</th>
                    <th scope="col" aria-sort={sortBy === "tokens-desc" ? "descending" : "none"} className="px-3 py-3.5">
                      <button onClick={() => handleSortClick("tokens")} className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground">
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
                      className="px-3 py-3.5"
                    >
                      <button onClick={() => handleSortClick("date")} className="flex items-center gap-1 uppercase tracking-wider hover:text-foreground">
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
                    <th scope="col" className="px-3 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedProjects.map((proj) => {
                    const linkedTokens = linkedTokensOf(proj);
                    const tone = toneOf(proj);
                    return (
                      <tr key={proj.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={proj.name} className={cn("h-9 w-9 rounded-lg text-xs", tone.tile)} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-foreground transition-colors group-hover:text-primary">
                                <Link to={`/projects/${proj.id}`}>{proj.name}</Link>
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
                        <td className="px-3 py-3.5">
                          {proj.category ? <span className={cn("text-xs font-semibold", tone.text)}>{proj.category}</span> : "—"}
                        </td>
                        <td className="px-3 py-3.5">
                          {proj.ecosystem ? <EcosystemMark proj={proj} isSepolia={isSepoliaProject(proj)} /> : "—"}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={proj.status} />
                            <VerificationMark status={proj.verificationStatus} compact />
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          {linkedTokens.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {linkedTokens.map((t) => (
                                <Link
                                  key={t.id}
                                  to={`/tokens/${t.id}`}
                                  className="inline-block rounded-md bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground transition-colors hover:bg-primary/20"
                                >
                                  ${t.symbol}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] italic text-muted-foreground/70">None</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 font-mono text-[11px] text-muted-foreground">{proj.createdAt}</td>
                        <td className="px-3 py-3.5 text-right">
                          <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs hover:border-primary">
                            <Link to={`/projects/${proj.id}`}>Inspect</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local presentational helpers (no state, no data)                    */
/* ------------------------------------------------------------------ */

// Category identity tones. Assigned by a category's position in the sorted category list,
// so the same category always gets the same colour. Purely visual; carries no data meaning.
const TONES = [
  { tile: "border-primary/30 from-primary/25 to-primary/5", text: "text-primary" },
  { tile: "border-cyan-500/30 from-cyan-500/25 to-cyan-500/5", text: "text-cyan-400" },
  { tile: "border-violet-500/30 from-violet-500/25 to-violet-500/5", text: "text-violet-400" },
  { tile: "border-emerald-500/30 from-emerald-500/25 to-emerald-500/5", text: "text-emerald-400" },
  { tile: "border-rose-500/30 from-rose-500/25 to-rose-500/5", text: "text-rose-400" },
  { tile: "border-amber-500/30 from-amber-500/25 to-amber-500/5", text: "text-amber-400" },
];
const NEUTRAL_TONE = { tile: "border-border/60 from-secondary to-secondary/30", text: "text-muted-foreground" };

function FacetGroup({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: { value: string; label: string; count: number }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="space-y-1">
      <h2 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
      <ul>
        {options.map((o) => {
          const active = value === o.value;
          const empty = o.count === 0 && !active;
          return (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => onChange(o.value)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : empty
                    ? "text-muted-foreground/40 hover:text-muted-foreground"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <span className="truncate">{o.label}</span>
                <span className="font-mono text-[11px] opacity-70">{o.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center border bg-gradient-to-br font-bold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className
      )}
    >
      {initials}
    </div>
  );
}

function EcosystemMark({ proj, isSepolia }: { proj: Project; isSepolia: boolean }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", isSepolia ? "text-foreground" : "text-muted-foreground")}
      title={isSepolia ? "D-04 Approved Network (11155111)" : "Catalog Origin — Non-active network per D-04"}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", isSepolia ? "bg-primary" : "bg-muted-foreground/50")} />
      {proj.ecosystem}
    </span>
  );
}

const VERIFICATION_LABELS: Partial<Record<NonNullable<Project["verificationStatus"]>, { label: string; cls: string; icon: boolean }>> = {
  audit_available: { label: "Audit available", cls: "text-emerald-400", icon: true },
  contract_source_verified: { label: "Source verified", cls: "text-cyan-400", icon: true },
  project_reviewed: { label: "Project reviewed", cls: "text-muted-foreground", icon: false },
  not_reviewed: { label: "Not reviewed", cls: "text-muted-foreground/70", icon: false },
};

/** Shows exactly the stored verification tier; nothing is inferred. Renders nothing if the tier is unset. */
function VerificationMark({ status, compact }: { status?: Project["verificationStatus"]; compact?: boolean }) {
  const v = status ? VERIFICATION_LABELS[status] : undefined;
  if (!v) return null;
  if (compact && !v.icon) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", v.cls)} title={v.label}>
      {v.icon ? <ShieldCheck className="h-3.5 w-3.5" /> : <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
      {compact ? <span className="sr-only">{v.label}</span> : v.label}
    </span>
  );
}
