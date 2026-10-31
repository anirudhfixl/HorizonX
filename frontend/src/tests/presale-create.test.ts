import { MOCK_TOKENS } from "../lib/mock-data";
import {
  DEFAULT_DRAFT, parseNumber, validateDraft, stepErrors, deriveDraft, formatNumber, findCatalogToken, NOT_COLLECTED,
  type PresaleDraft,
} from "../lib/presale-create";

let passed = 0;
function assert(c: boolean, m: string) { if (!c) { console.error(`❌ FAILED: ${m}`); process.exit(1); } passed++; }
const ADDR = "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1";
const ok = (p: Partial<PresaleDraft> = {}): PresaleDraft => ({ ...DEFAULT_DRAFT, tokenAddress: ADDR, ...p });
const errs = (p: Partial<PresaleDraft>) => validateDraft(ok(p));

// defaults are unchanged from the original form
assert(DEFAULT_DRAFT.presaleRate === "1000" && DEFAULT_DRAFT.softCap === "50" && DEFAULT_DRAFT.hardCap === "150", "default rate and caps");
assert(DEFAULT_DRAFT.minContribution === "0.1" && DEFAULT_DRAFT.maxContribution === "3.0" && DEFAULT_DRAFT.tokenAddress === "", "default limits, empty address");

// parsing
assert(parseNumber("3.0") === 3 && parseNumber(".5") === 0.5 && parseNumber("5.") === 5 && parseNumber(" 7 ") === 7, "plain decimals");
assert(parseNumber("") === null && parseNumber("-1") === null && parseNumber("1e3") === null && parseNumber("abc") === null && parseNumber("1,000") === null, "rejects non-plain numbers");

// defaults + a valid address pass
assert(Object.keys(validateDraft(ok())).length === 0, "defaults with a valid address pass");

// token address
assert(/required/.test(validateDraft(DEFAULT_DRAFT).tokenAddress ?? ""), "empty address is required (original rule)");
assert(!!errs({ tokenAddress: "   " }).tokenAddress, "whitespace-only address is empty");
assert(/0x followed by 40/.test(errs({ tokenAddress: "0x123" }).tokenAddress ?? ""), "short address rejected");
assert(!!errs({ tokenAddress: "892a43b2f671b2691e9b24ee945c35d5d8c9a7d1" }).tokenAddress, "missing 0x rejected");
assert(!!errs({ tokenAddress: "0x" + "g".repeat(40) }).tokenAddress, "non-hex rejected");
assert(!errs({ tokenAddress: ` ${ADDR.toUpperCase().replace("0X", "0x")} ` }).tokenAddress, "case and surrounding spaces accepted");

// numeric fields
for (const f of ["presaleRate", "softCap", "hardCap", "minContribution", "maxContribution"] as const) {
  assert(!!errs({ [f]: "" })[f], `${f}: empty rejected`);
  assert(!!errs({ [f]: "abc" })[f], `${f}: non-number rejected`);
}
assert(!!errs({ presaleRate: "0" }).presaleRate, "rate zero rejected");
assert(!!errs({ softCap: "0" }).softCap && !!errs({ hardCap: "0" }).hardCap, "zero caps rejected");
assert(!!errs({ softCap: "200" }).hardCap && !errs({ softCap: "200" }).softCap, "soft above hard flags the hard cap field");
assert(!errs({ softCap: "150" }).hardCap, "soft equal to hard is allowed");
assert(!!errs({ minContribution: "5" }).maxContribution, "min above max flagged on max");
assert(!errs({ minContribution: "0" }).minContribution, "zero minimum allowed");
assert(!!errs({ maxContribution: "0" }).maxContribution, "zero maximum rejected");
assert(!!errs({ maxContribution: "151" }).maxContribution && !errs({ maxContribution: "150" }).maxContribution, "max cannot exceed hard cap");
assert(stepErrors("caps", errs({ softCap: "x" })).join() === "softCap", "step errors only list that step's fields");
assert(stepErrors("token", errs({ softCap: "x" })).length === 0, "other steps unaffected");

// derived arithmetic
const d = deriveDraft(ok());
assert(d.tokensAtHardCap === 150000 && d.tokensAtSoftCap === 50000, "tokens at caps");
assert(Math.abs((d.softPctOfHard ?? 0) - 100 / 3) < 1e-9 && d.minWalletsToFill === 50, "soft share and wallets to fill");
assert(deriveDraft(ok({ hardCap: "x" })).tokensAtHardCap === null && deriveDraft(ok({ maxContribution: "" })).minWalletsToFill === null, "derived is null when inputs unreadable");
assert(deriveDraft(ok({ hardCap: "10", maxContribution: "3" })).minWalletsToFill === 4, "wallets round up");
assert(formatNumber(150000) === "150,000" && formatNumber(0.1 + 0.2) === "0.3", "number formatting");

// catalog lookup is informational only
const t = MOCK_TOKENS.find((x) => x.contractAddress)!;
assert(findCatalogToken(t.contractAddress!.toUpperCase().replace("0X", "0x"), MOCK_TOKENS)?.id === t.id, "catalog match is case-insensitive");
assert(findCatalogToken("0x" + "1".repeat(40), MOCK_TOKENS) === undefined && findCatalogToken("junk", MOCK_TOKENS) === undefined, "no match for unknown or malformed");
assert(NOT_COLLECTED.some((n) => /time/i.test(n.label)), "schedule is listed as not collected");
console.log(`✅ presale-create: ${passed} assertions passed`);
