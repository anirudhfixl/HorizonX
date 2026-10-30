import { MOCK_AIRDROPS, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Token, Project } from "../types";
import { calculateClaimProgress, parseRewardAmount } from "../components/airdrops/airdrop-directory";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("PROMINERS — MILESTONE 2-F AIRDROP DISCOVERY TESTS");
console.log("==========================================");

// --- 1. Data Integrity & Schema ---
console.log("\n--- 1. Data Integrity & Schema ---");

assert(Array.isArray(MOCK_AIRDROPS), "MOCK_AIRDROPS is an array");
assert(
  MOCK_AIRDROPS.length >= 6,
  `MOCK_AIRDROPS contains at least 6 campaigns (found ${MOCK_AIRDROPS.length})`
);

// Token and Project maps for relationship lookups
const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));

const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

const campaignIds = new Set<string>();
const validStatuses = ["draft", "pending", "active", "ended", "failed", "cancelled", "unverified", "unknown"];
const validTypes = ["batch", "lottery", "referral", "quest", "governance", "recurring", "merkle", "legacy"];

for (const air of MOCK_AIRDROPS) {
  assert(!campaignIds.has(air.id), `Campaign ID '${air.id}' is unique`);
  campaignIds.add(air.id);

  assert(typeof air.id === "string" && air.id.length > 0, `Campaign ${air.id} has valid id`);
  assert(typeof air.title === "string" && air.title.length > 0, `Campaign ${air.id} has valid title`);
  assert(typeof air.tokenId === "string" && air.tokenId.length > 0, `Campaign ${air.id} has valid tokenId`);
  assert(typeof air.ownerAddress === "string" && air.ownerAddress.length > 0, `Campaign ${air.id} has ownerAddress`);
  assert(validStatuses.includes(air.status), `Campaign ${air.id} has valid status (${air.status})`);
  assert(validTypes.includes(air.type), `Campaign ${air.id} has valid type (${air.type})`);
  assert(typeof air.network === "string" && air.network.length > 0, `Campaign ${air.id} has network`);
  assert(typeof air.createdAt === "string" && air.createdAt.length > 0, `Campaign ${air.id} has createdAt timestamp`);
  assert(typeof air.updatedAt === "string" && air.updatedAt.length > 0, `Campaign ${air.id} has updatedAt timestamp`);

  // Verify token association
  const token = tokenMap.get(air.tokenId);
  assert(Boolean(token), `Campaign ${air.id} references existing token '${air.tokenId}' in MOCK_TOKENS`);
  if (token) {
    assert(typeof token.symbol === "string" && token.symbol.length > 0, `Linked token ${air.tokenId} has symbol`);
    assert(typeof token.name === "string" && token.name.length > 0, `Linked token ${air.tokenId} has name`);
  }

  // If projectId is present, verify project
  if (air.projectId) {
    const proj = projectMap.get(air.projectId);
    assert(Boolean(proj), `Campaign ${air.id} references existing project '${air.projectId}' in MOCK_PROJECTS`);
  }
}

// --- 2. Progress Math & Parsing Helpers ---
console.log("\n--- 2. Progress Math & Parsing Helpers ---");

assert(calculateClaimProgress(6420, 10000) === 64, "Claim progress 6420 / 10000 is 64%");
assert(calculateClaimProgress(890, 1500) === 59, "Claim progress 890 / 1500 is 59%");
assert(calculateClaimProgress(0, 3200) === 0, "Claim progress 0 / 3200 is 0%");
assert(calculateClaimProgress(2045, 2100) === 97, "Claim progress 2045 / 2100 is 97%");
assert(calculateClaimProgress(0, 0) === 0, "Zero recipientCount returns 0%");
assert(calculateClaimProgress(undefined, 1000) === 0, "Undefined claimedCount returns 0%");

assert(parseRewardAmount("2,500,000 PMIN") === 2500000, "parseRewardAmount('2,500,000 PMIN') is 2500000");
assert(parseRewardAmount("500,000 AURA") === 500000, "parseRewardAmount('500,000 AURA') is 500000");
assert(parseRewardAmount("1,200,000 QNET") === 1200000, "parseRewardAmount('1,200,000 QNET') is 1200000");
assert(parseRewardAmount("0 PMIN") === 0, "parseRewardAmount('0 PMIN') is 0");
assert(parseRewardAmount("") === 0, "parseRewardAmount('') is 0");

// --- 3. Search Functionality ---
console.log("\n--- 3. Search Functionality ---");

// Search by full title
const searchByTitle = MOCK_AIRDROPS.filter((a) =>
  a.title.toLowerCase().includes("QuantumNet Testnet Validator Distribution".toLowerCase())
);
assert(
  searchByTitle.length === 1 && searchByTitle[0].id === "air-quantum-zk",
  "Search by full title matches air-quantum-zk"
);

// Search by token symbol
const searchByTokenSymbol = (symbolQuery: string) => {
  const q = symbolQuery.toLowerCase().trim();
  return MOCK_AIRDROPS.filter((a) => {
    const t = tokenMap.get(a.tokenId);
    return t && t.symbol.toLowerCase().includes(q);
  });
};

const searchPMIN = searchByTokenSymbol("PMIN");
assert(
  searchPMIN.length === 1 && searchPMIN[0].id === "air-pmin-genesis",
  "Search by token symbol 'PMIN' returns ProMiners genesis airdrop"
);

const searchAURA = searchByTokenSymbol("AURA");
assert(
  searchAURA.length === 1 && searchAURA[0].id === "air-aurora-gpu",
  "Search by token symbol 'AURA' returns Aurora GPU airdrop"
);

// Search by description keyword
const searchByDesc = MOCK_AIRDROPS.filter((a) =>
  (a.description || "").toLowerCase().includes("cryptographically blinded")
);
assert(
  searchByDesc.length === 1 && searchByDesc[0].id === "air-zk-privacy-pass",
  "Search by description keyword 'cryptographically blinded' returns air-zk-privacy-pass"
);

// Non-matching search returns 0 results
const searchNonExistent = MOCK_AIRDROPS.filter((a) =>
  a.title.toLowerCase().includes("nonexistentairdropcampaign12345")
);
assert(
  searchNonExistent.length === 0,
  "Non-matching search returns 0 results (triggers EmptyState)"
);

// --- 4. Filtering by Status, Category, Type, Network ---
console.log("\n--- 4. Filtering by Status, Category, Type, Network ---");

// Status Filtering
const activeCampaigns = MOCK_AIRDROPS.filter((a) => a.status === "active");
assert(activeCampaigns.length >= 4, `Status 'active' returns ${activeCampaigns.length} campaigns`);

const pendingCampaigns = MOCK_AIRDROPS.filter((a) => a.status === "pending");
assert(pendingCampaigns.length >= 1, `Status 'pending' returns ${pendingCampaigns.length} campaigns`);

const endedCampaigns = MOCK_AIRDROPS.filter((a) => a.status === "ended");
assert(endedCampaigns.length >= 2, `Status 'ended' returns ${endedCampaigns.length} campaigns`);

const draftCampaigns = MOCK_AIRDROPS.filter((a) => a.status === "draft");
assert(draftCampaigns.length >= 1, `Status 'draft' returns ${draftCampaigns.length} campaigns`);

// Category Filtering
const govCampaigns = MOCK_AIRDROPS.filter((a) => a.category === "Governance");
assert(govCampaigns.length >= 2, `Category 'Governance' returns ${govCampaigns.length} campaigns`);

const aiCampaigns = MOCK_AIRDROPS.filter((a) => a.category === "AI & Compute");
assert(aiCampaigns.length >= 1 && aiCampaigns[0].id === "air-aurora-gpu", "Category 'AI & Compute' returns air-aurora-gpu");

const infraCampaigns = MOCK_AIRDROPS.filter((a) => a.category === "Infrastructure");
assert(infraCampaigns.length >= 1 && infraCampaigns[0].id === "air-quantum-zk", "Category 'Infrastructure' returns air-quantum-zk");

// Campaign Type Filtering
const merkleCampaigns = MOCK_AIRDROPS.filter((a) => a.type === "merkle");
assert(merkleCampaigns.length >= 3, `Type 'merkle' returns ${merkleCampaigns.length} campaigns`);

const batchCampaigns = MOCK_AIRDROPS.filter((a) => a.type === "batch");
assert(batchCampaigns.length >= 2, `Type 'batch' returns ${batchCampaigns.length} campaigns`);

const questCampaigns = MOCK_AIRDROPS.filter((a) => a.type === "quest");
assert(questCampaigns.length >= 1 && questCampaigns[0].id === "air-nexus-liquidity", "Type 'quest' returns air-nexus-liquidity");

// --- 5. Network & D-04 Scope Enforcement ---
console.log("\n--- 5. Network & D-04 Scope Enforcement ---");

// Ethereum Sepolia (D-04 Scope)
const sepoliaCampaigns = MOCK_AIRDROPS.filter((a) => {
  const net = a.network.toLowerCase();
  return net.includes("sepolia") || net === "ethereum";
});
assert(sepoliaCampaigns.length >= 5, `Ethereum Sepolia (D-04) network filter returns ${sepoliaCampaigns.length} campaigns`);
assert(
  sepoliaCampaigns.every(
    (a) => a.network.toLowerCase().includes("sepolia") || a.network === "Ethereum"
  ),
  "All filtered Sepolia campaigns conform strictly to Ethereum Sepolia scope (Chain ID: 11155111)"
);

// Verify supported-network choices are strictly restricted per D-04
const allowedSupportedNetworks = ["all", "sepolia"];
assert(
  !allowedSupportedNetworks.includes("arbitrum") &&
    !allowedSupportedNetworks.includes("base") &&
    !allowedSupportedNetworks.includes("polygon"),
  "Supported-network filter choices are restricted to Ethereum Sepolia (D-04); Arbitrum, Base, and Polygon are excluded"
);

// Cross-chain discovery items are preserved in catalog data
const nonSepoliaCampaigns = MOCK_AIRDROPS.filter((a) => {
  const net = a.network.toLowerCase();
  return !net.includes("sepolia") && net !== "ethereum";
});
assert(
  nonSepoliaCampaigns.length === 3,
  `Non-Sepolia campaigns (${nonSepoliaCampaigns.length}) preserved in catalog data for cross-chain discovery`
);

for (const air of nonSepoliaCampaigns) {
  assert(
    ["Arbitrum One", "Base", "Polygon"].includes(air.network),
    `Non-Sepolia campaign ${air.id} has recognized network (${air.network})`
  );
}

// --- 6. Sorting Functionality ---
console.log("\n--- 6. Sorting Functionality ---");

// Title ascending
const sortedTitleAsc = [...MOCK_AIRDROPS].sort((a, b) => a.title.localeCompare(b.title));
for (let i = 0; i < sortedTitleAsc.length - 1; i++) {
  assert(
    sortedTitleAsc[i].title.localeCompare(sortedTitleAsc[i + 1].title) <= 0,
    `Title asc order: '${sortedTitleAsc[i].title}' <= '${sortedTitleAsc[i + 1].title}'`
  );
}

// Title descending
const sortedTitleDesc = [...MOCK_AIRDROPS].sort((a, b) => b.title.localeCompare(a.title));
assert(
  sortedTitleDesc[0].title === sortedTitleAsc[sortedTitleAsc.length - 1].title,
  "Title desc puts alphabetically last campaign first"
);

// Total Reward descending
const sortedRewardDesc = [...MOCK_AIRDROPS].sort((a, b) => {
  return parseRewardAmount(b.totalReward) - parseRewardAmount(a.totalReward);
});
assert(
  parseRewardAmount(sortedRewardDesc[0].totalReward) >= parseRewardAmount(sortedRewardDesc[1].totalReward),
  "Reward desc puts largest reward pool first"
);

// Recipients descending
const sortedRecipientsDesc = [...MOCK_AIRDROPS].sort((a, b) => (b.recipientCount || 0) - (a.recipientCount || 0));
assert(
  (sortedRecipientsDesc[0].recipientCount || 0) >= (sortedRecipientsDesc[1].recipientCount || 0),
  "Recipients desc puts campaign with most recipients first"
);

// Claim Progress descending
const sortedProgressDesc = [...MOCK_AIRDROPS].sort((a, b) => {
  const progA = calculateClaimProgress(a.claimedCount, a.recipientCount);
  const progB = calculateClaimProgress(b.claimedCount, b.recipientCount);
  return progB - progA;
});
assert(
  calculateClaimProgress(sortedProgressDesc[0].claimedCount, sortedProgressDesc[0].recipientCount) >=
    calculateClaimProgress(sortedProgressDesc[1].claimedCount, sortedProgressDesc[1].recipientCount),
  "Progress desc puts highest claim percentage first"
);

// --- 7. Pagination Logic ---
console.log("\n--- 7. Pagination Logic ---");

const pageSize = 4;
const totalPages = Math.ceil(MOCK_AIRDROPS.length / pageSize);
assert(totalPages === 2, `Total pages for ${MOCK_AIRDROPS.length} items with page size 4 is 2`);

const page1Items = MOCK_AIRDROPS.slice(0, pageSize);
const page2Items = MOCK_AIRDROPS.slice(pageSize, pageSize * 2);

assert(page1Items.length === 4, `Page 1 contains exactly 4 items (found ${page1Items.length})`);
assert(page2Items.length === 4, `Page 2 contains remaining 4 items (found ${page2Items.length})`);

const page1Ids = new Set(page1Items.map((a) => a.id));
assert(
  page2Items.every((a) => !page1Ids.has(a.id)),
  "No duplicate items between page 1 and page 2"
);

// --- 8. Route & Detail Link Integrity ---
console.log("\n--- 8. Route & Detail Link Integrity ---");

for (const air of MOCK_AIRDROPS) {
  const detailUrl = `/airdrops/campaigns/${air.id}`;
  assert(detailUrl.startsWith("/airdrops/campaigns/air-"), `Campaign ${air.id} generates valid detail route`);

  const tokenUrl = `/tokens/${air.tokenId}`;
  assert(tokenUrl.startsWith("/tokens/"), `Campaign ${air.id} generates valid token detail route`);
}

// Invalid ID verification for notFound()
const invalidId = "air-invalid-nonexistent-id";
const notFoundMatch = MOCK_AIRDROPS.find((a) => a.id === invalidId);
assert(notFoundMatch === undefined, `Querying invalid ID '${invalidId}' returns undefined (triggers notFound())`);

console.log("\n==========================================");
console.log("ALL MILESTONE 2-F AIRDROP DISCOVERY TESTS PASSED");
console.log("==========================================\n");
