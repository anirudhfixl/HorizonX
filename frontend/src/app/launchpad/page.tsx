import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_PRESALES, MOCK_FAIR_LAUNCHES } from "@/lib/mock-data";
import { Rocket, Sparkles, Plus, ArrowRight, ShieldCheck } from "lucide-react";

export default function LaunchpadDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageHeader
        title="Launchpad Hub"
        description="The primary launch protocol for initial token offerings, presales, and fair launches with built-in liquidity lockups."
        breadcrumbs={[{ label: "Launchpad" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link href="/launchpad/launches/create">Create Fair Launch</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
              <Link href="/launchpad/presales/create">
                <Plus className="h-3.5 w-3.5" /> Create Presale
              </Link>
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Capital Raised"
          value="$18,420,000"
          change="+18.4%"
          trend="up"
          subtitle="All finalized campaigns"
          icon={<Rocket className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Campaigns"
          value="24"
          change="8 Live Today"
          trend="neutral"
          subtitle="Presales and fair launches"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <MetricCard
          title="Protected Liquidity"
          value="100%"
          change="Auto-locked"
          trend="up"
          subtitle="Non-custodial smart lock"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      {/* Presales Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">Featured Presales</h2>
          </div>
          <Link href="/launchpad/presales" className="text-xs font-semibold text-primary hover:underline">
            View All Presales →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MOCK_PRESALES.map((ps) => (
            <div
              key={ps.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {ps.network}
                  </span>
                  <StatusBadge status={ps.status} />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-sm">{ps.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    Token: {ps.tokenId.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Raised:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {ps.totalRaised} / {ps.hardCap}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Min: {ps.minContribution}</span>
                <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                  <Link href={`/launchpad/presales/${ps.id}`}>Participate</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fair Launches Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-foreground">Community Fair Launches</h2>
          </div>
          <Link href="/launchpad/launches" className="text-xs font-semibold text-primary hover:underline">
            View All Launches →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MOCK_FAIR_LAUNCHES.map((fl) => (
            <div
              key={fl.id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md"
            >
              <div>
                <span className="font-bold text-foreground text-sm">{fl.title}</span>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">Network: {fl.network}</p>
              </div>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                <Link href={`/launchpad/launches/${fl.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
