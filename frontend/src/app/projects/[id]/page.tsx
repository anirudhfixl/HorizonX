import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { ShieldCheck, ExternalLink, Globe } from "lucide-react";

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

  const linkedTokens = MOCK_TOKENS.filter((t) => project.tokenIds?.includes(t.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
        badge={<StatusBadge status={project.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-foreground">Project Overview</h2>
              <div className="flex flex-wrap gap-2">
                {project.category && (
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    {project.category}
                  </Badge>
                )}
                {project.ecosystem && (
                  <Badge variant="secondary" className="text-xs">
                    {project.ecosystem}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
              <div>
                Owner Address: <code className="font-mono text-foreground">{project.ownerAddress}</code>
              </div>
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Linked Ecosystem Tokens</h3>
              <span className="text-xs text-muted-foreground font-mono">
                {linkedTokens.length} {linkedTokens.length === 1 ? "token" : "tokens"}
              </span>
            </div>

            {linkedTokens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedTokens.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 flex justify-between items-center text-xs hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-foreground">{t.name}</span>
                      <p className="font-mono text-muted-foreground">${t.symbol} • {t.network}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60 hover:border-primary">
                      <Link href={`/tokens/${t.id}`}>Inspect</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-secondary/10 p-6 text-center text-xs text-muted-foreground">
                No tokens currently associated with this project.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md space-y-4 h-fit shadow-xl">
          <h3 className="text-base font-bold text-foreground">Verification Rating</h3>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center gap-2.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>
              {project.verificationStatus === "audit_available"
                ? "Smart Contract Audited"
                : project.verificationStatus === "project_reviewed"
                ? "Protocol Reviewed"
                : project.verificationStatus === "contract_source_verified"
                ? "Source Code Verified"
                : "Developer Team Listed"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {project.verificationStatus === "audit_available"
              ? "Comprehensive security audit report available in centralized repository."
              : "Project identity and multi-sig authority reviewed for Phase 1 demonstration."}
          </p>
        </div>
      </div>
    </div>
  );
}
