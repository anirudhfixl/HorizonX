"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DRAFT,
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
import { TokenPicker, type SelectedToken } from "@/components/launchpad/token-picker";
import {
  saveSessionLaunch,
  generateSessionLaunchId,
  getDefaultScheduleDates,
  getTodayDateString,
  type SessionPresale,
} from "@/lib/launch-storage";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Info, Wallet } from "lucide-react";

const STEPS: { key: StepKey; label: string; short: string }[] = [
  { key: "token", label: "Token & Metadata", short: "Token selection and launch details" },
  { key: "caps", label: "Rate and caps", short: "Price and fundraising targets" },
  { key: "limits", label: "Limits & Schedule", short: "Wallet limits and sale timeline" },
  { key: "review", label: "Review", short: "Check, then run the simulation" },
];

const UNIT = "ETH";

const CATEGORIES = [
  "DeFi",
  "Infrastructure",
  "AI & Compute",
  "Governance",
  "Security & Privacy",
  "Gaming",
  "Meme & Community",
  "Social",
  "General",
];

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
  type?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function Field({
  field,
  label,
  value,
  error,
  hint,
  suffix,
  placeholder,
  mono = true,
  type = "text",
  onChange,
  onBlur,
}: FieldProps) {
  const id = `pc-${field}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2.5 focus-within:ring-2",
          error
            ? "border-destructive/60 focus-within:ring-destructive/25"
            : "border-border focus-within:border-primary focus-within:ring-primary/25"
        )}
      >
        <input
          id={id}
          type={type}
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
          <div className="h-full rounded-full bg-primary/40" style={{ width: `${pct}%` }} />
          <span
            className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded bg-foreground"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-mono text-muted-foreground">
          <span>0 {UNIT}</span>
          <span>{pct.toFixed(0)}% to soft cap</span>
          <span className="text-foreground">{formatNumber(hard)} {UNIT} (Hard cap)</span>
        </div>
      </div>
    </div>
  );
}

export function CreatePresaleForm() {
  const { isConnected, isUnsupportedNetwork, switchNetwork, isDemoMode, shortAddress, address, walletProvider, balance, network } = useWallet();
  const { openModal } = useModal();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [draft, setDraft] = useState<PresaleDraft>(DEFAULT_DRAFT);
  const [selectedTokenInfo, setSelectedTokenInfo] = useState<SelectedToken | null>(null);
  const [touched, setTouched] = useState<Partial<Record<DraftField, boolean>>>({});
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [done, setDone] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  const checking = false;
  const current = STEPS[step];
  const errors = validateDraft(draft);
  const derived = deriveDraft(draft);
  const catalog = findCatalogToken(draft.tokenAddress, MOCK_TOKENS);

  const stepErrorList = (STEP_FIELDS[current.key as Exclude<StepKey, "review">] || []).filter((f) => touched[f] && errors[f]);
  const shown = (f: DraftField) => (touched[f] ? errors[f] : undefined);

  const set = (f: DraftField) => (v: string) => setDraft((d) => ({ ...d, [f]: v }));
  const blur = (f: DraftField) => () => setTouched((t) => ({ ...t, [f]: true }));

  const handleSelectToken = (token: SelectedToken) => {
    setSelectedTokenInfo(token.address ? token : null);
    setDraft((d) => ({
      ...d,
      tokenAddress: token.address,
      tokenId: token.tokenId,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenDecimals: token.decimals,
      category: token.category || d.category || "DeFi",
      projectId: token.projectId || d.projectId || "",
      title: d.title || (token.name ? `${token.name} Presale` : ""),
    }));
    setTouched((t) => ({ ...t, tokenAddress: true }));
  };

  const focusHeading = () => {
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const goTo = (target: number) => {
    setStep(target);
    focusHeading();
  };

  const goNext = () => {
    const fields = STEP_FIELDS[current.key as Exclude<StepKey, "review">] || [];
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
    const firstBad = (Object.keys(STEP_FIELDS) as (keyof typeof STEP_FIELDS)[]).findIndex((k) =>
      STEP_FIELDS[k].some((f) => errors[f])
    );
    if (firstBad !== -1) {
      setTouched(Object.fromEntries((Object.keys(DEFAULT_DRAFT) as DraftField[]).map((f) => [f, true])));
      goTo(firstBad);
      return;
    }

    // Persist to session storage
    const newId = generateSessionLaunchId("ps");
    const defaultDates = getDefaultScheduleDates();
    const today = getTodayDateString();
    const effectiveTokenName = selectedTokenInfo?.name || catalog?.name || "Token";
    const effectiveSymbol = selectedTokenInfo?.symbol || catalog?.symbol || "TOKEN";
    const effectiveCategory = draft.category || selectedTokenInfo?.category || catalog?.category || "DeFi";

    const sessionRecord: SessionPresale = {
      id: newId,
      kind: "presale",
      title: draft.title?.trim() || `${effectiveTokenName} Presale`,
      description: draft.description?.trim() || `Community presale offering for ${effectiveTokenName} ($${effectiveSymbol}) simulated via ProMiners.`,
      category: effectiveCategory,
      tokenId: selectedTokenInfo?.tokenId || catalog?.id || draft.tokenAddress.toLowerCase(),
      tokenSymbol: effectiveSymbol,
      tokenName: effectiveTokenName,
      tokenAddress: draft.tokenAddress.trim(),
      tokenDecimals: selectedTokenInfo?.decimals ?? catalog?.decimals ?? 18,
      projectId: draft.projectId || selectedTokenInfo?.projectId || catalog?.projectId,
      ownerAddress: address || "0x71C9561E873f324A3B4323E56d3935a8286C4e39",
      status: "scheduled",
      startTime: draft.startTime || defaultDates.startTime,
      endTime: draft.endTime || defaultDates.endTime,
      presaleRate: draft.presaleRate,
      softCap: `${draft.softCap} ETH`,
      hardCap: `${draft.hardCap} ETH`,
      minContribution: `${draft.minContribution} ETH`,
      maxContribution: `${draft.maxContribution} ETH`,
      totalRaised: "0 ETH",
      participantCount: 0,
      network: "Ethereum Sepolia",
      createdAt: today,
      updatedAt: today,
      provenance: "session",
      isSimulated: true,
    };

    saveSessionLaunch(sessionRecord);
    setCreatedSessionId(newId);

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
    setSelectedTokenInfo(null);
    setTouched({});
    setStep(0);
    setMaxStep(0);
    setDone(false);
    setCreatedSessionId(null);
    focusHeading();
  };

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
        <Link href="/launchpad" className="hover:text-foreground">
          Launchpad
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/launchpad/presales" className="hover:text-foreground">
          Presales
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Create</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <Eyebrow>Presale setup</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Create a presale</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Select or enter a token, customize your launch parameters, and review your configuration before running the simulation.
        </p>
        <p className="mt-5 flex gap-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Phase 4 client simulation (D-04).</span> Completing this wizard validates your configuration and records a temporary simulation in browser sessionStorage. No on-chain contracts are deployed and no real funds are moved.
          </span>
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Step rail */}
        <nav aria-label="Presale setup steps" className="lg:sticky lg:top-24 lg:self-start">
          <div className="lg:hidden">
            <p className="text-xs text-muted-foreground">
              Step {done ? STEPS.length : step + 1} of {STEPS.length} ·{" "}
              <span className="text-foreground">{done ? "Complete" : current.label}</span>
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span
                  key={s.key}
                  className={cn(
                    "h-1 rounded-full",
                    done || i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-secondary"
                  )}
                />
              ))}
            </div>
          </div>
          <ol className="hidden lg:block">
            {STEPS.map((s, i) => {
              const state = done || i < step ? "done" : i === step ? "current" : "upcoming";
              const reachable = !done && i <= maxStep && i !== step;
              return (
                <li key={s.key} className="relative pb-7 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      className={cn(
                        "absolute left-[11px] top-7 h-[calc(100%-1.5rem)] w-px",
                        state === "done" ? "bg-primary/60" : "bg-border"
                      )}
                      aria-hidden="true"
                    />
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
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                          reachable && "group-hover:text-primary"
                        )}
                      >
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

        {/* Form body */}
        <form onSubmit={handleSubmit} noValidate className="min-w-0">
          {done ? (
            <section
              aria-labelledby="pc-title"
              className="rounded-2xl bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-8"
            >
              <div className="flex items-center gap-2">
                <StatusBadge status="scheduled" />
                <ProvenanceBadge kind="session" />
              </div>
              <h2
                id="pc-title"
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 text-2xl font-semibold tracking-tight text-foreground focus:outline-none"
              >
                Presale Simulation Recorded
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Your presale simulation was validated and saved to browser <code className="font-mono text-foreground">sessionStorage</code>. It is now discoverable in the Presale Directory and in your personal creator workspace.
              </p>

              <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
                <ReviewRow label="Presale Title">
                  <span className="font-semibold">{draft.title || `${selectedTokenInfo?.name || "Token"} Presale`}</span>
                </ReviewRow>
                <ReviewRow label="Token Contract">
                  <span className="font-mono text-xs">{draft.tokenAddress.trim()}</span>
                </ReviewRow>
                <ReviewRow label="Rate">
                  <span className="font-mono">{draft.presaleRate} tokens per 1 {UNIT}</span>
                </ReviewRow>
                <ReviewRow label="Soft / Hard Cap">
                  <span className="font-mono">{draft.softCap} / {draft.hardCap} {UNIT}</span>
                </ReviewRow>
                <ReviewRow label="Per Wallet">
                  <span className="font-mono">{draft.minContribution} to {draft.maxContribution} {UNIT}</span>
                </ReviewRow>
                {draft.category && (
                  <ReviewRow label="Category">
                    <span>{draft.category}</span>
                  </ReviewRow>
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                {createdSessionId && (
                  <Link
                    href={`/launchpad/presales/${createdSessionId}`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
                  >
                    View Created Presale →
                  </Link>
                )}
                <Link
                  href="/launchpad/my"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary/40 px-4 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Go to My Launches
                </Link>
                <Link
                  href="/launchpad/presales"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Browse All Presales
                </Link>
                <Button type="button" variant="outline" onClick={reset}>
                  Create Another Presale
                </Button>
              </div>
            </section>
          ) : (
            <section aria-labelledby="pc-title">
              <Eyebrow>Step {step + 1} of {STEPS.length}</Eyebrow>
              <h2
                id="pc-title"
                ref={headingRef}
                tabIndex={-1}
                className="mt-1 text-2xl font-semibold tracking-tight text-foreground focus:outline-none"
              >
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
                        <a
                          href={`#pc-${f}`}
                          className="text-destructive hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`pc-${f}`)?.focus();
                          }}
                        >
                          {errors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── 1 · Token & Metadata ─────────────────────────────────── */}
              {current.key === "token" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Select Token to Sell *
                    </label>
                    <TokenPicker
                      value={draft.tokenAddress}
                      onSelectToken={handleSelectToken}
                      error={shown("tokenAddress")}
                    />
                  </div>

                  <div className="border-t border-border/50 pt-5 space-y-4">
                    <div>
                      <label htmlFor="pc-title-input" className="text-sm font-medium text-foreground">
                        Launch Title (Optional)
                      </label>
                      <input
                        id="pc-title-input"
                        type="text"
                        placeholder="e.g. MatrixDAO Community Presale"
                        value={draft.title || ""}
                        onChange={(e) => set("title")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        If omitted, will default to &ldquo;{selectedTokenInfo?.name || "Token"} Presale&rdquo;.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pc-cat-select" className="text-sm font-medium text-foreground">
                          Category
                        </label>
                        <select
                          id="pc-cat-select"
                          value={draft.category || "DeFi"}
                          onChange={(e) => set("category")(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="pc-proj-select" className="text-sm font-medium text-foreground">
                          Linked Ecosystem Project
                        </label>
                        <select
                          id="pc-proj-select"
                          value={draft.projectId || ""}
                          onChange={(e) => set("projectId")(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None / Independent Launch</option>
                          {MOCK_PROJECTS.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                              {proj.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pc-desc-input" className="text-sm font-medium text-foreground">
                        Description (Optional)
                      </label>
                      <textarea
                        id="pc-desc-input"
                        rows={2}
                        placeholder="Brief overview of the presale offering and utility."
                        value={draft.description || ""}
                        onChange={(e) => set("description")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 2 · Rate and Caps ────────────────────────────────────── */}
              {current.key === "caps" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Set the rate (how many whole tokens 1 {UNIT} buys) and the fundraising soft and hard caps.
                  </p>

                  <Field
                    field="presaleRate"
                    label="Presale rate *"
                    value={draft.presaleRate}
                    error={shown("presaleRate")}
                    suffix={`tokens per 1 ${UNIT}`}
                    placeholder="1000"
                    hint="Whole tokens per 1 ETH. Example: 1000."
                    onChange={set("presaleRate")}
                    onBlur={blur("presaleRate")}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field
                      field="softCap"
                      label="Soft cap *"
                      value={draft.softCap}
                      error={shown("softCap")}
                      suffix={UNIT}
                      placeholder="50"
                      hint="Minimum raise target. Example: 50."
                      onChange={set("softCap")}
                      onBlur={blur("softCap")}
                    />
                    <Field
                      field="hardCap"
                      label="Hard cap *"
                      value={draft.hardCap}
                      error={shown("hardCap")}
                      suffix={UNIT}
                      placeholder="150"
                      hint="Maximum fundraising ceiling. Example: 150."
                      onChange={set("hardCap")}
                      onBlur={blur("hardCap")}
                    />
                  </div>

                  <CapLadder draft={draft} />
                </div>
              )}

              {/* ── 3 · Limits & Schedule ────────────────────────────────── */}
              {current.key === "limits" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Set the contribution limits per participating wallet and the scheduled start and end sale window.
                  </p>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field
                      field="minContribution"
                      label="Minimum contribution *"
                      value={draft.minContribution}
                      error={shown("minContribution")}
                      suffix={UNIT}
                      placeholder="0.1"
                      hint="Lowest contribution per wallet."
                      onChange={set("minContribution")}
                      onBlur={blur("minContribution")}
                    />
                    <Field
                      field="maxContribution"
                      label="Maximum contribution *"
                      value={draft.maxContribution}
                      error={shown("maxContribution")}
                      suffix={UNIT}
                      placeholder="3.0"
                      hint="Highest contribution per wallet."
                      onChange={set("maxContribution")}
                      onBlur={blur("maxContribution")}
                    />
                  </div>

                  <div className="border-t border-border/50 pt-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sale Timeline (Optional)
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="pc-start-time" className="text-sm font-medium text-foreground">
                          Start Date & Time (UTC)
                        </label>
                        <input
                          id="pc-start-time"
                          type="datetime-local"
                          value={draft.startTime || ""}
                          onChange={(e) => set("startTime")(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="pc-end-time" className="text-sm font-medium text-foreground">
                          End Date & Time (UTC)
                        </label>
                        <input
                          id="pc-end-time"
                          type="datetime-local"
                          value={draft.endTime || ""}
                          onChange={(e) => set("endTime")(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4 · Review ───────────────────────────────────────────── */}
              {current.key === "review" && (
                <div className="mt-6 max-w-2xl space-y-6">
                  <ReviewGroup title="Token & Launch Metadata" onEdit={() => goTo(0)}>
                    <ReviewRow label="Token">
                      <span className="font-semibold text-foreground">
                        {selectedTokenInfo?.name || catalog?.name || "Custom Token"} (${selectedTokenInfo?.symbol || catalog?.symbol || "TOKEN"})
                      </span>
                    </ReviewRow>
                    <ReviewRow label="Contract Address">
                      <span className="font-mono text-xs">{draft.tokenAddress}</span>
                    </ReviewRow>
                    <ReviewRow label="Category">
                      <span>{draft.category || "DeFi"}</span>
                    </ReviewRow>
                    {draft.projectId && (
                      <ReviewRow label="Parent Project">
                        <span>{MOCK_PROJECTS.find((p) => p.id === draft.projectId)?.name || draft.projectId}</span>
                      </ReviewRow>
                    )}
                  </ReviewGroup>

                  <ReviewGroup title="Rate and Caps" onEdit={() => goTo(1)}>
                    <ReviewRow label="Presale Rate">
                      <span className="font-mono">{draft.presaleRate} tokens per 1 {UNIT}</span>
                    </ReviewRow>
                    <ReviewRow label="Soft Cap">
                      <span className="font-mono">{draft.softCap} {UNIT}</span>
                    </ReviewRow>
                    <ReviewRow label="Hard Cap">
                      <span className="font-mono">{draft.hardCap} {UNIT}</span>
                    </ReviewRow>
                    {derived.tokensAtHardCap && (
                      <ReviewRow label="Tokens at Hard Cap">
                        <span className="font-mono">{formatNumber(derived.tokensAtHardCap)} tokens</span>
                      </ReviewRow>
                    )}
                  </ReviewGroup>

                  <ReviewGroup title="Limits & Schedule" onEdit={() => goTo(2)}>
                    <ReviewRow label="Per Wallet Range">
                      <span className="font-mono">{draft.minContribution} to {draft.maxContribution} {UNIT}</span>
                    </ReviewRow>
                    {draft.startTime && (
                      <ReviewRow label="Start Time">
                        <span>{draft.startTime.replace("T", " ")} UTC</span>
                      </ReviewRow>
                    )}
                    {draft.endTime && (
                      <ReviewRow label="End Time">
                        <span>{draft.endTime.replace("T", " ")} UTC</span>
                      </ReviewRow>
                    )}
                  </ReviewGroup>

                  <div className="border-t border-border/60 pt-5 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connected Wallet</p>
                    <div className="mt-2">
                      {isConnected ? (
                        <div className="flex items-start gap-2.5">
                          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="font-mono text-foreground">{shortAddress}</p>
                            <p className="text-xs text-muted-foreground">
                              {isDemoMode ? "Demo sandbox · simulated wallet" : walletProvider ?? "Connected wallet"}
                              {!isUnsupportedNetwork && (
                                <> · <span className="font-mono">{balance} {network.symbol}</span> on {network.name}</>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No wallet connected. You will be prompted to connect before saving.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
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
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
