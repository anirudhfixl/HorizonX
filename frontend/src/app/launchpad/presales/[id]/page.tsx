import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_PRESALES } from "@/lib/mock-data";
import { Rocket, ShieldCheck, Clock, Users, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return MOCK_PRESALES.map((ps) => ({ id: ps.id }));
}

export default async function PresaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presale = MOCK_PRESALES.find((p) => p.id === id) || MOCK_PRESALES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={presale.title}
        description={`Initial decentralized offering on ${presale.network} network with non-custodial lockup.`}
        breadcrumbs={[
          { label: "Launchpad", href: "/launchpad" },
          { label: "Presales", href: "/launchpad/presales" },
          { label: presale.title },
        ]}
        badge={<StatusBadge status={presale.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-foreground">Fundraising Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Raised:</span>
                <span className="font-mono font-bold text-primary">{presale.totalRaised}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-indigo-500 to-violet-500"
                  style={{ width: "79%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Softcap: {presale.softCap} (Reached)</span>
                <span>Hardcap: {presale.hardCap}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Participants"
              value={String(presale.participantCount)}
              subtitle="Unique Contributors"
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Min Allocation"
              value={presale.minContribution || "0.1 ETH"}
              subtitle="Per Wallet"
            />
            <MetricCard
              title="Max Allocation"
              value={presale.maxContribution || "3.0 ETH"}
              subtitle="Per Wallet"
            />
          </div>
        </div>

        {/* Right Col: Contribution Box */}
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-5 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Contribute to Presale</h3>
          <p className="text-xs text-muted-foreground">
            Deposit {presale.network === "BNB Chain" ? "BNB" : "ETH"} into the contract to receive tokens upon completion.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              Contribution Amount
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
              <input
                type="number"
                placeholder="1.0"
                step="0.1"
                className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none"
              />
              <span className="text-xs font-semibold text-primary">
                {presale.network === "BNB Chain" ? "BNB" : "ETH"}
              </span>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5">
            Submit Contribution
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            Tokens will be available to claim immediately when presale ends.
          </p>
        </div>
      </div>
    </div>
  );
}
