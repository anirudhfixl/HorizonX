"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { MOCK_PRESALES, MOCK_FAIR_LAUNCHES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowRight, Plus, Rocket, Scale, Info } from "lucide-react";

// ---------------------------------------------------------------------------
// Data shaping (pure; every figure comes from a stored presale / fair launch
// record — nothing is aggregated across different networks or units)
// ---------------------------------------------------------------------------

export type LaunchKind = "presale" | "fair";

export interface Amount {
  value: number;
  unit: string;
}

export interface LaunchEntry {
  kind: LaunchKind;
  id: string;
  title: string;
  tokenId: string;
  network: string;
  status: string;
  startTime?: string;
  endTime?: string;
  raised: Amount | null;
  hardCap: Amount | null;
  softCap: Amount | null;
  allocation?: string;
  participants?: number;
  href: string;
}

export function parseAmount(raw?: string): Amount | null {
  if (!raw) return null;
  const m = raw.trim().match(/^([0-9][0-9,]*(?:\.[0-9]+)?)\s*([A-Za-z]+)?$/);
  if (!m) return null;
  const value = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  return { value, unit: m[2] || "" };
}

export function buildLaunchEntries(): LaunchEntry[] {
  const presales: LaunchEntry[] = MOCK_PRESALES.map((p) => ({
    kind: "presale",
    id: p.id,
    title: p.title,
    tokenId: p.tokenId,
    network: p.network,
    status: p.status,
    startTime: p.startTime,
    endTime: p.endTime,
    raised: parseAmount(p.totalRaised),
    hardCap: parseAmount(p.hardCap),
    softCap: parseAmount(p.softCap),
    participants: p.participantCount,
    href: `/launchpad/presales/${p.id}`,
  }));
  const fair: LaunchEntry[] = MOCK_FAIR_LAUNCHES.map((f) => ({
    kind: "fair",
    id: f.id,
    title: f.title,
    tokenId: f.tokenId,
    network: f.network,
    status: f.status,
    startTime: f.startTime,
    endTime: f.endTime,
    raised: parseAmount(f.totalRaised),
    hardCap: null,
    softCap: parseAmount(f.softCap),
    allocation: f.totalSelling,
    participants: f.participantCount,
    href: `/launchpad/launches/${f.id}`,
  }));
  return [...presales, ...fair];
}

/** Bar fill and soft-cap marker (both 0–1), or null when the record cannot support a bar. */
export function progressFor(e: LaunchEntry): { fill: number; marker: number | null; label: string } | null {
  if (!e.raised) return null;
  const unit = e.raised.unit;
  const fmt = (a: Amount) => `${a.value.toLocaleString("en-US")}${a.unit ? ` ${a.unit}` : ""}`;
  if (e.hardCap && e.hardCap.unit === unit && e.hardCap.value > 0) {
    const fill = Math.min(e.raised.value / e.hardCap.value, 1);
    const marker = e.softCap && e.softCap.unit === unit ? Math.min(e.softCap.value / e.hardCap.value, 1) : null;
    return { fill, marker, label: `${fmt(e.raised)} of ${fmt(e.hardCap)} hard cap` };
  }
  if (e.softCap && e.softCap.unit === unit && e.softCap.value > 0) {
    const scale = Math.max(e.raised.value, e.softCap.value);
    return {
      fill: e.raised.value / scale,
      marker: e.softCap.value / scale,
      label: `${fmt(e.raised)} raised · soft cap ${fmt(e.softCap)}`,
    };
  }
  return null;
}

export function softCapMet(e: LaunchEntry): boolean | null {
  if (!e.raised || !e.softCap || e.raised.unit !== e.softCap.unit) return null;
  return e.raised.value >= e.softCap.value;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed UTC formatting so server and client render identically. */
export function formatUtc(iso?: string, withTime = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  if (!withTime) return date;
  return `${date}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

const time = (s?: string) => (s ? new Date(s).getTime() : Number.MAX_SAFE_INTEGER);

export interface LaunchGroups {
  live: LaunchEntry[];
  upcoming: LaunchEntry[];
  drafts: LaunchEntry[];
  concluded: LaunchEntry[];
}

export function groupLaunches(entries: LaunchEntry[]): LaunchGroups {
  return {
    live: entries.filter((e) => e.status === "live").sort((a, b) => time(a.endTime) - time(b.endTime)),
    upcoming: entries.filter((e) => e.status === "scheduled").sort((a, b) => time(a.startTime) - time(b.startTime)),
    drafts: entries.filter((e) => e.status === "draft").sort((a, b) => time(a.startTime) - time(b.startTime)),
    concluded: entries
      .filter((e) => ["ended", "finalized", "failed", "cancelled"].includes(e.status))
      .sort((a, b) => time(b.endTime) - time(a.endTime)),
  };
}

// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

const KIND_LABEL: Record<LaunchKind, string> = { presale: "Presale", fair: "Fair launch" };

function KindTag({ kind }: { kind: LaunchKind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        kind === "presale" ? "bg-primary/15 text-primary" : "bg-sky-500/15 text-sky-400"
      )}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

function ProgressBar({ entry }: { entry: LaunchEntry }) {
  const p = progressFor(entry);
  if (!p) return <p className="text-xs text-muted-foreground">Raise figures not recorded.</p>;
  return (
    <div className="space-y-1.5">
      <div
        className="relative h-1.5 w-full rounded-full bg-secondary"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p.fill * 100)}
        aria-label={`${entry.title}: ${p.label}`}
      >
        <div
          className={cn("h-full rounded-full", entry.kind === "presale" ? "bg-primary" : "bg-sky-400")}
          style={{ width: `${p.fill * 100}%` }}
        />
        {p.marker !== null && (
          <span
            className="absolute -top-1 h-3.5 w-px bg-foreground/60"
            style={{ left: `${p.marker * 100}%` }}
            title="Soft cap"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">{p.label}</p>
    </div>
  );
}

function LiveRow({ e }: { e: LaunchEntry }) {
  return (
    <li>
      <Link
        href={e.href}
        className="group grid gap-x-8 gap-y-3 py-5 transition-colors hover:bg-foreground/[0.03] sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center sm:px-3 sm:-mx-3 rounded-lg"
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <KindTag kind={e.kind} />
            <StatusBadge status={e.status} />
          </div>
          <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">{e.title}</h3>
          <p className="font-mono text-xs text-muted-foreground">
            {e.tokenId.toUpperCase()} · {e.network}
            {e.allocation ? ` · ${e.allocation}` : ""}
          </p>
        </div>
        <div className="space-y-2">
          <ProgressBar entry={e} />
          <p className="text-xs text-muted-foreground">
            Closes {formatUtc(e.endTime)}
            {typeof e.participants === "number" ? ` · ${e.participants.toLocaleString("en-US")} participants recorded` : ""}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary sm:justify-end">
          {e.kind === "presale" ? "Participate" : "View details"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}

function ScheduleRow({ e, draft }: { e: LaunchEntry; draft?: boolean }) {
  return (
    <li>
      <Link
        href={e.href}
        className="group grid grid-cols-[88px_minmax(0,1fr)] gap-x-5 gap-y-1 py-3.5 transition-colors hover:bg-foreground/[0.03] sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center sm:px-3 sm:-mx-3 rounded-lg"
      >
        <div className="font-mono text-xs text-muted-foreground">
          <div className="text-foreground">{formatUtc(e.startTime, false)}</div>
          <div>{draft ? "Planned start" : "Opens"}</div>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <KindTag kind={e.kind} />
            {draft && <StatusBadge status="draft" />}
          </div>
          <div className="mt-1 truncate text-sm font-semibold text-foreground group-hover:text-primary">{e.title}</div>
          <div className="font-mono text-xs text-muted-foreground">
            {e.tokenId.toUpperCase()} · {e.network} · closes {formatUtc(e.endTime, false)}
          </div>
        </div>
        <div className="col-start-2 font-mono text-xs text-muted-foreground sm:col-start-auto sm:text-right">
          {e.kind === "presale"
            ? e.hardCap
              ? `Hard cap ${e.hardCap.value.toLocaleString("en-US")} ${e.hardCap.unit}`.trim()
              : "Hard cap not recorded"
            : e.softCap
            ? `Soft cap ${e.softCap.value.toLocaleString("en-US")} ${e.softCap.unit}`.trim()
            : "Soft cap not recorded"}
        </div>
      </Link>
    </li>
  );
}

function ConcludedRow({ e }: { e: LaunchEntry }) {
  const met = softCapMet(e);
  return (
    <li>
      <Link
        href={e.href}
        className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 transition-colors hover:bg-foreground/[0.03] sm:grid-cols-[minmax(0,1.4fr)_120px_minmax(0,1fr)_110px] sm:px-3 sm:-mx-3 rounded-lg"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <KindTag kind={e.kind} />
            <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">{e.title}</span>
          </div>
        </div>
        <div className="justify-self-end sm:justify-self-auto">
          <StatusBadge status={e.status} />
        </div>
        <div className="col-span-2 font-mono text-xs text-muted-foreground sm:col-span-1">
          {e.raised ? `${e.raised.value.toLocaleString("en-US")} ${e.raised.unit}`.trim() : "—"} raised
          {met === null ? "" : met ? " · soft cap met" : " · soft cap not met"}
        </div>
        <div className="hidden text-right font-mono text-xs text-muted-foreground sm:block">
          Closed {formatUtc(e.endTime, false)}
        </div>
      </Link>
    </li>
  );
}

function SectionHead({ id, title, note, count }: { id: string; title: string; note?: string; count?: number }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border/60 pb-3">
      <h2 id={id} className="text-lg font-semibold tracking-tight text-foreground">
        {title}
        {typeof count === "number" && <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">{count}</span>}
      </h2>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

type Filter = "all" | LaunchKind;

export function LaunchpadHub() {
  const [filter, setFilter] = useState<Filter>("all");
  const all = buildLaunchEntries();
  const visible = filter === "all" ? all : all.filter((e) => e.kind === filter);
  const g = groupLaunches(visible);
  const count = (k: LaunchKind, pred: (e: LaunchEntry) => boolean) => all.filter((e) => e.kind === k && pred(e)).length;
  const live = (e: LaunchEntry) => e.status === "live";
  const sched = (e: LaunchEntry) => e.status === "scheduled";

  const filters: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "All launches", n: all.length },
    { key: "presale", label: "Presales", n: all.filter((e) => e.kind === "presale").length },
    { key: "fair", label: "Fair launches", n: all.filter((e) => e.kind === "fair").length },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Masthead */}
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Launchpad</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Launch a token. <span className="text-muted-foreground">Or join one.</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The entry point for ProMiners presales and fair launches: browse what is open, see what is scheduled, or set up
            a new launch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild variant="outline" size="lg" className="h-10 px-4 text-sm">
            <Link href="/launchpad/launches/create">Create Fair Launch</Link>
          </Button>
          <Button asChild size="lg" className="h-10 gap-1.5 bg-primary px-4 text-sm font-semibold text-primary-foreground">
            <Link href="/launchpad/presales/create">
              <Plus className="h-4 w-4" /> Create Presale
            </Link>
          </Button>
        </div>
      </header>

      {/* Status strip — counts from stored records, no totals across networks */}
      <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-border/60 py-3 font-mono text-xs text-muted-foreground">
        <span>
          <span className="text-emerald-400">{all.filter(live).length} live</span>
        </span>
        <span>{all.filter(sched).length} scheduled</span>
        <span>{all.filter((e) => e.status === "draft").length} drafts</span>
        <span>
          {all.filter((e) => ["ended", "finalized", "failed", "cancelled"].includes(e.status)).length} concluded
        </span>
        <span className="text-muted-foreground/70">· sample catalog records</span>
      </p>

      {/* Two paths */}
      <section aria-labelledby="paths-title" className="mt-14">
        <h2 id="paths-title" className="sr-only">
          Choose a launch type
        </h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border/60">
          <div className="space-y-5 md:pr-12">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Rocket className="h-4 w-4" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Presales</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A capped raise. Each presale record carries a soft cap, a hard cap and minimum and maximum contribution
              limits.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {count("presale", live)} live · {count("presale", sched)} scheduled ·{" "}
              {count("presale", (e) => e.status === "draft")} draft
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link href="/launchpad/presales" className="inline-flex items-center gap-1 text-primary hover:underline">
                Browse presales <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/launchpad/presales/create" className="text-foreground/80 hover:text-foreground hover:underline">
                Create a presale
              </Link>
            </div>
          </div>
          <div className="space-y-5 md:pl-12">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                <Scale className="h-4 w-4" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Fair launches</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A launch of a stated token allocation. Each fair launch record carries the total tokens for sale and a soft
              cap; no hard cap is recorded.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {count("fair", live)} live · {count("fair", sched)} scheduled · {count("fair", (e) => e.status === "draft")}{" "}
              draft
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link href="/launchpad/launches" className="inline-flex items-center gap-1 text-primary hover:underline">
                Browse fair launches <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/launchpad/launches/create" className="text-foreground/80 hover:text-foreground hover:underline">
                Create a fair launch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Launch board */}
      <section aria-label="Launch board" className="mt-20">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Launch board</h2>
          <div role="group" aria-label="Filter by launch type" className="inline-flex rounded-lg bg-secondary/60 p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  filter === f.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label} <span className="ml-1 font-mono text-[10px] opacity-70">{f.n}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-14">
          <div>
            <SectionHead id="board-live" title="Live now" count={g.live.length} note="Soonest closing first. Dates are the stored UTC close times." />
            {g.live.length ? (
              <ul className="divide-y divide-border/50">
                {g.live.map((e) => (
                  <LiveRow key={e.id} e={e} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">No live launches of this type in the catalog.</p>
            )}
          </div>

          <div>
            <SectionHead id="board-upcoming" title="Scheduled" count={g.upcoming.length} note="By opening date." />
            {g.upcoming.length ? (
              <ul className="divide-y divide-border/50">
                {g.upcoming.map((e) => (
                  <ScheduleRow key={e.id} e={e} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">Nothing scheduled for this type.</p>
            )}
          </div>

          {g.drafts.length > 0 && (
            <div>
              <SectionHead id="board-drafts" title="Drafts" count={g.drafts.length} note="Not open. Start dates are planned, not committed." />
              <ul className="divide-y divide-border/50">
                {g.drafts.map((e) => (
                  <ScheduleRow key={e.id} e={e} draft />
                ))}
              </ul>
            </div>
          )}

          <div>
            <SectionHead id="board-concluded" title="Concluded" count={g.concluded.length} note="Most recently closed first." />
            {g.concluded.length ? (
              <ul className="divide-y divide-border/50">
                {g.concluded.map((e) => (
                  <ConcludedRow key={e.id} e={e} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">No concluded launches of this type.</p>
            )}
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <div className="mt-16 flex items-start gap-3 border-l-2 border-primary/60 pl-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Sample data. </span>
          Every figure on this page comes from the demonstration catalog, not from a blockchain. Raised amounts and
          participant counts are stored record values, shown per launch in the unit they were recorded in; they are not
          added together. Some records name networks other than Ethereum Sepolia; under Architecture Decision D-04 only
          Sepolia transactions are supported. Launch pages and creation flows are simulations unless stated otherwise.
        </p>
      </div>
    </div>
  );
}
