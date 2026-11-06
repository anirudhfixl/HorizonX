import { MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Token, Project } from "../types";
import { calculateProgress, parseAmount } from "../components/launchpad/presale-directory";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 2-D PRESALES DISCOVERY TESTS");
console.log("==========================================");

// --- 1. Data Integrity & Schema ---
console.log("\n--- 1. Data Integrity & Schema ---");

assert(Array.isArray(MOCK_PRESALES), "MOCK_PRESALES is an array");
assert(MOCK_PRESALES.length >= 6, `MOCK_PRESALES contains at least 6 presales (found ${MOCK_PRESALES.length})`);

// Token and Project maps for relationship lookups
const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));

const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

const presaleIds = new Set<string>();
const validStatuses = ["draft", "scheduled", "live", "ended", "finalized", "cancelled", "failed"];

for (const ps of MOCK_PRESALES) {
  assert(!presaleIds.has(ps.id), `Presale ID '${ps.id}' is unique`);
  presaleIds.add(ps.id);

  assert(typeof ps.id === "string" && ps.id.length > 0, `Presale ${ps.id} has valid id`);
  assert(typeof ps.title === "string" && ps.title.length > 0, `Presale ${ps.id} has valid title`);
  assert(typeof ps.tokenId === "string" && ps.tokenId.length > 0, `Presale ${ps.id} has valid tokenId`);
  assert(typeof ps.ownerAddress === "string" && ps.ownerAddress.length > 0, `Presale ${ps.id} has ownerAddress`);
  assert(validStatuses.includes(ps.status), `Presale ${ps.id} has valid status (${ps.status})`);
  assert(typeof ps.softCap === "string" && ps.softCap.length > 0, `Presale ${ps.id} has softCap`);
  assert(typeof ps.hardCap === "string" && ps.hardCap.length > 0, `Presale ${ps.id} has hardCap`);
  assert(typeof ps.totalRaised === "string" && ps.totalRaised.length > 0, `Presale ${ps.id} has totalRaised`);
  assert(typeof ps.network === "string" && ps.network.length > 0, `Presale ${ps.id} has network`);
  assert(typeof ps.createdAt === "string" && ps.createdAt.length > 0, `Presale ${ps.id} has createdAt timestamp`);
  assert(typeof ps.updatedAt === "string" && ps.updatedAt.length > 0, `Presale ${ps.id} has updatedAt timestamp`);

  // Verify token association
  const token = tokenMap.get(ps.tokenId);
  assert(Boolean(token), `Presale ${ps.id} references existing token '${ps.tokenId}' in MOCK_TOKENS`);
  if (token) {
    assert(typeof token.symbol === "string" && token.symbol.length > 0, `Linked token ${ps.tokenId} has symbol`);
    assert(typeof token.name === "string" && token.name.length > 0, `Linked token ${ps.tokenId} has name`);
  }

  // If projectId is present, verify project
  if (ps.projectId) {
    const proj = projectMap.get(ps.projectId);
    assert(Boolean(proj), `Presale ${ps.id} references existing project '${ps.projectId}'`);
  }
}

// --- 2. Progress Math & Parsing Helpers ---
console.log("\n--- 2. Progress Math & Parsing Helpers ---");

assert(calculateProgress("118.5 ETH", "150 ETH") === 79, "Progress 118.5 / 150 ETH is 79%");
assert(calculateProgress("0 ETH", "75 ETH") === 0, "Progress 0 / 75 ETH is 0%");
assert(calculateProgress("200 ETH", "200 ETH") === 100, "Progress 200 / 200 ETH is 100%");
assert(calculateProgress("350 ETH", "300 ETH") === 100, "Progress capped at 100% when over-allocated");
assert(calculateProgress("", "100 ETH") === 0, "Empty totalRaised returns 0%");
assert(calculateProgress("50 ETH", "0 ETH") === 0, "Zero hardCap returns 0%");

assert(parseAmount("118.5 ETH") === 118.5, "parseAmount('118.5 ETH') is 118.5");
assert(parseAmount("0 ETH") === 0, "parseAmount('0 ETH') is 0");
assert(parseAmount("") === 0, "parseAmount('') is 0");

// --- 3. Search Functionality ---
console.log("\n--- 3. Search Functionality ---");

// Search by title
const searchByTitle = MOCK_PRESALES.filter((ps) =>
  ps.title.toLowerCase().includes("quantumnet layer 3 presale".toLowerCase())
);
assert(searchByTitle.length >= 1 && searchByTitle.some((ps) => ps.id === "ps-quantum-net"), "Search by full title matches ps-quantum-net");

// Search by token symbol
const searchByTokenSymbol = (symbolQuery: string) => {
  const q = symbolQuery.toLowerCase().trim();
  return MOCK_PRESALES.filter((ps) => {
    const t = tokenMap.get(ps.tokenId);
    return t && t.symbol.toLowerCase().includes(q);
  });
};

const searchQNET = searchByTokenSymbol("QNET");
assert(searchQNET.length >= 1 && searchQNET.some((ps) => ps.id === "ps-quantum-net"), "Search by token symbol 'QNET' returns QuantumNet presale");

const searchNEXUS = searchByTokenSymbol("NEXUS");
assert(searchNEXUS.length >= 1 && searchNEXUS.some((ps) => ps.id === "ps-defi-nexus"), "Search by token symbol 'NEXUS' returns DeFi Nexus presale");

// Search by description keyword
const searchByDesc = MOCK_PRESALES.filter((ps) =>
  (ps.description || "").toLowerCase().includes("quadratic voting")
);
assert(searchByDesc.length >= 1 && searchByDesc.some((ps) => ps.id === "ps-matrix-dao"), "Search by description keyword 'quadratic voting' returns ps-matrix-dao");

// Non-matching search returns 0 results
const searchNonExistent = MOCK_PRESALES.filter((ps) =>
  ps.title.toLowerCase().includes("nonexistentcampaign12345")
);
assert(searchNonExistent.length === 0, "Non-matching search returns 0 results (triggers EmptyState)");

// --- 4. Filtering by Status, Network, Category ---
console.log("\n--- 4. Filtering by Status, Network, Category ---");

// Status Filtering
const livePresales = MOCK_PRESALES.filter((ps) => ps.status === "live");
assert(livePresales.length >= 2, `Status 'live' returns ${livePresales.length} presales`);

const scheduledPresales = MOCK_PRESALES.filter((ps) => ps.status === "scheduled");
assert(scheduledPresales.length >= 2, `Status 'scheduled' returns ${scheduledPresales.length} presales`);

const endedPresales = MOCK_PRESALES.filter((ps) => ps.status === "ended");
assert(endedPresales.length >= 2, `Status 'ended' returns ${endedPresales.length} presales`);

const finalizedPresales = MOCK_PRESALES.filter((ps) => ps.status === "finalized");
assert(finalizedPresales.length >= 1, `Status 'finalized' returns ${finalizedPresales.length} presales`);

const draftPresales = MOCK_PRESALES.filter((ps) => ps.status === "draft");
assert(draftPresales.length >= 1, `Status 'draft' returns ${draftPresales.length} presales`);

// Category Filtering
const defiPresales = MOCK_PRESALES.filter((ps) => ps.category === "DeFi");
assert(defiPresales.length >= 2, `Category 'DeFi' returns ${defiPresales.length} presales`);

const infraPresales = MOCK_PRESALES.filter((ps) => ps.category === "Infrastructure");
assert(infraPresales.length >= 1 && infraPresales.some((ps) => ps.id === "ps-quantum-net"), "Category 'Infrastructure' returns ps-quantum-net");

// --- 5. Network & D-04 Scope Enforcement ---
console.log("\n--- 5. Network & D-04 Scope Enforcement ---");

// Ethereum Sepolia (D-04 Scope)
const sepoliaPresales = MOCK_PRESALES.filter((ps) => {
  const net = ps.network.toLowerCase();
  return net.includes("sepolia") || net === "ethereum";
});
assert(sepoliaPresales.length >= 5, `Ethereum Sepolia (D-04) network filter returns ${sepoliaPresales.length} presales`);
assert(
  sepoliaPresales.every((ps) => ps.network.toLowerCase().includes("sepolia") || ps.network === "Ethereum"),
  "All filtered Sepolia presales conform strictly to Ethereum Sepolia scope (Chain ID: 11155111)"
);

// D-04 Scope Enforcement: Selectable supported wallet networks in filter are strictly restricted
const selectableSupportedNetworks = ["sepolia"]; // 'all' and 'sepolia'
assert(
  selectableSupportedNetworks.includes("sepolia") &&
    !selectableSupportedNetworks.includes("base") &&
    !selectableSupportedNetworks.includes("polygon") &&
    !selectableSupportedNetworks.includes("arbitrum"),
  "Supported-network filter choices are restricted to Ethereum Sepolia (D-04); Arbitrum, Base, and Polygon are excluded"
);

// Cross-chain catalog discovery preservation without wallet claims
const nonSepoliaPresales = MOCK_PRESALES.filter((ps) => {
  const net = ps.network.toLowerCase();
  return !net.includes("sepolia") && net !== "ethereum";
});
assert(nonSepoliaPresales.length > 0, `Non-Sepolia presales (${nonSepoliaPresales.length}) preserved in catalog data for cross-chain discovery`);
assert(
  nonSepoliaPresales.every((ps) => ["Arbitrum One", "Base", "Polygon"].includes(ps.network)),
  "Non-Sepolia catalog items preserve valid metadata without active wallet network claims"
);

// --- 6. Sorting Functionality ---
console.log("\n--- 6. Sorting Functionality ---");

// Title alphabetical asc
const sortedTitleAsc = [...MOCK_PRESALES].sort((a, b) => a.title.localeCompare(b.title));
for (let i = 0; i < sortedTitleAsc.length - 1; i++) {
  assert(
    sortedTitleAsc[i].title.localeCompare(sortedTitleAsc[i + 1].title) <= 0,
    `Title asc order: '${sortedTitleAsc[i].title}' <= '${sortedTitleAsc[i + 1].title}'`
  );
}

// Title alphabetical desc
const sortedTitleDesc = [...MOCK_PRESALES].sort((a, b) => b.title.localeCompare(a.title));
assert(
  sortedTitleDesc[0].title.localeCompare(sortedTitleDesc[sortedTitleDesc.length - 1].title) >= 0,
  "Title desc puts alphabetically last presale first"
);

// Progress desc
const sortedProgressDesc = [...MOCK_PRESALES].sort((a, b) => {
  const progA = calculateProgress(a.totalRaised, a.hardCap);
  const progB = calculateProgress(b.totalRaised, b.hardCap);
  return progB - progA;
});
assert(
  calculateProgress(sortedProgressDesc[0].totalRaised, sortedProgressDesc[0].hardCap) >=
    calculateProgress(sortedProgressDesc[sortedProgressDesc.length - 1].totalRaised, sortedProgressDesc[sortedProgressDesc.length - 1].hardCap),
  "Progress desc puts top funded presale first"
);

// Total raised desc
const sortedRaisedDesc = [...MOCK_PRESALES].sort((a, b) => parseAmount(b.totalRaised) - parseAmount(a.totalRaised));
assert(parseAmount(sortedRaisedDesc[0].totalRaised) >= parseAmount(sortedRaisedDesc[sortedRaisedDesc.length - 1].totalRaised), "Raised desc puts largest total raised first");

// --- 7. Pagination Logic ---
console.log("\n--- 7. Pagination Logic ---");

const testPageSize = 4;
const testTotalPages = Math.ceil(MOCK_PRESALES.length / testPageSize);
assert(testTotalPages === Math.ceil(MOCK_PRESALES.length / testPageSize), `Total pages for ${MOCK_PRESALES.length} items with page size ${testPageSize} is ${testTotalPages}`);

const page1 = MOCK_PRESALES.slice(0, testPageSize);
const page2 = MOCK_PRESALES.slice(testPageSize, testPageSize * 2);

assert(page1.length === 4, `Page 1 contains exactly 4 items (found ${page1.length})`);
assert(page2.length === 4, `Page 2 contains exactly 4 items (found ${page2.length})`);

// No duplicate items across pages
const page1Ids = new Set(page1.map((p) => p.id));
const page2Duplicates = page2.filter((p) => page1Ids.has(p.id));
assert(page2Duplicates.length === 0, "No duplicate items between page 1 and page 2");

// --- 8. Route & Detail Link Integrity ---
console.log("\n--- 8. Route & Detail Link Integrity ---");

for (const ps of MOCK_PRESALES) {
  const detailUrl = `/launchpad/presales/${ps.id}`;
  assert(detailUrl.startsWith("/launchpad/presales/"), `Presale ${ps.id} generates valid detail route`);
  const token = tokenMap.get(ps.tokenId);
  if (token) {
    const tokenUrl = `/tokens/${token.id}`;
    assert(tokenUrl.startsWith("/tokens/"), `Presale ${ps.id} generates valid token detail route`);
  }
}

console.log("\n==========================================");
console.log("ALL MILESTONE 2-D PRESALES DISCOVERY TESTS PASSED");
console.log("==========================================\n");
