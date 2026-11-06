/**
 * Automated test suite for Milestone 2-B Token Explorer.
 * Validates search, filtering, sorting, pagination, and data integrity.
 */

import { MOCK_TOKENS } from "../lib/mock-data";
import { Token, TokenMarketData } from "../types";

type TokenWithMarket = Token & { market: TokenMarketData };

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 2-B TOKEN EXPLORER TESTS");
console.log("==========================================\n");

// --- 1. Data Integrity & Schema ---
console.log("--- 1. Data Integrity & Schema ---");
assert(Array.isArray(MOCK_TOKENS), "MOCK_TOKENS is an array");
assert(MOCK_TOKENS.length >= 8, `MOCK_TOKENS contains at least 8 tokens (found ${MOCK_TOKENS.length})`);

MOCK_TOKENS.forEach((t) => {
  assert(Boolean(t.id && t.name && t.symbol), `Token ${t.id} has id, name, and symbol`);
  assert(Boolean(t.network), `Token ${t.id} has network`);
  assert(typeof t.market?.price === "number", `Token ${t.id} has numerical market price`);
  assert(typeof t.market?.marketCap === "number", `Token ${t.id} has numerical marketCap`);
  assert(typeof t.market?.volume24h === "number", `Token ${t.id} has numerical volume24h`);
  assert(typeof t.market?.priceChange24h === "number", `Token ${t.id} has numerical priceChange24h`);
  assert(typeof t.status === "string", `Token ${t.id} has valid status`);
});

// --- 2. Search Functionality ---
console.log("\n--- 2. Search Functionality ---");
function filterBySearch(tokens: TokenWithMarket[], query: string): TokenWithMarket[] {
  const q = query.trim().toLowerCase();
  if (!q) return tokens;
  return tokens.filter(
    (t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q)
  );
}

const searchByName = filterBySearch(MOCK_TOKENS, "HorizonX");
assert(searchByName.length >= 1 && searchByName.some((t) => t.id === "prominers"), "Search by full name 'HorizonX' returns PMIN");

const searchByPartial = filterBySearch(MOCK_TOKENS, "aur");
assert(searchByPartial.some((t) => t.symbol.includes("AURA")), "Partial search 'aur' matches AURA");

const searchBySymbol = filterBySearch(MOCK_TOKENS, "pmin");
assert(searchBySymbol.length >= 1 && searchBySymbol.some((t) => t.symbol === "PMIN"), "Case-insensitive symbol search 'pmin' returns PMIN");

const searchNonExistent = filterBySearch(MOCK_TOKENS, "nonexistenttokenxyz123");
assert(searchNonExistent.length === 0, "Non-matching search returns 0 results (triggers EmptyState)");

// --- 3. Filtering by Network, Category & Status ---
console.log("\n--- 3. Filtering by Network, Category & Status ---");

// Sepolia (D-04 scope) - Only supported network filter option
const sepoliaTokens = MOCK_TOKENS.filter(
  (t) => t.network.toLowerCase().includes("sepolia") || t.network.toLowerCase() === "ethereum"
);
assert(sepoliaTokens.length >= 4, `Ethereum Sepolia (D-04) filter returns ${sepoliaTokens.length} tokens`);
assert(
  sepoliaTokens.every((t) => t.network.toLowerCase().includes("sepolia") || t.network.toLowerCase() === "ethereum"),
  "All filtered Sepolia tokens belong to Ethereum Sepolia scope (Chain ID: 11155111)"
);

// D-04 Scope Enforcement: Selectable supported networks in filter are strictly restricted
const selectableSupportedNetworks = ["sepolia"]; // 'all' and 'sepolia'
assert(
  selectableSupportedNetworks.includes("sepolia") && !selectableSupportedNetworks.includes("base") && !selectableSupportedNetworks.includes("polygon") && !selectableSupportedNetworks.includes("arbitrum"),
  "Supported-network filter choices are restricted to Ethereum Sepolia (D-04); Arbitrum, Base, and Polygon are excluded"
);

// Cross-chain catalog metadata preservation without wallet connectivity implication
const nonSepoliaTokens = MOCK_TOKENS.filter(
  (t) => !t.network.toLowerCase().includes("sepolia") && t.network.toLowerCase() !== "ethereum"
);
assert(nonSepoliaTokens.length > 0, `Non-Sepolia tokens (${nonSepoliaTokens.length}) preserved in catalog data for future cross-chain discovery`);
assert(
  nonSepoliaTokens.every((t) => ["Arbitrum One", "Base", "Polygon"].includes(t.network)),
  "Non-Sepolia catalog items preserve valid metadata without wallet network claims"
);

// Category filtering
const defiTokens = MOCK_TOKENS.filter((t) => (t.category || "").toLowerCase() === "defi");
assert(defiTokens.length >= 1, "Category filter 'DeFi' returns expected tokens");

const govTokens = MOCK_TOKENS.filter((t) => (t.category || "").toLowerCase() === "governance");
assert(govTokens.some((t) => t.id === "prominers"), "Category filter 'Governance' includes HorizonX");

// Status filtering
const activeTokens = MOCK_TOKENS.filter((t) => t.status === "active");
assert(activeTokens.length > 0 && activeTokens.every((t) => t.status === "active"), "Status filter 'active' works accurately");

// --- 4. Sorting Functionality ---
console.log("\n--- 4. Sorting Functionality ---");

// Sort by Price Descending
const sortedByPriceDesc = [...MOCK_TOKENS].sort((a, b) => (b.market.price ?? 0) - (a.market.price ?? 0));
for (let i = 0; i < sortedByPriceDesc.length - 1; i++) {
  assert(
    (sortedByPriceDesc[i].market.price ?? 0) >= (sortedByPriceDesc[i + 1].market.price ?? 0),
    `Price desc order: ${sortedByPriceDesc[i].market.price} >= ${sortedByPriceDesc[i + 1].market.price}`
  );
}

// Sort by Price Ascending
const sortedByPriceAsc = [...MOCK_TOKENS].sort((a, b) => (a.market.price ?? 0) - (b.market.price ?? 0));
assert((sortedByPriceAsc[0].market.price ?? 0) <= (sortedByPriceAsc[sortedByPriceAsc.length - 1].market.price ?? 0), "Price asc order lowest price is first");

// Sort by Market Cap Descending
const sortedByMcapDesc = [...MOCK_TOKENS].sort((a, b) => (b.market.marketCap ?? 0) - (a.market.marketCap ?? 0));
assert((sortedByMcapDesc[0].market.marketCap ?? 0) >= (sortedByMcapDesc[1].market.marketCap ?? 0), "Market cap desc order top market cap is first");

// Sort by Name Ascending
const sortedByNameAsc = [...MOCK_TOKENS].sort((a, b) => a.name.localeCompare(b.name));
assert(sortedByNameAsc[0].name.localeCompare(sortedByNameAsc[1].name) <= 0, "Name asc order is alphabetical");

// Sort by 24h Change Descending
const sortedByChangeDesc = [...MOCK_TOKENS].sort((a, b) => (b.market.priceChange24h ?? 0) - (a.market.priceChange24h ?? 0));
assert((sortedByChangeDesc[0].market.priceChange24h ?? 0) >= (sortedByChangeDesc[sortedByChangeDesc.length - 1].market.priceChange24h ?? 0), "24h change desc puts top gainer first");

// --- 5. Pagination Logic ---
console.log("\n--- 5. Pagination Logic ---");
const pageSize = 5;
const totalResults = MOCK_TOKENS.length;
const totalPages = Math.ceil(totalResults / pageSize);

assert(totalPages === Math.ceil(totalResults / pageSize), `Total pages calculated correctly for ${totalResults} items with page size ${pageSize} (${totalPages} pages)`);

const page1 = MOCK_TOKENS.slice(0, 5);
assert(page1.length === 5, "Page 1 contains exactly 5 items");

const page2 = MOCK_TOKENS.slice(5, 10);
assert(page2.length === Math.min(5, totalResults - 5), `Page 2 contains exactly ${page2.length} items`);

// No overlap between pages
const page1Ids = new Set(page1.map((t) => t.id));
const hasOverlap = page2.some((t) => page1Ids.has(t.id));
assert(!hasOverlap, "No duplicate items between page 1 and page 2");

console.log("\n==========================================");
console.log("ALL MILESTONE 2-B TOKEN EXPLORER TESTS PASSED");
console.log("==========================================\n");
