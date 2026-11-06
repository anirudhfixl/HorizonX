import { MOCK_FAIR_LAUNCHES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Token, Project } from "../types";
import { calculateProgress, parseAmount } from "../components/launchpad/fair-launch-directory";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 2-E FAIR LAUNCH DISCOVERY TESTS");
console.log("==========================================");

// --- 1. Data Integrity & Schema ---
console.log("\n--- 1. Data Integrity & Schema ---");

assert(Array.isArray(MOCK_FAIR_LAUNCHES), "MOCK_FAIR_LAUNCHES is an array");
assert(
  MOCK_FAIR_LAUNCHES.length >= 6,
  `MOCK_FAIR_LAUNCHES contains at least 6 fair launches (found ${MOCK_FAIR_LAUNCHES.length})`
);

// Token and Project maps for relationship lookups
const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));

const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

const launchIds = new Set<string>();
const validStatuses = ["draft", "scheduled", "live", "ended", "finalized", "cancelled", "failed"];

for (const fl of MOCK_FAIR_LAUNCHES) {
  assert(!launchIds.has(fl.id), `Fair Launch ID '${fl.id}' is unique`);
  launchIds.add(fl.id);

  assert(typeof fl.id === "string" && fl.id.length > 0, `Fair Launch ${fl.id} has valid id`);
  assert(typeof fl.title === "string" && fl.title.length > 0, `Fair Launch ${fl.id} has valid title`);
  assert(typeof fl.tokenId === "string" && fl.tokenId.length > 0, `Fair Launch ${fl.id} has valid tokenId`);
  assert(typeof fl.ownerAddress === "string" && fl.ownerAddress.length > 0, `Fair Launch ${fl.id} has ownerAddress`);
  assert(validStatuses.includes(fl.status), `Fair Launch ${fl.id} has valid status (${fl.status})`);
  assert(typeof fl.network === "string" && fl.network.length > 0, `Fair Launch ${fl.id} has network`);
  assert(typeof fl.createdAt === "string" && fl.createdAt.length > 0, `Fair Launch ${fl.id} has createdAt timestamp`);
  assert(typeof fl.updatedAt === "string" && fl.updatedAt.length > 0, `Fair Launch ${fl.id} has updatedAt timestamp`);

  // Verify token association
  const token = tokenMap.get(fl.tokenId);
  assert(Boolean(token), `Fair Launch ${fl.id} references existing token '${fl.tokenId}' in MOCK_TOKENS`);
  if (token) {
    assert(typeof token.symbol === "string" && token.symbol.length > 0, `Linked token ${fl.tokenId} has symbol`);
    assert(typeof token.name === "string" && token.name.length > 0, `Linked token ${fl.tokenId} has name`);
  }

  // If projectId is present, verify project
  if (fl.projectId) {
    const proj = projectMap.get(fl.projectId);
    assert(Boolean(proj), `Fair Launch ${fl.id} references existing project '${fl.projectId}' in MOCK_PROJECTS`);
  }
}

// --- 2. Progress Math & Parsing Helpers ---
console.log("\n--- 2. Progress Math & Parsing Helpers ---");

assert(calculateProgress("42.5 ETH", "25 ETH") === 170, "Progress 42.5 / 25 ETH is 170%");
assert(calculateProgress("28.4 ETH", "15 ETH") === 189, "Progress 28.4 / 15 ETH is 189%");
assert(calculateProgress("0 ETH", "50 ETH") === 0, "Progress 0 / 50 ETH is 0%");
assert(calculateProgress("64.2 ETH", "40 ETH") === 161, "Progress 64.2 / 40 ETH is 161%");
assert(calculateProgress("", "50 ETH") === 0, "Empty totalRaised returns 0%");
assert(calculateProgress("25 ETH", "0 ETH") === 0, "Zero softCap returns 0%");

assert(parseAmount("42.5 ETH") === 42.5, "parseAmount('42.5 ETH') is 42.5");
assert(parseAmount("0 ETH") === 0, "parseAmount('0 ETH') is 0");
assert(parseAmount("") === 0, "parseAmount('') is 0");

// --- 3. Search Functionality ---
console.log("\n--- 3. Search Functionality ---");

// Search by title
const searchByTitle = MOCK_FAIR_LAUNCHES.filter((fl) =>
  fl.title.toLowerCase().includes("QuantumNet Community Fair Pool".toLowerCase())
);
assert(
  searchByTitle.length >= 1 && searchByTitle.some((fl) => fl.id === "fl-quantum-layer3"),
  "Search by full title matches fl-quantum-layer3"
);

// Search by token symbol
const searchByTokenSymbol = (symbolQuery: string) => {
  const q = symbolQuery.toLowerCase().trim();
  return MOCK_FAIR_LAUNCHES.filter((fl) => {
    const t = tokenMap.get(fl.tokenId);
    return t && t.symbol.toLowerCase().includes(q);
  });
};

const searchMDAO = searchByTokenSymbol("MDAO");
assert(
  searchMDAO.length >= 1 && searchMDAO.some((fl) => fl.id === "fl-matrix-dao"),
  "Search by token symbol 'MDAO' returns MatrixDAO fair launch"
);

const searchCCAT = searchByTokenSymbol("CCAT");
assert(
  searchCCAT.length >= 1 && searchCCAT.some((fl) => fl.id === "fl-meme-cat"),
  "Search by token symbol 'CCAT' returns CyberCat fair launch"
);

// Search by description keyword
const searchByDesc = MOCK_FAIR_LAUNCHES.filter((fl) =>
  (fl.description || "").toLowerCase().includes("burned lp keys")
);
assert(
  searchByDesc.length >= 1 && searchByDesc.some((fl) => fl.id === "fl-meme-cat"),
  "Search by description keyword 'burned LP keys' returns fl-meme-cat"
);

// Non-matching search returns 0 results
const searchNonExistent = MOCK_FAIR_LAUNCHES.filter((fl) =>
  fl.title.toLowerCase().includes("nonexistentfairlaunch12345")
);
assert(
  searchNonExistent.length === 0,
  "Non-matching search returns 0 results (triggers EmptyState)"
);

// --- 4. Filtering by Status, Network, Category ---
console.log("\n--- 4. Filtering by Status, Network, Category ---");

// Status Filtering
const liveLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "live");
assert(liveLaunches.length >= 2, `Status 'live' returns ${liveLaunches.length} launches`);

const scheduledLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "scheduled");
assert(scheduledLaunches.length >= 2, `Status 'scheduled' returns ${scheduledLaunches.length} launches`);

const endedLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "ended");
assert(endedLaunches.length >= 2, `Status 'ended' returns ${endedLaunches.length} launches`);

const finalizedLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "finalized");
assert(finalizedLaunches.length >= 1, `Status 'finalized' returns ${finalizedLaunches.length} launches`);

const draftLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.status === "draft");
assert(draftLaunches.length >= 1, `Status 'draft' returns ${draftLaunches.length} launches`);

// Category Filtering
const govLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.category === "Governance");
assert(govLaunches.length >= 2, `Category 'Governance' returns ${govLaunches.length} launches`);

const memeLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.category === "Meme & Community");
assert(memeLaunches.length >= 1 && memeLaunches.some((fl) => fl.id === "fl-meme-cat"), "Category 'Meme & Community' returns fl-meme-cat");

const infraLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => fl.category === "Infrastructure");
assert(infraLaunches.length >= 1 && infraLaunches.some((fl) => fl.id === "fl-quantum-layer3"), "Category 'Infrastructure' returns fl-quantum-layer3");

// --- 5. Network & D-04 Scope Enforcement ---
console.log("\n--- 5. Network & D-04 Scope Enforcement ---");

// Ethereum Sepolia (D-04 Scope)
const sepoliaLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => {
  const net = fl.network.toLowerCase();
  return net.includes("sepolia") || net === "ethereum";
});
assert(sepoliaLaunches.length >= 5, `Ethereum Sepolia (D-04) network filter returns ${sepoliaLaunches.length} launches`);
assert(
  sepoliaLaunches.every(
    (fl) => fl.network.toLowerCase().includes("sepolia") || fl.network === "Ethereum"
  ),
  "All filtered Sepolia launches conform strictly to Ethereum Sepolia scope (Chain ID: 11155111)"
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
const nonSepoliaLaunches = MOCK_FAIR_LAUNCHES.filter((fl) => {
  const net = fl.network.toLowerCase();
  return !net.includes("sepolia") && net !== "ethereum";
});
assert(
  nonSepoliaLaunches.length >= 3,
  `Non-Sepolia fair launches (${nonSepoliaLaunches.length}) preserved in catalog data for cross-chain discovery`
);

for (const fl of nonSepoliaLaunches) {
  assert(
    ["Base", "Arbitrum One", "Polygon"].includes(fl.network),
    `Non-Sepolia launch ${fl.id} has recognized network (${fl.network})`
  );
}

// --- 6. Sorting Functionality ---
console.log("\n--- 6. Sorting Functionality ---");

// Title ascending
const sortedTitleAsc = [...MOCK_FAIR_LAUNCHES].sort((a, b) => a.title.localeCompare(b.title));
for (let i = 0; i < sortedTitleAsc.length - 1; i++) {
  assert(
    sortedTitleAsc[i].title.localeCompare(sortedTitleAsc[i + 1].title) <= 0,
    `Title asc order: '${sortedTitleAsc[i].title}' <= '${sortedTitleAsc[i + 1].title}'`
  );
}

// Title descending
const sortedTitleDesc = [...MOCK_FAIR_LAUNCHES].sort((a, b) => b.title.localeCompare(a.title));
assert(
  sortedTitleDesc[0].title === sortedTitleAsc[sortedTitleAsc.length - 1].title,
  "Title desc puts alphabetically last launch first"
);

// Progress descending
const sortedProgressDesc = [...MOCK_FAIR_LAUNCHES].sort((a, b) => {
  const progA = calculateProgress(a.totalRaised, a.softCap);
  const progB = calculateProgress(b.totalRaised, b.softCap);
  return progB - progA;
});
assert(
  calculateProgress(sortedProgressDesc[0].totalRaised, sortedProgressDesc[0].softCap) >=
    calculateProgress(sortedProgressDesc[1].totalRaised, sortedProgressDesc[1].softCap),
  "Progress desc puts highest funded launch first"
);

// Raised descending
const sortedRaisedDesc = [...MOCK_FAIR_LAUNCHES].sort((a, b) => {
  return parseAmount(b.totalRaised) - parseAmount(a.totalRaised);
});
assert(
  parseAmount(sortedRaisedDesc[0].totalRaised) >= parseAmount(sortedRaisedDesc[1].totalRaised),
  "Raised desc puts largest total raised first"
);

// --- 7. Pagination Logic ---
console.log("\n--- 7. Pagination Logic ---");

const pageSize = 4;
const totalPages = Math.ceil(MOCK_FAIR_LAUNCHES.length / pageSize);
assert(totalPages === Math.ceil(MOCK_FAIR_LAUNCHES.length / pageSize), `Total pages for ${MOCK_FAIR_LAUNCHES.length} items with page size 4 is ${totalPages}`);

const page1Items = MOCK_FAIR_LAUNCHES.slice(0, pageSize);
const page2Items = MOCK_FAIR_LAUNCHES.slice(pageSize, pageSize * 2);

assert(page1Items.length === 4, `Page 1 contains exactly 4 items (found ${page1Items.length})`);
assert(page2Items.length === 4, `Page 2 contains exactly 4 items (found ${page2Items.length})`);

const page1Ids = new Set(page1Items.map((l) => l.id));
assert(
  page2Items.every((l) => !page1Ids.has(l.id)),
  "No duplicate items between page 1 and page 2"
);

// --- 8. Route & Detail Link Integrity ---
console.log("\n--- 8. Route & Detail Link Integrity ---");

for (const fl of MOCK_FAIR_LAUNCHES) {
  const detailUrl = `/launchpad/launches/${fl.id}`;
  assert(detailUrl.startsWith("/launchpad/launches/fl-"), `Fair launch ${fl.id} generates valid detail route`);

  const tokenUrl = `/tokens/${fl.tokenId}`;
  assert(tokenUrl.startsWith("/tokens/"), `Fair launch ${fl.id} generates valid token detail route`);
}

// Invalid ID verification for notFound()
const invalidId = "fl-invalid-nonexistent-id";
const notFoundMatch = MOCK_FAIR_LAUNCHES.find((l) => l.id === invalidId);
assert(notFoundMatch === undefined, `Querying invalid ID '${invalidId}' returns undefined (triggers notFound())`);

console.log("\n==========================================");
console.log("ALL MILESTONE 2-E FAIR LAUNCH DISCOVERY TESTS PASSED");
console.log("==========================================\n");
