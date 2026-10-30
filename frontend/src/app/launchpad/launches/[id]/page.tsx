import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_FAIR_LAUNCHES } from "@/lib/mock-data";
import { Sparkles, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  return MOCK_FAIR_LAUNCHES.map((l) => ({ id: l.id }));
}

export default async function FairLaunchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const launch = MOCK_FAIR_LAUNCHES.find((l) => l.id === id) || MOCK_FAIR_LAUNCHES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={launch.title}
        description={`Community Fair Launch on ${launch.network}. Dynamic pricing based on total liquidity pools.`}
        breadcrumbs={[
          { label: "Launchpad", href: "/launchpad" },
          { label: "Fair Launches", href: "/launchpad/launches" },
          { label: launch.title },
        ]}
        badge={<StatusBadge status={launch.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-foreground">Launch Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
                <span className="text-muted-foreground">Network</span>
                <p className="font-semibold text-foreground">{launch.network}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
                <span className="text-muted-foreground">Token Symbol</span>
                <p className="font-mono font-semibold text-primary">{launch.tokenId.toUpperCase()}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
                <span className="text-muted-foreground">Start Time</span>
                <p className="font-mono text-foreground">{launch.startTime}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
                <span className="text-muted-foreground">End Time</span>
                <p className="font-mono text-foreground">{launch.endTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-5 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Fair Launch Participation</h3>
          <p className="text-xs text-muted-foreground">
            Connect wallet and deposit funds to participate. Your token share is calculated when the launch closes.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              Contribution Amount
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
              <input
                type="number"
                placeholder="0.5"
                step="0.1"
                className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none"
              />
              <span className="text-xs font-semibold text-primary">ETH</span>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5">
            Participate in Fair Launch
          </Button>
        </div>
      </div>
    </div>
  );
}
