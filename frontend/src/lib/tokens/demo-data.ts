/**
 * Simulated datasets for the Token module.
 *
 * HorizonX has no market feed and no on-chain reader yet, so price history,
 * tokenomics, holder distribution and trades are generated here. Everything is
 * deterministic (seeded by token id), anchored to the catalog record, and must be
 * labelled "simulated" wherever it is shown. Nothing here may be presented as
 * live or on-chain data.
 *
 * When a real source arrives, replace these functions one at a time; the UI
 * consumes only the return types declared in model.ts.
 */
import { CHART_RANGES } from "./config";
import { num, parseSupply } from "./format";
import type {
  Allocation,
  ChartRange,
  HolderProfile,
  SeriesPoint,
  TokenWithMarket,
  Trade,
} from "./model";

/* ── seeded randomness ─────────────────────────────────────────────────── */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hash(seed) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: () => number) => {
  const u = Math.max(1e-9, r());
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const hex = (r: () => number, n: number) =>
  Array.from({ length: n }, () => Math.floor(r() * 16).toString(16)).join("");

/** End of the simulated window: the catalog record's last update. */
export function anchorTime(token: TokenWithMarket): number {
  const t = Date.parse(`${token.updatedAt}T12:00:00Z`);
  return Number.isFinite(t) ? t : Date.UTC(2026, 9, 30, 12);
}

/* ── price history ─────────────────────────────────────────────────────── */

/**
 * A seeded price path that ends exactly at the catalog price. For the 24h
 * range it also starts at the price implied by the catalog 24h change, so the
 * chart agrees with the figure shown next to it.
 */
export function simulatedSeries(token: TokenWithMarket, range: ChartRange): SeriesPoint[] {
  const cfg = CHART_RANGES.find((r) => r.key === range) ?? CHART_RANGES[1];
  const n = cfg.points;
  const price = num(token.market.price) || 0.0001;
  const change = num(token.market.priceChange24h);
  const r = rng(`${token.id}:${range}`);

  const day = Math.log(1 + Math.max(-90, change) / 100);
  // Longer ranges drift further, with a seeded sign so charts are not all alike.
  const target = range === "24H" ? day : day * Math.sqrt(cfg.days) * (0.7 + r() * 0.6) + gauss(r) * 0.04 * Math.sqrt(cfg.days);
  const vol = 0.012 * Math.sqrt(Math.max(cfg.days, 1) / n) * (1 + Math.min(1, Math.abs(change) / 20));

  // Brownian bridge from 0 to target.
  const walk: number[] = [0];
  for (let i = 1; i < n; i++) walk.push(walk[i - 1] + gauss(r) * vol * 3);
  const end = walk[n - 1];
  const bridge = walk.map((w, i) => w - (end * i) / (n - 1) + (target * i) / (n - 1));

  const anchor = anchorTime(token);
  const span = cfg.days * 86_400_000;
  const dailyVol = num(token.market.volume24h);
  const bar = (dailyVol * cfg.days) / n;

  return bridge.map((x, i) => ({
    t: anchor - span + (span * i) / (n - 1),
    v: price * Math.exp(x - target),
    vol: Math.max(0, bar * (0.35 + r() * 1.3)),
  }));
}

/** Price change over a window, taken from a simulated series. */
export function seriesChange(series: SeriesPoint[]): number {
  if (series.length < 2 || !series[0].v) return 0;
  return (series[series.length - 1].v / series[0].v - 1) * 100;
}

/** Short sparkline path used in lists. Cached per token because lists re-render often. */
const sparkCache = new Map<string, number[]>();
export function sparkValues(token: TokenWithMarket): number[] {
  const hit = sparkCache.get(token.id);
  if (hit) return hit;
  const values = simulatedSeries(token, "7D").map((p) => p.v);
  sparkCache.set(token.id, values);
  return values;
}

/* ── tokenomics ────────────────────────────────────────────────────────── */

const ALLOCATION_TEMPLATES: Allocation[][] = [
  [
    { label: "Community and ecosystem", pct: 38, vesting: "Released linearly over 48 months" },
    { label: "Team", pct: 18, vesting: "12 month cliff, then 36 months linear" },
    { label: "Investors", pct: 14, vesting: "6 month cliff, then 24 months linear" },
    { label: "Treasury", pct: 16, vesting: "Released by governance vote" },
    { label: "Liquidity", pct: 10, vesting: "Unlocked at launch" },
    { label: "Advisors", pct: 4, vesting: "6 month cliff, then 18 months linear" },
  ],
  [
    { label: "Public sale", pct: 30, vesting: "Unlocked at launch" },
    { label: "Ecosystem rewards", pct: 28, vesting: "Emitted over 60 months" },
    { label: "Team and advisors", pct: 20, vesting: "12 month cliff, then 24 months linear" },
    { label: "Treasury", pct: 12, vesting: "Released by governance vote" },
    { label: "Liquidity", pct: 10, vesting: "Locked 12 months" },
  ],
  [
    { label: "Staking and rewards", pct: 35, vesting: "Emitted over 72 months" },
    { label: "Private sale", pct: 17, vesting: "3 month cliff, then 18 months linear" },
    { label: "Team", pct: 15, vesting: "18 month cliff, then 24 months linear" },
    { label: "Foundation", pct: 15, vesting: "Released by governance vote" },
    { label: "Liquidity", pct: 12, vesting: "Unlocked at launch" },
    { label: "Airdrops", pct: 6, vesting: "Claimable during campaigns" },
  ],
];

export function simulatedAllocations(token: TokenWithMarket): Allocation[] {
  return ALLOCATION_TEMPLATES[hash(token.id) % ALLOCATION_TEMPLATES.length];
}

/** Circulating supply implied by the catalog: market cap ÷ price. */
export function circulatingSupply(token: TokenWithMarket): number {
  const explicit = num(token.market.circulatingSupply);
  if (explicit) return explicit;
  const price = num(token.market.price);
  return price ? num(token.market.marketCap) / price : 0;
}

/* ── holders ───────────────────────────────────────────────────────────── */

/** Aggregate holder distribution. No individual wallets are ever produced. */
export function simulatedHolders(token: TokenWithMarket): HolderProfile {
  const r = rng(`${token.id}:holders`);
  const cap = Math.max(1, num(token.market.marketCap));
  const holderCount = Math.round(600 + Math.log10(cap) * 900 * (0.6 + r() * 0.8) + r() * 2000);
  const top = 28 + r() * 24; // supply held by wallets above 1%
  const large = 14 + r() * 8;
  const mid = 12 + r() * 6;
  const small = 100 - top - large - mid;
  const whaleCount = 3 + Math.floor(r() * 7);
  return {
    holderCount,
    top10Share: Math.min(top + 4, 72),
    tiers: [
      { label: "Above 1% of supply", holders: whaleCount, supplyShare: top },
      { label: "0.1% to 1%", holders: Math.round(holderCount * 0.012), supplyShare: large },
      { label: "0.01% to 0.1%", holders: Math.round(holderCount * 0.09), supplyShare: mid },
      { label: "Below 0.01%", holders: holderCount - whaleCount - Math.round(holderCount * 0.102), supplyShare: small },
    ],
  };
}

/* ── trades ────────────────────────────────────────────────────────────── */

export function simulatedTrades(token: TokenWithMarket, count = 14): Trade[] {
  const r = rng(`${token.id}:trades`);
  const series = simulatedSeries(token, "24H");
  const anchor = anchorTime(token);
  const totalSupply = parseSupply(token.totalSupply) || 1_000_000;
  const trades: Trade[] = [];
  let t = anchor;
  for (let i = 0; i < count; i++) {
    t -= Math.round((4 + r() * 38) * 60_000);
    const idx = Math.min(series.length - 1, Math.max(0, Math.round(((t - series[0].t) / (anchor - series[0].t)) * (series.length - 1))));
    const price = series[idx].v * (1 + (r() - 0.5) * 0.004);
    const roll = r();
    const amount = Math.round(totalSupply * (0.00002 + r() * r() * 0.0016));
    trades.push({
      id: `${token.id}-trade-${i}`,
      type: roll < 0.46 ? "Buy" : roll < 0.9 ? "Sell" : "Transfer",
      wallet: `0x${hex(r, 4)}…${hex(r, 4)}`,
      amount,
      price,
      value: amount * price,
      time: t,
      hash: `0x${hex(r, 64)}`,
    });
  }
  return trades;
}
