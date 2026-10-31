import { MOCK_FAIR_LAUNCHES, MOCK_TOKENS, MOCK_PROJECTS } from "../lib/mock-data";
import { Token, Project, FairLaunch } from "../types";
import {
  calculateProgress,
  getCommitment,
  laneAxis,
  lanePosition,
  windowDays,
  fmtDate,
  matchesFairLaunch,
} from "../components/launchpad/fair-launch-directory";

let failures = 0;
function assert(condition: boolean, message: string) {
  if (!condition) {
    failures++;
    console.error(`❌ FAILED: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

const tokenMap = new Map<string, Token>();
MOCK_TOKENS.forEach((t) => tokenMap.set(t.id, t));
const projectMap = new Map<string, Project>();
MOCK_PROJECTS.forEach((p) => projectMap.set(p.id, p));

// --- Commitment (raised vs soft cap, no hard cap) ---
console.log("\n--- Commitment ---");
for (const fl of MOCK_FAIR_LAUNCHES) {
  const c = getCommitment(fl);
  assert(c.state === "ok", `${fl.id}: commitment derivable`);
  if (c.state !== "ok") continue;
  assert(c.pct === calculateProgress(fl.totalRaised, fl.softCap), `${fl.id}: pct equals calculateProgress (${c.pct}%)`);
  assert(c.fillPct >= 0 && c.fillPct <= 100 && c.tickPct > 0 && c.tickPct <= 100, `${fl.id}: fill and tick within 0-100`);
  assert(c.met === (c.raised >= c.softCap), `${fl.id}: met flag matches stored figures`);
  if (c.met) assert(c.tickPct <= 100 && Math.abs(c.fillPct - 100) < 1e-9, `${fl.id}: met launch fills the scale, tick sits before the end`);
  else assert(Math.abs(c.tickPct - 100) < 1e-9, `${fl.id}: unmet launch keeps tick at the end`);
}
const over = getCommitment({ totalRaised: "42.5 ETH", softCap: "25 ETH" });
assert(over.state === "ok" && Math.round(over.tickPct) === 59 && over.pct === 170, "42.5/25 ETH: tick at ~59%, 170% of soft cap, overflow allowed (no hard cap)");
assert(getCommitment({ totalRaised: "0 ETH", softCap: "50 ETH" }).state === "ok", "0 raised is a valid commitment");
assert(getCommitment({ totalRaised: undefined, softCap: "50 ETH" }).state === "unavailable", "missing raised is unavailable, not 0%");
assert(getCommitment({ totalRaised: "5 ETH", softCap: undefined }).state === "unavailable", "missing soft cap is unavailable");
assert(getCommitment({ totalRaised: "5 ETH", softCap: "0 ETH" }).state === "unavailable", "zero soft cap is unavailable");
assert(getCommitment({ totalRaised: "5 ETH", softCap: "20 USDC" }).state === "unavailable", "mixed units are unavailable");
assert(getCommitment({ totalRaised: "1,250.5 ETH", softCap: "1,000 ETH" }).state === "ok", "thousands separators parse");

// --- Schedule lanes ---
console.log("\n--- Schedule lanes ---");
const axis = laneAxis(MOCK_FAIR_LAUNCHES);
assert(axis !== null, "axis derived from stored times");
if (axis) {
  const starts = MOCK_FAIR_LAUNCHES.map((f) => new Date(f.startTime!).getTime());
  const ends = MOCK_FAIR_LAUNCHES.map((f) => new Date(f.endTime!).getTime());
  assert(axis.min === Math.min(...starts) && axis.max === Math.max(...ends), "axis spans earliest start to latest end");
  for (const fl of MOCK_FAIR_LAUNCHES) {
    const p = lanePosition(fl, axis)!;
    assert(!!p && p.left >= 0 && p.width >= 3 && p.left + p.width <= 100.0001, `${fl.id}: lane inside 0-100`);
  }
  const a = lanePosition(MOCK_FAIR_LAUNCHES.find((f) => f.id === "fl-matrix-dao")!, axis)!;
  const b = lanePosition(MOCK_FAIR_LAUNCHES.find((f) => f.id === "fl-solargrid-depin")!, axis)!;
  assert(a.left < b.left, "earlier launch sits left of the later one");
}
assert(laneAxis([]) === null, "empty list has no axis");
assert(lanePosition({ startTime: undefined, endTime: "2026-11-01T00:00:00Z" }, axis) === null, "missing start has no lane");
assert(lanePosition({ startTime: "2026-11-05T00:00:00Z", endTime: "2026-11-01T00:00:00Z" }, axis) === null, "end before start has no lane");
const one = laneAxis([MOCK_FAIR_LAUNCHES[0]]);
assert(JSON.stringify(lanePosition(MOCK_FAIR_LAUNCHES[0], one)) === JSON.stringify({ left: 0, width: 100 }), "single launch spans the whole axis");
assert(windowDays({ startTime: "2026-10-28T12:00:00Z", endTime: "2026-11-04T12:00:00Z" }) === 7, "window length 7 days");
assert(windowDays({ startTime: "2026-10-28T12:00:00Z" }) === null, "no window length without an end");
assert(fmtDate("2026-11-04T12:00:00Z") === "4 Nov 2026" && fmtDate(undefined) === "—" && fmtDate("nope") === "—", "UTC date formatting");

// --- Filter parity with the previous implementation ---
console.log("\n--- Filter parity ---");
function legacy(fl: FairLaunch, search: string, status: string, network: string, category: string) {
  const token = tokenMap.get(fl.tokenId);
  const project = fl.projectId ? projectMap.get(fl.projectId) : undefined;
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    if (
      !fl.title.toLowerCase().includes(q) &&
      !(fl.description?.toLowerCase().includes(q) ?? false) &&
      !(token?.name.toLowerCase().includes(q) ?? false) &&
      !(token?.symbol.toLowerCase().includes(q) ?? false) &&
      !(project?.name.toLowerCase().includes(q) ?? false)
    ) return false;
  }
  if (status !== "all" && fl.status !== status) return false;
  if (network === "sepolia") {
    const net = fl.network.toLowerCase();
    if (!net.includes("sepolia") && net !== "ethereum") return false;
  } else if (network !== "all") {
    if (fl.network !== network) return false;
  }
  if (category !== "all") {
    const cat = fl.category || token?.category;
    if (cat !== category) return false;
  }
  return true;
}
const cats = ["all", ...Array.from(new Set(MOCK_FAIR_LAUNCHES.map((f) => f.category!)))];
let combos = 0, mismatches = 0;
for (const search of ["", "mdao", "CCAT", "fair", "quantum", "zzz", "  matrix  "])
  for (const status of ["all", "live", "scheduled", "ended", "finalized", "draft"])
    for (const network of ["all", "sepolia"])
      for (const category of cats)
        for (const fl of MOCK_FAIR_LAUNCHES) {
          combos++;
          if (legacy(fl, search, status, network, category) !== matchesFairLaunch(fl, { search, status, network, category }, tokenMap, projectMap)) mismatches++;
        }
assert(mismatches === 0, `matchesFairLaunch equals the previous filter on ${combos} combinations`);

const stageSum = ["draft", "scheduled", "live", "ended", "finalized"].reduce(
  (n, s) => n + MOCK_FAIR_LAUNCHES.filter((f) => f.status === s).length, 0);
assert(stageSum === MOCK_FAIR_LAUNCHES.length, "the five stage facets partition the catalog");

if (failures) { console.error(`\n${failures} assertion(s) failed`); process.exit(1); }
console.log("\nALL FAIR LAUNCH DIRECTORY UI TESTS PASSED");
