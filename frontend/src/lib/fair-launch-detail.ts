import type { FairLaunch, PresaleStatus } from "@/types";
import {
  formatUtc,
  isAuthorizedCreator,
  normalizePresaleStatus,
  parseAmountParts,
} from "@/lib/presale-detail";

export { isAuthorizedCreator, normalizePresaleStatus };

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

export function isConcluded(status?: string): boolean {
  const norm = normalizePresaleStatus(status);
  return CONCLUDED_STATUSES.includes(norm);
}

/** Soft-cap wording. Tense follows the stored lifecycle status, never the clock. */
export function softCapStatement(status: string | undefined, c: Commitment): string | null {
  if (!c.available) return null;
  const norm = normalizePresaleStatus(status);
  if (isConcluded(norm)) return c.state === "reached" ? "Soft cap met" : "Soft cap not met";
  if ((norm === "draft" || norm === "scheduled") && c.raised === 0) return "Nothing raised yet";
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
  const norm = normalizePresaleStatus(fl.status);
  const current = norm === "draft" ? 0 : norm === "scheduled" ? 1 : norm === "live" ? 2 : 3;
  const stateFor = (i: number): MilestoneState => (i < current ? "done" : i === current ? "current" : "upcoming");
  const concluded = isConcluded(norm);
  const draft = norm === "draft";

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
      note: draft ? "Planned start; not confirmed." : norm === "scheduled" ? "Scheduled opening." : "Opening time on the record.",
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
      label: OUTCOME_LABEL[norm] || "Outcome",
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
export function participationState(fl: { status?: string; startTime?: string; endTime?: string }): ParticipationState {
  const norm = normalizePresaleStatus(fl.status);
  switch (norm) {
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
  { label: "Token price / allocation rule", detail: "No fixed price or static conversion rate exists; tokens are distributed proportionally from the pool." },
  { label: "Vesting and unlock schedule", detail: "No vesting terms are stored." },
  { label: "Liquidity and lock terms", detail: "No liquidity pool, LP lock or burn terms are stored." },
  { label: "Refund rules", detail: "No refund or soft-cap-failure rules are stored." },
  { label: "Launch contract", detail: "No fair launch contract address is stored, so no figure here is read on-chain." },
];

// ─── Status Transitions ──────────────────────────────────────────────────────

export interface StatusTransitionRule {
  target: PresaleStatus;
  label: string;
  description: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

/**
 * Allowed status transitions for Fair Launch.
 * Terminal states (finalized, cancelled, failed) cannot transition further.
 */
export function getAllowedFairLaunchStatusTransitions(currentStatus?: string): StatusTransitionRule[] {
  const norm = normalizePresaleStatus(currentStatus);
  switch (norm) {
    case "draft":
      return [
        {
          target: "scheduled",
          label: "Schedule Launch",
          description: "Schedule this fair launch for its planned opening time.",
          variant: "outline",
        },
        {
          target: "live",
          label: "Go Live Immediately",
          description: "Open the fair launch pool for contributions right away.",
          variant: "default",
        },
        {
          target: "cancelled",
          label: "Cancel Simulation",
          description: "Abort this simulation draft.",
          variant: "destructive",
        },
      ];
    case "scheduled":
      return [
        {
          target: "live",
          label: "Open Pool (Go Live)",
          description: "Transition the fair launch to live contribution mode.",
          variant: "default",
        },
        {
          target: "cancelled",
          label: "Cancel Simulation",
          description: "Cancel this scheduled fair launch simulation.",
          variant: "destructive",
        },
      ];
    case "live":
      return [
        {
          target: "ended",
          label: "Close Pool (End)",
          description: "Close contributions while awaiting pool settlement or finalization.",
          variant: "outline",
        },
        {
          target: "finalized",
          label: "Finalize Fair Launch",
          description: "Simulate soft-cap check, lock LP, and prepare proportional token distribution.",
          variant: "default",
        },
        {
          target: "cancelled",
          label: "Cancel Fair Launch",
          description: "Cancel the launch and open simulated refund claims.",
          variant: "destructive",
        },
      ];
    case "ended":
      return [
        {
          target: "finalized",
          label: "Finalize Fair Launch",
          description: "Complete the fair launch settlement and calculate final token distribution.",
          variant: "default",
        },
        {
          target: "failed",
          label: "Mark as Failed",
          description: "Mark the fair launch as failed (e.g. soft cap not met).",
          variant: "destructive",
        },
      ];
    default:
      return [];
  }
}

// ─── Derived Terms & Allocation Calculations ────────────────────────────────

export interface DerivedFairLaunchTerms {
  totalSellingTokens?: number;
  totalSellingUnit?: string;
  softCapAmount?: number;
  softCapUnit?: string;
  totalRaisedAmount?: number;
  totalRaisedUnit?: string;
  tokensPerUnitAtSoftCap?: number;
  currentTokensPerUnit?: number;
  pctOfTotalSupply?: number;
  hasDerivedCalculations: boolean;
}

/**
 * Derives token math and proportional pool metrics from stored records.
 * Never guesses or invents missing parameters.
 */
export function deriveFairLaunchTerms(
  totalSellingStr?: string,
  softCapStr?: string,
  totalRaisedStr?: string,
  tokenTotalSupplyStr?: string | number
): DerivedFairLaunchTerms {
  const sellingParts = parseAmountParts(totalSellingStr);
  const softParts = parseAmountParts(softCapStr);
  const raisedParts = parseAmountParts(totalRaisedStr);

  let totalSupplyNum: number | undefined;
  if (typeof tokenTotalSupplyStr === "number" && Number.isFinite(tokenTotalSupplyStr) && tokenTotalSupplyStr > 0) {
    totalSupplyNum = tokenTotalSupplyStr;
  } else if (typeof tokenTotalSupplyStr === "string") {
    const parsed = parseAmountParts(tokenTotalSupplyStr);
    if (parsed && parsed.value > 0) {
      totalSupplyNum = parsed.value;
    } else {
      const clean = parseFloat(tokenTotalSupplyStr.replace(/,/g, ""));
      if (Number.isFinite(clean) && clean > 0) {
        totalSupplyNum = clean;
      }
    }
  }

  const sellingVal = sellingParts && sellingParts.value > 0 ? sellingParts.value : undefined;
  const softVal = softParts && softParts.value > 0 ? softParts.value : undefined;
  const raisedVal = raisedParts && raisedParts.value > 0 ? raisedParts.value : undefined;

  const tokensPerUnitAtSoftCap = sellingVal && softVal ? sellingVal / softVal : undefined;
  const currentTokensPerUnit = sellingVal && raisedVal ? sellingVal / raisedVal : undefined;
  const pctOfTotalSupply = sellingVal && totalSupplyNum && totalSupplyNum > 0 ? (sellingVal / totalSupplyNum) * 100 : undefined;

  return {
    totalSellingTokens: sellingVal,
    totalSellingUnit: sellingParts?.unit,
    softCapAmount: softVal,
    softCapUnit: softParts?.unit,
    totalRaisedAmount: raisedVal,
    totalRaisedUnit: raisedParts?.unit,
    tokensPerUnitAtSoftCap,
    currentTokensPerUnit,
    pctOfTotalSupply,
    hasDerivedCalculations: Boolean(tokensPerUnitAtSoftCap || currentTokensPerUnit || pctOfTotalSupply),
  };
}
