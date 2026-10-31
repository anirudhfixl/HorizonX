"use client";

import React, { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import {
  LaunchpadDetailShell,
  type LaunchpadDetailTab,
} from "@/components/launchpad/launchpad-detail-shell";
import { isSepoliaNetwork, toneFor } from "@/components/tokens/token-profile";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { cn } from "@/lib/utils";
import {
  NOT_RECORDED_TERMS,
  buildMilestones,
  computeRaise,
  contributionUnit,
  derivePresaleTerms,
  formatAmount,
  formatUtc,
  getAllowedStatusTransitions,
  isAuthorizedCreator,
  isConcluded,
  normalizePresaleStatus,
  parseAmountParts,
  participationState,
  softCapLabel,
  validateContribution,
  verificationLabel,
  windowDuration,
  type Milestone,
  type RaiseSummary,
} from "@/lib/presale-detail";
import {
  findSessionPresaleById,
  updateSessionLaunch,
} from "@/lib/launch-storage";
import type { FairLaunch, Presale, PresaleStatus, Project, Token } from "@/types";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Info,
  Wallet,
  ShieldCheck,
  Coins,
  Scale,
  RefreshCw,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export interface PresaleDetailProps {
  presale: Presale;
  token?: Token;
  project?: Project;
  siblingPresales: Presale[];
  fairLaunches: FairLaunch[];
  initialTab?: string;
  provenance?: "catalog" | "session";
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

function SectionHead({
  id,
  eyebrow,
  title,
  aside,
}: {
  id: string;
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

function TermRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-4 gap-y-0.5 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground">
        {children}
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  );
}

function shorten(addr: string): string {
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

const RAISE_UNAVAILABLE: Record<string, string> = {
  missing: "The record has no total raised or hard cap, so progress cannot be shown.",
  invalid: "The stored raised or cap amount could not be read as a number, so progress cannot be shown.",
  "unit-mismatch": "Raised and hard cap use different units, so progress is not computed.",
  "zero-cap": "The stored hard cap is zero, so progress is not computed.",
};

// ─── Raise instrument ─────────────────────────────────────────────────────────

function RaiseInstrument({ presale, raise }: { presale: Presale; raise: RaiseSummary }) {
  const normStatus = normalizePresaleStatus(presale.status);
  const concluded = isConcluded(normStatus);
  const fill =
    normStatus === "live"
      ? "bg-primary"
      : normStatus === "failed" || normStatus === "cancelled"
      ? "bg-destructive/70"
      : concluded
      ? "bg-zinc-400"
      : "bg-amber-400/70";

  if (!raise.available) {
    return (
      <div className="border-l-2 border-dashed border-border pl-4">
        <p className="text-sm font-medium text-foreground">Progress unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">{RAISE_UNAVAILABLE[raise.reason ?? "missing"]}</p>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Total raised (stored)</dt>
            <dd className="font-mono text-foreground">{presale.totalRaised ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Hard cap (stored)</dt>
            <dd className="font-mono text-foreground">{presale.hardCap ?? "—"}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const softLabel = softCapLabel(normStatus, raise.softCapState);
  const labelPos = raise.softMarkerPct !== undefined ? Math.min(Math.max(raise.softMarkerPct, 10), 90) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-xs text-muted-foreground">{concluded ? "Total raised (final record)" : "Total raised"}</p>
          <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {formatAmount(raise.raised, raise.unit)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-semibold text-primary">
            {raise.pctOfHard.toFixed(raise.pctOfHard % 1 === 0 ? 0 : 1)}%
          </p>
          <p className="text-xs text-muted-foreground">of {formatAmount(raise.hard ?? 0, raise.unit)} hard cap</p>
        </div>
      </div>

      <div className="relative mt-10 mb-8">
        {raise.softMarkerPct !== undefined && (
          <div
            className="pointer-events-none absolute -top-7 whitespace-nowrap text-[11px] text-muted-foreground"
            style={{ left: `${labelPos}%`, transform: "translateX(-50%)" }}
          >
            Soft cap · <span className="font-mono text-foreground">{formatAmount(raise.soft ?? 0, raise.unit)}</span>
          </div>
        )}
        <div
          className="relative h-3 w-full rounded-full bg-secondary"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(raise.pctOfHard)}
          aria-label={`${presale.title}: ${raise.pctOfHard.toFixed(0)}% of hard cap raised`}
        >
          <div className={cn("h-full rounded-full transition-all duration-500", fill)} style={{ width: `${raise.pctOfHard}%` }} />
          {raise.softMarkerPct !== undefined && (
            <span
              className="absolute -top-1.5 h-[calc(100%+12px)] w-0.5 rounded bg-foreground/70"
              style={{ left: `${raise.softMarkerPct}%` }}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>0</span>
          <span>{formatAmount(raise.hard ?? 0, raise.unit)}</span>
        </div>
      </div>

      <dl className="grid grid-cols-1 divide-y divide-border/60 border-y border-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-3 sm:px-4 sm:first:pl-0">
          <dt className="text-xs text-muted-foreground">Soft cap</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {softLabel ?? (raise.softCapIgnored ? "Different unit; not compared" : "Not recorded")}
          </dd>
          {raise.remainingToSoft !== undefined && (
            <dd className="font-mono text-xs text-muted-foreground">{formatAmount(raise.remainingToSoft, raise.unit)} to go</dd>
          )}
        </div>
        <div className="py-3 sm:px-4">
          <dt className="text-xs text-muted-foreground">Remaining to hard cap</dt>
          <dd className="mt-0.5 font-mono text-sm font-medium text-foreground">
            {raise.hardCapReached ? "Hard cap reached" : formatAmount(raise.remainingToHard ?? 0, raise.unit)}
          </dd>
        </div>
        <div className="py-3 sm:px-4 sm:last:pr-0">
          <dt className="text-xs text-muted-foreground">Contributors (recorded)</dt>
          <dd className="mt-0.5 font-mono text-sm font-medium text-foreground">
            {presale.participantCount !== undefined ? presale.participantCount.toLocaleString("en-US") : "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

function ScheduleRail({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="relative">
      {milestones.map((m, i) => {
        const last = i === milestones.length - 1;
        return (
          <li key={m.key} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0">
            {!last && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px",
                  m.state === "done" ? "bg-primary/60" : "border-l border-dashed border-border"
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                m.state === "done" && "border-primary bg-primary text-primary-foreground",
                m.state === "current" && "border-primary bg-background text-primary ring-4 ring-primary/15",
                m.state === "upcoming" && "border-dashed border-border bg-background text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {m.state === "done" ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <p className={cn("text-sm font-semibold", m.state === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
                  {m.label}
                </p>
                {m.state === "current" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Current stage</span>
                )}
              </div>
              <p className="font-mono text-sm text-foreground/90">{m.at ? formatUtc(m.at) : "No date recorded"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Participation ────────────────────────────────────────────────────────────

function ParticipationPanel({ presale, raise }: { presale: Presale; raise: RaiseSummary }) {
  const { isConnected, isConnecting, isReconnecting, isUnsupportedNetwork, shortAddress, walletProvider, balance, network, isDemoMode, switchNetwork } =
    useWallet();
  const { openModal } = useModal();

  const state = participationState(presale);
  const unit = contributionUnit(presale);
  const sepoliaSale = isSepoliaNetwork(presale.network);
  const inputRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState(false);

  const check = validateContribution(amount, presale);
  const showError =
    check.status === "empty"
      ? attempted
      : (attempted || amount.length > 0) && check.status !== "ok";
  const minParts = parseAmountParts(presale.minContribution);
  const maxParts = parseAmountParts(presale.maxContribution);
  const checking = isConnecting || isReconnecting;
  const canEnter = state.open && sepoliaSale;

  const handleSubmit = () => {
    setAttempted(true);
    setNotice(false);
    if (check.status === "ok") {
      setNotice(true);
    } else {
      inputRef.current?.focus();
    }
  };

  const toneDot =
    state.tone === "open" ? "bg-emerald-400" : state.tone === "pending" ? "bg-amber-400" : "bg-zinc-500";

  return (
    <section aria-labelledby="participate-title" className="rounded-2xl bg-card p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-6">
      <Eyebrow>Participate</Eyebrow>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", toneDot)} aria-hidden="true" />
        <h2 id="participate-title" className="text-lg font-semibold text-foreground">
          {state.title}
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>

      {/* Stored per-wallet terms */}
      <dl className="mt-4 grid grid-cols-2 divide-x divide-border/60 border-y border-border/60 text-sm">
        <div className="py-2.5 pr-3">
          <dt className="text-xs text-muted-foreground">Min per wallet</dt>
          <dd className="font-mono text-foreground">{presale.minContribution ?? "—"}</dd>
        </div>
        <div className="py-2.5 pl-3">
          <dt className="text-xs text-muted-foreground">Max per wallet</dt>
          <dd className="font-mono text-foreground">{presale.maxContribution ?? "—"}</dd>
        </div>
      </dl>

      {!state.open && (
        <p className="mt-4 text-sm text-muted-foreground">
          The contribution form is only offered while a sale is <span className="text-foreground">live</span>.
          {raise.available && isConcluded(presale.status) && " The final raise is shown on the left."}
        </p>
      )}

      {state.open && !sepoliaSale && (
        <div className="mt-4 border-l-2 border-amber-400/70 pl-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Not available on this network</p>
          <p className="mt-0.5">
            This record lists <span className="text-foreground">{presale.network}</span>. Under D-04 the app supports transactions only on
            Ethereum Sepolia (11155111), so contributions are not offered for this sale.
          </p>
        </div>
      )}

      {canEnter && (
        <div className="mt-4 space-y-4">
          <div className="text-sm">
            {checking ? (
              <div className="space-y-2" role="status" aria-label="Checking wallet connection">
                <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
              </div>
            ) : isConnected ? (
              <div className="flex items-start gap-2.5">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-foreground">{shortAddress}</p>
                  <p className="text-xs text-muted-foreground">
                    {isDemoMode ? "Demo sandbox · simulated wallet and balance" : walletProvider ?? "Connected wallet"}
                    {!isUnsupportedNetwork && (
                      <>
                        {" · "}
                        <span className="font-mono">
                          {balance} {network.symbol}
                        </span>{" "}
                        on {network.name}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No wallet connected.</p>
            )}
          </div>

          <div>
            <label htmlFor="contribution-amount" className="text-xs font-medium text-foreground">
              Contribution amount
            </label>
            <div
              className={cn(
                "mt-1.5 flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2 focus-within:ring-2",
                showError
                  ? "border-destructive/60 focus-within:ring-destructive/25"
                  : "border-border focus-within:border-primary focus-within:ring-primary/25"
              )}
            >
              <input
                ref={inputRef}
                id="contribution-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={minParts ? String(minParts.value) : "0.0"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setNotice(false);
                }}
                aria-invalid={showError}
                aria-describedby="contribution-help"
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {unit && <span className="text-xs font-semibold text-primary">{unit}</span>}
            </div>
            <div id="contribution-help" className="mt-1.5 flex min-h-5 items-center justify-between gap-3 text-xs">
              <span className={cn(showError ? "text-destructive" : "text-muted-foreground")} role={showError ? "alert" : undefined}>
                {showError
                  ? "message" in check
                    ? check.message
                    : "Enter an amount to contribute."
                  : "Checked against the stored per-wallet limits."}
              </span>
              <span className="flex shrink-0 gap-2">
                {minParts && (
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      setAmount(String(minParts.value));
                      setNotice(false);
                    }}
                  >
                    Min
                  </button>
                )}
                {maxParts && (
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      setAmount(String(maxParts.value));
                      setNotice(false);
                    }}
                  >
                    Max
                  </button>
                )}
              </span>
            </div>
          </div>

          {checking ? (
            <Button className="w-full" size="lg" disabled>
              Checking wallet…
            </Button>
          ) : !isConnected ? (
            <Button className="w-full" size="lg" onClick={() => openModal("CONNECT_WALLET")}>
              Connect wallet
            </Button>
          ) : isUnsupportedNetwork ? (
            <Button className="w-full" size="lg" variant="outline" onClick={() => switchNetwork()}>
              Switch to Sepolia
            </Button>
          ) : (
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              Submit contribution
            </Button>
          )}

          {notice && (
            <div role="status" className="border-l-2 border-primary pl-3 text-sm">
              <p className="font-medium text-foreground">No transaction was created</p>
              <p className="mt-0.5 text-muted-foreground">
                The amount passes the stored limits, but contributions are not connected in this build: this record stores no sale contract
                address and the app has no contribution API. Nothing was sent from your wallet.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-5 flex gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Sale figures are simulation records, not read from a contract. The wallet shown above is the real connection, or a
          labelled demo sandbox.
        </span>
      </p>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PresaleDetail({
  presale: initialPresale,
  token,
  project,
  siblingPresales,
  fairLaunches,
  initialTab,
  provenance: initialProvenance,
}: PresaleDetailProps) {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();
  const [, startTransition] = useTransition();

  // Local state for live simulation transitions
  const [presale, setPresale] = useState<Presale>(initialPresale);

  // Tab state with direct URL parameter normalization
  const resolveInitialTab = (): LaunchpadDetailTab => {
    const raw = initialTab?.toLowerCase().trim();
    if (raw === "terms" || raw === "allocation") return "terms";
    if (raw === "management" || raw === "creator" || raw === "owner") return "management";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<LaunchpadDetailTab>(resolveInitialTab);

  const handleTabChange = (tab: LaunchpadDetailTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "overview") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  const provenance =
    initialProvenance ??
    (presale.id.startsWith("session-") || Boolean(findSessionPresaleById(presale.id)) ? "session" : "catalog");

  const raise = computeRaise(presale);
  const milestones = buildMilestones(presale);
  const duration = windowDuration(presale.startTime, presale.endTime);
  const hasRelated = siblingPresales.length > 0 || fairLaunches.length > 0;

  // Derive terms and token requirement calculations
  const sessionRecord = findSessionPresaleById(presale.id);
  const presaleRate = sessionRecord?.presaleRate ?? undefined;
  const derivedTerms = derivePresaleTerms(presale.hardCap, presale.softCap, presaleRate);

  // Creator authorization check
  const isAuthorized = isAuthorizedCreator(presale.ownerAddress, userAddress, isConnected);
  const allowedTransitions = getAllowedStatusTransitions(presale.status);

  // Action Handler for Creator Status Transitions
  const handleStatusTransition = (newStatus: PresaleStatus, _label: string) => {
    if (!isAuthorized) {
      toast.error("Unauthorized: Connected wallet does not match the creator address.");
      return;
    }

    startTransition(() => {
      if (provenance === "session") {
        const ok = updateSessionLaunch(presale.id, { status: newStatus });
        if (ok) {
          setPresale((prev) => ({ ...prev, status: newStatus }));
          toast.success(`Simulation Updated: Presale is now ${newStatus}`);
        } else {
          toast.error("Failed to update session simulation.");
        }
      } else {
        // Catalog simulation override
        setPresale((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Catalog Simulation: Presale status changed to ${newStatus}`, {
          description: "Note: Catalog data changes are client-side simulations for this session.",
        });
      }
    });
  };

  return (
    <LaunchpadDetailShell
      kind="presale"
      id={presale.id}
      title={presale.title}
      description={presale.description}
      status={presale.status}
      network={presale.network}
      category={presale.category}
      ownerAddress={presale.ownerAddress}
      provenance={provenance}
      isSimulated={true}
      token={token}
      project={project}
      contractAddress={presale.contractAddress}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: OVERVIEW                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left Column: Raise, Timeline, Spotlights */}
          <div className="space-y-12">
            {/* Simulation Disclosure Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-foreground">
                    {provenance === "session"
                      ? "User-Created Launch Simulation"
                      : "Catalog Demonstration Presale"}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {provenance === "session"
                      ? "This presale was configured and simulated during your local browser session. Saved in client storage (pm_session_launches_v1), under Ethereum Sepolia scope (D-04)."
                      : "This record is a pre-seeded demonstration launch from the ProMiners catalog. No real blockchain transactions or escrow deposits exist."}
                  </p>
                </div>
              </div>
            </div>

            {/* Raise Progress Instrument */}
            <section aria-labelledby="raise-title" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
              <SectionHead
                id="raise-title"
                eyebrow="Raise"
                title="Sale progress"
                aside={<span className="text-xs text-muted-foreground">Client simulation · not read from a contract</span>}
              />
              <div className="mt-6">
                <RaiseInstrument presale={presale} raise={raise} />
              </div>
            </section>

            {/* Timeline Milestones */}
            <section aria-labelledby="schedule-title" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
              <SectionHead
                id="schedule-title"
                eyebrow="Schedule"
                title="Sale timeline"
                aside={<span className="text-xs text-muted-foreground">Times are stored UTC values</span>}
              />
              <div className="mt-6">
                <ScheduleRail milestones={milestones} />
              </div>
            </section>

            {/* Token & Project Spotlights */}
            <section aria-labelledby="spotlight-title" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
              <SectionHead id="spotlight-title" eyebrow="Context" title="Token & Project Spotlight" />
              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Token Spotlight */}
                <div className="space-y-3 rounded-2xl border border-border/40 bg-secondary/15 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Coins className="h-3.5 w-3.5" />
                    <span>Token Spotlight</span>
                  </div>
                  {token ? (
                    <>
                      <div className="flex items-center gap-3 pt-1">
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold shadow-sm",
                            toneFor(token.category).tile
                          )}
                        >
                          {token.symbol.slice(0, 4)}
                        </span>
                        <div className="min-w-0">
                          <Link href={`/tokens/${token.id}`} className="truncate font-semibold text-foreground hover:text-primary transition-colors block">
                            {token.name}
                          </Link>
                          <p className="font-mono text-xs text-muted-foreground">{token.symbol} · {token.standard || "ERC-20"}</p>
                        </div>
                      </div>
                      <dl className="mt-3 divide-y divide-border/60 border-y border-border/60 text-xs">
                        <div className="flex justify-between py-2">
                          <dt className="text-muted-foreground">Decimals</dt>
                          <dd className="font-mono text-foreground">{token.decimals ?? 18}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                          <dt className="text-muted-foreground">Total Supply</dt>
                          <dd className="font-mono text-foreground">{token.totalSupply ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                          <dt className="text-muted-foreground">Contract</dt>
                          <dd className="font-mono text-foreground flex items-center gap-1">
                            {token.contractAddress ? (
                              <>
                                <span>{shorten(token.contractAddress)}</span>
                                <CopyButton value={token.contractAddress} label="token address" />
                              </>
                            ) : (
                              "Not deployed"
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="flex flex-wrap gap-3 pt-2 text-xs">
                        <Link href={`/tokens/${token.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                          Token Overview <ArrowUpRight className="h-3 w-3" />
                        </Link>
                        <Link href={`/tokens/${token.id}/contract`} className="inline-flex items-center gap-1 text-primary hover:underline">
                          Contract <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-2">No catalog token record linked.</p>
                  )}
                </div>

                {/* Project Spotlight */}
                <div className="space-y-3 rounded-2xl border border-border/40 bg-secondary/15 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Scale className="h-3.5 w-3.5" />
                    <span>Project Spotlight</span>
                  </div>
                  {project ? (
                    <>
                      <div className="flex items-center gap-3 pt-1">
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm",
                            toneFor(project.category).tile
                          )}
                        >
                          {project.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <Link href={`/projects/${project.id}`} className="truncate font-semibold text-foreground hover:text-primary transition-colors block">
                            {project.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{project.category || "Ecosystem Project"}</p>
                        </div>
                      </div>
                      <dl className="mt-3 divide-y divide-border/60 border-y border-border/60 text-xs">
                        <div className="flex justify-between py-2">
                          <dt className="text-muted-foreground">Verification</dt>
                          <dd className="text-foreground">{verificationLabel(project.verificationStatus)}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                          <dt className="text-muted-foreground">Website</dt>
                          <dd className="text-foreground truncate max-w-[160px]">
                            {project.websiteUrl ? (
                              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                <span>{project.websiteUrl.replace(/^https?:\/\//, "")}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              "Not recorded"
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="pt-2 text-xs">
                        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                          Project Profile <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-2">No parent project linked.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Sibling Launches */}
            {hasRelated && (
              <section aria-labelledby="related-title" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
                <SectionHead id="related-title" eyebrow="Same Token" title="Other Launches for this Asset" />
                <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
                  {siblingPresales.map((p) => (
                    <li key={p.id}>
                      <Link href={`/launchpad/presales/${p.id}`} className="group flex items-center justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Presale</span>
                          <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">{p.title}</span>
                        </span>
                        <StatusBadge status={p.status} />
                      </Link>
                    </li>
                  ))}
                  {fairLaunches.map((f) => (
                    <li key={f.id}>
                      <Link href={`/launchpad/launches/${f.id}`} className="group flex items-center justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Fair Launch</span>
                          <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">{f.title}</span>
                        </span>
                        <StatusBadge status={f.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Rail: Participation Panel */}
          <aside className="lg:col-start-2">
            <div className="lg:sticky lg:top-24">
              <ParticipationPanel presale={presale} raise={raise} />
            </div>
          </aside>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: ALLOCATION & TERMS                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "terms" && (
        <div className="space-y-8">
          {/* Key Figures Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-xs text-muted-foreground font-medium">Hard Cap</span>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">{presale.hardCap ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Maximum allowable raise ceiling</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-xs text-muted-foreground font-medium">Soft Cap</span>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">{presale.softCap ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {raise.pctOfHard > 0
                  ? `${((parseAmountParts(presale.softCap)?.value ?? 0) / (parseAmountParts(presale.hardCap)?.value || 1) * 100).toFixed(1)}% of Hard Cap`
                  : "Minimum funding threshold"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-xs text-muted-foreground font-medium">Min Contribution</span>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">{presale.minContribution ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Per participating wallet</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-xs text-muted-foreground font-medium">Max Contribution</span>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">{presale.maxContribution ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Per participating wallet limit</p>
            </div>
          </div>

          {/* Allocation Breakdown Card */}
          <section aria-labelledby="allocation-economics" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
            <SectionHead
              id="allocation-economics"
              eyebrow="Economics"
              title="Presale Allocation & Derived Rates"
              aside={<span className="text-xs text-muted-foreground">Calculated strictly from recorded terms</span>}
            />

            <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
              <TermRow label="Presale Rate" hint="Tokens allocated per unit of currency.">
                {derivedTerms.presaleRate ? (
                  <span className="font-mono font-medium">
                    1 {contributionUnit(presale) || "ETH"} = {derivedTerms.presaleRate.toLocaleString()} {token?.symbol || "Tokens"}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not recorded for this sale</span>
                )}
              </TermRow>

              <TermRow label="Listing Rate" hint="Planned decentralized exchange liquidity pool rate.">
                <span className="text-muted-foreground">Not recorded for this sale</span>
              </TermRow>

              <TermRow label="Tokens at Hard Cap" hint="Derived tokens required if hard cap is fully filled.">
                {derivedTerms.hardCapTokensRequired ? (
                  <span className="font-mono font-medium text-primary">
                    {derivedTerms.hardCapTokensRequired.toLocaleString()} {token?.symbol || "Tokens"}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Cannot derive without recorded presale rate</span>
                )}
              </TermRow>

              <TermRow label="Tokens at Soft Cap" hint="Derived tokens required if minimum soft cap is reached.">
                {derivedTerms.softCapTokensRequired ? (
                  <span className="font-mono font-medium">
                    {derivedTerms.softCapTokensRequired.toLocaleString()} {token?.symbol || "Tokens"}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Cannot derive without recorded presale rate</span>
                )}
              </TermRow>

              <TermRow label="Sale Window" hint="Total planned duration of the raise.">
                <span>{duration ?? "No valid window derived from stored timestamps"}</span>
              </TermRow>
            </dl>
          </section>

          {/* Transparent Disclosure of Unrecorded Terms */}
          <section aria-labelledby="unrecorded-terms" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
            <SectionHead
              id="unrecorded-terms"
              eyebrow="Policy Disclosures"
              title="Unrecorded Parameters & Disclosures"
              aside={<span className="text-xs text-muted-foreground">Transparent disclosure under D-04</span>}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              ProMiners strictly preserves catalog integrity and never invents missing parameters. The following terms are not defined in the stored record:
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NOT_RECORDED_TERMS.map((term) => (
                <li key={term.label} className="rounded-2xl border border-border/40 bg-secondary/15 p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <p className="text-xs font-semibold text-foreground">{term.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3.5 leading-relaxed">{term.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: CREATOR MANAGEMENT                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "management" && (
        <div className="space-y-8">
          {!isAuthorized ? (
            /* ─── Unauthorized / Disconnected State ─── */
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Lock className="h-7 w-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-foreground">Creator Management Restricted</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This console is restricted to the authorized creator address:
                  <span className="block mt-1 font-mono text-xs font-semibold text-foreground break-all">
                    {presale.ownerAddress}
                  </span>
                </p>
                {isConnected && userAddress && (
                  <p className="text-xs text-destructive pt-2">
                    Your connected wallet ({shorten(userAddress)}) does not match the creator address.
                  </p>
                )}
              </div>
              {!isConnected && (
                <Button size="lg" onClick={() => openModal("CONNECT_WALLET")} className="gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Creator Wallet
                </Button>
              )}
            </div>
          ) : (
            /* ─── Authorized Creator Console ─── */
            <div className="space-y-8">
              {/* Authorized Header */}
              <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">Authorized Creator Console</h3>
                      <span className="rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                        Verified Owner
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Connected wallet: <span className="font-mono text-foreground">{userAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Current Status:</span>
                  <StatusBadge status={presale.status} />
                </div>
              </div>

              {/* Status Transition Machine */}
              <section aria-labelledby="status-transitions" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-5">
                <SectionHead
                  id="status-transitions"
                  eyebrow="Lifecycle Machine"
                  title="Simulated Status Transitions"
                  aside={<span className="text-xs text-muted-foreground">Client-side state management</span>}
                />
                <p className="text-sm text-muted-foreground">
                  Update the lifecycle status of your presale simulation. These controls test transition flows and UI state changes without broadcasting blockchain transactions.
                </p>

                {allowedTransitions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                    {allowedTransitions.map((rule) => (
                      <div key={rule.target} className="rounded-2xl border border-border/60 bg-secondary/15 p-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-foreground">{rule.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
                        </div>
                        <Button
                          variant={rule.variant ?? "default"}
                          size="sm"
                          onClick={() => handleStatusTransition(rule.target, rule.label)}
                          className="w-full gap-2 font-medium text-xs"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Transition to {rule.target}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/40 bg-secondary/20 p-5 text-center text-xs text-muted-foreground">
                    This presale is in a terminal state ({presale.status}). No further transitions are available.
                  </div>
                )}
              </section>

              {/* Key Management Actions Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Finalize Action */}
                <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <h4 className="text-base font-bold text-foreground">Finalize Simulation</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Simulate presale settlement. Validates soft cap status, closes contribution intake, and simulates token release readiness for contributors.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleStatusTransition("finalized", "Finalize Presale")}
                    disabled={isConcluded(presale.status)}
                    className="w-full gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Finalize Presale (Simulated)</span>
                  </Button>
                </div>

                {/* Cancel Action */}
                <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Ban className="h-5 w-5 text-destructive" />
                      <h4 className="text-base font-bold text-foreground">Cancel Simulation</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Abort the presale simulation immediately. Disables participation and transitions the launch to simulated refund claim availability.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusTransition("cancelled", "Cancel Presale")}
                    disabled={isConcluded(presale.status)}
                    className="w-full gap-2"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Cancel Presale (Simulated)</span>
                  </Button>
                </div>
              </div>

              {/* Refund Simulation Policy Disclosure */}
              <section aria-labelledby="refund-policy" className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                  <h4 id="refund-policy" className="text-base font-bold text-foreground">
                    Refund Simulation Rules
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Under standard ProMiners smart contracts, if a presale fails to reach its designated soft cap by the closing date, or is explicitly cancelled by the creator, all participants are entitled to claim a 100% refund of their contributed ETH without platform fees.
                  </p>
                  <p className="pt-1">
                    <strong className="text-foreground">Current State:</strong>{" "}
                    {raise.softCapState === "reached"
                      ? "Soft cap reached. In real contracts, refunds would not be claimable unless cancelled."
                      : "Soft cap not reached. If concluded in this state, participants would be eligible for refunds."}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 pt-2 border-t border-border/40">
                    Important: No real blockchain funds or escrow balances exist. All refund rules are educational model disclosures.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </LaunchpadDetailShell>
  );
}
