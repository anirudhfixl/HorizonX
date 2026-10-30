import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_AIRDROPS } from "@/lib/mock-data";
import { Gift, Users } from "lucide-react";

export function generateStaticParams() {
  return MOCK_AIRDROPS.map((a) => ({ id: a.id }));
}

export default async function AirdropDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const airdrop = MOCK_AIRDROPS.find((a) => a.id === id);
  if (!airdrop) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={airdrop.title}
        description={airdrop.description}
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "Campaigns", href: "/airdrops/campaigns" },
          { label: airdrop.title },
        ]}
        badge={<StatusBadge status={airdrop.status} />}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
            <Link href="/airdrops/claim">Check Wallet Eligibility</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Allocation"
          value={airdrop.totalReward || "0 PMIN"}
          subtitle="Reward Pool"
          icon={<Gift className="h-4 w-4" />}
        />
        <MetricCard
          title="Eligible Claimants"
          value={String(airdrop.recipientCount)}
          subtitle="Merkle tree leaves"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Claimed to Date"
          value={String(airdrop.claimedCount)}
          subtitle="Processed claims"
          trend="up"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-foreground">Distribution Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Network</span>
            <p className="font-semibold text-foreground">{airdrop.network}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Distribution Type</span>
            <p className="font-semibold text-primary uppercase">{airdrop.type}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Expiration Date</span>
            <p className="font-mono text-foreground">{airdrop.endTime?.slice(0, 10)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
