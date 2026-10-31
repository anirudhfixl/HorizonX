import { MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import type { Presale } from "../types";
import {
  parseAmountParts,
  formatAmount,
  computeRaise,
  softCapLabel,
  formatUtc,
  windowDuration,
  buildMilestones,
  participationState,
  contributionUnit,
  validateContribution,
  verificationLabel,
  NOT_RECORDED_TERMS,
} from "../lib/presale-detail";

let passed = 0;
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  passed++;
}
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

// --- amounts -----------------------------------------------------------------
assert(JSON.stringify(parseAmountParts("118.5 ETH")) === JSON.stringify({ value: 118.5, unit: "ETH" }), "parses '118.5 ETH'");
assert(parseAmountParts("1,000 ETH")?.value === 1000, "parses thousands separators");
assert(parseAmountParts("0 ETH")?.value === 0, "parses zero");
assert(parseAmountParts("50")?.unit === "", "parses a bare number with empty unit");
assert(parseAmountParts("abc") === null && parseAmountParts("") === null && parseAmountParts(undefined) === null, "rejects non-amounts");
assert(parseAmountParts("1.2.3 ETH") === null, "rejects malformed numbers");
assert(formatAmount(31.5, "ETH") === "31.5 ETH" && formatAmount(0.1 + 0.2, "ETH") === "0.3 ETH", "formatAmount trims float noise");

// --- raise: every record -----------------------------------------------------
for (const ps of MOCK_PRESALES) {
  const r = computeRaise(ps);
  assert(r.available, `${ps.id}: raise is available`);
  assert(r.pctOfHard >= 0 && r.pctOfHard <= 100, `${ps.id}: pct within 0..100`);
  const raised = parseAmountParts(ps.totalRaised)!.value;
  const hard = parseAmountParts(ps.hardCap)!.value;
  assert(near(r.pctOfHard, Math.min(100, (raised / hard) * 100)), `${ps.id}: pct = raised / hard cap`);
  assert(near(r.remainingToHard!, Math.max(0, hard - raised)), `${ps.id}: remaining to hard cap derived`);
  assert(r.softMarkerPct === undefined || (r.softMarkerPct > 0 && r.softMarkerPct < 100), `${ps.id}: soft marker inside scale`);
  assert(r.hardCapReached === raised >= hard, `${ps.id}: hardCapReached matches figures`);
  assert(ps.network.length > 0 && contributionUnit(ps) === "ETH", `${ps.id}: unit read from stored terms`);
}

// spot-check concrete records
const quantum = MOCK_PRESALES.find((p) => p.id === "ps-quantum-net")!;
const rq = computeRaise(quantum);
assert(near(rq.pctOfHard, 79) && rq.softCapState === "reached" && near(rq.softMarkerPct!, (50 / 150) * 100), "QuantumNet: 79%, soft cap reached, marker at 1/3");
assert(softCapLabel("live", rq.softCapState) === "Soft cap reached", "live + reached label");
const nexus = MOCK_PRESALES.find((p) => p.id === "ps-defi-nexus")!;
const rn = computeRaise(nexus);
assert(rn.pctOfHard === 0 && rn.softCapState === "not-reached" && near(rn.remainingToSoft!, 25), "scheduled sale: 0%, soft cap not reached, 25 to go");
assert(softCapLabel("scheduled", rn.softCapState) === "Soft cap not reached yet", "scheduled label never says 'not met'");
assert(softCapLabel("finalized", "reached") === "Soft cap met" && softCapLabel("ended", "not-reached") === "Soft cap not met", "concluded labels");
assert(computeRaise(MOCK_PRESALES.find((p) => p.id === "ps-zk-vaults")!).hardCapReached, "ended sale at hard cap reports hard cap reached");

// --- raise: unavailable, never a fake 0% ----------------------------------------
assert(computeRaise({ totalRaised: undefined, hardCap: "10 ETH", softCap: "1 ETH" }).reason === "missing", "missing raised -> unavailable");
assert(computeRaise({ totalRaised: "1 ETH", hardCap: undefined, softCap: undefined }).reason === "missing", "missing hard cap -> unavailable");
assert(computeRaise({ totalRaised: "n/a", hardCap: "10 ETH", softCap: undefined }).reason === "invalid", "unreadable raised -> unavailable");
assert(computeRaise({ totalRaised: "1 ETH", hardCap: "10 USDC", softCap: undefined }).reason === "unit-mismatch", "unit mismatch -> unavailable");
assert(computeRaise({ totalRaised: "1 ETH", hardCap: "0 ETH", softCap: undefined }).reason === "zero-cap", "zero cap -> unavailable");
const over = computeRaise({ totalRaised: "200 ETH", hardCap: "100 ETH", softCap: "10 ETH" });
assert(over.pctOfHard === 100 && over.remainingToHard === 0 && over.hardCapReached, "overshoot is clamped to 100%");
const softMismatch = computeRaise({ totalRaised: "5 ETH", hardCap: "10 ETH", softCap: "3 USDC" });
assert(softMismatch.available && softMismatch.softCapState === "unknown" && softMismatch.softCapIgnored, "soft cap in another unit is ignored, not guessed");
const noSoft = computeRaise({ totalRaised: "5 ETH", hardCap: "10 ETH" });
assert(noSoft.softMarkerPct === undefined && noSoft.softCapState === "unknown" && !noSoft.softCapIgnored, "no soft cap -> no marker");
assert(softCapLabel("live", "unknown") === null, "no label when soft cap unknown");

// --- dates ---------------------------------------------------------------------
assert(formatUtc("2026-10-28T12:00:00Z") === "28 Oct 2026, 12:00 UTC", "formatUtc with time");
assert(formatUtc("2026-10-25") === "25 Oct 2026" && formatUtc("2026-10-25", false) === "25 Oct 2026", "date-only strings carry no time");
assert(formatUtc("2026-10-28T12:00:00Z", false) === "28 Oct 2026", "time can be suppressed");
assert(formatUtc(undefined) === "—" && formatUtc("garbage") === "—", "invalid dates render as em dash");
assert(windowDuration("2026-10-28T12:00:00Z", "2026-11-04T12:00:00Z") === "7 days", "7 day window");
assert(windowDuration("2026-10-28T12:00:00Z", "2026-10-29T13:00:00Z") === "1 day 1 hour", "1 day 1 hour window");
assert(windowDuration("2026-10-28T12:00:00Z", "2026-10-28T18:00:00Z") === "6 hours", "hours only");
assert(windowDuration("2026-11-04T12:00:00Z", "2026-10-28T12:00:00Z") === null && windowDuration(undefined, "2026-10-28T12:00:00Z") === null, "inverted or missing window -> null");

// --- lifecycle -------------------------------------------------------------------
const stageOf = (ps: Presale) => buildMilestones(ps).findIndex((m) => m.state === "current");
const expectedStage: Record<string, number> = { draft: 0, scheduled: 1, live: 2, ended: 3, finalized: 3, failed: 3, cancelled: 3 };
for (const ps of MOCK_PRESALES) {
  const ms = buildMilestones(ps);
  assert(ms.length === 4, `${ps.id}: four milestones`);
  assert(stageOf(ps) === expectedStage[ps.status], `${ps.id}: current stage follows stored status (${ps.status})`);
  assert(ms.filter((m) => m.state === "current").length === 1, `${ps.id}: exactly one current stage`);
  assert(ms[0].at === ps.createdAt && ms[1].at === ps.startTime && ms[2].at === ps.endTime, `${ps.id}: dates come from stored fields`);
  const concluded = expectedStage[ps.status] === 3;
  assert(concluded ? ms[3].at === ps.updatedAt : ms[3].at === undefined, `${ps.id}: outcome date only when concluded`);
  assert(ms.every((m, i) => (i < expectedStage[ps.status] ? m.state === "done" : i === expectedStage[ps.status] ? m.state === "current" : m.state === "upcoming")), `${ps.id}: done/current/upcoming ordering`);
}
const draft = MOCK_PRESALES.find((p) => p.status === "draft")!;
assert(buildMilestones(draft)[1].label === "Planned opening" && buildMilestones(draft)[2].label === "Planned closing", "draft uses 'planned' wording");
assert(buildMilestones(MOCK_PRESALES.find((p) => p.status === "finalized")!)[3].label === "Finalized", "outcome label follows status");
assert(/not a confirmed on-chain event/.test(buildMilestones(MOCK_PRESALES.find((p) => p.status === "ended")!)[3].note), "outcome date is flagged as a record date");

// --- participation gate -----------------------------------------------------------
for (const ps of MOCK_PRESALES) {
  const s = participationState(ps);
  assert(s.open === (ps.status === "live"), `${ps.id}: participation open only while live`);
}
assert(participationState({ ...quantum, status: "cancelled" }).tone === "closed", "cancelled is closed");
assert(participationState({ ...quantum, status: "failed" }).title === "Sale failed", "failed title");
assert(participationState({ ...nexus }).message.includes("2 Nov 2026"), "scheduled message uses stored start");

// --- contribution validation ---------------------------------------------------------
const terms = { minContribution: "0.1 ETH", maxContribution: "3.0 ETH" };
assert(validateContribution("", terms).status === "empty" && validateContribution("   ", terms).status === "empty", "empty input");
assert(validateContribution("abc", terms).status === "invalid", "letters invalid");
assert(validateContribution("1e3", terms).status === "invalid", "exponent invalid");
assert(validateContribution("-1", terms).status === "invalid", "negative invalid");
assert(validateContribution("0", terms).status === "invalid", "zero invalid");
assert(validateContribution("1.2.3", terms).status === "invalid", "double dot invalid");
assert(validateContribution("0.0000000000000000001", terms).status === "invalid", ">18 decimals invalid");
assert(validateContribution("0.05", terms).status === "below-min", "below min");
assert(validateContribution("3.01", terms).status === "above-max", "above max");
assert(validateContribution("0.1", terms).status === "ok" && validateContribution("3", terms).status === "ok" && validateContribution("3.0", terms).status === "ok", "bounds are inclusive");
assert(validateContribution(".5", terms).status === "ok" && validateContribution("1.", terms).status === "ok", "'.5' and '1.' accepted");
const bad = validateContribution("0.05", terms);
assert("message" in bad && bad.message.includes("0.1 ETH"), "message quotes the stored minimum");
assert(validateContribution("9999", { minContribution: undefined, maxContribution: undefined }).status === "ok", "no stored limits -> only numeric checks");

// --- unit + labels + not-recorded list ---------------------------------------------------
assert(contributionUnit({ minContribution: undefined, maxContribution: undefined, hardCap: undefined, softCap: undefined }) === "", "unit is never assumed");
assert(contributionUnit({ minContribution: undefined, maxContribution: "2 USDC", hardCap: "10 ETH", softCap: undefined }) === "USDC", "unit prefers per-wallet terms");
assert(verificationLabel("audit_available") === "Audit available" && verificationLabel(undefined) === "Not reviewed" && verificationLabel("risk_flag") === "Risk flag recorded", "verification labels");
assert(NOT_RECORDED_TERMS.length >= 5, "not-recorded list present");
for (const f of ["tokenPrice", "price", "vesting", "allocation", "contractAddress"]) {
  // the Presale record has no price/vesting/allocation fields; contractAddress exists but is unset on every record
  if (f === "contractAddress") assert(MOCK_PRESALES.every((p) => !p.contractAddress), "no presale stores a contract address (so the page says so)");
  else assert(MOCK_PRESALES.every((p) => !(f in p)), `no presale record carries '${f}'`);
}

// --- relations used by the page ---------------------------------------------------------------
for (const ps of MOCK_PRESALES) {
  assert(MOCK_TOKENS.some((t) => t.id === ps.tokenId), `${ps.id}: token resolves`);
  assert(!ps.projectId || MOCK_PROJECTS.some((p) => p.id === ps.projectId), `${ps.id}: project resolves`);
}

console.log(`presale-detail: ${passed} assertions passed`);
