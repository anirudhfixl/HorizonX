import React, { useState } from "react";
import { useLaunchpadCategories } from "@/api/hooks/use-launchpad";
import { coinGeckoClient, CoinGeckoMarketTokenRaw } from "@/api/client/coingecko-client";
import { useAsyncQuery } from "@/api/hooks/use-async-query";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  TrendingUp,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { formatDollar } from "./new-pools-directory";

export function CoinGeckoLaunchpadSection() {
  const { categories = [], isLoading: catsLoading } = useLaunchpadCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: rawTokens, isLoading: tokensLoading } = useAsyncQuery(
    async () => {
      const list = await coinGeckoClient.getLaunchpadTokens(20);
      return list;
    },
    []
  );
  const tokens = rawTokens || [];

  const topCategories = categories.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Sector Header & Secondary Market Disclosure */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>CoinGecko Launchpad Platforms &amp; Associated Ecosystem Tokens</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Aggregated live from CoinGecko's verified Launchpad sector.
          <strong>
            {" "}Disclosure: These tokens are fully launched and actively traded secondary market assets. They are NOT
            active fundraising presales.
          </strong>{" "}
          Market caps, prices, and 24h volumes reflect real-time global exchange pricing.
        </p>
      </div>

      {/* 1. Launchpad Platforms Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Top Launchpad Platforms ({categories.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            CoinGecko Sector Intelligence
          </span>
        </div>

        {catsLoading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading launchpad platform categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {topCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground truncate">
                      {cat.name}
                    </span>
                    <ProvenanceBadge kind="simulated" label="CoinGecko Category" />
                  </div>

                  {cat.content && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {cat.content}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Sector Market Cap
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {formatDollar(cat.market_cap ?? 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        24h Change
                      </span>
                      <span
                        className={`font-mono font-semibold ${
                          (cat.market_cap_change_24h ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {(cat.market_cap_change_24h ?? 0) >= 0 ? "+" : ""}
                        {(cat.market_cap_change_24h ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {cat.top_3_coins && cat.top_3_coins.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Top Incubated:</span>
                    <div className="flex items-center -space-x-1.5">
                      {cat.top_3_coins.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="Top token"
                          className="h-5 w-5 rounded-full border border-background object-cover bg-secondary"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Associated Launchpad Tokens */}
      <div className="space-y-3 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Launchpad Associated Tokens ({tokens.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Circulating Secondary Assets
          </span>
        </div>

        {tokensLoading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading associated launchpad tokens...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {tokens.slice(0, 12).map((token) => (
              <div
                key={token.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={token.image}
                        alt={token.name}
                        className="h-7 w-7 rounded-full bg-secondary border border-border/40"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {token.name}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground uppercase">
                          {token.symbol} · Rank #{token.market_cap_rank || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {formatDollar(token.current_price)}
                    </span>
                    {token.price_change_percentage_24h !== undefined && (
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          token.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {token.price_change_percentage_24h >= 0 ? "+" : ""}
                        {token.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40 font-mono">
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block font-sans">
                        Market Cap
                      </span>
                      <span className="text-foreground font-semibold">
                        {formatDollar(token.market_cap)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block font-sans">
                        24h Volume
                      </span>
                      <span className="text-foreground font-semibold">
                        {formatDollar(token.total_volume)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[9px] uppercase font-mono text-muted-foreground">
                    Circulating Asset
                  </span>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] px-2 text-primary hover:text-primary gap-1"
                  >
                    <a
                      href={`https://www.coingecko.com/en/coins/${token.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CoinGecko <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
