import React from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_STAKING_POOLS } from "@/lib/mock-data";
import { Layers } from "lucide-react";

export function generateStaticParams() {
  return MOCK_STAKING_POOLS.map((p) => ({ id: p.id }));
}

export default async function StakingPoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pool = MOCK_STAKING_POOLS.find((p) => p.id === id);
  if (!pool) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={pool.name}
        description={`Staking vault for ${pool.tokenId.toUpperCase()} with ${pool.apy} reward yield.`}
        breadcrumbs={[
          { label: "Staking", href: "/staking" },
          { label: "Pools", href: "/staking/pools" },
          { label: pool.name },
        ]}
        badge={<StatusBadge status={pool.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Estimated APY"
              value={pool.apy || "0%"}
              change="Linear Yield"
              trend="up"
              icon={<Layers className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Staked"
              value={pool.totalStaked || "0"}
              subtitle="Vault Balance"
            />
            <MetricCard
              title="Lock Duration"
              value={pool.lockPeriodDays === 0 ? "Flexible" : `${pool.lockPeriodDays} Days`}
              subtitle={pool.lockPeriodDays === 0 ? "Withdraw Anytime" : "Locked Period"}
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-3">
            <h2 className="text-base font-bold text-foreground">Staking Contract Security</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This vault implements audited non-custodial smart contracts. Staked principal remains 100% owned by the contributor. Rewards accrue every block and can be harvested at any time.
            </p>
          </div>
        </div>

        {/* Stake Widget */}
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-5 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Stake Your Tokens</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              Amount to Deposit
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
              <input
                type="number"
                placeholder="100"
                className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none"
              />
              <span className="text-xs font-semibold text-primary">{pool.tokenId.toUpperCase()}</span>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5">
            Deposit & Start Earning
          </Button>
        </div>
      </div>
    </div>
  );
}
