import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";
import { TOKENS } from "@/data";
import { LineChart, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExchangeDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageHeader
        title="Markets & Analytics"
        description="Demonstration market telemetry, simulated liquidity analytics, price indices, and trading pairs."
        breadcrumbs={[{ label: "Markets" }]}
        actions={
          <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
            <Link to="/exchange/watchlist">Watchlist</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="24h Ecosystem Volume"
          value="$12,410,000"
          change="+14.2%"
          trend="up"
          subtitle="Aggregated across DEX pools"
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Liquidity"
          value="$38,600,000"
          change="+4.1%"
          trend="up"
          subtitle="Locked in automated pools"
        />
        <MetricCard
          title="Top Gainer"
          value="+14.2%"
          change="PMIN Token"
          trend="up"
          subtitle="24h highest mover"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Market Pairs</h2>
          <Link to="/exchange/markets" className="text-xs text-primary hover:underline font-medium">
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
              {TOKENS.map((token) => (
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
                      <Link to={`/exchange/tokens/${token.id}`}>Trade</Link>
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
