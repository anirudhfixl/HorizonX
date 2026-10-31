"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { getExplorerBaseUrl, isSepoliaNetwork, toneFor } from "@/components/tokens/token-profile";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { cn } from "@/lib/utils";
import {
  NOT_RECORDED_TERMS,
  buildMilestones,
  computeRaise,
  contributionUnit,
  formatAmount,
  formatUtc,
  isConcluded,
  parseAmountParts,
  participationState,
  softCapLabel,
  validateContribution,
  verificationLabel,
  windowDuration,
  type Milestone,
  type RaiseSummary,
} from "@/lib/presale-detail";
import type { FairLaunch, Presale, Project, Token } from "@/types";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Info, Wallet } from "lucide-react";

export interface PresaleDetailProps {
  presale: Presale;
  token?: Token;
  project?: Project;
  siblingPresales: Presale[];
  fairLaunches: FairLaunch[];
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

function SectionHead({ id, eyebrow, title, aside }: { id: string; eyebrow: string; title: string; aside?: React.ReactNode }) {
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

function NetworkChip({ network }: { network: string }) {
  const ok = isSepoliaNetwork(network);
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[11px]",
        ok ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
      )}
      title={ok ? "D-04 approved network (11155111)" : "Catalog origin — not an active network per D-04"}
    >
      {network}
    </span>
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
  const concluded = isConcluded(presale.status);
  const fill = presale.status === "live" ? "bg-primary" : presale.status === "failed" || presale.status === "cancelled" ? "bg-destructive/70" : concluded ? "bg-zinc-400" : "bg-amber-400/70";

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

  const softLabel = softCapLabel(presale.status, raise.softCapState);
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
          <p className="font-mono text-3xl font-semibold text-primary">{raise.pctOfHard.toFixed(raise.pctOfHard % 1 === 0 ? 0 : 1)}%</p>
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
          <div className={cn("h-full rounded-full", fill)} style={{ width: `${raise.pctOfHard}%` }} />
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
      // No contribution transaction exists in this build; say so instead of implying one was sent.
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
          {/* Wallet */}
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

          {/* Amount */}
          <div>
            <label htmlFor="contribution-amount" className="text-xs font-medium text-foreground">
              Contribution amount
            </label>
            <div
              className={cn(
                "mt-1.5 flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2 focus-within:ring-2",
                showError ? "border-destructive/60 focus-within:ring-destructive/25" : "border-border focus-within:border-primary focus-within:ring-primary/25"
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

          {/* Action */}
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
          Sale figures are catalog sample records, not read from a contract. The wallet shown above is the real connection, or a
          labelled demo sandbox.
        </span>
      </p>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PresaleDetail({ presale, token, project, siblingPresales, fairLaunches }: PresaleDetailProps) {
  const raise = computeRaise(presale);
  const milestones = buildMilestones(presale);
  const duration = windowDuration(presale.startTime, presale.endTime);
  const tone = toneFor(token?.category ?? presale.category);
  const tileText = (token?.symbol ?? presale.title).slice(0, 4).toUpperCase();
  const explorerBase = token ? getExplorerBaseUrl(token.network) : undefined;
  const socials = Object.entries(project?.socialLinks ?? {}).filter(([, url]) => /^https?:\/\//i.test(url));
  const hasRelated = siblingPresales.length > 0 || fairLaunches.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/launchpad/presales"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Presales
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ── Identity + raise ─────────────────────────────────────────────── */}
        <div className="space-y-12 lg:col-start-1 lg:row-start-1">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-mono text-lg font-bold sm:h-20 sm:w-20 sm:text-xl",
                tone.tile
              )}
              aria-hidden="true"
            >
              {tileText}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <StatusBadge status={presale.status} />
                <NetworkChip network={presale.network} />
                {presale.category && <span className="text-xs text-muted-foreground">{presale.category}</span>}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{presale.title}</h1>
              {presale.description && <p className="mt-3 max-w-2xl text-base text-muted-foreground">{presale.description}</p>}
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Listed by <span className="font-mono text-foreground/90">{presale.ownerAddress}</span>
                </span>
                <span>Record updated {formatUtc(presale.updatedAt, false)}</span>
              </p>
            </div>
          </header>

          <section aria-labelledby="raise-title">
            <SectionHead
              id="raise-title"
              eyebrow="Raise"
              title="Sale progress"
              aside={<span className="text-xs text-muted-foreground">Catalog record · not read from a contract</span>}
            />
            <div className="mt-6">
              <RaiseInstrument presale={presale} raise={raise} />
            </div>
          </section>
        </div>

        {/* ── Participation rail ───────────────────────────────────────────── */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <ParticipationPanel presale={presale} raise={raise} />
          </div>
        </aside>

        {/* ── Terms, schedule, context ─────────────────────────────────────── */}
        <div className="space-y-14 lg:col-start-1 lg:row-start-2">
          <section aria-labelledby="terms-title">
            <SectionHead id="terms-title" eyebrow="Terms" title="Sale terms" />
            <dl className="mt-4 divide-y divide-border/60 border-y border-border/60">
              <TermRow label="Soft cap">
                <span className="font-mono">{presale.softCap ?? "—"}</span>
              </TermRow>
              <TermRow label="Hard cap">
                <span className="font-mono">{presale.hardCap ?? "—"}</span>
              </TermRow>
              <TermRow label="Min contribution" hint="Per wallet, as stored on the record.">
                <span className="font-mono">{presale.minContribution ?? "—"}</span>
              </TermRow>
              <TermRow label="Max contribution" hint="Per wallet, as stored on the record.">
                <span className="font-mono">{presale.maxContribution ?? "—"}</span>
              </TermRow>
              <TermRow label="Sale window" hint={duration ? "Derived from the stored open and close times." : undefined}>
                {duration ?? "—"}
              </TermRow>
              <TermRow label="Network">
                <NetworkChip network={presale.network} />
              </TermRow>
            </dl>

            <details className="group mt-5">
              <summary className="cursor-pointer list-none text-sm text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span className="text-primary">Not recorded for this sale</span> · {NOT_RECORDED_TERMS.length} terms
                <span className="ml-1 text-xs group-open:hidden">(show)</span>
              </summary>
              <ul className="mt-3 space-y-2 border-l border-dashed border-border pl-4">
                {NOT_RECORDED_TERMS.map((t) => (
                  <li key={t.label} className="text-sm">
                    <span className="text-foreground">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.detail}</span>
                  </li>
                ))}
              </ul>
            </details>
          </section>

          <section aria-labelledby="schedule-title">
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

          <section aria-labelledby="context-title">
            <SectionHead id="context-title" eyebrow="Context" title="Token and project" />
            <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Token</p>
                {token ? (
                  <>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-xs font-bold",
                          toneFor(token.category).tile
                        )}
                        aria-hidden="true"
                      >
                        {token.symbol.slice(0, 4)}
                      </span>
                      <div className="min-w-0">
                        <Link href={`/tokens/${token.id}`} className="block truncate text-base font-medium text-foreground hover:text-primary">
                          {token.name}
                        </Link>
                        <p className="font-mono text-xs text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                    <dl className="mt-3 divide-y divide-border/60 border-y border-border/60">
                      <TermRow label="Standard">{token.standard ?? "—"}</TermRow>
                      <TermRow label="Decimals">{token.decimals ?? "—"}</TermRow>
                      <TermRow label="Total supply">
                        <span className="font-mono">{token.totalSupply ?? "—"}</span>
                      </TermRow>
                      <TermRow
                        label="Token network"
                        hint={token.network !== presale.network ? `The sale record lists ${presale.network}.` : undefined}
                      >
                        {token.network}
                      </TermRow>
                      <TermRow label="Token contract">
                        {token.contractAddress ? (
                          <span className="flex items-center gap-1">
                            <span className="font-mono" title={token.contractAddress}>
                              {shorten(token.contractAddress)}
                            </span>
                            <CopyButton value={token.contractAddress} label="token contract address" />
                            {explorerBase && (
                              <a
                                href={`${explorerBase}/address/${token.contractAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Open token contract in block explorer"
                                title="Open in block explorer"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </span>
                        ) : (
                          "Not recorded"
                        )}
                      </TermRow>
                    </dl>
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <Link href={`/tokens/${token.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                        Token page <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/tokens/${token.id}/contract`} className="inline-flex items-center gap-1 text-primary hover:underline">
                        Contract <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/tokens/${token.id}/activity`} className="inline-flex items-center gap-1 text-primary hover:underline">
                        Activity <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </p>
                  </>
                ) : (
                  <p className="mt-3 border-l-2 border-dashed border-border pl-3 text-sm text-muted-foreground">
                    The token <span className="font-mono text-foreground">{presale.tokenId}</span> referenced by this sale was not found in the
                    catalog.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project</p>
                {project ? (
                  <>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold",
                          toneFor(project.category).tile
                        )}
                        aria-hidden="true"
                      >
                        {project.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <Link href={`/projects/${project.id}`} className="block truncate text-base font-medium text-foreground hover:text-primary">
                          {project.name}
                        </Link>
                        {project.category && <p className="text-xs text-muted-foreground">{project.category}</p>}
                      </div>
                    </div>
                    {project.description && <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>}
                    <dl className="mt-3 divide-y divide-border/60 border-y border-border/60">
                      <TermRow label="Verification" hint="Stored catalog tier; not an audit or contract check by this page.">
                        {verificationLabel(project.verificationStatus)}
                      </TermRow>
                      <TermRow label="Website">
                        {project.websiteUrl ? (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-full items-center gap-1 break-all text-primary hover:underline"
                          >
                            {project.websiteUrl.replace(/^https?:\/\//, "")}
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          "Not recorded"
                        )}
                      </TermRow>
                      {socials.length > 0 && (
                        <TermRow label="Social">
                          <span className="flex flex-wrap gap-x-3 gap-y-1">
                            {socials.map(([name, url]) => (
                              <a
                                key={name}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="capitalize text-primary hover:underline"
                              >
                                {name}
                              </a>
                            ))}
                          </span>
                        </TermRow>
                      )}
                    </dl>
                    <p className="mt-3 text-sm">
                      <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                        Project profile <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </p>
                  </>
                ) : (
                  <p className="mt-3 border-l-2 border-dashed border-border pl-3 text-sm text-muted-foreground">
                    {presale.projectId ? "The linked project was not found in the catalog." : "No project is linked to this sale."}
                  </p>
                )}
              </div>
            </div>
          </section>

          {hasRelated && (
            <section aria-labelledby="related-title">
              <SectionHead id="related-title" eyebrow="Same token" title="Other launches for this token" />
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
                        <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Fair launch</span>
                        <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">{f.title}</span>
                      </span>
                      <StatusBadge status={f.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="border-l-2 border-border pl-3 text-xs text-muted-foreground">
            Demonstration data. Every figure and date on this page comes from a sample catalog record; none of it is read from a contract
            or block explorer. Under D-04 only Ethereum Sepolia (11155111) is an active network, and some records name other networks as
            catalog origin.
          </p>
        </div>
      </div>
    </div>
  );
}
