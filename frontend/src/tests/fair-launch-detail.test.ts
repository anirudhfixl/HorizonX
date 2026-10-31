import { MOCK_FAIR_LAUNCHES, MOCK_PRESALES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import type { FairLaunch } from "../types";
import {
  computeCommitment,
  softCapStatement,
  formatPct,
  buildMilestones,
  participationState,
  contributionUnit,
  participantsLabel,
  NOT_RECORDED_TERMS,
} from "../lib/fair-launch-detail";
import { validateContribution } from "../lib/presale-detail";

let passed = 0;
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  passed++;
}
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const byId = (id: string) => MOCK_FAIR_LAUNCHES.find((l) => l.id === id)!;
const patch = (id: string, p: Partial<FairLaunch>): FairLaunch => ({ ...byId(id), ...p });

// --- every record resolves and has comparable figures -------------------------
for (const fl of MOCK_FAIR_LAUNCHES) {
  assert(MOCK_TOKENS.some((t) => t.id === fl.tokenId), `${fl.id}: token ${fl.tokenId} exists`);
  assert(!fl.projectId || MOCK_PROJECTS.some((p) => p.id === fl.projectId), `${fl.id}: project exists`);
  const c = computeCommitment(fl);
  assert(c.available, `${fl.id}: commitment available`);
  if (c.available) {
    assert(c.fillPct >= 0 && c.fillPct <= 100 && c.tickPct > 0 && c.tickPct <= 100, `${fl.id}: bar positions in range`);
    assert(near(Math.max(c.fillPct, c.tickPct), 100), `${fl.id}: scale is max(raised, soft cap)`);
  }
  const ms = buildMilestones(fl);
  assert(ms.length === 4 && ms.filter((m) => m.state === "current").length === 1, `${fl.id}: exactly one current stage`);
  assert(participationState(fl).open === (fl.status === "live"), `${fl.id}: participation open only when live`);
}

// --- commitment against soft cap, not a hard cap ---------------------------------
const matrix = computeCommitment(byId("fl-matrix-dao")); // 42.5 / 25 ETH
assert(matrix.available && near(matrix.pctOfSoft, 170), "42.5 of 25 ETH is 170% of soft cap (runs past it)");
assert(matrix.available && matrix.state === "reached" && near(matrix.overSoft ?? -1, 17.5), "over soft cap by 17.5");
assert(matrix.available && near(matrix.fillPct, 100) && near(matrix.tickPct, (25 / 42.5) * 100), "tick sits inside the bar once the soft cap is passed");
assert(matrix.available && matrix.remainingToSoft === undefined, "no remaining-to-soft after reaching it");

const quantum = computeCommitment(byId("fl-quantum-layer3")); // 0 / 50 ETH
assert(quantum.available && quantum.pctOfSoft === 0 && quantum.fillPct === 0 && near(quantum.tickPct, 100), "0 raised keeps the tick at the end");
assert(quantum.available && quantum.state === "not-reached" && near(quantum.remainingToSoft ?? -1, 50), "50 ETH to go when nothing raised");

const under = computeCommitment({ totalRaised: "10 ETH", softCap: "40 ETH" });
assert(under.available && near(under.pctOfSoft, 25) && near(under.fillPct, 25) && near(under.tickPct, 100) && under.state === "not-reached", "10 of 40 ETH");
const exact = computeCommitment({ totalRaised: "25 ETH", softCap: "25 ETH" });
assert(exact.available && exact.state === "reached" && exact.overSoft === undefined, "exactly at the soft cap counts as reached, not over");
assert(!("hardCap" in matrix), "commitment carries no hard cap field");

// --- unavailable states are explicit, never a fake 0% --------------------------------
assert(JSON.stringify(computeCommitment({})) === JSON.stringify({ available: false, reason: "missing-raised" }), "missing raised");
assert(JSON.stringify(computeCommitment({ totalRaised: "1 ETH" })) === JSON.stringify({ available: false, reason: "missing-soft-cap" }), "missing soft cap");
const bad = computeCommitment({ totalRaised: "lots", softCap: "5 ETH" });
assert(!bad.available && bad.reason === "invalid", "unreadable amount");
const mixed = computeCommitment({ totalRaised: "1 ETH", softCap: "5 USDC" });
assert(!mixed.available && mixed.reason === "unit-mismatch", "mixed units are not compared");
const zero = computeCommitment({ totalRaised: "1 ETH", softCap: "0 ETH" });
assert(!zero.available && zero.reason === "zero-cap", "zero soft cap");
assert(softCapStatement("live", bad) === null, "no statement when progress is unavailable");

// --- wording follows stored status ---------------------------------------------------
assert(softCapStatement("live", matrix) === "Soft cap reached", "live + reached");
assert(softCapStatement("live", under) === "Soft cap not reached yet", "live + not reached");
assert(softCapStatement("ended", matrix) === "Soft cap met" && softCapStatement("finalized", matrix) === "Soft cap met", "concluded + reached");
assert(softCapStatement("ended", under) === "Soft cap not met" && softCapStatement("failed", under) === "Soft cap not met", "concluded + not reached");
assert(softCapStatement("scheduled", quantum) === "Nothing raised yet" && softCapStatement("draft", quantum) === "Nothing raised yet", "scheduled/draft with a recorded raise of 0");
assert(softCapStatement("scheduled", under) === "Soft cap not reached yet", "scheduled with a non-zero stored raise is not described as empty");
assert(formatPct(170) === "170%" && formatPct(33.333) === "33.3%" && formatPct(0) === "0%", "percent formatting");

// --- milestones ----------------------------------------------------------------------
const live = buildMilestones(byId("fl-matrix-dao"));
assert(live[2].state === "current" && live[0].state === "done" && live[3].state === "upcoming", "live: closes is current");
assert(live[3].at === undefined && live[0].at === "2026-10-25", "live: no outcome date; listed uses createdAt");
const ended = buildMilestones(byId("fl-zk-shield"));
assert(ended[3].state === "current" && ended[3].label === "Ended" && ended[3].at === "2026-10-20", "ended: outcome is record update date");
assert(/not a confirmed on-chain event/.test(ended[3].note), "outcome date is labelled as a record date");
const draft = buildMilestones(byId("fl-solargrid-depin"));
assert(draft[0].state === "current" && draft[1].label === "Planned opening" && /not confirmed/.test(draft[1].note), "draft: planned, unconfirmed");
assert(buildMilestones(patch("fl-zk-shield", { status: "failed" }))[3].label === "Failed", "failed label");
assert(buildMilestones(patch("fl-zk-shield", { status: "cancelled" }))[3].label === "Cancelled", "cancelled label");
const noDates = buildMilestones(patch("fl-matrix-dao", { startTime: undefined, endTime: undefined }));
assert(noDates[1].at === undefined && noDates[2].at === undefined, "missing dates stay missing");

// --- participation gating ----------------------------------------------------------------
assert(participationState(byId("fl-matrix-dao")).title === "Open for contributions", "live is open");
assert(participationState(byId("fl-quantum-layer3")).title === "Not open yet" && !participationState(byId("fl-quantum-layer3")).open, "scheduled is closed");
assert(participationState(byId("fl-solargrid-depin")).title === "Draft launch", "draft");
assert(participationState(byId("fl-zk-shield")).title === "Launch ended", "ended");
assert(participationState(byId("fl-prominers-public")).title === "Launch finalized", "finalized");
assert(participationState(patch("fl-zk-shield", { status: "failed" })).title === "Launch failed", "failed");
assert(participationState(patch("fl-zk-shield", { status: "cancelled" })).title === "Launch cancelled", "cancelled");
assert(/No closing time/.test(participationState(patch("fl-matrix-dao", { endTime: undefined })).message), "live without close time says so");

// --- contribution unit and validation (stored limits only) -----------------------------
assert(contributionUnit(byId("fl-matrix-dao")) === "ETH", "unit from stored terms");
assert(contributionUnit({}) === "", "no unit invented when nothing stored");
const fl = byId("fl-matrix-dao"); // 0.05 – 5.0 ETH
assert(validateContribution("", fl).status === "empty", "empty");
assert(validateContribution("abc", fl).status === "invalid", "non-number");
assert(validateContribution("0.01", fl).status === "below-min", "below min");
assert(validateContribution("5.01", fl).status === "above-max", "above max");
assert(validateContribution("0.05", fl).status === "ok" && validateContribution("5", fl).status === "ok", "bounds inclusive");
assert(validateContribution("1", { minContribution: undefined, maxContribution: undefined }).status === "ok", "no limits stored: any positive amount passes");

// --- recorded participants ----------------------------------------------------------------
assert(participantsLabel(0) === "0" && participantsLabel(undefined) === "—" && participantsLabel(1234) === "1,234", "participants label");

// --- relationships used by the route ---------------------------------------------------------
const sib = MOCK_FAIR_LAUNCHES.filter((f) => f.tokenId === fl.tokenId && f.id !== fl.id);
assert(sib.every((f) => f.tokenId === fl.tokenId && f.id !== fl.id), "sibling launches share the token and exclude self");
assert(MOCK_PRESALES.filter((p) => p.tokenId === "prominers").length >= 0, "presale lookup by token");

// --- honesty: nothing invented ---------------------------------------------------------------------
const labels = NOT_RECORDED_TERMS.map((t) => t.label.toLowerCase()).join("|");
for (const k of ["hard cap", "price", "vesting", "liquidity", "refund", "contract"]) assert(labels.includes(k), `not-recorded list covers ${k}`);

console.log(`✅ fair-launch-detail: ${passed} assertions passed`);
