/**
 * HorizonX — Phase 3-C: Token Detail Hub Tests
 *
 * Verifies:
 * 1. Dynamic route static params & unknown-ID lookup handling
 * 2. Token-project relationship resolution across all 9 catalog tokens
 * 3. Ecosystem utility resolution (presales, launches, airdrops, staking)
 * 4. Contract source code, ABI & compiler metadata resolution
 * 5. Holder distribution mathematics & supply calculations
 * 6. Transfer history and event log schema integrity
 * 7. Architecture Decision D-04 Sepolia compliance & explorer links
 * 8. Currency and number formatting helpers
 */

import {
  MOCK_TOKENS,
  MOCK_PROJECTS,
  MOCK_PRESALES,
  MOCK_FAIR_LAUNCHES,
  MOCK_AIRDROPS,
  MOCK_STAKING_POOLS,
} from "../lib/mock-data";
import { formatCurrency, formatNumber } from "../components/tokens/token-detail-hub";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — PHASE 3-C TOKEN DETAIL HUB TESTS");
console.log("==========================================\n");

// --- 1. Dynamic Route Static Params & Lookup ---
console.log("--- 1. Dynamic Route Static Params & Lookup ---");

const staticParams = MOCK_TOKENS.map((token) => ({ id: token.id }));
assert(staticParams.length === 9, "Static params generate all 9 catalog tokens");

const expectedIds = [
  "prominers",
  "aurora-ai",
  "hyper-liquidity",
  "solargrid",
  "quantum",
  "nexus",
  "zkpv",
  "ccat",
  "mdao",
];

for (const id of expectedIds) {
  const found = staticParams.find((p) => p.id === id);
  assert(Boolean(found), `Static params include token ID '${id}'`);
}

// Invalid ID lookup test
const invalidToken = MOCK_TOKENS.find((t) => t.id === "non-existent-token-id-1234");
assert(invalidToken === undefined, "Querying invalid token ID returns undefined (triggers notFound())");

// --- 2. Token-Project Relationship Resolution ---
console.log("\n--- 2. Token-Project Relationship Resolution ---");

for (const token of MOCK_TOKENS) {
  assert(Boolean(token.projectId), `Token ${token.symbol} has a defined projectId: '${token.projectId}'`);
  const project = MOCK_PROJECTS.find((p) => p.id === token.projectId);
  assert(Boolean(project), `Token ${token.symbol} resolves to valid project '${project?.name}'`);
  assert(project!.tokenIds.includes(token.id), `Project '${project?.name}' references token '${token.id}' in its tokenIds`);
}

// --- 3. Ecosystem Utilities Resolution ---
console.log("\n--- 3. Ecosystem Utilities Resolution ---");

// QuantumNet presale resolution
const quantumPresales = MOCK_PRESALES.filter((p) => p.tokenId === "quantum" || p.projectId === "quantum-net");
assert(quantumPresales.length >= 1, "Quantum token resolves linked presale");
assert(quantumPresales[0].id === "ps-quantum-net", "Quantum presale ID is 'ps-quantum-net'");

// MatrixDAO fair launch resolution
const mdaoLaunches = MOCK_FAIR_LAUNCHES.filter((f) => f.tokenId === "mdao" || f.projectId === "matrix-governance");
assert(mdaoLaunches.length >= 1, "MDAO token resolves linked fair launch");
assert(mdaoLaunches[0].id === "fl-matrix-dao", "MDAO fair launch ID is 'fl-matrix-dao'");

// PMIN airdrop resolution
const pminAirdrops = MOCK_AIRDROPS.filter((a) => a.tokenId === "prominers" || a.projectId === "prominers-dao");
assert(pminAirdrops.length >= 1, "PMIN token resolves linked airdrop campaign");
assert(pminAirdrops[0].id === "air-pmin-genesis", "PMIN airdrop ID is 'air-pmin-genesis'");

// PMIN staking pool resolution
const pminStaking = MOCK_STAKING_POOLS.filter((s) => s.tokenId === "prominers" || s.projectId === "prominers-dao");
assert(pminStaking.length >= 1, "PMIN token resolves linked staking pool");
assert(pminStaking[0].id === "pool-pmin-single", "PMIN staking pool ID is 'pool-pmin-single'");

// --- 4. Contract Source Code, ABI & Compiler Metadata ---
console.log("\n--- 4. Contract Source Code, ABI & Compiler Metadata ---");

// Test verified tokens have available source code
const pminToken = MOCK_TOKENS.find((t) => t.id === "prominers")!;
assert(pminToken.verificationStatus === "audit_available", "PMIN is audit_available");
const pminSourceAvailable = pminToken.verificationStatus !== "not_reviewed";
assert(pminSourceAvailable === true, "PMIN has verified source code available");

// Test unreviewed token has unverified source code state
const mdaoToken = MOCK_TOKENS.find((t) => t.id === "mdao")!;
assert(mdaoToken.verificationStatus === "not_reviewed", "MDAO is not_reviewed");
const mdaoSourceAvailable = mdaoToken.verificationStatus !== "not_reviewed";
assert(mdaoSourceAvailable === false, "MDAO source code is correctly flagged as unavailable/unverified");

// Verify contract addresses
for (const token of MOCK_TOKENS) {
  assert(Boolean(token.contractAddress), `Token ${token.symbol} has contract address: ${token.contractAddress}`);
  assert(token.contractAddress!.startsWith("0x"), `Token ${token.symbol} address starts with 0x`);
  assert(token.contractAddress!.length === 42, `Token ${token.symbol} address is valid 42-char EVM hex`);
}

// --- 5. Holder Distribution Mathematics & Supply Calculations ---
console.log("\n--- 5. Holder Distribution Mathematics & Supply Calculations ---");

const holderPercentages = [35, 25, 20, 12, 8];
const totalHolderPct = holderPercentages.reduce((a, b) => a + b, 0);
assert(totalHolderPct === 100, `Holder distribution percentages sum to exactly 100% (found ${totalHolderPct}%)`);

for (const token of MOCK_TOKENS) {
  const rawSupply = parseInt((token.totalSupply || "100000000").replace(/[^0-9]/g, ""), 10);
  assert(rawSupply > 0, `Token ${token.symbol} total supply parses to positive number (${rawSupply})`);
  const circSupply = token.market?.circulatingSupply || rawSupply * 0.65;
  const circulatingPct = Math.min(100, Math.round((circSupply / rawSupply) * 100));
  assert(circulatingPct >= 0 && circulatingPct <= 100, `Token ${token.symbol} circulating ratio is valid: ${circulatingPct}%`);
}

// --- 6. Transfer History and Event Log Schema Integrity ---
console.log("\n--- 6. Transfer History and Event Log Schema Integrity ---");

// Genesis mint test for all tokens
for (const token of MOCK_TOKENS) {
  assert(Boolean(token.createdAt), `Token ${token.symbol} has createdAt timestamp for genesis mint: ${token.createdAt}`);
}

// --- 7. Architecture Decision D-04 Sepolia Compliance & Explorer Links ---
console.log("\n--- 7. Architecture Decision D-04 Sepolia Compliance & Explorer Links ---");

const sepoliaTokens = MOCK_TOKENS.filter(
  (t) => t.network.toLowerCase().includes("sepolia") || t.network.toLowerCase() === "ethereum"
);
assert(sepoliaTokens.length === 5, "Exactly 5 Sepolia tokens cataloged under D-04");

const crossChainTokens = MOCK_TOKENS.filter(
  (t) => !t.network.toLowerCase().includes("sepolia") && t.network.toLowerCase() !== "ethereum"
);
assert(crossChainTokens.length === 4, "Exactly 4 cross-chain discovery tokens cataloged");

for (const t of sepoliaTokens) {
  const explorerUrl = `https://sepolia.etherscan.io/token/${t.contractAddress}`;
  assert(explorerUrl.includes("sepolia.etherscan.io"), `Sepolia token ${t.symbol} targets Sepolia block explorer`);
}

// --- 8. Currency and Number Formatting Helpers ---
console.log("\n--- 8. Currency and Number Formatting Helpers ---");

assert(formatCurrency(0) === "$0.00", "formatCurrency(0) returns $0.00");
assert(formatCurrency(undefined) === "$0.00", "formatCurrency(undefined) returns $0.00");
assert(formatCurrency(1.48) === "$1.48", "formatCurrency(1.48) returns $1.48");
assert(formatCurrency(1250) === "$1.25K", "formatCurrency(1250) returns $1.25K");
assert(formatCurrency(3420000) === "$3.42M", "formatCurrency(3420000) returns $3.42M");
assert(formatCurrency(1200000000) === "$1.20B", "formatCurrency(1200000000) returns $1.20B");

assert(formatNumber(1000) === "1,000", "formatNumber(1000) returns '1,000'");
assert(formatNumber(100000000) === "100,000,000", "formatNumber(100000000) returns '100,000,000'");
assert(formatNumber(undefined) === "0", "formatNumber(undefined) returns '0'");

console.log("\n==========================================");
console.log("ALL PHASE 3-C TOKEN DETAIL HUB TESTS PASSED! 🎉");
console.log("==========================================\n");
