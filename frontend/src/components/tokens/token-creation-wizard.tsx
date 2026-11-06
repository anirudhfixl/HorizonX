import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TOKEN_CATEGORIES } from "@/data";
export { TOKEN_CATEGORIES } from "@/data";
import { TokenCreationGlobeLayout } from "@/components/tokens/token-creation-globe-layout";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { useProjects } from "@/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  FileCode2,
  Copy,
  Check,
  Wallet,
  Flame,
  Layers,
  Fuel,
  Info,
  CheckCircle,
  RotateCcw,
  TriangleAlert,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateIllustrativeContractSource } from "./wizard/contract-template";

export type SimulationStage =
  | "idle"
  | "validating"
  | "generating"
  | "preparing"
  | "submitting"
  | "confirming"
  | "completed";

export interface SimulatedTokenReceipt {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  totalSupplyBaseUnits: string;
  category: string;
  description: string;
  network: string;
  chainId: number;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  creatorAddress: string;
  features: string[];
  deployedAt: string;
}

export function calculateBaseUnits(supplyStr: string, decimalsNum: number): {
  isValid: boolean;
  rawSupply: bigint;
  baseUnits: bigint;
  formattedBaseUnits: string;
  error?: string;
} {
  try {
    const cleanStr = supplyStr.replace(/[^0-9]/g, "");
    if (!cleanStr || cleanStr === "0") {
      return { isValid: false, rawSupply: BigInt(0), baseUnits: BigInt(0), formattedBaseUnits: "0", error: "Supply must be greater than zero" };
    }
    const rawSupply = BigInt(cleanStr);
    const maxSafeSupply = BigInt("10000000000000000");
    if (rawSupply > maxSafeSupply) {
      return { isValid: false, rawSupply: BigInt(0), baseUnits: BigInt(0), formattedBaseUnits: "0", error: "Supply exceeds safe maximum limit" };
    }
    const dec = BigInt(decimalsNum);
    const baseUnits = rawSupply * (BigInt(10) ** dec);
    return {
      isValid: true,
      rawSupply,
      baseUnits,
      formattedBaseUnits: baseUnits.toString(),
    };
  } catch {
    return { isValid: false, rawSupply: BigInt(0), baseUnits: BigInt(0), formattedBaseUnits: "0", error: "Invalid supply format" };
  }
}

export { generateIllustrativeContractSource };

export function generateDeterministicAddress(name: string, symbol: string): string {
  let hash = 0;
  const input = `${name.toLowerCase()}:${symbol.toLowerCase()}:sepolia:11155111`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}71b2691e9b24ee945c35d5d8c9a7d1a2b3c4d5e6`.slice(0, 42);
}

export function generateDeterministicTxHash(name: string, symbol: string): string {
  let hash = 0;
  const input = `tx:${name}:${symbol}:11155111:${Date.now()}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 7) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, "0");
  return `0x${hex}4b7c9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d`.slice(0, 66);
}

const WIZARD_STEPS = [
  { num: 1, label: "Identity", full: "Identity & Category" },
  { num: 2, label: "Supply", full: "Supply & Network" },
  { num: 3, label: "Extensions", full: "Extensions (Illustrative)" },
  { num: 4, label: "Review", full: "Review & Simulation" },
] as const;

const SIMULATION_STAGES: { key: SimulationStage; label: string; detail: string }[] = [
  { key: "validating", label: "Validate", detail: "Simulating parameter & schema validation..." },
  { key: "generating", label: "Generate source", detail: "Generating illustrative Solidity source template..." },
  { key: "preparing", label: "Prepare", detail: "Preparing simulated authorization payload..." },
  { key: "submitting", label: "Submit", detail: "Simulating deployment transaction submission..." },
  { key: "confirming", label: "Confirm", detail: "Simulating testnet block inclusion..." },
];

const STAGE_PROGRESS: Record<string, string> = {
  validating: "20%",
  generating: "40%",
  preparing: "60%",
  submitting: "80%",
  confirming: "95%",
};

const fieldCls =
  "w-full rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors hover:border-foreground/25 " +
  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 " +
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20";

function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: string | null;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-primary" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-xs text-destructive">
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FeatureToggle({
  id,
  icon,
  title,
  description,
  warning,
  checked,
  onChange,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  warning?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="group flex cursor-pointer items-start gap-4 py-5 first:pt-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Proposed D-05
          </span>
        </span>
        <span className="block text-sm leading-relaxed text-muted-foreground">{description}</span>
        {warning && (
          <span className="flex items-start gap-1.5 text-xs font-medium text-amber-500">
            <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
            {warning}
          </span>
        )}
      </span>
      <span className="relative mt-1 inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-6 w-11 rounded-full bg-secondary ring-1 ring-inset ring-border transition-colors",
            "peer-checked:bg-primary peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/60",
            "after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-foreground/80 after:transition-transform after:content-['']",
            "peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"
          )}
        />
      </span>
    </label>
  );
}

function SpecRow({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={cn("min-w-0 break-all text-right text-foreground", mono && "font-mono text-xs")}>{children}</dd>
    </div>
  );
}

function EditLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1 rounded text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <Pencil className="h-3 w-3" /> Edit
    </button>
  );
}

export function TokenCreationWizard() {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();
  const { data: PROJECTS = [] } = useProjects();

  const [step, setStep] = useState(1);
  const [simulationStage, setSimulationStage] = useState<SimulationStage>("idle");
  const [receipt, setReceipt] = useState<SimulatedTokenReceipt | null>(null);

  // Form State
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [category, setCategory] = useState(TOKEN_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState("10,000,000");

  // Proposed Feature Toggles (Pending D-05 / D-06)
  const [isBurnable, setIsBurnable] = useState(true);
  const [isMintable, setIsMintable] = useState(false);
  const [isPausable, setIsPausable] = useState(false);
  const [isPermit, setIsPermit] = useState(true);

  // UI State
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  // Presentation only: inline errors appear after a failed "Next" attempt.
  const [showErrors, setShowErrors] = useState(false);

  const fallbackDemoAddress = "0x71C9...4E39";
  const creatorAddress = isConnected && userAddress ? userAddress : fallbackDemoAddress;

  const baseUnitsResult = calculateBaseUnits(totalSupply, decimals);

  // Same rules as the original toast validation, exposed for inline display.
  const nameError = !tokenName.trim() ? "Enter a token name." : null;
  const symbolTrimmed = tokenSymbol.trim();
  const symbolError = !symbolTrimmed
    ? "Enter a ticker symbol."
    : symbolTrimmed.length < 2 || symbolTrimmed.length > 8
    ? "Symbol must be between 2 and 8 characters."
    : null;
  const supplyHasDigits = /[0-9]/.test(totalSupply);
  const supplyError = baseUnitsResult.isValid
    ? null
    : baseUnitsResult.error || "Please enter a valid total supply";
  // Out-of-range supply is flagged live; an empty/zero supply only after an attempt.
  const supplyErrorVisible = !!supplyError && (showErrors || (supplyHasDigits && totalSupply.replace(/[^0-9]/g, "") !== "0"));

  const focusField = (id: string) => {
    if (typeof document !== "undefined") {
      document.getElementById(id)?.focus();
    }
  };

  const goTo = (n: number) => {
    setShowErrors(false);
    setStep(n);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!tokenName.trim()) {
        toast.error("Please provide a token name");
        setShowErrors(true);
        focusField("tc-name");
        return;
      }
      if (!tokenSymbol.trim()) {
        toast.error("Please provide a ticker symbol");
        setShowErrors(true);
        focusField("tc-symbol");
        return;
      }
      if (tokenSymbol.trim().length < 2 || tokenSymbol.trim().length > 8) {
        toast.error("Symbol must be between 2 and 8 characters");
        setShowErrors(true);
        focusField("tc-symbol");
        return;
      }
    }
    if (step === 2) {
      if (!baseUnitsResult.isValid) {
        toast.error(baseUnitsResult.error || "Please enter a valid total supply");
        setShowErrors(true);
        focusField("tc-supply");
        return;
      }
    }
    setShowErrors(false);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleCopy = async (text: string, type: "code" | "address") => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard is not available in this browser");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      toast.error("Could not copy to the clipboard");
      return;
    }
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // 6-Stage Pure Simulation Workflow
  const handleLaunchSimulation = () => {
    setSimulationStage("validating");

    setTimeout(() => {
      setSimulationStage("generating");
      setTimeout(() => {
        setSimulationStage("preparing");
        setTimeout(() => {
          setSimulationStage("submitting");
          setTimeout(() => {
            setSimulationStage("confirming");
            setTimeout(() => {
              const contractAddr = generateDeterministicAddress(tokenName, tokenSymbol);
              const txHash = generateDeterministicTxHash(tokenName, tokenSymbol);
              const featuresList = [
                isBurnable && "Burnable (ERC20Burnable)",
                isMintable && "Mintable (Ownable)",
                isPausable && "Pausable (ERC20Pausable)",
                isPermit && "Permit (ERC20Permit)",
              ].filter(Boolean) as string[];

              const newReceipt: SimulatedTokenReceipt = {
                name: tokenName.trim() || "Nexus Protocol",
                symbol: tokenSymbol.trim().toUpperCase() || "NXS",
                decimals,
                totalSupply,
                totalSupplyBaseUnits: baseUnitsResult.formattedBaseUnits,
                category,
                description: description.trim() || "Ecosystem asset deployed via HorizonX simulation wizard.",
                network: "Ethereum Sepolia",
                chainId: 11155111,
                contractAddress: contractAddr,
                transactionHash: txHash,
                blockNumber: 6813200 + Math.floor(Math.random() * 50),
                creatorAddress,
                features: featuresList.length > 0 ? featuresList : ["Standard ERC-20"],
                deployedAt: new Date().toISOString().split("T")[0],
              };

              setReceipt(newReceipt);
              if (typeof window !== "undefined") {
                try {
                  const stored = JSON.parse(sessionStorage.getItem("prominers_session_tokens") || "[]");
                  const updated = [
                    newReceipt,
                    ...stored.filter((s: { contractAddress: string }) => s.contractAddress !== newReceipt.contractAddress),
                  ];
                  sessionStorage.setItem("prominers_session_tokens", JSON.stringify(updated));
                } catch {
                  // ignore
                }
              }
              setSimulationStage("completed");
              toast.success("Simulation Complete", {
                description: `Simulated deployment receipt generated for ${newReceipt.name} ($${newReceipt.symbol}).`,
              });
            }, 800);
          }, 800);
        }, 800);
      }, 700);
    }, 700);
  };

  const handleReset = () => {
    setSimulationStage("idle");
    setReceipt(null);
    setStep(1);
    setShowErrors(false);
    setTokenName("");
    setTokenSymbol("");
    setDescription("");
    setTotalSupply("10,000,000");
  };

  const illustrativeSource = generateIllustrativeContractSource(
    tokenName || "SampleToken",
    tokenSymbol || "SMPL",
    decimals,
    isBurnable,
    isMintable,
    isPausable,
    isPermit
  );

  const featureNames = [
    isBurnable && "Burnable",
    isMintable && "Mintable",
    isPausable && "Pausable",
    isPermit && "Permit",
  ].filter(Boolean) as string[];
  const featureSummary = featureNames.join(", ") || "Standard ERC-20";
  const linkedProject = PROJECTS.find((p) => p.id === projectId);
  const stageIndex = SIMULATION_STAGES.findIndex((s) => s.key === simulationStage);
  const isIdle = simulationStage === "idle";
  const currentStep = WIZARD_STEPS[step - 1];

  return (
    <section id="create-token-wizard" aria-labelledby="create-token-title" className="mx-auto w-full max-w-none scroll-mt-28 py-4 sm:py-5">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 id="create-token-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Token Creation &amp; Deployment Simulation
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Configure your ERC-20 specification, inspect OpenZeppelin source templates, and simulate deployment on
            Ethereum Sepolia.
          </p>
        </div>
        <div className="shrink-0">
          {isConnected ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary/10 px-3 font-mono text-xs text-primary">
              <Wallet className="h-3.5 w-3.5" />
              <span>
                {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </span>
            </span>
          ) : (
            <Button variant="outline" size="lg" className="h-9 gap-1.5 text-xs" onClick={() => openModal("CONNECT_WALLET")}>
              <Wallet className="h-3.5 w-3.5 text-primary" />
              Connect Wallet
            </Button>
          )}
        </div>
      </header>

      {/* Stepper */}
      {isIdle && (
        <nav
          id="token-wizard-steps"
          aria-label="Token creation steps"
          className="mt-4 scroll-mt-28"
        >
          <ol className="grid grid-cols-4 gap-2 sm:gap-4">
            {WIZARD_STEPS.map((s) => {
              const done = step > s.num;
              const active = step === s.num;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => goTo(s.num)}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "group flex w-full flex-col gap-2 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      done ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1 w-full rounded-full transition-colors",
                        done || active ? "bg-primary" : "bg-border"
                      )}
                    />
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                          done
                            ? "bg-primary text-primary-foreground"
                            : active
                            ? "bg-primary/20 text-primary ring-1 ring-primary"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {done ? <Check className="h-3 w-3" /> : s.num}
                      </span>
                      <span
                        className={cn(
                          "hidden truncate text-xs font-medium sm:inline",
                          active ? "text-foreground" : done ? "text-foreground/80 group-hover:text-foreground" : "text-muted-foreground/70"
                        )}
                      >
                        {s.full}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground sm:hidden">
            Step {step} of 4 · <span className="font-medium text-foreground">{currentStep.full}</span>
          </p>
        </nav>
      )}

      <div className="mt-0 w-full">
        <TokenCreationGlobeLayout>
          <div className="min-w-0">
          {/* ===================== STEP 1: IDENTITY ===================== */}
          {isIdle && step === 1 && (
            <div className="space-y-5">
              <div className="mb-1 border-b border-border/60 pb-4 text-center">
                <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Token identity &amp; classification
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Define the public name, ticker symbol, catalog category, and ecosystem association for your asset.
                </p>
              </div>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field
                  id="tc-name"
                  label="Token name"
                  required
                  hint="Public asset name, up to 32 characters."
                  error={showErrors ? nameError : null}
                >
                  <input
                    id="tc-name"
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g. Quantum Protocol"
                    maxLength={32}
                    autoComplete="off"
                    aria-invalid={showErrors && !!nameError}
                    aria-describedby={showErrors && nameError ? "tc-name-error" : "tc-name-hint"}
                    className={fieldCls}
                  />
                </Field>

                <Field
                  id="tc-symbol"
                  label="Token symbol (ticker)"
                  required
                  hint="Uppercase letters and digits, 2–8 characters."
                  error={showErrors ? symbolError : null}
                  aside={<span className="font-mono text-xs text-muted-foreground">{tokenSymbol.length}/8</span>}
                >
                  <input
                    id="tc-symbol"
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="e.g. QNTM"
                    maxLength={8}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-invalid={showErrors && !!symbolError}
                    aria-describedby={showErrors && symbolError ? "tc-symbol-error" : "tc-symbol-hint"}
                    className={cn(fieldCls, "font-mono uppercase")}
                  />
                </Field>

                <Field id="tc-category" label="Catalog category">
                  <select
                    id="tc-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={fieldCls}
                  >
                    {TOKEN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-popover text-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="tc-project" label="Ecosystem project link" optional>
                  <select
                    id="tc-project"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className={fieldCls}
                  >
                    <option value="" className="bg-popover text-foreground">
                      None (Standalone Community Asset)
                    </option>
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-popover text-foreground">
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    id="tc-description"
                    label="Asset purpose & description"
                    optional
                    aside={<span className="font-mono text-xs text-muted-foreground">{description.length}/250</span>}
                  >
                    <textarea
                      id="tc-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe protocol governance, staking utility, or compute subsidies..."
                      rows={4}
                      maxLength={250}
                      className={cn(fieldCls, "resize-none")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ===================== STEP 2: SUPPLY & NETWORK ===================== */}
          {isIdle && step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Supply &amp; network</h3>
                <p className="text-sm text-muted-foreground">
                  Set initial mint volume and verify deployment parameters on Ethereum Sepolia.
                </p>
              </div>

              {/* Network — single supported option, shown as fact, not a choice */}
              <div className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">Target blockchain network</span>
                <div className="flex items-center justify-between gap-4 border-y border-border/60 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">Ethereum Sepolia Testnet</div>
                      <div className="font-mono text-xs text-muted-foreground">Chain ID: 11155111 • Standard EVM Cancun</div>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                    D-04 Standard
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Multi-chain wallet deployments remain pending architecture decision D-04.
                </p>
              </div>

              <div className="space-y-1.5">
                <span id="tc-decimals-label" className="text-sm font-medium text-foreground">
                  Decimals precision
                </span>
                <div role="group" aria-labelledby="tc-decimals-label" className="grid grid-cols-3 gap-2">
                  {[18, 6, 9].map((dec) => (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => setDecimals(dec)}
                      aria-pressed={decimals === dec}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        decimals === dec
                          ? "border-primary bg-primary/12 text-primary"
                          : "border-border bg-secondary/40 text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                      )}
                    >
                      <span className="font-mono">{dec}</span>
                      <span className="ml-1.5 text-xs font-normal opacity-80">{dec === 18 ? "Standard" : "Decimals"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Field
                  id="tc-supply"
                  label="Initial total supply"
                  required
                  hint="Whole tokens. Non-digit characters (commas, spaces, decimal points) are ignored."
                  error={supplyErrorVisible ? supplyError : null}
                >
                  <input
                    id="tc-supply"
                    type="text"
                    inputMode="numeric"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    placeholder="e.g. 100,000,000"
                    autoComplete="off"
                    aria-invalid={supplyErrorVisible}
                    aria-describedby={supplyErrorVisible ? "tc-supply-error" : "tc-supply-hint"}
                    className={cn(fieldCls, "font-mono")}
                  />
                </Field>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Supply presets">
                  {["1,000,000", "10,000,000", "100,000,000", "1,000,000,000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalSupply(preset)}
                      aria-pressed={totalSupply === preset}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        totalSupply === preset
                          ? "border-primary bg-primary/12 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Computed readout */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Fuel className="h-4 w-4 text-primary" />
                  Base units &amp; illustrative cost assumptions
                </h4>
                <dl className="mt-2 divide-y divide-border/50 border-y border-border/50">
                  <SpecRow label="Human supply" mono>
                    {totalSupply}
                  </SpecRow>
                  <SpecRow label="Decimals multiplier" mono>
                    10^{decimals}
                  </SpecRow>
                  <SpecRow label="Calculated base units" mono>
                    {baseUnitsResult.isValid ? baseUnitsResult.formattedBaseUnits : "Invalid"}
                  </SpecRow>
                  <SpecRow label="Illustrative deployment gas">
                    <span className="font-mono text-xs text-primary">~1,842,500 gas (~0.0036 ETH)</span>
                  </SpecRow>
                </dl>
                <p className="mt-2 text-xs italic text-muted-foreground">
                  Note: Gas figures are illustrative deployment assumptions, not live network estimates.
                </p>
              </div>

              {/* Recipient wallet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Wallet className="h-4 w-4 text-primary" />
                    Recipient &amp; owner wallet
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? "Connected Web3 Wallet" : "Simulated Demo Identity"}
                  </span>
                </div>
                <code className="block break-all rounded-lg bg-secondary/60 px-3.5 py-2.5 font-mono text-xs text-foreground">
                  {creatorAddress}
                </code>
                {!isConnected && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-amber-500">Disconnected: Demo address used for simulation</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal("CONNECT_WALLET")}
                      className="h-7 text-xs"
                    >
                      Connect Real Wallet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== STEP 3: EXTENSIONS ===================== */}
          {isIdle && step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Contract extensions</h3>
                <p className="text-sm text-muted-foreground">
                  Explore proposed OpenZeppelin extension features. Formal token feature specifications remain pending
                  Architecture Decision D-05 and D-06; selections only change the illustrative source preview and the
                  simulated receipt.
                </p>
              </div>

              <div className="divide-y divide-border/50">
                <FeatureToggle
                  id="tc-burnable"
                  icon={<Flame className="h-4 w-4" />}
                  title="Burnable (ERC20Burnable)"
                  description="Allows token holders to irreversibly destroy tokens from their personal balance, reducing total circulating supply."
                  checked={isBurnable}
                  onChange={setIsBurnable}
                />
                <FeatureToggle
                  id="tc-mintable"
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Mintable (Ownable)"
                  description="Enables authorized contract owner to issue new tokens post-deployment."
                  warning="Inflation risk: uncapped minting authority introduces supply dilution risk without multi-sig timelock governance."
                  checked={isMintable}
                  onChange={setIsMintable}
                />
                <FeatureToggle
                  id="tc-pausable"
                  icon={<Shield className="h-4 w-4" />}
                  title="Pausable (ERC20Pausable)"
                  description="Grants designated contract authority the ability to temporarily freeze all token transfers during an emergency."
                  warning="Centralization notice: freezing capability grants administrative authority over user funds and must be disclosed."
                  checked={isPausable}
                  onChange={setIsPausable}
                />
                <FeatureToggle
                  id="tc-permit"
                  icon={<Layers className="h-4 w-4" />}
                  title="Permit (EIP-2612)"
                  description="Enables gasless token approvals through cryptographically signed typed signatures (EIP-712)."
                  checked={isPermit}
                  onChange={setIsPermit}
                />
              </div>

              {/* Live source preview */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowCodePreview(!showCodePreview)}
                  aria-expanded={showCodePreview}
                  aria-controls="tc-source-preview"
                  className="gap-2 text-xs"
                >
                  <FileCode2 className="h-3.5 w-3.5 text-primary" />
                  {showCodePreview ? "Hide Solidity Preview" : "View Live Solidity Source Preview"}
                </Button>

                {showCodePreview && (
                  <div id="tc-source-preview" className="mt-4 overflow-hidden rounded-xl bg-black/70 ring-1 ring-border">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
                      <span className="truncate font-mono">contracts/preview/{tokenSymbol || "Token"}.sol</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(illustrativeSource, "code")}
                        className="h-6 shrink-0 text-[11px] text-primary hover:text-primary/90"
                      >
                        {copiedCode ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                        {copiedCode ? "Copied" : "Copy Code"}
                      </Button>
                    </div>
                    <pre className="max-h-[320px] overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                      <code>{illustrativeSource}</code>
                    </pre>
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Illustrative template only. It is not compiled, audited or deployed by this page.
                </p>
              </div>
            </div>
          )}

          {/* ===================== STEP 4: REVIEW ===================== */}
          {isIdle && step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Review &amp; launch simulation</h3>
                <p className="text-sm text-muted-foreground">
                  Verify all token parameters before initiating the simulated deployment state machine.
                </p>
              </div>

              <div className="space-y-6">
                <section aria-labelledby="rv-identity">
                  <div className="flex items-center justify-between">
                    <h4 id="rv-identity" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Identity
                    </h4>
                    <EditLink onClick={() => goTo(1)} label="Edit identity" />
                  </div>
                  <dl className="mt-1 divide-y divide-border/50 border-y border-border/50">
                    <SpecRow label="Token identity">
                      <span className="font-semibold">
                        {tokenName || "Nexus Protocol"} (${tokenSymbol || "NXS"})
                      </span>
                    </SpecRow>
                    <SpecRow label="Category">{category}</SpecRow>
                    <SpecRow label="Ecosystem project">{linkedProject ? linkedProject.name : "None (standalone)"}</SpecRow>
                  </dl>
                  {linkedProject && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      The project link is a form selection only; it is not included in the simulated receipt.
                    </p>
                  )}
                </section>

                <section aria-labelledby="rv-supply">
                  <div className="flex items-center justify-between">
                    <h4 id="rv-supply" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Supply &amp; network
                    </h4>
                    <EditLink onClick={() => goTo(2)} label="Edit supply and network" />
                  </div>
                  <dl className="mt-1 divide-y divide-border/50 border-y border-border/50">
                    <SpecRow label="Decimals" mono>
                      {decimals}
                    </SpecRow>
                    <SpecRow label="Total supply" mono>
                      {totalSupply}
                    </SpecRow>
                    <SpecRow label="Base units" mono>
                      {baseUnitsResult.formattedBaseUnits}
                    </SpecRow>
                    <SpecRow label="Network target">
                      <span className="font-mono text-xs font-semibold text-primary">
                        Ethereum Sepolia (Chain ID 11155111 — D-04)
                      </span>
                    </SpecRow>
                    <SpecRow label="Recipient / creator" mono>
                      {creatorAddress}
                    </SpecRow>
                  </dl>
                </section>

                <section aria-labelledby="rv-ext">
                  <div className="flex items-center justify-between">
                    <h4 id="rv-ext" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Extensions
                    </h4>
                    <EditLink onClick={() => goTo(3)} label="Edit extensions" />
                  </div>
                  <dl className="mt-1 divide-y divide-border/50 border-y border-border/50">
                    <SpecRow label="Proposed features">{featureSummary}</SpecRow>
                  </dl>
                </section>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-primary/60 pl-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">Simulation only</p>
                  <p className="leading-relaxed text-muted-foreground">
                    Clicking &quot;Execute Deployment Simulation&quot; will run a multi-stage simulated deployment
                    lifecycle without invoking blockchain wallet signatures or expending native ETH.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== SIMULATION IN PROGRESS ===================== */}
          {!isIdle && simulationStage !== "completed" && (
            <div className="mx-auto max-w-xl py-6" role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Executing simulated deployment</h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {stageIndex + 1}/5: {SIMULATION_STAGES[Math.max(stageIndex, 0)].detail}
                  </p>
                </div>
              </div>

              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: STAGE_PROGRESS[simulationStage] ?? "20%" }}
                />
              </div>

              <ol className="mt-6 divide-y divide-border/50 border-y border-border/50">
                {SIMULATION_STAGES.map((s, i) => {
                  const done = i < stageIndex;
                  const active = i === stageIndex;
                  return (
                    <li key={s.key} className="flex items-center gap-3 py-3 text-sm">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                          done
                            ? "bg-primary text-primary-foreground"
                            : active
                            ? "bg-primary/20 text-primary ring-1 ring-primary"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {done ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      <span className={cn(active ? "font-medium text-foreground" : done ? "text-foreground/80" : "text-muted-foreground/70")}>
                        {s.label}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {done ? "Done" : active ? "In progress" : "Waiting"}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 font-mono text-xs text-muted-foreground">Demonstration execution • Zero gas consumed</p>
            </div>
          )}

          {/* ===================== SIMULATION RECEIPT ===================== */}
          {simulationStage === "completed" && receipt && (
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">Simulation complete</h3>
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-500">
                      Simulated · not on-chain
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Testnet simulation receipt generated for {receipt.name} (${receipt.symbol}).
                  </p>
                </div>
              </div>

              <dl className="divide-y divide-border/50 border-y border-border/50">
                <SpecRow label="Asset identity">
                  <span className="font-semibold">
                    {receipt.name} (${receipt.symbol})
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {receipt.totalSupply} tokens ({receipt.decimals} decimals)
                  </span>
                </SpecRow>
                <SpecRow label="Target network">
                  <span className="font-semibold text-primary">{receipt.network}</span>
                  <span className="block font-mono text-xs text-muted-foreground">
                    Chain ID: {receipt.chainId} • Block #{receipt.blockNumber}
                  </span>
                </SpecRow>
                <div className="space-y-1.5 py-3">
                  <dt className="text-sm text-muted-foreground">Simulated contract address (demonstration record)</dt>
                  <dd className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 break-all rounded-lg bg-secondary/60 px-3 py-2 font-mono text-xs text-primary">
                      {receipt.contractAddress}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(receipt.contractAddress, "address")}
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      title="Copy contract address"
                    >
                      {copiedAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedAddress ? "Copied" : "Copy"}</span>
                    </button>
                  </dd>
                </div>
                <div className="space-y-1.5 py-3">
                  <dt className="text-sm text-muted-foreground">Simulated transaction hash</dt>
                  <dd>
                    <code className="block break-all rounded-lg bg-secondary/60 px-3 py-2 font-mono text-xs text-muted-foreground">
                      {receipt.transactionHash}
                    </code>
                  </dd>
                </div>
                <SpecRow label="Creator wallet" mono>
                  {receipt.creatorAddress}
                </SpecRow>
                <SpecRow label="Illustrative gas">
                  <span className="font-mono text-xs">~1,842,500 gas (Simulated)</span>
                </SpecRow>
                <SpecRow label="Status">
                  <span className="font-mono text-xs text-primary">Simulated Record</span>
                </SpecRow>
              </dl>

              <div className="flex items-start gap-3 border-l-2 border-primary/60 pl-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Simulation disclosure: </span>
                  This transaction was executed purely in demonstration simulation mode. No real gas was spent, no
                  private key was requested for signature, and no smart contract bytecode was deployed to Ethereum
                  Sepolia.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" size="lg" onClick={handleReset} className="gap-1.5 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Configure Another Token
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" size="lg" className="text-xs">
                    <Link to="/tokens/explore">Inspect Token Explorer</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-primary text-xs font-semibold text-primary-foreground">
                    <Link to="/tokens">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step navigation */}
          {isIdle && (
            <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between border-t border-border/50 bg-background/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:px-0 lg:static lg:bg-transparent lg:backdrop-blur-none">
              {step > 1 ? (
                <Button variant="outline" size="lg" onClick={() => goTo(step - 1)} className="gap-1.5 text-xs">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="gap-1.5 bg-primary px-5 text-xs font-semibold text-primary-foreground"
                >
                  Next Step <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleLaunchSimulation}
                  className="gap-1.5 bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  <Sparkles className="h-4 w-4" /> Execute Deployment Simulation
                </Button>
              )}
            </div>
          )}
        </div>

        </TokenCreationGlobeLayout>
      </div>
    </section>
  );
}
