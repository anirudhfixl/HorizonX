import React from "react";
import Link from "next/link";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_TOKENS,
  MOCK_PRESALES,
  MOCK_AIRDROPS,
  MOCK_STAKING_POOLS,
} from "@/lib/mock-data";
import {
  Rocket,
  Coins,
  Gift,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Shield,
  Activity,
  Flame,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 py-8 sm:py-12">
      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 via-card/40 to-background/90 p-8 sm:p-14 backdrop-blur-xl shadow-2xl">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Next-Generation Token & Launchpad Protocol</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.15]">
            Deploy, Discover, and Scale{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              Web3 Assets
            </span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
            ProMiners is the unified decentralized ecosystem for token creation,
            tiered presales, fair launches, merkle airdrop distributions, and high-yield staking pools.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20 gap-2"
            >
              <Link href="/explore">
                <Rocket className="h-4 w-4" /> Explore Ecosystem
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/70 hover:bg-secondary/70 gap-2 font-semibold"
            >
              <Link href="/tokens/create">
                <Coins className="h-4 w-4 text-primary" /> Launch Token
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
            >
              <Link href="/docs">
                View Documentation <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-8 border-t border-border/40">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Audited Smart Contracts</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Zero Coding Required</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Multichain EVM Ready</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Non-Custodial Escrow</span>
          </div>
        </div>
      </section>

      {/* ─── Protocol Metrics ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Protocol Highlights</h2>
          </div>
          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Demonstration Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Value Locked"
            value="$48,250,000"
            change="+8.4%"
            trend="up"
            subtitle="Across 6 networks"
            icon={<Shield className="h-4 w-4" />}
          />
          <MetricCard
            title="24h Protocol Volume"
            value="$12,410,000"
            change="+14.2%"
            trend="up"
            subtitle="Swap & participation volume"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            title="Active Presales & Launches"
            value="24"
            change="+4 today"
            trend="up"
            subtitle="Live funding campaigns"
            icon={<Rocket className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Staked Assets"
            value="$28,900,000"
            change="Up to 38.2% APY"
            trend="up"
            subtitle="14 Active liquidity pools"
            icon={<Layers className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* ─── Trending Tokens ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">Trending Tokens</h2>
          </div>
          <Link
            href="/tokens"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All Tokens <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/50 bg-secondary/30 text-muted-foreground font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Network</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">24h Change</th>
                  <th className="px-4 py-3">24h Volume</th>
                  <th className="px-4 py-3">Market Cap</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MOCK_TOKENS.map((token) => (
                  <tr
                    key={token.id}
                    className="group transition-colors hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3.5 font-medium">
                      <Link
                        href={`/tokens/${token.id}`}
                        className="flex items-center gap-2.5 hover:text-primary transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary font-bold text-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {token.name}
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {token.symbol}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px]">
                        {token.network}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-foreground">
                      ${token.market.price?.toFixed(token.market.price < 1 ? 4 : 2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                          (token.market.priceChange24h || 0) >= 0
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}
                        {token.market.priceChange24h}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">
                      ${((token.market.volume24h || 0) / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">
                      ${((token.market.marketCap || 0) / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-border/60 hover:border-primary/50"
                      >
                        <Link href={`/tokens/${token.id}`}>Trade</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Featured Presales & Launches ────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Featured Presales</h2>
          </div>
          <Link
            href="/launchpad/presales"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Presales <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRESALES.map((ps) => (
            <div
              key={ps.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {ps.network}
                  </span>
                  <StatusBadge status={ps.status} />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                    {ps.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    Token: {ps.tokenId.toUpperCase()}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Raised:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {ps.totalRaised} / {ps.hardCap}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                      style={{ width: "79%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Soft: {ps.softCap}</span>
                    <span>{ps.participantCount} Participants</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Min: {ps.minContribution}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
                >
                  <Link href={`/launchpad/presales/${ps.id}`}>Participate</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Staking & Airdrops Split Banner ─────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Staking Pools */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Top Yield Staking</h2>
            </div>
            <Link
              href="/staking"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Pools →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_STAKING_POOLS.slice(0, 2).map((pool) => (
              <div
                key={pool.id}
                className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/30 p-3.5 hover:border-primary/40 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {pool.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span>Lock: {pool.lockPeriodDays === 0 ? "Flexible" : `${pool.lockPeriodDays} Days`}</span>
                    <span>•</span>
                    <span>Staked: {pool.totalStaked}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {pool.apy}
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase">Estimated APY</p>
                </div>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="w-full text-xs border-border/60">
            <Link href="/staking/pools/create">
              Create a Staking Pool for Your Token →
            </Link>
          </Button>
        </div>

        {/* Live Airdrops */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-foreground">Airdrop Campaigns</h2>
            </div>
            <Link
              href="/airdrops"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Browse Claims →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_AIRDROPS.map((airdrop) => (
              <div
                key={airdrop.id}
                className="rounded-xl border border-border/40 bg-secondary/30 p-3.5 hover:border-primary/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                    {airdrop.title}
                  </h4>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                    {airdrop.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">
                    Pool: {airdrop.totalReward}
                  </span>
                  <Link
                    href={`/airdrops/campaigns/${airdrop.id}`}
                    className="text-primary hover:underline font-medium text-[11px]"
                  >
                    Check Eligibility →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="w-full text-xs border-border/60">
            <Link href="/airdrops/claim">
              Check My Wallet Eligibility for Claims →
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
