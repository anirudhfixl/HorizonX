import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataArtwork } from "@/components/shared/data-artwork";
import { Input } from "@/components/ui/input";
import { useAirdrops, useTokens, useProjects } from "@/api";
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
  ChevronUp,
  ChevronDown,
  Info,
  Calendar,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Scale,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export type AirdropSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "reward-desc"
  | "recipients-desc"
  | "claims-desc"
  | "progress-desc"
  | "ending-soon"
  | "updated-desc";

export interface AirdropDirectoryProps {
  mode?: "canonical" | "explore";
}

export { calculateClaimProgress, parseRewardAmount };

// Normalize provider/catalog values before filtering so incomplete external records
// cannot crash the directory or create inconsistent network labels.
const getNetworkName = (value: unknown) => String(value ?? "").trim();
const isSepoliaNetwork = (value: unknown) => {
  const network = getNetworkName(value).toLowerCase();
  return network.includes("sepolia") || network === "ethereum";
};
const getCampaignSource = (air: any) =>
  air.origin ||
  air.provenance ||
  (String(air.id ?? "").startsWith("session-")
    ? "session"
    : air.isExternal
      ? "external"
      : "ecosystem");

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
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<AirdropSortOption>("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const pageSize = 9;
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

  // Unique networks derived from the campaign catalog.
  const uniqueNetworks = useMemo(
    () => Array.from(new Set(allAirdrops.map((air) => getNetworkName(air.network)).filter(Boolean)))
      .filter((network) => !isSepoliaNetwork(network))
      .sort((a, b) => a.localeCompare(b)),
    [allAirdrops]
  );

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


  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setNetworkFilter("all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setSourceFilter("all");
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
        const matchesTitle = String(air.title ?? air.name ?? "").toLowerCase().includes(q);
        const matchesDesc = String(air.description ?? "").toLowerCase().includes(q);
        const matchesTokenName = String(token?.name ?? "").toLowerCase().includes(q);
        const matchesTokenSymbol = String(token?.symbol ?? "").toLowerCase().includes(q);
        const matchesProject = String(project?.name ?? "").toLowerCase().includes(q);
        const matchesNetwork = getNetworkName(air.network).toLowerCase().includes(q);
        const matchesCategory = String(air.category ?? "").toLowerCase().includes(q);
        const matchesType = String(air.type ?? "").toLowerCase().includes(q);
        const matchesId = String(air.id ?? "").toLowerCase().includes(q);

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
        if (!isSepoliaNetwork(air.network)) return false;
      } else if (networkFilter !== "all") {
        if (getNetworkName(air.network) !== networkFilter) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "all") {
        const cat = air.category || token?.category;
        if (cat !== categoryFilter) return false;
      }

      // 5. Campaign Type Filter
      if (typeFilter !== "all" && String(air.type ?? "") !== typeFilter) {
        return false;
      }

      // 6. Data source filter. This uses provenance already present in the
      // campaign record; it does not infer verification or campaign quality.
      const source = getCampaignSource(air);
      if (sourceFilter !== "all" && source !== sourceFilter) {
        return false;
      }

      return true;
    });
  }, [allAirdrops, searchQuery, statusFilter, networkFilter, categoryFilter, typeFilter, sourceFilter, tokenMap, projectMap]);

  const toggleCompare = (campaignId: string) => {
    setCompareIds((current) =>
      current.includes(campaignId)
        ? current.filter((id) => id !== campaignId)
        : current.length < 3
          ? [...current, campaignId]
          : current
    );
  };

  const comparisonAirdrops = useMemo(
    () => compareIds.map((id) => allAirdrops.find((air) => String(air.id) === id)).filter(Boolean),
    [compareIds, allAirdrops]
  ) as any[];

  const formatCompareDate = (value: unknown) => {
    if (!value) return "Not reported";
    const date = new Date(String(value));
    return Number.isNaN(date.getTime())
      ? "Not reported"
      : date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };

  const compareValue = (value: unknown) =>
    value === null || value === undefined || String(value).trim() === "" ? "Not reported" : String(value);

  // Sorted airdrops
  const sortedAirdrops = useMemo(() => {
    return [...filteredAirdrops].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return String(a.title ?? a.name ?? a.id ?? "").localeCompare(String(b.title ?? b.name ?? b.id ?? ""));
        case "name-desc":
          return String(b.title ?? b.name ?? b.id ?? "").localeCompare(String(a.title ?? a.name ?? a.id ?? ""));
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
          return (Number(b.recipientCount) || 0) - (Number(a.recipientCount) || 0);
        case "claims-desc":
          return (Number(b.claimedCount) || 0) - (Number(a.claimedCount) || 0);
        case "progress-desc": {
          const progA = calculateClaimProgress(a.claimedCount, a.recipientCount);
          const progB = calculateClaimProgress(b.claimedCount, b.recipientCount);
          return progB - progA;
        }
        case "ending-soon": {
          const endA = a.endTime ? Date.parse(a.endTime) : Number.POSITIVE_INFINITY;
          const endB = b.endTime ? Date.parse(b.endTime) : Number.POSITIVE_INFINITY;
          return (Number.isFinite(endA) ? endA : Number.POSITIVE_INFINITY) -
            (Number.isFinite(endB) ? endB : Number.POSITIVE_INFINITY);
        }
        case "updated-desc": {
          const updatedA = Date.parse(a.lastUpdated || a.updatedAt || a.createdAt || "") || 0;
          const updatedB = Date.parse(b.lastUpdated || b.updatedAt || b.createdAt || "") || 0;
          return updatedB - updatedA;
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
    typeFilter !== "all" ||
    sourceFilter !== "all";

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
    <div className="airdrop-page airdrop-directory-page w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-7 space-y-7">
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

      {/* 4. Campaign directory controls and listings — aligned with the Airdrops overview */}
      <section className="airdrop-directory-panel overflow-hidden rounded-2xl border border-border/60 bg-[#0e0d0e]">
        <div className="space-y-4 border-b border-border/60 p-4 sm:p-5">
          {/* Directory heading, search and view switcher */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-foreground">Explore campaigns</h2>
                <span className="rounded-md border border-border/50 bg-secondary/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                  Full catalog
                </span>
                <span className="text-xs text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "campaign" : "campaigns"})
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Search, compare and filter campaign distributions across supported and discovery networks.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto xl:items-center">
              <div className="relative min-w-0 flex-1 xl:w-[22rem] xl:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search campaigns by title, token, symbol or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 border-border/60 bg-secondary/30 pl-9 pr-9 text-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="airdrop-directory-view-toggle flex shrink-0 items-center self-end rounded-lg border border-border/60 bg-secondary/30 p-0.5 sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Lifecycle shortcuts: the main discovery paths, not dashboard KPIs. */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3" role="group" aria-label="Filter campaigns by lifecycle">
            {([
              { value: "all", label: "All campaigns", count: allAirdrops.length },
              { value: "active", label: "Active", count: allAirdrops.filter((air) => air.status === "active").length },
              { value: "pending", label: "Upcoming", count: allAirdrops.filter((air) => air.status === "pending").length },
              { value: "ended", label: "Ended", count: allAirdrops.filter((air) => air.status === "ended").length },
              { value: "draft", label: "Draft", count: allAirdrops.filter((air) => air.status === "draft").length },
            ] as const).map((tab) => {
              const selected = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleStatusChange(tab.value)}
                  className={`inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-[11px] font-semibold transition-colors ${
                    selected
                      ? "border-primary/40 bg-primary text-primary-foreground"
                      : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                  }`}
                >
                  {tab.label}<span className={selected ? "opacity-80" : "opacity-60"}>{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* Campaign scope shortcuts retained from the original page */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
            <Button
              type="button"
              size="sm"
              variant={categoryFilter === "Potential Airdrops" ? "default" : "outline"}
              className={`h-8 rounded-lg border px-3 text-[11px] ${
                categoryFilter === "Potential Airdrops"
                  ? "border-cyan-400/40 bg-cyan-400 text-[#071014] font-semibold"
                  : "border-cyan-500/25 bg-cyan-500/5 text-cyan-300 hover:bg-cyan-500/10"
              }`}
              onClick={() => {
                setCategoryFilter("Potential Airdrops");
                setNetworkFilter("all");
                setCurrentPage(1);
              }}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Potential Airdrops ({allAirdrops.filter((a) => a.category === "Potential Airdrops").length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={categoryFilter === "Airdrop Registry" ? "default" : "outline"}
              className={`h-8 rounded-lg border px-3 text-[11px] ${
                categoryFilter === "Airdrop Registry"
                  ? "border-emerald-400/40 bg-emerald-400 text-[#07130f] font-semibold"
                  : "border-emerald-500/25 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10"
              }`}
              onClick={() => {
                setCategoryFilter("Airdrop Registry");
                setNetworkFilter("all");
                setCurrentPage(1);
              }}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Airdrop Registry ({allAirdrops.filter((a) => a.category === "Airdrop Registry").length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={networkFilter === "sepolia" ? "default" : "outline"}
              className={`h-8 rounded-lg px-3 text-[11px] ${
                networkFilter === "sepolia"
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "border-border/60 bg-secondary/20 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setNetworkFilter("sepolia");
                setCategoryFilter("all");
                setCurrentPage(1);
              }}
            >
              Sepolia Ecosystem ({allAirdrops.filter((a) => isSepoliaNetwork(a.network)).length})
            </Button>
          </div>

          {/* Filter row follows the same labeled-control rhythm as Staking Pools */}
          <div className="grid grid-cols-1 gap-3 border-t border-border/40 pt-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="ended">Ended</option>
                <option value="draft">Draft</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="unverified">Unverified</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Network</label>
              <select
                value={networkFilter}
                onChange={(e) => handleNetworkChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All networks</option>
                <option value="sepolia">Ethereum Sepolia</option>
                {uniqueNetworks.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign type</label>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Data source</label>
              <select
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All sources</option>
                <option value="ecosystem">HorizonX catalog</option>
                <option value="external">External discovery</option>
                <option value="session">Session-created</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as AirdropSortOption); setCurrentPage(1); }}
                className="h-10 w-full rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="name-asc">Campaign name (A–Z)</option>
                <option value="name-desc">Campaign name (Z–A)</option>
                <option value="reward-desc">Largest reward pool</option>
                <option value="recipients-desc">Most recipients</option>
                <option value="claims-desc">Most claims recorded</option>
                <option value="progress-desc">Claim progress</option>
                <option value="ending-soon">Ending soon</option>
                <option value="updated-desc">Recently updated</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1.5 h-3.5 w-3.5" /> Reset filters
              </Button>
            </div>
          )}
        </div>

        {/* 5. Listing presentation */}
        {paginatedAirdrops.length === 0 ? (
          <div className="p-6 sm:p-8">
            <EmptyState
              icon={<Gift className="h-7 w-7 text-primary/70" />}
              title={
                categoryFilter === "Potential Airdrops" && allAirdrops.filter((air) => air.category === "Potential Airdrops").length === 0
                  ? "No potential airdrops available yet"
                  : categoryFilter === "Airdrop Registry" && allAirdrops.filter((air) => air.category === "Airdrop Registry").length === 0
                    ? "No registry campaigns available yet"
                    : statusFilter === "pending" && !searchQuery.trim() && networkFilter === "all" && categoryFilter === "all" && typeFilter === "all" && sourceFilter === "all"
                      ? "No upcoming campaigns"
                      : "No airdrop campaigns found"
              }
              description="There are no campaign records matching this view right now. Try another lifecycle tab, broaden your filters, or reset the current selection."
              action={
                hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs border-border/60">
                    Reset All Filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : viewMode === "table" ? (
          <div className="airdrop-directory-table-wrap overflow-x-auto">
            <table className="airdrop-directory-table w-full min-w-[1050px] border-collapse text-left text-xs">
              <thead className="border-b border-border/60 bg-[#101012] text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th onClick={() => handleSortClick("name")} className="cursor-pointer px-5 py-3.5 font-semibold transition-colors hover:text-foreground">
                    <span className="inline-flex items-center gap-1">
                      Campaign / Asset
                      {sortBy === "name-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                      {sortBy === "name-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </span>
                  </th>
                  <th className="px-4 py-3.5 font-semibold">Network</th>
                  <th className="px-4 py-3.5 font-semibold">Type / Category</th>
                  <th onClick={() => handleSortClick("reward")} className="cursor-pointer px-4 py-3.5 font-semibold transition-colors hover:text-foreground">
                    <span className="inline-flex items-center gap-1">
                      Reward pool
                      {sortBy === "reward-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </span>
                  </th>
                  <th onClick={() => handleSortClick("recipients")} className="cursor-pointer px-4 py-3.5 font-semibold transition-colors hover:text-foreground">
                    <span className="inline-flex items-center gap-1">
                      Claims
                      {sortBy === "recipients-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </span>
                  </th>
                  <th onClick={() => handleSortClick("progress")} className="cursor-pointer px-4 py-3.5 font-semibold transition-colors hover:text-foreground">
                    <span className="inline-flex items-center gap-1">
                      Claim progress
                      {sortBy === "progress-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                    </span>
                  </th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedAirdrops.map((air) => {
                  const token = tokenMap.get(air.tokenId);
                  const project = air.projectId ? projectMap.get(air.projectId) : undefined;
                  const progress = calculateClaimProgress(air.claimedCount, air.recipientCount);
                  const isSepolia = isSepoliaNetwork(air.network);

                  return (
                    <tr key={air.id} className="group bg-[#0e0d0e] transition-colors hover:bg-[#151416]">
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary">
                            {token?.symbol?.[0] || air.title.slice(0, 1).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <Link to={`/airdrops/campaigns/${air.id}`} className="block truncate text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                              {air.title}
                            </Link>
                            <span className="mt-1 block truncate text-[10px] font-mono text-muted-foreground">
                              {token ? token.symbol : air.tokenId.toUpperCase()}
                              {project ? ` · ${project.name}` : ""}
                            </span>
                            <span className="mt-0.5 block text-[10px] text-muted-foreground/80">
                              {air.status === "pending" ? `Starts ${air.startTime?.slice(0, 10) || "TBD"}` : `Ends ${air.endTime?.slice(0, 10) || "TBD"}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-md border px-2 py-1 text-[10px] ${
                          isSepolia
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border/50 bg-secondary/30 text-muted-foreground"
                        }`}>
                          {isSepolia ? "Ethereum Sepolia" : getNetworkName(air.network) || "Network not reported"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex max-w-[180px] flex-wrap gap-1">
                          {air.type && <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">{air.type}</span>}
                          {air.category && <span className="rounded bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">{air.category}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-emerald-400">{air.totalReward || "Not disclosed"}</td>
                      <td className="px-4 py-3.5 font-mono text-foreground">
                        {typeof air.claimedCount === "number" && typeof air.recipientCount === "number" ? (
                          <>
                            {air.claimedCount.toLocaleString()}
                            <span className="text-muted-foreground"> / {air.recipientCount.toLocaleString()}</span>
                          </>
                        ) : <span className="text-muted-foreground">Not reported</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        {typeof air.claimedCount === "number" && typeof air.recipientCount === "number" && air.recipientCount > 0 ? (
                        <div className="flex items-center gap-2.5">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${progress >= 100 ? "bg-emerald-400" : progress > 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">{progress}%</span>
                        </div>
                        ) : <span className="text-[10px] text-muted-foreground">Not reported</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={air.status} />
                          <ProvenanceBadge
                            kind={air.origin === "external" ? "simulated" : getAirdropProvenance(air)}
                            label={air.source || (air.origin === "external" ? "CryptoRank Drophunting" : "HorizonX Ecosystem (Simulated)")}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={!compareIds.includes(String(air.id)) && compareIds.length >= 3}
                            onClick={() => toggleCompare(String(air.id))}
                            className={`h-8 px-2 text-[11px] ${compareIds.includes(String(air.id)) ? "text-primary" : "text-muted-foreground"}`}
                            aria-label={compareIds.includes(String(air.id)) ? `Remove ${air.title} from comparison` : `Compare ${air.title}`}
                          >
                            {compareIds.includes(String(air.id)) ? <Check className="mr-1 h-3.5 w-3.5" /> : <Scale className="mr-1 h-3.5 w-3.5" />}
                            {compareIds.includes(String(air.id)) ? "Added" : "Compare"}
                          </Button>
                          <Button asChild size="sm" variant="outline" className="h-8 border-border/60 px-3 text-[11px]">
                            <Link to={`/airdrops/campaigns/${air.id}`}>View <span className="ml-1">↗</span></Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="airdrop-directory-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
          {paginatedAirdrops.map((air) => {
            const token = tokenMap.get(air.tokenId);
            const project = air.projectId ? projectMap.get(air.projectId) : undefined;
            const progress = calculateClaimProgress(air.claimedCount, air.recipientCount);
            const isSepolia = isSepoliaNetwork(air.network);

            return (
              <div
                key={air.id}
                className="airdrop-campaign-card flex h-full min-w-0 flex-col rounded-2xl border border-border/60 bg-card/55 p-5 backdrop-blur-md transition-all duration-200 group hover:border-primary/45 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex flex-1 flex-col space-y-4">
                  {/* Use real campaign artwork when available. The shared dataset placeholder is
                      intentionally replaced with a campaign identity panel so every card does not
                      repeat the same generic image. */}
                  {(() => {
                    const campaignImage = (air as typeof air & { image?: string }).image;
                    const isGenericArtwork = !campaignImage || campaignImage.includes("horizonx-dataset-placeholder.svg");
                    const visualTone = air.category?.toLowerCase().includes("defi")
                      ? "from-violet-950/80 via-[#171321] to-[#0d0c10]"
                      : air.category?.toLowerCase().includes("governance")
                        ? "from-[#302013] via-[#1a1512] to-[#100e0d]"
                        : air.category?.toLowerCase().includes("infrastructure")
                          ? "from-slate-800/80 via-[#15171d] to-[#0d0e12]"
                          : "from-[#241b31] via-[#17131f] to-[#0d0c10]";
                    return isGenericArtwork ? (
                      <div className={`relative flex h-36 w-full items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br ${visualTone} px-5`} aria-label={`${air.title} campaign artwork`} role="img">
                        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
                          <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-primary/40" />
                          <div className="absolute -right-1 -top-12 h-40 w-40 rounded-full border border-primary/30" />
                          <div className="absolute right-12 top-7 h-24 w-24 rounded-full border border-primary/20" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(167,139,250,0.18),transparent_42%)]" />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/80">Airdrop campaign</span>
                          <p className="mt-2 max-w-[15rem] truncate text-sm font-semibold text-foreground/90">{project?.name || air.title}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{air.category || air.type || "Ecosystem rewards"}</p>
                        </div>
                        <div className="relative z-10 ml-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/35 bg-background/40 text-base font-bold tracking-tight text-primary shadow-lg shadow-black/20 backdrop-blur-sm">
                          {token?.symbol?.slice(0, 4) || getInitials(air.title)}
                        </div>
                      </div>
                    ) : (
                      <DataArtwork src={campaignImage} alt={`${air.title} campaign`} className="h-36 w-full rounded-xl border border-border/40" fallbackLabel="Airdrop campaign" />
                    );
                  })()}
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
                        {isSepolia ? "Ethereum Sepolia" : getNetworkName(air.network) || "Network not reported"}
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
                    {project?.logoUrl || token?.logoUrl ? (
                      <DataArtwork
                        src={project?.logoUrl || token?.logoUrl}
                        alt={`${project?.name || token?.name || air.title} logo`}
                        className="h-10 w-10 shrink-0 rounded-xl border border-primary/25 bg-secondary/30 object-contain p-1"
                        fallbackLabel={getInitials(project?.name || token?.name || air.title)}
                      />
                    ) : (
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center font-bold text-sm text-primary font-mono shadow-inner">
                        {token ? token.symbol.slice(0, 3) : getInitials(air.title)}
                      </div>
                    )}
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
                  <p className="min-h-[2.5rem] text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {air.description || "Campaign details have not been published by the source yet."}
                  </p>

                  {/* Reward Pool Highlight */}
                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Reward Pool</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {air.totalReward || "Not disclosed"}
                      </span>
                    </div>

                    {/* Only render a claim rate when both source values exist. */}
                    {typeof air.claimedCount === "number" && typeof air.recipientCount === "number" && air.recipientCount > 0 ? (
                      <>
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
                          <span>Claimed: <strong className="font-mono text-foreground">{air.claimedCount.toLocaleString()}</strong></span>
                          <span>Total: <strong className="font-mono text-foreground">{air.recipientCount.toLocaleString()}</strong></span>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">Claim progress not reported</p>
                    )}
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
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Updated</span>
                    <span className="font-mono text-foreground/80">
                      {(() => {
                        const value = air.lastUpdated || air.updatedAt || air.createdAt;
                        const date = value ? new Date(value) : null;
                        return date && !Number.isNaN(date.getTime())
                          ? date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
                          : "Not reported";
                      })()}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="max-w-[58%] truncate text-[10px] font-mono text-muted-foreground" title={`Campaign ID: ${air.id}`}>
                    {air.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={!compareIds.includes(String(air.id)) && compareIds.length >= 3}
                      onClick={() => toggleCompare(String(air.id))}
                      className={`h-8 w-8 px-0 ${compareIds.includes(String(air.id)) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      aria-label={compareIds.includes(String(air.id)) ? `Remove ${air.title} from comparison` : `Compare ${air.title}`}
                      title={compareIds.includes(String(air.id)) ? "Remove from comparison" : "Add to comparison"}
                    >
                      {compareIds.includes(String(air.id)) ? <Check className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}
                    </Button>
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
        ) : null}

        {/* Pagination footer mirrors the overview directory */}
        {totalPages > 1 && (
          <div className="airdrop-directory-pagination flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong className="text-foreground">{startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)}</strong>
              {" "}of <strong className="text-foreground">{totalItems}</strong> campaigns
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={effectivePage <= 1}
                className="h-9 gap-1.5 border-border/60 px-3 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Button>
              <span className="min-w-[5.5rem] text-center text-xs text-muted-foreground">
                Page <strong className="text-foreground">{effectivePage}</strong> of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={effectivePage >= totalPages}
                className="h-9 gap-1.5 border-border/60 px-3 text-xs"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Comparison tray floats above the page without changing directory/card dimensions. */}
      {comparisonAirdrops.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-primary/30 bg-[#17151b]/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-foreground">
            <Scale className="h-4 w-4 text-primary" />
            <strong>{comparisonAirdrops.length} of 3 selected</strong>
            <span className="hidden text-muted-foreground sm:inline">Compare campaign details side by side</span>
          </div>
          <Button size="sm" onClick={() => setCompareOpen(true)} className="h-8 bg-primary px-3 text-xs text-primary-foreground">
            Compare now
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setCompareIds([])} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
            Clear
          </Button>
        </div>
      )}

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto border-border/70 bg-[#111013] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Compare airdrop campaigns</DialogTitle>
            <DialogDescription>
              Compare published campaign metadata side by side. Reward amounts may use different tokens and are not directly equivalent in market value.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="w-36 px-3 py-3 text-muted-foreground">Campaign detail</th>
                  {comparisonAirdrops.map((air) => (
                    <th key={air.id} className="min-w-[170px] px-3 py-3 align-top">
                      <div className="line-clamp-2 font-semibold text-foreground">{air.title || air.name || "Untitled campaign"}</div>
                      <div className="mt-1 font-mono text-[10px] font-normal text-muted-foreground">{air.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {([
                  ["Network", (air: any) => isSepoliaNetwork(air.network) ? "Ethereum Sepolia" : compareValue(air.network)],
                  ["Status", (air: any) => compareValue(air.status)],
                  ["Campaign type", (air: any) => compareValue(air.type)],
                  ["Category", (air: any) => compareValue(air.category)],
                  ["Reward pool", (air: any) => compareValue(air.totalReward)],
                  ["Recipients", (air: any) => typeof air.recipientCount === "number" ? air.recipientCount.toLocaleString() : "Not reported"],
                  ["Claims recorded", (air: any) => typeof air.claimedCount === "number" ? air.claimedCount.toLocaleString() : "Not reported"],
                  ["Claim progress", (air: any) => typeof air.claimedCount === "number" && typeof air.recipientCount === "number" && air.recipientCount > 0 ? `${calculateClaimProgress(air.claimedCount, air.recipientCount)}%` : "Not reported"],
                  ["Starts", (air: any) => formatCompareDate(air.startTime)],
                  ["Ends", (air: any) => formatCompareDate(air.endTime)],
                  ["Data source", (air: any) => compareValue(air.source || getCampaignSource(air))],
                ] as [string, (air: any) => string][]).map(([label, getter]) => (
                  <tr key={label}>
                    <th className="bg-secondary/10 px-3 py-3 font-medium text-muted-foreground">{label}</th>
                    {comparisonAirdrops.map((air) => (
                      <td key={air.id} className="px-3 py-3 text-foreground">{getter(air)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => setCompareIds([])} className="text-xs">Clear selection</Button>
            <Button size="sm" onClick={() => setCompareOpen(false)} className="text-xs">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
