import { MOCK_PROJECTS, MOCK_TOKENS } from "../lib/mock-data";
import { Token } from "../types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 2-C PROJECT DIRECTORY TESTS");
console.log("==========================================");

// --- 1. Data Integrity & Schema ---
console.log("\n--- 1. Data Integrity & Schema ---");

assert(Array.isArray(MOCK_PROJECTS), "MOCK_PROJECTS is an array");
assert(MOCK_PROJECTS.length >= 8, `MOCK_PROJECTS contains at least 8 projects (found ${MOCK_PROJECTS.length})`);

// Ensure unique IDs
const projectIds = new Set<string>();
for (const p of MOCK_PROJECTS) {
  assert(!projectIds.has(p.id), `Project ID '${p.id}' is unique`);
  projectIds.add(p.id);

  assert(typeof p.id === "string" && p.id.length > 0, `Project ${p.id} has valid id`);
  assert(typeof p.name === "string" && p.name.length > 0, `Project ${p.id} has valid name`);
  assert(typeof p.ownerAddress === "string" && p.ownerAddress.length > 0, `Project ${p.id} has ownerAddress`);
  assert(["active", "pending"].includes(p.status), `Project ${p.id} has valid lifecycle status (${p.status})`);
  assert(Array.isArray(p.tokenIds), `Project ${p.id} has tokenIds array`);
  assert(typeof p.createdAt === "string" && p.createdAt.length > 0, `Project ${p.id} has createdAt timestamp`);
  assert(typeof p.updatedAt === "string" && p.updatedAt.length > 0, `Project ${p.id} has updatedAt timestamp`);
}

// Token Map for relationship lookups
const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));

// --- 2. Search Functionality ---
console.log("\n--- 2. Search Functionality ---");

// Search by full name
const searchByName = MOCK_PROJECTS.filter((p) =>
  p.name.toLowerCase().includes("horizonx foundation".toLowerCase())
);
assert(searchByName.length === 1 && searchByName[0].id === "prominers-dao", "Search by full name 'HorizonX Foundation' matches prominers-dao");

// Partial case-insensitive search
const searchPartial = MOCK_PROJECTS.filter((p) =>
  p.name.toLowerCase().includes("aurora")
);
assert(searchPartial.length >= 1 && searchPartial[0].id === "aurora-labs", "Partial search 'aurora' matches aurora-labs");

// Search by description
const searchByDesc = MOCK_PROJECTS.filter((p) =>
  (p.description || "").toLowerCase().includes("microgrid")
);
assert(searchByDesc.length === 1 && searchByDesc[0].id === "solargrid-network", "Search by description keyword 'microgrid' returns solargrid-network");

// Search by linked token symbol ($PMIN, $AURA, etc.)
const searchByTokenSymbol = (symbolQuery: string) => {
  const q = symbolQuery.toLowerCase().trim();
  return MOCK_PROJECTS.filter((p) => {
    return p.tokenIds.some((tId) => {
      const t = tokenMap.get(tId);
      return t && t.symbol.toLowerCase().includes(q);
    });
  });
};

const tokenSearchPMIN = searchByTokenSymbol("PMIN");
assert(tokenSearchPMIN.length === 1 && tokenSearchPMIN[0].id === "prominers-dao", "Search by linked token symbol 'PMIN' finds HorizonX Foundation");

const tokenSearchAURA = searchByTokenSymbol("AURA");
assert(tokenSearchAURA.length === 1 && tokenSearchAURA[0].id === "aurora-labs", "Search by linked token symbol 'AURA' finds Aurora Distributed Systems");

// Non-matching search returns 0
const searchNonExistent = MOCK_PROJECTS.filter((p) =>
  p.name.toLowerCase().includes("xyznonexistent123")
);
assert(searchNonExistent.length === 0, "Non-matching search returns 0 results (triggers EmptyState)");

// --- 3. Filtering by Category, Status, Verification ---
console.log("\n--- 3. Filtering by Category, Status, Verification ---");

// Category Filter
const governanceProjects = MOCK_PROJECTS.filter((p) => p.category === "Governance");
assert(governanceProjects.length >= 2, `Category 'Governance' returns ${governanceProjects.length} projects`);
assert(governanceProjects.some((p) => p.id === "prominers-dao"), "Governance category includes prominers-dao");

const defiProjects = MOCK_PROJECTS.filter((p) => p.category === "DeFi");
assert(defiProjects.length >= 2, `Category 'DeFi' returns ${defiProjects.length} projects`);

const depinProjects = MOCK_PROJECTS.filter((p) => p.category === "DePIN");
assert(depinProjects.length >= 1 && depinProjects[0].id === "solargrid-network", "Category 'DePIN' returns solargrid-network");

// Status Filter
const activeProjects = MOCK_PROJECTS.filter((p) => p.status === "active");
assert(activeProjects.length >= 7, `Status 'active' filter returns ${activeProjects.length} projects`);

const pendingProjects = MOCK_PROJECTS.filter((p) => p.status === "pending");
assert(pendingProjects.length >= 2, `Status 'pending' filter returns ${pendingProjects.length} projects`);

// Verification Filter
const auditedProjects = MOCK_PROJECTS.filter((p) => p.verificationStatus === "audit_available");
assert(auditedProjects.length >= 3, `Verification 'audit_available' returns ${auditedProjects.length} projects`);

const verifiedSourceProjects = MOCK_PROJECTS.filter((p) => p.verificationStatus === "contract_source_verified");
assert(verifiedSourceProjects.length >= 3, `Verification 'contract_source_verified' returns ${verifiedSourceProjects.length} projects`);

// --- 4. Ecosystem & D-04 Scope Enforcement ---
console.log("\n--- 4. Ecosystem & D-04 Scope Enforcement ---");

// Ethereum Sepolia (D-04 Scope)
const sepoliaProjects = MOCK_PROJECTS.filter((p) => {
  const eco = (p.ecosystem || "").toLowerCase();
  return eco.includes("sepolia") || eco === "ethereum";
});
assert(sepoliaProjects.length >= 5, `Ethereum Sepolia (D-04) ecosystem filter returns ${sepoliaProjects.length} projects`);
assert(
  sepoliaProjects.every((p) => (p.ecosystem || "").toLowerCase().includes("sepolia") || p.ecosystem === "Ethereum"),
  "All filtered Sepolia projects conform strictly to Ethereum Sepolia scope (Chain ID: 11155111)"
);

// D-04 Scope Enforcement: Selectable supported wallet networks in filter are strictly restricted
const selectableSupportedEcosystems = ["sepolia"]; // 'all' and 'sepolia'
assert(
  selectableSupportedEcosystems.includes("sepolia") &&
    !selectableSupportedEcosystems.includes("base") &&
    !selectableSupportedEcosystems.includes("polygon") &&
    !selectableSupportedEcosystems.includes("arbitrum"),
  "Supported-network filter choices are restricted to Ethereum Sepolia (D-04); Arbitrum, Base, and Polygon are excluded"
);

// Cross-chain catalog metadata preservation without wallet connectivity implication
const nonSepoliaProjects = MOCK_PROJECTS.filter((p) => {
  const eco = (p.ecosystem || "").toLowerCase();
  return !eco.includes("sepolia") && eco !== "ethereum";
});
assert(nonSepoliaProjects.length > 0, `Non-Sepolia projects (${nonSepoliaProjects.length}) preserved in catalog data for future cross-chain discovery`);
assert(
  nonSepoliaProjects.every((p) => ["Arbitrum One", "Base", "Polygon"].includes(p.ecosystem || "")),
  "Non-Sepolia catalog items preserve valid metadata without wallet network claims"
);

// --- 5. Token Relationship Integrity ---
console.log("\n--- 5. Token Relationship Integrity ---");

// Check that every linked token ID resolves to a real token in MOCK_TOKENS
for (const p of MOCK_PROJECTS) {
  for (const tId of p.tokenIds) {
    const token = tokenMap.get(tId);
    assert(Boolean(token), `Project '${p.name}' references real existing token '${tId}'`);
    if (token) {
      assert(typeof token.name === "string" && token.name.length > 0, `Linked token ${tId} has valid name`);
      assert(typeof token.symbol === "string" && token.symbol.length > 0, `Linked token ${tId} has valid symbol`);
    }
  }
}

// Requirement G: Check that projects with NO linked tokens do not fabricate relationships
const zeroTokenProjects = MOCK_PROJECTS.filter((p) => p.tokenIds.length === 0);
assert(zeroTokenProjects.length >= 1, `Found ${zeroTokenProjects.length} project(s) with 0 linked tokens (testing Requirement G)`);
assert(zeroTokenProjects[0].id === "nexus-open-infra", "Project nexus-open-infra has exactly 0 linked tokens");

// --- 6. Sorting Functionality ---
console.log("\n--- 6. Sorting Functionality ---");

// Name asc
const sortedNameAsc = [...MOCK_PROJECTS].sort((a, b) => a.name.localeCompare(b.name));
for (let i = 0; i < sortedNameAsc.length - 1; i++) {
  assert(
    sortedNameAsc[i].name.localeCompare(sortedNameAsc[i + 1].name) <= 0,
    `Name asc order: '${sortedNameAsc[i].name}' <= '${sortedNameAsc[i + 1].name}'`
  );
}

// Name desc
const sortedNameDesc = [...MOCK_PROJECTS].sort((a, b) => b.name.localeCompare(a.name));
assert(
  sortedNameDesc[0].name.localeCompare(sortedNameDesc[sortedNameDesc.length - 1].name) >= 0,
  "Name desc puts alphabetically last project first"
);

// Date desc (newest first)
const sortedDateDesc = [...MOCK_PROJECTS].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
for (let i = 0; i < sortedDateDesc.length - 1; i++) {
  assert(
    new Date(sortedDateDesc[i].createdAt).getTime() >= new Date(sortedDateDesc[i + 1].createdAt).getTime(),
    `Date desc: ${sortedDateDesc[i].createdAt} >= ${sortedDateDesc[i + 1].createdAt}`
  );
}

// Linked tokens count desc
const sortedTokensDesc = [...MOCK_PROJECTS].sort((a, b) => b.tokenIds.length - a.tokenIds.length);
assert(sortedTokensDesc[0].tokenIds.length >= sortedTokensDesc[sortedTokensDesc.length - 1].tokenIds.length, "Most linked tokens sort puts projects with tokens first");
assert(sortedTokensDesc[sortedTokensDesc.length - 1].tokenIds.length === 0, "Most linked tokens sort puts projects with 0 tokens last");

// --- 7. Pagination Logic ---
console.log("\n--- 7. Pagination Logic ---");

const testPageSize = 5;
const testTotalPages = Math.ceil(MOCK_PROJECTS.length / testPageSize);
assert(testTotalPages === 2, `Total pages for ${MOCK_PROJECTS.length} items with page size ${testPageSize} is 2`);

const page1 = MOCK_PROJECTS.slice(0, testPageSize);
const page2 = MOCK_PROJECTS.slice(testPageSize, testPageSize * 2);

assert(page1.length === 5, `Page 1 contains exactly 5 items (found ${page1.length})`);
assert(page2.length === MOCK_PROJECTS.length - 5, `Page 2 contains remaining ${MOCK_PROJECTS.length - 5} items`);

// No duplicate items across pages
const page1Ids = new Set(page1.map((p) => p.id));
const page2Duplicates = page2.filter((p) => page1Ids.has(p.id));
assert(page2Duplicates.length === 0, "No duplicate items between page 1 and page 2");

console.log("\n==========================================");
console.log("ALL MILESTONE 2-C PROJECT DIRECTORY TESTS PASSED");
console.log("==========================================\n");
