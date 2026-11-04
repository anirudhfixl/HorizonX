import "@/components/launchpad/launchpad.css";
import { LaunchpadWorkspaceHeader } from "@/components/launchpad/launchpad-section-nav";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { TOKENS, PROJECTS } from "@/data";
import { cn } from "@/lib/utils";
import { findCatalogToken, formatNumber, parseNumber } from "@/lib/presale-create";
import {
  DEFAULT_FL_DRAFT,
  FL_SIMULATION_DESCRIPTION,
  FL_SIMULATION_TITLE,
  FL_STEP_FIELDS,
  compareToSupply,
  validateFairLaunch,
  type FairLaunchDraft,
  type FlField,
  type FlStepKey,
} from "@/lib/fair-launch-create";
import { TokenPicker, type SelectedToken } from "@/components/launchpad/token-picker";
import {
  saveSessionLaunch,
  generateSessionLaunchId,
  getDefaultScheduleDates,
  getTodayDateString,
  type SessionFairLaunch,
} from "@/lib/launch-storage";
import { AlertCircle, ArrowLeft, ArrowRight, Info, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS: { key: FlStepKey; label: string; short: string }[] = [
  { key: "token", label: "Token & Metadata", short: "Token selection and project details" },
  { key: "offering", label: "Supply, Soft Cap & Limits", short: "Offering amount, target, and limits" },
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
          error
            ? "border-destructive/60 focus-within:ring-destructive/25"
            : "border-border focus-within:border-primary focus-within:ring-primary/25"
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

function OpenEndedDiagram() {
  return (
    <figure>
      <div className="relative mt-6 h-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-4 h-2.5 rounded-full bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
        <span className="absolute top-2 h-6 w-0.5 rounded bg-foreground/70" style={{ left: "45%" }} />
        <span className="absolute -top-3 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted-foreground" style={{ left: "45%" }}>
          Soft cap (dynamic raise)
        </span>
        <span className="absolute right-0 top-[7px] text-primary">→</span>
      </div>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Fair launches have no hard cap: contributions can pass the soft cap. The final token allocation is distributed proportionally to all participants.
      </figcaption>
    </figure>
  );
}

export function CreateFairLaunchForm() {
  const { isConnected, isUnsupportedNetwork, switchNetwork, isDemoMode, shortAddress, address, walletProvider, balance, network } = useWallet();
  const { openModal } = useModal();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [draft, setDraft] = useState<FairLaunchDraft>(DEFAULT_FL_DRAFT);
  const [selectedTokenInfo, setSelectedTokenInfo] = useState<SelectedToken | null>(null);
  const [touched, setTouched] = useState<Partial<Record<FlField, boolean>>>({});
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [done, setDone] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  const checking = false;
  const current = STEPS[step];
  const errors = validateFairLaunch(draft);
  const catalog = findCatalogToken(draft.tokenAddress, TOKENS);
  const supplyComparison = compareToSupply(draft.totalSelling, selectedTokenInfo?.totalSupply ? { totalSupply: selectedTokenInfo.totalSupply } : catalog);

  const stepErrorList = (FL_STEP_FIELDS[current.key as Exclude<FlStepKey, "review">] || []).filter((f) => touched[f] && errors[f]);
  const shown = (f: FlField) => (touched[f] ? errors[f] : undefined);

  const set = (f: FlField) => (v: string) => setDraft((d) => ({ ...d, [f]: v }));
  const blur = (f: FlField) => () => setTouched((t) => ({ ...t, [f]: true }));

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
      title: d.title || (token.name ? `${token.name} Community Fair Launch` : ""),
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
    const fields = FL_STEP_FIELDS[current.key as Exclude<FlStepKey, "review">] || [];
    const bad = fields.filter((f) => errors[f]);
    if (bad.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
      requestAnimationFrame(() => document.getElementById(`fl-${bad[0]}`)?.focus());
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
    const firstBad = (Object.keys(FL_STEP_FIELDS) as (keyof typeof FL_STEP_FIELDS)[]).findIndex((k) =>
      FL_STEP_FIELDS[k].some((f) => errors[f])
    );
    if (firstBad !== -1) {
      setTouched(Object.fromEntries((Object.keys(DEFAULT_FL_DRAFT) as FlField[]).map((f) => [f, true])));
      goTo(firstBad);
      return;
    }

    // Persist to session storage
    const newId = generateSessionLaunchId("fl");
    const defaultDates = getDefaultScheduleDates();
    const today = getTodayDateString();
    const effectiveTokenName = selectedTokenInfo?.name || catalog?.name || "Token";
    const effectiveSymbol = selectedTokenInfo?.symbol || catalog?.symbol || "TOKEN";
    const effectiveCategory = draft.category || selectedTokenInfo?.category || catalog?.category || "DeFi";

    const sessionRecord: SessionFairLaunch = {
      id: newId,
      kind: "fair",
      title: draft.title?.trim() || `${effectiveTokenName} Fair Launch`,
      description: draft.description?.trim() || `Fair launch offering for ${effectiveTokenName} ($${effectiveSymbol}) simulated via HorizonX.`,
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
      totalSelling: `${formatNumber(parseNumber(draft.totalSelling) || 5000000)} ${effectiveSymbol}`,
      softCap: `${draft.softCap} ETH`,
      minContribution: draft.minContribution ? `${draft.minContribution} ETH` : undefined,
      maxContribution: draft.maxContribution ? `${draft.maxContribution} ETH` : undefined,
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
      Run fair launch simulation
    </Button>
  );

  return (
    <div className="launchpad-page mx-auto w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
      <LaunchpadWorkspaceHeader items={[{ label: "Launchpad", to: "/launchpad" }, { label: "Fair launches", to: "/launchpad/launches" }, { label: "Create fair launch" }]} />

      <header className="mt-6 max-w-3xl">
        <Eyebrow>Fair launch setup</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Create a fair launch</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Select or enter a token, designate the total tokens for sale, and set the minimum fundraising soft cap. A fair launch has no hard cap.
        </p>
        <p className="mt-5 flex gap-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Phase 4 client simulation (D-04).</span> Completing this wizard validates your setup and persists a temporary simulation record to browser sessionStorage. No on-chain contracts are deployed and no real funds are moved.
          </span>
        </p>
      </header>

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
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-colors",
                    state === "current"
                      ? "border-primary bg-primary/[0.04] ring-1 ring-primary/20"
                      : state === "done"
                      ? "border-primary/40 bg-card"
                      : "border-border bg-card/60 opacity-60"
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{s.label}</p>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        {done ? (
          <section className="rounded-2xl bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-border/70 sm:p-8">
            <div className="flex items-center gap-2">
              <StatusBadge status="scheduled" />
              <ProvenanceBadge kind="session" />
            </div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 text-2xl font-semibold tracking-tight text-foreground focus:outline-none"
            >
              Fair Launch Simulation Recorded
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Your fair launch configuration was validated and saved to browser <code className="font-mono text-foreground">sessionStorage</code>. It is now discoverable in the Fair Launch Directory and your personal creator workspace.
            </p>

            <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
              <Row label="Launch Title">
                <span className="font-semibold">{draft.title || `${selectedTokenInfo?.name || "Token"} Fair Launch`}</span>
              </Row>
              <Row label="Token Contract">
                <span className="font-mono text-xs">{draft.tokenAddress.trim()}</span>
              </Row>
              <Row label="Total for Sale">
                <span className="font-mono">{formatNumber(parseNumber(draft.totalSelling) || 0)} tokens</span>
              </Row>
              <Row label="Soft Cap">
                <span className="font-mono">{draft.softCap} {UNIT} (Uncapped raise)</span>
              </Row>
              {draft.category && (
                <Row label="Category">
                  <span>{draft.category}</span>
                </Row>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              {createdSessionId && (
                <Link
                  to={`/launchpad/launches/${createdSessionId}`}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  View Created Fair Launch →
                </Link>
              )}
              <Link
                to="/launchpad/my"
                className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary/40 px-4 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Go to My Launches
              </Link>
              <Link
                to="/launchpad/launches"
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Browse All Fair Launches
              </Link>
              <Button type="button" variant="outline" onClick={reset}>
                Create Another Fair Launch
              </Button>
            </div>
          </section>
        ) : (
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
            {stepErrorList.length > 0 && (
              <div role="alert" className="mb-6 border-l-2 border-destructive pl-3 text-sm">
                <p className="font-medium text-foreground">
                  Fix {stepErrorList.length === 1 ? "1 field" : `${stepErrorList.length} fields`} to continue
                </p>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  {stepErrorList.map((f) => (
                    <li key={f}>
                      <a
                        href={`#fl-${f}`}
                        className="text-destructive hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`fl-${f}`)?.focus();
                        }}
                      >
                        {errors[f]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Step 1: Token & Metadata ──────────────────────────────── */}
            {current.key === "token" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Select Token to Offer *
                  </label>
                  <TokenPicker
                    value={draft.tokenAddress}
                    onSelectToken={handleSelectToken}
                    error={shown("tokenAddress")}
                  />
                </div>

                <div className="border-t border-border/50 pt-5 space-y-4">
                  <div>
                    <label htmlFor="fl-title-input" className="text-sm font-medium text-foreground">
                      Launch Title (Optional)
                    </label>
                    <input
                      id="fl-title-input"
                      type="text"
                      placeholder="e.g. MatrixDAO Community Fair Launch"
                      value={draft.title || ""}
                      onChange={(e) => set("title")(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      If omitted, will default to &ldquo;{selectedTokenInfo?.name || "Token"} Fair Launch&rdquo;.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fl-cat-select" className="text-sm font-medium text-foreground">
                        Category
                      </label>
                      <select
                        id="fl-cat-select"
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
                      <label htmlFor="fl-proj-select" className="text-sm font-medium text-foreground">
                        Linked Ecosystem Project
                      </label>
                      <select
                        id="fl-proj-select"
                        value={draft.projectId || ""}
                        onChange={(e) => set("projectId")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">None / Independent Launch</option>
                        {PROJECTS.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fl-desc-input" className="text-sm font-medium text-foreground">
                      Description (Optional)
                    </label>
                    <textarea
                      id="fl-desc-input"
                      rows={2}
                      placeholder="Brief overview of the fair launch offering and token allocation."
                      value={draft.description || ""}
                      onChange={(e) => set("description")(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Supply, Soft Cap & Limits ────────────────────────── */}
            {current.key === "offering" && (
              <div className="max-w-2xl space-y-6">
                <Field
                  field="totalSelling"
                  label="Tokens offered for sale *"
                  value={draft.totalSelling}
                  error={shown("totalSelling")}
                  placeholder="5000000"
                  hint="The total number of tokens to be distributed across all contributions."
                  onChange={set("totalSelling")}
                  onBlur={blur("totalSelling")}
                />

                {supplyComparison && (
                  <div className="rounded-lg border border-border/80 bg-secondary/20 p-3 text-xs text-muted-foreground">
                    <p>
                      This offering represents{" "}
                      <span className="font-semibold text-foreground">{supplyComparison.sharePct.toFixed(1)}%</span> of the
                      recorded total supply ({formatNumber(supplyComparison.supply)} tokens).
                    </p>
                    {supplyComparison.exceeds && (
                      <p className="mt-1 text-destructive font-medium">
                        Warning: Amount offered exceeds the token&apos;s total recorded supply.
                      </p>
                    )}
                  </div>
                )}

                <Field
                  field="softCap"
                  label="Soft cap *"
                  value={draft.softCap}
                  error={shown("softCap")}
                  suffix={UNIT}
                  placeholder="20"
                  hint="The minimum amount that must be raised for the launch to succeed."
                  onChange={set("softCap")}
                  onBlur={blur("softCap")}
                />

                <div className="border-t border-border/50 pt-5 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contribution Limits & Schedule (Optional)
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fl-min-contrib" className="text-sm font-medium text-foreground">
                        Min Contribution ({UNIT})
                      </label>
                      <input
                        id="fl-min-contrib"
                        type="text"
                        placeholder="e.g. 0.05"
                        value={draft.minContribution || ""}
                        onChange={(e) => set("minContribution")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="fl-max-contrib" className="text-sm font-medium text-foreground">
                        Max Contribution ({UNIT})
                      </label>
                      <input
                        id="fl-max-contrib"
                        type="text"
                        placeholder="e.g. 5.0"
                        value={draft.maxContribution || ""}
                        onChange={(e) => set("maxContribution")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fl-start-time" className="text-sm font-medium text-foreground">
                        Start Time (UTC)
                      </label>
                      <input
                        id="fl-start-time"
                        type="datetime-local"
                        value={draft.startTime || ""}
                        onChange={(e) => set("startTime")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="fl-end-time" className="text-sm font-medium text-foreground">
                        End Time (UTC)
                      </label>
                      <input
                        id="fl-end-time"
                        type="datetime-local"
                        value={draft.endTime || ""}
                        onChange={(e) => set("endTime")(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <OpenEndedDiagram />
              </div>
            )}

            {/* ── Step 3: Review ────────────────────────────────────────── */}
            {current.key === "review" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Token & Offering</h3>
                  <dl className="mt-2 divide-y divide-border/60 border-y border-border/60">
                    <Row label="Token">
                      <span className="font-semibold text-foreground">
                        {selectedTokenInfo?.name || catalog?.name || "Custom Token"} (${selectedTokenInfo?.symbol || catalog?.symbol || "TOKEN"})
                      </span>
                    </Row>
                    <Row label="Contract Address">
                      <span className="font-mono text-xs">{draft.tokenAddress}</span>
                    </Row>
                    <Row label="Category">
                      <span>{draft.category || "DeFi"}</span>
                    </Row>
                    <Row label="Total Selling">
                      <span className="font-mono">{formatNumber(parseNumber(draft.totalSelling) || 0)} tokens</span>
                    </Row>
                    <Row label="Soft Cap">
                      <span className="font-mono">{draft.softCap} {UNIT} (No Hard Cap)</span>
                    </Row>
                    {draft.minContribution && (
                      <Row label="Min Contribution">
                        <span className="font-mono">{draft.minContribution} {UNIT}</span>
                      </Row>
                    )}
                    {draft.maxContribution && (
                      <Row label="Max Contribution">
                        <span className="font-mono">{draft.maxContribution} {UNIT}</span>
                      </Row>
                    )}
                  </dl>
                </div>

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

            {/* Actions */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} className="gap-2 self-start">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </Button>
              ) : (
                <Link to="/launchpad/launches" className="text-sm text-muted-foreground hover:text-foreground">
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
          </div>
        )}
      </form>
    </div>
  );
}
