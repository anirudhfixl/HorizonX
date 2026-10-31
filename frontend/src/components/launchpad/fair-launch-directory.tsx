"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_FAIR_LAUNCHES, MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { readSessionLaunchesRaw, subscribeSessionLaunches, sessionFairLaunchToFairLaunch } from "@/lib/launch-storage";
import { Token, Project, FairLaunch } from "@/types";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  LayoutGrid,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
  ArrowLeft,
  Users,
  SearchX,
  Filter,
} from "lucide-react";

export type FairLaunchSortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "progress-desc"
  | "raised-desc";

export interface FairLaunchDirectoryProps {
  mode?: "canonical" | "explore";
}

// Helper to compute progress percentage against soft cap (e.g. "42.5 ETH" / "25 ETH" -> 170%)
export function calculateProgress(totalRaised?: string, softCap?: string): number {
  if (!totalRaised || !softCap) return 0;
  const raisedNum = parseFloat(totalRaised.replace(/[^0-9.]/g, ""));
  const capNum = parseFloat(softCap.replace(/[^0-9.]/g, ""));
  if (isNaN(raisedNum) || isNaN(capNum) || capNum === 0) return 0;
  return Math.round((raisedNum / capNum) * 100);
}

// Helper to extract numeric amount from string (e.g. "42.5 ETH" -> 42.5)
export function parseAmount(val?: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

// ---------------------------------------------------------------------------
// Presentation helpers (display only; everything is derived from stored fields)
// ---------------------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed UTC date so server and client render identically. */
export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function isSepoliaNetwork(network: string): boolean {
  const n = network.toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

const CONCLUDED = ["ended", "finalized", "failed", "cancelled"];

const STAGES: { value: string; label: string; rail: string }[] = [
  { value: "draft", label: "Draft", rail: "bg-muted-foreground/40" },
  { value: "scheduled", label: "Scheduled", rail: "bg-amber-400" },
  { value: "live", label: "Live", rail: "bg-emerald-400" },
  { value: "ended", label: "Ended", rail: "bg-zinc-500" },
  { value: "finalized", label: "Finalized", rail: "bg-zinc-400" },
];

function laneClass(status: string): string {
  if (status === "live") return "bg-emerald-400";
  if (status === "scheduled") return "bg-amber-400";
  if (status === "draft") return "bg-muted-foreground/50";
  if (status === "failed" || status === "cancelled") return "bg-destructive";
  return "bg-zinc-500";
}

function parseMoney(v?: string): { value: number; unit: string } | null {
  if (!v) return null;
  const m = v.replace(/,/g, "").match(/^\s*(\d*\.?\d+)\s*([A-Za-z]*)/);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value)) return null;
  return { value, unit: m[2].toUpperCase() };
}

export type Commitment =
  | {
      state: "ok";
      raised: number;
      softCap: number;
      unit: string;
      pct: number;
      /** width of the raised fill, 0-100, on a scale that always contains the soft cap */
      fillPct: number;
      /** position of the soft-cap tick, 0-100 */
      tickPct: number;
      met: boolean;
    }
  | { state: "unavailable"; reason: string };

/**
 * Raised against soft cap. A fair launch record has no hard cap, so the scale is
 * max(raised, softCap): the soft-cap tick sits at the end of the bar until the raise
 * passes it, after which the fill runs beyond the tick.
 */
export function getCommitment(fl: Pick<FairLaunch, "totalRaised" | "softCap">): Commitment {
  const raised = parseMoney(fl.totalRaised);
  const cap = parseMoney(fl.softCap);
  if (!raised) return { state: "unavailable", reason: "Raised amount not recorded" };
  if (!cap) return { state: "unavailable", reason: "Soft cap not recorded" };
  if (cap.value <= 0) return { state: "unavailable", reason: "Soft cap is zero" };
  if (raised.unit !== cap.unit) return { state: "unavailable", reason: "Raised and soft cap use different units" };
  const scale = Math.max(raised.value, cap.value);
  return {
    state: "ok",
    raised: raised.value,
    softCap: cap.value,
    unit: cap.unit,
    pct: Math.round((raised.value / cap.value) * 100),
    fillPct: (raised.value / scale) * 100,
    tickPct: (cap.value / scale) * 100,
    met: raised.value >= cap.value,
  };
}

function capNote(fl: FairLaunch, c: Commitment): string {
  if (c.state !== "ok") return c.reason;
  if (CONCLUDED.includes(fl.status)) return c.met ? "Soft cap met" : "Soft cap not met";
  if (fl.status === "live") return c.met ? "Soft cap reached" : "Soft cap not reached yet";
  return "Nothing raised yet";
}

export interface LaneAxis {
  min: number;
  max: number;
}

/** Shared time axis for the launch windows currently listed. */
export function laneAxis(items: Pick<FairLaunch, "startTime" | "endTime">[]): LaneAxis | null {
  let min = Infinity;
  let max = -Infinity;
  for (const it of items) {
    const s = it.startTime ? new Date(it.startTime).getTime() : NaN;
    const e = it.endTime ? new Date(it.endTime).getTime() : NaN;
    if (!Number.isNaN(s)) {
      min = Math.min(min, s);
      max = Math.max(max, s);
    }
    if (!Number.isNaN(e)) {
      min = Math.min(min, e);
      max = Math.max(max, e);
    }
  }
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max } : null;
}

/** Position of one launch window on the shared axis, as percentages. */
export function lanePosition(
  fl: Pick<FairLaunch, "startTime" | "endTime">,
  axis: LaneAxis | null
): { left: number; width: number } | null {
  if (!axis || !fl.startTime || !fl.endTime) return null;
  const s = new Date(fl.startTime).getTime();
  const e = new Date(fl.endTime).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return null;
  const span = axis.max - axis.min;
  if (span <= 0) return { left: 0, width: 100 };
  const width = Math.min(100, Math.max(3, ((e - s) / span) * 100));
  const left = Math.min(100 - width, ((s - axis.min) / span) * 100);
  return { left, width };
}

export function windowDays(fl: Pick<FairLaunch, "startTime" | "endTime">): number | null {
  if (!fl.startTime || !fl.endTime) return null;
  const ms = new Date(fl.endTime).getTime() - new Date(fl.startTime).getTime();
  if (Number.isNaN(ms) || ms < 0) return null;
  return Math.max(1, Math.round(ms / 86_400_000));
}

function scheduleText(fl: FairLaunch): string {
  if (!fl.startTime && !fl.endTime) return "Schedule not set";
  switch (fl.status) {
    case "live":
      return `Closes ${fmtDate(fl.endTime)}`;
    case "scheduled":
      return `Opens ${fmtDate(fl.startTime)} · closes ${fmtDate(fl.endTime)}`;
    case "draft":
      return `Planned ${fmtDate(fl.startTime)} – ${fmtDate(fl.endTime)}`;
    default:
      return `Closed ${fmtDate(fl.endTime)}`;
  }
}

function fmtParticipants(n?: number): string {
  return typeof n === "number" ? n.toLocaleString("en-US") : "—";
}

function contributionRange(fl: FairLaunch): string {
  if (fl.minContribution && fl.maxContribution) return `${fl.minContribution} – ${fl.maxContribution}`;
  return fl.minContribution || fl.maxContribution || "—";
}

export interface FairLaunchFilters {
  search: string;
  status: string;
  network: string;
  category: string;
}

export function matchesFairLaunch(
  fl: FairLaunch,
  f: FairLaunchFilters,
  tokenMap: Map<string, Token>,
  projectMap: Map<string, Project>
): boolean {
  const token = tokenMap.get(fl.tokenId);
  const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;

  if (f.search.trim()) {
    const q = f.search.toLowerCase().trim();
    const hit =
      fl.title.toLowerCase().includes(q) ||
      (fl.description?.toLowerCase().includes(q) ?? false) ||
      (token?.name.toLowerCase().includes(q) ?? false) ||
      (token?.symbol.toLowerCase().includes(q) ?? false) ||
      (project?.name.toLowerCase().includes(q) ?? false);
    if (!hit) return false;
  }

  if (f.status !== "all" && fl.status !== f.status) return false;

  if (f.network === "sepolia") {
    if (!isSepoliaNetwork(fl.network)) return false;
  } else if (f.network !== "all") {
    if (fl.network !== f.network) return false;
  }

  if (f.category !== "all") {
    const cat = fl.category || token?.category;
    if (cat !== f.category) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function NetworkChip({ network }: { network: string }) {
  const ok = isSepoliaNetwork(network);
  return (
    <span
      title={
        ok
          ? "Ethereum Sepolia (Chain ID 11155111) is the active network (D-04)"
          : "Catalog metadata only. Ethereum Sepolia is the only active wallet network (D-04)"
      }
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px]",
        ok ? "bg-primary/10 text-primary" : "bg-muted/60 text-muted-foreground"
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", ok ? "bg-primary" : "bg-muted-foreground/60")} />
      {network}
    </span>
  );
}

function TokenTile({ symbol, title, size = "md" }: { symbol?: string; title: string; size?: "sm" | "md" }) {
  const text = symbol ? symbol.slice(0, 3) : title.slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 via-primary/10 to-transparent font-mono font-bold text-primary",
        size === "md" ? "h-11 w-11 text-sm" : "h-8 w-8 text-[11px]"
      )}
    >
      {text}
    </span>
  );
}

/** Raised vs soft cap. No hard cap exists, so the fill may run past the tick. */
function CommitmentBar({ fl, thin }: { fl: FairLaunch; thin?: boolean }) {
  const c = getCommitment(fl);
  if (c.state !== "ok") {
    return (
      <div
        className={cn("w-full rounded-full border border-dashed border-border/70", thin ? "h-1.5" : "h-2")}
        title={c.reason}
      />
    );
  }
  return (
    <div
      role="meter"
      aria-label={`Raised ${fl.totalRaised} against soft cap ${fl.softCap}`}
      aria-valuemin={0}
      aria-valuenow={c.pct}
      aria-valuetext={`${c.pct}% of soft cap`}
      className="relative w-full"
    >
      <div className={cn("w-full overflow-hidden rounded-full bg-secondary", thin ? "h-1.5" : "h-2")}>
        <div
          className={cn(
            "h-full rounded-full",
            CONCLUDED.includes(fl.status) ? "bg-zinc-400" : c.met ? "bg-emerald-400" : "bg-primary"
          )}
          style={{ width: `${c.fillPct}%` }}
        />
      </div>
      <span
        aria-hidden
        className={cn("absolute w-px bg-foreground/80", thin ? "-top-0.5 h-2.5" : "-top-1 h-4")}
        style={{ left: `${c.tickPct}%` }}
      />
    </div>
  );
}

function WindowLane({ fl, axis }: { fl: FairLaunch; axis: LaneAxis | null }) {
  const pos = lanePosition(fl, axis);
  const days = windowDays(fl);
  return (
    <div
      className="relative h-1.5 w-full rounded-full bg-secondary/70"
      title={`${fmtDate(fl.startTime)} – ${fmtDate(fl.endTime)} (UTC)${days ? ` · ${days}-day window` : ""}`}
    >
      {pos ? (
        <span
          className={cn("absolute top-0 h-full rounded-full", laneClass(fl.status))}
          style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
        />
      ) : null}
    </div>
  );
}

function CommitmentFigures({ fl }: { fl: FairLaunch }) {
  const c = getCommitment(fl);
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <div className="font-mono text-xl font-semibold leading-none text-foreground">
          {fl.totalRaised || "—"}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">raised (recorded)</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-semibold text-foreground">
          {c.state === "ok" ? `${c.pct}%` : "—"}
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          of {fl.softCap ? `${fl.softCap} soft cap` : "soft cap"}
        </div>
      </div>
    </div>
  );
}

function IdentityLines({
  fl,
  token,
  project,
}: {
  fl: FairLaunch;
  token?: Token;
  project?: Project;
}) {
  return (
    <div className="min-w-0">
      <Link
        href={`/launchpad/launches/${fl.id}`}
        className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
      >
        {fl.title}
      </Link>
      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        {token ? (
          <Link href={`/tokens/${token.id}`} className="font-mono font-semibold text-primary hover:underline">
            ${token.symbol}
          </Link>
        ) : (
          <span className="font-mono font-semibold text-foreground">{fl.tokenId.toUpperCase()}</span>
        )}
        {project && (
          <>
            <span className="text-muted-foreground/50">·</span>
            <Link href={`/projects/${project.id}`} className="truncate hover:text-foreground">
              {project.name}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Directory
// ---------------------------------------------------------------------------

export function FairLaunchDirectory({ mode = "canonical" }: FairLaunchDirectoryProps) {
  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<FairLaunchSortOption>("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Maps for fast token and project metadata lookups
  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    MOCK_TOKENS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    MOCK_PROJECTS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Read session-simulated fair launches if present
  const sessionRaw = useSyncExternalStore(subscribeSessionLaunches, readSessionLaunchesRaw, () => "");
  const sessionFairLaunches = useMemo<FairLaunch[]>(() => {
    if (!sessionRaw) return [];
    try {
      const parsed = JSON.parse(sessionRaw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((l: { kind: string }) => l.kind === "fair")
        .map(sessionFairLaunchToFairLaunch);
    } catch {
      return [];
    }
  }, [sessionRaw]);

  const allFairLaunches = useMemo(() => {
    return [...sessionFairLaunches, ...MOCK_FAIR_LAUNCHES];
  }, [sessionFairLaunches]);

  const sessionLaunchIds = useMemo(() => {
    return new Set(sessionFairLaunches.map((s) => s.id));
  }, [sessionFairLaunches]);

  // Unique categories derived from launches and linked tokens
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    allFairLaunches.forEach((fl) => {
      if (fl.category) set.add(fl.category);
      const token = tokenMap.get(fl.tokenId);
      if (token?.category) set.add(token.category);
    });
    return Array.from(set).sort();
  }, [allFairLaunches, tokenMap]);

  // Filter Change Handlers with immediate page reset
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleNetworkChange = (value: string) => {
    setNetworkFilter(value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setNetworkFilter("all");
    setCategoryFilter("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  // Filtered fair launches
  const filteredLaunches = useMemo(
    () =>
      allFairLaunches.filter((fl) =>
        matchesFairLaunch(
          fl,
          { search: searchQuery, status: statusFilter, network: networkFilter, category: categoryFilter },
          tokenMap,
          projectMap
        )
      ),
    [allFairLaunches, searchQuery, statusFilter, networkFilter, categoryFilter, tokenMap, projectMap]
  );

  // Live facet counts: each control counts launches under the *other* active filters
  const stageCounts = useMemo(() => {
    const base: FairLaunchFilters = {
      search: searchQuery,
      status: "all",
      network: networkFilter,
      category: categoryFilter,
    };
    const rows = allFairLaunches.filter((fl) => matchesFairLaunch(fl, base, tokenMap, projectMap));
    const counts: Record<string, number> = { all: rows.length };
    STAGES.forEach((s) => (counts[s.value] = rows.filter((fl) => fl.status === s.value).length));
    return counts;
  }, [allFairLaunches, searchQuery, networkFilter, categoryFilter, tokenMap, projectMap]);

  const networkCounts = useMemo(() => {
    const base: FairLaunchFilters = {
      search: searchQuery,
      status: statusFilter,
      network: "all",
      category: categoryFilter,
    };
    const rows = allFairLaunches.filter((fl) => matchesFairLaunch(fl, base, tokenMap, projectMap));
    return { all: rows.length, sepolia: rows.filter((fl) => isSepoliaNetwork(fl.network)).length };
  }, [allFairLaunches, searchQuery, statusFilter, categoryFilter, tokenMap, projectMap]);

  // Sorted fair launches
  const sortedLaunches = useMemo(() => {
    return [...filteredLaunches].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-desc":
          return (
            new Date(b.startTime || b.createdAt).getTime() -
            new Date(a.startTime || a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.startTime || a.createdAt).getTime() -
            new Date(b.startTime || b.createdAt).getTime()
          );
        case "progress-desc":
          return (
            calculateProgress(b.totalRaised, b.softCap) - calculateProgress(a.totalRaised, a.softCap)
          );
        case "raised-desc":
          return parseAmount(b.totalRaised) - parseAmount(a.totalRaised);
        default:
          return 0;
      }
    });
  }, [filteredLaunches, sortBy]);

  // Shared schedule axis across everything the filters currently match
  const axis = useMemo(() => laneAxis(sortedLaunches), [sortedLaunches]);

  // Pagination Math
  const totalItems = sortedLaunches.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedLaunches = sortedLaunches.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    networkFilter !== "all" ||
    categoryFilter !== "all";

  // Table header click sort
  const handleSortClick = (field: "name" | "date" | "progress" | "raised") => {
    if (field === "name") {
      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc");
    } else if (field === "date") {
      setSortBy(sortBy === "date-desc" ? "date-asc" : "date-desc");
    } else if (field === "progress") {
      setSortBy(sortBy === "progress-desc" ? "name-asc" : "progress-desc");
    } else if (field === "raised") {
      setSortBy(sortBy === "raised-desc" ? "name-asc" : "raised-desc");
    }
  };

  const ariaSort = (asc: FairLaunchSortOption[], desc: FairLaunchSortOption[]) =>
    asc.includes(sortBy) ? "ascending" : desc.includes(sortBy) ? "descending" : "none";

  const selectClass =
    "h-8 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs text-foreground focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* 1. Masthead */}
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-3">
          <Link
            href={mode === "canonical" ? "/launchpad" : "/explore"}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {mode === "canonical" ? "Launchpad" : "Explore"}
          </Link>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {mode === "canonical" ? "Launchpad · Fair launches" : "Explore · Fair launch discovery"}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {mode === "canonical" ? "All Fair Launches" : "Fair Launches Discovery"}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {mode === "canonical"
              ? "Every fair launch in the catalog, with the raise measured against its soft cap, recorded participants and the launch window."
              : "Compare fair launches across networks by stage, commitment and schedule, then open one for its full record."}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="gap-1.5 self-start bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 lg:self-auto"
        >
          <Link href="/launchpad/launches/create">
            <Plus className="h-3.5 w-3.5" /> Create Fair Launch
          </Link>
        </Button>
      </header>

      {/* 2. Disclosure + how to read a fair launch */}
      <section aria-label="Data notice and how to read a fair launch" className="grid gap-6 lg:grid-cols-2">
        <div className="border-l-2 border-primary/60 pl-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Demonstration data · Network scope (Architecture Decision D-04)
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            All launches, raised amounts, participant counts and schedules are simulated demonstration data, and
            listing descriptions are sample text rather than verified terms. Per <strong>D-04</strong>,{" "}
            <strong>Ethereum Sepolia (Chain ID 11155111)</strong> is the only active wallet network; Base, Arbitrum
            One and Polygon records are catalog metadata only. No real funds are raised or required.
          </p>
        </div>
        <div className="border-l-2 border-border pl-4">
          <div className="text-xs font-semibold text-foreground">How a fair launch is shown here</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            A fair launch record stores a <strong>soft cap</strong>, the <strong>total tokens for sale</strong> and a
            launch window. It does not store a hard cap, token price or per-wallet allocation, so the bar compares the
            raise with the soft cap (the tick) and can run past it. Presales are different: they carry a hard cap.
          </p>
        </div>
      </section>

      {/* 3. Discovery controls */}
      <section aria-label="Search and filters" className="space-y-5">
        {/* Stage track */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="group" aria-label="Launch stage" className="flex min-w-max items-stretch gap-1 sm:min-w-0">
            <button
              type="button"
              onClick={() => handleStatusChange("all")}
              aria-pressed={statusFilter === "all"}
              className={cn(
                "flex min-w-[88px] flex-col gap-1.5 rounded-md px-3 py-2.5 text-left transition-colors sm:flex-1",
                statusFilter === "all" ? "bg-secondary/80" : "hover:bg-secondary/40"
              )}
            >
              <span className="h-1 w-full rounded-full bg-gradient-to-r from-muted-foreground/40 via-amber-400 to-emerald-400" />
              <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="text-xs font-medium text-foreground">All stages</span>
                <span className="font-mono text-lg font-semibold text-foreground">{stageCounts.all}</span>
              </span>
            </button>
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleStatusChange(s.value)}
                aria-pressed={statusFilter === s.value}
                className={cn(
                  "flex min-w-[88px] flex-col gap-1.5 rounded-md px-3 py-2.5 text-left transition-colors sm:flex-1",
                  statusFilter === s.value ? "bg-secondary/80" : "hover:bg-secondary/40",
                  stageCounts[s.value] === 0 && statusFilter !== s.value && "opacity-50"
                )}
              >
                <span className={cn("h-1 w-full rounded-full", s.rail)} />
                <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="text-xs font-medium text-foreground">{s.label}</span>
                  <span className="font-mono text-lg font-semibold text-foreground">{stageCounts[s.value]}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + network + category */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by launch title, token, symbol or description..."
              aria-label="Search fair launches"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 border-border/60 bg-secondary/30 pl-9 pr-8 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Network"
            className="inline-flex self-start rounded-lg bg-secondary/40 p-0.5 md:self-auto"
          >
            {[
              { value: "all", label: "All networks", count: networkCounts.all, title: undefined },
              {
                value: "sepolia",
                label: "Sepolia",
                count: networkCounts.sepolia,
                title: "Ethereum Sepolia (11155111), the active network (D-04)",
              },
            ].map((n) => (
              <button
                key={n.value}
                type="button"
                title={n.title}
                onClick={() => handleNetworkChange(n.value)}
                aria-pressed={networkFilter === n.value}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  networkFilter === n.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label} <span className="font-mono opacity-70">{n.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={cn(selectClass, "h-10 self-start md:self-auto")}
              aria-label="Category"
            >
              <option value="all" className="bg-card text-foreground">
                All Categories
              </option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {cat}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="h-10 md:hidden gap-1.5 px-3 text-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Collapsible Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 md:hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-xs font-semibold text-foreground">Sort & Display Options</span>
              {hasActiveFilters && (
                <button onClick={handleResetFilters} className="text-xs text-primary hover:underline">
                  Reset
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="space-y-1">
                <span className="text-muted-foreground">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as FairLaunchSortOption)}
                  className="w-full h-8 rounded-md border border-border bg-secondary/50 px-2 text-xs text-foreground"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="progress-desc">Highest Progress</option>
                  <option value="raised-desc">Total Raised</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-muted-foreground">Per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="w-full h-8 rounded-md border border-border bg-secondary/50 px-2 text-xs text-foreground"
                >
                  <option value={4}>4 per page</option>
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* 4. Results */}
      <section aria-label="Fair launch results" className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-border/50 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-foreground">
                <strong className="font-mono">{totalItems}</strong> fair launch{totalItems === 1 ? "" : "es"}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
            {axis && (
              <p className="text-[11px] text-muted-foreground">
                Schedule bars share one axis: {fmtDate(new Date(axis.min).toISOString())} –{" "}
                {fmtDate(new Date(axis.max).toISOString())} (UTC)
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FairLaunchSortOption)}
              className={selectClass}
              aria-label="Sort by"
            >
              <option value="date-desc" className="bg-card text-foreground">
                Newest First
              </option>
              <option value="date-asc" className="bg-card text-foreground">
                Oldest First
              </option>
              <option value="name-asc" className="bg-card text-foreground">
                Name (A to Z)
              </option>
              <option value="name-desc" className="bg-card text-foreground">
                Name (Z to A)
              </option>
              <option value="progress-desc" className="bg-card text-foreground">
                Highest Progress
              </option>
              <option value="raised-desc" className="bg-card text-foreground">
                Total Raised
              </option>
            </select>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className={selectClass}
              aria-label="Page Size"
            >
              <option value={4} className="bg-card text-foreground">
                4 per page
              </option>
              <option value={6} className="bg-card text-foreground">
                6 per page
              </option>
              <option value={12} className="bg-card text-foreground">
                12 per page
              </option>
            </select>
            <div className="flex items-center rounded-lg bg-secondary/40 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                aria-pressed={viewMode === "table"}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Table View"
                aria-label="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {paginatedLaunches.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <SearchX className="h-8 w-8 text-primary/70" />
            <h3 className="mt-4 text-base font-semibold text-foreground">No Fair Launches Found</h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
              No fair launches match your current filters and search query. Try broadening your keywords or
              resetting filters.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-5 border-border/60 text-xs"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW: launch pools */
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {paginatedLaunches.map((fl) => {
              const token = tokenMap.get(fl.tokenId);
              const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
              const c = getCommitment(fl);
              const days = windowDays(fl);
              return (
                <article
                  key={fl.id}
                  className="group flex flex-col rounded-2xl bg-gradient-to-b from-card/80 to-card/20 p-5 ring-1 ring-border/50 transition-shadow hover:ring-primary/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={fl.status} />
                      <ProvenanceBadge kind={sessionLaunchIds.has(fl.id) ? "session" : "catalog"} />
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      {fl.category && (
                        <span className="max-w-[9rem] truncate text-[11px] text-muted-foreground">{fl.category}</span>
                      )}
                      <NetworkChip network={fl.network} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <TokenTile symbol={token?.symbol} title={fl.title} />
                    <IdentityLines fl={fl} token={token} project={project} />
                  </div>

                  {fl.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {fl.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2.5">
                    <CommitmentFigures fl={fl} />
                    <CommitmentBar fl={fl} />
                    <div className="text-[11px] text-muted-foreground">{capNote(fl, c)}</div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/40 pt-4 text-xs">
                    <div className="min-w-0">
                      <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <Users className="h-3 w-3" /> Participants
                      </dt>
                      <dd className="mt-1 font-mono font-semibold text-foreground">
                        {fmtParticipants(fl.participantCount)}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">For sale</dt>
                      <dd className="mt-1 truncate font-mono font-semibold text-foreground" title={fl.totalSelling}>
                        {fl.totalSelling || "—"}
                      </dd>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Contribution range (per record)
                      </dt>
                      <dd className="mt-1 font-mono font-semibold text-foreground">{contributionRange(fl)}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 space-y-1.5">
                    <WindowLane fl={fl} axis={axis} />
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>{scheduleText(fl)}</span>
                      {days !== null && <span className="shrink-0">{days}d window</span>}
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href={`/launchpad/launches/${fl.id}`}>
                        Inspect Launch <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            {/* TABLE VIEW (xl and up) */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pr-4" aria-sort={ariaSort(["name-asc"], ["name-desc"])}>
                      <button
                        type="button"
                        onClick={() => handleSortClick("name")}
                        className="inline-flex items-center gap-1 uppercase hover:text-foreground"
                      >
                        Launch / Token
                        {sortBy === "name-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                        {sortBy === "name-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                      </button>
                    </th>
                    <th className="px-3 py-3">Network &amp; Category</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3" aria-sort={ariaSort([], ["raised-desc"])}>
                      <button
                        type="button"
                        onClick={() => handleSortClick("raised")}
                        className="inline-flex items-center gap-1 uppercase hover:text-foreground"
                      >
                        Raised / Softcap
                        {sortBy === "raised-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                      </button>
                    </th>
                    <th className="px-3 py-3" aria-sort={ariaSort([], ["progress-desc"])}>
                      <button
                        type="button"
                        onClick={() => handleSortClick("progress")}
                        className="inline-flex items-center gap-1 uppercase hover:text-foreground"
                      >
                        Progress
                        {sortBy === "progress-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                      </button>
                    </th>
                    <th className="px-3 py-3">Participants</th>
                    <th className="px-3 py-3" aria-sort={ariaSort(["date-asc"], ["date-desc"])}>
                      <button
                        type="button"
                        onClick={() => handleSortClick("date")}
                        className="inline-flex items-center gap-1 uppercase hover:text-foreground"
                      >
                        Timeline
                        {sortBy === "date-desc" && <ChevronDown className="h-3 w-3 text-primary" />}
                        {sortBy === "date-asc" && <ChevronUp className="h-3 w-3 text-primary" />}
                      </button>
                    </th>
                    <th className="py-3 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedLaunches.map((fl) => {
                    const token = tokenMap.get(fl.tokenId);
                    const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
                    const c = getCommitment(fl);
                    return (
                      <tr key={fl.id} className="transition-colors hover:bg-secondary/10">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <TokenTile symbol={token?.symbol} title={fl.title} size="sm" />
                            <IdentityLines fl={fl} token={token} project={project} />
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="space-y-1">
                            <NetworkChip network={fl.network} />
                            {fl.category && (
                              <p className="truncate text-[10px] text-muted-foreground">{fl.category}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            <StatusBadge status={fl.status} />
                            <ProvenanceBadge kind={sessionLaunchIds.has(fl.id) ? "session" : "catalog"} />
                          </div>
                        </td>
                        <td className="px-3 py-3.5 font-mono">
                          <div className="font-semibold text-foreground">{fl.totalRaised || "—"}</div>
                          <div className="text-[10px] text-muted-foreground">Soft: {fl.softCap || "—"}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="w-28 space-y-1.5">
                            <div className="font-mono text-[11px] font-semibold text-foreground">
                              {c.state === "ok" ? `${c.pct}%` : "—"}
                            </div>
                            <CommitmentBar fl={fl} thin />
                          </div>
                        </td>
                        <td className="px-3 py-3.5 font-mono text-foreground">
                          {fmtParticipants(fl.participantCount)}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="w-40 space-y-1.5">
                            <WindowLane fl={fl} axis={axis} />
                            <div className="font-mono text-[10px] text-muted-foreground">{scheduleText(fl)}</div>
                          </div>
                        </td>
                        <td className="py-3.5 pl-3 text-right">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-7 border-border/60 text-xs hover:border-primary/50"
                          >
                            <Link href={`/launchpad/launches/${fl.id}`}>Inspect</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABLE VIEW below xl: stacked list instead of a squeezed table */}
            <ul className="divide-y divide-border/40 xl:hidden">
              {paginatedLaunches.map((fl) => {
                const token = tokenMap.get(fl.tokenId);
                const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
                const c = getCommitment(fl);
                return (
                  <li key={fl.id} className="space-y-3 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <TokenTile symbol={token?.symbol} title={fl.title} size="sm" />
                        <IdentityLines fl={fl} token={token} project={project} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={fl.status} />
                        <ProvenanceBadge kind="catalog" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <NetworkChip network={fl.network} />
                      {fl.category && <span className="text-[11px] text-muted-foreground">{fl.category}</span>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="font-semibold text-foreground">
                          {fl.totalRaised || "—"}{" "}
                          <span className="font-normal text-muted-foreground">/ {fl.softCap || "—"} soft</span>
                        </span>
                        <span className="font-semibold text-foreground">{c.state === "ok" ? `${c.pct}%` : "—"}</span>
                      </div>
                      <CommitmentBar fl={fl} thin />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                      <span className="font-mono">{scheduleText(fl)}</span>
                      <span className="flex shrink-0 items-center gap-1 font-mono text-foreground">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {fmtParticipants(fl.participantCount)}
                      </span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 w-full border-border/60 text-xs hover:border-primary/50"
                    >
                      <Link href={`/launchpad/launches/${fl.id}`}>Inspect</Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* 5. Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row"
        >
          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
            <strong className="text-foreground">{Math.min(startIndex + pageSize, totalItems)}</strong> of{" "}
            <strong className="text-foreground">{totalItems}</strong> fair launches
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage <= 1}
              className="h-8 border-border/60 px-2.5 text-xs"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={effectivePage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                aria-current={effectivePage === page ? "page" : undefined}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  effectivePage === page
                    ? "bg-primary font-bold text-primary-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage >= totalPages}
              className="h-8 border-border/60 px-2.5 text-xs"
            >
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
