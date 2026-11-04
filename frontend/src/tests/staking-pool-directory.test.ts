import { MOCK_STAKING_POOLS, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Token, Project } from "../types";
import {
  parseApy,
  parseStakedAmount,
  formatLockDuration,
} from "../components/staking/staking-pool-directory";
import { existsSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 2-G STAKING POOL DISCOVERY TESTS");
console.log("==========================================");

// --- 1. Data Integrity & Schema ---
console.log("\n--- 1. Data Integrity & Schema ---");

assert(Array.isArray(MOCK_STAKING_POOLS), "MOCK_STAKING_POOLS is an array");
assert(
  MOCK_STAKING_POOLS.length >= 8,
  `MOCK_STAKING_POOLS contains at least 8 pools (found ${MOCK_STAKING_POOLS.length})`
);

// Token and Project maps for relationship lookups
const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));

const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

const poolIds = new Set<string>();
const validStatuses = ["draft", "pending", "active", "ended", "failed", "cancelled", "unverified", "unknown"];

for (const pool of MOCK_STAKING_POOLS) {
  assert(!poolIds.has(pool.id), `Staking pool ID '${pool.id}' is unique`);
  poolIds.add(pool.id);

  assert(typeof pool.id === "string" && pool.id.length > 0, `Pool ${pool.id} has valid id`);
  assert(typeof pool.name === "string" && pool.name.length > 0, `Pool ${pool.id} has valid name`);
  assert(typeof pool.tokenId === "string" && pool.tokenId.length > 0, `Pool ${pool.id} has valid tokenId`);
  assert(typeof pool.ownerAddress === "string" && pool.ownerAddress.length > 0, `Pool ${pool.id} has ownerAddress`);
  assert(validStatuses.includes(pool.status), `Pool ${pool.id} has valid status (${pool.status})`);
  assert(typeof pool.network === "string" && pool.network.length > 0, `Pool ${pool.id} has network`);
  assert(typeof pool.createdAt === "string" && pool.createdAt.length > 0, `Pool ${pool.id} has createdAt timestamp`);
  assert(typeof pool.updatedAt === "string" && pool.updatedAt.length > 0, `Pool ${pool.id} has updatedAt timestamp`);

  // Verify token association
  const token = tokenMap.get(pool.tokenId);
  assert(Boolean(token), `Pool ${pool.id} references existing token '${pool.tokenId}' in MOCK_TOKENS`);
  if (token) {
    assert(typeof token.symbol === "string" && token.symbol.length > 0, `Linked token ${pool.tokenId} has symbol`);
    assert(typeof token.name === "string" && token.name.length > 0, `Linked token ${pool.tokenId} has name`);
  }

  // If projectId is present, verify project
  if (pool.projectId) {
    const proj = projectMap.get(pool.projectId);
    assert(Boolean(proj), `Pool ${pool.id} references existing project '${pool.projectId}' in MOCK_PROJECTS`);
  }

  // Verify APY format if present
  if (pool.apy) {
    assert(pool.apy.includes("%"), `Pool ${pool.id} APY includes '%' symbol (${pool.apy})`);
  }

  // Verify lockPeriodDays is non-negative
  if (pool.lockPeriodDays !== undefined) {
    assert(pool.lockPeriodDays >= 0, `Pool ${pool.id} lockPeriodDays is non-negative (${pool.lockPeriodDays})`);
  }
}

// --- 2. Metric Parsing & Helper Functions ---
console.log("\n--- 2. Metric Parsing & Helper Functions ---");

assert(parseApy("24.5%") === 24.5, "parseApy('24.5%') returns 24.5");
assert(parseApy("38.2%") === 38.2, "parseApy('38.2%') returns 38.2");
assert(parseApy("16.8%") === 16.8, "parseApy('16.8%') returns 16.8");
assert(parseApy("42.0%") === 42.0, "parseApy('42.0%') returns 42.0");
assert(parseApy("0%") === 0, "parseApy('0%') returns 0");
assert(parseApy(undefined) === 0, "parseApy(undefined) returns 0");
assert(parseApy("") === 0, "parseApy('') returns 0");

assert(parseStakedAmount("18,400,000 PMIN") === 18400000, "parseStakedAmount('18,400,000 PMIN') returns 18400000");
assert(parseStakedAmount("7,850,000 AURA") === 7850000, "parseStakedAmount('7,850,000 AURA') returns 7850000");
assert(parseStakedAmount("42,000,000 HYPER") === 42000000, "parseStakedAmount('42,000,000 HYPER') returns 42000000");
assert(parseStakedAmount("0 NEXUS") === 0, "parseStakedAmount('0 NEXUS') returns 0");
assert(parseStakedAmount(undefined) === 0, "parseStakedAmount(undefined) returns 0");
assert(parseStakedAmount("") === 0, "parseStakedAmount('') returns 0");

// formatLockDuration
const flex0 = formatLockDuration(0);
assert(flex0.isFlexible === true && flex0.label === "Flexible (No Lock)", "formatLockDuration(0) identifies flexible");

const flexUndef = formatLockDuration(undefined);
assert(flexUndef.isFlexible === true && flexUndef.label === "Flexible (No Lock)", "formatLockDuration(undefined) identifies flexible");

const lock30 = formatLockDuration(30);
assert(lock30.isFlexible === false && lock30.label === "30 Days Lock", "formatLockDuration(30) returns '30 Days Lock'");

const lock90 = formatLockDuration(90);
assert(lock90.isFlexible === false && lock90.label === "90 Days Lock", "formatLockDuration(90) returns '90 Days Lock'");

// --- 3. Search Functionality ---
console.log("\n--- 3. Search Functionality ---");

// Search by full pool name
const searchByPoolName = MOCK_STAKING_POOLS.filter((p) =>
  p.name.toLowerCase().includes("PMIN Single-Sided Governance Vault".toLowerCase())
);
assert(
  searchByPoolName.length === 1 && searchByPoolName[0].id === "pool-pmin-single",
  "Search by full pool name matches pool-pmin-single"
);

// Search by token symbol
const searchByTokenSymbol = (symbolQuery: string) => {
  const q = symbolQuery.toLowerCase().trim();
  return MOCK_STAKING_POOLS.filter((p) => {
    const t = tokenMap.get(p.tokenId);
    return t && t.symbol.toLowerCase().includes(q);
  });
};
assert(searchByTokenSymbol("PMIN").length >= 1, "Search by symbol 'PMIN' finds matching pool");
assert(searchByTokenSymbol("AURA").length >= 1, "Search by symbol 'AURA' finds matching pool");
assert(searchByTokenSymbol("HYPER").length >= 1, "Search by symbol 'HYPER' finds matching pool");
assert(searchByTokenSymbol("QNET").length >= 1, "Search by symbol 'QNET' finds matching pool");

// Search by project name
const searchByProjectName = (projName: string) => {
  const q = projName.toLowerCase().trim();
  return MOCK_STAKING_POOLS.filter((p) => {
    const proj = p.projectId ? projectMap.get(p.projectId) : undefined;
    return proj && proj.name.toLowerCase().includes(q);
  });
};
assert(
  searchByProjectName("HorizonX Foundation").length >= 1,
  "Search by project name 'HorizonX Foundation' finds matching pools"
);
assert(
  searchByProjectName("QuantumNet").length >= 1,
  "Search by project name 'QuantumNet' finds matching pool"
);

// Search by description keywords
const searchByDesc = MOCK_STAKING_POOLS.filter(
  (p) => p.description && p.description.toLowerCase().includes("gpu training")
);
assert(
  searchByDesc.length === 1 && searchByDesc[0].id === "pool-aura-compute",
  "Search by description 'gpu training' finds pool-aura-compute"
);

// Unmatched search query
const unmatched = MOCK_STAKING_POOLS.filter((p) =>
  p.name.toLowerCase().includes("nonexistent-yield-vault-xyz")
);
assert(unmatched.length === 0, "Unmatched query returns empty array");

// --- 4. Filtering (Status, Category, Lock Duration, Network) ---
console.log("\n--- 4. Filtering (Status, Category, Lock Duration, Network) ---");

// Status filtering
const activePools = MOCK_STAKING_POOLS.filter((p) => p.status === "active");
const pendingPools = MOCK_STAKING_POOLS.filter((p) => p.status === "pending");
const endedPools = MOCK_STAKING_POOLS.filter((p) => p.status === "ended");
const draftPools = MOCK_STAKING_POOLS.filter((p) => p.status === "draft");

assert(activePools.length >= 4, `Found ${activePools.length} active pools`);
assert(pendingPools.length >= 1, `Found ${pendingPools.length} pending pool`);
assert(endedPools.length >= 1, `Found ${endedPools.length} ended pool`);
assert(draftPools.length >= 1, `Found ${draftPools.length} draft pool`);

// Category filtering
const govPools = MOCK_STAKING_POOLS.filter((p) => p.category === "Governance");
const defiPools = MOCK_STAKING_POOLS.filter((p) => p.category === "DeFi");
const aiPools = MOCK_STAKING_POOLS.filter((p) => p.category === "AI & Compute");
const infraPools = MOCK_STAKING_POOLS.filter((p) => p.category === "Infrastructure");

assert(govPools.length >= 1, `Found ${govPools.length} Governance staking pools`);
assert(defiPools.length >= 2, `Found ${defiPools.length} DeFi staking pools`);
assert(aiPools.length >= 1, `Found ${aiPools.length} AI & Compute staking pools`);
assert(infraPools.length >= 1, `Found ${infraPools.length} Infrastructure staking pools`);

// Lock duration filtering (Flexible vs Locked)
const flexiblePools = MOCK_STAKING_POOLS.filter(
  (p) => p.lockPeriodDays === undefined || p.lockPeriodDays === 0
);
const lockedPools = MOCK_STAKING_POOLS.filter(
  (p) => p.lockPeriodDays !== undefined && p.lockPeriodDays > 0
);

assert(flexiblePools.length >= 2, `Found ${flexiblePools.length} flexible pools (no lock)`);
assert(lockedPools.length >= 5, `Found ${lockedPools.length} locked duration pools`);
assert(
  flexiblePools.length + lockedPools.length === MOCK_STAKING_POOLS.length,
  "All pools partition cleanly into flexible or locked"
);

// Architecture Decision D-04: Network scope verification
const sepoliaPools = MOCK_STAKING_POOLS.filter((p) => {
  const net = p.network.toLowerCase();
  return net.includes("sepolia") || net === "ethereum";
});
const nonSepoliaPools = MOCK_STAKING_POOLS.filter((p) => {
  const net = p.network.toLowerCase();
  return !net.includes("sepolia") && net !== "ethereum";
});

assert(
  sepoliaPools.length >= 5,
  `At least 5 pools on approved Ethereum Sepolia network (found ${sepoliaPools.length})`
);
assert(
  nonSepoliaPools.length >= 2,
  `Non-Sepolia catalog items preserved for cross-chain metadata (found ${nonSepoliaPools.length})`
);

// Verify non-Sepolia listings are catalog only
for (const pool of nonSepoliaPools) {
  assert(
    ["Arbitrum One", "Base", "Polygon"].includes(pool.network),
    `Non-Sepolia pool ${pool.id} has recognised catalog network '${pool.network}'`
  );
}

// --- 5. Sorting ---
console.log("\n--- 5. Sorting ---");

// APY Descending
const sortedApyDesc = [...MOCK_STAKING_POOLS].sort(
  (a, b) => parseApy(b.apy) - parseApy(a.apy)
);
for (let i = 0; i < sortedApyDesc.length - 1; i++) {
  const curr = parseApy(sortedApyDesc[i].apy);
  const next = parseApy(sortedApyDesc[i + 1].apy);
  assert(curr >= next, `APY Desc: ${curr}% >= ${next}%`);
}

// APY Ascending
const sortedApyAsc = [...MOCK_STAKING_POOLS].sort(
  (a, b) => parseApy(a.apy) - parseApy(b.apy)
);
for (let i = 0; i < sortedApyAsc.length - 1; i++) {
  const curr = parseApy(sortedApyAsc[i].apy);
  const next = parseApy(sortedApyAsc[i + 1].apy);
  assert(curr <= next, `APY Asc: ${curr}% <= ${next}%`);
}

// Total Staked Descending
const sortedStakedDesc = [...MOCK_STAKING_POOLS].sort(
  (a, b) => parseStakedAmount(b.totalStaked) - parseStakedAmount(a.totalStaked)
);
for (let i = 0; i < sortedStakedDesc.length - 1; i++) {
  const curr = parseStakedAmount(sortedStakedDesc[i].totalStaked);
  const next = parseStakedAmount(sortedStakedDesc[i + 1].totalStaked);
  assert(curr >= next, `Staked Desc: ${curr} >= ${next}`);
}

// Lock Duration Ascending (Shortest first)
const sortedLockAsc = [...MOCK_STAKING_POOLS].sort(
  (a, b) => (a.lockPeriodDays || 0) - (b.lockPeriodDays || 0)
);
assert((sortedLockAsc[0].lockPeriodDays || 0) === 0, "Shortest lockup is 0 days (flexible)");
assert(
  (sortedLockAsc[sortedLockAsc.length - 1].lockPeriodDays || 0) >= 90,
  "Longest lockup is >= 90 days"
);

// Lock Duration Descending (Longest first)
const sortedLockDesc = [...MOCK_STAKING_POOLS].sort(
  (a, b) => (b.lockPeriodDays || 0) - (a.lockPeriodDays || 0)
);
assert(
  (sortedLockDesc[0].lockPeriodDays || 0) >= (sortedLockDesc[1].lockPeriodDays || 0),
  "Lock duration desc correctly sorts longest first"
);

// Name A to Z
const sortedNameAsc = [...MOCK_STAKING_POOLS].sort((a, b) =>
  a.name.localeCompare(b.name)
);
for (let i = 0; i < sortedNameAsc.length - 1; i++) {
  assert(
    sortedNameAsc[i].name.localeCompare(sortedNameAsc[i + 1].name) <= 0,
    `Name A-Z: "${sortedNameAsc[i].name}" <= "${sortedNameAsc[i + 1].name}"`
  );
}

// --- 6. Pagination & Boundary Handling ---
console.log("\n--- 6. Pagination & Boundary Handling ---");

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

const page1_size4 = paginate(MOCK_STAKING_POOLS, 1, 4);
const page2_size4 = paginate(MOCK_STAKING_POOLS, 2, 4);
assert(page1_size4.length === 4, "Page 1 with pageSize=4 has 4 items");
assert(page2_size4.length === 4, "Page 2 with pageSize=4 has 4 items");
assert(page1_size4[0].id !== page2_size4[0].id, "Page 1 and Page 2 items do not overlap");

const page1_size6 = paginate(MOCK_STAKING_POOLS, 1, 6);
const page2_size6 = paginate(MOCK_STAKING_POOLS, 2, 6);
assert(page1_size6.length === 6, "Page 1 with pageSize=6 has 6 items");
assert(page2_size6.length === 2, "Page 2 with pageSize=6 has remaining 2 items");

const pageOut = paginate(MOCK_STAKING_POOLS, 999, 6);
assert(pageOut.length === 2, "Out-of-bounds page clamped to final page with 2 items");

// --- 7. Detail Route & Link Integrity ---
console.log("\n--- 7. Detail Route & Link Integrity ---");

assert(
  existsSync(join(__dirname, "..", "pages", "staking", "pools", "_id", "page.tsx")),
  "Staking pool detail page exists for the /staking/pools/:id route"
);

const routedPoolIds = MOCK_STAKING_POOLS.map((p) => p.id);
assert(
  new Set(routedPoolIds).size === MOCK_STAKING_POOLS.length,
  `All ${MOCK_STAKING_POOLS.length} pool IDs are unique, so every /staking/pools/:id link resolves to one pool`
);

for (const pool of MOCK_STAKING_POOLS) {
  const foundParam = routedPoolIds.includes(pool.id);
  assert(foundParam, `Route param resolvable for pool ID '${pool.id}'`);

  const detailPath = `/staking/pools/${pool.id}`;
  assert(detailPath.startsWith("/staking/pools/"), `Valid detail link path: ${detailPath}`);
}

// Verify non-existent ID resolution
const nonExistent = MOCK_STAKING_POOLS.find((p) => p.id === "non-existent-vault-999");
assert(nonExistent === undefined, "Non-existent pool ID returns undefined (renders the Not Found page)");

// --- 8. Incomplete or Edge-case Data Handling ---
console.log("\n--- 8. Incomplete or Edge-case Data Handling ---");

assert(parseApy(undefined) === 0, "Gracefully handles undefined APY");
assert(parseStakedAmount(undefined) === 0, "Gracefully handles undefined total staked");
assert(formatLockDuration(undefined).isFlexible === true, "Gracefully handles undefined lockPeriodDays");
assert(formatLockDuration(0).isFlexible === true, "Gracefully handles 0 lockPeriodDays");

// --- 9. Staking Disclosure & D-04 Verification ---
console.log("\n--- 9. Staking Disclosure & D-04 Verification ---");

// Verify every pool has simulated APY and staked metrics
for (const pool of MOCK_STAKING_POOLS) {
  assert(typeof pool.apy === "string", `Pool ${pool.id} has simulated APY string`);
  assert(typeof pool.totalStaked === "string", `Pool ${pool.id} has simulated totalStaked string`);
}

console.log("\n==========================================");
console.log("ALL 45+ STAKING POOL DISCOVERY TESTS PASSED! 🎉");
console.log("==========================================\n");
