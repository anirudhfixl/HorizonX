import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function ExploreProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Project Directory"
        description="Verified decentralized protocols, developer DAOs, and crypto teams on ProMiners."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: "Projects" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="h-4 w-4" /> Verified Project
                </span>
                <StatusBadge status={proj.status} />
              </div>

              <div>
                <h3 className="font-bold text-foreground text-base">{proj.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between">
                <span>Owner: <code className="font-mono text-foreground">{proj.ownerAddress}</code></span>
                <span>{proj.tokenIds.length} Linked Tokens</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
              <Link
                href={`/projects/${proj.id}`}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                Project Overview <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
