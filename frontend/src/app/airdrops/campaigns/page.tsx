import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MOCK_AIRDROPS } from "@/lib/mock-data";
import { Gift, Plus } from "lucide-react";

export default function AllAirdropCampaignsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="All Airdrop Campaigns"
        description="Explore active, upcoming, and completed merkle and batch reward distributions."
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "Campaigns" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/airdrops/campaigns/create">
              <Plus className="h-3.5 w-3.5" /> Launch Airdrop
            </Link>
          </Button>
        }
      />

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
              <h3 className="font-bold text-foreground text-base">{air.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{air.description}</p>
              <div className="flex justify-between text-xs pt-2 border-t border-border/40">
                <span className="text-muted-foreground">Total Pool:</span>
                <span className="font-mono font-bold text-emerald-400">{air.totalReward}</span>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                <Link href={`/airdrops/campaigns/${air.id}`}>View Campaign</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
