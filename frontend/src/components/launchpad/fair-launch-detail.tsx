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
import { formatAmount, formatUtc, parseAmountParts, validateContribution, verificationLabel, windowDuration } from "@/lib/presale-detail";
import {
  COMMITMENT_UNAVAILABLE,
  NOT_RECORDED_TERMS,
  buildMilestones,
  computeCommitment,
  contributionUnit,
  formatPct,
  isConcluded,
  participantsLabel,
  participationState,
  softCapStatement,
  type Commitment,
  type Milestone,
} from "@/lib/fair-launch-detail";
import type { FairLaunch, Presale, Project, Token } from "@/types";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Info, Wallet } from "lucide-react";

export interface FairLaunchDetailProps {
  launch: FairLaunch;
  token?: Token;
  project?: Project;
  siblingLaunches: FairLaunch[];
  presales: Presale[];
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

function TermRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-x-4 gap-y-0.5 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground">
        {children}
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  );
}

// ─── Launch window (horizontal on md+, vertical below) ───────────────────────

function WindowTrack({ milestones, duration }: { milestones: Milestone[]; duration: string | null }) {
  return (
    <div>
      <ol className="grid grid-cols-1 gap-y-5 md:grid-cols-4 md:gap-y-0">
        {milestones.map((m, i) => (
          <li key={m.key} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 md:block">
            {/* connector */}
            {i < milestones.length - 1 && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%+0.25rem)] w-px md:left-6 md:top-[11px] md:h-px md:w-[calc(100%-1.5rem)]",
                  m.state === "done" ? "bg-primary/60" : "border-l border-dashed border-border md:border-l-0 md:border-t"
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                m.state === "done" && "border-primary bg-primary text-primary-foreground",
                m.state === "current" && "border-primary bg-background text-primary ring-4 ring-primary/15",
                m.state === "upcoming" && "border-dashed border-border bg-background text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {m.state === "done" ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <div className="min-w-0 md:mt-3 md:pr-4">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className={cn("text-sm font-semibold", m.state === "upcoming" ? "text-muted-foreground" : "text-foreground")}>{m.label}</p>
                {m.state === "current" && <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Current stage</span>}
              </div>
              <p className="font-mono text-xs text-foreground/90">{m.at ? formatUtc(m.at) : "No date recorded"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">
        Stage comes from the stored status, not the clock. Dates are stored UTC values
        {duration ? <> · Window length derived from the open and close times: <span className="text-foreground">{duration}</span></> : null}.
      </p>
    </div>
  );
}

// ─── Commitment gauge (against the soft cap; no hard cap exists) ─────────────

function CommitmentGauge({ launch, commitment }: { launch: FairLaunch; commitment: Commitment }) {
  const concluded = isConcluded(launch.status);

  if (!commitment.available) {
    return (
      <div className="border-l-2 border-dashed border-border pl-4">
        <p className="text-sm font-medium text-foreground">Progress unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">{COMMITMENT_UNAVAILABLE[commitment.reason]}</p>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Total raised (stored)</dt>
            <dd className="font-mono text-foreground">{launch.totalRaised ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Soft cap (stored)</dt>
            <dd className="font-mono text-foreground">{launch.softCap ?? "—"}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const statement = softCapStatement(launch.status, commitment);
  const fill =
    launch.status === "failed" || launch.status === "cancelled"
      ? "bg-destructive/70"
      : concluded
        ? "bg-zinc-400"
        : commitment.state === "reached"
          ? "bg-emerald-400"
          : launch.status === "live"
            ? "bg-primary"
            : "bg-amber-400/70";
  const tickAlign = commitment.tickPct > 85 ? "-100%" : commitment.tickPct < 15 ? "0%" : "-50%";
  const raisedZero = commitment.raised === 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-xs text-muted-foreground">{concluded ? "Total committed (final record)" : "Total committed"}</p>
          <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {formatAmount(commitment.raised, commitment.unit)}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-3xl font-semibold text-primary">{formatPct(commitment.pctOfSoft)}</p>
          <p className="text-xs text-muted-foreground">of {formatAmount(commitment.softCap, commitment.unit)} soft cap</p>
        </div>
      </div>

      <div className="relative mb-8 mt-10">
        <div
          className="pointer-events-none absolute -top-7 whitespace-nowrap text-[11px] text-muted-foreground"
          style={{ left: `${commitment.tickPct}%`, transform: `translateX(${tickAlign})` }}
        >
          Soft cap · <span className="font-mono text-foreground">{formatAmount(commitment.softCap, commitment.unit)}</span>
        </div>
        <div
          className="relative h-4 w-full rounded-full bg-secondary"
          role="meter"
          aria-valuemin={0}
          aria-valuenow={Math.round(commitment.pctOfSoft)}
          aria-valuetext={`${formatPct(commitment.pctOfSoft)} of soft cap`}
          aria-label={`${launch.title}: ${launch.totalRaised} committed against a ${launch.softCap} soft cap`}
        >
          <div className={cn("h-full rounded-full", fill)} style={{ width: `${commitment.fillPct}%` }} />
          <span
            className="absolute -top-1.5 h-[calc(100%+12px)] w-0.5 rounded bg-foreground/70"
            style={{ left: `calc(${commitment.tickPct}% - 1px)` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>0</span>
          <span>{commitment.state === "reached" ? formatAmount(commitment.raised, commitment.unit) : formatAmount(commitment.softCap, commitment.unit)}</span>
        </div>
      </div>

      <dl className="grid grid-cols-1 divide-y divide-border/60 border-y border-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-3 sm:px-4 sm:first:pl-0">
          <dt className="text-xs text-muted-foreground">Soft cap</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">{statement}</dd>
          {commitment.remainingToSoft !== undefined && (
            <dd className="font-mono text-xs text-muted-foreground">{formatAmount(commitment.remainingToSoft, commitment.unit)} to go</dd>
          )}
          {commitment.overSoft !== undefined && (
            <dd className="font-mono text-xs text-muted-foreground">{formatAmount(commitment.overSoft, commitment.unit)} past the soft cap</dd>
          )}
          {raisedZero && <dd className="text-xs text-muted-foreground">Recorded raise is 0.</dd>}
        </div>
        <div className="py-3 sm:px-4">
          <dt className="text-xs text-muted-foreground">Hard cap</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">None stored</dd>
          <dd className="text-xs text-muted-foreground">The bar is scaled to the soft cap and can run past it.</dd>
        </div>
        <div className="py-3 sm:px-4 sm:last:pr-0">
          <dt className="text-xs text-muted-foreground">Participants (recorded)</dt>
          <dd className="mt-0.5 font-mono text-sm font-medium text-foreground">{participantsLabel(launch.participantCount)}</dd>
        </div>
      </dl>
    </div>
  );
}

// ─── Participation ────────────────────────────────────────────────────────────

function ParticipationPanel({ launch }: { launch: FairLaunch }) {
  const { isConnected, isConnecting, isReconnecting, isUnsupportedNetwork, shortAddress, walletProvider, balance, network, isDemoMode, switchNetwork } =
    useWallet();
  const { openModal } = useModal();

  const state = participationState(launch);
  const unit = contributionUnit(launch);
  const sepoliaLaunch = isSepoliaNetwork(launch.network);
  const inputRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState(false);

  const check = validateContribution(amount, launch);
  const showError = check.status === "empty" ? attempted : (attempted || amount.length > 0) && check.status !== "ok";
  const minParts = parseAmountParts(launch.minContribution);
  const maxParts = parseAmountParts(launch.maxContribution);
  const checking = isConnecting || isReconnecting;
  const canEnter = state.open && sepoliaLaunch;

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

  const toneDot = state.tone === "open" ? "bg-emerald-400" : state.tone === "pending" ? "bg-amber-400" : "bg-zinc-500";

  return (
    <section
      aria-labelledby="participate-title"
      className="rounded-2xl bg-card p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-6"
    >
      <Eyebrow>Commit</Eyebrow>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", toneDot)} aria-hidden="true" />
        <h2 id="participate-title" className="text-lg font-semibold text-foreground">
          {state.title}
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>

      <dl className="mt-4 grid grid-cols-2 divide-x divide-border/60 border-y border-border/60 text-sm">
        <div className="py-2.5 pr-3">
          <dt className="text-xs text-muted-foreground">Min contribution</dt>
          <dd className="font-mono text-foreground">{launch.minContribution ?? "—"}</dd>
        </div>
        <div className="py-2.5 pl-3">
          <dt className="text-xs text-muted-foreground">Max contribution</dt>
          <dd className="font-mono text-foreground">{launch.maxContribution ?? "—"}</dd>
        </div>
      </dl>

      {!state.open && (
        <p className="mt-4 text-sm text-muted-foreground">
          The contribution form is only offered while a launch is <span className="text-foreground">live</span>.
          {isConcluded(launch.status) && " The final committed amount is shown on the left."}
        </p>
      )}

      {state.open && !sepoliaLaunch && (
        <div className="mt-4 border-l-2 border-amber-400/70 pl-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Not available on this network</p>
          <p className="mt-0.5">
            This record lists <span className="text-foreground">{launch.network}</span>. Under D-04 the app supports transactions only on
            Ethereum Sepolia (11155111), so contributions are not offered for this launch.
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
            <label htmlFor="fair-launch-amount" className="text-xs font-medium text-foreground">
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
                id="fair-launch-amount"
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
                aria-describedby="fair-launch-amount-help"
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {unit && <span className="text-xs font-semibold text-primary">{unit}</span>}
            </div>
            <div id="fair-launch-amount-help" className="mt-1.5 flex min-h-5 items-center justify-between gap-3 text-xs">
              <span className={cn(showError ? "text-destructive" : "text-muted-foreground")} role={showError ? "alert" : undefined}>
                {showError ? ("message" in check ? check.message : "Enter an amount to contribute.") : "Checked against the stored contribution limits."}
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
                The amount passes the stored limits, but contributions are not connected in this build: this record stores no launch contract
                address and the app has no contribution API. Nothing was sent from your wallet.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-xs text-muted-foreground">
        How a contribution converts into tokens (price, share or allocation rule) is not recorded for this launch, so none is shown.
      </p>
      <p className="mt-3 flex gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Launch figures are catalog sample records, not read from a contract. The wallet shown above is the real connection, or a labelled
          demo sandbox.
        </span>
      </p>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function FairLaunchDetail({ launch, token, project, siblingLaunches, presales }: FairLaunchDetailProps) {
  const commitment = computeCommitment(launch);
  const milestones = buildMilestones(launch);
  const duration = windowDuration(launch.startTime, launch.endTime);
  const tone = toneFor(token?.category ?? launch.category);
  const tileText = (token?.symbol ?? launch.title).slice(0, 4).toUpperCase();
  const explorerBase = token ? getExplorerBaseUrl(token.network) : undefined;
  const socials = Object.entries(project?.socialLinks ?? {}).filter(([, url]) => /^https?:\/\//i.test(url));
  const hasRelated = siblingLaunches.length > 0 || presales.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/launchpad/launches"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Fair launches
      </Link>

      {/* ── Masthead: identity + launch window ────────────────────────────── */}
      <header className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card/40 to-transparent px-5 py-7 ring-1 ring-border/60 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
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
              <StatusBadge status={launch.status} />
              <NetworkChip network={launch.network} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Fair launch</span>
              {launch.category && <span className="text-xs text-muted-foreground">{launch.category}</span>}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{launch.title}</h1>
            {launch.description && (
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                {launch.description}
                <span className="mt-1 block text-xs">Listing description from the sample catalog. It is not a verified or enforced term.</span>
              </p>
            )}
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>
                Listed by <span className="font-mono text-foreground/90">{launch.ownerAddress}</span>
              </span>
              {token && (
                <span>
                  Token{" "}
                  <Link href={`/tokens/${token.id}`} className="font-mono text-foreground/90 hover:text-primary">
                    {token.symbol}
                  </Link>
                </span>
              )}
              <span>Record updated {formatUtc(launch.updatedAt, false)}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Launch window</p>
          <WindowTrack milestones={milestones} duration={duration} />
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ── Commitment + terms ───────────────────────────────────────────── */}
        <div className="space-y-14 lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="commitment-title">
            <SectionHead
              id="commitment-title"
              eyebrow="Commitment"
              title="Raise against the soft cap"
              aside={<span className="text-xs text-muted-foreground">Catalog record · not read from a contract</span>}
            />
            <div className="mt-6">
              <CommitmentGauge launch={launch} commitment={commitment} />
            </div>
          </section>

          <section aria-labelledby="terms-title">
            <SectionHead id="terms-title" eyebrow="Terms" title="Stored launch terms" />
            <dl className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-10">
              <div>
                <dt className="text-xs text-muted-foreground">Total tokens for sale</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-foreground">{launch.totalSelling ?? "Not recorded"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Soft cap</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-foreground">{launch.softCap ?? "Not recorded"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Contribution range (per entry)</dt>
                <dd className="mt-1 font-mono text-lg text-foreground">
                  {launch.minContribution ?? "—"} <span className="text-muted-foreground">to</span> {launch.maxContribution ?? "—"}
                </dd>
                <dd className="mt-0.5 text-xs text-muted-foreground">Stored limits; how they apply per wallet is not recorded.</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Participants (recorded)</dt>
                <dd className="mt-1 font-mono text-lg text-foreground">{participantsLabel(launch.participantCount)}</dd>
              </div>
            </dl>
            <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
              <TermRow label="Opens">{launch.startTime ? <span className="font-mono">{formatUtc(launch.startTime)}</span> : "Not recorded"}</TermRow>
              <TermRow label="Closes">{launch.endTime ? <span className="font-mono">{formatUtc(launch.endTime)}</span> : "Not recorded"}</TermRow>
              <TermRow label="Network">
                <NetworkChip network={launch.network} />
              </TermRow>
            </dl>

            <details className="group mt-5">
              <summary className="cursor-pointer list-none text-sm text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span className="text-primary">Not recorded for this launch</span> · {NOT_RECORDED_TERMS.length} terms
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
        </div>

        {/* ── Participation rail ───────────────────────────────────────────── */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <ParticipationPanel launch={launch} />
          </div>
        </aside>

        {/* ── Context ──────────────────────────────────────────────────────── */}
        <div className="space-y-14 lg:col-start-1 lg:row-start-2">
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
                      <TermRow label="Token network" hint={token.network !== launch.network ? `The launch record lists ${launch.network}.` : undefined}>
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
                    The token <span className="font-mono text-foreground">{launch.tokenId}</span> referenced by this launch was not found in the
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
                        {project.websiteUrl && /^https?:\/\//i.test(project.websiteUrl) ? (
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
                              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-primary hover:underline">
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
                    {launch.projectId ? "The linked project was not found in the catalog." : "No project is linked to this launch."}
                  </p>
                )}
              </div>
            </div>
          </section>

          {hasRelated && (
            <section aria-labelledby="related-title">
              <SectionHead id="related-title" eyebrow="Same token" title="Other launches for this token" />
              <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
                {siblingLaunches.map((f) => (
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
                {presales.map((p) => (
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
              </ul>
            </section>
          )}

          <p className="border-l-2 border-border pl-3 text-xs text-muted-foreground">
            Demonstration data. Every figure and date on this page comes from a sample catalog record; none of it is read from a contract or
            block explorer. Under D-04 only Ethereum Sepolia (11155111) is an active network, and some records name other networks as catalog
            origin.
          </p>
        </div>
      </div>
    </div>
  );
}
