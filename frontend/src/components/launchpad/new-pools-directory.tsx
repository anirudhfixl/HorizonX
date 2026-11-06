import React, { useState, useMemo } from "react";
import { useNewPools } from "@/api/hooks/use-launchpad";
import { FormattedDEXPool } from "@/api/client/geckoterminal-client";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Search,
  X,
  LayoutGrid,
  List,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Clock,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  } catch {
    return "Recent";
  }
}

export function formatDollar(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
  if (val < 0.000001) return `$${val.toExponential(3)}`;
  if (val < 0.01) return `$${val.toFixed(6)}`;
  return `$${val.toFixed(2)}`;
}

export function NewPoolsDirectory() {
  const { pools = [], isLoading, isError, refetch } = useNewPools(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [dexFilter, setDexFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const networks = useMemo(() => {
    const set = new Set<string>();
    pools.forEach((p) => {
      if (p.network) set.add(p.network);
    });
    return Array.from(set).sort();
  }, [pools]);

  const dexs = useMemo(() => {
    const set = new Set<string>();
    pools.forEach((p) => {
      if (p.dex) set.add(p.dex);
    });
    return Array.from(set).sort();
  }, [pools]);

  const filteredPools = useMemo(() => {
    return pools.filter((p) => {
      if (networkFilter !== "all" && p.network.toLowerCase() !== networkFilter.toLowerCase()) {
        return false;
      }
      if (dexFilter !== "all" && p.dex.toLowerCase() !== dexFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchAddr = p.address.toLowerCase().includes(q);
        const matchNet = p.network.toLowerCase().includes(q);
        const matchDex = p.dex.toLowerCase().includes(q);
        if (!matchName && !matchAddr && !matchNet && !matchDex) {
          return false;
        }
      }
      return true;
    });
  }, [pools, networkFilter, dexFilter, searchQuery]);

  const totalReserve = useMemo(() => {
    return pools.reduce((acc, p) => acc + (p.reserveUsd || 0), 0);
  }, [pools]);

  const totalVolume = useMemo(() => {
    return pools.reduce((acc, p) => acc + (p.volume24hUsd || 0), 0);
  }, [pools]);

  return (
    <div className="space-y-6">
      {/* 1. Architecture & Risk Disclosure Notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Live DEX New Pools Stream Notice (GeckoTerminal Real-Time Feed)</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          These newly deployed liquidity pools are streamed live from on-chain decentralized exchanges (e.g.
          Raydium, Uniswap v3, Aerodrome, Meteora, Pump.fun) across multi-chain ecosystems via GeckoTerminal.
          <strong>
            {" "}These are unvetted raw liquidity pool creations and are NOT confirmed or endorsed HorizonX fair
            launches.
          </strong>{" "}
          Pools may have unverified contracts, rug risks, or zero locked liquidity. Always conduct thorough research
          prior to any transaction.
        </p>
      </div>

      {/* 2. Stream Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Live Streamed Pools</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{pools.length}</div>
          <p className="text-[11px] text-muted-foreground">Across {networks.length} networks</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>DEX Protocols</span>
            <Layers className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">{dexs.length}</div>
          <p className="text-[11px] text-muted-foreground">Raydium, Uniswap, Meteora, etc.</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sampled Reserve</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{formatDollar(totalReserve)}</div>
          <p className="text-[11px] text-muted-foreground">Total pooled liquidity USD</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>24h Pool Volume</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{formatDollar(totalVolume)}</div>
          <p className="text-[11px] text-muted-foreground">Initial DEX volume</p>
        </div>
      </div>

      {/* 3. Controls Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by pair (e.g. ELE / SOL), contract address, network or DEX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-secondary/30 border-border/60 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
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
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-9 text-xs border-border/60 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Network:</span>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Networks ({networks.length})
              </option>
              {networks.map((net) => (
                <option key={net} value={net} className="bg-card text-foreground">
                  {net}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">DEX:</span>
            <select
              value={dexFilter}
              onChange={(e) => setDexFilter(e.target.value)}
              className="h-7 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-card text-foreground">
                All Protocols ({dexs.length})
              </option>
              {dexs.map((d) => (
                <option key={d} value={d} className="bg-card text-foreground">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || networkFilter !== "all" || dexFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setNetworkFilter("all");
                setDexFilter("all");
              }}
              className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
            >
              <X className="h-3 w-3 mr-1" /> Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* 4. Pools Presentation */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">
          Streaming live DEX pools from GeckoTerminal...
        </div>
      ) : filteredPools.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-7 w-7 text-muted-foreground" />}
          title="No Pools Match Filters"
          description="Try broadening your search keywords or resetting filters to stream recent liquidity pools."
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPools.map((pool) => (
            <div
              key={pool.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-all group"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded px-2 py-0.5 text-[10px] font-mono border bg-primary/10 text-primary border-primary/30">
                      {pool.network}
                    </span>
                    <span className="rounded bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                      {pool.dex}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <ProvenanceBadge kind="simulated" label="GeckoTerminal Live Stream" />
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(pool.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Pool Title & Price */}
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {pool.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-mono font-bold text-foreground">
                      {formatDollar(pool.priceUsd)}
                    </span>
                    {pool.priceChange24h !== undefined && pool.priceChange24h !== 0 && (
                      <span
                        className={`text-xs font-mono font-medium flex items-center gap-0.5 ${
                          pool.priceChange24h >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {pool.priceChange24h >= 0 ? "+" : ""}
                        {pool.priceChange24h.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium block">
                      Liquidity Reserve
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatDollar(pool.reserveUsd)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium block">
                      24h Volume
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatDollar(pool.volume24hUsd)}
                    </span>
                  </div>
                </div>

                {/* Address Row */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground bg-secondary/30 rounded-lg px-2.5 py-1.5 border border-border/40">
                  <span className="truncate max-w-[190px]" title={pool.address}>
                    {pool.address.slice(0, 10)}...{pool.address.slice(-8)}
                  </span>
                  <button
                    onClick={() => handleCopy(pool.address)}
                    className="p-1 hover:text-foreground transition-colors"
                    title="Copy pool address"
                  >
                    {copiedAddress === pool.address ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">
                  DEX Pool · Unvetted
                </span>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-border/60 gap-1.5 hover:border-primary/60"
                >
                  <a href={pool.terminalUrl} target="_blank" rel="noopener noreferrer">
                    GeckoTerminal <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/20 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Pool / Pair</th>
                  <th className="py-3 px-4">Network &amp; DEX</th>
                  <th className="py-3 px-4">Price USD</th>
                  <th className="py-3 px-4">Reserve Liquidity</th>
                  <th className="py-3 px-4">24h Volume</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {filteredPools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground font-sans">{pool.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded px-1.5 py-0.5 text-[9px] border bg-primary/10 text-primary border-primary/30">
                          {pool.network}
                        </span>
                        <span className="rounded bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.5 text-[9px] text-sky-400">
                          {pool.dex}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {formatDollar(pool.priceUsd)}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatDollar(pool.reserveUsd)}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatDollar(pool.volume24hUsd)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
                      {formatTimeAgo(pool.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1">
                        <a href={pool.terminalUrl} target="_blank" rel="noopener noreferrer">
                          View <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

