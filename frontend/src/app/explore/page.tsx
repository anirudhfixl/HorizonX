import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_TOKENS,
  MOCK_PRESALES,
  MOCK_AIRDROPS,
  MOCK_STAKING_POOLS,
} from "@/lib/mock-data";
import { Compass, Coins, Rocket, Gift, Layers, Search, Filter } from "lucide-react";

export default function ExploreHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageHeader
        title="Discovery Hub"
        description="Search, filter, and discover tokens, active presales, fair launches, airdrop campaigns, and staking vaults across the ProMiners ecosystem."
        breadcrumbs={[{ label: "Explore" }]}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/explore"
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            All Categories
          </Link>
          <Link
            href="/explore/tokens"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Tokens
          </Link>
          <Link
            href="/explore/projects"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/explore/presales"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Presales
          </Link>
          <Link
            href="/explore/launches"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Fair Launches
          </Link>
          <Link
            href="/explore/airdrops"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Airdrops
          </Link>
          <Link
            href="/explore/staking"
            className="rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Staking Pools
          </Link>
        </div>

        {/* Search & Filter Mock */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-3 py-1.5 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Filter items..."
              className="bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground w-36 sm:w-48 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
            <Filter className="h-3 w-3" /> Filters
          </Button>
        </div>
      </div>

      {/* Grid of All Discovery Assets */}
      <div className="space-y-12">
        {/* Tokens preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Featured Tokens</h2>
            </div>
            <Link href="/explore/tokens" className="text-xs font-medium text-primary hover:underline">
              View All Tokens →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_TOKENS.map((token) => (
              <div
                key={token.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{token.name}</span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {token.symbol}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {token.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 font-mono">
                  <span>${token.market.price}</span>
                  <span className={(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Presales preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-amber-400" />
              <h2 className="text-base font-bold text-foreground">Active Presales</h2>
            </div>
            <Link href="/explore/presales" className="text-xs font-medium text-primary hover:underline">
              View All Presales →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MOCK_PRESALES.map((ps) => (
              <div
                key={ps.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground line-clamp-1">{ps.title}</span>
                  <StatusBadge status={ps.status} />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target Hardcap:</span>
                    <span className="font-mono text-foreground font-semibold">{ps.hardCap}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Raised:</span>
                    <span className="font-mono text-primary font-semibold">{ps.totalRaised}</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full text-xs border-border/60">
                  <Link href={`/launchpad/presales/${ps.id}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Airdrops & Staking */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-emerald-400" /> Airdrop Discovery
              </span>
              <Link href="/explore/airdrops" className="text-xs text-primary hover:underline">
                Explore →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Participate in active community rewards, testnet incentives, and merkle claim pools.
            </p>
            <div className="space-y-2 pt-1">
              {MOCK_AIRDROPS.map((air) => (
                <div key={air.id} className="flex justify-between text-xs p-2 rounded-lg bg-secondary/30">
                  <span className="font-medium text-foreground">{air.title}</span>
                  <span className="text-emerald-400 font-mono font-semibold">{air.totalReward}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-violet-400" /> Staking Pool Discovery
              </span>
              <Link href="/explore/staking" className="text-xs text-primary hover:underline">
                Explore →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Stake LP tokens and single assets into secure vaults for continuous yield distribution.
            </p>
            <div className="space-y-2 pt-1">
              {MOCK_STAKING_POOLS.map((pool) => (
                <div key={pool.id} className="flex justify-between text-xs p-2 rounded-lg bg-secondary/30">
                  <span className="font-medium text-foreground">{pool.name}</span>
                  <span className="text-emerald-400 font-mono font-semibold">{pool.apy} APY</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
