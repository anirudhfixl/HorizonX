"use client";

import React from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { getExplorerBaseUrl, isSepoliaNetwork, toneFor } from "@/components/tokens/token-profile";
import { cn } from "@/lib/utils";
import type {
  Token,
  TokenMarketData,
  Project,
  Presale,
  FairLaunch,
  AirdropCampaign,
  StakingPool,
} from "@/types";
import {
  ArrowDownUp,
  ChevronRight,
  ExternalLink,
  FileCode2,
  BookOpen,
  Activity,
  DatabaseZap,
} from "lucide-react";

type ActivityToken = Token & { market?: TokenMarketData };

interface TokenActivityProps {
  token: ActivityToken;
  project?: Project;
  presales: Presale[];
  fairLaunches: FairLaunch[];
  airdrops: AirdropCampaign[];
  stakingPools: StakingPool[];
}

// ─── Event model ──────────────────────────────────────────────────────────────

export type EventSource = "token" | "presale" | "launch" | "airdrop" | "staking";

export interface CatalogEvent {
  id: string;
  source: EventSource;
  /** What the catalog says happened, e.g. "Token cataloged" or "Window opens". */
  label: string;
  /** Raw date string from the record: `YYYY-MM-DD` or ISO date-time. */
  date: string;
  hasTime: boolean;
  title: string;
  detail?: string;
  /** Status stored on the parent record (not a confirmation of this event). */
  status?: string;
  href?: string;
}

export const SOURCE_LABEL: Record<EventSource, string> = {
  token: "Token",
  presale: "Presale",
  launch: "Fair launch",
  airdrop: "Airdrop",
  staking: "Staking",
};

const SOURCE_DOT: Record<EventSource, string> = {
  token: "bg-primary",
  presale: "bg-sky-400",
  launch: "bg-violet-400",
  airdrop: "bg-emerald-400",
  staking: "bg-amber-400",
};

const SOURCE_TEXT: Record<EventSource, string> = {
  token: "text-primary",
  presale: "text-sky-400",
  launch: "text-violet-400",
  airdrop: "text-emerald-400",
  staking: "text-amber-400",
};

function parseDate(value?: string): number | undefined {
  if (!value) return undefined;
  const t = Date.parse(value);
  return Number.isNaN(t) ? undefined : t;
}

function push(list: CatalogEvent[], e: Omit<CatalogEvent, "hasTime" | "date"> & { date?: string }) {
  if (!e.date || parseDate(e.date) === undefined) return;
  list.push({ ...e, date: e.date, hasTime: e.date.includes("T") });
}

/**
 * Builds the catalog timeline from stored records only. Every event is a date that
 * exists on a record; nothing is generated. These are catalog events, not blockchain
 * transactions.
 */
export function buildCatalogEvents(
  token: Token,
  presales: Presale[],
  fairLaunches: FairLaunch[],
  airdrops: AirdropCampaign[],
  stakingPools: StakingPool[]
): CatalogEvent[] {
  const ev: CatalogEvent[] = [];

  push(ev, {
    id: `token-created-${token.id}`,
    source: "token",
    label: "Token cataloged",
    date: token.createdAt,
    title: `${token.name} added to the ProMiners catalog`,
    detail: `${token.symbol} · ${token.standard || "ERC-20"} · ${token.network}`,
    status: token.status,
  });
  if (token.updatedAt && token.updatedAt !== token.createdAt) {
    push(ev, {
      id: `token-updated-${token.id}`,
      source: "token",
      label: "Record updated",
      date: token.updatedAt,
      title: "Catalog record last updated",
    });
  }

  for (const p of presales) {
    const href = `/launchpad/presales/${p.id}`;
    push(ev, { id: `ps-c-${p.id}`, source: "presale", label: "Presale listed", date: p.createdAt, title: p.title, detail: p.hardCap ? `Hard cap ${p.hardCap}` : undefined, status: p.status, href });
    push(ev, { id: `ps-s-${p.id}`, source: "presale", label: "Sale window opens", date: p.startTime, title: p.title, detail: p.softCap ? `Soft cap ${p.softCap}` : undefined, status: p.status, href });
    push(ev, { id: `ps-e-${p.id}`, source: "presale", label: "Sale window closes", date: p.endTime, title: p.title, detail: p.totalRaised ? `Recorded raised ${p.totalRaised}` : undefined, status: p.status, href });
  }
  for (const f of fairLaunches) {
    const href = `/launchpad/launches/${f.id}`;
    push(ev, { id: `fl-c-${f.id}`, source: "launch", label: "Fair launch listed", date: f.createdAt, title: f.title, detail: f.totalSelling ? `Selling ${f.totalSelling}` : undefined, status: f.status, href });
    push(ev, { id: `fl-s-${f.id}`, source: "launch", label: "Launch window opens", date: f.startTime, title: f.title, status: f.status, href });
    push(ev, { id: `fl-e-${f.id}`, source: "launch", label: "Launch window closes", date: f.endTime, title: f.title, detail: f.totalRaised ? `Recorded raised ${f.totalRaised}` : undefined, status: f.status, href });
  }
  for (const a of airdrops) {
    const href = `/airdrops/campaigns/${a.id}`;
    push(ev, { id: `ad-c-${a.id}`, source: "airdrop", label: "Campaign listed", date: a.createdAt, title: a.title, detail: a.totalReward ? `Reward pool ${a.totalReward}` : undefined, status: a.status, href });
    push(ev, { id: `ad-s-${a.id}`, source: "airdrop", label: "Claim window opens", date: a.startTime, title: a.title, status: a.status, href });
    push(ev, {
      id: `ad-e-${a.id}`, source: "airdrop", label: "Claim window closes", date: a.endTime, title: a.title,
      detail: a.recipientCount !== undefined && a.claimedCount !== undefined ? `Recorded claims ${a.claimedCount.toLocaleString("en-US")} of ${a.recipientCount.toLocaleString("en-US")}` : undefined,
      status: a.status, href,
    });
  }
  for (const s of stakingPools) {
    const href = `/staking/pools/${s.id}`;
    push(ev, { id: `sp-c-${s.id}`, source: "staking", label: "Pool listed", date: s.createdAt, title: s.name, detail: s.apy ? `Listed ${s.apy} APY` : undefined, status: s.status, href });
    push(ev, { id: `sp-s-${s.id}`, source: "staking", label: "Pool opens", date: s.startTime, title: s.name, status: s.status, href });
    push(ev, { id: `sp-e-${s.id}`, source: "staking", label: "Pool closes", date: s.endTime, title: s.name, status: s.status, href });
  }

  return ev;
}

export function sortEvents(events: CatalogEvent[], order: "newest" | "oldest"): CatalogEvent[] {
  const dir = order === "newest" ? -1 : 1;
  return [...events].sort((a, b) => {
    const d = (parseDate(a.date)! - parseDate(b.date)!) * dir;
    return d !== 0 ? d : a.id.localeCompare(b.id);
  });
}

/** Day key (UTC) used for grouping. */
export function dayKey(date: string): string {
  return new Date(parseDate(date)!).toISOString().slice(0, 10);
}

function formatDay(key: string): { day: string; month: string; year: string; weekday: string } {
  const d = new Date(`${key}T00:00:00Z`);
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
    year: String(d.getUTCFullYear()),
    weekday: d.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" }),
  };
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " UTC";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TokenActivity({ token, project, presales, fairLaunches, airdrops, stakingPools }: TokenActivityProps) {
  const [filter, setFilter] = React.useState<"all" | EventSource>("all");
  const [order, setOrder] = React.useState<"newest" | "oldest">("newest");

  const events = React.useMemo(
    () => buildCatalogEvents(token, presales, fairLaunches, airdrops, stakingPools),
    [token, presales, fairLaunches, airdrops, stakingPools]
  );

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    for (const e of events) c[e.source] = (c[e.source] || 0) + 1;
    return c;
  }, [events]);

  const visible = React.useMemo(
    () => sortEvents(events.filter((e) => filter === "all" || e.source === filter), order),
    [events, filter, order]
  );

  const groups = React.useMemo(() => {
    const map = new Map<string, CatalogEvent[]>();
    for (const e of visible) {
      const k = dayKey(e.date);
      map.set(k, [...(map.get(k) || []), e]);
    }
    return Array.from(map.entries());
  }, [visible]);

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);
  const tone = toneFor(token.category);

  const chips: { key: "all" | EventSource; label: string }[] = [
    { key: "all", label: "All" },
    ...(["token", "presale", "launch", "airdrop", "staking"] as EventSource[])
      .filter((s) => (counts[s] || 0) > 0)
      .map((s) => ({ key: s, label: SOURCE_LABEL[s] })),
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/tokens" className="hover:text-foreground">Tokens</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/tokens/${token.id}`} className="hover:text-foreground">{token.symbol}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Activity</span>
      </nav>

      {/* Header: compact identity + record views */}
      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-mono text-sm font-bold", tone.tile)}
          >
            {token.symbol.slice(0, 4)}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Activity</p>
            <h1 className="truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {token.name} <span className="text-muted-foreground">({token.symbol})</span>
            </h1>
          </div>
        </div>
        <nav aria-label="Token record views" className="flex items-center gap-1 overflow-x-auto text-sm">
          <Link href={`/tokens/${token.id}`} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
            <BookOpen className="h-3.5 w-3.5" /> Overview
          </Link>
          <Link href={`/tokens/${token.id}/contract`} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
            <FileCode2 className="h-3.5 w-3.5" /> Contract &amp; source
          </Link>
          <span aria-current="page" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary/15 px-4 py-1.5 font-medium text-primary">
            <Activity className="h-3.5 w-3.5" /> Activity
          </span>
        </nav>
      </header>

      {/* Provenance: the most important thing on this page */}
      <section
        aria-labelledby="chain-heading"
        className="mt-8 grid gap-6 rounded-3xl bg-gradient-to-b from-secondary/40 to-transparent px-5 py-6 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div className="flex gap-4">
          <DatabaseZap className="mt-1 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <div>
            <h2 id="chain-heading" className="text-base font-semibold text-foreground">
              No on-chain transaction data is connected
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              ProMiners has no block indexer for {token.symbol}, so transfers, holders, mint and burn events and
              confirmations are not shown here. The timeline below lists only dates stored on catalog records, which are
              not blockchain transactions.
            </p>
            {!sepolia ? (
              <p className="mt-2 text-xs text-muted-foreground">
                This token is cataloged on {token.network} for discovery. Under D-04, wallet connectivity is supported only on Ethereum Sepolia.
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          {token.contractAddress ? (
            <>
              <a
                href={`${explorerBase}/token/${token.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                See live transfers on {sepolia ? "Sepolia Etherscan" : "the block explorer"} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                {token.contractAddress.slice(0, 10)}…{token.contractAddress.slice(-6)}
                <CopyButton value={token.contractAddress} label="contract address" />
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No contract address is recorded for this token.</span>
          )}
        </div>
      </section>

      {/* Catalog timeline */}
      <section aria-labelledby="timeline-heading" className="mt-12 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 id="timeline-heading" className="text-2xl font-semibold tracking-tight text-foreground">Catalog timeline</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Dates from the token record and from presales, fair launches, airdrops and staking pools linked to{" "}
            {project ? project.name : token.symbol}.
          </p>

          <div role="group" aria-label="Filter by record type" className="mt-5 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
            {chips.map((c) => {
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c.key)}
                  className={cn(
                    "inline-flex items-center justify-between gap-3 rounded-full px-4 py-1.5 text-sm transition-colors lg:rounded-lg lg:px-3",
                    active ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {c.key !== "all" ? <span className={cn("h-2 w-2 rounded-full", SOURCE_DOT[c.key])} aria-hidden /> : null}
                    {c.label}
                  </span>
                  <span className="font-mono text-xs">{counts[c.key] || 0}</span>
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setOrder((o) => (o === "newest" ? "oldest" : "newest"))}
            aria-label={`Sort order: ${order === "newest" ? "newest first" : "oldest first"}. Click to reverse.`}
          >
            <ArrowDownUp className="mr-1.5 h-3.5 w-3.5" />
            {order === "newest" ? "Newest first" : "Oldest first"}
          </Button>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            All times are UTC. Dates without a time are stored as calendar days. Opening and closing dates are scheduled
            by the record, not confirmed events.
          </p>
        </aside>

        <div className="min-w-0">
          {events.length === 0 ? (
            <div className="border-y border-border/40 py-14 text-center">
              <p className="text-sm font-medium text-foreground">No dated records for {token.symbol}</p>
              <p className="mt-1 text-xs text-muted-foreground">The catalog holds no dates for this token or its linked campaigns.</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="border-y border-border/40 py-14 text-center">
              <p className="text-sm font-medium text-foreground">No {SOURCE_LABEL[filter as EventSource]?.toLowerCase()} records</p>
              <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" onClick={() => setFilter("all")}>
                Show all records
              </Button>
            </div>
          ) : (
            <ol className="relative">
              {groups.map(([key, items]) => {
                const d = formatDay(key);
                return (
                  <li key={key} className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 pb-8 sm:grid-cols-[5.5rem_1fr] sm:gap-x-6">
                    <div className="text-right">
                      <p className="font-mono text-2xl font-semibold leading-none text-foreground">{d.day}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{d.month} {d.year}</p>
                      <p className="hidden text-[11px] text-muted-foreground/70 sm:block">{d.weekday}</p>
                    </div>
                    <div className="relative border-l border-border/50 pl-5 sm:pl-7">
                      <ul className="space-y-5">
                        {items.map((e) => {
                          const body = (
                            <>
                              <span aria-hidden className={cn("absolute -left-[25px] top-1.5 sm:-left-[33px] h-2.5 w-2.5 rounded-full ring-4 ring-background", SOURCE_DOT[e.source])} />
                              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", SOURCE_TEXT[e.source])}>
                                  {SOURCE_LABEL[e.source]} · {e.label}
                                </span>
                                {e.hasTime ? <span className="font-mono text-[11px] text-muted-foreground">{formatTime(e.date)}</span> : null}
                              </span>
                              <span className="mt-1 flex items-start justify-between gap-3">
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-foreground group-hover:text-primary">{e.title}</span>
                                  {e.detail ? <span className="block text-xs text-muted-foreground">{e.detail}</span> : null}
                                </span>
                                <span className="flex shrink-0 items-center gap-2">
                                  {e.status ? (
                                    <span title="Status stored on the record, not a confirmation of this event">
                                      <StatusBadge status={e.status} />
                                    </span>
                                  ) : null}
                                  {e.href ? <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" /> : null}
                                </span>
                              </span>
                            </>
                          );
                          return (
                            <li key={e.id} className="relative">
                              {e.href ? (
                                <Link href={e.href} className="group relative block">{body}</Link>
                              ) : (
                                <div className="group relative">{body}</div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
