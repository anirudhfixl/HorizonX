import { MOCK_FAIR_LAUNCHES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import {
  normalizePresaleStatus,
  isConcluded,
  softCapStatement,
  isAuthorizedCreator,
  getAllowedFairLaunchStatusTransitions,
  deriveFairLaunchTerms,
  computeCommitment,
  NOT_RECORDED_TERMS,
} from "../lib/fair-launch-detail";
import {
  sessionFairLaunchToFairLaunch,
  resolveLaunchContext,
  type SessionFairLaunch,
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

const near = (a: number, b: number, epsilon = 1e-4) => Math.abs(a - b) < epsilon;

console.log("==========================================================");
console.log("HORIZONX — PHASE 4, BATCH 4 FAIR LAUNCH DETAIL & OWNER TESTS");
console.log("==========================================================");

console.log("\n--- 1. Status Normalization ('canceled' vs 'cancelled') ---");
assert(normalizePresaleStatus("canceled") === "cancelled", "normalizePresaleStatus('canceled') returns canonical 'cancelled'");
assert(normalizePresaleStatus("cancelled") === "cancelled", "normalizePresaleStatus('cancelled') returns 'cancelled'");
assert(normalizePresaleStatus("CANCELED") === "cancelled", "Case-insensitive normalization for uppercase CANCELED");
assert(normalizePresaleStatus("Cancelled") === "cancelled", "Preserves capitalized Cancelled as 'cancelled'");
assert(normalizePresaleStatus("live") === "live", "Normalizes 'live' to 'live'");
assert(normalizePresaleStatus("draft") === "draft", "Normalizes 'draft' to 'draft'");
assert(normalizePresaleStatus("scheduled") === "scheduled", "Normalizes 'scheduled' to 'scheduled'");
assert(normalizePresaleStatus("finalized") === "finalized", "Normalizes 'finalized' to 'finalized'");
assert(normalizePresaleStatus(undefined) === "draft", "Undefined status safely defaults to 'draft'");

assert(isConcluded("cancelled"), "'cancelled' is identified as concluded");
assert(isConcluded("canceled"), "'canceled' (single-l) is identified as concluded via normalization");
assert(isConcluded("ended"), "'ended' is identified as concluded");
assert(isConcluded("finalized"), "'finalized' is identified as concluded");
assert(isConcluded("failed"), "'failed' is identified as concluded");
assert(!isConcluded("live"), "'live' is NOT concluded");
assert(!isConcluded("scheduled"), "'scheduled' is NOT concluded");
assert(!isConcluded("draft"), "'draft' is NOT concluded");

const matrixCommitment = computeCommitment(MOCK_FAIR_LAUNCHES.find((l) => l.id === "fl-matrix-dao")!);
assert(softCapStatement("canceled", matrixCommitment) === "Soft cap met", "softCapStatement works with 'canceled'");
assert(softCapStatement("cancelled", matrixCommitment) === "Soft cap met", "softCapStatement works with 'cancelled'");

console.log("\n--- 2. Creator Authorization Engine ---");
const creatorAddr = "0x71c95911e9a5d330f4d621842ec243ee1343292e";
const attackerAddr = "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1";

assert(isAuthorizedCreator(creatorAddr, creatorAddr, true), "Authorized when connected and addresses match exactly");
assert(isAuthorizedCreator(creatorAddr, creatorAddr.toUpperCase(), true), "Authorized with case-insensitive address match");
assert(!isAuthorizedCreator(creatorAddr, attackerAddr, true), "Unauthorized when connected with different wallet address");
assert(!isAuthorizedCreator(creatorAddr, creatorAddr, false), "Unauthorized when wallet is disconnected");
assert(!isAuthorizedCreator(undefined, creatorAddr, true), "Unauthorized when ownerAddress is undefined");
assert(!isAuthorizedCreator(creatorAddr, undefined, true), "Unauthorized when wallet address is undefined");
assert(!isAuthorizedCreator("", creatorAddr, true), "Unauthorized when ownerAddress is empty string");

// Test with all catalog fair launches
for (const fl of MOCK_FAIR_LAUNCHES) {
  assert(
    isAuthorizedCreator(fl.ownerAddress, fl.ownerAddress, true),
    `Authorized for launch ${fl.id} with matching owner address`
  );
  assert(
    !isAuthorizedCreator(fl.ownerAddress, attackerAddr, true),
    `Unauthorized for launch ${fl.id} with mismatching address`
  );
  assert(
    !isAuthorizedCreator(fl.ownerAddress, fl.ownerAddress, false),
    `Unauthorized for launch ${fl.id} when disconnected`
  );
}

console.log("\n--- 3. State Transition Rules ---");
const draftTransitions = getAllowedFairLaunchStatusTransitions("draft");
assert(draftTransitions.some((t) => t.target === "scheduled"), "Draft can transition to scheduled");
assert(draftTransitions.some((t) => t.target === "live"), "Draft can transition to live");
assert(draftTransitions.some((t) => t.target === "cancelled"), "Draft can transition to cancelled");

const scheduledTransitions = getAllowedFairLaunchStatusTransitions("scheduled");
assert(scheduledTransitions.some((t) => t.target === "live"), "Scheduled can transition to live");
assert(scheduledTransitions.some((t) => t.target === "cancelled"), "Scheduled can transition to cancelled");
assert(!scheduledTransitions.some((t) => t.target === "draft"), "Scheduled cannot transition backward to draft");

const liveTransitions = getAllowedFairLaunchStatusTransitions("live");
assert(liveTransitions.some((t) => t.target === "ended"), "Live can transition to ended");
assert(liveTransitions.some((t) => t.target === "finalized"), "Live can transition to finalized");
assert(liveTransitions.some((t) => t.target === "cancelled"), "Live can transition to cancelled");

const endedTransitions = getAllowedFairLaunchStatusTransitions("ended");
assert(endedTransitions.some((t) => t.target === "finalized"), "Ended can transition to finalized");
assert(endedTransitions.some((t) => t.target === "failed"), "Ended can transition to failed");

// Terminal states have zero allowed transitions
assert(getAllowedFairLaunchStatusTransitions("finalized").length === 0, "Finalized is terminal (0 transitions)");
assert(getAllowedFairLaunchStatusTransitions("cancelled").length === 0, "Cancelled is terminal (0 transitions)");
assert(getAllowedFairLaunchStatusTransitions("canceled").length === 0, "Canceled is terminal via normalization (0 transitions)");
assert(getAllowedFairLaunchStatusTransitions("failed").length === 0, "Failed is terminal (0 transitions)");

console.log("\n--- 4. Fair Launch Allocation & Proportional Math Derivations ---");
// Test matrix dao: 1,000,000 MATRIX selling, 25 ETH soft cap, 42.5 ETH raised, token supply = 10,000,000
const matrixFl = MOCK_FAIR_LAUNCHES.find((l) => l.id === "fl-matrix-dao")!;
const matrixToken = MOCK_TOKENS.find((t) => t.id === matrixFl.tokenId);
const derivedMatrix = deriveFairLaunchTerms(
  matrixFl.totalSelling,
  matrixFl.softCap,
  matrixFl.totalRaised,
  matrixToken?.totalSupply
);

assert(derivedMatrix.hasDerivedCalculations === true, "derivedMatrix has calculations");
assert(derivedMatrix.totalSellingTokens === 10000000, "Parsed total selling as 10,000,000");
assert(derivedMatrix.softCapAmount === 25, "Parsed soft cap as 25");
assert(derivedMatrix.totalRaisedAmount === 42.5, "Parsed total raised as 42.5");
assert(near(derivedMatrix.tokensPerUnitAtSoftCap!, 400000), "tokensPerUnitAtSoftCap is 400,000 (10M / 25)");
assert(near(derivedMatrix.currentTokensPerUnit!, 235294.1176), "currentTokensPerUnit is ~235,294.12 (10M / 42.5)");
assert(near(derivedMatrix.pctOfTotalSupply!, 20.0), "pctOfTotalSupply is 20.0% (10M / 50M)");

// Test quantum layer3: 15,000,000 QNET selling, 50 ETH soft cap, 0 ETH raised
const quantumFl = MOCK_FAIR_LAUNCHES.find((l) => l.id === "fl-quantum-layer3")!;
const derivedQuantum = deriveFairLaunchTerms(quantumFl.totalSelling, quantumFl.softCap, quantumFl.totalRaised);
assert(near(derivedQuantum.tokensPerUnitAtSoftCap!, 300000), "tokensPerUnitAtSoftCap is 300,000 (15M / 50)");
assert(derivedQuantum.currentTokensPerUnit === undefined, "0 raised does not produce divide-by-zero effective rate");

// Missing values handling
const missingTerms = deriveFairLaunchTerms(undefined, undefined, undefined, undefined);
assert(!missingTerms.hasDerivedCalculations, "Missing terms produce hasDerivedCalculations = false");
assert(missingTerms.tokensPerUnitAtSoftCap === undefined, "tokensPerUnitAtSoftCap is undefined when source is missing");
assert(missingTerms.currentTokensPerUnit === undefined, "currentTokensPerUnit is undefined when source is missing");
assert(missingTerms.pctOfTotalSupply === undefined, "pctOfTotalSupply is undefined when source is missing");

console.log("\n--- 5. Catalog and Session Record Resolution ---");
// Catalog records resolve
const catalogIds = ["fl-matrix-dao", "fl-quantum-layer3", "fl-zk-shield", "fl-prominers-public", "fl-solargrid-depin"];
for (const id of catalogIds) {
  const record = MOCK_FAIR_LAUNCHES.find((l) => l.id === id);
  assert(record !== undefined, `Catalog launch ${id} resolved`);
}

// Unknown IDs are correctly rejected
const unknownId = "fl-unknown-nonexistent-id-9999";
assert(MOCK_FAIR_LAUNCHES.find((l) => l.id === unknownId) === undefined, "Unknown ID correctly returns undefined");

// Session record mapping
const dummySessionFairLaunch: SessionFairLaunch = {
  id: "session-fl-test-1",
  kind: "fair",
  title: "Test Simulation Fair Launch",
  description: "A simulated fair launch created in session",
  status: "draft",
  network: "Ethereum Sepolia",
  category: "DeFi",
  ownerAddress: "0x1234567890123456789012345678901234567890",
  tokenId: "mdao",
  tokenSymbol: "MDAO",
  tokenName: "MatrixDAO Fair Distribution",
  tokenAddress: "0x3918492019482910482910294820194829102938",
  tokenDecimals: 18,
  totalSelling: "250,000 MATRIX",
  softCap: "15 ETH",
  totalRaised: "0 ETH",
  participantCount: 0,
  minContribution: "0.1 ETH",
  maxContribution: "2 ETH",
  startTime: "2026-11-01T00:00:00Z",
  endTime: "2026-11-08T00:00:00Z",
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

const mappedFairLaunch = sessionFairLaunchToFairLaunch(dummySessionFairLaunch);
assert(mappedFairLaunch.id === "session-fl-test-1", "Session launch ID mapped");
assert(mappedFairLaunch.title === "Test Simulation Fair Launch", "Session launch title mapped");
assert(mappedFairLaunch.status === "draft", "Session launch status mapped");
assert(mappedFairLaunch.totalSelling === "250,000 MATRIX", "Session launch totalSelling mapped");
assert(mappedFairLaunch.softCap === "15 ETH", "Session launch softCap mapped");

const sessionContext = resolveLaunchContext(dummySessionFairLaunch);
assert(sessionContext.token !== undefined, "Session context resolved linked token");
assert(sessionContext.token?.id === "mdao", "Session context resolved mdao token");

console.log("\n--- 6. Tab Resolution Logic ---");
const resolveInitialTab = (tab?: string) => {
  const raw = tab?.toLowerCase().trim();
  if (raw === "terms" || raw === "allocation") return "terms";
  if (raw === "management" || raw === "creator" || raw === "owner") return "management";
  return "overview";
};

assert(resolveInitialTab("terms") === "terms", "'terms' resolves to terms");
assert(resolveInitialTab("allocation") === "terms", "'allocation' resolves to terms");
assert(resolveInitialTab("TERMS") === "terms", "'TERMS' uppercase resolves to terms");
assert(resolveInitialTab("management") === "management", "'management' resolves to management");
assert(resolveInitialTab("creator") === "management", "'creator' resolves to management");
assert(resolveInitialTab("owner") === "management", "'owner' resolves to management");
assert(resolveInitialTab("overview") === "overview", "'overview' resolves to overview");
assert(resolveInitialTab(undefined) === "overview", "undefined resolves to overview");
assert(resolveInitialTab("random-invalid") === "overview", "invalid string resolves to overview");

console.log("\n--- 7. Unrecorded Terms Disclosures Integrity ---");
assert(NOT_RECORDED_TERMS.length === 6, "NOT_RECORDED_TERMS has exactly 6 transparent disclosures");
const termLabels = NOT_RECORDED_TERMS.map((t) => t.label.toLowerCase()).join(" | ");
assert(termLabels.includes("hard cap"), "Discloses hard cap is not recorded");
assert(termLabels.includes("price"), "Discloses fixed price/rate is not recorded");
assert(termLabels.includes("vesting"), "Discloses vesting is not recorded");
assert(termLabels.includes("liquidity"), "Discloses liquidity terms are not recorded");
assert(termLabels.includes("refund"), "Discloses refund rules are not recorded on-chain");
assert(termLabels.includes("contract"), "Discloses contract is not deployed on-chain");

console.log("\n--- 8. Cross-Module Navigation & Sibling Integrity ---");
for (const fl of MOCK_FAIR_LAUNCHES) {
  const siblings = MOCK_FAIR_LAUNCHES.filter((f) => f.tokenId === fl.tokenId && f.id !== fl.id);
  assert(siblings.every((s) => s.id !== fl.id), `Siblings of ${fl.id} exclude self`);
  const token = MOCK_TOKENS.find((t) => t.id === fl.tokenId);
  assert(token !== undefined, `Token ${fl.tokenId} exists for ${fl.id}`);
  if (fl.projectId) {
    const project = MOCK_PROJECTS.find((p) => p.id === fl.projectId);
    assert(project !== undefined, `Project ${fl.projectId} exists for ${fl.id}`);
  }
}

console.log("==========================================================");
console.log(`✅ fair-launch-owner-management: ${passed} assertions passed`);
console.log("==========================================================");
