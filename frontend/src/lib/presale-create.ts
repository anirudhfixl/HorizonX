import type { Token } from "@/types";

/**
 * Pure helpers for `/launchpad/presales/create`.
 *
 * The existing flow is a Phase 1 simulation: nothing is deployed and nothing is stored.
 * These helpers only check what the person typed and derive arithmetic from it.
 */

export interface PresaleDraft {
  tokenAddress: string;
  presaleRate: string;
  softCap: string;
  hardCap: string;
  minContribution: string;
  maxContribution: string;
}

/** Same defaults the form always started with. */
export const DEFAULT_DRAFT: PresaleDraft = {
  tokenAddress: "",
  presaleRate: "1000",
  softCap: "50",
  hardCap: "150",
  minContribution: "0.1",
  maxContribution: "3.0",
};

export type DraftField = keyof PresaleDraft;
export type DraftErrors = Partial<Record<DraftField, string>>;

export type StepKey = "token" | "caps" | "limits" | "review";
export const STEP_FIELDS: Record<Exclude<StepKey, "review">, DraftField[]> = {
  token: ["tokenAddress"],
  caps: ["presaleRate", "softCap", "hardCap"],
  limits: ["minContribution", "maxContribution"],
};

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const NUMBER_RE = /^(\d+\.?\d*|\.\d+)$/;

/** Parses a plain decimal. Returns null for empty, signed, exponent or otherwise unreadable input. */
export function parseNumber(raw: string): number | null {
  const t = raw.trim();
  if (!NUMBER_RE.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Validation for the form. Rules that existed before: the token address is required and the
 * numeric fields are numbers. Added rules are marked (new) so the handoff can list them.
 */
export function validateDraft(d: PresaleDraft): DraftErrors {
  const e: DraftErrors = {};
  const addr = d.tokenAddress.trim();

  if (!addr) e.tokenAddress = "Enter the token contract address. It is required.";
  else if (!ADDRESS_RE.test(addr)) e.tokenAddress = "Use a full address: 0x followed by 40 hexadecimal characters."; // (new)

  const rate = parseNumber(d.presaleRate);
  const soft = parseNumber(d.softCap);
  const hard = parseNumber(d.hardCap);
  const min = parseNumber(d.minContribution);
  const max = parseNumber(d.maxContribution);

  if (rate === null) e.presaleRate = "Enter the rate as a plain number, for example 1000.";
  else if (rate <= 0) e.presaleRate = "The rate must be greater than zero."; // (new)

  if (soft === null) e.softCap = "Enter the soft cap as a plain number, for example 50.";
  else if (soft <= 0) e.softCap = "The soft cap must be greater than zero."; // (new)

  if (hard === null) e.hardCap = "Enter the hard cap as a plain number, for example 150.";
  else if (hard <= 0) e.hardCap = "The hard cap must be greater than zero."; // (new)
  else if (soft !== null && soft > 0 && soft > hard) e.hardCap = "The hard cap must be at least the soft cap."; // (new)

  if (min === null) e.minContribution = "Enter the minimum as a plain number, for example 0.1.";
  else if (min < 0) e.minContribution = "The minimum cannot be negative."; // (new)

  if (max === null) e.maxContribution = "Enter the maximum as a plain number, for example 3.";
  else if (max <= 0) e.maxContribution = "The maximum must be greater than zero."; // (new)
  else if (min !== null && min > max) e.maxContribution = "The maximum must be at least the minimum."; // (new)
  else if (hard !== null && hard > 0 && max > hard) e.maxContribution = "The maximum per wallet cannot exceed the hard cap."; // (new)

  return e;
}

export function stepErrors(step: Exclude<StepKey, "review">, errors: DraftErrors): DraftField[] {
  return STEP_FIELDS[step].filter((f) => errors[f]);
}

export interface Derived {
  /** hard cap × rate, in whole tokens. Token decimals are not considered. */
  tokensAtHardCap: number | null;
  tokensAtSoftCap: number | null;
  /** Soft cap as a share of the hard cap. */
  softPctOfHard: number | null;
  /** Fewest wallets that could fill the hard cap at the maximum contribution. */
  minWalletsToFill: number | null;
}

export function deriveDraft(d: PresaleDraft): Derived {
  const rate = parseNumber(d.presaleRate);
  const soft = parseNumber(d.softCap);
  const hard = parseNumber(d.hardCap);
  const max = parseNumber(d.maxContribution);
  return {
    tokensAtHardCap: rate && hard ? rate * hard : null,
    tokensAtSoftCap: rate && soft ? rate * soft : null,
    softPctOfHard: soft !== null && hard ? (soft / hard) * 100 : null,
    minWalletsToFill: hard && max ? Math.ceil(hard / max - 1e-9) : null,
  };
}

export function formatNumber(n: number): string {
  return (Math.round(n * 1e6) / 1e6).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

/** Catalog lookup only: matches the typed address against sample catalog tokens, never on-chain. */
export function findCatalogToken(address: string, tokens: Token[]): Token | undefined {
  const a = address.trim().toLowerCase();
  if (!ADDRESS_RE.test(address.trim())) return undefined;
  return tokens.find((t) => t.contractAddress?.toLowerCase() === a);
}

/** What this form does not collect. Shown so nothing is assumed. */
export const NOT_COLLECTED: { label: string; detail: string }[] = [
  { label: "Start and end time", detail: "This form has no schedule fields, so no sale window is set." },
  { label: "Project link", detail: "No project is selected or linked." },
  { label: "Vesting and unlock schedule", detail: "No vesting terms are collected." },
  { label: "Liquidity and lock terms", detail: "No liquidity or LP-lock settings are collected." },
  { label: "Refund rules", detail: "No refund or soft-cap-failure rules are collected." },
];

export const SIMULATION_TITLE = "Presale Simulation Configured";
export const SIMULATION_DESCRIPTION =
  "Phase 1 demonstration: Presale escrow parameters validated. No on-chain contract deployed.";
