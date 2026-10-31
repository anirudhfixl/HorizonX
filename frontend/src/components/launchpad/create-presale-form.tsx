"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_TOKENS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DRAFT,
  NOT_COLLECTED,
  SIMULATION_DESCRIPTION,
  SIMULATION_TITLE,
  STEP_FIELDS,
  deriveDraft,
  findCatalogToken,
  formatNumber,
  parseNumber,
  validateDraft,
  type DraftField,
  type PresaleDraft,
  type StepKey,
} from "@/lib/presale-create";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Info, Wallet } from "lucide-react";

const STEPS: { key: StepKey; label: string; short: string }[] = [
  { key: "token", label: "Token", short: "Which token is sold" },
  { key: "caps", label: "Rate and caps", short: "Price and fundraising targets" },
  { key: "limits", label: "Contribution limits", short: "What one wallet may put in" },
  { key: "review", label: "Review", short: "Check, then run the simulation" },
];

const UNIT = "ETH";

// ─── Small pieces ─────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

interface FieldProps {
  field: DraftField;
  label: string;
  value: string;
  error?: string;
  hint: React.ReactNode;
  suffix?: string;
  placeholder?: string;
  mono?: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function Field({ field, label, value, error, hint, suffix, placeholder, mono = true, onChange, onBlur }: FieldProps) {
  const id = `pc-${field}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2.5 focus-within:ring-2",
          error ? "border-destructive/60 focus-within:ring-destructive/25" : "border-border focus-within:border-primary focus-within:ring-primary/25"
        )}
      >
        <input
          id={id}
          type="text"
          inputMode={field === "tokenAddress" ? "text" : "decimal"}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={`${id}-help`}
          className={cn(
            "w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
            mono && "font-mono"
          )}
        />
        {suffix && <span className="shrink-0 text-xs font-semibold text-primary">{suffix}</span>}
      </div>
      <div id={`${id}-help`} className="mt-1.5 min-h-5 text-xs">
        {error ? (
          <p role="alert" className="flex gap-1.5 text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : (
          <p className="text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-4 py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-foreground">{children}</dd>
    </div>
  );
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs text-primary hover:underline">
          Edit
        </button>
      </div>
      <dl className="mt-1 divide-y divide-border/60 border-y border-border/60">{children}</dl>
    </section>
  );
}

// ─── Cap ladder (preview of the typed values only) ───────────────────────────

function CapLadder({ draft }: { draft: PresaleDraft }) {
  const soft = parseNumber(draft.softCap);
  const hard = parseNumber(draft.hardCap);
  if (soft === null || hard === null || hard <= 0 || soft <= 0 || soft > hard) {
    return (
      <p className="border-l-2 border-dashed border-border pl-3 text-sm text-muted-foreground">
        Enter a soft cap and a hard cap (soft cap not above hard cap) to preview how they relate.
      </p>
    );
  }
  const pct = (soft / hard) * 100;
  const align = pct > 85 ? "-100%" : pct < 15 ? "0%" : "-50%";
  return (
    <div aria-label="Preview of the entered soft cap against the hard cap" role="img">
      <div className="relative mb-7 mt-8">
        <div
          className="absolute -top-6 whitespace-nowrap text-[11px] text-muted-foreground"
          style={{ left: `${pct}%`, transform: `translateX(${align})` }}
        >
          Soft cap · <span className="font-mono text-foreground">{formatNumber(soft)} {UNIT}</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-to-r from-primary/30 to-primary/70" style={{ width: `${pct}%` }} />
          <span className="absolute -top-1.5 h-[calc(100%+12px)] w-0.5 rounded bg-foreground/70" style={{ left: `calc(${pct}% - 1px)` }} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>0</span>
          <span>{formatNumber(hard)} {UNIT} hard cap</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CreatePresaleForm() {
  const { isConnected, isConnecting, isReconnecting, isUnsupportedNetwork, shortAddress, walletProvider, balance, network, isDemoMode, switchNetwork } =
    useWallet();
  const { openModal } = useModal();

  const [draft, setDraft] = useState<PresaleDraft>(DEFAULT_DRAFT);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [touched, setTouched] = useState<Partial<Record<DraftField, boolean>>>({});
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const errors = validateDraft(draft);
  const derived = deriveDraft(draft);
  const catalog = findCatalogToken(draft.tokenAddress, MOCK_TOKENS);
  const checking = isConnecting || isReconnecting;
  const current = STEPS[step];

  const shown = (f: DraftField) => (touched[f] ? errors[f] : undefined);
  const set = (f: DraftField) => (v: string) => setDraft((d) => ({ ...d, [f]: v }));
  const blur = (f: DraftField) => () => setTouched((t) => ({ ...t, [f]: true }));

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());
  const goTo = (i: number) => {
    setStep(i);
    focusHeading();
  };

  const stepFields = current.key === "review" ? [] : STEP_FIELDS[current.key];
  const stepErrorList = stepFields.filter((f) => errors[f] && touched[f]);

  const goNext = () => {
    if (current.key === "review") return;
    const fields = STEP_FIELDS[current.key];
    const bad = fields.filter((f) => errors[f]);
    if (bad.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
      requestAnimationFrame(() => document.getElementById(`pc-${bad[0]}`)?.focus());
      return;
    }
    const next = step + 1;
    setMaxStep((m) => Math.max(m, next));
    goTo(next);
  };

  const confirm = () => {
    if (checking) return;
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    if (isUnsupportedNetwork) {
      switchNetwork();
      return;
    }
    const firstBad = (Object.keys(STEP_FIELDS) as (keyof typeof STEP_FIELDS)[]).findIndex((k) => STEP_FIELDS[k].some((f) => errors[f]));
    if (firstBad !== -1) {
      setTouched(Object.fromEntries((Object.keys(DEFAULT_DRAFT) as DraftField[]).map((f) => [f, true])));
      goTo(firstBad);
      return;
    }
    toast.success(SIMULATION_TITLE, { description: SIMULATION_DESCRIPTION });
    setDone(true);
    focusHeading();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (current.key === "review") confirm();
    else goNext();
  };

  const reset = () => {
    setDraft(DEFAULT_DRAFT);
    setTouched({});
    setStep(0);
    setMaxStep(0);
    setDone(false);
    focusHeading();
  };

  // ── Action button for the review step (wallet and network aware) ──────────
  const confirmButton = checking ? (
    <Button type="button" size="lg" disabled className="w-full sm:w-auto">
      Checking wallet…
    </Button>
  ) : !isConnected ? (
    <Button type="submit" size="lg" className="w-full sm:w-auto">
      Connect wallet to continue
    </Button>
  ) : isUnsupportedNetwork ? (
    <Button type="submit" size="lg" variant="outline" className="w-full sm:w-auto">
      Switch to Sepolia
    </Button>
  ) : (
    <Button type="submit" size="lg" className="w-full sm:w-auto">
      Run presale simulation
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/launchpad" className="hover:text-foreground">Launchpad</Link>
        <span aria-hidden="true">/</span>
        <Link href="/launchpad/presales" className="hover:text-foreground">Presales</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Create</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <Eyebrow>Presale setup</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Create a presale</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Set the token, rate, fundraising caps and per-wallet limits, then review them before you run the simulation.
        </p>
        <p className="mt-5 flex gap-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Phase 1 demonstration.</span> Finishing this flow only validates the parameters you
            enter. No contract is deployed, no transaction is sent and no presale record is created, so nothing will appear in the presale
            directory.
          </span>
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ── Step rail ───────────────────────────────────────────────────── */}
        <nav aria-label="Presale setup steps" className="lg:sticky lg:top-24 lg:self-start">
          {/* compact (below lg) */}
          <div className="lg:hidden">
            <p className="text-xs text-muted-foreground">
              Step {done ? STEPS.length : step + 1} of {STEPS.length} ·{" "}
              <span className="text-foreground">{done ? "Complete" : current.label}</span>
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.key} className={cn("h-1 rounded-full", done || i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-secondary")} />
              ))}
            </div>
          </div>
          {/* full (lg+) */}
          <ol className="hidden lg:block">
            {STEPS.map((s, i) => {
              const state = done || i < step ? "done" : i === step ? "current" : "upcoming";
              const reachable = !done && i <= maxStep && i !== step;
              return (
                <li key={s.key} className="relative pb-7 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className={cn("absolute left-[11px] top-7 h-[calc(100%-1.5rem)] w-px", state === "done" ? "bg-primary/60" : "bg-border")} aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => goTo(i)}
                    aria-current={state === "current" ? "step" : undefined}
                    className="group grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 text-left disabled:cursor-default"
                  >
                    <span
                      className={cn(
                        "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                        state === "done" && "border-primary bg-primary text-primary-foreground",
                        state === "current" && "border-primary bg-background text-primary ring-4 ring-primary/15",
                        state === "upcoming" && "border-dashed border-border bg-background text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-sm font-semibold", state === "upcoming" ? "text-muted-foreground" : "text-foreground", reachable && "group-hover:text-primary")}>
                        {s.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{s.short}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* ── Step content ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="min-w-0">
          {done ? (
            <section aria-labelledby="pc-title" className="rounded-2xl bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-8">
              <div className="flex items-center gap-2">
                <StatusBadge status="draft" />
                <span className="text-xs text-muted-foreground">Simulation only</span>
              </div>
              <h2 id="pc-title" ref={headingRef} tabIndex={-1} className="mt-3 text-2xl font-semibold tracking-tight text-foreground focus:outline-none">
                Simulation complete
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                The parameters passed validation. <span className="text-foreground">No presale contract was deployed, no transaction was sent from your
                wallet and no presale record was created.</span> This presale will not appear in the directory.
              </p>
              <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
                <ReviewRow label="Token">
                  <span className="font-mono text-xs">{draft.tokenAddress.trim()}</span>
                </ReviewRow>
                <ReviewRow label="Rate">
                  <span className="font-mono">{draft.presaleRate} tokens per 1 {UNIT}</span>
                </ReviewRow>
                <ReviewRow label="Soft / hard cap">
                  <span className="font-mono">{draft.softCap} / {draft.hardCap} {UNIT}</span>
                </ReviewRow>
                <ReviewRow label="Per wallet">
                  <span className="font-mono">{draft.minContribution} to {draft.maxContribution} {UNIT}</span>
                </ReviewRow>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => { setDone(false); goTo(3); }}>
                  Back to review
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  Start a new draft
                </Button>
                <Link href="/launchpad/presales" className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-primary hover:underline">
                  Browse presales
                </Link>
              </div>
            </section>
          ) : (
            <section aria-labelledby="pc-title">
              <Eyebrow>Step {step + 1} of {STEPS.length}</Eyebrow>
              <h2 id="pc-title" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold tracking-tight text-foreground focus:outline-none">
                {current.label}
              </h2>

              {stepErrorList.length > 0 && (
                <div role="alert" className="mt-5 border-l-2 border-destructive pl-3 text-sm">
                  <p className="font-medium text-foreground">
                    Fix {stepErrorList.length === 1 ? "1 field" : `${stepErrorList.length} fields`} to continue
                  </p>
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    {stepErrorList.map((f) => (
                      <li key={f}>
                        <a href={`#pc-${f}`} className="text-destructive hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`pc-${f}`)?.focus(); }}>
                          {errors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1 · Token */}
              {current.key === "token" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Presales sell an existing token. Paste the address of the token contract you want to sell. The address is the only
                    required field.
                  </p>
                  <Field
                    field="tokenAddress"
                    label="Token contract address *"
                    value={draft.tokenAddress}
                    error={shown("tokenAddress")}
                    placeholder="0x…"
                    hint="A full address: 0x followed by 40 hexadecimal characters."
                    onChange={set("tokenAddress")}
                    onBlur={blur("tokenAddress")}
                  />
                  <div aria-live="polite" className="text-sm">
                    {catalog ? (
                      <div className="border-l-2 border-primary pl-3">
                        <p className="font-medium text-foreground">
                          Matches sample catalog token{" "}
                          <Link href={`/tokens/${catalog.id}`} className="text-primary hover:underline">
                            {catalog.name} ({catalog.symbol})
                          </Link>
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          Catalog network: {catalog.network}. This is a lookup in the sample catalog, not an on-chain check.
                        </p>
                      </div>
                    ) : !errors.tokenAddress ? (
                      <p className="border-l-2 border-dashed border-border pl-3 text-muted-foreground">
                        This address is not in the sample catalog. That does not mean it is wrong: this page does not read the chain or verify
                        the contract.
                      </p>
                    ) : (
                      <p className="border-l-2 border-dashed border-border pl-3 text-muted-foreground">
                        Nothing to look up yet. Once the address is complete, it is compared with the sample catalog.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 2 · Rate and caps */}
              {current.key === "caps" && (
                <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      The rate sets how many tokens one {UNIT} buys. The soft cap is the minimum raise a sale aims to reach; the hard cap is
                      the most it can take in.
                    </p>
                    <Field
                      field="presaleRate"
                      label="Presale rate"
                      value={draft.presaleRate}
                      error={shown("presaleRate")}
                      suffix={`tokens / 1 ${UNIT}`}
                      hint={`Tokens a contributor receives for 1 ${UNIT}. Higher means a lower price per token.`}
                      onChange={set("presaleRate")}
                      onBlur={blur("presaleRate")}
                    />
                    <Field
                      field="softCap"
                      label="Soft cap"
                      value={draft.softCap}
                      error={shown("softCap")}
                      suffix={UNIT}
                      hint="The raise the sale aims to reach at minimum. Must be above zero."
                      onChange={set("softCap")}
                      onBlur={blur("softCap")}
                    />
                    <Field
                      field="hardCap"
                      label="Hard cap"
                      value={draft.hardCap}
                      error={shown("hardCap")}
                      suffix={UNIT}
                      hint="The maximum the sale can raise. Must be at least the soft cap."
                      onChange={set("hardCap")}
                      onBlur={blur("hardCap")}
                    />
                  </div>
                  <aside aria-label="Preview of your entries" className="min-w-0 xl:pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview of your entries</p>
                    <CapLadder draft={draft} />
                    <dl className="mt-2 divide-y divide-border/60 border-y border-border/60 text-sm">
                      <ReviewRow label="Tokens at hard cap">
                        {derived.tokensAtHardCap !== null ? <span className="font-mono">{formatNumber(derived.tokensAtHardCap)}</span> : "—"}
                      </ReviewRow>
                      <ReviewRow label="Tokens at soft cap">
                        {derived.tokensAtSoftCap !== null ? <span className="font-mono">{formatNumber(derived.tokensAtSoftCap)}</span> : "—"}
                      </ReviewRow>
                      <ReviewRow label="Soft cap share">
                        {derived.softPctOfHard !== null ? <span className="font-mono">{formatNumber(derived.softPctOfHard)}% of hard cap</span> : "—"}
                      </ReviewRow>
                    </dl>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Simple arithmetic on the numbers you typed (cap × rate), in whole tokens. Token decimals and supply are not considered,
                      and nothing here checks that the token supply covers the sale.
                    </p>
                  </aside>
                </div>
              )}

              {/* 3 · Limits */}
              {current.key === "limits" && (
                <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Limits keep a single wallet from taking too large or too small a share of the sale.
                    </p>
                    <Field
                      field="minContribution"
                      label="Minimum contribution per wallet"
                      value={draft.minContribution}
                      error={shown("minContribution")}
                      suffix={UNIT}
                      hint="The smallest single contribution. Zero means no minimum."
                      onChange={set("minContribution")}
                      onBlur={blur("minContribution")}
                    />
                    <Field
                      field="maxContribution"
                      label="Maximum contribution per wallet"
                      value={draft.maxContribution}
                      error={shown("maxContribution")}
                      suffix={UNIT}
                      hint="The most one wallet can contribute. Must be at least the minimum and no more than the hard cap."
                      onChange={set("maxContribution")}
                      onBlur={blur("maxContribution")}
                    />
                  </div>
                  <aside aria-label="What these limits imply" className="min-w-0 xl:pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What these limits imply</p>
                    <dl className="mt-2 divide-y divide-border/60 border-y border-border/60 text-sm">
                      <ReviewRow label="Per wallet">
                        <span className="font-mono">{draft.minContribution || "—"} to {draft.maxContribution || "—"} {UNIT}</span>
                      </ReviewRow>
                      <ReviewRow label="Wallets to fill">
                        {derived.minWalletsToFill !== null ? (
                          <span>At least <span className="font-mono">{derived.minWalletsToFill.toLocaleString("en-US")}</span> wallets at the maximum</span>
                        ) : "—"}
                      </ReviewRow>
                    </dl>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Derived from your hard cap and maximum. These are the values you enter here; this page does not enforce them on-chain.
                    </p>
                  </aside>
                </div>
              )}

              {/* 4 · Review */}
              {current.key === "review" && (
                <div className="mt-6 space-y-8">
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Check everything below. Use Edit to change a section; your entries are kept.
                  </p>
                  <div className="grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-2">
                    <div className="space-y-8">
                      <ReviewGroup title="Token" onEdit={() => goTo(0)}>
                        <ReviewRow label="Contract address">
                          <span className="font-mono text-xs">{draft.tokenAddress.trim()}</span>
                        </ReviewRow>
                        <ReviewRow label="Sample catalog">
                          {catalog ? `${catalog.name} (${catalog.symbol})` : "No match; not verified"}
                        </ReviewRow>
                      </ReviewGroup>
                      <ReviewGroup title="Rate and caps" onEdit={() => goTo(1)}>
                        <ReviewRow label="Presale rate"><span className="font-mono">{draft.presaleRate} tokens per 1 {UNIT}</span></ReviewRow>
                        <ReviewRow label="Soft cap"><span className="font-mono">{draft.softCap} {UNIT}</span></ReviewRow>
                        <ReviewRow label="Hard cap"><span className="font-mono">{draft.hardCap} {UNIT}</span></ReviewRow>
                      </ReviewGroup>
                      <ReviewGroup title="Contribution limits" onEdit={() => goTo(2)}>
                        <ReviewRow label="Minimum"><span className="font-mono">{draft.minContribution} {UNIT}</span></ReviewRow>
                        <ReviewRow label="Maximum"><span className="font-mono">{draft.maxContribution} {UNIT}</span></ReviewRow>
                      </ReviewGroup>
                    </div>
                    <div className="space-y-8">
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Derived from your entries</h3>
                        <dl className="mt-1 divide-y divide-border/60 border-y border-border/60">
                          <ReviewRow label="Tokens at hard cap">{derived.tokensAtHardCap !== null ? <span className="font-mono">{formatNumber(derived.tokensAtHardCap)}</span> : "—"}</ReviewRow>
                          <ReviewRow label="Tokens at soft cap">{derived.tokensAtSoftCap !== null ? <span className="font-mono">{formatNumber(derived.tokensAtSoftCap)}</span> : "—"}</ReviewRow>
                          <ReviewRow label="Wallets to fill">{derived.minWalletsToFill !== null ? <span className="font-mono">≥ {derived.minWalletsToFill.toLocaleString("en-US")}</span> : "—"}</ReviewRow>
                        </dl>
                      </section>
                      <details className="group">
                        <summary className="cursor-pointer list-none text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                          <span className="text-primary">Not collected by this form</span> · {NOT_COLLECTED.length} terms
                          <span className="ml-1 text-xs group-open:hidden">(show)</span>
                        </summary>
                        <ul className="mt-3 space-y-2 border-l border-dashed border-border pl-4">
                          {NOT_COLLECTED.map((t) => (
                            <li key={t.label} className="text-sm">
                              <span className="text-foreground">{t.label}</span>
                              <span className="block text-xs text-muted-foreground">{t.detail}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-5 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wallet</p>
                    <div className="mt-2">
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
                                  <span className="font-mono">{balance} {network.symbol}</span> on {network.name}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No wallet connected. You will be asked to connect before the simulation runs.</p>
                      )}
                      {isConnected && isUnsupportedNetwork && (
                        <p className="mt-3 border-l-2 border-amber-400/70 pl-3 text-muted-foreground">
                          <span className="font-medium text-foreground">Unsupported network.</span> Under D-04 the app supports Ethereum
                          Sepolia (11155111) only. Switch networks to run the simulation.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} className="gap-2 self-start">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </Button>
                ) : (
                  <Link href="/launchpad/presales" className="text-sm text-muted-foreground hover:text-foreground">
                    Cancel
                  </Link>
                )}
                {current.key === "review" ? (
                  confirmButton
                ) : (
                  <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto">
                    Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
              {current.key === "review" && (
                <p className="mt-3 text-xs text-muted-foreground sm:text-right">
                  Running the simulation sends nothing from your wallet.
                </p>
              )}
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
