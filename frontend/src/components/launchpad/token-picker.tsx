import React, { useState, useMemo, useSyncExternalStore } from "react";
import { Search, Copy, Sparkles, Database, PlusCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useTokens } from "@/api";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";
import type { SimulatedTokenReceipt } from "@/components/tokens/token-creation-wizard";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { NetworkChip } from "@/components/shared/network-chip";
import { cn } from "@/lib/utils";

export interface SelectedToken {
  address: string;
  tokenId?: string;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
  category?: string;
  projectId?: string;
  totalSupply?: string;
  provenance: "catalog" | "session" | "custom";
  isCustom: boolean;
}

export interface TokenPickerProps {
  value?: string; // Contract address
  onSelectToken: (token: SelectedToken) => void;
  error?: string;
}

function subscribeSessionTokens(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readSessionTokensRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(SESSION_TOKENS_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function TokenPicker({ value, onSelectToken, error }: TokenPickerProps) {
  const [activeTab, setActiveTab] = useState<"catalog" | "session" | "custom">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customSymbol, setCustomSymbol] = useState("");
  const [customName, setCustomName] = useState("");
  const [customDecimals, setCustomDecimals] = useState("18");
  const [customError, setCustomError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Subscribe to browser session tokens
  const sessionRaw = useSyncExternalStore(subscribeSessionTokens, readSessionTokensRaw, () => "");
  const sessionTokens = useMemo<SimulatedTokenReceipt[]>(() => {
    if (!sessionRaw) return [];
    try {
      const parsed = JSON.parse(sessionRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [sessionRaw]);

  const { data: tokens = [] } = useTokens();

  // Combined token list
  const catalogList = useMemo(() => {
    return tokens.filter((t) => !!t.contractAddress);
  }, [tokens]);

  // Filtered lists
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return catalogList;
    return catalogList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q) ||
        t.contractAddress?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [catalogList, searchQuery]);

  const filteredSession = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sessionTokens;
    return sessionTokens.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q) ||
        t.contractAddress.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [sessionTokens, searchQuery]);

  // Current selected token info
  const selectedToken = useMemo<SelectedToken | null>(() => {
    if (!value) return null;
    const addr = value.trim().toLowerCase();

    // Check catalog
    const cat = catalogList.find((t) => t.contractAddress?.toLowerCase() === addr);
    if (cat) {
      return {
        address: cat.contractAddress!,
        tokenId: cat.id,
        name: cat.name,
        symbol: cat.symbol,
        decimals: cat.decimals ?? 18,
        network: cat.network,
        category: cat.category,
        projectId: cat.projectId,
        totalSupply: cat.totalSupply,
        provenance: "catalog",
        isCustom: false,
      };
    }

    // Check session
    const sess = sessionTokens.find((s) => s.contractAddress.toLowerCase() === addr);
    if (sess) {
      return {
        address: sess.contractAddress,
        tokenId: sess.contractAddress.toLowerCase(),
        name: sess.name,
        symbol: sess.symbol,
        decimals: sess.decimals,
        network: sess.network,
        category: sess.category,
        totalSupply: sess.totalSupply,
        provenance: "session",
        isCustom: false,
      };
    }

    // Custom address
    return {
      address: value,
      tokenId: value.toLowerCase(),
      name: customName || `Token ${value.slice(0, 6)}…${value.slice(-4)}`,
      symbol: customSymbol || "CUSTOM",
      decimals: Number(customDecimals) || 18,
      network: "Ethereum Sepolia",
      provenance: "custom",
      isCustom: true,
    };
  }, [value, catalogList, sessionTokens, customName, customSymbol, customDecimals]);

  const handleCopy = (text: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const addr = customAddress.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setCustomError("Enter a valid address: 0x followed by 40 hexadecimal characters.");
      return;
    }
    setCustomError(null);
    onSelectToken({
      address: addr,
      tokenId: addr.toLowerCase(),
      name: customName.trim() || `Token ${addr.slice(0, 6)}…${addr.slice(-4)}`,
      symbol: customSymbol.trim().toUpperCase() || "CUSTOM",
      decimals: Number(customDecimals) || 18,
      network: "Ethereum Sepolia",
      provenance: "custom",
      isCustom: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Active Selection Preview ────────────────────────────────────── */}
      {selectedToken ? (
        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4.5 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-base font-bold text-primary ring-1 ring-primary/20">
                {selectedToken.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{selectedToken.name}</h4>
                  <span className="font-mono text-xs text-muted-foreground">(${selectedToken.symbol})</span>
                  <ProvenanceBadge kind={selectedToken.provenance === "session" ? "session" : "catalog"} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedToken.address)}
                    className="inline-flex items-center gap-1 font-mono hover:text-foreground"
                    title="Copy token address"
                  >
                    <span>{selectedToken.address}</span>
                    <Copy className="h-3 w-3" />
                    {copied && <span className="text-[10px] text-primary">Copied!</span>}
                  </button>
                  <span>·</span>
                  <span>{selectedToken.decimals} decimals</span>
                  {selectedToken.totalSupply && (
                    <>
                      <span>·</span>
                      <span>Supply: {selectedToken.totalSupply}</span>
                    </>
                  )}
                  {selectedToken.category && (
                    <>
                      <span>·</span>
                      <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] text-foreground">
                        {selectedToken.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectToken({ address: "", name: "", symbol: "", decimals: 18, network: "", provenance: "catalog", isCustom: false })}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Change token
            </button>
          </div>
        </div>
      ) : (
        /* ── Selection Flow ─────────────────────────────────────────────── */
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          {/* Source Tabs */}
          <div className="flex items-center gap-1 border-b border-border/60 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "catalog"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Database className="h-3.5 w-3.5" />
              Catalog Tokens ({catalogList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("session")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "session"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Session Tokens ({sessionTokens.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "custom"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Custom Address
            </button>
          </div>

          {/* Search Bar for Catalog and Session */}
          {activeTab !== "custom" && (
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "catalog"
                      ? "Search catalog tokens by name, symbol, or address…"
                      : "Search your session-created tokens…"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Catalog Tab Content */}
          {activeTab === "catalog" && (
            <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-border/40">
              {filteredCatalog.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No catalog tokens match &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredCatalog.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      onSelectToken({
                        address: t.contractAddress!,
                        tokenId: t.id,
                        name: t.name,
                        symbol: t.symbol,
                        decimals: t.decimals ?? 18,
                        network: t.network,
                        category: t.category,
                        projectId: t.projectId,
                        totalSupply: t.totalSupply,
                        provenance: "catalog",
                        isCustom: false,
                      })
                    }
                    className="flex w-full items-center justify-between gap-3 p-2.5 text-left transition-colors hover:bg-secondary/40 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary font-mono text-xs font-semibold text-primary">
                        {t.symbol.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
                            {t.name}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">(${t.symbol})</span>
                        </div>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {t.contractAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <NetworkChip network={t.network} />
                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Session Tab Content */}
          {activeTab === "session" && (
            <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-border/40">
              {filteredSession.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  {sessionTokens.length === 0 ? (
                    <div className="space-y-1">
                      <p>No tokens created in this browser session yet.</p>
                      <p className="text-[11px] text-muted-foreground/80">
                        Tokens created via the Token Wizard are temporarily stored in sessionStorage.
                      </p>
                    </div>
                  ) : (
                    <p>No session tokens match &quot;{searchQuery}&quot;.</p>
                  )}
                </div>
              ) : (
                filteredSession.map((s) => (
                  <button
                    key={s.contractAddress}
                    type="button"
                    onClick={() =>
                      onSelectToken({
                        address: s.contractAddress,
                        tokenId: s.contractAddress.toLowerCase(),
                        name: s.name,
                        symbol: s.symbol,
                        decimals: s.decimals,
                        network: s.network,
                        category: s.category,
                        totalSupply: s.totalSupply,
                        provenance: "session",
                        isCustom: false,
                      })
                    }
                    className="flex w-full items-center justify-between gap-3 p-2.5 text-left transition-colors hover:bg-secondary/40 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 font-mono text-xs font-semibold text-primary ring-1 ring-primary/20">
                        {s.symbol.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
                            {s.name}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">(${s.symbol})</span>
                          <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-semibold text-primary">
                            Session
                          </span>
                        </div>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {s.contractAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Custom Address Tab Content */}
          {activeTab === "custom" && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter an arbitrary ERC-20 contract address. Under D-04 this is treated as a client simulation on Ethereum Sepolia.
              </p>
              <div>
                <label className="text-xs font-medium text-foreground">Token Contract Address *</label>
                <input
                  type="text"
                  placeholder="0x…"
                  value={customAddress}
                  onChange={(e) => {
                    setCustomAddress(e.target.value);
                    setCustomError(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {customError && (
                  <p className="mt-1 text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {customError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-medium text-foreground">Token Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC"
                    value={customSymbol}
                    onChange={(e) => setCustomSymbol(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 font-mono text-xs text-foreground uppercase placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Token Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alpha Coin"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Decimals</label>
                  <input
                    type="number"
                    min={0}
                    max={18}
                    value={customDecimals}
                    onChange={(e) => setCustomDecimals(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Use Custom Address <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
