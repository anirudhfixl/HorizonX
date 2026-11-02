import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";
import { WATCHLIST_STORAGE_KEY } from "./config";
import type { SessionReceipt } from "./model";

/* ── watchlist (localStorage, shared across components and tabs) ───────── */

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const readRaw = (key: string, storage: "local" | "session") => () => {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key) ?? "";
  } catch {
    return "";
  }
};

const readWatchRaw = readRaw(WATCHLIST_STORAGE_KEY, "local");
const readSessionRaw = readRaw(SESSION_TOKENS_STORAGE_KEY, "session");

function parseIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export interface TokenWatchlist {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
}

/**
 * Followed token ids. Stored under the key the earlier token pages used, so existing
 * watchlists carry over. The list is per browser, not per wallet: HorizonX has no
 * server-side account store for it yet.
 */
export function useTokenWatchlist(): TokenWatchlist {
  const raw = useSyncExternalStore(subscribe, readWatchRaw, () => "");
  const ids = useMemo(() => parseIds(raw), [raw]);

  const write = useCallback((next: string[]) => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: the list simply won't persist */
    }
    listeners.forEach((l) => l());
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const current = parseIds(readWatchRaw());
      write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    },
    [write],
  );
  const remove = useCallback((id: string) => write(parseIds(readWatchRaw()).filter((x) => x !== id)), [write]);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, has, toggle, remove };
}

/** Tokens created through the Create Token simulation in this browser session. */
export function useSessionReceipts(): SessionReceipt[] {
  const raw = useSyncExternalStore(subscribe, readSessionRaw, () => "");
  return useMemo(() => {
    try {
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? (parsed as SessionReceipt[]) : [];
    } catch {
      return [];
    }
  }, [raw]);
}
