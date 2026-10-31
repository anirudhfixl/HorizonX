/**
 * Token Details (/tokens/[id]) profile helper tests.
 * Run: npx tsx src/tests/token-profile.test.ts
 */
import { MOCK_TOKENS } from "../lib/mock-data";
import {
  formatMoney,
  parseSupply,
  getExplorerBaseUrl,
  isSepoliaNetwork,
  verificationIndex,
  toneFor,
} from "../components/tokens/token-profile";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { failed++; console.error(`FAILED: ${msg}`); } else console.log(`PASSED: ${msg}`);
}

assert(formatMoney(undefined) === "—", "missing money is an em dash, not $0.00");
assert(formatMoney(1480000) === "$1.48M", "millions format");
assert(formatMoney(0.005) === "$0.0050", "sub-cent format");
assert(formatMoney(0) === "$0.00", "zero is a real value");
assert(parseSupply("100,000,000") === 100000000, "parses comma supply");
assert(parseSupply(undefined) === undefined, "missing supply is undefined, no invented default");
assert(parseSupply("n/a") === undefined, "non-numeric supply is undefined");
assert(isSepoliaNetwork("Ethereum Sepolia") && !isSepoliaNetwork("Base"), "sepolia detection");
assert(getExplorerBaseUrl("Ethereum Sepolia") === "https://sepolia.etherscan.io", "sepolia explorer");
assert(getExplorerBaseUrl("Arbitrum One") === "https://arbiscan.io", "arbitrum explorer");
assert(getExplorerBaseUrl("Base") === "https://basescan.org", "base explorer");
assert(getExplorerBaseUrl("Polygon") === "https://polygonscan.com", "polygon explorer");
assert(verificationIndex("audit_available") === 3 && verificationIndex(undefined) === 0, "verification ladder index");
assert(toneFor("DeFi") === toneFor("DeFi"), "tone is deterministic");
for (const t of MOCK_TOKENS) {
  assert(parseSupply(t.totalSupply) !== undefined, `token ${t.id} has parseable supply`);
}
if (failed) process.exit(1);
console.log("ALL TOKEN PROFILE TESTS PASSED");
