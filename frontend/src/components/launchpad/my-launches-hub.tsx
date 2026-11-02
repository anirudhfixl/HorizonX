import "@/components/launchpad/launchpad.css";
import { LaunchpadWorkspaceHeader } from "@/components/launchpad/launchpad-section-nav";
import React, { useState, useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  Rocket,
  Plus,
  Search,
  Wallet,
  ExternalLink,
  Trash2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { NetworkChip } from "@/components/shared/network-chip";
import { EmptyState } from "@/components/shared/empty-state";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { PRESALES, FAIR_LAUNCHES, TOKENS } from "@/data";
import {
  readSessionLaunchesRaw,
  subscribeSessionLaunches,
  removeSessionLaunch,
  type SessionLaunch,
  type SessionPresale,
  type SessionFairLaunch,
} from "@/lib/launch-storage";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const tokenById = new Map(TOKENS.map((token) => [token.id, token]));

function catalogOwnerMatchesWallet(ownerAddress: string, walletAddress: string): boolean {
  const owner = ownerAddress.trim().toLowerCase();
  const wallet = walletAddress.trim().toLowerCase();
  if (!owner || !wallet) return false;
  if (owner === wallet) return true;

  // Seed catalog addresses may be abbreviated (0x1234...abcd).
  // Require both visible ends to match; a short prefix match is not ownership proof.
  const abbreviated = owner.match(/^(0x)?([a-f0-9]{4,})\.\.\.([a-f0-9]{4,})$/);
  if (!abbreviated) return false;
  const prefix = abbreviated[2];
  const suffix = abbreviated[3];
  const normalizedWallet = wallet.replace(/^0x/, "");
  return normalizedWallet.startsWith(prefix) && normalizedWallet.endsWith(suffix);
}

export interface UnifiedCreatorLaunch {
  id: string;
  kind: "presale" | "fair";
  title: string;
  description?: string;
  category?: string;
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  status: string;
  softCap: string;
  hardCap?: string;
  totalSelling?: string;
  minContribution?: string;
  maxContribution?: string;
  startTime?: string;
  endTime?: string;
  network: string;
  provenance: "catalog" | "session";
  isSession: boolean;
  createdAt: string;
}

export function MyLaunchesHub() {
  const { isConnected, address, shortAddress, isDemoMode, connectDemo } = useWallet();
  const { openModal } = useModal();

  const [activeTab, setActiveTab] = useState<"created" | "contributions">("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "presale" | "fair">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Subscribe to session launches
  const sessionRaw = useSyncExternalStore(subscribeSessionLaunches, readSessionLaunchesRaw, () => "");
  const sessionLaunches = useMemo<SessionLaunch[]>(() => {
    if (!sessionRaw) return [];
    try {
      const parsed = JSON.parse(sessionRaw);
      return Array.isArray(parsed) ? (parsed as SessionLaunch[]) : [];
    } catch {
      return [];
    }
  }, [sessionRaw]);

  // Derive catalog launches owned by connected wallet or shown in demo
  const catalogCreatorLaunches = useMemo<UnifiedCreatorLaunch[]>(() => {
    const list: UnifiedCreatorLaunch[] = [];
    const lowerAddr = address?.toLowerCase() || "";

    // Presales
    PRESALES.forEach((ps) => {
      const token = tokenById.get(ps.tokenId);
      const isOwner = catalogOwnerMatchesWallet(ps.ownerAddress, lowerAddr);
      // In demo mode or if owner matches
      if (isDemoMode || isOwner) {
        list.push({
          id: ps.id,
          kind: "presale",
          title: ps.title,
          description: ps.description,
          category: ps.category,
          tokenId: ps.tokenId,
          tokenSymbol: token?.symbol || ps.tokenId.toUpperCase(),
          tokenName: token?.name || ps.tokenId,
          tokenAddress: ps.contractAddress || token?.contractAddress || "",
          status: ps.status,
          softCap: ps.softCap || "50 ETH",
          hardCap: ps.hardCap || "150 ETH",
          minContribution: ps.minContribution,
          maxContribution: ps.maxContribution,
          startTime: ps.startTime,
          endTime: ps.endTime,
          network: ps.network,
          provenance: "catalog",
          isSession: false,
          createdAt: ps.createdAt,
        });
      }
    });

    // Fair Launches
    FAIR_LAUNCHES.forEach((fl) => {
      const token = tokenById.get(fl.tokenId);
      const isOwner = catalogOwnerMatchesWallet(fl.ownerAddress, lowerAddr);
      if (isDemoMode || isOwner) {
        list.push({
          id: fl.id,
          kind: "fair",
          title: fl.title,
          description: fl.description,
          category: fl.category,
          tokenId: fl.tokenId,
          tokenSymbol: token?.symbol || fl.tokenId.toUpperCase(),
          tokenName: token?.name || fl.tokenId,
          tokenAddress: fl.contractAddress || token?.contractAddress || "",
          status: fl.status,
          softCap: fl.softCap || "20 ETH",
          totalSelling: fl.totalSelling,
          minContribution: fl.minContribution,
          maxContribution: fl.maxContribution,
          startTime: fl.startTime,
          endTime: fl.endTime,
          network: fl.network,
          provenance: "catalog",
          isSession: false,
          createdAt: fl.createdAt,
        });
      }
    });

    return list;
  }, [address, isDemoMode]);

  // Map session launches (filtered by connected wallet or demo mode)
  const sessionCreatorLaunches = useMemo<UnifiedCreatorLaunch[]>(() => {
    const lowerAddr = address?.toLowerCase() || "";
    return sessionLaunches
      .filter((l) => {
        if (isDemoMode) return true;
        if (!lowerAddr || !l.ownerAddress) return false;
        return l.ownerAddress.toLowerCase() === lowerAddr;
      })
      .map((l) => ({
        id: l.id,
        kind: l.kind,
        title: l.title,
        description: l.description,
        category: l.category,
        tokenId: l.tokenId,
        tokenSymbol: l.tokenSymbol,
        tokenName: l.tokenName,
        tokenAddress: l.tokenAddress,
        status: l.status,
        softCap: l.softCap,
        hardCap: l.kind === "presale" ? (l as SessionPresale).hardCap : undefined,
        totalSelling: l.kind === "fair" ? (l as SessionFairLaunch).totalSelling : undefined,
        minContribution: l.minContribution,
        maxContribution: l.maxContribution,
        startTime: l.startTime,
        endTime: l.endTime,
        network: l.network,
        provenance: "session",
        isSession: true,
        createdAt: l.createdAt,
      }));
  }, [sessionLaunches, address, isDemoMode]);

  // Combined creator items
  const allCreatorLaunches = useMemo<UnifiedCreatorLaunch[]>(() => {
    // Session launches appear first
    return [...sessionCreatorLaunches, ...catalogCreatorLaunches];
  }, [sessionCreatorLaunches, catalogCreatorLaunches]);

  // Filtered creator launches
  const filteredLaunches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allCreatorLaunches.filter((item) => {
      if (kindFilter !== "all" && item.kind !== kindFilter) return false;
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (q) {
        const matchesQ =
          item.title.toLowerCase().includes(q) ||
          item.tokenSymbol.toLowerCase().includes(q) ||
          item.tokenName.toLowerCase().includes(q) ||
          item.tokenAddress.toLowerCase().includes(q) ||
          item.network.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }
      return true;
    });
  }, [allCreatorLaunches, kindFilter, statusFilter, searchQuery]);

  // Summary counts
  const presaleCount = allCreatorLaunches.filter((l) => l.kind === "presale").length;
  const fairLaunchCount = allCreatorLaunches.filter((l) => l.kind === "fair").length;
  const sessionCount = allCreatorLaunches.filter((l) => l.isSession).length;

  const handleDeleteSession = (id: string, title: string) => {
    const ok = removeSessionLaunch(id);
    if (ok) {
      toast.success("Simulation Removed", {
        description: `Removed "${title}" from your browser session storage.`,
      });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setKindFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="launchpad-page mx-auto w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
      <LaunchpadWorkspaceHeader items={[{ label: "Launchpad", to: "/launchpad" }, { label: "My launches" }]} />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Creator &amp; Investor Workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Launches
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage your simulated presales, fair launches, and tracked ecosystem raises. Under Architecture Decision D-04, all creator actions operate in client simulation mode on Ethereum Sepolia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/launchpad/presales/create"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Presale
          </Link>
          <Link
            to="/launchpad/launches/create"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors"
          >
            <Rocket className="h-4 w-4 text-primary" />
            Create Fair Launch
          </Link>
        </div>
      </div>

      {/* ── Wallet Connection Notice Banner ─────────────────────────────── */}
      {!isConnected ? (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Wallet Disconnected</p>
              <p className="text-xs text-muted-foreground">
                Connect your wallet to view and manage your creator launches, or explore using Demo Sandbox mode.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => openModal("CONNECT_WALLET")}>
              Connect Wallet
            </Button>
            <Button size="sm" variant="outline" onClick={connectDemo}>
              Demo Sandbox
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/[0.02] px-4 py-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected:</span>
            <span className="font-mono font-semibold text-foreground">{shortAddress}</span>
            {isDemoMode && (
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                Demo Sandbox
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Network scope:</span>
            <span className="font-medium text-foreground">Ethereum Sepolia (D-04)</span>
          </div>
        </div>
      )}

      {/* ── Workspace Metric Overview Cards ─────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Launches</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{allCreatorLaunches.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Across presales &amp; fair launches</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Presales</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{presaleCount}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Hard-capped token sales</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Fair Launches</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{fairLaunchCount}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Dynamic uncapped pools</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Session Simulations</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">{sessionCount}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Browser-stored (sessionStorage)</p>
        </div>
      </div>

      {/* ── Main Workspace Tabs ─────────────────────────────────────────── */}
      <div className="mt-8 border-b border-border/60">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("created")}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors",
              activeTab === "created"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span>My Created Launches</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground font-mono">
              {allCreatorLaunches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contributions")}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors",
              activeTab === "contributions"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span>My Contributions</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground font-mono">
              0
            </span>
          </button>
        </div>
      </div>

      {/* ── Tab Content: Created Launches ───────────────────────────────── */}
      {activeTab === "created" && (
        <div className="mt-6 space-y-6">
          {/* Controls Bar: Search, Type Filter, Status Filter */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by launch title, token, category, or network…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Kind Filter */}
              <select
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value as "all" | "presale" | "fair")}
                className="rounded-lg border border-border bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="presale">Presales Only</option>
                <option value="fair">Fair Launches Only</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-secondary/30 px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
                <option value="finalized">Finalized</option>
                <option value="draft">Draft</option>
              </select>

              {(searchQuery || kindFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Listings Grid */}
          {filteredLaunches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8">
              {allCreatorLaunches.length === 0 ? (
                <EmptyState
                  title="No launches created yet"
                  description="You haven't created any presale or fair launch simulations in this session. Create your first launch to get started."
                  action={
                    <div className="flex items-center gap-3">
                      <Link
                        to="/launchpad/presales/create"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-3.5 w-3.5" /> Create Presale
                      </Link>
                      <Link
                        to="/launchpad/launches/create"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary"
                      >
                        <Rocket className="h-3.5 w-3.5 text-primary" /> Create Fair Launch
                      </Link>
                    </div>
                  }
                />
              ) : (
                <EmptyState
                  title="No launches match your filters"
                  description="Try adjusting your search query, type filter, or status selection."
                  action={
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset all filters
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLaunches.map((launch) => {
                const detailHref =
                  launch.kind === "presale"
                    ? `/launchpad/presales/${launch.id}`
                    : `/launchpad/launches/${launch.id}`;

                return (
                  <div
                    key={launch.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={launch.status} />
                          <ProvenanceBadge kind={launch.provenance} />
                        </div>
                        <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                          {launch.kind === "presale" ? "Presale" : "Fair Launch"}
                        </span>
                      </div>

                      {/* Title & Token info */}
                      <h3 className="mt-3 font-semibold text-foreground line-clamp-1">
                        {launch.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
                        {launch.tokenName} (${launch.tokenSymbol}) · {launch.tokenAddress}
                      </p>

                      {/* Description */}
                      {launch.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {launch.description}
                        </p>
                      )}

                      {/* Figures Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Soft Cap</p>
                          <p className="font-mono font-semibold text-foreground">{launch.softCap}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">
                            {launch.kind === "presale" ? "Hard Cap" : "Total Offering"}
                          </p>
                          <p className="font-mono font-semibold text-foreground">
                            {launch.hardCap || launch.totalSelling || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Wallet Limits</p>
                          <p className="font-mono text-muted-foreground">
                            {launch.minContribution ? `${launch.minContribution} - ${launch.maxContribution || "Max"}` : "Unrestricted"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Network</p>
                          <NetworkChip network={launch.network} />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                      <Link
                        to={detailHref}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        View Launch Details <ExternalLink className="h-3 w-3" />
                      </Link>

                      {launch.isSession && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(launch.id, launch.title)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove simulation from sessionStorage"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab Content: My Contributions (Honest Planned State) ────────── */}
      {activeTab === "contributions" && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            On-Chain Participation Ledger Planned
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Under Architecture Decision D-04, ProMiners currently operates in client demonstration mode. Because no live smart contracts or custodial funds are deployed, there are no simulated contribution receipts or claim distributions.
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-secondary/30 p-4 text-left text-xs text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>When deployed to Ethereum Sepolia, contribution transactions will automatically link to your wallet address.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Non-custodial refund and token claim mechanisms will be accessible directly from this tab.</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/launchpad/presales"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse Presales
            </Link>
            <Link
              to="/launchpad/launches"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Browse Fair Launches
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
