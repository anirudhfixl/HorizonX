import "@/components/launchpad/launchpad.css";
import React, { useState, useMemo, useSyncExternalStore } from "react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PRESALES, FAIR_LAUNCHES } from "@/data";
import { readSessionLaunchesRaw, subscribeSessionLaunches, sessionPresaleToPresale, sessionFairLaunchToFairLaunch } from "@/lib/launch-storage";
import type { Presale, FairLaunch } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Plus,
  Rocket,
  Scale,
  Search,
  X,
  SearchX,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LaunchpadWorkspaceHeader } from "@/components/launchpad/launchpad-section-nav";

import type { PointerEvent as ReactPointerEvent } from "react";

function handleLaunchCardPointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateX = (0.5 - y) * 8;
  const rotateY = (x - 0.5) * 8;
  card.style.setProperty("--lp-tilt-x", `${rotateX.toFixed(2)}deg`);
  card.style.setProperty("--lp-tilt-y", `${rotateY.toFixed(2)}deg`);
  card.style.setProperty("--lp-tilt-glare-x", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--lp-tilt-glare-y", `${(y * 100).toFixed(1)}%`);
}

function handleLaunchCardPointerLeave(event: ReactPointerEvent<HTMLAnchorElement>) {
  const card = event.currentTarget;
  card.style.setProperty("--lp-tilt-x", "0deg");
  card.style.setProperty("--lp-tilt-y", "0deg");
  card.style.setProperty("--lp-tilt-glare-x", "50%");
  card.style.setProperty("--lp-tilt-glare-y", "50%");
}

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
  description?: string;
  category?: string;
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

export function buildLaunchEntries(
  presalesList: Presale[] = PRESALES,
  fairList: FairLaunch[] = FAIR_LAUNCHES
): LaunchEntry[] {
  const presales: LaunchEntry[] = presalesList.map((p) => ({
    kind: "presale",
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
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
  const fair: LaunchEntry[] = fairList.map((f) => ({
    kind: "fair",
    id: f.id,
    title: f.title,
    description: f.description,
    category: f.category,
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

export function isSepoliaNetwork(network: string): boolean {
  const n = network.toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
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

function NetworkChip({ network }: { network: string }) {
  const ok = isSepoliaNetwork(network);
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px]",
        ok ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
      )}
      title={ok ? "D-04 approved network (11155111)" : "Catalog origin — not an active network per D-04"}
    >
      {network}
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
        to={e.href}
        className="group grid min-w-0 gap-x-6 gap-y-3 rounded-lg px-3 py-4 transition-colors hover:bg-foreground/[0.035] sm:-mx-3 sm:grid-cols-[minmax(250px,1.25fr)_minmax(220px,1fr)_minmax(120px,.55fr)] sm:items-center lg:grid-cols-[minmax(280px,1.35fr)_minmax(260px,1.15fr)_minmax(130px,.55fr)]"
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <KindTag kind={e.kind} />
            <StatusBadge status={e.status} />
            <ProvenanceBadge kind={e.id.startsWith("session-") ? "session" : "catalog"} />
            <NetworkChip network={e.network} />
          </div>
          <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">{e.title}</h3>
          <p className="font-mono text-xs text-muted-foreground">
            {e.tokenId.toUpperCase()}
            {e.allocation ? ` · ${e.allocation}` : ""}
            {e.category ? ` · ${e.category}` : ""}
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
  const cap = e.kind === "presale" ? e.hardCap : e.softCap;
  const capLabel = e.kind === "presale" ? "Hard cap" : "Soft cap";
  const capValue = cap ? `${cap.value.toLocaleString("en-US")} ${cap.unit}`.trim() : "Not recorded";

  return (
    <li>
      <Link
        to={e.href}
        className="lp-draft-card group grid min-w-0 gap-4 rounded-xl border border-border/70 bg-card/35 p-4 transition-all duration-200 hover:-translate-y-px hover:border-primary/45 hover:bg-card/65 hover:shadow-[0_12px_28px_rgba(0,0,0,.14)] sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-center lg:gap-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden w-[92px] shrink-0 flex-col border-r border-border/70 pr-4 sm:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Planned start</span>
            <span className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{formatUtc(e.startTime, false)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <KindTag kind={e.kind} />
              {draft && <StatusBadge status="draft" />}
              <ProvenanceBadge kind={e.id.startsWith("session-") ? "session" : "catalog"} />
              <NetworkChip network={e.network} />
            </div>
            <h3 className="mt-2 truncate text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">{e.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <span className="font-mono font-medium text-foreground/80">{e.tokenId.toUpperCase()}</span>
              {e.category ? ` · ${e.category}` : ""}
              <span className="sm:hidden"> · Planned {formatUtc(e.startTime, false)}</span>
            </p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-3 border-t border-border/60 pt-3 sm:gap-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[.15em] text-muted-foreground">{capLabel}</p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{capValue}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[.15em] text-muted-foreground">Closes</p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{formatUtc(e.endTime, false)}</p>
          </div>
          <span className="col-span-2 inline-flex items-center justify-end gap-1 text-xs font-semibold text-primary">Open draft <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </Link>
    </li>
  );
}

function ConcludedRow({ e }: { e: LaunchEntry }) {
  const met = softCapMet(e);
  const outcome = met === null ? "Outcome not recorded" : met ? "Soft cap met" : "Soft cap not met";
  return (
    <li>
      <Link
        to={e.href}
        className="lp-concluded-row group grid min-w-0 gap-3 rounded-xl border border-border/60 bg-card/25 px-4 py-3.5 transition-all duration-200 hover:border-primary/40 hover:bg-card/55 sm:px-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(110px,.55fr)_minmax(170px,.8fr)_minmax(130px,.6fr)] lg:items-center lg:gap-5"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <KindTag kind={e.kind} />
            <StatusBadge status={e.status} />
            <ProvenanceBadge kind={e.id.startsWith("session-") ? "session" : "catalog"} />
            <NetworkChip network={e.network} />
          </div>
          <h3 className="mt-2 truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">{e.title}</h3>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{e.category || "Launch record"} <span className="px-1 text-border">·</span> <span className="font-mono">{e.tokenId.toUpperCase()}</span></p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:block">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Raised</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{e.raised ? `${e.raised.value.toLocaleString("en-US")} ${e.raised.unit}`.trim() : "—"}</p>
          </div>
          <div className="lg:hidden">
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Closed</p>
            <p className="mt-1 text-xs font-medium text-foreground">{formatUtc(e.endTime, false)}</p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", met === true ? "bg-emerald-400" : met === false ? "bg-amber-400" : "bg-muted-foreground/60")} />
          <span className="truncate">{outcome}</span>
        </div>
        <div className="hidden items-center justify-between gap-3 lg:flex">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Closed</p>
            <p className="mt-1 truncate text-xs font-medium text-foreground">{formatUtc(e.endTime, false)}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-primary lg:hidden">View record <ArrowRight className="h-3.5 w-3.5" /></span>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [liveOnly, setLiveOnly] = useState(false);
  const [sepoliaOnly, setSepoliaOnly] = useState(false);

  const sessionRaw = useSyncExternalStore(subscribeSessionLaunches, readSessionLaunchesRaw, () => "");
  const all = useMemo(() => {
    let extraPresales: Presale[] = [];
    let extraFair: FairLaunch[] = [];
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        if (Array.isArray(parsed)) {
          extraPresales = parsed.filter((l: { kind: string }) => l.kind === "presale").map(sessionPresaleToPresale);
          extraFair = parsed.filter((l: { kind: string }) => l.kind === "fair").map(sessionFairLaunchToFairLaunch);
        }
      } catch {
        // ignore
      }
    }
    return buildLaunchEntries([...extraPresales, ...PRESALES], [...extraFair, ...FAIR_LAUNCHES]);
  }, [sessionRaw]);

  // Filter pipeline
  const visible = useMemo(() => {
    return all.filter((e) => {
      // 1. Kind filter
      if (filter !== "all" && e.kind !== filter) return false;

      // 2. Preset: Live only
      if (liveOnly && e.status !== "live") return false;

      // 3. Preset: Sepolia only
      if (sepoliaOnly && !isSepoliaNetwork(e.network)) return false;

      // 4. Network dropdown
      if (networkFilter === "sepolia") {
        if (!isSepoliaNetwork(e.network)) return false;
      } else if (networkFilter !== "all") {
        if (e.network.toLowerCase() !== networkFilter.toLowerCase()) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchToken = e.tokenId.toLowerCase().includes(q);
        const matchDesc = e.description?.toLowerCase().includes(q) ?? false;
        const matchCat = e.category?.toLowerCase().includes(q) ?? false;
        const matchNet = e.network.toLowerCase().includes(q);
        if (!matchTitle && !matchToken && !matchDesc && !matchCat && !matchNet) {
          return false;
        }
      }

      return true;
    });
  }, [all, filter, liveOnly, sepoliaOnly, networkFilter, searchQuery]);

  const g = useMemo(() => groupLaunches(visible), [visible]);

  const hasActiveFilters =
    filter !== "all" ||
    searchQuery.trim().length > 0 ||
    networkFilter !== "all" ||
    liveOnly ||
    sepoliaOnly;

  const handleResetFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setNetworkFilter("all");
    setLiveOnly(false);
    setSepoliaOnly(false);
  };

  return (
    <div className="launchpad-page mx-auto w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 lg:py-12">
      <LaunchpadWorkspaceHeader items={[{ label: "Launchpad", to: "/launchpad" }, { label: "Overview" }]} />

      <div className="mt-8 space-y-10 lg:space-y-12">
      {/* Overview masthead + campaign pipeline */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] xl:items-stretch">
        <div className="flex min-w-0 flex-col justify-between gap-7 py-2">
          <div className="space-y-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Launchpad overview</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-5xl xl:text-[3.65rem]">
              Launch a token. <span className="text-muted-foreground">Or join one.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Discover active presales and fair launches, track upcoming windows, and manage your own launches from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-4 border-t border-border/60 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">●</span>
              <div><p className="text-sm font-semibold text-foreground">Live launches</p><p className="text-xs text-muted-foreground">Open for participation</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">↗</span>
              <div><p className="text-sm font-semibold text-foreground">Upcoming windows</p><p className="text-xs text-muted-foreground">See what opens next</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/10 text-sky-400">⌕</span>
              <div><p className="text-sm font-semibold text-foreground">Launch discovery</p><p className="text-xs text-muted-foreground">Compare both launch types</p></div>
            </div>
          </div>
        </div>

        <aside className="min-w-0 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Campaign pipeline</p>
            <span className="text-[10px] text-muted-foreground">Catalog + session records</span>
          </div>
          <div className="mt-3 flex h-1.5 gap-1.5 overflow-hidden rounded-full bg-secondary">
            <span className="rounded-full bg-emerald-400" style={{ width: `${all.length ? (g.live.length / all.length) * 100 : 0}%` }} />
            <span className="rounded-full bg-primary" style={{ width: `${all.length ? (g.upcoming.length / all.length) * 100 : 0}%` }} />
            <span className="rounded-full bg-muted-foreground/60" style={{ width: `${all.length ? (g.concluded.length / all.length) * 100 : 0}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Live</p><p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">{g.live.length}</p><p className="text-xs text-muted-foreground">Open now</p></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Upcoming</p><p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">{g.upcoming.length}</p><p className="text-xs text-muted-foreground">Scheduled</p></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Concluded</p><p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">{g.concluded.length}</p><p className="text-xs text-muted-foreground">Archived</p></div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
            {[g.live[0], g.upcoming[0]].map((entry, index) => (
              <div key={entry?.id ?? `empty-${index}`} className="min-w-0 border-l-2 border-primary/70 pl-3">
                <p className={cn("text-[10px] font-semibold uppercase tracking-[0.14em]", index === 0 ? "text-emerald-400" : "text-primary")}>{index === 0 ? "Featured live" : "Next to open"}</p>
                {entry ? <Link to={entry.href} className="mt-1 block truncate text-sm font-semibold text-foreground hover:text-primary">{entry.title}</Link> : <p className="mt-1 text-sm text-muted-foreground">No {index === 0 ? "live" : "scheduled"} launches</p>}
                <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{entry ? `${entry.tokenId.toUpperCase()} · ${index === 0 ? `Closes ${formatUtc(entry.endTime, false)}` : `Opens ${formatUtc(entry.startTime, false)}`}` : "Nothing to display"}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Counts and discovery controls */}
      <section className="rounded-2xl border border-border/70 bg-card/35 p-2.5 sm:p-3">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
          {[
            { key: "all" as Filter, label: "All launches", n: all.length },
            { key: "presale" as Filter, label: "Presales", n: all.filter((e) => e.kind === "presale").length },
            { key: "fair" as Filter, label: "Fair launches", n: all.filter((e) => e.kind === "fair").length },
          ].map((item) => (
            <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={cn("flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors sm:px-4", filter === item.key ? "border-primary/60 bg-primary/10 text-foreground" : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground")}>
              <span className="truncate text-xs font-semibold sm:text-sm">{item.label}</span><span className="text-xl font-semibold tabular-nums">{item.n}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 grid gap-2 border-t border-border/50 pt-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Search launches by title, token, description, or network…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-10 border-border/60 bg-background/60 pl-9 pr-9 text-sm" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search"><X className="h-4 w-4" /></button>}
          </div>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Filter by network" value={networkFilter} onChange={(e) => setNetworkFilter(e.target.value)} className="h-10 min-w-[150px] flex-1 rounded-lg border border-border/60 bg-background/60 px-3 text-xs text-foreground sm:flex-none">
              <option value="all">All networks</option><option value="sepolia">Ethereum Sepolia</option><option value="Base">Base</option><option value="Polygon">Polygon</option><option value="Arbitrum One">Arbitrum One</option>
            </select>
            <button type="button" onClick={() => setLiveOnly((v) => !v)} className={cn("h-10 rounded-lg border px-3 text-xs font-semibold", liveOnly ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400" : "border-border/60 text-muted-foreground hover:text-foreground")}>Live only</button>
            <button type="button" onClick={() => setSepoliaOnly((v) => !v)} className={cn("h-10 rounded-lg border px-3 text-xs font-semibold", sepoliaOnly ? "border-primary/50 bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground")}>Sepolia</button>
            {hasActiveFilters && <button type="button" onClick={handleResetFilters} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" />Reset</button>}
          </div>
        </div>
      </section>

      {/* Live launches: featured lead + compact supporting rows */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Live now</h2>
          <span className="font-mono text-xs text-muted-foreground">{g.live.length}</span>
          <span className="text-xs text-muted-foreground">Open for participation</span>
        </div>
        {g.live.length ? (
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]">
            {(() => {
              const e = g.live[0];
              return <Link to={e.href} onPointerMove={handleLaunchCardPointerMove} onPointerLeave={handleLaunchCardPointerLeave} className="lp-tilt-card group relative flex min-h-[320px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 transition-colors hover:border-primary/60 sm:p-7">
                <div data-tilt-depth="1" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,hsl(var(--primary)/.16),transparent_55%)]" />
                <div data-tilt-depth="2" className="relative flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={e.status} /><KindTag kind={e.kind} /><NetworkChip network={e.network} /></div><ProvenanceBadge kind={e.id.startsWith("session-") ? "session" : "catalog"} /></div>
                <div data-tilt-depth="3" className="relative mt-12 space-y-4">
                  <div><p className="font-mono text-xs text-muted-foreground">{e.tokenId.toUpperCase()} {e.category ? `· ${e.category}` : ""}</p><h3 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl group-hover:text-primary">{e.title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{e.description || "Explore this launch and review its recorded terms."}</p></div>
                  <div className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-3"><div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Raised</p><p className="mt-1 text-lg font-semibold text-foreground">{e.raised ? `${e.raised.value.toLocaleString("en-US")} ${e.raised.unit}`.trim() : "Not recorded"}</p></div><div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{e.hardCap ? "Hard cap" : "Soft cap"}</p><p className="mt-1 text-lg font-semibold text-foreground">{(e.hardCap || e.softCap) ? `${(e.hardCap || e.softCap)!.value.toLocaleString("en-US")} ${(e.hardCap || e.softCap)!.unit}`.trim() : "Not recorded"}</p></div><div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Participants</p><p className="mt-1 text-lg font-semibold text-foreground">{typeof e.participants === "number" ? e.participants.toLocaleString("en-US") : "Not recorded"}</p></div></div>
                  <ProgressBar entry={e} />
                  <div className="flex items-center justify-between gap-3 text-xs"><span className="text-muted-foreground">Closes {formatUtc(e.endTime, false)}</span><span className="inline-flex items-center gap-1 font-semibold text-primary">View launch <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div>
                </div>
              </Link>;
            })()}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {g.live.slice(1, 4).map((e) => <Link key={e.id} to={e.href} onPointerMove={handleLaunchCardPointerMove} onPointerLeave={handleLaunchCardPointerLeave} className="lp-tilt-card group flex min-w-0 flex-col justify-between rounded-2xl border border-border/70 bg-card/45 p-4 transition-colors hover:border-primary/50">
                <div data-tilt-depth="2" className="flex items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={e.status} /><NetworkChip network={e.network} /></div><span className="text-xs text-muted-foreground">{e.kind === "presale" ? "Presale" : "Fair launch"}</span></div>
                <div data-tilt-depth="3" className="mt-5 min-w-0"><h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">{e.title}</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{e.tokenId.toUpperCase()} · {e.raised ? `${e.raised.value.toLocaleString("en-US")} ${e.raised.unit} raised` : "Raise not recorded"}</p></div>
                <div data-tilt-depth="2" className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs"><span className="text-muted-foreground">Closes {formatUtc(e.endTime, false)}</span><span className="font-semibold text-primary">Details ↗</span></div>
              </Link>)}
            </div>
          </div>
        ) : <p className="rounded-xl border border-dashed border-border/70 px-5 py-8 text-sm text-muted-foreground">No live launches match the current filters.</p>}
      </section>

      {/* Upcoming launches: date-led timeline with a dedicated information hierarchy. */}
      <section className="space-y-5">
        <SectionHead id="board-upcoming" title="Upcoming" count={g.upcoming.length} note="Scheduled to open" />
        {g.upcoming.length ? (
          <div className="relative space-y-3 before:absolute before:bottom-8 before:left-[88px] before:top-8 before:w-px before:bg-gradient-to-b before:from-primary/55 before:via-border before:to-transparent sm:before:left-[116px] lg:before:left-[120px]">
            {g.upcoming.map((e) => {
              const target = e.kind === "presale" ? e.hardCap : e.softCap;
              const targetLabel = e.kind === "presale" ? "Hard cap" : "Soft cap";
              const targetValue = target ? `${target.value.toLocaleString("en-US")} ${target.unit}`.trim() : "Not recorded";
              return (
                <div key={e.id} className="group/upcoming relative grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-3 sm:grid-cols-[116px_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-5">
                  <div className="relative z-10 flex flex-col items-end justify-center pr-3 text-right sm:pr-4">
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Opens</span>
                    <span className="mt-1 text-xs font-semibold leading-5 text-primary sm:text-sm">{formatUtc(e.startTime, false)}</span>
                    <span className="mt-1 hidden text-[10px] text-muted-foreground sm:block">UTC schedule</span>
                    <span className="absolute right-[-5px] top-7 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px_hsl(var(--background))]" />
                  </div>
                  <Link
                    to={e.href}
                    className="lp-upcoming-card group relative grid min-w-0 gap-4 overflow-hidden rounded-xl border border-border/70 bg-card/45 p-4 transition-all duration-200 hover:-translate-y-px hover:border-primary/45 hover:bg-card/75 hover:shadow-[0_12px_30px_rgba(0,0,0,.16)] sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(180px,230px)] lg:items-stretch lg:gap-6"
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-primary/70 via-primary/20 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="flex min-w-0 flex-col justify-between gap-4 pl-1">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <KindTag kind={e.kind} />
                          <NetworkChip network={e.network} />
                          <ProvenanceBadge kind={e.id.startsWith("session-") ? "session" : "catalog"} />
                        </div>
                        <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">{e.title}</h3>
                        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">{e.description || "Review the launch details and opening terms."}</p>
                      </div>
                      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                        <span className="font-mono font-medium tracking-wide text-foreground/80">{e.tokenId.toUpperCase()}</span>
                        {e.category && <span className="rounded-md border border-border/70 bg-background/35 px-2 py-1">{e.category}</span>}
                        {e.allocation && <span>Allocation <strong className="font-semibold text-foreground">{e.allocation}</strong></span>}
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-row items-center justify-between gap-4 border-t border-border/60 pt-3 lg:flex-col lg:items-stretch lg:justify-between lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground">{targetLabel}</p>
                          <p className="mt-1 truncate text-sm font-semibold text-foreground">{targetValue}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Participation closes</p>
                          <p className="mt-1 truncate text-sm font-semibold text-foreground">{formatUtc(e.endTime, false)}</p>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5 lg:justify-end">View launch <ArrowRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : <p className="rounded-xl border border-dashed border-border/70 px-5 py-8 text-sm text-muted-foreground">No scheduled launches match the current filters.</p>}
      </section>

      {/* Secondary overview sections: historical results on the left, creator workspace on the right. */}
      <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="min-w-0 space-y-4">
          <SectionHead id="board-concluded" title="Recently concluded" count={g.concluded.length} note="Historical launch results" />
          {g.concluded.length ? <ul className="grid min-w-0 list-none gap-2 p-0">{g.concluded.map((e) => <ConcludedRow key={e.id} e={e} />)}</ul> : <p className="rounded-xl border border-dashed border-border/70 px-5 py-8 text-sm text-muted-foreground">No concluded launches match the current filters.</p>}
        </section>

        <section className="min-w-0 space-y-4">
          <SectionHead id="board-drafts" title="Your drafts" count={g.drafts.length} note="Planned · not yet open" />
          {g.drafts.length ? <ul className="grid min-w-0 list-none gap-3 p-0">{g.drafts.map((e) => <ScheduleRow key={e.id} e={e} draft />)}</ul> : <p className="rounded-xl border border-dashed border-border/70 px-5 py-8 text-sm text-muted-foreground">No saved drafts yet. Start a launch below.</p>}

          <div className="grid gap-2.5 pt-1">
            <Link
              to="/launchpad/presales/create"
              className="group relative flex min-h-[88px] items-center gap-3 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/[0.13] via-primary/[0.07] to-card/40 px-3.5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:from-primary/[0.19] hover:to-primary/[0.06] hover:shadow-[0_10px_30px_-18px_hsl(var(--primary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:px-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/15 text-primary shadow-inner shadow-primary/10">
                <Rocket className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-primary/80">Token fundraising</span>
                <span className="mt-0.5 block text-sm font-semibold tracking-tight text-foreground">Create a presale</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">Set your sale terms, pricing and contribution limits.</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/launchpad/launches/create"
              className="group relative flex min-h-[88px] items-center gap-3 overflow-hidden rounded-xl border border-sky-400/25 bg-gradient-to-r from-sky-400/[0.12] via-sky-400/[0.06] to-card/40 px-3.5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/55 hover:from-sky-400/[0.18] hover:to-sky-400/[0.05] hover:shadow-[0_10px_30px_-18px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:px-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-400 shadow-inner shadow-sky-400/10">
                <Scale className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-sky-400/85">Open token distribution</span>
                <span className="mt-0.5 block text-sm font-semibold tracking-tight text-foreground">Create a fair launch</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">Configure allocation rules and launch participation.</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-400/25 bg-sky-400/10 text-sky-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-sky-400 group-hover:text-slate-950">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 text-xs font-medium">
            <Link to="/launchpad/presales" className="text-muted-foreground transition-colors hover:text-primary">Browse all presales</Link>
            <Link to="/launchpad/launches" className="text-muted-foreground transition-colors hover:text-primary">Browse all fair launches</Link>
          </div>
        </section>
      </section>

      </div>
    </div>
  );
}
