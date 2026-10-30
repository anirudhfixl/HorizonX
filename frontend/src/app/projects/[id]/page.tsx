import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { Briefcase, ShieldCheck, ExternalLink, Coins } from "lucide-react";

export function generateStaticParams() {
  return MOCK_PROJECTS.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = MOCK_PROJECTS.find((p) => p.id === id);
  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={[
          { label: "Projects", href: "/explore/projects" },
          { label: project.name },
        ]}
        badge={<StatusBadge status={project.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-foreground">Project Overview</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {project.description}
            </p>
            <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground">
              Owner Address: <code className="font-mono text-foreground">{project.ownerAddress}</code>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-foreground">Linked Ecosystem Tokens</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_TOKENS.slice(0, 2).map((t) => (
                <div key={t.id} className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{t.name}</span>
                    <p className="font-mono text-muted-foreground">${t.symbol}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                    <Link href={`/tokens/${t.id}`}>Inspect</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-4 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Verification Rating</h3>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center gap-2.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Tier 1 Developer Verified</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Contract ownership confirmed and multi-sig authority verified.
          </p>
        </div>
      </div>
    </div>
  );
}
