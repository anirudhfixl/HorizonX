"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/projects/copy-button";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Wallet,
  ChevronLeft,
  ShieldCheck,
  Check,
  Circle,
  ExternalLink,
  ArrowUpRight,
  Info,
} from "lucide-react";

type Project = (typeof MOCK_PROJECTS)[number];

const VERIFICATION_LABELS: Record<string, { label: string; text: string }> = {
  audit_available: { label: "Audit available", text: "text-emerald-400" },
  contract_source_verified: { label: "Source code verified", text: "text-cyan-400" },
  project_reviewed: { label: "Project reviewed", text: "text-primary" },
  not_reviewed: { label: "Not reviewed", text: "text-muted-foreground" },
};

/**
 * Projects owned by a wallet. Catalog owners are stored either as full addresses or in the
 * shortened "0x1234...abcd" form, so both are compared case-insensitively.
 */
function resolveOwnedProjects(projects: Project[], address?: string | null): Project[] {
  if (!address) return [];
  const full = address.toLowerCase();
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`.toLowerCase();
  return projects.filter((p) => {
    const owner = p.ownerAddress.toLowerCase();
    return owner === full || owner === short;
  });
}

function initialsOf(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

export default function MyProjectsPage() {
  const { isConnected, address, shortAddress } = useWallet();
  const { openModal } = useModal();

  const owned = useMemo(() => resolveOwnedProjects(MOCK_PROJECTS, address), [address]);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Projects
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Owner workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">My Projects</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Manage your verified project identity, linked token contracts, and developer credentials.
            </p>
          </div>

          {isConnected && address && (
            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Signed in as</div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />
                <code className="font-mono text-sm text-foreground" title={address}>
                  {shortAddress ?? address}
                </code>
                <CopyButton value={address} label="wallet address" />
              </div>
            </div>
          )}
        </div>
      </header>

      {!isConnected ? (
        <WalletGate onConnect={() => openModal("CONNECT_WALLET")} />
      ) : owned.length === 0 ? (
        <NoProjects />
      ) : (
        <section aria-label="Your projects" className="space-y-2">
          <div className="flex items-end justify-between gap-3 border-b border-border/50 pb-3">
            <h2 className="text-lg font-bold text-foreground">Registered to this wallet</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {owned.length} {owned.length === 1 ? "project" : "projects"}
            </span>
          </div>
          <ul className="divide-y divide-border/40">
            {owned.map((p) => (
              <OwnedProject key={p.id} project={p} />
            ))}
          </ul>
        </section>
      )}

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          Demonstration data: project ownership, status and verification are read from the simulated Phase 1 catalog.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

function WalletGate({ onConnect }: { onConnect: () => void }) {
  return (
    <section
      aria-labelledby="gate-heading"
      className="grid grid-cols-1 gap-10 rounded-3xl bg-gradient-to-br from-primary/10 via-card/40 to-transparent p-6 ring-1 ring-border/60 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
    >
      <div className="space-y-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Wallet className="h-7 w-7" />
        </span>
        <div className="space-y-3">
          <h2 id="gate-heading" className="text-2xl font-bold text-foreground sm:text-3xl">
            Connect Your Wallet
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Connect your Web3 address to access your registered projects and developer permissions.
          </p>
        </div>
        <Button onClick={onConnect} className="h-10 gap-2 bg-primary text-xs font-semibold text-primary-foreground">
          <Wallet className="h-4 w-4" /> Connect Wallet
        </Button>
      </div>

      <div className="space-y-4 lg:border-l lg:border-border/40 lg:pl-12">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          What this workspace shows
        </h3>
        <ol className="divide-y divide-border/40 text-sm">
          {[
            ["Ownership", "Projects registered to your connected wallet address."],
            ["Status", "Whether each project is active or pending."],
            ["Verification", "The verification tier recorded for each project."],
            ["Linked tokens", "Token contracts attached to each project."],
          ].map(([title, text], i) => (
            <li key={title} className="flex gap-4 py-3">
              <span className="w-5 pt-0.5 font-mono text-xs text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-semibold text-foreground">{title}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function NoProjects() {
  return (
    <section
      aria-labelledby="empty-heading"
      className="grid grid-cols-1 gap-10 rounded-3xl bg-gradient-to-br from-primary/10 via-card/40 to-transparent p-6 ring-1 ring-border/60 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
    >
      <div className="space-y-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Briefcase className="h-7 w-7" />
        </span>
        <div className="space-y-3">
          <h2 id="empty-heading" className="text-2xl font-bold text-foreground sm:text-3xl">
            No Registered Projects
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            You haven&apos;t registered any Web3 projects with this wallet address yet.
          </p>
        </div>
        <Button asChild className="h-10 gap-2 bg-primary text-xs font-semibold text-primary-foreground">
          <Link href="/tokens/create">
            <Plus className="h-4 w-4" /> Create a Token &amp; Project
          </Link>
        </Button>
      </div>

      <div className="space-y-2 lg:border-l lg:border-border/40 lg:pl-12">
        <h3 className="pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Meanwhile
        </h3>
        <ul className="divide-y divide-border/40 text-sm">
          {[
            ["/projects", "Browse the project directory", "See how other projects are listed."],
            ["/tokens/my", "Review your tokens", "Tokens created with this wallet."],
          ].map(([href, title, text]) => (
            <li key={href}>
              <Link href={href} className="group flex items-center justify-between gap-4 py-3.5">
                <span>
                  <span className="block font-semibold text-foreground transition-colors group-hover:text-primary">{title}</span>
                  <span className="block text-xs text-muted-foreground">{text}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Owned project row                                                   */
/* ------------------------------------------------------------------ */

function OwnedProject({ project }: { project: Project }) {
  const linkedTokens = MOCK_TOKENS.filter((t) => project.tokenIds?.includes(t.id));
  const verification = project.verificationStatus ? VERIFICATION_LABELS[project.verificationStatus] : undefined;

  // Listing completeness: derived only from fields that exist on the record.
  const checks: { label: string; done: boolean }[] = [
    { label: "Description", done: Boolean(project.description?.trim()) },
    { label: "Category", done: Boolean(project.category) },
    { label: "Ecosystem", done: Boolean(project.ecosystem) },
    { label: "Website", done: Boolean(project.websiteUrl) },
    { label: "Social links", done: Object.keys(project.socialLinks ?? {}).length > 0 },
    { label: "Linked token", done: linkedTokens.length > 0 },
  ];
  const doneCount = checks.filter((c) => c.done).length;

  return (
    <li className="space-y-8 py-10">
      {/* Identity + status */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/30 to-primary/5 text-xl font-bold text-foreground"
          >
            {initialsOf(project.name)}
          </span>
          <div className="min-w-0 space-y-1.5">
            <h3 className="truncate text-2xl font-bold text-foreground">{project.name}</h3>
            <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              {project.category && <span className="font-semibold text-primary">{project.category}</span>}
              {project.category && project.ecosystem && <span aria-hidden>·</span>}
              {project.ecosystem && <span>{project.ecosystem}</span>}
            </p>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Submission */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Submission</h4>
          <dl className="space-y-2 text-xs">
            <Line label="Status">
              <span className="capitalize text-foreground">{project.status}</span>
            </Line>
            <Line label="Listed">
              <span className="font-mono text-foreground">{project.createdAt}</span>
            </Line>
            <Line label="Last updated">
              <span className="font-mono text-foreground">{project.updatedAt}</span>
            </Line>
          </dl>
        </div>

        {/* Verification */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Verification</h4>
          {verification ? (
            <p className={cn("flex items-center gap-2 text-sm font-semibold", verification.text)}>
              <ShieldCheck className="h-5 w-5" /> {verification.label}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No verification tier is recorded.</p>
          )}
        </div>

        {/* Completeness */}
        <div className="space-y-3">
          <h4 className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Listing completeness</span>
            <span className="font-mono normal-case text-foreground">
              {doneCount}/{checks.length}
            </span>
          </h4>
          <div
            role="progressbar"
            aria-label={`${project.name} listing completeness`}
            aria-valuemin={0}
            aria-valuemax={checks.length}
            aria-valuenow={doneCount}
            className="h-1.5 overflow-hidden rounded-full bg-secondary/80"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${(doneCount / checks.length) * 100}%` }} />
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {checks.map((c) => (
              <li key={c.label} className={cn("flex items-center gap-1.5", c.done ? "text-foreground" : "text-muted-foreground/60")}>
                {c.done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Circle className="h-3 w-3" />}
                <span className="sr-only">{c.done ? "Complete: " : "Missing: "}</span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Linked tokens */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Linked tokens ({linkedTokens.length})
        </h4>
        {linkedTokens.length > 0 ? (
          <ul className="divide-y divide-border/40 border-y border-border/40">
            {linkedTokens.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
                <span className="min-w-0">
                  <span className="font-semibold text-foreground">{t.name}</span>{" "}
                  <span className="font-mono text-muted-foreground">${t.symbol} · {t.network}</span>
                </span>
                <span className="flex items-center gap-3">
                  <StatusBadge status={t.status} />
                  <Link href={`/tokens/${t.id}`} className="font-semibold text-primary hover:underline">
                    Inspect
                  </Link>
                  <Link href={`/tokens/${t.id}/contract`} className="text-muted-foreground hover:text-primary">
                    Contract
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-y border-dashed border-border/60 py-5 text-center text-xs text-muted-foreground">
            No tokens currently associated with this project.
          </p>
        )}
      </div>

      {/* Actions: only routes that exist */}
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground">
          <Link href={`/projects/${project.id}`}>
            View public profile <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-9 border-border/60 text-xs">
          <Link href="/tokens/my">My tokens</Link>
        </Button>
        {project.websiteUrl && (
          <Button asChild size="sm" variant="ghost" className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-primary">
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
              Official website <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </li>
  );
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/30 pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
