import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/projects/copy-button";
import { Button } from "@/components/ui/button";
import {
  PROJECTS,
  TOKENS,
  PRESALES,
  FAIR_LAUNCHES,
  AIRDROPS,
  STAKING_POOLS,
} from "@/data";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ExternalLink,
  Globe,
  ArrowUpRight,
  Info,
  FileCode2,
  Activity,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProjectBreadcrumb, ProjectSectionNav } from "@/components/projects/project-section-nav";

// Same category -> tone assignment as the directory (position in the sorted category list).
const TONES = [
  { tile: "border-primary/30 from-primary/30 to-primary/5", text: "text-primary", glow: "from-primary/15" },
  { tile: "border-cyan-500/30 from-cyan-500/30 to-cyan-500/5", text: "text-cyan-400", glow: "from-cyan-500/15" },
  { tile: "border-violet-500/30 from-violet-500/30 to-violet-500/5", text: "text-violet-400", glow: "from-violet-500/15" },
  { tile: "border-emerald-500/30 from-emerald-500/30 to-emerald-500/5", text: "text-emerald-400", glow: "from-emerald-500/15" },
  { tile: "border-rose-500/30 from-rose-500/30 to-rose-500/5", text: "text-rose-400", glow: "from-rose-500/15" },
  { tile: "border-amber-500/30 from-amber-500/30 to-amber-500/5", text: "text-amber-400", glow: "from-amber-500/15" },
];
const NEUTRAL_TONE = { tile: "border-border/60 from-secondary to-secondary/30", text: "text-muted-foreground", glow: "from-secondary/40" };

function toneFor(category?: string) {
  const categories = Array.from(new Set(PROJECTS.map((p) => p.category).filter(Boolean) as string[])).sort();
  const idx = category ? categories.indexOf(category) : -1;
  return idx < 0 ? NEUTRAL_TONE : TONES[idx % TONES.length];
}

function initialsOf(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

function shortAddress(addr: string) {
  return addr.length > 20 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;
}

const isSepolia = (network?: string) => {
  const n = (network || "").toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
};

const VERIFICATION: Record<string, { label: string; text: string; cls: string; description: string }> = {
  audit_available: {
    label: "Audit available",
    text: "text-emerald-400",
    cls: "border-emerald-500/30 bg-emerald-500/10",
    description: "A security audit report is available in the centralized repository.",
  },
  contract_source_verified: {
    label: "Source code verified",
    text: "text-cyan-400",
    cls: "border-cyan-500/30 bg-cyan-500/10",
    description: "The project's contract source code has been verified.",
  },
  project_reviewed: {
    label: "Project reviewed",
    text: "text-primary",
    cls: "border-primary/30 bg-primary/10",
    description: "Project identity and multi-sig authority reviewed for Phase 1 demonstration.",
  },
  not_reviewed: {
    label: "Not reviewed",
    text: "text-muted-foreground",
    cls: "border-border/60 bg-secondary/30",
    description: "This project has not been reviewed.",
  },
};

export default function ProjectDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) {
    return <NotFoundPage />;
  }

  const linkedTokens = TOKENS.filter((t) => project.tokenIds?.includes(t.id));
  const tone = toneFor(project.category);
  const verification = project.verificationStatus ? VERIFICATION[project.verificationStatus] : undefined;

  // Activity: launchpad, reward and staking records that reference this project.
  const activity: {
    key: string;
    kind: string;
    kindClass: string;
    title: string;
    status: string;
    figure?: string;
    figureNote?: string;
    meta: string;
    href: string;
    date: string;
  }[] = [
    ...PRESALES.filter((r) => r.projectId === project.id).map((r) => ({
      key: `presale-${r.id}`,
      kind: "Presale",
      kindClass: "text-amber-400",
      title: r.title,
      status: r.status,
      figure: r.totalRaised,
      figureNote: r.hardCap ? `of ${r.hardCap}` : "raised",
      meta: r.network,
      href: `/launchpad/presales/${r.id}`,
      date: r.createdAt,
    })),
    ...FAIR_LAUNCHES.filter((r) => r.projectId === project.id).map((r) => ({
      key: `launch-${r.id}`,
      kind: "Fair launch",
      kindClass: "text-emerald-400",
      title: r.title,
      status: r.status,
      figure: r.totalRaised,
      figureNote: "raised",
      meta: r.network,
      href: `/launchpad/launches/${r.id}`,
      date: r.createdAt,
    })),
    ...AIRDROPS.filter((r) => r.projectId === project.id).map((r) => ({
      key: `airdrop-${r.id}`,
      kind: "Airdrop",
      kindClass: "text-rose-400",
      title: r.title,
      status: r.status,
      figure: r.totalReward,
      figureNote: "reward pool",
      meta: r.network,
      href: `/airdrops/campaigns/${r.id}`,
      date: r.createdAt,
    })),
    ...STAKING_POOLS.filter((r) => r.projectId === project.id).map((r) => ({
      key: `pool-${r.id}`,
      kind: "Staking pool",
      kindClass: "text-violet-400",
      title: r.name,
      status: r.status,
      figure: r.apy,
      figureNote: "APY",
      meta: `${r.network} · ${(r.lockPeriodDays ?? 0) > 0 ? `${r.lockPeriodDays} days lock` : "Flexible unlock"}`,
      href: `/staking/pools/${r.id}`,
      date: r.createdAt,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Networks: the project's ecosystem plus the network of each linked token.
  const networks = Array.from(
    new Set([project.ecosystem, ...linkedTokens.map((t) => t.network)].filter(Boolean) as string[])
  );

  const socialEntries = Object.entries(project.socialLinks ?? {});

  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Owner",
      value: (
        <span className="inline-flex items-center gap-1">
          <code className="font-mono text-foreground" title={project.ownerAddress}>
            {shortAddress(project.ownerAddress)}
          </code>
          <CopyButton value={project.ownerAddress} label="owner address" />
        </span>
      ),
    },
    { label: "Listed", value: <span className="font-mono text-foreground">{project.createdAt}</span> },
    { label: "Updated", value: <span className="font-mono text-foreground">{project.updatedAt}</span> },
    {
      label: "Linked tokens",
      value: <span className="font-mono text-foreground">{linkedTokens.length}</span>,
    },
  ];

  const sections = [
    { href: "#tokens", label: `Tokens & contracts (${linkedTokens.length})` },
    { href: "#activity", label: `Activity (${activity.length})` },
  ];

  return (
    <div className="mx-auto w-full max-w-none space-y-7 px-4 pb-20 pt-0 sm:px-6 lg:px-8 2xl:px-10">
      <ProjectSectionNav />
      <ProjectBreadcrumb current={project.name} />

      {/* 1. Identity hero: one surface, tinted by the project's category */}
      <header
        className={cn(
           "relative overflow-hidden border-b border-border/50 pb-8 pt-2 sm:pb-9",
          tone.glow
        )}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div
            aria-hidden="true"
            className={cn(
               "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br text-2xl font-bold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:h-24 sm:w-24 sm:text-3xl",
              tone.tile
            )}
          >
            {initialsOf(project.name)}
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                {project.category && <span className={cn("font-semibold uppercase tracking-wider", tone.text)}>{project.category}</span>}
                <StatusBadge status={project.status} />
                {verification && (
                  <span className={cn("inline-flex items-center gap-1.5 font-medium", verification.text)}>
                    <ShieldCheck className="h-3.5 w-3.5" /> {verification.label}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{project.name}</h1>
              {project.description && (
                <p className="max-w-5xl text-sm leading-relaxed text-muted-foreground sm:text-base">{project.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.websiteUrl && (
                <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
                  <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Official Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
              {linkedTokens[0] && (
                <Button asChild size="sm" variant="outline" className="h-9 border-border/60 text-xs">
                  <Link to={`/tokens/${linkedTokens[0].id}`}>
                    Inspect ${linkedTokens[0].symbol} <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/40 pt-5 text-xs sm:grid-cols-4 xl:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="space-y-1">
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* 2. Section anchors */}
      <nav
        aria-label="Project sections"
        className="sticky top-[84px] z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-border/50 bg-background/90 px-4 backdrop-blur-md sm:mx-0 sm:px-0"
      >
        {sections.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px] 2xl:gap-12">
        <div className="min-w-0 space-y-12">
          {/* Tokens & contracts */}
          <section id="tokens" className="scroll-mt-36 space-y-5">
            <div className="flex items-end justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <FileCode2 className="h-5 w-5 text-primary" /> Tokens &amp; contracts
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {linkedTokens.length} {linkedTokens.length === 1 ? "token" : "tokens"}
              </span>
            </div>

            {linkedTokens.length > 0 ? (
              <div className="divide-y divide-border/40 border-y border-border/40">
                {linkedTokens.map((t) => (
                  <article key={t.id} className="grid gap-5 py-6 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] xl:items-center">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary">
                          {t.symbol.charAt(0)}
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                          <p className="font-mono text-xs text-muted-foreground">${t.symbol}</p>
                        </div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-xs sm:grid-cols-2">
                      <Row label="Contract">
                        {t.contractAddress ? (
                          <span className="inline-flex min-w-0 items-center gap-1">
                            <code className="truncate font-mono text-foreground" title={t.contractAddress}>
                              {shortAddress(t.contractAddress)}
                            </code>
                            <CopyButton value={t.contractAddress} label={`${t.symbol} contract address`} />
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not deployed</span>
                        )}
                      </Row>
                      <Row label="Network">
                        <span className="inline-flex items-center gap-1.5 text-foreground">
                          <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", isSepolia(t.network) ? "bg-primary" : "bg-muted-foreground/50")} />
                          {t.network}
                        </span>
                      </Row>
                      <Row label="Standard">
                        <span className="text-foreground">{t.standard ?? "—"}</span>
                      </Row>
                      <Row label="Total supply">
                        <span className="font-mono text-foreground">{t.totalSupply ?? "—"}</span>
                      </Row>
                    </dl>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline" className="h-8 border-border/60 text-xs hover:border-primary">
                        <Link to={`/tokens/${t.id}`}>Inspect token</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-primary">
                        <Link to={`/tokens/${t.id}/contract`}>Contract details</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-primary">
                        <Link to={`/tokens/${t.id}/activity`}>Token activity</Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="border-y border-dashed border-border/60 py-10 text-center text-xs text-muted-foreground">
                No tokens currently associated with this project.
              </p>
            )}
          </section>

          {/* Activity */}
          <section id="activity" className="scroll-mt-36 space-y-5">
            <div className="flex items-end justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Activity className="h-5 w-5 text-primary" /> Launch, reward &amp; staking activity
              </h2>
              <span className="font-mono text-xs text-muted-foreground">{activity.length} records</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Records on the platform that reference this project, newest first.
            </p>

            {activity.length > 0 ? (
              <ol className="relative ml-1.5 space-y-0 border-l border-border/50">
                {activity.map((a) => (
                  <li key={a.key} className="relative pb-6 pl-7 last:pb-0">
                    <span aria-hidden className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-background ring-2 ring-primary/70" />
                    <Link to={a.href} className="group flex items-start justify-between gap-4 rounded-lg transition-colors">
                      <span className="min-w-0 space-y-1.5">
                        <span className="flex flex-wrap items-center gap-2.5">
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", a.kindClass)}>{a.kind}</span>
                          <StatusBadge status={a.status} />
                          <span className="font-mono text-[11px] text-muted-foreground">{a.date}</span>
                        </span>
                        <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {a.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{a.meta}</span>
                      </span>
                      {a.figure && (
                        <span className="shrink-0 text-right">
                          <span className="block font-mono text-sm font-semibold text-foreground">{a.figure}</span>
                          <span className="block text-[11px] text-muted-foreground">{a.figureNote}</span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="border-y border-dashed border-border/60 py-10 text-center text-xs text-muted-foreground">
                No presale, fair launch, airdrop or staking records reference this project yet.
              </p>
            )}
          </section>
        </div>

        {/* 3. Side rail */}
        <aside className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:sticky xl:top-32 xl:grid-cols-1 xl:self-start">
          <section aria-labelledby="verification-heading" className="space-y-3">
            <h2 id="verification-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verification
            </h2>
            {verification ? (
              <div className={cn("space-y-2 rounded-2xl border p-4", verification.cls)}>
                <div className={cn("flex items-center gap-2 text-sm font-semibold", verification.text)}>
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  {verification.label}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{verification.description}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No verification information is recorded for this project.</p>
            )}
          </section>

          <section aria-labelledby="networks-heading" className="space-y-3">
            <h2 id="networks-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Networks
            </h2>
            {networks.length > 0 ? (
              <ul className="divide-y divide-border/40 text-xs">
                {networks.map((n) => (
                  <li key={n} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-foreground">{n}</span>
                    {isSepolia(n) ? (
                      <span className="font-mono text-[11px] text-primary">Supported · D-04</span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Catalog origin</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No network information is recorded.</p>
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
              Per D-04, Ethereum Sepolia (11155111) is the only supported wallet network. Other networks reflect protocol
              origin and do not imply wallet or transaction support.
            </p>
          </section>

          <section aria-labelledby="links-heading" className="space-y-3">
            <h2 id="links-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Links
            </h2>
            {project.websiteUrl || socialEntries.length > 0 ? (
              <ul className="divide-y divide-border/40 text-xs">
                {project.websiteUrl && (
                  <li>
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 py-2.5 text-foreground transition-colors hover:text-primary"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{project.websiteUrl.replace(/^https?:\/\//, "")}</span>
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </li>
                )}
                {socialEntries.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 py-2.5 capitalize text-foreground transition-colors hover:text-primary"
                    >
                      <span>{name}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No links are listed for this project.</p>
            )}
          </section>

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              Demonstration data: project details, verification tiers and linked records are simulated for Phase 1.
            </span>
          </p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 border-b border-border/30 pb-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
