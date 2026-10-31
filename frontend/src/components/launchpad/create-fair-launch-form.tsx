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
import { findCatalogToken, formatNumber, parseNumber } from "@/lib/presale-create";
import {
  DEFAULT_FL_DRAFT,
  FL_NOT_COLLECTED,
  FL_SIMULATION_DESCRIPTION,
  FL_SIMULATION_TITLE,
  FL_STEP_FIELDS,
  compareToSupply,
  validateFairLaunch,
  type FairLaunchDraft,
  type FlField,
  type FlStepKey,
} from "@/lib/fair-launch-create";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Info, Wallet } from "lucide-react";

const STEPS: { key: FlStepKey; label: string; short: string }[] = [
  { key: "token", label: "Token", short: "What is offered" },
  { key: "offering", label: "Supply and soft cap", short: "How much, and the minimum raise" },
  { key: "review", label: "Review", short: "Check, then run the simulation" },
];

const UNIT = "ETH";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

function Field(props: {
  field: FlField;
  label: string;
  value: string;
  error?: string;
  hint: React.ReactNode;
  suffix?: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const { field, label, value, error, hint, suffix, placeholder, onChange, onBlur } = props;
  const id = `fl-${field}`;
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
          className="w-full min-w-0 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-x-4 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-foreground">{children}</dd>
    </div>
  );
}

/** Fixed explanatory diagram: what "no hard cap" means. It shows no entered or stored data. */
function OpenEndedDiagram() {
  return (
    <figure>
      <div className="relative mt-6 h-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-4 h-2.5 rounded-full bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
        <span className="absolute top-2 h-6 w-0.5 rounded bg-foreground/70" style={{ left: "45%" }} />
        <span className="absolute -top-3 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted-foreground" style={{ left: "45%" }}>Soft cap</span>
        <span className="absolute right-0 top-[7px] text-primary">→</span>
      </div>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Diagram, not your data. A fair launch records a soft cap and no hard cap, so the amount raised can pass the soft cap.
      </figcaption>
    </figure>
  );
}

export function CreateFairLaunchForm() {
  const { isConnected, isConnecting, isReconnecting, isUnsupportedNetwork, shortAddress, walletProvider, balance, network, isDemoMode, switchNetwork } =
    useWallet();
  const { openModal } = useModal();

  const [draft, setDraft] = useState<FairLaunchDraft>(DEFAULT_FL_DRAFT);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [touched, setTouched] = useState<Partial<Record<FlField, boolean>>>({});
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const errors = validateFairLaunch(draft);
  const catalog = findCatalogToken(draft.tokenAddress, MOCK_TOKENS);
  const supply = compareToSupply(draft.totalSelling, catalog);
  const total = parseNumber(draft.totalSelling);
  const soft = parseNumber(draft.softCap);
  const checking = isConnecting || isReconnecting;
  const current = STEPS[step];
  const onForm = !done && current.key !== "review";

  const shown = (f: FlField) => (touched[f] ? errors[f] : undefined);
  const set = (f: FlField) => (v: string) => setDraft((d) => ({ ...d, [f]: v }));
  const blur = (f: FlField) => () => setTouched((t) => ({ ...t, [f]: true }));
  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());
  const goTo = (i: number) => {
    setStep(i);
    focusHeading();
  };

  const stepFields = current.key === "review" ? [] : FL_STEP_FIELDS[current.key];
  const stepErrorList = stepFields.filter((f) => errors[f] && touched[f]);

  const goNext = () => {
    if (current.key === "review") return;
    const fields = FL_STEP_FIELDS[current.key];
    const bad = fields.filter((f) => errors[f]);
    if (bad.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
      requestAnimationFrame(() => document.getElementById(`fl-${bad[0]}`)?.focus());
      return;
    }
    setMaxStep((m) => Math.max(m, step + 1));
    goTo(step + 1);
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
    const firstBad = (Object.keys(FL_STEP_FIELDS) as (keyof typeof FL_STEP_FIELDS)[]).findIndex((k) => FL_STEP_FIELDS[k].some((f) => errors[f]));
    if (firstBad !== -1) {
      setTouched(Object.fromEntries((Object.keys(DEFAULT_FL_DRAFT) as FlField[]).map((f) => [f, true])));
      goTo(firstBad);
      return;
    }
    toast.success(FL_SIMULATION_TITLE, { description: FL_SIMULATION_DESCRIPTION });
    setDone(true);
    focusHeading();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (current.key === "review") confirm();
    else goNext();
  };

  const reset = () => {
    setDraft(DEFAULT_FL_DRAFT);
    setTouched({});
    setStep(0);
    setMaxStep(0);
    setDone(false);
    focusHeading();
  };

  const confirmButton = checking ? (
    <Button type="button" size="lg" disabled className="w-full sm:w-auto">Checking wallet…</Button>
  ) : !isConnected ? (
    <Button type="submit" size="lg" className="w-full sm:w-auto">Connect wallet to continue</Button>
  ) : isUnsupportedNetwork ? (
    <Button type="submit" size="lg" variant="outline" className="w-full sm:w-auto">Switch to Sepolia</Button>
  ) : (
    <Button type="submit" size="lg" className="w-full sm:w-auto">Run fair launch simulation</Button>
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/launchpad" className="hover:text-foreground">Launchpad</Link>
        <span aria-hidden="true">/</span>
        <Link href="/launchpad/launches" className="hover:text-foreground">Fair launches</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Create</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <Eyebrow>Fair launch setup</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Create a fair launch</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Choose the token, say how much of it is offered and set the soft cap. A fair launch has no hard cap: the amount raised is measured
          against the soft cap and is allowed to pass it.
        </p>
        <p className="mt-5 flex gap-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Phase 1 demonstration.</span> Finishing this flow only validates the parameters you
            enter. No contract is deployed, no transaction is sent and no fair launch record is created, so nothing will appear in the
            fair launch directory.
          </span>
        </p>
      </header>

      {/* Step strip (all breakpoints) */}
      <nav aria-label="Fair launch setup steps" className="mt-10">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const state = done || i < step ? "done" : i === step ? "current" : "upcoming";
            const reachable = !done && i <= maxStep && i !== step;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(i)}
                  aria-current={state === "current" ? "step" : undefined}
                  className="group block w-full text-left disabled:cursor-default"
                >
                  <span className={cn("block h-1 rounded-full", state === "upcoming" ? "bg-secondary" : state === "current" ? "bg-primary/70" : "bg-primary")} aria-hidden="true" />
                  <span className="mt-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                        state === "done" && "border-primary bg-primary text-primary-foreground",
                        state === "current" && "border-primary text-primary",
                        state === "upcoming" && "border-dashed border-border text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className={cn("truncate text-sm font-semibold", state === "upcoming" ? "text-muted-foreground" : "text-foreground", reachable && "group-hover:text-primary")}>
                      {s.label}
                    </span>
                  </span>
                  <span className="mt-0.5 hidden pl-7 text-xs text-muted-foreground sm:block">{s.short}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={cn("mt-10 grid grid-cols-1 gap-x-14 gap-y-10", onForm && "lg:grid-cols-[minmax(0,1fr)_320px]")}>
        <form onSubmit={handleSubmit} noValidate className="min-w-0">
          {done ? (
            <section aria-labelledby="fl-title" className="rounded-2xl bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-8">
              <div className="flex items-center gap-2">
                <StatusBadge status="draft" />
                <span className="text-xs text-muted-foreground">Simulation only</span>
              </div>
              <h2 id="fl-title" ref={headingRef} tabIndex={-1} className="mt-3 text-2xl font-semibold tracking-tight text-foreground focus:outline-none">
                Simulation complete
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                The parameters passed validation.{" "}
                <span className="text-foreground">
                  No fair launch contract was deployed, no transaction was sent from your wallet and no fair launch record was created.
                </span>{" "}
                This launch will not appear in the directory.
              </p>
              <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
                <Row label="Token"><span className="font-mono text-xs">{draft.tokenAddress.trim()}</span></Row>
                <Row label="Total for sale"><span className="font-mono">{draft.totalSelling} tokens</span></Row>
                <Row label="Soft cap"><span className="font-mono">{draft.softCap} {UNIT}</span></Row>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => { setDone(false); goTo(2); }}>Back to review</Button>
                <Button type="button" variant="outline" onClick={reset}>Start a new draft</Button>
                <Link href="/launchpad/launches" className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-primary hover:underline">
                  Browse fair launches
                </Link>
              </div>
            </section>
          ) : (
            <section aria-labelledby="fl-title">
              <Eyebrow>Step {step + 1} of {STEPS.length}</Eyebrow>
              <h2 id="fl-title" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold tracking-tight text-foreground focus:outline-none">
                {current.label}
              </h2>

              {stepErrorList.length > 0 && (
                <div role="alert" className="mt-5 border-l-2 border-destructive pl-3 text-sm">
                  <p className="font-medium text-foreground">Fix {stepErrorList.length === 1 ? "1 field" : `${stepErrorList.length} fields`} to continue</p>
                  <ul className="mt-1 space-y-0.5">
                    {stepErrorList.map((f) => (
                      <li key={f}>
                        <a href={`#fl-${f}`} className="text-destructive hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`fl-${f}`)?.focus(); }}>
                          {errors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {current.key === "token" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <p className="text-sm text-muted-foreground">
                    A fair launch offers an existing token. Paste the address of the token contract. It is the only required field.
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
                          <Link href={`/tokens/${catalog.id}`} className="text-primary hover:underline">{catalog.name} ({catalog.symbol})</Link>
                        </p>
                        <p className="mt-0.5 text-muted-foreground">Catalog network: {catalog.network}. This is a lookup in the sample catalog, not an on-chain check.</p>
                      </div>
                    ) : !errors.tokenAddress ? (
                      <p className="border-l-2 border-dashed border-border pl-3 text-muted-foreground">
                        This address is not in the sample catalog. That does not mean it is wrong: this page does not read the chain or verify the contract.
                      </p>
                    ) : (
                      <p className="border-l-2 border-dashed border-border pl-3 text-muted-foreground">
                        Nothing to look up yet. Once the address is complete, it is compared with the sample catalog.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {current.key === "offering" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Say how many tokens are offered in total and the minimum raise the launch aims for. This form sets no price: it does not
                    store one for fair launches.
                  </p>
                  <Field
                    field="totalSelling"
                    label="Total tokens for launch"
                    value={draft.totalSelling}
                    error={shown("totalSelling")}
                    suffix="tokens"
                    hint="The whole number of tokens offered in this launch, as a plain number."
                    onChange={set("totalSelling")}
                    onBlur={blur("totalSelling")}
                  />
                  {supply && (
                    <p
                      aria-live="polite"
                      className={cn("border-l-2 pl-3 text-sm", supply.exceeds ? "border-amber-400/70" : "border-border")}
                    >
                      <span className="font-medium text-foreground">
                        {supply.exceeds ? "More than the catalog supply." : `${formatNumber(supply.sharePct)}% of the catalog supply.`}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        The sample catalog records {formatNumber(supply.supply)} total supply for {catalog?.symbol}. Informational only: it
                        ignores decimals and checks no balance.
                      </span>
                    </p>
                  )}
                  <Field
                    field="softCap"
                    label="Minimum soft cap"
                    value={draft.softCap}
                    error={shown("softCap")}
                    suffix={UNIT}
                    hint="The minimum raise the launch aims to reach. There is no upper limit."
                    onChange={set("softCap")}
                    onBlur={blur("softCap")}
                  />
                  <OpenEndedDiagram />
                </div>
              )}

              {current.key === "review" && (
                <div className="mt-6 space-y-8">
                  <p className="max-w-2xl text-sm text-muted-foreground">Check everything below. Use Edit to change a section; your entries are kept.</p>
                  <div className="grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-2">
                    <div className="space-y-8">
                      {[
                        { title: "Token", at: 0, rows: [
                          ["Contract address", <span key="a" className="font-mono text-xs">{draft.tokenAddress.trim()}</span>],
                          ["Sample catalog", catalog ? `${catalog.name} (${catalog.symbol})` : "No match; not verified"],
                        ] },
                        { title: "Supply and soft cap", at: 1, rows: [
                          ["Total for sale", <span key="t" className="font-mono">{draft.totalSelling} tokens</span>],
                          ["Soft cap", <span key="s" className="font-mono">{draft.softCap} {UNIT}</span>],
                          ["Hard cap", "None (not part of a fair launch)"],
                        ] },
                      ].map((g) => (
                        <section key={g.title}>
                          <div className="flex items-baseline justify-between gap-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</h3>
                            <button type="button" onClick={() => goTo(g.at)} className="text-xs text-primary hover:underline">Edit</button>
                          </div>
                          <dl className="mt-1 divide-y divide-border/60 border-y border-border/60">
                            {g.rows.map(([l, v]) => (
                              <Row key={l as string} label={l as string}>{v}</Row>
                            ))}
                          </dl>
                        </section>
                      ))}
                    </div>
                    <details className="group h-fit" open>
                      <summary className="cursor-pointer list-none text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <span className="text-primary">Not set by this form</span> · {FL_NOT_COLLECTED.length} terms
                      </summary>
                      <ul className="mt-3 space-y-2 border-l border-dashed border-border pl-4">
                        {FL_NOT_COLLECTED.map((t) => (
                          <li key={t.label} className="text-sm">
                            <span className="text-foreground">{t.label}</span>
                            <span className="block text-xs text-muted-foreground">{t.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
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
                              {!isUnsupportedNetwork && (<>{" · "}<span className="font-mono">{balance} {network.symbol}</span> on {network.name}</>)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No wallet connected. You will be asked to connect before the simulation runs.</p>
                      )}
                      {isConnected && isUnsupportedNetwork && (
                        <p className="mt-3 border-l-2 border-amber-400/70 pl-3 text-muted-foreground">
                          <span className="font-medium text-foreground">Unsupported network.</span> Under D-04 the app supports Ethereum Sepolia
                          (11155111) only. Switch networks to run the simulation.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} className="gap-2 self-start">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </Button>
                ) : (
                  <Link href="/launchpad/launches" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
                )}
                {current.key === "review" ? (
                  confirmButton
                ) : (
                  <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto">
                    Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
              {current.key === "review" && <p className="mt-3 text-xs text-muted-foreground sm:text-right">Running the simulation sends nothing from your wallet.</p>}
            </section>
          )}
        </form>

        {/* Launch sheet: live read-back of the entries (steps 1-2 only) */}
        {onForm && (
          <aside aria-label="Launch sheet" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Launch sheet</p>
            <dl className="mt-2 divide-y divide-border/60 border-y border-border/60">
              <Row label="Token">
                {draft.tokenAddress.trim() && !errors.tokenAddress ? (
                  <span className="font-mono text-xs">{catalog ? `${catalog.symbol} · ` : ""}{draft.tokenAddress.trim().slice(0, 8)}…{draft.tokenAddress.trim().slice(-4)}</span>
                ) : (
                  <span className="text-muted-foreground">Not entered</span>
                )}
              </Row>
              <Row label="For sale">{total !== null && total > 0 ? <span className="font-mono">{formatNumber(total)} tokens</span> : <span className="text-muted-foreground">—</span>}</Row>
              <Row label="Soft cap">{soft !== null && soft > 0 ? <span className="font-mono">{formatNumber(soft)} {UNIT}</span> : <span className="text-muted-foreground">—</span>}</Row>
              <Row label="Hard cap"><span className="text-muted-foreground">None</span></Row>
              <Row label="Price"><span className="text-muted-foreground">Not set</span></Row>
              <Row label="Window"><span className="text-muted-foreground">Not set</span></Row>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              A read-back of what you typed. Price and window are not part of this form, so they are shown as not set rather than guessed.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
