import type { Presale, FairLaunch, PresaleStatus, Token, Project } from "@/types";
import { MOCK_TOKENS, MOCK_PROJECTS, MOCK_PRESALES, MOCK_FAIR_LAUNCHES } from "@/lib/mock-data";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";
import type { SimulatedTokenReceipt } from "@/components/tokens/token-creation-wizard";

/**
 * Session launch persistence layer for user-created launch simulations.
 * Architecture Decision D-04: Client-side simulation, Ethereum Sepolia scope.
 */

export const SESSION_LAUNCHES_STORAGE_KEY = "pm_session_launches_v1";
export const LAUNCH_STORAGE_EVENT = "pm_session_launches_changed";

export type SessionLaunchKind = "presale" | "fair";

export interface BaseSessionLaunch {
  id: string;
  kind: SessionLaunchKind;
  title: string;
  description?: string;
  category?: string;
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  tokenDecimals?: number;
  projectId?: string;
  ownerAddress: string;
  status: PresaleStatus;
  startTime?: string;
  endTime?: string;
  softCap: string;
  minContribution?: string;
  maxContribution?: string;
  totalRaised: string;
  participantCount: number;
  network: string;
  contractAddress?: string;
  createdAt: string;
  updatedAt: string;
  provenance: "session";
  isSimulated: true;
}

export interface SessionPresale extends BaseSessionLaunch {
  kind: "presale";
  hardCap: string;
  presaleRate: string;
}

export interface SessionFairLaunch extends BaseSessionLaunch {
  kind: "fair";
  totalSelling: string;
}

export type SessionLaunch = SessionPresale | SessionFairLaunch;

export function generateSessionLaunchId(kind: "ps" | "fl"): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 6);
  return `session-${kind}-${ts}-${rand}`;
}

export function getDefaultScheduleDates(): { startTime: string; endTime: string } {
  const now = Date.now();
  const start = new Date(now + 86400000).toISOString();
  const end = new Date(now + 7 * 86400000).toISOString();
  return { startTime: start, endTime: end };
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/* Convert Session Launch Records to Standard Types                           */
/* -------------------------------------------------------------------------- */

export function sessionPresaleToPresale(s: SessionPresale): Presale {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    tokenId: s.tokenId,
    projectId: s.projectId,
    category: s.category || "General",
    ownerAddress: s.ownerAddress,
    status: s.status,
    startTime: s.startTime,
    endTime: s.endTime,
    hardCap: s.hardCap,
    softCap: s.softCap,
    minContribution: s.minContribution,
    maxContribution: s.maxContribution,
    totalRaised: s.totalRaised,
    participantCount: s.participantCount,
    network: s.network,
    contractAddress: s.contractAddress,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export function sessionFairLaunchToFairLaunch(s: SessionFairLaunch): FairLaunch {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category || "General",
    tokenId: s.tokenId,
    projectId: s.projectId,
    ownerAddress: s.ownerAddress,
    status: s.status,
    startTime: s.startTime,
    endTime: s.endTime,
    totalSelling: s.totalSelling,
    softCap: s.softCap,
    totalRaised: s.totalRaised,
    participantCount: s.participantCount,
    minContribution: s.minContribution,
    maxContribution: s.maxContribution,
    network: s.network,
    contractAddress: s.contractAddress,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

/* -------------------------------------------------------------------------- */
/* Low-Level Safe Storage Operations                                          */
/* -------------------------------------------------------------------------- */

function notifyStorageChanged() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(LAUNCH_STORAGE_EVENT));
  } catch {
    // Ignore in non-browser environments
  }
}

export function readSessionLaunchesRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(SESSION_LAUNCHES_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function readSessionLaunches(): SessionLaunch[] {
  const raw = readSessionLaunchesRaw();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SessionLaunch =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        (item.kind === "presale" || item.kind === "fair") &&
        typeof item.title === "string" &&
        typeof item.tokenAddress === "string"
    );
  } catch {
    return [];
  }
}

export function readSessionPresales(): SessionPresale[] {
  return readSessionLaunches().filter((l): l is SessionPresale => l.kind === "presale");
}

export function readSessionFairLaunches(): SessionFairLaunch[] {
  return readSessionLaunches().filter((l): l is SessionFairLaunch => l.kind === "fair");
}

export function saveSessionLaunch(launch: SessionLaunch): void {
  if (typeof window === "undefined") return;
  try {
    const current = readSessionLaunches();
    const updated = [launch, ...current.filter((l) => l.id !== launch.id)];
    sessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChanged();
  } catch {
    // Quota exceeded or storage disabled
  }
}

export function updateSessionLaunch(id: string, updates: Partial<SessionLaunch>): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = readSessionLaunches();
    const index = current.findIndex((l) => l.id === id);
    if (index === -1) return false;
    current[index] = { ...current[index], ...updates, updatedAt: new Date().toISOString().slice(0, 10) } as SessionLaunch;
    sessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(current));
    notifyStorageChanged();
    return true;
  } catch {
    return false;
  }
}

export function removeSessionLaunch(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = readSessionLaunches();
    const filtered = current.filter((l) => l.id !== id);
    if (filtered.length === current.length) return false;
    sessionStorage.setItem(SESSION_LAUNCHES_STORAGE_KEY, JSON.stringify(filtered));
    notifyStorageChanged();
    return true;
  } catch {
    return false;
  }
}

export function clearSessionLaunches(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_LAUNCHES_STORAGE_KEY);
    notifyStorageChanged();
  } catch {
    // Ignore
  }
}

export function findSessionLaunchById(id: string): SessionLaunch | undefined {
  return readSessionLaunches().find((l) => l.id === id);
}

export function findSessionPresaleById(id: string): SessionPresale | undefined {
  return readSessionPresales().find((p) => p.id === id);
}

export function findSessionFairLaunchById(id: string): SessionFairLaunch | undefined {
  return readSessionFairLaunches().find((f) => f.id === id);
}

/* -------------------------------------------------------------------------- */
/* React Subscription                                                         */
/* -------------------------------------------------------------------------- */

export function subscribeSessionLaunches(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LAUNCH_STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LAUNCH_STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/* -------------------------------------------------------------------------- */
/* Unified Resolution Helpers for Detail Pages & Creators                     */
/* -------------------------------------------------------------------------- */

export interface ResolvedLaunchContext {
  token?: Token;
  project?: Project;
  siblingPresales: Presale[];
  siblingFairLaunches: FairLaunch[];
}

export function resolveLaunchContext(
  launch: { tokenId: string; projectId?: string; id: string }
): ResolvedLaunchContext {
  // 1. Try to find catalog token
  let token: Token | undefined = MOCK_TOKENS.find(
    (t) =>
      t.id.toLowerCase() === launch.tokenId.toLowerCase() ||
      t.contractAddress?.toLowerCase() === launch.tokenId.toLowerCase()
  );

  // 2. Try to find session token if in browser
  if (!token && typeof window !== "undefined") {
    try {
      const rawSessionTokens = sessionStorage.getItem(SESSION_TOKENS_STORAGE_KEY);
      if (rawSessionTokens) {
        const parsed = JSON.parse(rawSessionTokens) as SimulatedTokenReceipt[];
        const match = parsed.find(
          (s) =>
            s.contractAddress.toLowerCase() === launch.tokenId.toLowerCase() ||
            s.symbol.toLowerCase() === launch.tokenId.toLowerCase()
        );
        if (match) {
          token = {
            id: match.contractAddress.toLowerCase(),
            name: match.name,
            symbol: match.symbol,
            description: match.description,
            network: match.network,
            category: match.category,
            contractAddress: match.contractAddress,
            standard: "ERC-20",
            totalSupply: match.totalSupply,
            decimals: match.decimals,
            creatorAddress: match.creatorAddress,
            status: "active",
            verificationStatus: "not_reviewed",
            createdAt: match.deployedAt,
            updatedAt: match.deployedAt,
            features: match.features,
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  // 3. Fallback synthetic token if custom unlisted contract address
  if (!token && launch.tokenId.startsWith("0x")) {
    token = {
      id: launch.tokenId.toLowerCase(),
      name: `Token ${launch.tokenId.slice(0, 6)}…`,
      symbol: "TOKEN",
      network: "Ethereum Sepolia",
      contractAddress: launch.tokenId,
      standard: "ERC-20",
      status: "active",
      verificationStatus: "not_reviewed",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  }

  const project = launch.projectId
    ? MOCK_PROJECTS.find((p) => p.id === launch.projectId)
    : undefined;

  const siblingPresales = MOCK_PRESALES.filter(
    (p) => p.tokenId.toLowerCase() === launch.tokenId.toLowerCase() && p.id !== launch.id
  );

  const siblingFairLaunches = MOCK_FAIR_LAUNCHES.filter(
    (f) => f.tokenId.toLowerCase() === launch.tokenId.toLowerCase() && f.id !== launch.id
  );

  return {
    token,
    project,
    siblingPresales,
    siblingFairLaunches,
  };
}
