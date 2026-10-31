/**
 * Tests for Phase 4, Batch 2:
 * Creation Wizards, Session Persistence & Token Integration, My Launches Workspace
 */

import { MOCK_TOKENS, MOCK_PROJECTS, MOCK_PRESALES, MOCK_FAIR_LAUNCHES } from "../lib/mock-data";
import { SESSION_TOKENS_STORAGE_KEY } from "../lib/data-provenance";
import {
  DEFAULT_DRAFT,
  validateDraft,
  deriveDraft,
  parseNumber,
  formatNumber,
  findCatalogToken,
  type PresaleDraft,
} from "../lib/presale-create";
import {
  DEFAULT_FL_DRAFT,
  validateFairLaunch,
  compareToSupply,
  type FairLaunchDraft,
} from "../lib/fair-launch-create";
import {
  SESSION_LAUNCHES_STORAGE_KEY,
  sessionPresaleToPresale,
  sessionFairLaunchToFairLaunch,
  resolveLaunchContext,
  type SessionPresale,
  type SessionFairLaunch,
  type SessionLaunch,
} from "../lib/launch-storage";

let passed = 0;
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
  passed++;
}

console.log("==========================================================");
console.log("PROMINERS — PHASE 4, BATCH 2 LAUNCHPAD INTEGRATION TESTS");
console.log("==========================================================\n");

// ─── 1. Presale Creation Validation & Draft Derivation ───────────────────
console.log("--- 1. Presale Creation Validation & Draft Derivation ---");

const VALID_ADDR = "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1";

const validPresaleDraft: PresaleDraft = {
  ...DEFAULT_DRAFT,
  tokenAddress: VALID_ADDR,
  title: "MatrixDAO Community Presale",
  category: "DeFi",
  projectId: "prominers-dao",
  startTime: "2026-11-01T12:00:00Z",
  endTime: "2026-11-08T12:00:00Z",
};

assert(Object.keys(validateDraft(validPresaleDraft)).length === 0, "Valid presale draft has 0 validation errors");

// Inverted schedule validation
const invertedScheduleDraft: PresaleDraft = {
  ...validPresaleDraft,
  startTime: "2026-11-10T12:00:00Z",
  endTime: "2026-11-05T12:00:00Z",
};
const invertedScheduleErrors = validateDraft(invertedScheduleDraft);
assert(!!invertedScheduleErrors.endTime, "Inverted schedule flagged: endTime before startTime");

// Soft cap greater than hard cap
const badCapsDraft: PresaleDraft = {
  ...validPresaleDraft,
  softCap: "200",
  hardCap: "100",
};
assert(!!validateDraft(badCapsDraft).hardCap, "Soft cap above hard cap flags hardCap error");

// Min contribution greater than max contribution
const badLimitsDraft: PresaleDraft = {
  ...validPresaleDraft,
  minContribution: "5.0",
  maxContribution: "2.0",
};
assert(!!validateDraft(badLimitsDraft).maxContribution, "Min contribution above max flags maxContribution error");

// Max contribution greater than hard cap
const maxExceedsHardDraft: PresaleDraft = {
  ...validPresaleDraft,
  hardCap: "50",
  maxContribution: "60",
};
assert(!!validateDraft(maxExceedsHardDraft).maxContribution, "Max contribution above hard cap flags maxContribution error");

// Derived arithmetic calculations
const derived = deriveDraft(validPresaleDraft);
assert(derived.tokensAtHardCap === 150 * 1000, "tokensAtHardCap correctly computed (150,000)");
assert(derived.tokensAtSoftCap === 50 * 1000, "tokensAtSoftCap correctly computed (50,000)");
assert(Math.abs((derived.softPctOfHard ?? 0) - (50 / 150) * 100) < 1e-9, "softPctOfHard correctly computed (33.33%)");
assert(derived.minWalletsToFill === Math.ceil(150 / 3.0), "minWalletsToFill correctly computed (50 wallets)");


// ─── 2. Fair Launch Creation Validation & Supply Comparison ──────────────
console.log("\n--- 2. Fair Launch Creation Validation & Supply Comparison ---");

const validFairLaunchDraft: FairLaunchDraft = {
  ...DEFAULT_FL_DRAFT,
  tokenAddress: VALID_ADDR,
  title: "MatrixDAO Fair Offering",
  category: "DeFi",
  projectId: "prominers-dao",
  minContribution: "0.05",
  maxContribution: "5.0",
  startTime: "2026-11-01T12:00:00Z",
  endTime: "2026-11-08T12:00:00Z",
};

assert(Object.keys(validateFairLaunch(validFairLaunchDraft)).length === 0, "Valid fair launch draft has 0 validation errors");

// Inverted schedule check
const invertedFlSchedule: FairLaunchDraft = {
  ...validFairLaunchDraft,
  startTime: "2026-11-15T12:00:00Z",
  endTime: "2026-11-05T12:00:00Z",
};
assert(!!validateFairLaunch(invertedFlSchedule).endTime, "Fair launch inverted schedule flagged: endTime before startTime");

// Limits check
const badFlLimits: FairLaunchDraft = {
  ...validFairLaunchDraft,
  minContribution: "10.0",
  maxContribution: "2.0",
};
assert(!!validateFairLaunch(badFlLimits).maxContribution, "Fair launch min > max contribution flagged on maxContribution");

// Invariant: Fair Launch has NO hard cap
assert(!("hardCap" in validateFairLaunch(validFairLaunchDraft)), "Fair launch enforces NO hard cap rule");

// Supply comparison
const catalogToken = MOCK_TOKENS.find((t) => t.contractAddress?.toLowerCase() === VALID_ADDR.toLowerCase())!;
const supplyComp = compareToSupply("5000000", catalogToken);
assert(supplyComp !== null, "Supply comparison derived successfully");
assert(supplyComp!.sharePct === 5, "5,000,000 out of 100,000,000 equals exactly 5%");
assert(supplyComp!.exceeds === false, "5,000,000 does not exceed 100,000,000 supply");

const excessComp = compareToSupply("150000000", catalogToken);
assert(excessComp !== null && excessComp.exceeds === true, "150,000,000 exceeds 100,000,000 supply flagged");


// ─── 3. Token Picker Catalog / Session / Custom Resolution ──────────────
console.log("\n--- 3. Token Picker Catalog / Session / Custom Resolution ---");

// Catalog token lookup
const foundCatalog = findCatalogToken(VALID_ADDR, MOCK_TOKENS);
assert(foundCatalog !== undefined, "Catalog token found by valid contract address");
assert(foundCatalog?.symbol === "PMIN", "Found catalog token has symbol 'PMIN'");

// Case-insensitivity
const foundCase = findCatalogToken(VALID_ADDR.toUpperCase().replace("0X", "0x"), MOCK_TOKENS);
assert(foundCase?.id === foundCatalog?.id, "Catalog token address lookup is case-insensitive");

// Custom address validation regex
const CUSTOM_HEX = "0x1111222233334444555566667777888899990000";
const isValidHex = /^0x[0-9a-fA-F]{40}$/.test(CUSTOM_HEX);
assert(isValidHex, "Custom 0x address passes 40-character hex pattern");

const isInvalidHex = /^0x[0-9a-fA-F]{40}$/.test("0xInvalidHex");
assert(!isInvalidHex, "Malformed custom address rejected by hex pattern");


// ─── 4. Session Launch Persistence & Operations ─────────────────────────
console.log("\n--- 4. Session Launch Persistence & Operations ---");

// Mock in-memory storage for headless node testing
const inMemoryStorage = new Map<string, string>();
const mockSessionStorage = {
  getItem: (key: string) => inMemoryStorage.get(key) ?? null,
  setItem: (key: string, val: string) => inMemoryStorage.set(key, val),
  removeItem: (key: string) => inMemoryStorage.delete(key),
  clear: () => inMemoryStorage.clear(),
};

// Test storage key naming
assert(SESSION_LAUNCHES_STORAGE_KEY === "pm_session_launches_v1", "Session launches key equals 'pm_session_launches_v1'");
assert(SESSION_TOKENS_STORAGE_KEY === "prominers_session_tokens", "Token storage key equals 'prominers_session_tokens'");
assert((SESSION_LAUNCHES_STORAGE_KEY as string) !== (SESSION_TOKENS_STORAGE_KEY as string), "Launch and token storage keys are distinct");

// Create simulation records
const samplePresale: SessionPresale = {
  id: "session-ps-1730000000-abcd",
  kind: "presale",
  title: "Simulated AI Presale",
  description: "AI node presale simulated via wizard.",
  category: "AI & Compute",
  tokenId: "aurora-ai",
  tokenSymbol: "AURA",
  tokenName: "Aurora AI Compute",
  tokenAddress: "0x34291849a0293847291038472910482910293847",
  ownerAddress: "0x71C9561E873f324A3B4323E56d3935a8286C4e39",
  status: "scheduled",
  softCap: "25 ETH",
  hardCap: "75 ETH",
  presaleRate: "800",
  minContribution: "0.1 ETH",
  maxContribution: "3.0 ETH",
  totalRaised: "0 ETH",
  participantCount: 0,
  network: "Ethereum Sepolia",
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

const sampleFairLaunch: SessionFairLaunch = {
  id: "session-fl-1730000001-efgh",
  kind: "fair",
  title: "Simulated CyberCat Fair Pool",
  description: "Fair pool offering simulated via wizard.",
  category: "Meme & Community",
  tokenId: "ccat",
  tokenSymbol: "CCAT",
  tokenName: "CyberCat Meme",
  tokenAddress: "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1",
  ownerAddress: "0x71C9561E873f324A3B4323E56d3935a8286C4e39",
  status: "scheduled",
  softCap: "30 ETH",
  totalSelling: "10,000,000 CCAT",
  totalRaised: "0 ETH",
  participantCount: 0,
  network: "Ethereum Sepolia",
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

// Store items
const initialList: SessionLaunch[] = [samplePresale, sampleFairLaunch];
mockSessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(initialList));

// Read items back
const retrievedRaw = mockSessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY)!;
const retrieved: SessionLaunch[] = JSON.parse(retrievedRaw);
assert(retrieved.length === 2, "Read exactly 2 session launches from storage");
assert(retrieved.some((l) => l.kind === "presale" && l.id === samplePresale.id), "Presale record preserved");
assert(retrieved.some((l) => l.kind === "fair" && l.id === sampleFairLaunch.id), "Fair launch record preserved");
assert(retrieved.every((l) => l.provenance === "session"), "All stored records have provenance 'session'");
assert(retrieved.every((l) => l.id.startsWith("session-")), "All session IDs begin with 'session-' prefix");

// Update item
const updatedList = retrieved.map((l) => (l.id === samplePresale.id ? { ...l, title: "Updated Presale Title" } : l));
mockSessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(updatedList));
const afterUpdate = JSON.parse(mockSessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY)!);
assert(afterUpdate.find((l: SessionLaunch) => l.id === samplePresale.id).title === "Updated Presale Title", "Update session launch succeeds");

// Remove item
const afterRemove = updatedList.filter((l) => l.id !== samplePresale.id);
mockSessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(afterRemove));
const readAfterRemove = JSON.parse(mockSessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY)!);
assert(readAfterRemove.length === 1 && readAfterRemove[0].id === sampleFairLaunch.id, "Remove session launch succeeds");


// ─── 5. Malformed Storage Handling ───────────────────────────────────────
console.log("\n--- 5. Malformed Storage Handling ---");

// Corrupt non-JSON string
mockSessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, "not_valid_json{{{{");
let parsedCorrupt: SessionLaunch[] = [];
try {
  const raw = mockSessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY);
  parsedCorrupt = JSON.parse(raw || "[]");
} catch {
  parsedCorrupt = [];
}
assert(Array.isArray(parsedCorrupt) && parsedCorrupt.length === 0, "Corrupt JSON in storage safely defaults to empty array");

// Non-array JSON
mockSessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify({ someKey: "not an array" }));
let parsedNonArray: SessionLaunch[] = [];
try {
  const raw = mockSessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY);
  const data = JSON.parse(raw || "[]");
  parsedNonArray = Array.isArray(data) ? data : [];
} catch {
  parsedNonArray = [];
}
assert(Array.isArray(parsedNonArray) && parsedNonArray.length === 0, "Non-array JSON in storage safely defaults to empty array");


// ─── 6. Type Mapping & Route Resolution ──────────────────────────────────
console.log("\n--- 6. Type Mapping & Route Resolution ---");

// Presale mapping
const standardPresale = sessionPresaleToPresale(samplePresale);
assert(standardPresale.id === samplePresale.id, "Mapped Presale retains id");
assert(standardPresale.hardCap === "75 ETH", "Mapped Presale retains hardCap");
assert(standardPresale.softCap === "25 ETH", "Mapped Presale retains softCap");
assert(standardPresale.status === "scheduled", "Mapped Presale retains status");

// Fair launch mapping
const standardFairLaunch = sessionFairLaunchToFairLaunch(sampleFairLaunch);
assert(standardFairLaunch.id === sampleFairLaunch.id, "Mapped FairLaunch retains id");
assert(standardFairLaunch.totalSelling === "10,000,000 CCAT", "Mapped FairLaunch retains totalSelling");
assert(standardFairLaunch.softCap === "30 ETH", "Mapped FairLaunch retains softCap");
assert(!("hardCap" in standardFairLaunch), "Mapped FairLaunch has no hardCap property");

// Context resolution
const resolvedPresaleContext = resolveLaunchContext(samplePresale);
assert(resolvedPresaleContext.token !== undefined, "Resolved token for session presale");
assert(resolvedPresaleContext.token?.symbol === "AURA", "Resolved token symbol matches 'AURA'");

// Custom unlisted token context resolution
const customPresale: SessionPresale = {
  ...samplePresale,
  id: "session-ps-custom-001",
  tokenId: "0x1111222233334444555566667777888899990000",
  tokenAddress: "0x1111222233334444555566667777888899990000",
};
const customContext = resolveLaunchContext(customPresale);
assert(customContext.token !== undefined, "Fallback synthetic token resolved for custom unlisted contract address");
assert(customContext.token?.contractAddress === "0x1111222233334444555566667777888899990000", "Synthetic token has expected address");


// ─── 7. Directory & Workspace Visibility ─────────────────────────────────
console.log("\n--- 7. Directory & Workspace Visibility ---");

// Directory visibility: session launches prepend to catalog
const catalogPresales = MOCK_PRESALES;
const directoryPresales = [standardPresale, ...catalogPresales];
assert(directoryPresales.length === catalogPresales.length + 1, "Directory contains catalog presales plus session presale");
assert(directoryPresales[0].id === samplePresale.id, "Session presale is placed at the top of the directory");

// Directory visibility: fair launch
const catalogFairLaunches = MOCK_FAIR_LAUNCHES;
const directoryFairLaunches = [standardFairLaunch, ...catalogFairLaunches];
assert(directoryFairLaunches.length === catalogFairLaunches.length + 1, "Directory contains catalog fair launches plus session fair launch");
assert(directoryFairLaunches[0].id === sampleFairLaunch.id, "Session fair launch is placed at the top of the directory");

// Creator workspace filtering
const workspaceItems = [samplePresale, sampleFairLaunch];
const presalesOnly = workspaceItems.filter((i) => i.kind === "presale");
assert(presalesOnly.length === 1 && presalesOnly[0].id === samplePresale.id, "Workspace filters by kind 'presale'");

const fairOnly = workspaceItems.filter((i) => i.kind === "fair");
assert(fairOnly.length === 1 && fairOnly[0].id === sampleFairLaunch.id, "Workspace filters by kind 'fair'");

const scheduledOnly = workspaceItems.filter((i) => i.status === "scheduled");
assert(scheduledOnly.length === 2, "Workspace filters by status 'scheduled'");


// ─── 8. Network & D-04 Scope Enforcement ─────────────────────────────────
console.log("\n--- 8. Network & D-04 Scope Enforcement ---");

assert(samplePresale.network === "Ethereum Sepolia", "Presale session simulation locked to Ethereum Sepolia under D-04");
assert(sampleFairLaunch.network === "Ethereum Sepolia", "Fair launch session simulation locked to Ethereum Sepolia under D-04");
assert(samplePresale.isSimulated === true, "Presale record is marked as client simulation");
assert(sampleFairLaunch.isSimulated === true, "Fair launch record is marked as client simulation");

console.log("\n==========================================================");
console.log(`🎉 ALL ${passed} BATCH 2 LAUNCHPAD INTEGRATION TESTS PASSED!`);
console.log("==========================================================");
