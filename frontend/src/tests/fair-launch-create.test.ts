import { MOCK_TOKENS, MOCK_FAIR_LAUNCHES } from "../lib/mock-data";
import { DEFAULT_FL_DRAFT, validateFairLaunch, compareToSupply, FL_NOT_COLLECTED, FL_STEP_FIELDS, type FairLaunchDraft } from "../lib/fair-launch-create";
import { findCatalogToken } from "../lib/presale-create";

let passed = 0;
function assert(c: boolean, m: string) { if (!c) { console.error(`❌ FAILED: ${m}`); process.exit(1); } passed++; }
const ADDR = "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1";
const ok = (p: Partial<FairLaunchDraft> = {}): FairLaunchDraft => ({ ...DEFAULT_FL_DRAFT, tokenAddress: ADDR, ...p });
const errs = (p: Partial<FairLaunchDraft>) => validateFairLaunch(ok(p));

assert(DEFAULT_FL_DRAFT.totalSelling === "5000000" && DEFAULT_FL_DRAFT.softCap === "20" && DEFAULT_FL_DRAFT.tokenAddress === "", "defaults unchanged");
assert(Object.keys(validateFairLaunch(ok())).length === 0, "defaults with a valid address pass");
assert(/required/.test(validateFairLaunch(DEFAULT_FL_DRAFT).tokenAddress ?? ""), "empty address required (original rule)");
assert(!!errs({ tokenAddress: "  " }).tokenAddress && !!errs({ tokenAddress: "0x12" }).tokenAddress && !!errs({ tokenAddress: "0x" + "z".repeat(40) }).tokenAddress, "bad addresses rejected");
assert(!errs({ tokenAddress: ` ${ADDR} ` }).tokenAddress, "surrounding spaces accepted");
for (const f of ["totalSelling", "softCap"] as const) {
  assert(!!errs({ [f]: "" })[f] && !!errs({ [f]: "abc" })[f] && !!errs({ [f]: "-5" })[f] && !!errs({ [f]: "1e3" })[f], `${f}: unreadable rejected`);
  assert(!!errs({ [f]: "0" })[f], `${f}: zero rejected`);
  assert(!errs({ [f]: "0.5" })[f], `${f}: decimals allowed`);
}
assert(!("hardCap" in validateFairLaunch(ok())), "no hard cap rule exists");
assert(FL_STEP_FIELDS.token.join() === "tokenAddress" && FL_STEP_FIELDS.offering.join() === "totalSelling,softCap", "step fields");

// supply comparison (informational)
const t = MOCK_TOKENS.find((x) => x.contractAddress && x.totalSupply)!;
const c = compareToSupply("5000000", { totalSupply: "100,000,000" });
assert(!!c && Math.abs(c.sharePct - 5) < 1e-9 && !c.exceeds, "5M of 100M is 5%");
assert(compareToSupply("200", { totalSupply: "100" })?.exceeds === true, "exceeds supply flagged");
assert(compareToSupply("5", undefined) === null && compareToSupply("x", { totalSupply: "100" }) === null && compareToSupply("5", { totalSupply: "n/a" }) === null, "null when not comparable");
assert(findCatalogToken(t.contractAddress!, MOCK_TOKENS)?.id === t.id, "catalog lookup reused");

// honesty
const labels = FL_NOT_COLLECTED.map((n) => n.label.toLowerCase()).join("|");
for (const k of ["time", "contribution", "hard cap", "price", "vesting"]) assert(labels.includes(k), `not-collected covers ${k}`);
assert(MOCK_FAIR_LAUNCHES.every((l) => !("hardCap" in l)), "fair launch records have no hard cap");
console.log(`✅ fair-launch-create: ${passed} assertions passed`);
