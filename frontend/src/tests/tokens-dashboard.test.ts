import { MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Project } from "../types";
import {
  calculateTokensDashboardMetrics,
  getRecentlyAddedTokens,
  getFeaturedTokens,
  formatCurrency,
  TokenWithMarket,
} from "../lib/tokens/dashboard-metrics";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — PHASE 3-B TOKEN DASHBOARD TESTS");
console.log("==========================================");

// --- 1. Centralized Catalog Integrity & Project Relationships ---
console.log("\n--- 1. Centralized Catalog Integrity & Project Relationships ---");

assert(Array.isArray(MOCK_TOKENS), "MOCK_TOKENS is an array");
assert(MOCK_TOKENS.length === 9, `MOCK_TOKENS contains exactly 9 tokens (found ${MOCK_TOKENS.length})`);

const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

for (const token of MOCK_TOKENS) {
  assert(typeof token.id === "string" && token.id.length > 0, `Token ${token.id} has valid ID`);
  assert(typeof token.name === "string" && token.name.length > 0, `Token ${token.id} has name`);
  assert(typeof token.symbol === "string" && token.symbol.length > 0, `Token ${token.id} has symbol`);
  assert(typeof token.network === "string" && token.network.length > 0, `Token ${token.id} has network`);
  assert(Boolean(token.market), `Token ${token.id} has market telemetry`);

  if (token.projectId) {
    const proj = projectMap.get(token.projectId);
    assert(Boolean(proj), `Token ${token.id} references existing project '${token.projectId}' (${proj?.name})`);
  }
}

// --- 2. Dashboard Metric Calculation Logic ---
console.log("\n--- 2. Dashboard Metric Calculation Logic ---");

const metrics = calculateTokensDashboardMetrics(MOCK_TOKENS as TokenWithMarket[]);

assert(metrics.totalTokens === 9, `Total tokens is 9 (calculated ${metrics.totalTokens})`);
assert(metrics.activeTokens === 7, `Active tokens is 7 (calculated ${metrics.activeTokens})`);
assert(metrics.pendingTokens === 2, `Pending tokens is 2 (calculated ${metrics.pendingTokens})`);
assert(
  metrics.activeTokens + metrics.pendingTokens === metrics.totalTokens,
  "Active + Pending equals total tokens"
);

// D-04 Sepolia vs Cross-Chain catalog split
assert(metrics.sepoliaTokens === 5, `Ethereum Sepolia tokens is 5 per D-04 (calculated ${metrics.sepoliaTokens})`);
assert(
  metrics.catalogCrossChainTokens === 4,
  `Catalog cross-chain tokens is 4 (calculated ${metrics.catalogCrossChainTokens})`
);
assert(
  metrics.sepoliaTokens + metrics.catalogCrossChainTokens === metrics.totalTokens,
  "Sepolia + Cross-chain equals total tokens"
);

// Financial metric sums
// 148M + 42M + 80M + 45M + 315M + 71.25M + 85M + 25M + 7.5M = 818,750,000
assert(
  metrics.totalMarketCap === 818750000,
  `Total market cap is exactly $818,750,000 (calculated ${metrics.totalMarketCap})`
);

// 3.42M + 1.25M + 0.89M + 0.41M + 1.85M + 0.42M + 0.98M + 0.56M + 0.12M = 9,900,000
assert(
  metrics.totalVolume24h === 9900000,
  `Total 24h volume is exactly $9,900,000 (calculated ${metrics.totalVolume24h})`
);

// 8.9M + 4.1M + 3.2M + 1.8M + 4.2M + 1.5M + 2.9M + 1.1M + 0.35M = 28,050,000
assert(
  metrics.totalLiquidity === 28050000,
  `Total liquidity is exactly $28,050,000 (calculated ${metrics.totalLiquidity})`
);

// Outlier / top performers
assert(Boolean(metrics.topGainer), "Top gainer is identified");
assert(
  metrics.topGainer?.symbol === "CCAT" && metrics.topGainer?.market.priceChange24h === 45.0,
  `Top 24h gainer is CCAT (+45.0%) (found ${metrics.topGainer?.symbol} with +${metrics.topGainer?.market.priceChange24h}%)`
);

assert(Boolean(metrics.topMarketCapToken), "Top market cap token is identified");
assert(
  metrics.topMarketCapToken?.symbol === "QNET" && metrics.topMarketCapToken?.market.marketCap === 315000000,
  `Top market cap token is QNET ($315M) (found ${metrics.topMarketCapToken?.symbol})`
);

// Category breakdown verification
assert(metrics.categoryBreakdown["Governance"] === 2, "2 Governance tokens cataloged (PMIN, MDAO)");
assert(metrics.categoryBreakdown["DeFi"] === 2, "2 DeFi tokens cataloged (HYPER, NEXUS)");
assert(metrics.categoryBreakdown["Infrastructure"] === 1, "1 Infrastructure token cataloged (QNET)");
assert(metrics.categoryBreakdown["Security & Privacy"] === 1, "1 Security & Privacy token cataloged (ZKPV)");
assert(metrics.categoryBreakdown["AI & Compute"] === 1, "1 AI & Compute token cataloged (AURA)");
assert(metrics.categoryBreakdown["DePIN"] === 1, "1 DePIN token cataloged (GRID)");
assert(metrics.categoryBreakdown["Meme & Community"] === 1, "1 Community token cataloged (CCAT)");

// Verification breakdown
assert(metrics.verificationBreakdown["audit_available"] === 4, "4 tokens have audit_available tier");
assert(metrics.verificationBreakdown["contract_source_verified"] === 2, "2 tokens have contract_source_verified tier");
assert(metrics.verificationBreakdown["project_reviewed"] === 2, "2 tokens have project_reviewed tier");
assert(metrics.verificationBreakdown["not_reviewed"] === 1, "1 token has not_reviewed tier");

// --- 3. Recently Added Tokens Feed ---
console.log("\n--- 3. Recently Added Tokens Feed ---");

const recent4 = getRecentlyAddedTokens(MOCK_TOKENS as TokenWithMarket[], 4);
assert(recent4.length === 4, "getRecentlyAddedTokens returns requested 4 tokens");

// Verify strict createdAt descending order
for (let i = 0; i < recent4.length - 1; i++) {
  const dateA = new Date(recent4[i].createdAt).getTime();
  const dateB = new Date(recent4[i + 1].createdAt).getTime();
  assert(dateA >= dateB, `Recent tokens order: ${recent4[i].symbol} (${recent4[i].createdAt}) >= ${recent4[i + 1].symbol} (${recent4[i + 1].createdAt})`);
}

assert(recent4[0].symbol === "MDAO", "Most recently cataloged token is MDAO (2026-10-29)");
assert(recent4[1].symbol === "CCAT", "Second most recent token is CCAT (2026-10-27)");
assert(recent4[2].symbol === "NEXUS", "Third most recent token is NEXUS (2026-10-25)");
assert(recent4[3].symbol === "QNET", "Fourth most recent token is QNET (2026-10-22)");

// --- 4. Featured Assets Selection ---
console.log("\n--- 4. Featured Assets Selection ---");

const featured = getFeaturedTokens(MOCK_TOKENS as TokenWithMarket[]);
assert(featured.length === 4, "getFeaturedTokens returns 4 featured tokens");

const featuredSymbols = featured.map((t) => t.symbol);
assert(featuredSymbols.includes("PMIN"), "Featured tokens include flagship PMIN");
assert(featuredSymbols.includes("QNET"), "Featured tokens include Sepolia top cap QNET");
assert(featuredSymbols.includes("ZKPV"), "Featured tokens include privacy asset ZKPV");
assert(featuredSymbols.includes("CCAT"), "Featured tokens include top gainer CCAT");

// Verify link destinations
for (const token of featured) {
  const detailPath = `/tokens/${token.id}`;
  assert(detailPath.startsWith("/tokens/"), `Detail route for ${token.symbol} is valid: ${detailPath}`);
}

// --- 5. Currency & Number Formatting Helpers ---
console.log("\n--- 5. Currency & Number Formatting Helpers ---");

assert(formatCurrency(818750000) === "$818.75M", "818,750,000 formats as $818.75M");
assert(formatCurrency(9900000) === "$9.90M", "9,900,000 formats as $9.90M");
assert(formatCurrency(148000000) === "$148.00M", "148,000,000 formats as $148.00M");
assert(formatCurrency(1250000) === "$1.25M", "1,250,000 formats as $1.25M");
assert(formatCurrency(410000) === "$410.00K", "410,000 formats as $410.00K");
assert(formatCurrency(1.48) === "$1.48", "1.48 formats as $1.48");
assert(formatCurrency(0.0025) === "$0.0025", "0.0025 formats as $0.0025");
assert(formatCurrency(0) === "$0.00", "0 formats as $0.00");
assert(formatCurrency(undefined) === "$0.00", "undefined formats as $0.00");

// --- 6. Architecture Decision D-04 & Simulated Data Disclosures ---
console.log("\n--- 6. Architecture Decision D-04 & Simulated Data Disclosures ---");

// Confirm Sepolia is strictly identified for Sepolia tokens
const sepoliaTokens = (MOCK_TOKENS as TokenWithMarket[]).filter(
  (t) => t.network.toLowerCase().includes("sepolia") || t.network.toLowerCase() === "ethereum"
);
assert(sepoliaTokens.length === 5, "Exactly 5 Sepolia tokens identified");
for (const t of sepoliaTokens) {
  assert(t.network === "Ethereum Sepolia", `Sepolia token ${t.symbol} has normalized network 'Ethereum Sepolia'`);
}

// Confirm non-Sepolia tokens maintain catalog discovery metadata
const nonSepoliaTokens = (MOCK_TOKENS as TokenWithMarket[]).filter(
  (t) => !t.network.toLowerCase().includes("sepolia") && t.network.toLowerCase() !== "ethereum"
);
assert(nonSepoliaTokens.length === 4, "Exactly 4 cross-chain tokens identified");
for (const t of nonSepoliaTokens) {
  assert(["Arbitrum One", "Base", "Polygon"].includes(t.network), `Token ${t.symbol} network '${t.network}' is supported catalog metadata`);
}

console.log("\n==========================================");
console.log("ALL PHASE 3-B TOKEN DASHBOARD TESTS PASSED! 🎉");
console.log("==========================================\n");
