/**
 * Token marketplace module: data layer, selectors, simulated datasets, routes and navigation.
 * Run with: npx tsx src/tests/token-market.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { TOKENS, PRESALES, AIRDROPS, STAKING_POOLS, FAIR_LAUNCHES, FEATURED_TOKEN_IDS, TOP_NAV_ITEMS } from "../data";
import { CHART_RANGES, DEMO_WALLET_ADDRESS } from "../lib/tokens/config";
import { circulatingSupply, seriesChange, simulatedAllocations, simulatedHolders, simulatedSeries, simulatedTrades, sparkValues } from "../lib/tokens/demo-data";
import { explorerTokenUrl, pct, usdCompact, usdPrice } from "../lib/tokens/format";
import {
  TOKEN_CATALOG, createdBy, discoveryLists, featuredTokens, holdingRows, holdingsFor, marketRank,
  portfolioOf, portfolioSeries, summarizeMarket, tokenRelations, workspaceActivity,
} from "../lib/tokens/selectors";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}
const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));

console.log("\n=== TOKEN MARKETPLACE: DATA LAYER ===");

assert(TOKEN_CATALOG === (TOKENS as unknown), "Selectors read the centralized TOKENS catalog");
assert(FEATURED_TOKEN_IDS.every((id) => TOKENS.some((t) => t.id === id)), "Every featured token id exists in the catalog");
assert(featuredTokens().length === FEATURED_TOKEN_IDS.length, "featuredTokens resolves the curated ids");

// ranking and summary
const ranks = TOKENS.map((t) => marketRank(t.id));
assert(new Set(ranks).size === TOKENS.length && Math.min(...ranks) === 1 && Math.max(...ranks) === TOKENS.length, "Market ranks are unique and span 1..N");
const sum = summarizeMarket();
assert(sum.count === TOKENS.length && sum.advancing + sum.declining === TOKENS.length, "Advancing + declining equals catalog size");
assert(near(sum.marketCap, TOKENS.reduce((s, t) => s + (t.market.marketCap ?? 0), 0)), "Market cap total matches the catalog");

// discovery lists
const lists = discoveryLists();
assert(lists.gainers[0].market.priceChange24h! >= lists.gainers[lists.gainers.length - 1].market.priceChange24h!, "Gainers sorted by 24h change descending");
assert(lists.volume.every((t, i, a) => i === 0 || a[i - 1].market.volume24h! >= t.market.volume24h!), "Volume list sorted descending");
assert(lists.recent.every((t, i, a) => i === 0 || Date.parse(a[i - 1].createdAt) >= Date.parse(t.createdAt)), "Recent list sorted by creation date");

// relations: only records that name the token, never invented
console.log("\n=== ECOSYSTEM RELATIONS ===");
for (const t of TOKENS) {
  const rel = tokenRelations(t);
  const expect =
    PRESALES.filter((p) => p.tokenId === t.id).length +
    FAIR_LAUNCHES.filter((p) => p.tokenId === t.id).length +
    AIRDROPS.filter((p) => p.tokenId === t.id).length +
    STAKING_POOLS.filter((p) => p.tokenId === t.id).length +
    (t.projectId ? 1 : 0) +
    (t.status === "active" ? 1 : 0);
  assert(rel.length === expect, `${t.symbol}: ${rel.length} relations match the linked catalog records`);
  assert(rel.every((r) => r.href.startsWith("/")), `${t.symbol}: every relation links to an internal route`);
  assert(rel.filter((r) => r.kind === "exchange").length === (t.status === "active" ? 1 : 0), `${t.symbol}: exchange link only for active tokens`);
}

// simulated series
console.log("\n=== SIMULATED DATASETS ===");
for (const t of TOKENS) {
  for (const r of CHART_RANGES) {
    const s = simulatedSeries(t, r.key);
    assert(s.length === r.points, `${t.symbol} ${r.key}: ${r.points} points`);
    assert(near(s[s.length - 1].v, t.market.price!, 1e-9), `${t.symbol} ${r.key}: series ends at the catalog price`);
    assert(s.every((p) => Number.isFinite(p.v) && p.v > 0 && p.vol >= 0), `${t.symbol} ${r.key}: finite positive values`);
  }
  const day = seriesChange(simulatedSeries(t, "24H"));
  assert(Math.abs(day - t.market.priceChange24h!) < 0.01, `${t.symbol}: 24h series change (${day.toFixed(2)}%) agrees with the catalog (${t.market.priceChange24h}%)`);
  assert(JSON.stringify(simulatedSeries(t, "7D")) === JSON.stringify(simulatedSeries(t, "7D")), `${t.symbol}: series are deterministic`);
  assert(sparkValues(t).length > 10, `${t.symbol}: sparkline values available`);
  const alloc = simulatedAllocations(t);
  assert(alloc.reduce((s, a) => s + a.pct, 0) === 100, `${t.symbol}: allocation sums to 100%`);
  const h = simulatedHolders(t);
  assert(Math.abs(h.tiers.reduce((s, x) => s + x.supplyShare, 0) - 100) < 1e-6, `${t.symbol}: holder tiers sum to 100% of supply`);
  assert(h.tiers.every((x) => x.holders >= 0 && x.supplyShare >= 0), `${t.symbol}: holder tiers are non-negative`);
  const trades = simulatedTrades(t);
  assert(trades.every((x) => /^0x[0-9a-f]{4}…[0-9a-f]{4}$/.test(x.wallet)), `${t.symbol}: trade wallets are masked, never full addresses`);
  assert(trades.every((x, i, a) => i === 0 || a[i - 1].time >= x.time), `${t.symbol}: trades newest first`);
  assert(circulatingSupply(t) > 0, `${t.symbol}: circulating supply derivable`);
}

// user workspace
console.log("\n=== USER WORKSPACE ===");
assert(holdingsFor(null).length === 0 && holdingsFor("0x0000000000000000000000000000000000000001").length === 0, "Unknown wallets have no holdings (balances are never invented)");
const rows = holdingRows(holdingsFor(DEMO_WALLET_ADDRESS));
assert(rows.length > 0 && rows.every((r, i, a) => i === 0 || a[i - 1].value >= r.value), "Demo wallet holdings resolved and sorted by value");
assert(holdingsFor(DEMO_WALLET_ADDRESS.toUpperCase().replace("0X", "0x")).length === rows.length, "Wallet address matching is case-insensitive");
const pf = portfolioOf(rows);
assert(near(pf.value, rows.reduce((s, r) => s + r.value, 0)), "Portfolio value is the sum of holdings");
const ps = portfolioSeries(rows);
assert(near(ps[ps.length - 1].v, pf.value, 1e-9), "Portfolio series ends at the current portfolio value");
const mine = createdBy(DEMO_WALLET_ADDRESS);
assert(mine.every((t) => t.creatorAddress!.toLowerCase() === DEMO_WALLET_ADDRESS), "createdBy returns only tokens created by the wallet");
const act = workspaceActivity(mine, [], rows);
assert(act.every((a) => ["catalog", "simulated", "session"].includes(a.provenance)) && !act.some((a) => (a.provenance as string) === "onchain"), "Activity is labelled catalog, simulated or session, never on-chain");
assert(act.every((a, i, arr) => i === 0 || arr[i - 1].time >= a.time), "Activity sorted newest first");

// formatting
console.log("\n=== FORMATTING ===");
assert(usdCompact(1_480_000_000) === "$1.48B" && usdCompact(2_500_000) === "$2.50M", "Compact USD formatting");
assert(usdPrice(0.000123).startsWith("$0.000123") && usdPrice(1234.5) === "$1,234.50", "Unit price keeps precision for small values");
assert(pct(1.234) === "+1.23%" && pct(-0.5) === "−0.50%", "Percent formatting uses a real minus sign");
assert(explorerTokenUrl("Ethereum Sepolia", "0xabc").startsWith("https://sepolia.etherscan.io/token/"), "Explorer URL resolves Sepolia");

// routes and navigation
console.log("\n=== ROUTES AND NAVIGATION ===");
const app = join(__dirname, "..", "pages");
for (const route of ["tokens/page.tsx", "tokens/explore/page.tsx", "tokens/_id/page.tsx", "tokens/watchlist/page.tsx", "tokens/my/page.tsx", "tokens/create/page.tsx", "tokens/_id/contract/page.tsx", "tokens/_id/activity/page.tsx", "exchange/watchlist/page.tsx"]) {
  assert(existsSync(join(app, route)), `Route file exists: pages/${route}`);
}
const read = (p: string) => readFileSync(join(app, p), "utf8");
assert(read("tokens/page.tsx").includes("TokenDashboard"), "/tokens renders the Token Dashboard");
assert(read("tokens/explore/page.tsx").includes("TokenExplore"), "/tokens/explore renders Token Explore");
assert(read("tokens/_id/page.tsx").includes("TokenDetail"), "/tokens/:id renders Token Details");
assert(read("exchange/watchlist/page.tsx").includes("TokenWatchlist"), "/exchange/watchlist shows the shared watchlist");
assert(read("explore/tokens/page.tsx").includes("/tokens/explore"), "/explore/tokens forwards to /tokens/explore");
const pageExports = (p: string) => [...read(p).matchAll(/^export\s+(?:default\s+)?(?:async\s+)?(?:function|const|type|interface)\s+(\w+)/gm)].map((m) => m[1]);
for (const p of ["tokens/page.tsx", "tokens/explore/page.tsx", "tokens/watchlist/page.tsx", "tokens/_id/page.tsx"]) {
  const bad = pageExports(p).filter((n) => !/Page$/.test(n));
  assert(bad.length === 0, `pages/${p} exports only a page component (${bad.join(", ") || "ok"})`);
}
const flat = (items: { href?: string; children?: unknown[] }[]): string[] =>
  items.flatMap((i) => [i.href ?? "", ...flat((i.children as { href?: string; children?: unknown[] }[]) ?? [])]);
const navHrefs = flat(TOP_NAV_ITEMS as never);
for (const href of ["/tokens", "/tokens/explore", "/tokens/watchlist", "/tokens/my", "/tokens/create"]) {
  assert(navHrefs.includes(href), `Navigation links to ${href}`);
}

console.log("\n🎉 ALL TOKEN MARKETPLACE TESTS PASSED\n");
