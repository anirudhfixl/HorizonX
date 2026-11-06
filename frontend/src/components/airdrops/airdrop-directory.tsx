import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useState, useMemo, useSyncExternalStore } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataArtwork } from "@/components/shared/data-artwork";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAirdrops, useTokens, useProjects, cryptoRankClient } from "@/api";
import {
  readSessionAirdropsRaw,
  subscribeSessionAirdrops,
  parseSessionAirdrops,
  getAirdropProvenance,
  calculateClaimProgress,
  parseRewardAmount,
} from "@/lib/airdrop-storage";
import { Token, Project, AirdropCampaignType } from "@/types";
import {
  Gift,
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
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export type AirdropSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "reward-desc"
  | "recipients-desc"
  | "progress-desc";

export interface AirdropDirectoryProps {
  mode?: "canonical" | "explore";
}

export { calculateClaimProgress, parseRewardAmount };

export function AirdropDirectory({ mode = "canonical" }: AirdropDirectoryProps) {
  const { data: airdrops = [] } = useAirdrops();
  const { data: tokens = [] } = useTokens();
  const { data: projects = [] } = useProjects();
  const allAirdrops = airdrops as any[];
  const TOKENS = tokens as Token[];
  const PROJECTS = projects as Project[];

  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<AirdropSortOption>("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [providerStatus, setProviderStatus] = useState<{ configured: boolean; planRestricted?: boolean } | null>(null);

  React.useEffect(() => {
    let active = true;
    cryptoRankClient.getStatus().then((status) => {
      if (active) setProviderStatus(status);
    }).catch(() => {
      if (active) setProviderStatus({ configured: false, planRestricted: false });
    });
    return () => { active = false; };
  }, []);

  // Maps for fast token and project metadata lookups
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

  // Unique categories derived from airdrops and linked tokens
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    allAirdrops.forEach((air) => {
      if (air.category) set.add(air.category);
      const token = tokenMap.get(air.tokenId);
      if (token?.category) set.add(token.category);
    });
    return Array.from(set).sort();
  }, [allAirdrops, tokenMap]);

  // Unique campaign types derived from data
  const uniqueTypes = useMemo(() => {
    const set = new Set<AirdropCampaignType>();
    allAirdrops.forEach((air) => {
      if (air.type) set.add(air.type);
    });
    return Array.from(set).sort();
  }, [allAirdrops]);

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

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
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
    setTypeFilter("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  // Filtered airdrops
  const filteredAirdrops = useMemo(() => {
    return allAirdrops.filter((air) => {
      const token = tokenMap.get(air.tokenId);
      const project = air.projectId ? projectMap.get(air.projectId) : undefined;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = air.title.toLowerCase().includes(q);
        const matchesDesc = air.description?.toLowerCase().includes(q) ?? false;
        const matchesTokenName = token?.name.toLowerCase().includes(q) ?? false;
        const matchesTokenSymbol = token?.symbol.toLowerCase().includes(q) ?? false;
        const matchesProject = project?.name.toLowerCase().includes(q) ?? false;
        const matchesNetwork = air.network.toLowerCase().includes(q);
        const matchesCategory = air.category?.toLowerCase().includes(q) ?? false;
        const matchesType = air.type.toLowerCase().includes(q);
        const matchesId = air.id.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesTokenName &&
          !matchesTokenSymbol &&
          !matchesProject &&
          !matchesNetwork &&
          !matchesCategory &&
          !matchesType &&
          !matchesId
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "all" && air.status !== statusFilter) {
        return false;
      }

      // 3. Network Filter (D-04 Scope)
      if (networkFilter === "sepolia") {
        const net = air.network.toLowerCase();
        if (!net.includes("sepolia") && net !== "ethereum") return false;
      } else if (networkFilter !== "all") {
        if (air.network !== networkFilter) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "all") {
        const cat = air.category || token?.category;
        if (cat !== categoryFilter) return false;
      }

      // 5. Campaign Type Filter
      if (typeFilter !== "all" && air.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [allAirdrops, searchQuery, statusFilter, networkFilter, categoryFilter, typeFilter, tokenMap, projectMap]);

  // Sorted airdrops
  const sortedAirdrops = useMemo(() => {
    return [...filteredAirdrops].sort((a, b) => {
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
        case "reward-desc": {
          const rewardA = parseRewardAmount(a.totalReward);
          const rewardB = parseRewardAmount(b.totalReward);
          return rewardB - rewardA;
        }
        case "recipients-desc":
          return (b.recipientCount || 0) - (a.recipientCount || 0);
        case "progress-desc": {
          const progA = calculateClaimProgress(a.claimedCount, a.recipientCount);
          const progB = calculateClaimProgress(b.claimedCount, b.recipientCount);
          return progB - progA;
        }
        default:
          return 0;
      }
    });
  }, [filteredAirdrops, sortBy]);

  // Pagination Math
  const totalItems = sortedAirdrops.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedAirdrops = sortedAirdrops.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    networkFilter !== "all" ||
    categoryFilter !== "all" ||
    typeFilter !== "all";

  // Table header click sort
  const handleSortClick = (field: "name" | "date" | "reward" | "recipients" | "progress") => {
    if (field === "name") {
      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc");
    } else if (field === "date") {
      setSortBy(sortBy === "date-desc" ? "date-asc" : "date-desc");
    } else if (field === "reward") {
      setSortBy(sortBy === "reward-desc" ? "name-asc" : "reward-desc");
    } else if (field === "recipients") {
      setSortBy(sortBy === "recipients-desc" ? "name-asc" : "recipients-desc");
    } else if (field === "progress") {
      setSortBy(sortBy === "progress-desc" ? "name-asc" : "progress-desc");
    }
  };

  // Helper for initial avatar generator
  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="airdrop-page w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-7 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Campaigns" }]} />
      {/* 1. Page Header */}
      <PageHeader
        title={mode === "canonical" ? "Airdrop Campaign Directory" : "Explore Airdrop Opportunities"}
        description={
          mode === "canonical"
            ? "Review distribution campaigns, compare reward pools, and inspect campaign progress across supported and discovery-only networks."
            : "Discover airdrop campaigns, review their distribution details, and compare available reward opportunities across HorizonX."
        }
        breadcrumbs={
          mode === "canonical"
            ? [
                { label: "Airdrops", href: "/airdrops" },
                { label: "Campaigns" },
              ]
            : [
                { label: "Explore", href: "/explore" },
                { label: "Airdrops" },
              ]
        }
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link to="/airdrops/claim">
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Claim Portal
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold hover:bg-primary/90"
            >
              <Link to="/airdrops/campaigns/create">
                <Plus className="h-3.5 w-3.5" /> Launch Airdrop
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
          All airdrop distributions, eligibility rules, reward pools, participant counts, and claim progress
          displayed are simulated demonstration data. Per <strong>Architecture Decision D-04</strong>,
          <strong> Ethereum Sepolia (Chain ID: 11155111)</strong> is the only active EVM wallet network.
          Non-Sepolia listings (e.g. Arbitrum One, Base, Polygon) reflect future catalog metadata and do not imply
          active wallet, claim, or transaction support on those networks. No real funds or token balances are transferred.
        </p>
      </div>

      {/* 2b. External Provider Status Notice */}
      {allAirdrops.some((air) => air.origin === 'external' || air.isExternal) ? (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3.5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-medium">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>
              DefiLlama Airdrop Intelligence Active: Official Airdrop Registry &amp; Potential Tokenless Protocol Candidates synchronized.
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {allAirdrops.filter((air) => air.category === 'Potential Airdrops').length} Potential Drops
            </span>
            <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {allAirdrops.filter((air) => air.category === 'Airdrop Registry').length} Registry Claims
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 backdrop-blur-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              Displaying {allAirdrops.length} HorizonX Ecosystem (Simulated) campaigns.
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Catalog Mode
          </span>
        </div>
      )}

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Campaigns</span>
            <Gift className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {allAirdrops.length}
          </div>
          <p className="text-[11px] text-muted-foreground">Incentive reward pools</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Potential Airdrops</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {allAirdrops.filter((air) => air.category === "Potential Airdrops").length}
          </div>
          <p className="text-[11px] text-muted-foreground">Tokenless protocols (DefiLlama)</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Airdrop Registry</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {allAirdrops.filter((air) => air.category === "Airdrop Registry").length}
          </div>
          <p className="text-[11px] text-muted-foreground">Verified snapshot claims</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Ecosystem (D-04)</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            {allAirdrops.filter((air) => air.isEcosystem || air.origin === "ecosystem").length}
          </div>
          <p className="text-[11px] text-muted-foreground">HorizonX Sepolia catalog</p>
        </div>
      </div>

      {/* 4. Controls Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md space-y-3">
        {/* Quick Scope Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-border/30">
          <Button
            type="button"
            size="sm"
            variant={categoryFilter === "all" && networkFilter === "all" ? "default" : "outline"}
            className={`h-7 text-xs px-2.5 rounded-full ${categoryFilter === "all" && networkFilter === "all" ? "bg-primary text-primary-foreground font-semibold" : "border-border/60"}`}
            onClick={() => {
              setCategoryFilter("all");
              setNetworkFilter("all");
              setCurrentPage(1);
            }}
          >
            All Campaigns ({allAirdrops.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={categoryFilter === "Potential Airdrops" ? "default" : "outline"}
            className={`h-7 text-xs px-2.5 rounded-full border-cyan-500/40 ${categoryFilter === "Potential Airdrops" ? "bg-cyan-500 text-black font-semibold" : "text-cyan-300 hover:bg-cyan-500/15"}`}
            onClick={() => {
              setCategoryFilter("Potential Airdrops");
              setNetworkFilter("all");
              setCurrentPage(1);
            }}
          >
            <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
            Potential Airdrops ({allAirdrops.filter((a) => a.category === "Potential Airdrops").length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={categoryFilter === "Airdrop Registry" ? "default" : "outline"}
            className={`h-7 text-xs px-2.5 rounded-full border-emerald-500/40 ${categoryFilter === "Airdrop Registry" ? "bg-emerald-500 text-black font-semibold" : "text-emerald-300 hover:bg-emerald-500/15"}`}
            onClick={() => {
              setCategoryFilter("Airdrop Registry");
              setNetworkFilter("all");
              setCurrentPage(1);
            }}
          >
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" />
            Airdrop Registry ({allAirdrops.filter((a) => a.category === "Airdrop Registry").length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={networkFilter === "sepolia" ? "default" : "outline"}
            className={`h-7 text-xs px-2.5 rounded-full ${networkFilter === "sepolia" ? "bg-primary text-primary-foreground font-semibold" : "border-border/60"}`}
            onClick={() => {
              setNetworkFilter("sepolia");
              setCategoryFilter("all");
              setCurrentPage(1);
            }}
          >
            Sepolia Ecosystem ({allAirdrops.filter((a) => a.isEcosystem || a.origin === "ecosystem").length})
          </Button>
        </div>

        {/* Top bar: Search + View Mode */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by campaign title, token, symbol or description..."
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

          {/* Campaign Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Types
              </option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t} className="bg-card text-foreground uppercase">
                  {t}
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
              onChange={(e) => setSortBy(e.target.value as AirdropSortOption)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="date-desc" className="bg-card text-foreground">
                Newest First
              </option>
              <option value="date-asc" className="bg-card text-foreground">
                Oldest First
              </option>
              <option value="name-asc" className="bg-card text-foreground">
                Title (A to Z)
              </option>
              <option value="name-desc" className="bg-card text-foreground">
                Title (Z to A)
              </option>
              <option value="reward-desc" className="bg-card text-foreground">
                Total Reward Pool
              </option>
              <option value="recipients-desc" className="bg-card text-foreground">
                Most Recipients
              </option>
              <option value="progress-desc" className="bg-card text-foreground">
                Claim Progress
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
      {paginatedAirdrops.length === 0 ? (
        <EmptyState
          icon={<Gift className="h-7 w-7 text-primary/70" />}
          title="No Airdrop Campaigns Found"
          description="No airdrop reward distributions match your current filters and search query. Try broadening your keywords or resetting filters."
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5">
          {paginatedAirdrops.map((air) => {
            const token = tokenMap.get(air.tokenId);
            const project = air.projectId ? projectMap.get(air.projectId) : undefined;
            const progress = calculateClaimProgress(air.claimedCount, air.recipientCount);
            const isSepolia =
              air.network.toLowerCase().includes("sepolia") || air.network === "Ethereum";

            return (
              <div
                key={air.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/55 p-5 sm:p-5 backdrop-blur-md hover:border-primary/45 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 group min-w-0"
              >
                <div className="space-y-4">
                  <DataArtwork src={(air as typeof air & { image?: string }).image} alt={`${air.title} campaign`} className="h-36 w-full rounded-xl border border-border/40" fallbackLabel="Airdrop campaign" />
                  {/* Card Header: Network + Type + Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                          isSepolia
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "bg-muted text-muted-foreground border border-border/40"
                        }`}
                      >
                        {air.network}
                      </span>
                      <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                        {air.type}
                      </span>
                      {air.category && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-secondary/40 text-muted-foreground px-1.5 py-0"
                        >
                          {air.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <ProvenanceBadge
                        kind={air.origin === "external" ? "simulated" : getAirdropProvenance(air)}
                        label={air.source || (air.origin === "external" ? "CryptoRank Drophunting" : "HorizonX Ecosystem (Simulated)")}
                      />
                      <StatusBadge status={air.status} />
                    </div>
                  </div>

                  {/* Title & Token Identity */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center font-bold text-sm text-primary font-mono shadow-inner">
                      {token ? token.symbol.slice(0, 3) : getInitials(air.title)}
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

                  {/* Reward Pool Highlight */}
                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Reward Pool</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {air.totalReward || "TBD"}
                      </span>
                    </div>

                    {/* Claim Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 100
                            ? "bg-emerald-400"
                            : progress > 0
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                      <span>Claimed: <strong className="font-mono text-foreground">{air.claimedCount?.toLocaleString() || "0"}</strong></span>
                      <span>Total: <strong className="font-mono text-foreground">{air.recipientCount?.toLocaleString() || "0"}</strong></span>
                    </div>
                  </div>

                  {/* Timeline metadata */}
                  {(air.startTime || air.endTime) && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {air.status === "pending" ? "Starts:" : "Expires:"}
                      </span>
                      <span className="text-foreground">
                        {air.status === "pending"
                          ? air.startTime?.slice(0, 10)
                          : air.endTime?.slice(0, 10) || "TBD"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ID: {air.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                    >
                      <Link to={`/airdrops/campaigns/${air.id}`}>View Campaign</Link>
                    </Button>
                  </div>
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
                      <span>Campaign / Token</span>
                      {sortBy === "name-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                      {sortBy === "name-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th className="py-3 px-3">Network & Category</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th
                    onClick={() => handleSortClick("reward")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Pool</span>
                      {sortBy === "reward-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("progress")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Claim Progress</span>
                      {sortBy === "progress-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("recipients")}
                    className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Recipients</span>
                      {sortBy === "recipients-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </div>
                  </th>
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
                {paginatedAirdrops.map((air) => {
                  const token = tokenMap.get(air.tokenId);
                  const project = air.projectId ? projectMap.get(air.projectId) : undefined;
                  const progress = calculateClaimProgress(air.claimedCount, air.recipientCount);
                  const isSepolia =
                    air.network.toLowerCase().includes("sepolia") || air.network === "Ethereum";

                  return (
                    <tr
                      key={air.id}
                      className="hover:bg-secondary/10 transition-colors group"
                    >
                      {/* Name & Token */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono">
                            {token ? token.symbol.slice(0, 3) : getInitials(air.title)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/airdrops/campaigns/${air.id}`}
                              className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {air.title}
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
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
                            {air.network}
                          </span>
                          {air.category && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {air.category}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-3">
                        <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                          {air.type}
                        </span>
                      </td>

                      {/* Status & Provenance */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={air.status} />
                          <ProvenanceBadge
                            kind={air.origin === "external" ? "simulated" : getAirdropProvenance(air)}
                            label={air.source || (air.origin === "external" ? "CryptoRank Drophunting" : "HorizonX Ecosystem (Simulated)")}
                          />
                        </div>
                      </td>

                      {/* Total Pool */}
                      <td className="py-3.5 px-3 font-mono">
                        <span className="font-semibold text-emerald-400">
                          {air.totalReward || "TBD"}
                        </span>
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
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Recipients */}
                      <td className="py-3.5 px-3 font-mono text-foreground">
                        {air.recipientCount ? air.recipientCount.toLocaleString() : "0"}
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-muted-foreground">
                        {air.status === "pending"
                          ? `Starts: ${air.startTime?.slice(0, 10) || "TBD"}`
                          : `Expires: ${air.endTime?.slice(0, 10) || "TBD"}`}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-border/60 hover:border-primary/50"
                        >
                          <Link to={`/airdrops/campaigns/${air.id}`}>Inspect</Link>
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
            of <strong className="text-foreground">{totalItems}</strong> airdrop campaigns
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
