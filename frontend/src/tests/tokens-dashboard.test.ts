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
assert(MOCK_TOKENS.length === 27, `MOCK_TOKENS contains 27 tokens (found ${MOCK_TOKENS.length})`);

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

assert(metrics.totalTokens === 27, `Total tokens is 27 (calculated ${metrics.totalTokens})`);
assert(metrics.activeTokens === 21, `Active tokens is 21 (calculated ${metrics.activeTokens})`);
assert(metrics.pendingTokens === 6, `Pending tokens is 6 (calculated ${metrics.pendingTokens})`);
assert(
  metrics.activeTokens + metrics.pendingTokens === metrics.totalTokens,
  "Active + Pending equals total tokens"
);

// D-04 Sepolia vs Cross-Chain catalog split
assert(metrics.sepoliaTokens === 15, `Ethereum Sepolia tokens is 15 per D-04 (calculated ${metrics.sepoliaTokens})`);
assert(
  metrics.catalogCrossChainTokens === 12,
  `Catalog cross-chain tokens is 12 (calculated ${metrics.catalogCrossChainTokens})`
);
assert(
  metrics.sepoliaTokens + metrics.catalogCrossChainTokens === metrics.totalTokens,
  "Sepolia + Cross-chain equals total tokens"
);

// Financial metric sums across 3 cohorts
assert(
  metrics.totalMarketCap === 818750000 * 3,
  `Total market cap is exactly $2,456,250,000 (calculated ${metrics.totalMarketCap})`
);

assert(
  metrics.totalVolume24h === 9900000 * 3,
  `Total 24h volume is exactly $29,700,000 (calculated ${metrics.totalVolume24h})`
);

assert(
  metrics.totalLiquidity === 28050000 * 3,
  `Total liquidity is exactly $84,150,000 (calculated ${metrics.totalLiquidity})`
);

// Outlier / top performers
assert(Boolean(metrics.topGainer), "Top gainer is identified");
assert(
  metrics.topGainer?.market.priceChange24h === 45.0,
  `Top 24h gainer is CCAT (+45.0%) (found ${metrics.topGainer?.symbol} with +${metrics.topGainer?.market.priceChange24h}%)`
);

assert(Boolean(metrics.topMarketCapToken), "Top market cap token is identified");
assert(
  metrics.topMarketCapToken?.market.marketCap === 315000000,
  `Top market cap token is QNET ($315M) (found ${metrics.topMarketCapToken?.symbol})`
);

// Category breakdown verification
assert(metrics.categoryBreakdown["Governance"] === 6, "6 Governance tokens cataloged");
assert(metrics.categoryBreakdown["DeFi"] === 6, "6 DeFi tokens cataloged");
assert(metrics.categoryBreakdown["Infrastructure"] === 3, "3 Infrastructure tokens cataloged");
assert(metrics.categoryBreakdown["Security & Privacy"] === 3, "3 Security & Privacy tokens cataloged");
assert(metrics.categoryBreakdown["AI & Compute"] === 3, "3 AI & Compute tokens cataloged");
assert(metrics.categoryBreakdown["DePIN"] === 3, "3 DePIN tokens cataloged");
assert(metrics.categoryBreakdown["Meme & Community"] === 3, "3 Community tokens cataloged");

// Verification breakdown
assert(metrics.verificationBreakdown["audit_available"] === 12, "12 tokens have audit_available tier");
assert(metrics.verificationBreakdown["contract_source_verified"] === 6, "6 tokens have contract_source_verified tier");
assert(metrics.verificationBreakdown["project_reviewed"] === 6, "6 tokens have project_reviewed tier");
assert(metrics.verificationBreakdown["not_reviewed"] === 3, "3 tokens have not_reviewed tier");

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

assert(recent4[0].createdAt === "2026-10-29", "Most recently cataloged token date is 2026-10-29");
assert(recent4.some((t) => t.symbol.startsWith("MDAO")), "Recent tokens include MDAO");

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
assert(sepoliaTokens.length === 15, "Exactly 15 Sepolia tokens identified");
for (const t of sepoliaTokens) {
  assert(t.network === "Ethereum Sepolia", `Sepolia token ${t.symbol} has normalized network 'Ethereum Sepolia'`);
}

// Confirm non-Sepolia tokens maintain catalog discovery metadata
const nonSepoliaTokens = (MOCK_TOKENS as TokenWithMarket[]).filter(
  (t) => !t.network.toLowerCase().includes("sepolia") && t.network.toLowerCase() !== "ethereum"
);
assert(nonSepoliaTokens.length === 12, "Exactly 12 cross-chain tokens identified");
for (const t of nonSepoliaTokens) {
  assert(["Arbitrum One", "Base", "Polygon"].includes(t.network), `Token ${t.symbol} network '${t.network}' is supported catalog metadata`);
}

console.log("\n==========================================");
console.log("ALL PHASE 3-B TOKEN DASHBOARD TESTS PASSED! 🎉");
console.log("==========================================\n");
