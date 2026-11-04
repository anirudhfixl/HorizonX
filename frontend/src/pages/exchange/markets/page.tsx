import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { TOKENS } from "@/data";
import { Link } from "react-router-dom";
import { MarketWorkspaceHeader } from "@/components/market/market-section-nav";

export default function MarketsOverviewPage() {
  return (
    <div className="mk-page-shell space-y-8 pt-0">
      <MarketWorkspaceHeader items={[{ label: "Markets", to: "/exchange" }, { label: "All markets" }]} />
      <PageHeader
        title="All markets"
        description="Browse simulated trading pairs, compare prices and liquidity, and open an asset market."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOKENS.map((token) => (
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
              <Link to={`/exchange/tokens/${token.id}`} className="text-primary hover:underline font-semibold">
                Swap →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
