"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { Token, TokenMarketData, Project } from "@/types";
import {
  Coins,
  Plus,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Compass,
  ArrowRight,
  Wallet,
  Info,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export type TokenWithMarket = Token & { market: TokenMarketData };

export interface TokensDashboardMetrics {
  totalTokens: number;
  activeTokens: number;
  pendingTokens: number;
  sepoliaTokens: number;
  catalogCrossChainTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  topGainer?: TokenWithMarket;
  topMarketCapToken?: TokenWithMarket;
  categoryBreakdown: Record<string, number>;
  verificationBreakdown: Record<string, number>;
}

// Helper to format currency numbers compactly
export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || val === 0) return "$0.00";
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

// Compute dashboard aggregations directly from the centralized token catalog
export function calculateTokensDashboardMetrics(
  tokens: TokenWithMarket[]
): TokensDashboardMetrics {
  const totalTokens = tokens.length;
  let activeTokens = 0;
  let pendingTokens = 0;
  let sepoliaTokens = 0;
  let catalogCrossChainTokens = 0;
  let totalMarketCap = 0;
  let totalVolume24h = 0;
  let totalLiquidity = 0;

  let topGainer: TokenWithMarket | undefined;
  let highestChange = -Infinity;

  let topMarketCapToken: TokenWithMarket | undefined;
  let highestCap = -Infinity;

  const categoryBreakdown: Record<string, number> = {};
  const verificationBreakdown: Record<string, number> = {};

  for (const t of tokens) {
    if (t.status === "active") activeTokens++;
    if (t.status === "pending") pendingTokens++;

    const isSepolia =
      t.network.toLowerCase().includes("sepolia") ||
      t.network.toLowerCase() === "ethereum";
    if (isSepolia) {
      sepoliaTokens++;
    } else {
      catalogCrossChainTokens++;
    }

    const cap = t.market?.marketCap || 0;
    const vol = t.market?.volume24h || 0;
    const liq = t.market?.liquidity || 0;
    const change = t.market?.priceChange24h || 0;

    totalMarketCap += cap;
    totalVolume24h += vol;
    totalLiquidity += liq;

    if (change > highestChange) {
      highestChange = change;
      topGainer = t;
    }

    if (cap > highestCap) {
      highestCap = cap;
      topMarketCapToken = t;
    }

    const cat = t.category || "Uncategorized";
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;

    const ver = t.verificationStatus || "not_reviewed";
    verificationBreakdown[ver] = (verificationBreakdown[ver] || 0) + 1;
  }

  return {
    totalTokens,
    activeTokens,
    pendingTokens,
    sepoliaTokens,
    catalogCrossChainTokens,
    totalMarketCap,
    totalVolume24h,
    totalLiquidity,
    topGainer,
    topMarketCapToken,
    categoryBreakdown,
    verificationBreakdown,
  };
}

// Return the N most recently created tokens sorted by createdAt descending
export function getRecentlyAddedTokens(
  tokens: TokenWithMarket[],
  limit = 4
): TokenWithMarket[] {
  return [...tokens]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Return curated flagship / highlighted tokens for feature display
export function getFeaturedTokens(tokens: TokenWithMarket[]): TokenWithMarket[] {
  // Key featured tokens: prominers (flagship), quantum (largest cap Sepolia), zkpv (privacy tier 1), ccat (top gainer)
  const featuredIds = ["prominers", "quantum", "zkpv", "ccat"];
  const found = tokens.filter((t) => featuredIds.includes(t.id));
  return found.length >= 3 ? found : tokens.slice(0, 4);
}

export default function TokensDashboardPage() {
  const { isConnected, shortAddress, network, balance } = useWallet();
  const { openModal } = useModal();

  // Fast Project lookup map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    MOCK_PROJECTS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Compute live dashboard metrics from the centralized token catalog
  const metrics = useMemo(
    () => calculateTokensDashboardMetrics(MOCK_TOKENS as TokenWithMarket[]),
    []
  );

  // Curated lists
  const recentTokens = useMemo(
    () => getRecentlyAddedTokens(MOCK_TOKENS as TokenWithMarket[], 4),
    []
  );

  const featuredTokens = useMemo(
    () => getFeaturedTokens(MOCK_TOKENS as TokenWithMarket[]),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Token Dashboard"
        description="Unified token lifecycle and asset overview. Explore indexed smart contracts, monitor aggregate telemetry, and access creator tools."
        breadcrumbs={[{ label: "Tokens" }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs border-border/60 hover:bg-secondary/50"
            >
              <Link href="/tokens/explore">
                <Compass className="h-3.5 w-3.5 mr-1 text-primary" /> Explore Catalog
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs border-border/60 hover:bg-secondary/50"
            >
              <Link href="/tokens/my">
                <Wallet className="h-3.5 w-3.5 mr-1" /> My Tokens
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5 font-semibold shadow-md shadow-primary/20"
            >
              <Link href="/tokens/create">
                <Plus className="h-3.5 w-3.5" /> Create Token
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
          All token market prices, 24h price changes, trading volumes, and DEX liquidity figures
          displayed across the Token Dashboard are simulated demonstration data. Per{" "}
          <strong>Architecture Decision D-04</strong>,{" "}
          <strong>Ethereum Sepolia (Chain ID: 11155111)</strong> is the only active EVM wallet network.
          Non-Sepolia listings (e.g. Arbitrum One, Base, Polygon) reflect future catalog metadata for
          cross-chain discovery and do not imply active wallet connectivity or transaction support.
        </p>
      </div>

      {/* 3. Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tokens Cataloged"
          value={metrics.totalTokens.toString()}
          subtitle={`${metrics.sepoliaTokens} Sepolia (D-04) • ${metrics.catalogCrossChainTokens} Cross-Chain`}
          icon={<Coins className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Simulated Market Cap"
          value={formatCurrency(metrics.totalMarketCap)}
          change={`Liq: ${formatCurrency(metrics.totalLiquidity)}`}
          trend="up"
          subtitle="All indexed token contracts"
          icon={<Sparkles className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="24h Trading Volume"
          value={formatCurrency(metrics.totalVolume24h)}
          change={
            metrics.topGainer
              ? `Top: ${metrics.topGainer.symbol} (+${metrics.topGainer.market?.priceChange24h}%)`
              : "+8.4%"
          }
          trend="up"
          subtitle="Simulated DEX liquidity"
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
        />
        <MetricCard
          title="Sepolia Catalog Assets"
          value={metrics.sepoliaTokens.toString()}
          subtitle="Chain ID: 11155111"
          change="D-04 Standard"
          trend="neutral"
          icon={<ShieldCheck className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* 4. Connected Wallet Orientation Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Connected Wallet Orientation
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isConnected
                ? "Your Web3 wallet is connected. You can monitor your deployed digital assets or launch new ERC-20 tokens on Ethereum Sepolia."
                : "Connect your Web3 address to access the creator management portal, inspect your deployed contracts, and view native Sepolia balances."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            {isConnected ? (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-right text-xs">
                  <div className="font-mono font-semibold text-foreground">
                    {shortAddress}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {balance} ETH • {network.name}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="text-xs border-border/60">
                  <Link href="/tokens/my">
                    My Tokens <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => openModal("CONNECT_WALLET")}
                className="bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                <Wallet className="h-3.5 w-3.5 mr-1.5" /> Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Quick Navigation Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/tokens/explore"
          className="group rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-lg space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Explore Token Catalog
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Search, filter by category and status, sort by market metrics, and inspect complete tokenomics.
          </p>
        </Link>

        <Link
          href="/tokens/create"
          className="group rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-lg space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Deploy ERC-20 Token
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            4-step wizard to configure token identity, initial supply, and OpenZeppelin module extensions.
          </p>
        </Link>

        <Link
          href="/tokens/my"
          className="group rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-lg space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            My Managed Assets
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Access contracts deployed with your address and review creator permissions and minting status.
          </p>
        </Link>
      </div>

      {/* 6. Featured Tokens Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Featured Ecosystem Assets</h2>
            <p className="text-xs text-muted-foreground">
              Highlighted tokens powering core infrastructure, governance, and protocol liquidity.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/90">
            <Link href="/tokens/explore">
              View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTokens.map((token) => {
            const isSepolia =
              token.network.toLowerCase().includes("sepolia") ||
              token.network.toLowerCase() === "ethereum";
            const project = token.projectId ? projectMap.get(token.projectId) : undefined;

            return (
              <div
                key={token.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-md space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-medium ${
                        isSepolia
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border/40"
                      }`}
                    >
                      {isSepolia ? "Sepolia (D-04)" : token.network}
                    </span>
                    <StatusBadge status={token.status} />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs shrink-0">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/tokens/${token.id}`}
                        className="font-semibold text-foreground text-xs hover:text-primary transition-colors truncate block"
                      >
                        {token.name}
                      </Link>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        ${token.symbol}
                      </span>
                    </div>
                  </div>

                  {project && (
                    <div className="text-[11px] text-muted-foreground truncate">
                      Project: <span className="text-foreground">{project.name}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/40 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Price</div>
                      <div className="font-mono font-semibold text-foreground text-sm">
                        ${token.market?.price ?? "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">24h Change</div>
                      <div
                        className={`font-mono text-xs font-semibold ${
                          (token.market?.priceChange24h || 0) >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {(token.market?.priceChange24h || 0) >= 0 ? "+" : ""}
                        {token.market?.priceChange24h}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs border-border/60 hover:border-primary/50"
                  >
                    <Link href={`/tokens/${token.id}`}>Inspect Asset</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Category & Verification Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Category Distribution</h3>
            <span className="text-xs text-muted-foreground">
              {Object.keys(metrics.categoryBreakdown).length} verticals
            </span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(metrics.categoryBreakdown).map(([category, count]) => {
              const pct = Math.round((count / metrics.totalTokens) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{category}</span>
                    <span className="font-mono text-muted-foreground text-[11px]">
                      {count} {count === 1 ? "token" : "tokens"} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lifecycle & Verification Status Breakdown */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Verification & Audit Tiers</h3>
            <span className="text-xs text-muted-foreground">Compliance integrity</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="font-medium text-foreground">Audit Available</div>
                  <div className="text-[10px] text-muted-foreground">
                    Independent security audit report available
                  </div>
                </div>
              </div>
              <span className="font-mono font-semibold text-emerald-400">
                {metrics.verificationBreakdown["audit_available"] || 0}
              </span>
            </div>

            <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium text-foreground">Contract Source Verified</div>
                  <div className="text-[10px] text-muted-foreground">
                    Open-source compiler bytecode matching
                  </div>
                </div>
              </div>
              <span className="font-mono font-semibold text-primary">
                {metrics.verificationBreakdown["contract_source_verified"] || 0}
              </span>
            </div>

            <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Project Reviewed</div>
                  <div className="text-[10px] text-muted-foreground">
                    Ecosystem project profile and team reviewed
                  </div>
                </div>
              </div>
              <span className="font-mono font-semibold text-foreground">
                {metrics.verificationBreakdown["project_reviewed"] || 0}
              </span>
            </div>

            <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="font-medium text-foreground">Not Reviewed</div>
                  <div className="text-[10px] text-muted-foreground">
                    Community submission — pending review and audit
                  </div>
                </div>
              </div>
              <span className="font-mono font-semibold text-amber-400">
                {metrics.verificationBreakdown["not_reviewed"] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Recently Added Tokens Feed */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recently Cataloged Tokens</h3>
            <p className="text-xs text-muted-foreground">
              Latest assets indexed by the ProMiners protocol architecture.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs border-border/60">
            <Link href="/tokens/explore">
              Explore All {metrics.totalTokens} Tokens <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Standard</th>
                <th className="py-3 px-4">Catalog Date</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">24h Change</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {recentTokens.map((token) => {
                const isSepolia =
                  token.network.toLowerCase().includes("sepolia") ||
                  token.network.toLowerCase() === "ethereum";
                const project = token.projectId ? projectMap.get(token.projectId) : undefined;

                return (
                  <tr key={token.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      <Link
                        href={`/tokens/${token.id}`}
                        className="flex items-center gap-2.5 hover:text-primary transition-colors"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{token.name}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            ${token.symbol}
                            {project && ` • ${project.name}`}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                          isSepolia
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground border border-border/40"
                        }`}
                      >
                        {isSepolia ? "Sepolia (D-04)" : token.network}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {token.standard || "ERC-20"}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{token.createdAt}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-foreground">
                      ${token.market?.price ?? "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          (token.market?.priceChange24h || 0) >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {(token.market?.priceChange24h || 0) >= 0 ? "+" : ""}
                        {token.market?.priceChange24h}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-border/60 hover:border-primary/50"
                      >
                        <Link href={`/tokens/${token.id}`}>Inspect</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
