import React from "react";
import { Button } from "@/components/ui/button";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { useStakingPools } from "@/api";
import { Layers, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function StakingDashboardPage() {
  const { data: pools = [] } = useStakingPools();

  return (
    <main className="staking-page space-y-10">
      <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "Overview" }]} />
      <PageHeader
        title="Staking Protocol"
        description="Non-custodial smart vaults for high-yield token staking, LP incentives, and community governance locks."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Staked Value"
          value="$28,900,000"
          change="+12.4%"
          trend="up"
          subtitle="Across 14 reward vaults"
          icon={<Layers className="h-4 w-4" />}
        />
        <MetricCard
          title="Highest APY"
          value="38.2%"
          change="AURA Vault"
          trend="up"
          subtitle="Fixed 90-day lockup"
        />
        <MetricCard
          title="Total Active Stakers"
          value="4,070"
          change="Transparent distribution"
          trend="neutral"
          subtitle="Audited smart contracts"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Featured Staking Pools</h2>
          <Link to="/staking/pools" className="text-xs font-semibold text-primary hover:underline">
            View All Pools →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {pool.network}
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {pool.apy} APY
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-sm">{pool.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    Token: {pool.tokenId.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Staked:</span>
                    <span className="font-mono font-semibold text-foreground">{pool.totalStaked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lockup:</span>
                    <span className="font-mono text-foreground">
                      {pool.lockPeriodDays === 0 ? "Flexible" : `${pool.lockPeriodDays} Days`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
                <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                  <Link to={`/staking/pools/${pool.id}`}>Stake Asset</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
