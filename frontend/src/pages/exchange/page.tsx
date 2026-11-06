import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { useTokens, useExchangeOverview } from "@/api";
import { LineChart, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketWorkspaceHeader } from "@/components/market/market-section-nav";

export default function ExchangeDashboardPage() {
  const { data: tokens = [] } = useTokens();
  const { data: overview } = useExchangeOverview();

  const volumeDisplay = overview?.volume24h
    ? `$${(overview.volume24h / 1_000_000).toFixed(2)}M`
    : "$12,410,000";
  const liquidityDisplay = overview?.totalLiquidity
    ? `$${(overview.totalLiquidity / 1_000_000).toFixed(2)}M`
    : "$38,600,000";
  const topGainerDisplay = overview?.topGainer
    ? `+${overview.topGainer.changePercent ?? 14.2}%`
    : "+14.2%";
  const topGainerChange = overview?.topGainer
    ? `${overview.topGainer.symbol} Token`
    : "PMIN Token";

  return (
    <div className="mk-page-shell space-y-10">
      <MarketWorkspaceHeader items={[{ label: "Markets" }, { label: "Overview" }]} />
      <PageHeader
        title="Markets & Analytics"
        description="Demonstration market telemetry, simulated liquidity analytics, price indices, and trading pairs."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="24h Ecosystem Volume"
          value={volumeDisplay}
          change="+14.2%"
          trend="up"
          subtitle="Aggregated across DEX pools"
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Liquidity"
          value={liquidityDisplay}
          change="+4.1%"
          trend="up"
          subtitle="Locked in automated pools"
        />
        <MetricCard
          title="Top Gainer"
          value={topGainerDisplay}
          change={topGainerChange}
          trend="up"
          subtitle="24h highest mover"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Market Pairs</h2>
          <Link to="/tokens/explore" className="text-xs text-primary hover:underline font-medium">
            View All Markets →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/50 bg-secondary/30 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h Change</th>
                <th className="px-4 py-3">24h Volume</th>
                <th className="px-4 py-3">Liquidity</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3.5 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{token.symbol}</span>
                      <span className="text-muted-foreground">/ USD</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-foreground">
                    ${token.market.price}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold">
                    <span className={(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">
                    ${((token.market.volume24h || 0) / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">
                    ${((token.market.liquidity || 0) / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                      <Link to={`/tokens/${token.id}#trade`}>Trade</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
