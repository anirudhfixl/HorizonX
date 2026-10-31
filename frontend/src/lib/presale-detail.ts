import type { Presale, PresaleStatus, VerificationStatus } from "@/types";

/**
 * Pure presentation helpers for `/launchpad/presales/[id]`.
 * Everything here is derived from the stored `Presale` record. Nothing is
 * read from a contract, and no clock is used (no countdowns, no "time left").
 */

// ─── Amounts ──────────────────────────────────────────────────────────────────

export interface AmountParts {
  value: number;
  unit: string;
}

/** Parses stored amounts such as "118.5 ETH" or "1,000 ETH". Returns null when the string is not a plain amount. */
export function parseAmountParts(raw?: string): AmountParts | null {
  if (!raw) return null;
  const m = raw.trim().match(/^([0-9][0-9,]*(?:\.[0-9]+)?|\.[0-9]+)\s*([A-Za-z][A-Za-z0-9]*)?$/);
  if (!m) return null;
  const value = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  return { value, unit: m[2] ?? "" };
}

/** Formats a derived number with the record's unit; trims trailing zeros. */
export function formatAmount(value: number, unit: string): string {
  const rounded = Math.round(value * 1e6) / 1e6;
  const text = rounded.toLocaleString("en-US", { maximumFractionDigits: 6 });
  return unit ? `${text} ${unit}` : text;
}

export type RaiseUnavailableReason = "missing" | "invalid" | "unit-mismatch" | "zero-cap";

export type SoftCapState = "reached" | "not-reached" | "unknown";

export interface RaiseSummary {
  available: boolean;
  reason?: RaiseUnavailableReason;
  unit: string;
  raised: number;
  hard?: number;
  soft?: number;
  /** Raised as a share of the hard cap, clamped to 0..100. */
  pctOfHard: number;
  /** Position of the soft cap on the hard-cap scale, only when 0 < soft < hard. */
  softMarkerPct?: number;
  remainingToHard?: number;
  /** Only while the soft cap has not been reached. */
  remainingToSoft?: number;
  softCapState: SoftCapState;
  hardCapReached: boolean;
  /** True when a soft cap exists but could not be compared (different unit). */
  softCapIgnored: boolean;
}

const EMPTY_RAISE: Omit<RaiseSummary, "reason"> = {
  available: false,
  unit: "",
  raised: 0,
  pctOfHard: 0,
  softCapState: "unknown",
  hardCapReached: false,
  softCapIgnored: false,
};

/**
 * Sale progress derived strictly from `totalRaised`, `hardCap` and `softCap`.
 * Returns `available: false` (never a made-up 0%) when the figures cannot be compared.
 */
export function computeRaise(ps: Pick<Presale, "totalRaised" | "hardCap" | "softCap">): RaiseSummary {
  if (!ps.totalRaised || !ps.hardCap) return { ...EMPTY_RAISE, reason: "missing" };
  const raised = parseAmountParts(ps.totalRaised);
  const hard = parseAmountParts(ps.hardCap);
  if (!raised || !hard) return { ...EMPTY_RAISE, reason: "invalid" };
  if (raised.unit.toUpperCase() !== hard.unit.toUpperCase()) return { ...EMPTY_RAISE, reason: "unit-mismatch" };
  if (hard.value <= 0) return { ...EMPTY_RAISE, reason: "zero-cap" };

  const pctOfHard = Math.min(100, Math.max(0, (raised.value / hard.value) * 100));
  const softParts = parseAmountParts(ps.softCap);
  const softComparable = !!softParts && softParts.unit.toUpperCase() === hard.unit.toUpperCase();
  const soft = softComparable ? softParts!.value : undefined;

  let softCapState: SoftCapState = "unknown";
  if (soft !== undefined && soft > 0) softCapState = raised.value >= soft ? "reached" : "not-reached";

  return {
    available: true,
    unit: hard.unit,
    raised: raised.value,
    hard: hard.value,
    soft,
    pctOfHard,
    softMarkerPct: soft !== undefined && soft > 0 && soft < hard.value ? (soft / hard.value) * 100 : undefined,
    remainingToHard: Math.max(0, hard.value - raised.value),
    remainingToSoft: soft !== undefined && softCapState === "not-reached" ? soft - raised.value : undefined,
    softCapState,
    hardCapReached: raised.value >= hard.value,
    softCapIgnored: !!ps.softCap && !softComparable,
  };
}

// ─── Status Normalization ───────────────────────────────────────────────────

export type CanonicalPresaleStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "ended"
  | "finalized"
  | "cancelled"
  | "failed";

/**
 * Normalizes presale status string, resolving the 'canceled' vs 'cancelled' inconsistency.
 * Uses 'cancelled' (double-l) as the canonical internal representation while transparently
 * accepting 'canceled' (single-l) without breaking catalog records or tests.
 */
export function normalizePresaleStatus(status?: string): PresaleStatus {
  if (!status) return "draft";
  const s = status.toLowerCase().trim();
  if (s === "canceled") return "cancelled";
  return s as PresaleStatus;
}

export const CONCLUDED_STATUSES: PresaleStatus[] = ["ended", "finalized", "failed", "cancelled"];

export function isConcluded(status: string): boolean {
  const norm = normalizePresaleStatus(status);
  return CONCLUDED_STATUSES.includes(norm);
}

/** Wording for the soft-cap comparison; tense follows the stored lifecycle status. */
export function softCapLabel(status: string, state: SoftCapState): string | null {
  if (state === "unknown") return null;
  const norm = normalizePresaleStatus(status);
  if (isConcluded(norm)) return state === "reached" ? "Soft cap met" : "Soft cap not met";
  if (norm === "draft" || norm === "scheduled") return "Soft cap not reached yet";
  return state === "reached" ? "Soft cap reached" : "Soft cap not reached yet";
}

// ─── Dates ────────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Deterministic UTC formatting so server and client render identically. Date-only inputs omit the time. */
export function formatUtc(iso?: string, withTime = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const hasTime = iso.length > 10;
  return withTime && hasTime ? `${date}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC` : date;
}

/** Length of the stored sale window, e.g. "7 days" or "3 days 4 hours". Null when it cannot be derived. */
export function windowDuration(start?: string, end?: string): string | null {
  if (!start || !end) return null;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return null;
  const totalHours = Math.round((b - a) / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const d = days ? `${days} day${days === 1 ? "" : "s"}` : "";
  const h = hours ? `${hours} hour${hours === 1 ? "" : "s"}` : "";
  return [d, h].filter(Boolean).join(" ") || null;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export type MilestoneState = "done" | "current" | "upcoming";

export interface Milestone {
  key: "listed" | "opens" | "closes" | "outcome";
  label: string;
  /** Stored value the date comes from; undefined when the record carries none. */
  at?: string;
  /** Short note on what the date means. */
  note: string;
  state: MilestoneState;
}

const OUTCOME_LABEL: Record<string, string> = {
  draft: "Outcome",
  scheduled: "Outcome",
  live: "Outcome",
  ended: "Ended",
  finalized: "Finalized",
  failed: "Failed",
  cancelled: "Cancelled",
  canceled: "Cancelled",
};

/**
 * Four milestones taken from stored fields only. The current stage comes from the stored
 * `status`, not from the clock, so nothing here can drift or fake a countdown.
 */
export function buildMilestones(ps: Presale): Milestone[] {
  const normStatus = normalizePresaleStatus(ps.status);
  const current = normStatus === "draft" ? 0 : normStatus === "scheduled" ? 1 : normStatus === "live" ? 2 : 3;
  const stateFor = (i: number): MilestoneState => (i < current ? "done" : i === current ? "current" : "upcoming");
  const concluded = isConcluded(normStatus);
  const draft = normStatus === "draft";

  return [
    {
      key: "listed",
      label: "Listed",
      at: ps.createdAt,
      note: draft ? "Record created; the sale is a draft and is not open." : "Record created in the catalog.",
      state: stateFor(0),
    },
    {
      key: "opens",
      label: draft ? "Planned opening" : "Opens",
      at: ps.startTime,
      note: draft ? "Planned start; not confirmed." : normStatus === "scheduled" ? "Scheduled opening." : "Opening time stored on the record.",
      state: stateFor(1),
    },
    {
      key: "closes",
      label: draft ? "Planned closing" : "Closes",
      at: ps.endTime,
      note: draft ? "Planned end; not confirmed." : concluded ? "Closing time stored on the record." : "Scheduled closing.",
      state: stateFor(2),
    },
    {
      key: "outcome",
      label: OUTCOME_LABEL[normStatus] ?? "Outcome",
      at: concluded ? ps.updatedAt : undefined,
      note: concluded
        ? "Date shown is when the catalog record was last updated, not a confirmed on-chain event."
        : "Not reached. No outcome is recorded yet.",
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

/** What the stored lifecycle status allows. Participation is only offered while `live`. */
export function participationState(ps: Presale): ParticipationState {
  const normStatus = normalizePresaleStatus(ps.status);
  switch (normStatus) {
    case "live":
      return {
        open: true,
        tone: "open",
        title: "Open for contributions",
        message: ps.endTime ? `Closing time on the record: ${formatUtc(ps.endTime)}.` : "No closing time is recorded.",
      };
    case "scheduled":
      return {
        open: false,
        tone: "pending",
        title: "Not open yet",
        message: ps.startTime ? `Scheduled to open ${formatUtc(ps.startTime)}.` : "No opening time is recorded.",
      };
    case "draft":
      return {
        open: false,
        tone: "pending",
        title: "Draft sale",
        message: "This sale is still a draft. Contributions are not available.",
      };
    case "failed":
      return { open: false, tone: "closed", title: "Sale failed", message: "Contributions are closed." };
    case "cancelled":
      return { open: false, tone: "closed", title: "Sale cancelled", message: "Contributions are closed." };
    default:
      return {
        open: false,
        tone: "closed",
        title: normStatus === "finalized" ? "Sale finalized" : "Sale ended",
        message: "Contributions are closed.",
      };
  }
}

/** Unit used for the contribution input: taken from the stored terms, never assumed. */
export function contributionUnit(ps: Pick<Presale, "minContribution" | "maxContribution" | "hardCap" | "softCap">): string {
  for (const v of [ps.minContribution, ps.maxContribution, ps.hardCap, ps.softCap]) {
    const p = parseAmountParts(v);
    if (p?.unit) return p.unit;
  }
  return "";
}

export type ContributionCheck =
  | { status: "empty" }
  | { status: "ok"; value: number }
  | { status: "invalid" | "below-min" | "above-max"; message: string };

/** Checks an entered amount against the stored per-wallet minimum and maximum only. */
export function validateContribution(
  input: string,
  ps: Pick<Presale, "minContribution" | "maxContribution">
): ContributionCheck {
  const text = input.trim();
  if (!text) return { status: "empty" };
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return { status: "invalid", message: "Enter a plain number, for example 0.5." };
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) return { status: "invalid", message: "Amount must be greater than zero." };
  const decimals = text.split(".")[1]?.length ?? 0;
  if (decimals > 18) return { status: "invalid", message: "No more than 18 decimal places." };
  const min = parseAmountParts(ps.minContribution);
  const max = parseAmountParts(ps.maxContribution);
  if (min && value < min.value) {
    return { status: "below-min", message: `Below the minimum contribution of ${ps.minContribution}.` };
  }
  if (max && value > max.value) {
    return { status: "above-max", message: `Above the maximum contribution of ${ps.maxContribution}.` };
  }
  return { status: "ok", value };
}

// ─── Verification labels (stored tier → label) ───────────────────────────────

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  not_reviewed: "Not reviewed",
  wallet_connected: "Wallet connected",
  wallet_ownership_confirmed: "Wallet ownership confirmed",
  identity_kyc_passed: "Identity check passed",
  project_reviewed: "Project reviewed",
  contract_source_verified: "Source verified",
  audit_available: "Audit available",
  risk_flag: "Risk flag recorded",
};

export function verificationLabel(status?: VerificationStatus): string {
  return status ? VERIFICATION_LABELS[status] ?? status : "Not reviewed";
}

/** Terms the record does not carry. Shown explicitly instead of being invented. */
export const NOT_RECORDED_TERMS: { label: string; detail: string }[] = [
  { label: "Token price / sale rate", detail: "No price or tokens-per-ETH rate is stored for this sale." },
  { label: "Tokens offered", detail: "No sale allocation is stored." },
  { label: "Vesting and unlock schedule", detail: "No vesting terms are stored." },
  { label: "Liquidity and lock terms", detail: "No liquidity or lock terms are stored." },
  { label: "Refund rules", detail: "No refund or soft-cap-failure rules are stored." },
  { label: "Sale contract", detail: "No presale contract address is stored, so figures are not read on-chain." },
];

// ─── Creator Authorization & Owner Management ───────────────────────────────

/**
 * Checks whether the connected wallet is authorized to manage the given launch record.
 * Case-insensitive comparison against the stored ownerAddress.
 */
export function isAuthorizedCreator(
  ownerAddress?: string | null,
  walletAddress?: string | null,
  isConnected?: boolean
): boolean {
  if (!isConnected || !ownerAddress || !walletAddress) return false;
  return ownerAddress.trim().toLowerCase() === walletAddress.trim().toLowerCase();
}

export interface StatusTransitionRule {
  target: PresaleStatus;
  label: string;
  description: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

/**
 * Returns allowed lifecycle status transitions from the current state.
 * Terminal states (finalized, cancelled, failed) cannot be transitioned further.
 */
export function getAllowedStatusTransitions(currentStatus?: string): StatusTransitionRule[] {
  const norm = normalizePresaleStatus(currentStatus);
  switch (norm) {
    case "draft":
      return [
        {
          target: "scheduled",
          label: "Schedule Launch",
          description: "Schedule this launch for its planned opening time.",
          variant: "outline",
        },
        {
          target: "live",
          label: "Go Live Immediately",
          description: "Open the sale for contributions right away.",
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
          label: "Open Sale (Go Live)",
          description: "Transition the presale to live contribution mode.",
          variant: "default",
        },
        {
          target: "cancelled",
          label: "Cancel Simulation",
          description: "Cancel this scheduled launch simulation.",
          variant: "destructive",
        },
      ];
    case "live":
      return [
        {
          target: "ended",
          label: "Close Sale (End)",
          description: "Close contributions while awaiting settlement or finalization.",
          variant: "outline",
        },
        {
          target: "finalized",
          label: "Finalize Presale",
          description: "Simulate soft-cap validation, lock LP, and prepare token distribution.",
          variant: "default",
        },
        {
          target: "cancelled",
          label: "Cancel Presale",
          description: "Cancel the sale and open simulated refund claims.",
          variant: "destructive",
        },
      ];
    case "ended":
      return [
        {
          target: "finalized",
          label: "Finalize Presale",
          description: "Complete the presale settlement.",
          variant: "default",
        },
        {
          target: "failed",
          label: "Mark as Failed",
          description: "Mark the presale as failed (e.g. soft cap not met).",
          variant: "destructive",
        },
      ];
    default:
      return [];
  }
}

// ─── Derived Terms & Allocation Calculations ────────────────────────────────

export interface DerivedTerms {
  presaleRate?: number;
  presaleRateUnit?: string;
  hardCapTokensRequired?: number;
  softCapTokensRequired?: number;
  hasDerivedTokens: boolean;
}

/**
 * Derives token requirements from hard/soft cap and presale rate if recorded.
 * Does not guess or invent missing values.
 */
export function derivePresaleTerms(
  hardCapStr?: string,
  softCapStr?: string,
  presaleRateStr?: string | number
): DerivedTerms {
  let rateNum: number | undefined;
  let rateUnit: string | undefined;

  if (typeof presaleRateStr === "number" && Number.isFinite(presaleRateStr) && presaleRateStr > 0) {
    rateNum = presaleRateStr;
  } else if (typeof presaleRateStr === "string") {
    const parts = parseAmountParts(presaleRateStr);
    if (parts && parts.value > 0) {
      rateNum = parts.value;
      rateUnit = parts.unit;
    }
  }

  const hardParts = parseAmountParts(hardCapStr);
  const softParts = parseAmountParts(softCapStr);

  const hardTokens = rateNum && hardParts ? hardParts.value * rateNum : undefined;
  const softTokens = rateNum && softParts ? softParts.value * rateNum : undefined;

  return {
    presaleRate: rateNum,
    presaleRateUnit: rateUnit,
    hardCapTokensRequired: hardTokens,
    softCapTokensRequired: softTokens,
    hasDerivedTokens: hardTokens !== undefined && hardTokens > 0,
  };
}

