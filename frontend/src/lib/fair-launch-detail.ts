import type { FairLaunch, PresaleStatus } from "@/types";
import { formatUtc, parseAmountParts } from "@/lib/presale-detail";

/**
 * Pure presentation helpers for `/launchpad/launches/[id]`.
 *
 * Everything is derived from the stored `FairLaunch` record. A fair launch record stores a
 * soft cap, a total for sale, a contribution range, a window and recorded figures. It does NOT
 * store a hard cap, price, allocation rule, vesting, liquidity terms or a contract, so none of
 * those are computed here. No clock is used (no countdowns, no "time left").
 */

// ─── Commitment (raise against the soft cap) ─────────────────────────────────

export type CommitmentUnavailableReason = "missing-raised" | "missing-soft-cap" | "invalid" | "unit-mismatch" | "zero-cap";

export type SoftCapState = "reached" | "not-reached";

export type Commitment =
  | { available: false; reason: CommitmentUnavailableReason }
  | {
      available: true;
      unit: string;
      raised: number;
      softCap: number;
      /** Raised as a share of the soft cap. Can exceed 100: a fair launch has no hard cap to stop it. */
      pctOfSoft: number;
      /** Width of the fill on a bar whose scale is max(raised, soft cap). 0..100 */
      fillPct: number;
      /** Position of the soft-cap tick on that same scale. Sits at 100 until the raise passes the soft cap. 0..100 */
      tickPct: number;
      state: SoftCapState;
      /** Only while the soft cap has not been reached. */
      remainingToSoft?: number;
      /** Only once the soft cap has been passed. */
      overSoft?: number;
    };

export function computeCommitment(fl: Pick<FairLaunch, "totalRaised" | "softCap">): Commitment {
  if (!fl.totalRaised) return { available: false, reason: "missing-raised" };
  if (!fl.softCap) return { available: false, reason: "missing-soft-cap" };
  const raised = parseAmountParts(fl.totalRaised);
  const cap = parseAmountParts(fl.softCap);
  if (!raised || !cap) return { available: false, reason: "invalid" };
  if (raised.unit.toUpperCase() !== cap.unit.toUpperCase()) return { available: false, reason: "unit-mismatch" };
  if (cap.value <= 0) return { available: false, reason: "zero-cap" };

  const scale = Math.max(raised.value, cap.value);
  const state: SoftCapState = raised.value >= cap.value ? "reached" : "not-reached";
  return {
    available: true,
    unit: cap.unit,
    raised: raised.value,
    softCap: cap.value,
    pctOfSoft: (raised.value / cap.value) * 100,
    fillPct: (raised.value / scale) * 100,
    tickPct: (cap.value / scale) * 100,
    state,
    remainingToSoft: state === "not-reached" ? cap.value - raised.value : undefined,
    overSoft: raised.value > cap.value ? raised.value - cap.value : undefined,
  };
}

export const COMMITMENT_UNAVAILABLE: Record<CommitmentUnavailableReason, string> = {
  "missing-raised": "The record has no total raised, so progress cannot be shown.",
  "missing-soft-cap": "The record has no soft cap, so progress cannot be shown.",
  invalid: "The stored raised or soft cap amount could not be read as a number, so progress is not shown.",
  "unit-mismatch": "Raised and soft cap use different units, so progress is not computed.",
  "zero-cap": "The stored soft cap is zero, so progress is not computed.",
};

export const CONCLUDED_STATUSES: PresaleStatus[] = ["ended", "finalized", "failed", "cancelled"];

export function isConcluded(status: PresaleStatus): boolean {
  return CONCLUDED_STATUSES.includes(status);
}

/** Soft-cap wording. Tense follows the stored lifecycle status, never the clock. */
export function softCapStatement(status: PresaleStatus, c: Commitment): string | null {
  if (!c.available) return null;
  if (isConcluded(status)) return c.state === "reached" ? "Soft cap met" : "Soft cap not met";
  if ((status === "draft" || status === "scheduled") && c.raised === 0) return "Nothing raised yet";
  return c.state === "reached" ? "Soft cap reached" : "Soft cap not reached yet";
}

/** Percentage text: whole numbers stay whole, otherwise one decimal. */
export function formatPct(pct: number): string {
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export type MilestoneState = "done" | "current" | "upcoming";

export interface Milestone {
  key: "listed" | "opens" | "closes" | "outcome";
  label: string;
  at?: string;
  note: string;
  state: MilestoneState;
}

const OUTCOME_LABEL: Record<PresaleStatus, string> = {
  draft: "Outcome",
  scheduled: "Outcome",
  live: "Outcome",
  ended: "Ended",
  finalized: "Finalized",
  failed: "Failed",
  cancelled: "Cancelled",
};

/**
 * Four milestones from stored fields only. The current stage comes from the stored `status`
 * so nothing here can drift or fake a countdown.
 */
export function buildMilestones(fl: Pick<FairLaunch, "status" | "createdAt" | "startTime" | "endTime" | "updatedAt">): Milestone[] {
  const current = fl.status === "draft" ? 0 : fl.status === "scheduled" ? 1 : fl.status === "live" ? 2 : 3;
  const stateFor = (i: number): MilestoneState => (i < current ? "done" : i === current ? "current" : "upcoming");
  const concluded = isConcluded(fl.status);
  const draft = fl.status === "draft";

  return [
    {
      key: "listed",
      label: "Listed",
      at: fl.createdAt,
      note: draft ? "Record created; the launch is a draft." : "Record created in the catalog.",
      state: stateFor(0),
    },
    {
      key: "opens",
      label: draft ? "Planned opening" : "Opens",
      at: fl.startTime,
      note: draft ? "Planned start; not confirmed." : fl.status === "scheduled" ? "Scheduled opening." : "Opening time on the record.",
      state: stateFor(1),
    },
    {
      key: "closes",
      label: draft ? "Planned closing" : "Closes",
      at: fl.endTime,
      note: draft ? "Planned end; not confirmed." : concluded ? "Closing time on the record." : "Scheduled closing.",
      state: stateFor(2),
    },
    {
      key: "outcome",
      label: OUTCOME_LABEL[fl.status],
      at: concluded ? fl.updatedAt : undefined,
      note: concluded
        ? "This is the date the catalog record was last updated, not a confirmed on-chain event."
        : "Not reached. No outcome is recorded.",
      state: stateFor(3),
    },
  ];
}

// ─── Participation ────────────────────────────────────────────────────────────

export interface ParticipationState {
  open: boolean;
  tone: "open" | "pending" | "closed";
  title: string;
  message: string;
}

/** What the stored lifecycle status allows. Contributions are only offered while `live`. */
export function participationState(fl: Pick<FairLaunch, "status" | "startTime" | "endTime">): ParticipationState {
  switch (fl.status) {
    case "live":
      return {
        open: true,
        tone: "open",
        title: "Open for contributions",
        message: fl.endTime ? `Closing time on the record: ${formatUtc(fl.endTime)}.` : "No closing time is recorded.",
      };
    case "scheduled":
      return {
        open: false,
        tone: "pending",
        title: "Not open yet",
        message: fl.startTime ? `Scheduled to open ${formatUtc(fl.startTime)}.` : "No opening time is recorded.",
      };
    case "draft":
      return {
        open: false,
        tone: "pending",
        title: "Draft launch",
        message: "This launch is still a draft. Contributions are not available.",
      };
    case "failed":
      return { open: false, tone: "closed", title: "Launch failed", message: "Contributions are closed." };
    case "cancelled":
      return { open: false, tone: "closed", title: "Launch cancelled", message: "Contributions are closed." };
    case "finalized":
      return { open: false, tone: "closed", title: "Launch finalized", message: "Contributions are closed." };
    default:
      return { open: false, tone: "closed", title: "Launch ended", message: "Contributions are closed." };
  }
}

/** Unit for the contribution input, taken from the stored terms and never assumed. */
export function contributionUnit(fl: Pick<FairLaunch, "minContribution" | "maxContribution" | "softCap" | "totalRaised">): string {
  for (const v of [fl.minContribution, fl.maxContribution, fl.softCap, fl.totalRaised]) {
    const p = parseAmountParts(v);
    if (p?.unit) return p.unit;
  }
  return "";
}

/** Number of participants as stored. A recorded 0 stays 0; a missing value stays missing. */
export function participantsLabel(count?: number): string {
  return count === undefined ? "—" : count.toLocaleString("en-US");
}

// ─── Terms the record does not carry ─────────────────────────────────────────

export const NOT_RECORDED_TERMS: { label: string; detail: string }[] = [
  { label: "Hard cap", detail: "Fair launch records do not store a hard cap, so the raise is not capped here." },
  { label: "Token price / allocation rule", detail: "No price, rate or rule for how contributions become tokens is stored." },
  { label: "Vesting and unlock schedule", detail: "No vesting terms are stored." },
  { label: "Liquidity and lock terms", detail: "No liquidity pool, LP lock or burn terms are stored." },
  { label: "Refund rules", detail: "No refund or soft-cap-failure rules are stored." },
  { label: "Launch contract", detail: "No fair launch contract address is stored, so no figure here is read on-chain." },
];
