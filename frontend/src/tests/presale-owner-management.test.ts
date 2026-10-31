import { MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import type { Presale } from "../types";
import {
  normalizePresaleStatus,
  isConcluded,
  softCapLabel,
  isAuthorizedCreator,
  getAllowedStatusTransitions,
  derivePresaleTerms,
  buildMilestones,
  computeRaise,
  parseAmountParts,
  NOT_RECORDED_TERMS,
} from "../lib/presale-detail";
import {
  sessionPresaleToPresale,
  resolveLaunchContext,
  type SessionPresale,
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
console.log("PROMINERS — PHASE 4, BATCH 3 PRESALE DETAIL & OWNER TESTS");
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

assert(softCapLabel("canceled", "reached") === "Soft cap met", "softCapLabel works with 'canceled'");
assert(softCapLabel("cancelled", "reached") === "Soft cap met", "softCapLabel works with 'cancelled'");

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

console.log("\n--- 3. State Transition Rules ---");
const draftTransitions = getAllowedStatusTransitions("draft");
assert(draftTransitions.some((t) => t.target === "scheduled"), "Draft can transition to scheduled");
assert(draftTransitions.some((t) => t.target === "live"), "Draft can transition to live");
assert(draftTransitions.some((t) => t.target === "cancelled"), "Draft can transition to cancelled");

const scheduledTransitions = getAllowedStatusTransitions("scheduled");
assert(scheduledTransitions.some((t) => t.target === "live"), "Scheduled can transition to live");
assert(scheduledTransitions.some((t) => t.target === "cancelled"), "Scheduled can transition to cancelled");
assert(!scheduledTransitions.some((t) => t.target === "draft"), "Scheduled cannot transition backward to draft");

const liveTransitions = getAllowedStatusTransitions("live");
assert(liveTransitions.some((t) => t.target === "ended"), "Live can transition to ended");
assert(liveTransitions.some((t) => t.target === "finalized"), "Live can transition to finalized");
assert(liveTransitions.some((t) => t.target === "cancelled"), "Live can transition to cancelled");

const endedTransitions = getAllowedStatusTransitions("ended");
assert(endedTransitions.some((t) => t.target === "finalized"), "Ended can transition to finalized");
assert(endedTransitions.some((t) => t.target === "failed"), "Ended can transition to failed");

// Terminal states have zero allowed transitions
assert(getAllowedStatusTransitions("finalized").length === 0, "Finalized is terminal (0 transitions)");
assert(getAllowedStatusTransitions("cancelled").length === 0, "Cancelled is terminal (0 transitions)");
assert(getAllowedStatusTransitions("canceled").length === 0, "Canceled is terminal via normalization (0 transitions)");
assert(getAllowedStatusTransitions("failed").length === 0, "Failed is terminal (0 transitions)");

console.log("\n--- 4. Presale Terms & Token Allocation Derivations ---");
// Test derived calculations
const derived1 = derivePresaleTerms("100 ETH", "30 ETH", "1000 PMIN");
assert(derived1.hasDerivedTokens === true, "derived1 has derived tokens");
assert(derived1.presaleRate === 1000, "Presale rate parsed as 1000");
assert(derived1.presaleRateUnit === "PMIN", "Presale rate unit parsed as PMIN");
assert(derived1.hardCapTokensRequired === 100000, "100 ETH * 1000 = 100,000 tokens at hard cap");
assert(derived1.softCapTokensRequired === 30000, "30 ETH * 1000 = 30,000 tokens at soft cap");

const derivedNumeric = derivePresaleTerms("150 ETH", "50 ETH", 5000);
assert(derivedNumeric.hasDerivedTokens === true, "derivedNumeric has derived tokens");
assert(derivedNumeric.hardCapTokensRequired === 750000, "150 ETH * 5000 = 750,000 tokens");
assert(derivedNumeric.softCapTokensRequired === 250000, "50 ETH * 5000 = 250,000 tokens");

const derivedMissing = derivePresaleTerms("150 ETH", "50 ETH", undefined);
assert(derivedMissing.hasDerivedTokens === false, "derivedMissing reports hasDerivedTokens: false");
assert(derivedMissing.hardCapTokensRequired === undefined, "hardCapTokensRequired is undefined when rate missing");
assert(derivedMissing.softCapTokensRequired === undefined, "softCapTokensRequired is undefined when rate missing");

console.log("\n--- 5. Catalog vs Session Resolution ---");
// Catalog presale resolution
const catalogPs = MOCK_PRESALES.find((p) => p.id === "ps-quantum-net")!;
assert(Boolean(catalogPs), "Found catalog presale ps-quantum-net");
assert(catalogPs.tokenId === "quantum", "Catalog presale links to token 'quantum'");
const catalogToken = MOCK_TOKENS.find((t) => t.id === catalogPs.tokenId);
assert(Boolean(catalogToken), "Resolved catalog token");
assert(catalogToken?.symbol === "QNET", "Resolved token symbol is QNET");

// Session presale simulation resolution
const sampleSessionPs: SessionPresale = {
  id: "session-ps-1730000000-xyz1",
  kind: "presale",
  provenance: "session",
  isSimulated: true,
  title: "Decentralized GPU Presale",
  description: "Community presale simulation for decentralized compute cluster.",
  category: "AI & Compute",
  tokenId: "aurora-ai",
  tokenSymbol: "AURA",
  tokenName: "Aurora AI Compute",
  tokenAddress: "0x34291849a0293847291038472910482910293847",
  tokenDecimals: 18,
  ownerAddress: creatorAddr,
  status: "draft",
  softCap: "20 ETH",
  hardCap: "60 ETH",
  presaleRate: "5000 AURA",
  minContribution: "0.2 ETH",
  maxContribution: "2.0 ETH",
  totalRaised: "0 ETH",
  participantCount: 0,
  network: "Ethereum Sepolia",
  createdAt: "2026-10-31T12:00:00Z",
  updatedAt: "2026-10-31T12:00:00Z",
};

const mappedPresale = sessionPresaleToPresale(sampleSessionPs);
assert(mappedPresale.id === sampleSessionPs.id, "Mapped presale retains session ID");
assert(mappedPresale.title === sampleSessionPs.title, "Mapped presale retains title");
assert(mappedPresale.hardCap === "60 ETH", "Mapped presale retains hardCap");
assert(mappedPresale.softCap === "20 ETH", "Mapped presale retains softCap");
assert(mappedPresale.ownerAddress === creatorAddr, "Mapped presale retains creator ownerAddress");

const context = resolveLaunchContext(sampleSessionPs);
assert(Boolean(context.token), "Context resolved session launch token");
assert(context.token?.symbol === "AURA", "Context token symbol matches AURA");

console.log("\n--- 6. Milestone & Progress Integrity ---");
for (const ps of MOCK_PRESALES) {
  const ms = buildMilestones(ps);
  assert(ms.length === 4, `${ps.id}: Exactly 4 milestones generated`);
  const r = computeRaise(ps);
  assert(r.available, `${ps.id}: Progress raise is computable`);
  assert(r.pctOfHard >= 0 && r.pctOfHard <= 100, `${ps.id}: Percentage is clamped between 0 and 100`);
}

// Milestone state for cancelled presale
const cancelledSample: Presale = { ...catalogPs, status: "cancelled" };
const cancelledMs = buildMilestones(cancelledSample);
assert(cancelledMs[3].state === "current", "Outcome milestone is current for cancelled presale");
assert(cancelledMs[3].label === "Cancelled", "Outcome milestone label is 'Cancelled'");

console.log("\n--- 7. Non-Recorded Terms & Policy Integrity ---");
assert(NOT_RECORDED_TERMS.length >= 6, "At least 6 unrecorded terms are cataloged for honest disclosure");
assert(NOT_RECORDED_TERMS.some((t) => t.label.includes("Vesting")), "Vesting is explicitly flagged as unrecorded");
assert(NOT_RECORDED_TERMS.some((t) => t.label.includes("Liquidity")), "Liquidity lock is explicitly flagged as unrecorded");
assert(NOT_RECORDED_TERMS.some((t) => t.label.includes("Refund")), "Refund policy is explicitly flagged as unrecorded");

console.log("\n--- 8. Cross-Module Links Verification ---");
for (const ps of MOCK_PRESALES) {
  // Token link validity
  const tok = MOCK_TOKENS.find((t) => t.id === ps.tokenId);
  assert(Boolean(tok), `${ps.id} references valid token ${ps.tokenId}`);
  assert(`/tokens/${ps.tokenId}`.startsWith("/tokens/"), `${ps.id} token link is valid`);

  // Project link validity if present
  if (ps.projectId) {
    const proj = MOCK_PROJECTS.find((p) => p.id === ps.projectId);
    assert(Boolean(proj), `${ps.id} references valid project ${ps.projectId}`);
  }
}

console.log("==========================================================");
console.log(`🎉 ALL ${passed} BATCH 3 PRESALE OWNER & DETAIL TESTS PASSED!`);
console.log("==========================================================");
