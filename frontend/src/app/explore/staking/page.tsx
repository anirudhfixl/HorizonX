import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_STAKING_POOLS } from "@/lib/mock-data";
import { Layers, Plus } from "lucide-react";

export default function ExploreStakingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Staking Pool Discovery"
        description="Earn passive yields by staking tokens in verified, non-custodial reward vaults."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: "Staking" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/staking/pools/create">
              <Plus className="h-3.5 w-3.5" /> Deploy Staking Pool
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_STAKING_POOLS.map((pool) => (
          <div
            key={pool.id}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {pool.network}
                </span>
                <span className="text-emerald-400 font-mono text-base font-bold">
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
                  <span className="text-muted-foreground">Lock Period:</span>
                  <span className="font-mono text-foreground">
                    {pool.lockPeriodDays === 0 ? "Flexible (No lock)" : `${pool.lockPeriodDays} Days`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stakers:</span>
                  <span className="font-mono text-foreground">{pool.stakerCount}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                <Link href={`/staking/pools/${pool.id}`}>Stake Tokens</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
