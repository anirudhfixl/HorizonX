import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_PRESALES } from "@/lib/mock-data";
import { Rocket, Plus, ArrowRight } from "lucide-react";

export default function ExplorePresalesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Presales Discovery"
        description="Explore live, scheduled, and past presales. All contracts employ non-custodial lockups and transparent softcaps."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: "Presales" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/launchpad/presales/create">
              <Plus className="h-3.5 w-3.5" /> Create Presale
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Softcap: {ps.softCap}</span>
                  <span>{ps.participantCount} Participants</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Min: {ps.minContribution}
              </span>
              <Button asChild size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                <Link href={`/launchpad/presales/${ps.id}`}>View Presale</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
