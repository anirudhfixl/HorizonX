"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_TOKENS } from "@/lib/mock-data";
import { Token, TokenMarketData } from "@/types";
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
  AlertCircle,
  Filter,
} from "lucide-react";

export type TokenWithMarket = Token & { market: TokenMarketData };

export type SortField = "name" | "price" | "marketCap" | "priceChange24h" | "volume24h";
export type SortOrder = "asc" | "desc";

interface TokenExplorerProps {
  mode?: "canonical" | "discovery";
}

// Currency / number formatters
function formatCurrency(val?: number): string {
  if (val === undefined || val === null) return "$0.00";
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

export function TokenExplorer({ mode = "canonical" }: TokenExplorerProps) {
  const router = useRouter();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Derive unique categories and networks from mock records
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    MOCK_TOKENS.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, []);

  const uniqueNetworks = useMemo(() => {
    const set = new Set<string>();
    MOCK_TOKENS.forEach((t) => {
      if (t.network) set.add(t.network);
    });
    return Array.from(set).sort();
  }, []);

  // Filter Change Handlers with immediate page reset
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Handle sort column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setNetworkFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortField("marketCap");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    networkFilter !== "all" ||
    categoryFilter !== "all" ||
    statusFilter !== "all";

  // Filter Tokens
  const filteredTokens = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return MOCK_TOKENS.filter((token) => {
      // Search match (name or symbol)
      const matchesSearch =
        !q ||
        token.name.toLowerCase().includes(q) ||
        token.symbol.toLowerCase().includes(q);

      // Network match
      const matchesNetwork =
        networkFilter === "all"
          ? true
          : networkFilter === "sepolia"
          ? token.network.toLowerCase().includes("sepolia") ||
            token.network.toLowerCase() === "ethereum"
          : token.network.toLowerCase() === networkFilter.toLowerCase();

      // Category match
      const matchesCategory =
        categoryFilter === "all"
          ? true
          : (token.category || "").toLowerCase() === categoryFilter.toLowerCase();

      // Status match
      const matchesStatus =
        statusFilter === "all"
          ? true
          : token.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesNetwork && matchesCategory && matchesStatus;
    });
  }, [searchQuery, networkFilter, categoryFilter, statusFilter]);

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
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      const numA = Number(valA);
      const numB = Number(valB);
      return sortOrder === "asc" ? numA - numB : numB - numA;
    });
  }, [filteredTokens, sortField, sortOrder]);

  // Pagination calculation
  const totalResults = sortedTokens.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedTokens = sortedTokens.slice(startIndex, startIndex + pageSize);

  // Breadcrumbs based on route mode
  const breadcrumbs =
    mode === "canonical"
      ? [{ label: "Tokens", href: "/tokens" }, { label: "Explore" }]
      : [{ label: "Explore", href: "/explore" }, { label: "Tokens" }];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header & Actions */}
      <div className="space-y-4">
        <PageHeader
          title="Token Explorer"
          description={
            mode === "canonical"
              ? "Comprehensive index of verified tokens, governance assets, and protocol liquidity across the ProMiners ecosystem."
              : "Cross-module token discovery index. Search, filter, and track verified contracts and simulated market telemetry."
          }
          breadcrumbs={breadcrumbs}
          actions={
            <Button
              asChild
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground font-semibold"
            >
              <Link href="/tokens/create">
                <Plus className="h-3.5 w-3.5" /> Deploy New Token
              </Link>
            </Button>
          }
        />

        {/* Phase 1 Demonstration & D-04 Network Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong className="text-foreground">Demonstration Data Notice:</strong> Token pricing, 24h percentage
              changes, market caps, and audit badges are simulated for demonstration. Per Architecture Decision{" "}
              <strong className="text-foreground">D-04</strong>, Ethereum Sepolia Testnet (11155111) is the currently active EVM scope.
            </span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px] self-start sm:self-auto shrink-0">
            D-04: Sepolia Active
          </Badge>
        </div>
      </div>

      {/* 2. Search, Filters, and Controls Toolbar */}
      <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-md">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
          {/* Search Box (6 cols) */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by token name or symbol (e.g., PMIN, Aurora, AURA)..."
              className="w-full rounded-xl border border-border/70 bg-secondary/30 py-2 pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Network Filter Select (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground shrink-0 hidden sm:inline">Network:</span>
              <select
                value={networkFilter}
                onChange={(e) => handleNetworkChange(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All Networks ({MOCK_TOKENS.length})</option>
                <option value="sepolia">Ethereum Sepolia (D-04 Scope)</option>
                {uniqueNetworks
                  .filter((net) => !net.toLowerCase().includes("sepolia") && net.toLowerCase() !== "ethereum")
                  .map((net) => (
                    <option key={net} value={net}>
                      {net}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Category Filter Select (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Select (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Results Bar & Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Showing <strong className="text-foreground">{totalResults}</strong>{" "}
              {totalResults === 1 ? "token" : "tokens"}
            </span>

            {/* Quick Sepolia Tag Filter Shortcut */}
            {networkFilter !== "sepolia" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNetworkChange("sepolia")}
                className="h-6 px-2 text-[11px] border-primary/30 text-primary hover:bg-primary/10 gap-1"
              >
                <span>Show Sepolia Only (D-04)</span>
              </Button>
            )}

            {/* Clear All Filters Button */}
            {isFilteringActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
              >
                <X className="h-3 w-3" /> Reset Filters
              </Button>
            )}
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded border border-border/60 bg-secondary/40 px-2 py-1 text-xs text-foreground focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Token Listing: Desktop Table & Mobile Cards */}
      {totalResults === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-primary/70" />}
          title="No tokens matched your criteria"
          description={`No tokens were found matching "${searchQuery}". Try adjusting your keywords or clearing your active filters.`}
          action={
            <Button
              onClick={resetFilters}
              size="sm"
              className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold"
            >
              <Filter className="h-3.5 w-3.5" /> Clear All Filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="w-12 text-center text-xs font-semibold text-muted-foreground">#</TableHead>
                  
                  {/* Token Column */}
                  <TableHead>
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Token</span>
                      {sortField === "name" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>

                  <TableHead className="text-xs font-semibold text-muted-foreground">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Network</TableHead>

                  {/* Price Column */}
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort("price")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                    >
                      <span>Price</span>
                      {sortField === "price" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>

                  {/* 24h Change Column */}
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort("priceChange24h")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                    >
                      <span>24h Change</span>
                      {sortField === "priceChange24h" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>

                  {/* Volume Column */}
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort("volume24h")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                    >
                      <span>24h Volume</span>
                      {sortField === "volume24h" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>

                  {/* Market Cap Column */}
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort("marketCap")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                    >
                      <span>Market Cap</span>
                      {sortField === "marketCap" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>

                  <TableHead className="text-center text-xs font-semibold text-muted-foreground">Status / Audit</TableHead>
                  <TableHead className="w-24 text-right text-xs font-semibold text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedTokens.map((token, index) => {
                  const rank = startIndex + index + 1;
                  const isPositive = (token.market.priceChange24h ?? 0) >= 0;
                  const isSepolia =
                    token.network.toLowerCase().includes("sepolia") ||
                    token.network.toLowerCase() === "ethereum";

                  return (
                    <TableRow
                      key={token.id}
                      onClick={() => router.push(`/tokens/${token.id}`)}
                      className="cursor-pointer border-border/40 transition-colors hover:bg-secondary/40"
                    >
                      {/* Rank */}
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {rank}
                      </TableCell>

                      {/* Token Identity */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 text-xs font-bold font-mono text-primary">
                            {token.symbol.slice(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-xs sm:text-sm hover:text-primary transition-colors">
                              {token.name}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              ${token.symbol}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="rounded bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {token.category || "General"}
                        </span>
                      </TableCell>

                      {/* Network */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-mono ${
                            isSepolia
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border/60 text-muted-foreground"
                          }`}
                        >
                          {token.network}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right font-mono font-bold text-foreground text-xs sm:text-sm">
                        ${token.market.price}
                      </TableCell>

                      {/* 24h Change */}
                      <TableCell className="text-right font-mono text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isPositive ? "+" : ""}
                          {token.market.priceChange24h}%
                        </span>
                      </TableCell>

                      {/* 24h Volume */}
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatCurrency(token.market.volume24h)}
                      </TableCell>

                      {/* Market Cap */}
                      <TableCell className="text-right font-mono font-semibold text-foreground text-xs">
                        {formatCurrency(token.market.marketCap)}
                      </TableCell>

                      {/* Status / Verification */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <StatusBadge status={token.status} />
                          {token.verificationStatus === "audit_available" && (
                            <span title="Smart contract audit available" className="text-primary">
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-border/60 hover:bg-primary hover:text-primary-foreground"
                        >
                          <Link href={`/tokens/${token.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card / List Presentation */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {paginatedTokens.map((token) => {
              const isPositive = (token.market.priceChange24h ?? 0) >= 0;
              const isSepolia =
                token.network.toLowerCase().includes("sepolia") ||
                token.network.toLowerCase() === "ethereum";

              return (
                <div
                  key={token.id}
                  onClick={() => router.push(`/tokens/${token.id}`)}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-3 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold font-mono text-primary">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{token.name}</h4>
                        <span className="font-mono text-xs text-muted-foreground">${token.symbol}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        isSepolia ? "border-primary/40 text-primary" : "border-border/60"
                      }`}
                    >
                      {token.network}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                    <div>
                      <span className="text-muted-foreground text-[11px]">Price:</span>
                      <div className="font-mono font-bold text-foreground text-sm">${token.market.price}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground text-[11px]">24h Change:</span>
                      <div
                        className={`font-mono font-bold flex items-center justify-end gap-1 ${
                          isPositive ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isPositive ? "+" : ""}
                        {token.market.priceChange24h}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Market Cap:</span>
                      <div className="font-mono text-muted-foreground">{formatCurrency(token.market.marketCap)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground text-[11px]">24h Volume:</span>
                      <div className="font-mono text-muted-foreground">{formatCurrency(token.market.volume24h)}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={token.status} />
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                      <Link href={`/tokens/${token.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <div className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{startIndex + 1}</strong>–
              <strong className="text-foreground">{Math.min(startIndex + pageSize, totalResults)}</strong> of{" "}
              <strong className="text-foreground">{totalResults}</strong> tokens (Page{" "}
              <strong className="text-foreground">{validCurrentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>)
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage <= 1}
                className="h-8 px-2.5 text-xs border-border/60 gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-8 w-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                      validCurrentPage === pageNumber
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="h-8 px-2.5 text-xs border-border/60 gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
