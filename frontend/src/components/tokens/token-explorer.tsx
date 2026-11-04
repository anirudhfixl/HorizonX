import React, { useState, useMemo, useCallback, useRef, useSyncExternalStore } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/data";
import { Token, TokenMarketData } from "@/types";
import { useWallet } from "@/contexts/wallet-context";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";
import type { SimulatedTokenReceipt } from "@/components/tokens/token-creation-wizard";
import {
  Search,
  X,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Info,
  Filter,
  Wallet,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

export type TokenWithMarket = Token & { market: TokenMarketData };

export type SortField = "name" | "price" | "marketCap" | "priceChange24h" | "volume24h";
export type SortOrder = "asc" | "desc";

export interface TokenExplorerProps {
  mode?: "canonical" | "discovery";
}

/* ------------------------------------------------------------------ */
/* Pure formatting helpers                                             */
/* ------------------------------------------------------------------ */

export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || val === 0) return "$0.00";
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

export function formatPrice(val?: number): string {
  return val === undefined || val === null ? "—" : `$${val}`;
}

export function formatChange(val?: number): string {
  if (val === undefined || val === null) return "—";
  return `${val >= 0 ? "+" : ""}${val}%`;
}

export function isSepoliaNetwork(network: string): boolean {
  const n = (network || "").toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

export function shortHex(addr?: string): string {
  if (!addr) return "—";
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function getExplorerBaseUrl(network: string): string {
  const n = (network || "").toLowerCase();
  if (n.includes("sepolia") || n === "ethereum") return "https://sepolia.etherscan.io";
  if (n.includes("arbitrum")) return "https://arbiscan.io";
  if (n.includes("base")) return "https://basescan.org";
  return "https://polygonscan.com";
}

export function getExplorerUrl(network: string, contractAddress?: string): string | null {
  if (!contractAddress) return null;
  return `${getExplorerBaseUrl(network)}/token/${contractAddress}`;
}

export const VERIFICATION_LABELS: Record<string, string> = {
  all: "All verification",
  audit_available: "Audit available",
  contract_source_verified: "Source verified",
  project_reviewed: "Project reviewed",
  not_reviewed: "Not reviewed",
};

export function verificationLabel(status?: string): string {
  if (!status) return "Not reviewed";
  return VERIFICATION_LABELS[status] ?? status.replace(/_/g, " ");
}

export interface Filters {
  q: string;
  network: string;
  category: string;
  status: string;
  verification: string;
}

/**
 * Matching rule supporting name, symbol, contract address, network, category, status, and verification.
 */
export function tokenMatches(token: TokenWithMarket, f: Filters): boolean {
  const q = f.q.trim().toLowerCase();
  const matchesSearch =
    !q ||
    token.name.toLowerCase().includes(q) ||
    token.symbol.toLowerCase().includes(q) ||
    (Boolean(token.contractAddress) && token.contractAddress!.toLowerCase().includes(q));

  const matchesNetwork =
    f.network === "all"
      ? true
      : f.network === "sepolia"
      ? token.network.toLowerCase().includes("sepolia") || token.network.toLowerCase() === "ethereum"
      : token.network.toLowerCase() === f.network.toLowerCase();

  const matchesCategory =
    f.category === "all" ? true : (token.category || "").toLowerCase() === f.category.toLowerCase();

  const matchesStatus =
    f.status === "all" ? true : token.status.toLowerCase() === f.status.toLowerCase();

  const matchesVerification =
    f.verification === "all"
      ? true
      : (token.verificationStatus || "not_reviewed").toLowerCase() === f.verification.toLowerCase();

  return matchesSearch && matchesNetwork && matchesCategory && matchesStatus && matchesVerification;
}

const TONES = [
  { tile: "border-primary/30 from-primary/25 to-primary/5", text: "text-primary" },
  { tile: "border-cyan-500/30 from-cyan-500/25 to-cyan-500/5", text: "text-cyan-400" },
  { tile: "border-violet-500/30 from-violet-500/25 to-violet-500/5", text: "text-violet-400" },
  { tile: "border-emerald-500/30 from-emerald-500/25 to-emerald-500/5", text: "text-emerald-400" },
  { tile: "border-rose-500/30 from-rose-500/25 to-rose-500/5", text: "text-rose-400" },
  { tile: "border-amber-500/30 from-amber-500/25 to-amber-500/5", text: "text-amber-400" },
];
const NEUTRAL_TONE = { tile: "border-border/60 from-secondary to-secondary/30", text: "text-muted-foreground" };

export const SORT_LABELS: Record<SortField, string> = {
  marketCap: "Market Cap",
  volume24h: "24h Volume",
  priceChange24h: "24h Change",
  price: "Price",
  name: "Token Name",
};

function subscribeNoop() {
  return () => {};
}
function readSessionRaw(): string {
  try {
    return sessionStorage.getItem(SESSION_TOKENS_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export function TokenExplorer({ mode = "canonical" }: TokenExplorerProps) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [searchParams] = useSearchParams();
  const { isConnected, shortAddress } = useWallet();

  // Read session-simulated deployments if present
  const sessionRaw = useSyncExternalStore(subscribeNoop, readSessionRaw, () => "");
  const sessionTokens = useMemo<TokenWithMarket[]>(() => {
    if (!sessionRaw) return [];
    try {
      const parsed = JSON.parse(sessionRaw);
      if (!Array.isArray(parsed)) return [];
      return (parsed as SimulatedTokenReceipt[]).map((r) => ({
        id: r.contractAddress.toLowerCase(),
        name: r.name,
        symbol: r.symbol,
        description: r.description || "Simulated token deployment from this session.",
        network: r.network || "Ethereum Sepolia",
        category: r.category || "General",
        contractAddress: r.contractAddress,
        standard: "ERC-20",
        totalSupply: r.totalSupply,
        decimals: r.decimals,
        creatorAddress: r.creatorAddress,
        status: "active",
        verificationStatus: "not_reviewed",
        createdAt: r.deployedAt ? r.deployedAt.slice(0, 10) : "2026-10-31",
        updatedAt: r.deployedAt ? r.deployedAt.slice(0, 10) : "2026-10-31",
        features: r.features,
        market: {
          tokenId: r.contractAddress.toLowerCase(),
          price: 0.1,
          priceChange24h: 0,
          volume24h: 0,
          liquidity: 0,
          marketCap: 0,
          isLive: false,
        },
      }));
    } catch {
      return [];
    }
  }, [sessionRaw]);

  // Combined master catalog: standard mock tokens + any session deployments
  const masterCatalog = useMemo<TokenWithMarket[]>(() => {
    const combined = [...(TOKENS as TokenWithMarket[])];
    for (const st of sessionTokens) {
      if (!combined.some((t) => t.contractAddress?.toLowerCase() === st.contractAddress?.toLowerCase())) {
        combined.unshift(st);
      }
    }
    return combined;
  }, [sessionTokens]);

  // Read URL search params directly for declarative, synchronized state
  const paramQ = searchParams?.get("q") ?? "";
  const networkFilter = searchParams?.get("network") ?? "all";
  const categoryFilter = searchParams?.get("category") ?? "all";
  const statusFilter = searchParams?.get("status") ?? "all";
  const verificationFilter = searchParams?.get("verification") ?? "all";
  const sortField = (searchParams?.get("sort") as SortField) || "marketCap";
  const sortOrder = (searchParams?.get("order") as SortOrder) || "desc";
  const currentPage = Math.max(1, Number(searchParams?.get("page") ?? "1") || 1);
  const pageSize = Number(searchParams?.get("pageSize") ?? "10") || 10;

  // Local state only for immediate input responsiveness during typing
  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [prevParamQ, setPrevParamQ] = useState(paramQ);

  if (paramQ !== prevParamQ) {
    setPrevParamQ(paramQ);
    setSearchQuery(paramQ);
  }

  // URL updater with push/replace option
  const updateUrl = useCallback(
    (overrides: Partial<Filters & { sort: SortField; order: SortOrder; page: number; pageSize: number }>, replace = false) => {
      const qVal = overrides.q !== undefined ? overrides.q.trim() : searchQuery.trim();
      const netVal = overrides.network ?? networkFilter;
      const catVal = overrides.category ?? categoryFilter;
      const statVal = overrides.status ?? statusFilter;
      const verVal = overrides.verification ?? verificationFilter;
      const sortVal = overrides.sort ?? sortField;
      const orderVal = overrides.order ?? sortOrder;
      const pageVal = overrides.page ?? currentPage;
      const sizeVal = overrides.pageSize ?? pageSize;

      const sp = new URLSearchParams();
      if (qVal) sp.set("q", qVal);
      if (netVal !== "all") sp.set("network", netVal);
      if (catVal !== "all") sp.set("category", catVal);
      if (statVal !== "all") sp.set("status", statVal);
      if (verVal !== "all") sp.set("verification", verVal);
      if (sortVal !== "marketCap") sp.set("sort", sortVal);
      if (orderVal !== "desc") sp.set("order", orderVal);
      if (pageVal > 1) sp.set("page", String(pageVal));
      if (sizeVal !== 10) sp.set("pageSize", String(sizeVal));

      const qs = sp.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;

      if (replace) {
        navigate(targetUrl, { replace: true });
      } else {
        navigate(targetUrl);
      }
    },
    [searchQuery, networkFilter, categoryFilter, statusFilter, verificationFilter, sortField, sortOrder, currentPage, pageSize, pathname, navigate]
  );

  // Debounced search query URL update (avoids pushing excessive history while typing)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateUrl({ q: value, page: 1 }, true);
    }, 350);
  };

  const handleNetworkChange = (value: string) => {
    updateUrl({ network: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    updateUrl({ category: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    updateUrl({ status: value, page: 1 });
  };

  const handleVerificationChange = (value: string) => {
    updateUrl({ verification: value, page: 1 });
  };

  const handleSort = (field: SortField) => {
    let nextOrder: SortOrder = "desc";
    if (sortField === field) {
      nextOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      nextOrder = field === "name" ? "asc" : "desc";
    }
    updateUrl({ sort: field, order: nextOrder, page: 1 });
  };

  const handlePageSizeChange = (size: number) => {
    updateUrl({ pageSize: size, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
    // Smooth scroll back to table top on page change
    const el = document.getElementById("token-table-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setSearchQuery("");
    navigate(pathname);
  };

  // Derive unique categories from master catalog
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    masterCatalog.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [masterCatalog]);

  const toneOf = (token: TokenWithMarket) => {
    const idx = token.category ? uniqueCategories.indexOf(token.category) : -1;
    return idx < 0 ? NEUTRAL_TONE : TONES[idx % TONES.length];
  };

  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    networkFilter !== "all" ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    verificationFilter !== "all";

  // Filter Tokens
  const filteredTokens = useMemo(
    () =>
      masterCatalog.filter((token) =>
        tokenMatches(token, {
          q: searchQuery,
          network: networkFilter,
          category: categoryFilter,
          status: statusFilter,
          verification: verificationFilter,
        })
      ),
    [masterCatalog, searchQuery, networkFilter, categoryFilter, statusFilter, verificationFilter]
  );

  // Facet counts
  const counts = useMemo(() => {
    const count = (o: Partial<Filters>) =>
      masterCatalog.filter((t) =>
        tokenMatches(t, {
          q: searchQuery,
          network: networkFilter,
          category: categoryFilter,
          status: statusFilter,
          verification: verificationFilter,
          ...o,
        })
      ).length;
    return {
      category: (c: string) => count({ category: c }),
      network: (n: string) => count({ network: n }),
      status: (s: string) => count({ status: s }),
      verification: (v: string) => count({ verification: v }),
    };
  }, [masterCatalog, searchQuery, networkFilter, categoryFilter, statusFilter, verificationFilter]);

  // Sort Tokens
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      let valA: string | number = 0;
      let valB: string | number = 0;

      switch (sortField) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case "price":
          valA = a.market.price ?? 0;
          valB = b.market.price ?? 0;
          break;
        case "marketCap":
          valA = a.market.marketCap ?? 0;
          valB = b.market.marketCap ?? 0;
          break;
        case "priceChange24h":
          valA = a.market.priceChange24h ?? 0;
          valB = b.market.priceChange24h ?? 0;
          break;
        case "volume24h":
          valA = a.market.volume24h ?? 0;
          valB = b.market.volume24h ?? 0;
          break;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      const numA = Number(valA);
      const numB = Number(valB);
      return sortOrder === "asc" ? numA - numB : numB - numA;
    });
  }, [filteredTokens, sortField, sortOrder]);

  // Pagination calculation
  const totalResults = sortedTokens.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedTokens = sortedTokens.slice(startIndex, startIndex + pageSize);

  // Discovery summary telemetry
  const discoveryMetrics = useMemo(() => {
    let totalCap = 0;
    let totalVol = 0;
    let sepoliaCount = 0;
    let crossChainCount = 0;
    let topGainer: TokenWithMarket | undefined;
    let highestGain = -Infinity;

    for (const t of masterCatalog) {
      const cap = t.market?.marketCap || 0;
      const vol = t.market?.volume24h || 0;
      const chg = t.market?.priceChange24h || 0;
      totalCap += cap;
      totalVol += vol;

      if (isSepoliaNetwork(t.network)) {
        sepoliaCount++;
      } else {
        crossChainCount++;
      }

      if (chg > highestGain) {
        highestGain = chg;
        topGainer = t;
      }
    }

    return {
      totalTokens: masterCatalog.length,
      sepoliaCount,
      crossChainCount,
      totalCap,
      totalVol,
      topGainer,
    };
  }, [masterCatalog]);

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortOrder === "asc" ? (
        <ArrowUp className="h-3 w-3 text-primary" aria-hidden />
      ) : (
        <ArrowDown className="h-3 w-3 text-primary" aria-hidden />
      )
    ) : (
      <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" aria-hidden />
    );

  const ariaSort = (field: SortField): "ascending" | "descending" | "none" =>
    sortField === field ? (sortOrder === "asc" ? "ascending" : "descending") : "none";

  const sortButton = (field: SortField, label: string, align: "left" | "right" = "right") => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        sortField === field ? "text-foreground" : "text-muted-foreground",
        align === "right" && "ml-auto"
      )}
    >
      <span>{label}</span>
      <SortIcon field={field} />
    </button>
  );

  return (
    <div data-mode={mode} className="mx-auto w-full max-w-[1700px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── 1. Header Toolbar & Context ─────────────────────────────────── */}
      <header className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
              Tokens · Directory
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Token Directory
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore, filter, and inspect verified smart contracts and catalog tokens across the HorizonX
              ecosystem. Track simulated market telemetry and create new ERC-20 assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 border-border/60 text-xs font-semibold hover:bg-secondary/60"
            >
              <Link to="/tokens/my">
                <Wallet className="mr-1.5 h-3.5 w-3.5 text-primary" />
                <span>My Tokens</span>
                {isConnected && (
                  <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.2 font-mono text-[10px] text-primary">
                    {shortAddress}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              <Link to="/tokens/create">
                <Plus className="h-3.5 w-3.5" /> Create Token
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── Discovery Telemetry Strip (4 purposeful metrics) ─────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-border/50 bg-secondary/20 p-3.5 sm:p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Catalog Tokens
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-foreground sm:text-2xl">
                {discoveryMetrics.totalTokens}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ({masterCatalog.filter((t) => t.status === "active").length} Active)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-secondary/20 p-3.5 sm:p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sepolia Testnet (D-04)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-primary sm:text-2xl">
                {discoveryMetrics.sepoliaCount}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ({discoveryMetrics.crossChainCount} Catalog)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-secondary/20 p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Market Cap
              </span>
              <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                Simulated
              </span>
            </div>
            <p className="mt-1 font-mono text-xl font-bold text-foreground sm:text-2xl">
              {formatCurrency(discoveryMetrics.totalCap)}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-secondary/20 p-3.5 sm:p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Top 24h Mover
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="truncate font-mono text-base font-bold text-foreground sm:text-xl">
                ${discoveryMetrics.topGainer?.symbol || "—"}
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400">
                {discoveryMetrics.topGainer
                  ? formatChange(discoveryMetrics.topGainer.market?.priceChange24h)
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── D-04 & Demonstration Data Notice Banner ───────────────────── */}
        <div className="flex flex-col gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="font-semibold text-foreground">Demonstration Data Notice:</strong> Market prices,
              volumes, and market capitalizations are simulated demo values. Per{" "}
              <strong className="font-semibold text-foreground">Architecture Decision D-04</strong>, Ethereum Sepolia
              (Chain ID: 11155111) is the only active Web3 wallet network. Cross-chain listings are catalog metadata.
            </span>
          </span>
          <span className="shrink-0 self-start rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary sm:self-auto">
            D-04: Sepolia (11155111)
          </span>
        </div>
      </header>

      {/* ─── 2. Search, Filter & View Controls ────────────────────────────── */}
      <section aria-label="Search and filters" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Universal Search (Name, Symbol, and Contract Address) */}
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by token name, symbol, or 0x contract address..."
              aria-label="Search tokens"
              className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Network Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-border/60 bg-secondary/30 p-1">
              <button
                type="button"
                onClick={() => handleNetworkChange("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  networkFilter === "all"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Networks ({counts.network("all")})
              </button>
              <button
                type="button"
                onClick={() => handleNetworkChange("sepolia")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  networkFilter === "sepolia"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sepolia Only ({counts.network("sepolia")})
              </button>
            </div>

            {/* Status Selector */}
            <div className="inline-flex rounded-xl border border-border/60 bg-secondary/30 p-1">
              <button
                type="button"
                onClick={() => handleStatusChange("all")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === "all"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("active")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === "active"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Active
              </button>
            </div>

            {/* Verification Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/30 px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                aria-label="Filter by verification"
                value={verificationFilter}
                onChange={(e) => handleVerificationChange(e.target.value)}
                className="bg-transparent text-xs text-foreground focus:outline-none"
              >
                <option value="all" className="bg-card text-foreground">
                  All Verification ({counts.verification("all")})
                </option>
                <option value="audit_available" className="bg-card text-foreground">
                  Audit Available ({counts.verification("audit_available")})
                </option>
                <option value="contract_source_verified" className="bg-card text-foreground">
                  Source Verified ({counts.verification("contract_source_verified")})
                </option>
                <option value="project_reviewed" className="bg-card text-foreground">
                  Project Reviewed ({counts.verification("project_reviewed")})
                </option>
                <option value="not_reviewed" className="bg-card text-foreground">
                  Not Reviewed ({counts.verification("not_reviewed")})
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { value: "all", label: "All Categories", count: counts.category("all") },
            ...uniqueCategories.map((c) => ({ value: c, label: c, count: counts.category(c) })),
          ].map((c) => {
            const active = categoryFilter === c.value;
            const empty = c.count === 0 && !active;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => handleCategoryChange(c.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                  active
                    ? "bg-primary font-semibold text-primary-foreground"
                    : empty
                    ? "text-muted-foreground/40 ring-1 ring-border/40 hover:text-muted-foreground"
                    : "text-muted-foreground ring-1 ring-border/50 hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <span>{c.label}</span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    active ? "text-primary-foreground/75" : "text-muted-foreground/60"
                  )}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 3. Results Ledger / Scannable Table ─────────────────────────── */}
      <section aria-label="Token results" id="token-table-anchor" className="space-y-4">
        {/* Results Count & Row Density Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span aria-live="polite">
              Showing <strong className="text-foreground">{totalResults}</strong>{" "}
              {totalResults === 1 ? "token" : "tokens"}
            </span>
            {isFilteringActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/60 hover:bg-secondary/50 hover:text-foreground"
              >
                <X className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="token-page-size" className="text-[11px]">
                Rows per page:
              </label>
              <select
                id="token-page-size"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded-lg border border-border/60 bg-secondary/40 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>
        </div>

        {totalResults === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 px-4 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground">
              <Search className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">No tokens matched your criteria</h3>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
                {searchQuery.trim()
                  ? `No tokens or contracts were found matching "${searchQuery}". Try searching by a different name, symbol, or hex address.`
                  : "No tokens match the selected filters. Try clearing your active filters."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={resetFilters}
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs font-semibold"
              >
                <Filter className="h-3.5 w-3.5" /> Clear All Filters
              </Button>
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/tokens/create">
                  <Plus className="h-3.5 w-3.5" /> Create Token
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* ─── Desktop Scannable Table ───────────────────────────────── */}
            <div className="hidden overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm lg:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Token catalog listing. Market figures are simulated demonstration data.
                </caption>
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="w-12 py-3.5 pl-4 pr-2 text-center font-semibold">
                      #
                    </th>
                    <th scope="col" aria-sort={ariaSort("name")} className="py-3.5 pr-4">
                      {sortButton("name", "Asset", "left")}
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-semibold">
                      Contract Address
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-semibold">
                      Network
                    </th>
                    <th scope="col" aria-sort={ariaSort("price")} className="py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {sortButton("price", "Price")}
                        <span className="font-mono text-[9px] text-muted-foreground/60">(Sim)</span>
                      </div>
                    </th>
                    <th scope="col" aria-sort={ariaSort("priceChange24h")} className="w-36 py-3.5 pr-4 text-right">
                      {sortButton("priceChange24h", "24h Change")}
                    </th>
                    <th scope="col" aria-sort={ariaSort("volume24h")} className="py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {sortButton("volume24h", "24h Vol")}
                        <span className="font-mono text-[9px] text-muted-foreground/60">(Sim)</span>
                      </div>
                    </th>
                    <th scope="col" aria-sort={ariaSort("marketCap")} className="w-40 py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {sortButton("marketCap", "Market Cap")}
                        <span className="font-mono text-[9px] text-muted-foreground/60">(Sim)</span>
                      </div>
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-semibold">
                      Verification
                    </th>
                    <th scope="col" className="py-3.5 pr-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedTokens.map((token, index) => {
                    const rank = startIndex + index + 1;
                    const change = token.market?.priceChange24h;
                    const hasChange = typeof change === "number";
                    const isPositive = (change ?? 0) >= 0;
                    const tone = toneOf(token);
                    const explorerUrl = getExplorerUrl(token.network, token.contractAddress);
                    const isSession = sessionTokens.some(
                      (st) => st.contractAddress?.toLowerCase() === token.contractAddress?.toLowerCase()
                    );

                    return (
                      <tr
                        key={token.id}
                        className="group transition-colors hover:bg-secondary/30"
                      >
                        {/* Rank */}
                        <td className="py-4 pl-4 pr-2 text-center font-mono text-xs text-muted-foreground">
                          {rank}
                        </td>

                        {/* Asset */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br font-mono text-xs font-bold",
                                tone.tile,
                                tone.text
                              )}
                            >
                              {token.symbol.slice(0, 2)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/tokens/${token.id}`}
                                  className="truncate text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                >
                                  {token.name}
                                </Link>
                                {isSession && (
                                  <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-amber-400">
                                    Session
                                  </span>
                                )}
                              </div>
                              <span className="block truncate text-xs">
                                <span className="font-mono text-muted-foreground">${token.symbol}</span>
                                <span className="text-muted-foreground/40"> · </span>
                                <span className={cn("font-medium", tone.text)}>{token.category || "General"}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contract Address with Copy & Explorer */}
                        <td className="py-4 pr-4">
                          {token.contractAddress ? (
                            <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                              <span>{shortHex(token.contractAddress)}</span>
                              <CopyButton value={token.contractAddress} label={`${token.symbol} contract`} />
                              {explorerUrl && (
                                <a
                                  href={explorerUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded p-1 text-muted-foreground/60 transition-colors hover:text-primary"
                                  title="View on Block Explorer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Network */}
                        <td className="py-4 pr-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px]",
                              isSepoliaNetwork(token.network)
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                isSepoliaNetwork(token.network) ? "bg-primary" : "bg-muted-foreground/50"
                              )}
                              aria-hidden
                            />
                            {isSepoliaNetwork(token.network) ? "Sepolia" : token.network}
                          </span>
                        </td>

                        {/* Price (Simulated) */}
                        <td className="py-4 pr-4 text-right font-mono text-sm font-semibold text-foreground">
                          {formatPrice(token.market?.price)}
                        </td>

                        {/* 24h Change */}
                        <td className="py-4 pr-4 text-right font-mono text-xs font-semibold">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1",
                              !hasChange
                                ? "text-muted-foreground"
                                : isPositive
                                ? "text-emerald-400"
                                : "text-rose-400"
                            )}
                          >
                            {hasChange &&
                              (isPositive ? (
                                <TrendingUp className="h-3 w-3" aria-hidden />
                              ) : (
                                <TrendingDown className="h-3 w-3" aria-hidden />
                              ))}
                            {formatChange(change)}
                          </span>
                        </td>

                        {/* 24h Volume (Simulated) */}
                        <td className="py-4 pr-4 text-right font-mono text-xs text-muted-foreground">
                          {formatCurrency(token.market?.volume24h)}
                        </td>

                        {/* Market Cap (Simulated) */}
                        <td className="py-4 pr-4 text-right font-mono text-xs font-semibold text-foreground">
                          {formatCurrency(token.market?.marketCap)}
                        </td>

                        {/* Verification & Status */}
                        <td className="py-4 pr-4">
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={token.status} />
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-[11px] font-medium",
                                token.verificationStatus === "audit_available"
                                  ? "text-emerald-400"
                                  : token.verificationStatus === "contract_source_verified"
                                  ? "text-primary"
                                  : token.verificationStatus === "project_reviewed"
                                  ? "text-sky-300"
                                  : "text-muted-foreground"
                              )}
                            >
                              {token.verificationStatus === "audit_available" && (
                                <ShieldCheck className="h-3 w-3" aria-hidden />
                              )}
                              {verificationLabel(token.verificationStatus)}
                            </span>
                          </div>
                        </td>

                        {/* Action Link */}
                        <td className="py-4 pr-4 text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                          >
                            <Link to={`/tokens/${token.id}`}>
                              <span>Inspect</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ─── Mobile Responsive Card Ledger ─────────────────────────── */}
            <ul className="divide-y divide-border/40 border-y border-border/40 lg:hidden">
              {paginatedTokens.map((token, index) => {
                const rank = startIndex + index + 1;
                const change = token.market?.priceChange24h;
                const hasChange = typeof change === "number";
                const isPositive = (change ?? 0) >= 0;
                const tone = toneOf(token);
                const isSession = sessionTokens.some(
                  (st) => st.contractAddress?.toLowerCase() === token.contractAddress?.toLowerCase()
                );

                return (
                  <li key={token.id} className="py-4">
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="w-4 shrink-0 text-center font-mono text-[11px] text-muted-foreground">
                            {rank}
                          </span>
                          <span
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br font-mono text-xs font-bold",
                              tone.tile,
                              tone.text
                            )}
                          >
                            {token.symbol.slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Link
                                to={`/tokens/${token.id}`}
                                className="truncate text-sm font-semibold text-foreground hover:text-primary"
                              >
                                {token.name}
                              </Link>
                              {isSession && (
                                <span className="rounded bg-amber-500/10 px-1 py-0.2 font-mono text-[9px] text-amber-400">
                                  Session
                                </span>
                              )}
                            </div>
                            <span className="block truncate text-xs">
                              <span className="font-mono text-muted-foreground">${token.symbol}</span>
                              <span className="text-muted-foreground/40"> · </span>
                              <span className={cn("font-medium", tone.text)}>{token.category || "General"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Price & Change */}
                        <div className="shrink-0 text-right">
                          <span className="block font-mono text-sm font-semibold text-foreground">
                            {formatPrice(token.market?.price)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 font-mono text-xs font-semibold",
                              !hasChange
                                ? "text-muted-foreground"
                                : isPositive
                                ? "text-emerald-400"
                                : "text-rose-400"
                            )}
                          >
                            {hasChange &&
                              (isPositive ? (
                                <TrendingUp className="h-3 w-3" aria-hidden />
                              ) : (
                                <TrendingDown className="h-3 w-3" aria-hidden />
                              ))}
                            {formatChange(change)}
                          </span>
                        </div>
                      </div>

                      {/* Card Metadata Grid */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/30 p-2.5 text-xs sm:grid-cols-3">
                        <div>
                          <span className="block text-[10px] uppercase text-muted-foreground">Market Cap</span>
                          <span className="font-mono font-medium text-foreground">
                            {formatCurrency(token.market?.marketCap)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-muted-foreground">24h Vol</span>
                          <span className="font-mono font-medium text-muted-foreground">
                            {formatCurrency(token.market?.volume24h)}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="block text-[10px] uppercase text-muted-foreground">Network</span>
                          <span
                            className={cn(
                              "font-mono text-xs",
                              isSepoliaNetwork(token.network) ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {isSepoliaNetwork(token.network) ? "Sepolia (D-04)" : token.network}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between text-xs">
                        {token.contractAddress ? (
                          <div className="flex items-center gap-1 font-mono text-muted-foreground">
                            <span>{shortHex(token.contractAddress)}</span>
                            <CopyButton value={token.contractAddress} label={`${token.symbol} contract`} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No contract</span>
                        )}

                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs font-semibold text-primary">
                          <Link to={`/tokens/${token.id}`}>
                            View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ─── Pagination Controls ───────────────────────────────────── */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between pt-4">
                <p className="text-xs text-muted-foreground">
                  Page <span className="font-semibold text-foreground">{validCurrentPage}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage <= 1}
                    className="h-8 gap-1 border-border/60 text-xs font-semibold disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage >= totalPages}
                    className="h-8 gap-1 border-border/60 text-xs font-semibold disabled:opacity-40"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Named alias for backward compatibility and semantic clarity
export const TokenDirectory = TokenExplorer;
