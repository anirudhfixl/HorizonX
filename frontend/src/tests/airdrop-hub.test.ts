import { MOCK_AIRDROPS } from "../lib/mock-data";
import {
  SESSION_AIRDROPS_STORAGE_KEY,
  AIRDROP_STORAGE_EVENT,
  type SessionAirdropCampaign,
  readSessionAirdrops,
  readSessionAirdropsRaw,
  saveSessionAirdrop,
  removeSessionAirdrop,
  clearSessionAirdrops,
  subscribeSessionAirdrops,
  findSessionAirdropById,
  getAllAirdropCampaigns,
  getAirdropProvenance,
  isSepoliaNetwork,
  parseRewardAmount,
  calculateClaimProgress,
  formatTokenQuantity,
  calculateAirdropKpis,
  filterAirdropCampaigns,
} from "../lib/airdrop-storage";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("PROMINERS — PHASE 5 BATCH 1 AIRDROP HUB & STORAGE TESTS");
console.log("==========================================");

// --- Setup In-Memory Storage & Event Target for Headless Node Environment ---
const inMemoryStore = new Map<string, string>();
const listeners = new Set<() => void>();

const mockSessionStorage = {
  getItem: (key: string) => inMemoryStore.get(key) ?? null,
  setItem: (key: string, val: string) => {
    inMemoryStore.set(key, val);
  },
  removeItem: (key: string) => {
    inMemoryStore.delete(key);
  },
  clear: () => {
    inMemoryStore.clear();
  },
};

// Polyfill globalThis.sessionStorage and EventTarget dispatching for Node test
(globalThis as any).sessionStorage = mockSessionStorage;

// Hook up event dispatching on globalThis for tests
const originalAddEventListener = (globalThis as any).addEventListener;
const originalRemoveEventListener = (globalThis as any).removeEventListener;
const originalDispatchEvent = (globalThis as any).dispatchEvent;

(globalThis as any).addEventListener = (type: string, listener: any) => {
  if (type === AIRDROP_STORAGE_EVENT) {
    listeners.add(listener);
  }
};
(globalThis as any).removeEventListener = (type: string, listener: any) => {
  if (type === AIRDROP_STORAGE_EVENT) {
    listeners.delete(listener);
  }
};
(globalThis as any).dispatchEvent = (event: any) => {
  if (event.type === AIRDROP_STORAGE_EVENT) {
    listeners.forEach((fn) => fn());
    return true;
  }
  return false;
};

// --- 1. Canonical Storage Foundation & Key Naming ---
console.log("\n--- 1. Canonical Storage Foundation & Key Naming ---");

assert(
  SESSION_AIRDROPS_STORAGE_KEY === "pm_session_airdrops_v1",
  "Canonical storage key equals 'pm_session_airdrops_v1'"
);
assert(
  AIRDROP_STORAGE_EVENT === "pm_session_airdrops_changed",
  "Canonical storage change event equals 'pm_session_airdrops_changed'"
);

// Clear storage initially
clearSessionAirdrops();
assert(readSessionAirdrops().length === 0, "Initial session airdrops array is empty");
assert(readSessionAirdropsRaw() === "", "Initial raw session storage returns empty string");

// --- 2. Dynamic KPI Calculations from Available Campaign Data ---
console.log("\n--- 2. Dynamic KPI Calculations ---");

const catalogKpis = calculateAirdropKpis(MOCK_AIRDROPS);

assert(catalogKpis.totalCampaigns === 8, `Total catalog campaigns equals 8 (got ${catalogKpis.totalCampaigns})`);
assert(
  catalogKpis.activeCampaigns === 4,
  `Active campaigns count equals 4 (got ${catalogKpis.activeCampaigns})`
);
assert(
  catalogKpis.sepoliaActiveCampaigns === 3,
  `Sepolia active campaigns count equals 3 (got ${catalogKpis.sepoliaActiveCampaigns})`
);
assert(
  catalogKpis.totalRecipients === 39300,
  `Total eligible recipients equals 39,300 (got ${catalogKpis.totalRecipients})`
);
assert(
  catalogKpis.totalClaimed === 20265,
  `Total processed claims equals 20,265 (got ${catalogKpis.totalClaimed})`
);
assert(
  catalogKpis.overallClaimRate === 52,
  `Overall claim rate equals 52% (20,265 / 39,300 = 51.56% -> 52%, got ${catalogKpis.overallClaimRate}%)`
);
assert(
  catalogKpis.totalTokensNumeric === 12800000,
  `Total tokens pool numeric equals 12,800,000 (got ${catalogKpis.totalTokensNumeric})`
);
assert(
  catalogKpis.totalTokensFormatted === "12.8M",
  `Total tokens pool formatted equals '12.8M' (got ${catalogKpis.totalTokensFormatted})`
);

// --- 3. Catalog and Session Campaign Aggregation ---
console.log("\n--- 3. Catalog and Session Campaign Aggregation ---");

const allCatalogOnly = getAllAirdropCampaigns(MOCK_AIRDROPS);
assert(
  allCatalogOnly.length === 8,
  `getAllAirdropCampaigns() with empty session returns exactly 8 catalog campaigns`
);

const sampleSessionCampaign: SessionAirdropCampaign = {
  id: "session-air-1730000000-abcd",
  title: "Simulated Community Beta Drop",
  description: "Test reward pool for beta testers created in session.",
  category: "DeFi",
  type: "merkle",
  tokenId: "prominers",
  ownerAddress: "0x71C9561E873f324A3B4323E56d3935a8286C4e39",
  status: "active",
  totalReward: "100,000 PMIN",
  recipientCount: 500,
  claimedCount: 150,
  network: "Ethereum Sepolia",
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

saveSessionAirdrop(sampleSessionCampaign);

const sessionItems = readSessionAirdrops();
assert(sessionItems.length === 1, "Session items contains exactly 1 saved campaign");
assert(sessionItems[0].id === sampleSessionCampaign.id, "Session item has matching ID");
assert(sessionItems[0].title === sampleSessionCampaign.title, "Session item has matching title");

const allAggregated = getAllAirdropCampaigns(MOCK_AIRDROPS);
assert(
  allAggregated.length === 9,
  `getAllAirdropCampaigns() returns 9 campaigns (1 session + 8 catalog)`
);
assert(
  allAggregated[0].id === sampleSessionCampaign.id,
  "Session campaign appears at the front of aggregated list"
);

// Re-calculate KPIs with session campaign included
const updatedKpis = calculateAirdropKpis(allAggregated);
assert(
  updatedKpis.totalCampaigns === 9,
  `Updated total campaigns equals 9 (got ${updatedKpis.totalCampaigns})`
);
assert(
  updatedKpis.activeCampaigns === 5,
  `Updated active campaigns equals 5 (4 catalog + 1 session active, got ${updatedKpis.activeCampaigns})`
);
assert(
  updatedKpis.sepoliaActiveCampaigns === 4,
  `Updated Sepolia active campaigns equals 4 (3 catalog + 1 session active, got ${updatedKpis.sepoliaActiveCampaigns})`
);
assert(
  updatedKpis.totalRecipients === 39800,
  `Updated total recipients equals 39,800 (39,300 + 500, got ${updatedKpis.totalRecipients})`
);
assert(
  updatedKpis.totalClaimed === 20415,
  `Updated total claims equals 20,415 (20,265 + 150, got ${updatedKpis.totalClaimed})`
);
assert(
  updatedKpis.totalTokensNumeric === 12900000,
  `Updated total tokens equals 12,900,000 (12.8M + 100K, got ${updatedKpis.totalTokensNumeric})`
);
assert(
  updatedKpis.totalTokensFormatted === "12.9M",
  `Updated formatted tokens equals '12.9M' (got ${updatedKpis.totalTokensFormatted})`
);

// --- 4. Search and Quick Filter Presets ---
console.log("\n--- 4. Search and Quick Filter Presets ---");

// Preset: "all"
const allResults = filterAirdropCampaigns(allAggregated, { preset: "all" });
assert(allResults.length === 9, "Preset 'all' returns all 9 campaigns");

// Preset: "live"
const liveResults = filterAirdropCampaigns(allAggregated, { preset: "live" });
assert(liveResults.length === 5, `Preset 'live' returns 5 active campaigns (got ${liveResults.length})`);
assert(
  liveResults.every((c) => c.status === "active"),
  "All campaigns in preset 'live' have status 'active'"
);

// Preset: "sepolia"
const sepoliaResults = filterAirdropCampaigns(allAggregated, { preset: "sepolia" });
assert(
  sepoliaResults.length === 6,
  `Preset 'sepolia' returns 6 campaigns (5 catalog + 1 session on Sepolia, got ${sepoliaResults.length})`
);
assert(
  sepoliaResults.every((c) => isSepoliaNetwork(c.network)),
  "All campaigns in preset 'sepolia' are on Ethereum Sepolia"
);

// Search by title
const searchTitle = filterAirdropCampaigns(allAggregated, { searchQuery: "Genesis" });
assert(
  searchTitle.length === 1 && searchTitle[0].id === "air-pmin-genesis",
  "Search 'Genesis' matches air-pmin-genesis"
);

// Search by token symbol / tokenId
const searchToken = filterAirdropCampaigns(allAggregated, { searchQuery: "aurora" });
assert(
  searchToken.length === 1 && searchToken[0].id === "air-aurora-gpu",
  "Search 'aurora' matches air-aurora-gpu"
);

// Search session campaign
const searchSession = filterAirdropCampaigns(allAggregated, { searchQuery: "Community Beta" });
assert(
  searchSession.length === 1 && searchSession[0].id === sampleSessionCampaign.id,
  "Search 'Community Beta' matches session-created campaign"
);

// Combined search + preset
const searchCombined = filterAirdropCampaigns(allAggregated, {
  searchQuery: "Community Beta",
  preset: "live",
});
assert(
  searchCombined.length === 1 && searchCombined[0].id === sampleSessionCampaign.id,
  "Combined search 'Community Beta' + preset 'live' returns session campaign"
);

// --- 5. Data Provenance Classification ---
console.log("\n--- 5. Data Provenance Classification ---");

const catalogCampaign = MOCK_AIRDROPS[0];
assert(
  getAirdropProvenance(catalogCampaign) === "catalog",
  `Catalog campaign ${catalogCampaign.id} has provenance 'catalog'`
);

assert(
  getAirdropProvenance(sampleSessionCampaign) === "session",
  `Session campaign ${sampleSessionCampaign.id} has provenance 'session'`
);

const customSessionId = { id: "session-air-9999" };
assert(
  getAirdropProvenance(customSessionId) === "session",
  "Campaign with 'session-' prefix has provenance 'session'"
);

// --- 6. Empty States Handling ---
console.log("\n--- 6. Empty States Handling ---");

const nonMatchingSearch = filterAirdropCampaigns(allAggregated, {
  searchQuery: "xyz123_nonexistent_airdrop_query_404",
});
assert(
  nonMatchingSearch.length === 0,
  "Non-matching search returns empty array (triggers EmptyState)"
);

const nonMatchingPresetAndSearch = filterAirdropCampaigns(allAggregated, {
  searchQuery: "QuantumNet",
  statusFilter: "draft", // QuantumNet is active, not draft
});
assert(
  nonMatchingPresetAndSearch.length === 0,
  "Conflicting filters return empty array (triggers EmptyState)"
);

// --- 7. Session Subscription and Event Dispatching ---
console.log("\n--- 7. Session Subscription and Event Dispatching ---");

let callbackFiredCount = 0;
const unsubscribe = subscribeSessionAirdrops(() => {
  callbackFiredCount += 1;
});

assert(callbackFiredCount === 0, "Callback has not fired prior to mutation");

// Mutate: Save second session campaign
const secondSessionCampaign: SessionAirdropCampaign = {
  id: "session-air-1730000001-wxyz",
  title: "Second Simulated Drop",
  description: "Another test campaign.",
  type: "batch",
  tokenId: "aurora-ai",
  ownerAddress: "0x71C9561E873f324A3B4323E56d3935a8286C4e39",
  status: "active",
  totalReward: "50,000 AURA",
  recipientCount: 200,
  claimedCount: 50,
  network: "Ethereum Sepolia",
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

saveSessionAirdrop(secondSessionCampaign);
assert(
  callbackFiredCount === 1,
  `Saving session airdrop triggered storage event (count: ${callbackFiredCount})`
);

// Mutate: Remove second session campaign
const removed = removeSessionAirdrop(secondSessionCampaign.id);
assert(removed === true, "removeSessionAirdrop() returns true for existing campaign");
assert(
  callbackFiredCount === 2,
  `Removing session airdrop triggered storage event (count: ${callbackFiredCount})`
);

// Unsubscribe test
unsubscribe();
clearSessionAirdrops();
assert(
  callbackFiredCount === 2,
  "After unsubscribe, clearSessionAirdrops does not fire callback again"
);
assert(readSessionAirdrops().length === 0, "Storage cleared successfully");

// --- 8. D-04 Ethereum Sepolia Scope Enforcement ---
console.log("\n--- 8. D-04 Ethereum Sepolia Scope Enforcement ---");

assert(isSepoliaNetwork("Ethereum Sepolia") === true, "Ethereum Sepolia is recognized as Sepolia");
assert(isSepoliaNetwork("ethereum") === true, "ethereum is recognized as Sepolia scope");
assert(isSepoliaNetwork("Sepolia Testnet") === true, "Sepolia Testnet is recognized as Sepolia");
assert(isSepoliaNetwork("Arbitrum One") === false, "Arbitrum One is not Sepolia");
assert(isSepoliaNetwork("Base") === false, "Base is not Sepolia");
assert(isSepoliaNetwork("Polygon") === false, "Polygon is not Sepolia");
assert(isSepoliaNetwork(undefined) === false, "Undefined network returns false");

// --- 9. Math & Parsing Helpers ---
console.log("\n--- 9. Math & Parsing Helpers ---");

assert(parseRewardAmount("100,000 PMIN") === 100000, "parseRewardAmount('100,000 PMIN') is 100,000");
assert(parseRewardAmount("2.5M") === 2.5, "parseRewardAmount('2.5M') is 2.5");
assert(parseRewardAmount("") === 0, "parseRewardAmount('') is 0");
assert(parseRewardAmount(undefined) === 0, "parseRewardAmount(undefined) is 0");

assert(calculateClaimProgress(50, 100) === 50, "calculateClaimProgress(50, 100) is 50%");
assert(calculateClaimProgress(0, 500) === 0, "calculateClaimProgress(0, 500) is 0%");
assert(calculateClaimProgress(500, 500) === 100, "calculateClaimProgress(500, 500) is 100%");
assert(calculateClaimProgress(600, 500) === 100, "calculateClaimProgress(600, 500) caps at 100%");
assert(calculateClaimProgress(0, 0) === 0, "calculateClaimProgress(0, 0) is 0%");

assert(formatTokenQuantity(2500000) === "2.5M", "formatTokenQuantity(2500000) is '2.5M'");
assert(formatTokenQuantity(50000) === "50.0K", "formatTokenQuantity(50000) is '50.0K'");
assert(formatTokenQuantity(750) === "750", "formatTokenQuantity(750) is '750'");

console.log("\n==========================================");
console.log("ALL PHASE 5 BATCH 1 AIRDROP HUB TESTS PASSED");
console.log("==========================================\n");
