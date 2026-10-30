import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MOCK_TOKENS } from "@/lib/mock-data";

export default function MarketsOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Market Overview"
        description="Demonstration directory of simulated trading pairs and liquidity metrics (Phase 1 preview)."
        breadcrumbs={[
          { label: "Markets", href: "/exchange" },
          { label: "Overview" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_TOKENS.map((token) => (
          <div
            key={token.id}
            className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-3 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">{token.symbol} / USD</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  (token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
              </span>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">${token.market.price}</p>
            <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground flex justify-between">
              <span>Vol: ${((token.market.volume24h || 0) / 1000000).toFixed(2)}M</span>
              <Link href={`/exchange/tokens/${token.id}`} className="text-primary hover:underline font-semibold">
                Swap →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
