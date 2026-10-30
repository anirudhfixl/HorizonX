import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_FAIR_LAUNCHES } from "@/lib/mock-data";
import { Sparkles, Plus } from "lucide-react";

export default function ExploreFairLaunchesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Fair Launches Discovery"
        description="Equal-opportunity decentralized launches without private allocations, seed rounds, or team pre-mines."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: "Fair Launches" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/launchpad/launches/create">
              <Plus className="h-3.5 w-3.5" /> Create Fair Launch
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_FAIR_LAUNCHES.map((fl) => (
          <div
            key={fl.id}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {fl.network}
                </span>
                <StatusBadge status={fl.status} />
              </div>

              <div>
                <h3 className="font-semibold text-foreground text-base">{fl.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Token: {fl.tokenId.toUpperCase()}
                </p>
              </div>

              <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span className="font-mono text-foreground">{fl.startTime?.slice(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span>End:</span>
                  <span className="font-mono text-foreground">{fl.endTime?.slice(0, 10)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                <Link href={`/launchpad/launches/${fl.id}`}>View Launch</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
