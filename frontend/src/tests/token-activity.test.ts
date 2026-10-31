/** Token Activity helper tests. Run: npx tsx src/tests/token-activity.test.ts */
import { MOCK_TOKENS, MOCK_PRESALES, MOCK_FAIR_LAUNCHES, MOCK_AIRDROPS, MOCK_STAKING_POOLS } from "../lib/mock-data";
import { buildCatalogEvents, sortEvents, dayKey } from "../components/tokens/token-activity";

let failed = 0;
const assert = (c: boolean, m: string) => {
  if (!c) { failed++; console.error("FAILED: " + m); } else console.log("PASSED: " + m);
};
type Rec = { tokenId: string; projectId?: string; createdAt: string; startTime?: string; endTime?: string };
const rel = <T extends Rec>(t: { id: string; projectId?: string }, a: T[]): T[] =>
  a.filter((x) => x.tokenId === t.id || (t.projectId && x.projectId === t.projectId));

for (const t of MOCK_TOKENS) {
  const ps = rel(t, MOCK_PRESALES), fl = rel(t, MOCK_FAIR_LAUNCHES), ad = rel(t, MOCK_AIRDROPS), sp = rel(t, MOCK_STAKING_POOLS);
  const ev = buildCatalogEvents(t, ps, fl, ad, sp);
  assert(ev.length >= 1 && ev.some((e) => e.id === `token-created-${t.id}`), `${t.id}: has token created event`);
  assert(new Set(ev.map((e) => e.id)).size === ev.length, `${t.id}: unique event ids`);
  const dates = new Set<string>([t.createdAt, t.updatedAt]);
  ([...ps, ...fl, ...ad, ...sp] as Rec[]).forEach((r) => [r.createdAt, r.startTime, r.endTime].forEach((d) => d && dates.add(d)));
  assert(ev.every((e) => dates.has(e.date)), `${t.id}: every event date exists on a stored record`);
  const asc = sortEvents(ev, "oldest").map((e) => Date.parse(e.date));
  assert(asc.every((v, i) => i === 0 || asc[i - 1] <= v), `${t.id}: oldest-first is chronological`);
  const desc = sortEvents(ev, "newest").map((e) => Date.parse(e.date));
  assert(desc.every((v, i) => i === 0 || desc[i - 1] >= v), `${t.id}: newest-first is chronological`);
}
const none = buildCatalogEvents({ ...MOCK_TOKENS[0], createdAt: "", updatedAt: "" }, [], [], [], []);
assert(none.length === 0, "records without dates yield no events");
assert(dayKey("2026-10-28T12:00:00Z") === "2026-10-28", "dayKey is UTC");
if (failed) process.exit(1);
console.log("ALL TOKEN ACTIVITY TESTS PASSED");
