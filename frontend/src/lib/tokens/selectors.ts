/**
 * Pure selectors over the token catalog and the other HorizonX modules.
 * No React, no storage: everything takes its inputs as arguments so it can be
 * tested directly and reused by other modules.
 */
import {
  AIRDROPS,
  FAIR_LAUNCHES,
  FEATURED_TOKEN_IDS,
  PRESALES,
  PROJECTS,
  STAKING_POOLS,
  TOKENS,
} from "@/data";
import { DEMO_HOLDINGS, REVIEWED_STATUSES } from "./config";
import { anchorTime, simulatedSeries } from "./demo-data";
import { compactNumber, num, parseSupply, shortAddress } from "./format";
import type {
  ActivityItem,
  Holding,
  HoldingRow,
  Portfolio,
  Relation,
  SessionReceipt,
  TokenWithMarket,
} from "./model";

export const TOKEN_CATALOG: TokenWithMarket[] = TOKENS as TokenWithMarket[];

export const getToken = (id: string): TokenWithMarket | undefined => TOKEN_CATALOG.find((t) => t.id === id);

/* ── market ────────────────────────────────────────────────────────────── */

export const byMarketCap = (tokens: TokenWithMarket[]) =>
  [...tokens].sort((a, b) => num(b.market.marketCap) - num(a.market.marketCap));

/** 1-based rank by market cap across the whole catalog. */
export function marketRank(id: string, tokens: TokenWithMarket[] = TOKEN_CATALOG): number {
  return byMarketCap(tokens).findIndex((t) => t.id === id) + 1;
}

export function trendingScore(t: TokenWithMarket): number {
  const cap = num(t.market.marketCap);
  const turnover = cap ? num(t.market.volume24h) / cap : 0;
  return turnover * 100 + Math.max(0, num(t.market.priceChange24h)) * 0.6;
}

export interface MarketSummary {
  count: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  advancing: number;
  declining: number;
  /** Market-cap-weighted 24h change in percent. */
  weightedChange: number;
}

export function summarizeMarket(tokens: TokenWithMarket[] = TOKEN_CATALOG): MarketSummary {
  let marketCap = 0, volume24h = 0, liquidity = 0, advancing = 0, declining = 0, weighted = 0;
  for (const t of tokens) {
    const cap = num(t.market.marketCap);
    marketCap += cap;
    volume24h += num(t.market.volume24h);
    liquidity += num(t.market.liquidity);
    weighted += num(t.market.priceChange24h) * cap;
    if (num(t.market.priceChange24h) >= 0) advancing++;
    else declining++;
  }
  return {
    count: tokens.length,
    marketCap,
    volume24h,
    liquidity,
    advancing,
    declining,
    weightedChange: marketCap ? weighted / marketCap : 0,
  };
}

export const isReviewed = (t: TokenWithMarket) =>
  !!t.verificationStatus && REVIEWED_STATUSES.includes(t.verificationStatus);

export function featuredTokens(tokens: TokenWithMarket[] = TOKEN_CATALOG): TokenWithMarket[] {
  const picked = FEATURED_TOKEN_IDS.map((id) => tokens.find((t) => t.id === id)).filter(
    (t): t is TokenWithMarket => !!t,
  );
  return picked.length >= 3 ? picked : byMarketCap(tokens).slice(0, 4);
}

export interface DiscoveryLists {
  trending: TokenWithMarket[];
  gainers: TokenWithMarket[];
  volume: TokenWithMarket[];
  recent: TokenWithMarket[];
  reviewed: TokenWithMarket[];
}

export function discoveryLists(tokens: TokenWithMarket[] = TOKEN_CATALOG): DiscoveryLists {
  const sort = (fn: (a: TokenWithMarket, b: TokenWithMarket) => number) => [...tokens].sort(fn);
  return {
    trending: sort((a, b) => trendingScore(b) - trendingScore(a)),
    gainers: sort((a, b) => num(b.market.priceChange24h) - num(a.market.priceChange24h)),
    volume: sort((a, b) => num(b.market.volume24h) - num(a.market.volume24h)),
    recent: sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    reviewed: byMarketCap(tokens.filter(isReviewed)),
  };
}

/* ── ecosystem relations ───────────────────────────────────────────────── */

type Tone = Relation["tone"];

function toneOf(status: string): Tone {
  if (["live", "active"].includes(status)) return "live";
  if (["scheduled", "pending", "draft"].includes(status)) return "upcoming";
  if (["ended", "finalized", "cancelled", "failed"].includes(status)) return "ended";
  return "neutral";
}

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Everything in HorizonX that is linked to a token. A relation exists only when
 * a record references the token (or its project); nothing is invented.
 */
export function tokenRelations(token: TokenWithMarket): Relation[] {
  // A record belongs to this token only when it names it. Sharing a project is not enough:
  // a project can issue several tokens, and a sibling's presale is not this token's.
  const linked = (x: { tokenId: string }) => x.tokenId === token.id;
  const out: Relation[] = [];

  for (const p of PRESALES.filter(linked)) {
    out.push({
      id: p.id,
      kind: "presale",
      title: p.title,
      status: sentence(p.status),
      tone: toneOf(p.status),
      meta: p.totalRaised && p.hardCap ? `${p.totalRaised} raised of ${p.hardCap}` : undefined,
      href: `/launchpad/presales/${p.id}`,
      cta: "View presale",
    });
  }
  for (const f of FAIR_LAUNCHES.filter(linked)) {
    out.push({
      id: f.id,
      kind: "launch",
      title: f.title,
      status: sentence(f.status),
      tone: toneOf(f.status),
      meta: f.totalRaised ? `${f.totalRaised} raised` : undefined,
      href: `/launchpad/launches/${f.id}`,
      cta: "View launch",
    });
  }
  for (const a of AIRDROPS.filter(linked)) {
    out.push({
      id: a.id,
      kind: "airdrop",
      title: a.title,
      status: sentence(a.status),
      tone: toneOf(a.status),
      meta: a.recipientCount ? `${(a.claimedCount ?? 0).toLocaleString("en-US")} of ${a.recipientCount.toLocaleString("en-US")} claimed` : undefined,
      href: `/airdrops/campaigns/${a.id}`,
      cta: "View campaign",
    });
  }
  for (const s of STAKING_POOLS.filter(linked)) {
    out.push({
      id: s.id,
      kind: "staking",
      title: s.name,
      status: sentence(s.status),
      tone: toneOf(s.status),
      meta: s.apy ? `${s.apy} APY` : undefined,
      href: `/staking/pools/${s.id}`,
      cta: "View pool",
    });
  }
  const project = token.projectId ? PROJECTS.find((p) => p.id === token.projectId) : undefined;
  if (project) {
    out.push({
      id: project.id,
      kind: "project",
      title: project.name,
      status: sentence(project.status),
      tone: "neutral",
      meta: project.category,
      href: `/projects/${project.id}`,
      cta: "View project",
    });
  }
  if (token.status === "active") {
    out.push({
      id: token.id,
      kind: "exchange",
      title: `${token.symbol} market`,
      status: "Listed",
      tone: "live",
      href: `/exchange/tokens/${token.id}`,
      cta: "Open exchange",
    });
  }
  return out;
}

export const getProject = (token: TokenWithMarket) =>
  token.projectId ? PROJECTS.find((p) => p.id === token.projectId) : undefined;

/* ── user workspace ────────────────────────────────────────────────────── */

export const sameAddress = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function createdBy(address: string | null | undefined, tokens: TokenWithMarket[] = TOKEN_CATALOG) {
  return address ? tokens.filter((t) => sameAddress(t.creatorAddress, address)) : [];
}

export function sessionCreatedBy(address: string | null | undefined, receipts: SessionReceipt[]) {
  return address ? receipts.filter((r) => sameAddress(r.creatorAddress, address)) : [];
}

export function holdingsFor(address: string | null | undefined): Holding[] {
  return address ? DEMO_HOLDINGS[address.toLowerCase()] ?? [] : [];
}

export function holdingRows(holdings: Holding[], tokens: TokenWithMarket[] = TOKEN_CATALOG): HoldingRow[] {
  const rows: HoldingRow[] = [];
  for (const h of holdings) {
    const token = tokens.find((t) => t.id === h.tokenId);
    if (!token) continue;
    const value = h.balance * num(token.market.price);
    const c = num(token.market.priceChange24h);
    rows.push({ ...h, token, value, change24hValue: value - value / (1 + c / 100) });
  }
  return rows.sort((a, b) => b.value - a.value);
}

export function portfolioOf(rows: HoldingRow[]): Portfolio {
  const value = rows.reduce((s, r) => s + r.value, 0);
  const change = rows.reduce((s, r) => s + r.change24hValue, 0);
  const prev = value - change;
  const best = [...rows].sort((a, b) => num(b.token.market.priceChange24h) - num(a.token.market.priceChange24h))[0]?.token;
  return { value, change24hValue: change, change24hPct: prev ? (change / prev) * 100 : 0, best };
}

/** Portfolio value over 30 days, summed from the simulated series of each holding. */
export function portfolioSeries(rows: HoldingRow[]): { t: number; v: number }[] {
  if (!rows.length) return [];
  const series = rows.map((r) => simulatedSeries(r.token, "30D"));
  return series[0].map((p, i) => ({ t: p.t, v: series.reduce((s, ser, k) => s + ser[i].v * rows[k].balance, 0) }));
}

export function workspaceActivity(
  created: TokenWithMarket[],
  sessionTokens: SessionReceipt[],
  rows: HoldingRow[],
  limit = 8,
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const t of created) {
    items.push({
      id: `created-${t.id}`,
      time: Date.parse(`${t.createdAt}T12:00:00Z`),
      text: `Created ${t.name}`,
      detail: `${t.symbol} on ${t.network}`,
      href: `/tokens/${t.id}`,
      provenance: "catalog",
    });
    for (const r of tokenRelations(t).filter((x) => ["presale", "launch", "airdrop", "staking"].includes(x.kind))) {
      items.push({
        id: `rel-${r.kind}-${r.id}`,
        time: Date.parse(`${t.createdAt}T18:00:00Z`),
        text: r.title,
        detail: `${sentence(r.kind === "launch" ? "fair launch" : r.kind)} for ${t.symbol}, ${r.status.toLowerCase()}`,
        href: r.href,
        provenance: "catalog",
      });
    }
  }
  for (const s of sessionTokens) {
    const when = Date.parse(s.deployedAt);
    items.push({
      id: `session-${s.transactionHash}`,
      time: Number.isFinite(when) ? when : 0,
      text: `Deployed ${s.name}`,
      detail: `${s.symbol}, transaction ${shortAddress(s.transactionHash, 8, 6)}`,
      provenance: "session",
    });
  }
  rows.slice(0, 3).forEach((r, i) => {
    items.push({
      id: `recv-${r.tokenId}`,
      time: anchorTime(r.token) - (i + 1) * 2.3 * 86_400_000,
      text: `Received ${compactNumber(r.balance * (i === 0 ? 0.08 : 0.25))} ${r.token.symbol}`,
      detail: `Transfer into your wallet on ${r.token.network}`,
      href: `/tokens/${r.token.id}`,
      provenance: "simulated",
    });
  });

  return items.sort((a, b) => b.time - a.time).slice(0, limit);
}

/** Share of total supply that a balance represents, in percent. */
export function supplyShare(balance: number, token: TokenWithMarket): number {
  const total = parseSupply(token.totalSupply);
  return total ? (balance / total) * 100 : 0;
}
