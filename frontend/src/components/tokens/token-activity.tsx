import React, { useMemo, useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { TokenDetailShell } from "./token-detail-shell";
import { getExplorerBaseUrl, isSepoliaNetwork } from "@/components/tokens/token-profile";
import { cn } from "@/lib/utils";
import { TOKENOMICS_ALLOCATION_TEMPLATES } from "@/data";
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
  DatabaseZap,
  ExternalLink,
  Search,
  CalendarDays,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";

type ActivityToken = Token & { market?: TokenMarketData };

interface TokenActivityProps {
  token: ActivityToken;
  project?: Project;
  presales: Presale[];
  fairLaunches: FairLaunch[];
  airdrops: AirdropCampaign[];
  stakingPools: StakingPool[];
}

export type EventSource = "token" | "presale" | "launch" | "airdrop" | "staking";

export interface CatalogEvent {
  id: string;
  source: EventSource;
  label: string;
  date: string;
  title: string;
  detail?: string;
  status?: string;
  href?: string;
  hasTime?: boolean;
}

// ─── Helpers (exported for unit tests) ─────────────────────────────────────────

function parseDate(d?: string): number | null {
  if (!d) return null;
  const t = Date.parse(d);
  return Number.isNaN(t) ? null : t;
}

function push(events: CatalogEvent[], e: Omit<CatalogEvent, "hasTime" | "date"> & { date?: string }) {
  if (!e.date) return;
  const t = parseDate(e.date);
  if (t === null) return;
  const hasTime = e.date.includes("T");
  events.push({ ...e, date: e.date, hasTime });
}

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
    label: "Catalog listing",
    date: token.createdAt,
    title: `${token.name} registered in platform catalog`,
    detail: token.creatorAddress ? `Registered by ${token.creatorAddress.slice(0, 10)}…` : undefined,
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
  const d = new Date(date);
  return d.toISOString().slice(11, 16) + " UTC";
}

const SOURCE_LABEL: Record<EventSource, string> = {
  token: "Token Record",
  presale: "Presale",
  launch: "Fair Launch",
  airdrop: "Airdrop",
  staking: "Staking Pool",
};

const SOURCE_DOT: Record<EventSource, string> = {
  token: "bg-sky-400",
  presale: "bg-violet-400",
  launch: "bg-emerald-400",
  airdrop: "bg-amber-400",
  staking: "bg-pink-400",
};

const SOURCE_TEXT: Record<EventSource, string> = {
  token: "text-sky-400",
  presale: "text-violet-400",
  launch: "text-emerald-400",
  airdrop: "text-amber-400",
  staking: "text-pink-400",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TokenActivity({
  token,
  project,
  presales,
  fairLaunches,
  airdrops,
  stakingPools,
}: TokenActivityProps) {
  const [filter, setFilter] = useState<EventSource | "all">("all");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState("");

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);

  // All catalog events
  const events = useMemo(
    () => buildCatalogEvents(token, presales, fairLaunches, airdrops, stakingPools),
    [token, presales, fairLaunches, airdrops, stakingPools]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) =>
      (filter === "all" || e.source === filter) &&
      (!q || `${e.title} ${e.label} ${e.detail || ""} ${SOURCE_LABEL[e.source]}`.toLowerCase().includes(q))
    );
  }, [events, filter, query]);

  const sorted = useMemo(() => sortEvents(filtered, order), [filtered, order]);

  // Group by UTC day
  const groups = useMemo(() => {
    const map = new Map<string, CatalogEvent[]>();
    for (const e of sorted) {
      const key = dayKey(e.date);
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [sorted]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    for (const e of events) {
      c[e.source] = (c[e.source] || 0) + 1;
    }
    return c;
  }, [events]);

  const chips: { key: EventSource | "all"; label: string }[] = [
    { key: "all", label: "All Milestones" },
    { key: "token", label: "Token Catalog" },
    { key: "presale", label: "Presales" },
    { key: "launch", label: "Fair Launches" },
    { key: "airdrop", label: "Airdrops" },
    { key: "staking", label: "Staking Pools" },
  ];

  // Illustrative allocation model for tokenomics transparency (sums to 100%)
  const illustrativeAllocations = TOKENOMICS_ALLOCATION_TEMPLATES;

  return (
    <TokenDetailShell token={token} project={project} activeTab="activity">
      <div className="space-y-8">
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Activity summary">
          {[
            { label: "Recorded milestones", value: events.length, icon: Layers3 },
            { label: "Activity categories", value: Object.values(counts).filter((v) => v > 0).length - (counts.all > 0 ? 1 : 0), icon: DatabaseZap },
            { label: "Latest recorded date", value: events.length ? new Date(Math.max(...events.map((e) => Date.parse(e.date)))).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "—", icon: CalendarDays },
          ].map((item) => { const Icon = item.icon; return (
            <div key={item.label} className="rounded-xl border border-border/50 bg-card/35 px-4 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <Icon className="h-4 w-4 text-primary/80" aria-hidden />
              </div>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{item.value}</p>
            </div>
          ); })}
        </section>
        {/* ─── 1. On-Chain Transparency Status Banner ───────────────────── */}
        <section
          aria-labelledby="chain-heading"
          className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6 space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <DatabaseZap className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div className="space-y-1">
                <h2 id="chain-heading" className="text-base font-bold text-foreground">
                  No Live On-Chain Event Indexer Connected
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
                  HorizonX does not run a dedicated historical RPC block indexer for {token.symbol}. Live transfer history, real-time token holders, block confirmations, and transaction receipts are not queried on this page. The timeline below represents platform catalog milestones recorded in metadata.
                </p>
                {!sepolia && (
                  <p className="text-[11px] text-muted-foreground">
                    This token is cataloged on {token.network} for discovery. Under Architecture Decision D-04, wallet connectivity is supported exclusively on Ethereum Sepolia.
                  </p>
                )}
              </div>
            </div>

            {token.contractAddress && (
              <Button asChild size="sm" className="h-9 shrink-0 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                <a href={`${explorerBase}/token/${token.contractAddress}`} target="_blank" rel="noopener noreferrer">
                  <span>Open token on explorer</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </section>

        {/* ─── 2. Catalog Milestones Timeline ───────────────────────────── */}
        <section aria-labelledby="timeline-heading" className="space-y-5">
          <div className="flex flex-col gap-4 border-b border-border/50 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Catalog Timeline</Eyebrow>
              <h2 id="timeline-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Platform History
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Chronological platform events from the token record and registered ecosystem campaigns.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 xl:max-w-[34rem]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity, campaign or milestone…" aria-label="Search activity" className="h-10 w-full rounded-lg border border-border/60 bg-secondary/20 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15" />
              </label>
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by milestone type">
              {chips.map((c) => {
                const active = filter === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(c.key)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                      active
                        ? "border-primary/35 bg-primary/10 font-semibold text-primary"
                        : "border-border/40 bg-secondary/15 text-muted-foreground hover:border-border hover:bg-secondary/40 hover:text-foreground"
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {c.key !== "all" ? <span className={cn("h-1.5 w-1.5 rounded-full", SOURCE_DOT[c.key])} aria-hidden /> : null}
                      {c.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">{counts[c.key] || 0}</span>
                  </button>
                );
              })}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-muted-foreground">Showing <span className="font-semibold text-foreground">{sorted.length}</span> of {events.length} recorded milestones</p>
                <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 border-border/60 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setOrder((o) => (o === "newest" ? "oldest" : "newest"))}
              aria-label={`Sort order: ${order === "newest" ? "newest first" : "oldest first"}. Click to reverse.`}
            >
              <ArrowDownUp className="mr-1.5 h-3.5 w-3.5" />
              {order === "newest" ? "Newest first" : "Oldest first"}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">Times are displayed in UTC. Date-only records represent calendar dates; scheduled campaign dates are platform targets, not confirmed chain events.</p>

          <div className="min-w-0">
            {events.length === 0 ? (
              <div className="rounded-2xl border border-border/40 bg-card/20 py-14 text-center">
                <p className="text-sm font-medium text-foreground">No Dated Records for {token.symbol}</p>
                <p className="mt-1 text-xs text-muted-foreground">The catalog holds no dates for this token or linked campaigns.</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 px-5 py-14 text-center">
                <Search className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden />
                <p className="mt-3 text-sm font-medium text-foreground">No matching activity found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try another search term or clear the active filters.</p>
                <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" onClick={() => { setFilter("all"); setQuery(""); }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <ol className="relative space-y-5">
                {groups.map(([key, items]) => {
                  const d = formatDay(key);
                  return (
                    <li key={key} className="relative grid grid-cols-[3.25rem_1fr] gap-x-3 sm:grid-cols-[5rem_1fr] sm:gap-x-5">
                      <div className="text-right">
                        <p className="font-mono text-2xl font-bold leading-none text-foreground">{d.day}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{d.month} {d.year}</p>
                        <p className="hidden text-[11px] text-muted-foreground/70 sm:block">{d.weekday}</p>
                      </div>
                      <div className="relative border-l border-border/50 pl-4 sm:pl-6">
                        <ul className="space-y-2.5">
                          {items.map((e) => {
                            const body = (
                              <>
                                <span aria-hidden className={cn("absolute -left-[25px] top-1.5 sm:-left-[33px] h-2.5 w-2.5 rounded-full ring-4 ring-background", SOURCE_DOT[e.source])} />
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className={cn("text-[11px] font-semibold uppercase tracking-wider", SOURCE_TEXT[e.source])}>
                                    {SOURCE_LABEL[e.source]} · {e.label}
                                  </span>
                                  {e.hasTime ? <span className="font-mono text-[11px] text-muted-foreground">{formatTime(e.date)}</span> : null}
                                </div>
                                <div className="mt-1 flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{e.title}</span>
                                    {e.detail ? <span className="block text-xs text-muted-foreground mt-0.5">{e.detail}</span> : null}
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    {e.status ? (
                                      <span title="Status stored on the record, not a blockchain confirmation">
                                        <StatusBadge status={e.status} />
                                      </span>
                                    ) : null}
                                    {e.href ? <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" /> : null}
                                  </div>
                                </div>
                              </>
                            );
                            return (
                              <li key={e.id} className="relative">
                                {e.href ? (
                                  <Link to={e.href} className="group relative block rounded-xl border border-border/40 bg-card/25 p-3 transition-all hover:border-primary/30 hover:bg-secondary/25 sm:p-4">
                                    {body}
                                  </Link>
                                ) : (
                                  <div className="group relative rounded-xl border border-border/40 bg-card/25 p-3 sm:p-4">{body}</div>
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

        {/* ─── 3. Illustrative Tokenomics Breakdown ─────────────────────── */}
        <section aria-labelledby="tokenomics-heading" className="rounded-2xl border border-border/50 bg-card/25 p-5 space-y-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between">
              <Eyebrow>Tokenomics Transparency</Eyebrow>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Simulated Allocation
              </span>
            </div>
            <h2 id="tokenomics-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1">
              Illustrative Initial Token Allocation
            </h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
              This allocation chart represents the catalog tokenomics blueprint. It does <strong className="font-semibold text-foreground">not</strong> reflect real-time on-chain wallet holder distribution. Live holder addresses can be verified on the block explorer.
            </p>
          </div>

          {/* Allocation Stack Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-secondary/50" role="img" aria-label="Illustrative token distribution">
              {illustrativeAllocations.map((a) => (
                <div
                  key={a.label}
                  className={cn("h-full", a.color)}
                  style={{ width: `${a.pct}%` }}
                  title={`${a.label}: ${a.pct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              {illustrativeAllocations.map((a) => (
                <div key={a.label} className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-secondary/20 p-2.5">
                  <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", a.color)} aria-hidden />
                  <span className="text-muted-foreground truncate flex-1">{a.label}</span>
                  <span className="font-mono font-semibold text-foreground">{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. D-04 Notice ─────────────────────────────────────────────── */}
        <p className="border-l-2 border-primary/40 pl-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">Architecture Decision D-04: </strong>
          Ethereum Sepolia (Chain ID 11155111) is the only network supported for Web3 wallet connectivity. To verify real-time holder counts and token transfers, use the official Sepolia Etherscan explorer.
        </p>
      </div>
    </TokenDetailShell>
  );
}
