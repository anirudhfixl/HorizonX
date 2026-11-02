/**
 * ProMiners — Token module data provenance tests.
 *
 * Verifies:
 * 1. All four provenance kinds are defined with a label and description.
 * 2. Mock market data is never flagged as a live feed.
 * 3. Market figures are always reported as simulated.
 * 4. Token records resolve to session or catalog, never on-chain.
 * 5. The session storage key matches the one the existing pages read and write.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MOCK_TOKENS } from "../lib/mock-data";
import {
  PROVENANCE_META,
  PROVENANCE_ORDER,
  SESSION_TOKENS_STORAGE_KEY,
  marketProvenance,
  tokenRecordProvenance,
} from "../lib/data-provenance";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================================");
console.log("PROMINERS — TOKEN DATA PROVENANCE TESTS");
console.log("==========================================================\n");

// --- 1. Metadata ---
console.log("--- 1. Metadata ---");
assert(PROVENANCE_ORDER.length === 4, "Four provenance kinds are defined");
for (const kind of PROVENANCE_ORDER) {
  const meta = PROVENANCE_META[kind];
  assert(
    meta.label.length > 0 && meta.description.length > 0,
    `"${kind}" has a label and a description`
  );
}
assert(
  new Set(PROVENANCE_ORDER.map((k) => PROVENANCE_META[k].label)).size === 4,
  "Provenance labels are distinct"
);

// --- 2. Mock market data is not live ---
console.log("\n--- 2. Mock market data is not live ---");
assert(MOCK_TOKENS.length > 0, "Catalog contains tokens");
assert(
  MOCK_TOKENS.every((t) => t.market.isLive === false),
  "No mock token market record is flagged as a live feed"
);

// --- 3. Market provenance ---
console.log("\n--- 3. Market provenance ---");
assert(marketProvenance() === "simulated", "Market figures are reported as simulated");

// --- 4. Record provenance ---
console.log("\n--- 4. Record provenance ---");
const sample = MOCK_TOKENS.find((t) => t.contractAddress);
assert(!!sample, "Catalog has a token with a contract address");
if (sample) {
  const address = sample.contractAddress as string;
  assert(tokenRecordProvenance(sample) === "catalog", "Token with no session match is a catalog record");
  assert(
    tokenRecordProvenance(sample, [address]) === "session",
    "Token whose address matches a session receipt is a session record"
  );
  assert(
    tokenRecordProvenance(sample, [address.toUpperCase()]) === "session",
    "Session matching ignores address case"
  );
  assert(
    tokenRecordProvenance(sample, ["0x0000000000000000000000000000000000000001"]) === "catalog",
    "A non-matching session address leaves the token as catalog"
  );
}
assert(tokenRecordProvenance({}) === "catalog", "Token without an address is a catalog record");
assert(
  MOCK_TOKENS.every((t) => tokenRecordProvenance(t) !== "onchain") &&
    tokenRecordProvenance({}, ["0x1"]) !== "onchain",
  "No token record is ever reported as on-chain"
);

// --- 5. Storage key stays in sync with existing consumers ---
console.log("\n--- 5. Storage key ---");
const srcRoot = join(__dirname, "..");
for (const file of [
  "components/tokens/token-creation-wizard.tsx",
  "components/tokens/my-tokens-hub.tsx",
  "lib/tokens/dashboard-metrics.ts",
]) {
  const source = readFileSync(join(srcRoot, file), "utf8");
  assert(
    source.includes(`"${SESSION_TOKENS_STORAGE_KEY}"`),
    `${file} still uses the shared session storage key`
  );
}

console.log("\n🎉 ALL TOKEN DATA PROVENANCE TESTS PASSED\n");
