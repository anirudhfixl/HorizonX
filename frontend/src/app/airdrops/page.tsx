import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_AIRDROPS } from "@/lib/mock-data";
import { Gift, Plus, ShieldCheck, ArrowRight } from "lucide-react";

export default function AirdropsDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageHeader
        title="Airdrop Hub"
        description="Launch gas-efficient merkle distributions, reward loyal token communities, and claim eligible rewards."
        breadcrumbs={[{ label: "Airdrops" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link href="/airdrops/claim">Claim Rewards</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
              <Link href="/airdrops/campaigns/create">
                <Plus className="h-3.5 w-3.5" /> Launch Airdrop
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Tokens Distributed"
          value="$4,280,000"
          change="3.2M PMIN"
          trend="up"
          subtitle="Across all historical claims"
          icon={<Gift className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Campaigns"
          value="12"
          change="Merkle verified"
          trend="neutral"
          subtitle="Batch & quest rewards"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Claimants"
          value="18,450"
          change="+1,200 this week"
          trend="up"
          subtitle="Unique Web3 addresses"
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Active Airdrop Campaigns</h2>
          <Link href="/airdrops/campaigns" className="text-xs font-semibold text-primary hover:underline">
            View All Campaigns →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MOCK_AIRDROPS.map((air) => (
            <div
              key={air.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {air.network}
                  </span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                    {air.type}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{air.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{air.description}</p>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Reward Pool:</span>
                  <span className="font-mono font-bold text-emerald-400">{air.totalReward}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Expires: {air.endTime?.slice(0, 10)}</span>
                <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                  <Link href={`/airdrops/campaigns/${air.id}`}>Campaign Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
