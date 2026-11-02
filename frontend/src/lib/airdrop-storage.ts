import type { AirdropCampaign } from "@/types";
import { AIRDROPS } from "@/data";
import type { DataProvenance } from "@/lib/data-provenance";

/**
 * Canonical Session Storage Foundation for Airdrop Campaigns.
 *
 * Architecture Decision D-04: Ethereum Sepolia testnet scope (11155111).
 * Key: pm_session_airdrops_v1
 * Event: pm_session_airdrops_changed
 */

export const SESSION_AIRDROPS_STORAGE_KEY = "pm_session_airdrops_v1";
export const AIRDROP_STORAGE_EVENT = "pm_session_airdrops_changed";

export interface SessionAirdropCampaign extends AirdropCampaign {
  provenance: "session";
  isSimulated: true;
  merkleTreeData?: {
    root: string;
    recipients: { address: string; amount: string; amountWei: string }[];
    proofs: Record<string, string[]>;
  };
  typeConfig?: Record<string, unknown>;
}

export function generateSessionAirdropId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 6);
  return `session-air-${ts}-${rand}`;
}

export function getDefaultAirdropDates(): { startTime: string; endTime: string } {
  const now = Date.now();
  const start = new Date(now).toISOString();
  const end = new Date(now + 30 * 86400000).toISOString();
  return { startTime: start, endTime: end };
}

/* -------------------------------------------------------------------------- */
/* Low-Level Safe Storage Operations                                          */
/* -------------------------------------------------------------------------- */

function getStorage(): Storage | undefined {
  if (typeof window !== "undefined" && window.sessionStorage) {
    return window.sessionStorage;
  }
  if (typeof globalThis !== "undefined" && (globalThis as unknown as { sessionStorage?: Storage }).sessionStorage) {
    return (globalThis as unknown as { sessionStorage: Storage }).sessionStorage;
  }
  return undefined;
}

export function notifyAirdropStorageChanged(): void {
  const target =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? (globalThis as unknown as EventTarget)
      : undefined;

  if (!target || typeof target.dispatchEvent !== "function") return;
  try {
    target.dispatchEvent(new Event(AIRDROP_STORAGE_EVENT));
  } catch {
    // Ignore in non-standard test environments
  }
}

export function readSessionAirdropsRaw(): string {
  const storage = getStorage();
  if (!storage) return "";
  try {
    return storage.getItem(SESSION_AIRDROPS_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function parseSessionAirdrops(raw: string): SessionAirdropCampaign[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SessionAirdropCampaign =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.tokenId === "string" &&
        typeof item.status === "string"
    );
  } catch {
    return [];
  }
}

export function readSessionAirdrops(): SessionAirdropCampaign[] {
  return parseSessionAirdrops(readSessionAirdropsRaw());
}

export function subscribeSessionAirdrops(callback: () => void): () => void {
  const target =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? (globalThis as unknown as EventTarget)
      : undefined;

  if (!target || typeof target.addEventListener !== "function") return () => {};
  target.addEventListener(AIRDROP_STORAGE_EVENT, callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    target.removeEventListener(AIRDROP_STORAGE_EVENT, callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

/* -------------------------------------------------------------------------- */
/* Mutation Helpers for Tests & Future Batches                                */
/* -------------------------------------------------------------------------- */

export function saveSessionAirdrop(campaign: SessionAirdropCampaign): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const current = readSessionAirdrops();
    const updated = [campaign, ...current.filter((c) => c.id !== campaign.id)];
    storage.setItem(SESSION_AIRDROPS_STORAGE_KEY, JSON.stringify(updated));
    notifyAirdropStorageChanged();
  } catch {
    // Quota exceeded or storage disabled
  }
}

export function removeSessionAirdrop(id: string): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const current = readSessionAirdrops();
    const filtered = current.filter((c) => c.id !== id);
    if (filtered.length === current.length) return false;
    storage.setItem(SESSION_AIRDROPS_STORAGE_KEY, JSON.stringify(filtered));
    notifyAirdropStorageChanged();
    return true;
  } catch {
    return false;
  }
}

export function clearSessionAirdrops(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(SESSION_AIRDROPS_STORAGE_KEY);
    notifyAirdropStorageChanged();
  } catch {
    // Ignore
  }
}

/* -------------------------------------------------------------------------- */
/* Resolvers, Provenance & Aggregations                                       */
/* -------------------------------------------------------------------------- */

export function findSessionAirdropById(id: string): SessionAirdropCampaign | undefined {
  return readSessionAirdrops().find((c) => c.id === id);
}

export function getAllAirdropCampaigns(
  catalogList: AirdropCampaign[] = AIRDROPS
): AirdropCampaign[] {
  const sessionList = readSessionAirdrops();
  return [...sessionList, ...catalogList];
}

export function getAirdropProvenance(campaign: {
  id: string;
  provenance?: DataProvenance;
}): DataProvenance {
  if (campaign.provenance === "session") return "session";
  if (campaign.id.startsWith("session-")) return "session";
  const inSession = findSessionAirdropById(campaign.id);
  if (inSession) return "session";
  return "catalog";
}

export function isSepoliaNetwork(network?: string): boolean {
  if (!network) return false;
  const net = network.toLowerCase().trim();
  return net.includes("sepolia") || net === "ethereum";
}

/* -------------------------------------------------------------------------- */
/* Numerical & KPI Helpers                                                    */
/* -------------------------------------------------------------------------- */

export function parseRewardAmount(val?: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/,/g, "").replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export function calculateClaimProgress(claimedCount?: number, recipientCount?: number): number {
  if (!claimedCount || !recipientCount || recipientCount === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((claimedCount / recipientCount) * 100)));
}

export function formatTokenQuantity(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

export interface AirdropKpis {
  totalCampaigns: number;
  activeCampaigns: number;
  sepoliaActiveCampaigns: number;
  totalRecipients: number;
  totalClaimed: number;
  overallClaimRate: number;
  totalTokensNumeric: number;
  totalTokensFormatted: string;
}

export function calculateAirdropKpis(campaigns: AirdropCampaign[]): AirdropKpis {
  const totalCampaigns = campaigns.length;
  let activeCampaigns = 0;
  let sepoliaActiveCampaigns = 0;
  let totalRecipients = 0;
  let totalClaimed = 0;
  let totalTokensNumeric = 0;

  for (const c of campaigns) {
    if (c.status === "active") {
      activeCampaigns += 1;
      if (isSepoliaNetwork(c.network)) {
        sepoliaActiveCampaigns += 1;
      }
    }
    if (typeof c.recipientCount === "number" && c.recipientCount > 0) {
      totalRecipients += c.recipientCount;
    }
    if (typeof c.claimedCount === "number" && c.claimedCount > 0) {
      totalClaimed += c.claimedCount;
    }
    totalTokensNumeric += parseRewardAmount(c.totalReward);
  }

  const overallClaimRate =
    totalRecipients > 0 ? Math.round((totalClaimed / totalRecipients) * 100) : 0;

  return {
    totalCampaigns,
    activeCampaigns,
    sepoliaActiveCampaigns,
    totalRecipients,
    totalClaimed,
    overallClaimRate,
    totalTokensNumeric,
    totalTokensFormatted: formatTokenQuantity(totalTokensNumeric),
  };
}

/* -------------------------------------------------------------------------- */
/* Filtering for Hub Quick Filters & Search                                   */
/* -------------------------------------------------------------------------- */

export type HubFilterPreset = "all" | "live" | "sepolia";

export interface FilterAirdropOptions {
  searchQuery?: string;
  preset?: HubFilterPreset;
  statusFilter?: string;
  networkFilter?: string;
}

export function filterAirdropCampaigns(
  campaigns: AirdropCampaign[],
  options: FilterAirdropOptions
): AirdropCampaign[] {
  const { searchQuery = "", preset = "all", statusFilter, networkFilter } = options;
  const q = searchQuery.toLowerCase().trim();

  return campaigns.filter((air) => {
    // 1. Text search
    if (q) {
      const matchTitle = air.title.toLowerCase().includes(q);
      const matchDesc = air.description?.toLowerCase().includes(q) ?? false;
      const matchTokenId = air.tokenId.toLowerCase().includes(q);
      const matchCategory = air.category?.toLowerCase().includes(q) ?? false;
      const matchType = air.type.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTokenId && !matchCategory && !matchType) {
        return false;
      }
    }

    // 2. Preset filters
    if (preset === "live" && air.status !== "active") {
      return false;
    }
    if (preset === "sepolia" && !isSepoliaNetwork(air.network)) {
      return false;
    }

    // 3. Optional explicit status filter
    if (statusFilter && statusFilter !== "all" && air.status !== statusFilter) {
      return false;
    }

    // 4. Optional explicit network filter
    if (networkFilter && networkFilter !== "all") {
      if (networkFilter === "sepolia") {
        if (!isSepoliaNetwork(air.network)) return false;
      } else if (air.network !== networkFilter) {
        return false;
      }
    }

    return true;
  });
}
