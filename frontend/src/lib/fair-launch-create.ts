import type { Token } from "@/types";
import { parseNumber } from "@/lib/presale-create";
import { parseAmountParts } from "@/lib/presale-detail";

/**
 * Pure helpers for `/launchpad/launches/create`.
 *
 * The existing flow is a Phase 1 simulation: nothing is deployed and nothing is stored.
 * A fair launch record stores a total for sale and a soft cap (plus a window and contribution
 * limits that this form does not collect). It stores no hard cap, price, allocation rule,
 * vesting, liquidity lock or refund rule, so none of those are computed or implied here.
 */

export interface FairLaunchDraft {
  tokenAddress: string;
  totalSelling: string;
  softCap: string;
}

/** Same defaults the form always started with. */
export const DEFAULT_FL_DRAFT: FairLaunchDraft = {
  tokenAddress: "",
  totalSelling: "5000000",
  softCap: "20",
};

export type FlField = keyof FairLaunchDraft;
export type FlErrors = Partial<Record<FlField, string>>;
export type FlStepKey = "token" | "offering" | "review";

export const FL_STEP_FIELDS: Record<Exclude<FlStepKey, "review">, FlField[]> = {
  token: ["tokenAddress"],
  offering: ["totalSelling", "softCap"],
};

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * Rules that existed before: the address is required and the two amounts are numbers.
 * Added rules are marked (new).
 */
export function validateFairLaunch(d: FairLaunchDraft): FlErrors {
  const e: FlErrors = {};
  const addr = d.tokenAddress.trim();
  if (!addr) e.tokenAddress = "Enter the token contract address. It is required.";
  else if (!ADDRESS_RE.test(addr)) e.tokenAddress = "Use a full address: 0x followed by 40 hexadecimal characters."; // (new)

  const total = parseNumber(d.totalSelling);
  if (total === null) e.totalSelling = "Enter the token amount as a plain number, for example 5000000.";
  else if (total <= 0) e.totalSelling = "The amount for sale must be greater than zero."; // (new)

  const soft = parseNumber(d.softCap);
  if (soft === null) e.softCap = "Enter the soft cap as a plain number, for example 20.";
  else if (soft <= 0) e.softCap = "The soft cap must be greater than zero."; // (new)
  return e;
}

export interface SupplyComparison {
  supply: number;
  /** Tokens for sale as a share of the catalog token's recorded total supply. */
  sharePct: number;
  exceeds: boolean;
}

/**
 * Compares the entered amount with the sample catalog's recorded total supply for a matched token.
 * Null when there is no match, no readable supply or no readable amount. Informational only:
 * it is not an on-chain balance check and it ignores decimals.
 */
export function compareToSupply(totalSelling: string, token?: Pick<Token, "totalSupply">): SupplyComparison | null {
  const total = parseNumber(totalSelling);
  const supply = parseAmountParts(token?.totalSupply)?.value;
  if (total === null || total <= 0 || !supply || supply <= 0) return null;
  return { supply, sharePct: (total / supply) * 100, exceeds: total > supply };
}

/** What this form does not collect or set. Shown so nothing is assumed. */
export const FL_NOT_COLLECTED: { label: string; detail: string }[] = [
  { label: "Start and end time", detail: "This form has no schedule fields, so no launch window is set." },
  { label: "Contribution limits", detail: "No minimum or maximum contribution is collected." },
  { label: "Hard cap", detail: "Fair launch records do not store a hard cap." },
  { label: "Price and allocation rule", detail: "No price, rate or rule for how contributions become tokens is set." },
  { label: "Project link", detail: "No project is selected or linked." },
  { label: "Vesting, liquidity and refund terms", detail: "None are collected." },
];

export const FL_SIMULATION_TITLE = "Fair Launch Simulated";
export const FL_SIMULATION_DESCRIPTION = "Phase 1 demonstration: Launch parameters validated. No contract deployed.";
