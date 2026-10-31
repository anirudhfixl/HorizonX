/**
 * Launchpad Hub — data-shaping tests (parseAmount, progress, grouping, date format).
 * Run: npx tsx src/tests/launchpad-hub.test.ts
 */
import {
  parseAmount,
  buildLaunchEntries,
  progressFor,
  softCapMet,
  groupLaunches,
  formatUtc,
} from "../components/launchpad/launchpad-hub";
import { MOCK_PRESALES, MOCK_FAIR_LAUNCHES } from "../lib/mock-data";

function assert(c: boolean, m: string) {
  if (!c) {
    console.error(`❌ FAILED: ${m}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${m}`);
}

const a = parseAmount("118.5 ETH");
assert(!!a && a.value === 118.5 && a.unit === "ETH", "parseAmount reads decimals and unit");
assert(parseAmount("10,000,000 MDAO")?.value === 10000000, "parseAmount strips thousands separators");
assert(parseAmount(undefined) === null && parseAmount("n/a") === null, "parseAmount returns null for missing/invalid");

const all = buildLaunchEntries();
assert(all.length === MOCK_PRESALES.length + MOCK_FAIR_LAUNCHES.length, "every presale and fair launch is listed exactly once");
assert(new Set(all.map((e) => e.href)).size === all.length, "every entry has a unique route");
assert(all.every((e) => e.href.startsWith("/launchpad/presales/") || e.href.startsWith("/launchpad/launches/")), "links point at existing detail routes");

for (const e of all) {
  const p = progressFor(e);
  if (p) {
    assert(p.fill >= 0 && p.fill <= 1 && !Number.isNaN(p.fill), `${e.id}: fill within 0..1`);
    assert(p.marker === null || (p.marker >= 0 && p.marker <= 1), `${e.id}: marker within 0..1`);
  }
}
const quantum = all.find((e) => e.id === "ps-quantum-net")!;
assert(Math.abs(progressFor(quantum)!.fill - 118.5 / 150) < 1e-9, "presale fill = raised / hard cap (not a fixed value)");
const matrix = all.find((e) => e.id === "fl-matrix-dao")!;
assert(progressFor(matrix)!.fill === 1 && progressFor(matrix)!.marker !== null && progressFor(matrix)!.marker! < 1, "fair launch above soft cap scales to raised with marker below it");
const draftNo = all.find((e) => e.id === "ps-defi-nexus")!;
assert(progressFor(draftNo)!.fill === 0, "zero raised renders an empty bar");
assert(softCapMet(all.find((e) => e.id === "fl-aurora-gpu")!) === true, "soft cap met derived from stored figures");

const g = groupLaunches(all);
assert(g.live.length + g.upcoming.length + g.drafts.length + g.concluded.length === all.length, "groups partition all entries");
assert(g.live.every((e) => e.status === "live"), "live group only holds live records");
for (let i = 1; i < g.live.length; i++) assert(new Date(g.live[i - 1].endTime!) <= new Date(g.live[i].endTime!), "live sorted by close time");
for (let i = 1; i < g.upcoming.length; i++) assert(new Date(g.upcoming[i - 1].startTime!) <= new Date(g.upcoming[i].startTime!), "scheduled sorted by open time");
for (let i = 1; i < g.concluded.length; i++) assert(new Date(g.concluded[i - 1].endTime!) >= new Date(g.concluded[i].endTime!), "concluded newest first");

assert(formatUtc("2026-11-04T12:00:00Z") === "4 Nov 2026, 12:00 UTC", "UTC date formatting");
assert(formatUtc(undefined) === "—" && formatUtc("garbage") === "—", "missing/invalid dates show a dash");

console.log("\n✅ ALL LAUNCHPAD HUB TESTS PASSED");
