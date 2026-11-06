import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { Share2, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { PartnersWorkspaceHeader } from "@/components/partners/partners-section-nav";
import { PartnerDirectory } from "@/components/partners/partner-directory";
import { usePartnerProgramMetrics, usePartnerBenefits } from "@/api";

export default function PartnersPage() {
  const { data: metrics } = usePartnerProgramMetrics();
  const { data: benefits = [] } = usePartnerBenefits();

  return (
    <main className="pt-page-shell space-y-10">
      <PartnersWorkspaceHeader items={[{ label: "Partners" }, { label: "Overview" }]} />
      <PageHeader
        title="Partner Portal"
        description="Collaborate with HorizonX to incubate projects, onboard developers, and earn protocol revenue share."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Commission Tier"
          value={metrics?.commissionTier || "Gold Partner"}
          change={metrics?.commissionRevShare || "35% RevShare"}
          trend="up"
          subtitle="Tier status"
          icon={<Award className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Referred Volume"
          value={metrics?.totalReferredVolume || "$1,420,000"}
          change={metrics?.referredVolumeChange || "+8.2%"}
          trend="up"
          subtitle="Presales & token launches"
          icon={<Share2 className="h-4 w-4" />}
        />
        <MetricCard
          title="Accrued Rewards"
          value={metrics?.accruedRewards || "$14,850"}
          change="Claimable"
          trend="up"
          subtitle="Paid in USDT/ETH"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-foreground">Partner Program Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-1.5">
              <span className="font-semibold text-foreground">{b.title}</span>
              <p className="text-muted-foreground leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Public Partner Directory & Ecosystem Alliances */}
      <PartnerDirectory />
    </main>
  );
}
