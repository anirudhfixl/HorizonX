import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_TOKENS } from "@/lib/mock-data";
import { ArrowDownUp, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  return MOCK_TOKENS.map((t) => ({ id: t.id }));
}

export default async function TokenExchangePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = MOCK_TOKENS.find((t) => t.id === id) || MOCK_TOKENS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={`${token.name} (${token.symbol}) Market`}
        description={`Live AMM swap pool and analytics for ${token.symbol} on ${token.network}.`}
        breadcrumbs={[
          { label: "Markets", href: "/exchange" },
          { label: token.symbol },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Market Price</span>
                <p className="text-3xl font-bold font-mono text-foreground">${token.market.price}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">24h Change</span>
                <p className={`text-base font-bold font-mono ${(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                </p>
              </div>
            </div>

            {/* Price Chart Placeholder Canvas */}
            <div className="h-64 rounded-xl border border-border/40 bg-secondary/20 flex items-center justify-center text-xs text-muted-foreground">
              TradingView Market Chart (Phase 1 Mock - Pending D-08 Data Provider)
            </div>
          </div>
        </div>

        {/* Swap Widget */}
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-5 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Instant Swap</h3>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">You Pay</span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0.0"
                  className="bg-transparent text-lg font-mono font-bold text-foreground focus:outline-none w-2/3"
                />
                <span className="rounded bg-muted px-2 py-1 text-xs font-bold text-foreground">ETH</span>
              </div>
            </div>

            <div className="flex justify-center -my-1">
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border/60 text-muted-foreground hover:text-foreground">
                <ArrowDownUp className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">You Receive</span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0.0"
                  className="bg-transparent text-lg font-mono font-bold text-foreground focus:outline-none w-2/3"
                />
                <span className="rounded bg-primary/20 px-2 py-1 text-xs font-bold text-primary">{token.symbol}</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5">
            Swap {token.symbol}
          </Button>
        </div>
      </div>
    </div>
  );
}
