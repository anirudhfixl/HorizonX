import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MOCK_TOKENS } from "@/lib/mock-data";
import { Coins, Plus, ExternalLink, ArrowRight } from "lucide-react";

export default function ExploreTokensPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Token Explorer"
        description="Comprehensive index of tokens deployed across supported EVM networks."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: "Tokens" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/tokens/create">
              <Plus className="h-3.5 w-3.5" /> Deploy New Token
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_TOKENS.map((token) => (
          <div
            key={token.id}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {token.network}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  {token.standard}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-foreground text-base">{token.name}</h3>
                <span className="font-mono text-xs text-primary font-semibold">
                  ${token.symbol}
                </span>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {token.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-mono font-semibold text-foreground">
                    ${token.market.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Change:</span>
                  <span
                    className={`font-mono font-semibold ${
                      (token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply:</span>
                  <span className="font-mono text-foreground">{token.totalSupply}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
              <Link
                href={`/tokens/${token.id}`}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                Contract Details <ArrowRight className="h-3 w-3" />
              </Link>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                <Link href={`/exchange/tokens/${token.id}`}>Trade</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
