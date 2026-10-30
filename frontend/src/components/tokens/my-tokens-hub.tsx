"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";
import { Token, TokenMarketData, Project } from "@/types";
import { SimulatedTokenReceipt, calculateBaseUnits } from "./token-creation-wizard";
import { formatNumber } from "./token-detail-hub";
import { toast } from "sonner";
import {
  Coins,
  Plus,
  Wallet,
  Shield,
  Copy,
  Check,
  Search,
  Flame,
  ArrowRight,
  Sparkles,
  Sliders,
  Send,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

export type TokenWithMarket = Token & { market: TokenMarketData };

export interface MyTokensMetrics {
  managedTokens: number;
  aggregateSupplyRaw: bigint;
  aggregateSupplyFormatted: string;
  activeCatalogAssets: number;
  simulatedCreatorAssets: number;
}

/**
 * Filter catalog tokens created by the given wallet address (case-insensitive).
 */
export function resolveCreatorTokens(
  tokens: TokenWithMarket[],
  address?: string | null
): TokenWithMarket[] {
  if (!address) return [];
  const normalized = address.toLowerCase();
  return tokens.filter(
    (t) => t.creatorAddress && t.creatorAddress.toLowerCase() === normalized
  );
}

/**
 * Filter temporary session-simulated receipts created by the given wallet address.
 */
export function resolveSessionTokens(
  sessionReceipts: SimulatedTokenReceipt[],
  address?: string | null
): SimulatedTokenReceipt[] {
  if (!address) return [];
  const normalized = address.toLowerCase();
  return sessionReceipts.filter(
    (r) => r.creatorAddress && r.creatorAddress.toLowerCase() === normalized
  );
}

/**
 * Calculate accurate creator telemetry metrics without floating-point errors.
 */
export function calculateMyTokensMetrics(
  catalogMatches: TokenWithMarket[],
  sessionMatches: SimulatedTokenReceipt[]
): MyTokensMetrics {
  let totalRaw = BigInt(0);

  for (const t of catalogMatches) {
    const clean = (t.totalSupply || "0").replace(/[^0-9]/g, "");
    if (clean) {
      try {
        totalRaw += BigInt(clean);
      } catch {
        // ignore
      }
    }
  }

  for (const s of sessionMatches) {
    const clean = (s.totalSupply || "0").replace(/[^0-9]/g, "");
    if (clean) {
      try {
        totalRaw += BigInt(clean);
      } catch {
        // ignore
      }
    }
  }

  const activeCatalog = catalogMatches.filter((t) => t.status === "active").length;

  return {
    managedTokens: catalogMatches.length + sessionMatches.length,
    aggregateSupplyRaw: totalRaw,
    aggregateSupplyFormatted: formatNumber(Number(totalRaw)),
    activeCatalogAssets: activeCatalog,
    simulatedCreatorAssets: sessionMatches.length,
  };
}

export function MyTokensHub() {
  const { isConnected, address, shortAddress, isDemoMode, connectDemo } = useWallet();
  const { openModal } = useModal();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Client-side session tokens created in /tokens/create
  const [sessionTokens] = useState<SimulatedTokenReceipt[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("prominers_session_tokens");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Local simulated state overrides for management actions
  const [localSupplies, setLocalSupplies] = useState<Record<string, bigint>>({});
  const [localPaused, setLocalPaused] = useState<Record<string, boolean>>({});
  const [localOwners, setLocalOwners] = useState<Record<string, string>>({});

  // Simulated Management Dialog State
  const [managementToken, setManagementToken] = useState<{
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    contractAddress: string;
    isSessionToken?: boolean;
  } | null>(null);

  const [activeDialogTab, setActiveDialogTab] = useState<"mint" | "burn" | "pause" | "transfer">("mint");
  const [mintRecipient, setMintRecipient] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [confirmTransfer, setConfirmTransfer] = useState(false);

  // Project map for quick lookup
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    for (const p of MOCK_PROJECTS) {
      map.set(p.id, p);
    }
    return map;
  }, []);

  // Filter creator tokens based on active connected/demo address
  const catalogMatches = useMemo(() => {
    return resolveCreatorTokens(MOCK_TOKENS, address);
  }, [address]);

  const sessionMatches = useMemo(() => {
    return resolveSessionTokens(sessionTokens, address);
  }, [sessionTokens, address]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    return calculateMyTokensMetrics(catalogMatches, sessionMatches);
  }, [catalogMatches, sessionMatches]);

  // Combined searchable/filterable items
  const filteredCatalogTokens = useMemo(() => {
    return catalogMatches.filter((t) => {
      const matchSearch =
        searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [catalogMatches, searchQuery, selectedCategory]);

  const filteredSessionTokens = useMemo(() => {
    return sessionMatches.filter((s) => {
      const matchSearch =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || s.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [sessionMatches, searchQuery, selectedCategory]);

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
      toast.success("Address Copied", { description: text });
    }
  };

  const openManagementModal = (token: {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    contractAddress: string;
    isSessionToken?: boolean;
  }) => {
    setManagementToken(token);
    setActiveDialogTab("mint");
    setMintRecipient(address || "");
    setMintAmount("");
    setBurnAmount("");
    setNewOwnerAddress("");
    setConfirmTransfer(false);
  };

  const handleSimulateMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managementToken) return;

    if (!mintRecipient || !mintRecipient.startsWith("0x") || mintRecipient.length !== 42) {
      toast.error("Invalid Recipient", { description: "Please enter a valid 42-character EVM address." });
      return;
    }

    const calc = calculateBaseUnits(mintAmount, managementToken.decimals);
    if (!calc.isValid) {
      toast.error("Invalid Amount", { description: calc.error || "Please enter a positive mint amount." });
      return;
    }

    const currentSupply = localSupplies[managementToken.id] ?? BigInt(managementToken.totalSupply.replace(/[^0-9]/g, "") || "0");
    const nextSupply = currentSupply + calc.rawSupply;

    setLocalSupplies((prev) => ({ ...prev, [managementToken.id]: nextSupply }));
    toast.success("Simulated Mint Complete (Local State)", {
      description: `Simulated ${mintAmount} ${managementToken.symbol} minted to ${mintRecipient.slice(0, 6)}... (Note: In-memory simulation state resets upon page reload).`,
    });
    setMintAmount("");
  };

  const handleSimulateBurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managementToken) return;

    const calc = calculateBaseUnits(burnAmount, managementToken.decimals);
    if (!calc.isValid) {
      toast.error("Invalid Amount", { description: calc.error || "Please enter a positive burn amount." });
      return;
    }

    const currentSupply = localSupplies[managementToken.id] ?? BigInt(managementToken.totalSupply.replace(/[^0-9]/g, "") || "0");
    if (calc.rawSupply > currentSupply) {
      toast.error("Excessive Burn", { description: "Burn amount exceeds the current token supply." });
      return;
    }

    const nextSupply = currentSupply - calc.rawSupply;
    setLocalSupplies((prev) => ({ ...prev, [managementToken.id]: nextSupply }));
    toast.success("Simulated Burn Complete (Local State)", {
      description: `Simulated ${burnAmount} ${managementToken.symbol} burned. Supply reduced locally.`,
    });
    setBurnAmount("");
  };

  const handleSimulateTogglePause = () => {
    if (!managementToken) return;
    const isCurrentlyPaused = localPaused[managementToken.id] || false;
    const nextPaused = !isCurrentlyPaused;

    setLocalPaused((prev) => ({ ...prev, [managementToken.id]: nextPaused }));
    toast.success(`Simulated Contract ${nextPaused ? "Paused" : "Resumed"}`, {
      description: `Token transfers locally ${nextPaused ? "halted" : "resumed"}. Note: Subject to Architecture Decision D-06 review.`,
    });
  };

  const handleSimulateTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managementToken) return;

    if (!newOwnerAddress || !newOwnerAddress.startsWith("0x") || newOwnerAddress.length !== 42) {
      toast.error("Invalid Address", { description: "Please enter a valid 42-character recipient address." });
      return;
    }

    if (!confirmTransfer) {
      toast.error("Confirmation Required", { description: "Please confirm that you understand this is a simulation preview." });
      return;
    }

    setLocalOwners((prev) => ({ ...prev, [managementToken.id]: newOwnerAddress }));
    toast.success("Simulated Ownership Transferred", {
      description: `Admin authority transferred locally to ${newOwnerAddress.slice(0, 6)}... (Pending D-06 review).`,
    });
    setNewOwnerAddress("");
    setConfirmTransfer(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="My Tokens"
        description="Inspect, monitor, and simulate administrative actions for your creator assets on Ethereum Sepolia (D-04)."
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: "My Tokens" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5 font-semibold shadow-md shadow-primary/20">
            <Link href="/tokens/create">
              <Plus className="h-3.5 w-3.5" /> Deploy New Token
            </Link>
          </Button>
        }
      />

      {/* 2. Wallet Identity & Network Status Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Connected Account:</span>
              {isConnected ? (
                <span className="font-mono text-xs font-semibold text-foreground">
                  {shortAddress || address}
                </span>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">Not Connected</span>
              )}
              {isDemoMode && (
                <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  Demo Sandbox Identity
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isConnected
                ? "Autonomous creator permissions verified locally for matching contract addresses."
                : "Connect your Web3 wallet to manage deployed contracts and simulate administrative functions."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-primary">
            Sepolia Testnet (D-04)
          </span>
          {!isConnected && (
            <Button
              size="sm"
              variant="outline"
              onClick={connectDemo}
              className="text-xs border-primary/40 text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
              Use Demo Wallet
            </Button>
          )}
        </div>
      </div>

      {/* 3. Disconnected View */}
      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-primary" />}
          title="Connect Your Web3 Wallet"
          description="Connect your Ethereum Sepolia wallet to inspect your deployed token contracts, review creator permissions, and test simulated administrative actions."
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                size="sm"
                onClick={() => openModal("CONNECT_WALLET")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
              >
                Connect Wallet
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={connectDemo}
                className="border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Explore Demo Creator Assets
              </Button>
            </div>
          }
        />
      ) : metrics.managedTokens === 0 ? (
        /* 4. Connected with 0 Tokens (Authentic Empty State) */
        <div className="space-y-6">
          <EmptyState
            icon={<Coins className="h-8 w-8 text-primary" />}
            title="No Tokens Created With This Address"
            description="You have not deployed or simulated any token contracts with this wallet yet. Configure your specifications and launch your first ERC-20 token in under 60 seconds."
            action={
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">
                <Link href="/tokens/create">Deploy Your First Token</Link>
              </Button>
            }
          />

          {/* Quick Start Guide */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-foreground">How Token Deployment Works on ProMiners</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
                <h4 className="text-xs font-semibold text-foreground">Configure Identity & Supply</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Specify your token ticker, total supply, decimals, and link your ecosystem project for directory indexing.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
                <h4 className="text-xs font-semibold text-foreground">Inspect Source Templates</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Preview OpenZeppelin v5-compliant Solidity contracts with proposed Burnable, Mintable, and Pausable extensions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">3</span>
                <h4 className="text-xs font-semibold text-foreground">Simulate Sepolia Deployment</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Walk through the 6-stage deployment simulator to generate preview receipts and manage contract states in your hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 5. Active Management Hub with Creator Assets */
        <div className="space-y-8">
          {/* A. Accurate Metrics Grid (Subject to Correction 2) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Managed Tokens"
              value={String(metrics.managedTokens)}
              subtitle="Catalog and session creator assets"
            />
            <MetricCard
              title="Aggregate Token Supply"
              value={metrics.aggregateSupplyFormatted}
              subtitle="Cumulative base-unit tokens"
            />
            <MetricCard
              title="Active Catalog Assets"
              value={String(metrics.activeCatalogAssets)}
              subtitle="Indexed catalog assets"
            />
            <MetricCard
              title="Simulated Creator Assets"
              value={String(metrics.simulatedCreatorAssets)}
              subtitle="Temporary session simulations"
            />
          </div>

          {/* B. Architecture Boundary & Pending Decision Disclaimer Banner */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Simulation Boundary: </span>
                  Token management in this hub operates strictly in local preview mode. Administrative minting, burning, pause toggles, and ownership transfers simulate state changes for UI evaluation and do not broadcast transactions to Ethereum Sepolia. Module capabilities (Burnable, Mintable, Pausable) remain subject to pending Architecture Decisions <code className="text-primary font-mono">D-05</code> and <code className="text-primary font-mono">D-06</code>.
                </div>
              </div>
              <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
                Preview Mode
              </span>
            </div>
          </div>

          {/* C. Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter managed tokens by name or ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-card/60 border-border/60"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Category:</span>
              <select
                aria-label="Filter tokens by category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 rounded-lg border border-border/60 bg-card/80 px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="Governance">Governance</option>
                <option value="DeFi">DeFi</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="AI & Compute">AI & Compute</option>
                <option value="Security & Privacy">Security & Privacy</option>
                <option value="DePIN">DePIN</option>
                <option value="Meme & Community">Meme & Community</option>
              </select>
            </div>
          </div>

          {/* D. Predefined Catalog Demo Records Section */}
          {filteredCatalogTokens.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Predefined Catalog Assets</h3>
                  <p className="text-xs text-muted-foreground">
                    Ecosystem catalog records associated with your address.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {filteredCatalogTokens.length} {filteredCatalogTokens.length === 1 ? "asset" : "assets"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalogTokens.map((token) => {
                  const project = token.projectId ? projectMap.get(token.projectId) : undefined;
                  const currentSupply = localSupplies[token.id]
                    ? formatNumber(Number(localSupplies[token.id]))
                    : token.totalSupply || "100,000,000";
                  const isPaused = localPaused[token.id] || false;
                  const currentOwner = localOwners[token.id] || token.creatorAddress || address;

                  return (
                    <div
                      key={token.id}
                      className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md hover:border-primary/40 transition-all hover:shadow-md space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-semibold text-primary">
                            Predefined Catalog Asset
                          </span>
                          <StatusBadge status={isPaused ? "draft" : token.status} />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                            {token.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground">{token.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">
                              ${token.symbol} • {token.category || "General"}
                            </p>
                          </div>
                        </div>

                        {project && (
                          <div className="text-xs text-muted-foreground">
                            Linked Project: <span className="font-semibold text-foreground">{project.name}</span>
                          </div>
                        )}

                        <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Current Supply:</span>
                            <span className="font-semibold text-foreground font-mono">{currentSupply}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-mono text-primary text-[11px]">{token.network}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Pause State:</span>
                            <span className={isPaused ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                              {isPaused ? "Paused (Transfers Halted)" : "Active / Operational"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Admin Authority:</span>
                            <span className="font-mono text-primary text-[11px]">
                              {currentOwner ? `${currentOwner.slice(0, 6)}...${currentOwner.slice(-4)}` : "Deployer"}
                            </span>
                          </div>
                          {token.contractAddress && (
                            <div className="flex items-center justify-between pt-1 border-t border-border/30">
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(token.contractAddress!)}
                                className="text-muted-foreground hover:text-foreground text-[11px] inline-flex items-center gap-1"
                              >
                                {copiedAddress === token.contractAddress ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                <span>Copy</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Illustrative Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(token.features || ["Burnable (Illustrative)", "Permit (Illustrative)"]).map((f, i) => (
                            <span
                              key={i}
                              className="rounded bg-secondary/50 border border-border/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Buttons (Direct Canonical Navigation) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full text-xs border-border/60 hover:bg-secondary/40"
                        >
                          <Link href={`/tokens/${token.id}`}>
                            View Token Hub <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            openManagementModal({
                              id: token.id,
                              name: token.name,
                              symbol: token.symbol,
                              decimals: token.decimals || 18,
                              totalSupply: String(currentSupply),
                              contractAddress: token.contractAddress || "0x0000000000000000000000000000000000000000",
                              isSessionToken: false,
                            })
                          }
                          className="w-full text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold"
                        >
                          <Sliders className="h-3.5 w-3.5 mr-1" /> Simulate Admin
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* E. Temporary Simulated Session Creator Assets Section */}
          {filteredSessionTokens.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">Temporary Simulated Creator Assets</h3>
                    <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                      Session Simulation
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Simulated deployment receipts generated via the Token Creation Wizard are stored in client-side <code className="text-amber-400 font-mono">sessionStorage</code>. They persist across page reloads in this browser tab and clear automatically when the tab session ends. Not permanently persisted on-chain or in a backend.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {filteredSessionTokens.length} {filteredSessionTokens.length === 1 ? "asset" : "assets"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessionTokens.map((st, idx) => {
                  const currentSupply = localSupplies[st.contractAddress]
                    ? formatNumber(Number(localSupplies[st.contractAddress]))
                    : st.totalSupply;
                  const isPaused = localPaused[st.contractAddress] || false;

                  return (
                    <div
                      key={st.contractAddress || idx}
                      className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-card/60 p-5 backdrop-blur-md hover:border-amber-500/50 transition-all space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                            Temporary Session Simulation
                          </span>
                          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                            Receipt Validated
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 font-bold text-sm">
                            {st.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground">{st.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">
                              ${st.symbol} • {st.category}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Simulated Supply:</span>
                            <span className="font-semibold text-foreground font-mono">{currentSupply}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-mono text-primary text-[11px]">Ethereum Sepolia (11155111)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Pause State:</span>
                            <span className={isPaused ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                              {isPaused ? "Paused" : "Active"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-border/30">
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {st.contractAddress.slice(0, 6)}...{st.contractAddress.slice(-4)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(st.contractAddress)}
                              className="text-muted-foreground hover:text-foreground text-[11px] inline-flex items-center gap-1"
                            >
                              {copiedAddress === st.contractAddress ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {st.features.map((f, i) => (
                            <span
                              key={i}
                              className="rounded bg-secondary/50 border border-border/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          onClick={() =>
                            openManagementModal({
                              id: st.contractAddress,
                              name: st.name,
                              symbol: st.symbol,
                              decimals: st.decimals,
                              totalSupply: String(currentSupply),
                              contractAddress: st.contractAddress,
                              isSessionToken: true,
                            })
                          }
                          className="w-full text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold"
                        >
                          <Sliders className="h-3.5 w-3.5 mr-1" /> Simulate Admin Actions
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Simulated Creator Actions Dialog */}
      {managementToken && (
        <Dialog open={Boolean(managementToken)} onOpenChange={(open) => !open && setManagementToken(null)}>
          <DialogContent className="max-w-md bg-card/95 border-border/60 backdrop-blur-xl">
            <DialogHeader>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary w-fit">
                <span>Simulated Administration (D-04 Preview)</span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Manage {managementToken.name} (${managementToken.symbol})
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Simulate contract owner actions for this asset. No actual transactions or signatures are submitted to Ethereum Sepolia.
              </DialogDescription>
            </DialogHeader>

            {/* Action Tabs */}
            <div className="grid grid-cols-4 gap-1 border-b border-border/40 pb-2 text-center text-xs">
              <button
                type="button"
                onClick={() => setActiveDialogTab("mint")}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  activeDialogTab === "mint"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                Mint
              </button>
              <button
                type="button"
                onClick={() => setActiveDialogTab("burn")}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  activeDialogTab === "burn"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                Burn
              </button>
              <button
                type="button"
                onClick={() => setActiveDialogTab("pause")}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  activeDialogTab === "pause"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                Pause
              </button>
              <button
                type="button"
                onClick={() => setActiveDialogTab("transfer")}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  activeDialogTab === "transfer"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                Owner
              </button>
            </div>

            {/* Mint Tab */}
            {activeDialogTab === "mint" && (
              <form onSubmit={handleSimulateMint} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Recipient EVM Address</Label>
                  <Input
                    placeholder="0x..."
                    value={mintRecipient}
                    onChange={(e) => setMintRecipient(e.target.value)}
                    className="text-xs font-mono bg-secondary/20"
                  />
                  <p className="text-[10px] text-muted-foreground">Defaults to your active creator address.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Tokens to Mint</Label>
                  <Input
                    placeholder="e.g. 500,000"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="text-xs font-mono bg-secondary/20"
                  />
                </div>

                <div className="rounded-xl border border-border/40 bg-secondary/20 p-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">D-05/D-06 Notice: </span>
                  Minting functions are proposed configuration features subject to review. This interaction updates local session state only.
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setManagementToken(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">
                    <Send className="h-3.5 w-3.5 mr-1" /> Simulate Mint
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* Burn Tab */}
            {activeDialogTab === "burn" && (
              <form onSubmit={handleSimulateBurn} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Tokens to Burn</Label>
                  <Input
                    placeholder="e.g. 100,000"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    className="text-xs font-mono bg-secondary/20"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Current Supply: {localSupplies[managementToken.id] ? formatNumber(Number(localSupplies[managementToken.id])) : managementToken.totalSupply} {managementToken.symbol}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-rose-300">Burn Warning: </span>
                  Simulating a token burn permanently reduces local supply base units for this asset.
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setManagementToken(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold">
                    <Flame className="h-3.5 w-3.5 mr-1" /> Simulate Burn
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* Pause Tab */}
            {activeDialogTab === "pause" && (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                  <div className="text-xs text-muted-foreground">Current Pause Status:</div>
                  <div className="text-sm font-bold text-foreground">
                    {localPaused[managementToken.id] ? "Contract Transfers Paused" : "Contract Active / Operational"}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-amber-300">Centralized Authority Notice (D-06): </span>
                  Emergency pause hooks introduce centralized administrative capabilities. The final upgrade and governance authority model remains under review.
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setManagementToken(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSimulateTogglePause}
                    className={
                      localPaused[managementToken.id]
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                        : "bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                    }
                  >
                    {localPaused[managementToken.id] ? (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1" /> Simulate Resume Transfers
                      </>
                    ) : (
                      <>
                        <Pause className="h-3.5 w-3.5 mr-1" /> Simulate Emergency Pause
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}

            {/* Transfer Ownership Tab */}
            {activeDialogTab === "transfer" && (
              <form onSubmit={handleSimulateTransferOwnership} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">New Owner Address</Label>
                  <Input
                    placeholder="0x..."
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    className="text-xs font-mono bg-secondary/20"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Current simulated owner: {localOwners[managementToken.id] ? `${localOwners[managementToken.id].slice(0, 6)}...` : shortAddress || "Active Wallet"}
                  </p>
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmTransfer}
                    onChange={(e) => setConfirmTransfer(e.target.checked)}
                    className="rounded border-border mt-0.5 text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-muted-foreground leading-snug">
                    I acknowledge that this action simulates an administrative ownership transfer locally under Architecture Decision D-06.
                  </span>
                </label>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setManagementToken(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Simulate Transfer
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
