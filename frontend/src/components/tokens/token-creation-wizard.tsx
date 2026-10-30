"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { MOCK_PROJECTS } from "@/lib/mock-data";
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
} from "lucide-react";

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

export function generateIllustrativeContractSource(
  name: string,
  symbol: string,
  decimals: number,
  isBurnable: boolean,
  isMintable: boolean,
  isPausable: boolean,
  isPermit: boolean
): string {
  const safeContractName = (symbol.replace(/[^a-zA-Z0-9]/g, "") || "Token") + "Token";
  const safeTokenName = name.replace(/["\\]/g, "") || "Sample Token";
  const safeSymbol = symbol.replace(/["\\]/g, "") || "SMPL";

  const imports: string[] = ['import "@openzeppelin/contracts/token/ERC20/ERC20.sol";'];
  const inherited: string[] = ["ERC20"];

  if (isBurnable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";');
    inherited.push("ERC20Burnable");
  }
  if (isPausable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";');
    inherited.push("ERC20Pausable");
  }
  if (isPermit) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";');
    inherited.push("ERC20Permit");
  }
  if (isMintable || isPausable) {
    imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
    inherited.push("Ownable");
  }

  const constructorParams = ["address initialOwner", "uint256 initialSupply"];
  const constructorInits = [
    `ERC20("${safeTokenName}", "${safeSymbol}")`,
  ];

  if (isPermit) {
    constructorInits.push(`ERC20Permit("${safeTokenName}")`);
  }
  if (isMintable || isPausable) {
    constructorInits.push("Ownable(initialOwner)");
  }

  let body = "";

  if (decimals !== 18) {
    body += `
    function decimals() public view virtual override returns (uint8) {
        return ${decimals};
    }
`;
  }

  if (isMintable) {
    body += `
    /**
     * @dev Mint additional tokens. Restricted to contract owner.
     * Note: Subject to Architecture Decision D-05 / D-06 review.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
`;
  }

  if (isPausable) {
    body += `
    /**
     * @dev Emergency pause functions. Restricted to contract owner.
     * Note: Centralized pause authority subject to D-06 authority review.
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Required override for OpenZeppelin v5 ERC20 + ERC20Pausable.
     */
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
`;
  }

  return `// SPDX-License-Identifier: MIT
// Illustrative OpenZeppelin v5.0.1 Source Template (Preview Configuration)
// Note: Architecture decisions D-05 (features) and D-06 (upgradeability) remain pending review.
pragma solidity 0.8.24;

${imports.join("\n")}

/**
 * @title ${safeTokenName} (${safeSymbol})
 * @dev Illustrative ERC-20 implementation for preview on Ethereum Sepolia (D-04).
 */
contract ${safeContractName} is ${inherited.join(", ")} {
    constructor(
        ${constructorParams.join(",\n        ")}
    )
        ${constructorInits.join("\n        ")}
    {
        _mint(initialOwner, initialSupply * 10 ** ${decimals});
    }
${body}}`;
}

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

export const TOKEN_CATEGORIES = [
  "Governance",
  "DeFi",
  "Infrastructure",
  "AI & Compute",
  "Security & Privacy",
  "DePIN",
  "Meme & Community",
];

export function TokenCreationWizard() {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();

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

  const fallbackDemoAddress = "0x71C9...4E39";
  const creatorAddress = isConnected && userAddress ? userAddress : fallbackDemoAddress;

  const baseUnitsResult = calculateBaseUnits(totalSupply, decimals);

  const handleNext = () => {
    if (step === 1) {
      if (!tokenName.trim()) {
        toast.error("Please provide a token name");
        return;
      }
      if (!tokenSymbol.trim()) {
        toast.error("Please provide a ticker symbol");
        return;
      }
      if (tokenSymbol.trim().length < 2 || tokenSymbol.trim().length > 8) {
        toast.error("Symbol must be between 2 and 8 characters");
        return;
      }
    }
    if (step === 2) {
      if (!baseUnitsResult.isValid) {
        toast.error(baseUnitsResult.error || "Please enter a valid total supply");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleCopy = (text: string, type: "code" | "address") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
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
                description: description.trim() || "Ecosystem asset deployed via ProMiners simulation wizard.",
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

  return (
    <div id="create-token-wizard" className="scroll-mt-28 space-y-8">
      {/* Breadcrumbs & Header */}
      <PageHeader
        title="Token Creation & Deployment Simulation"
        description="Configure your ERC-20 specification, inspect OpenZeppelin source templates, and simulate deployment on Ethereum Sepolia."
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: "Create" },
        ]}
        badge={
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-mono text-primary font-medium">
            Sepolia Testnet (D-04)
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs text-primary font-mono">
                <Wallet className="h-3.5 w-3.5" />
                <span>{userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                onClick={() => openModal("CONNECT_WALLET")}
              >
                <Wallet className="h-3.5 w-3.5 mr-1 text-primary" />
                Connect Wallet
              </Button>
            )}
          </div>
        }
      />

      {/* D-04 Architecture & Simulation Disclosure Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Simulation Boundary: </span>
              Under Architecture Decision <code className="text-primary font-mono">D-04</code>, transactions are supported exclusively on Ethereum Sepolia (<code className="text-primary font-mono">11155111</code>). This wizard simulates deployment schema validation, source code generation, and receipt generation. No real smart contracts or blockchain transactions are submitted.
            </div>
          </div>
          <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
            D-04 Scoped
          </span>
        </div>
      </div>

      {/* Stepper Navigation */}
      {simulationStage === "idle" && (
        <div id="token-wizard-steps" className="grid grid-cols-4 gap-2 border-b border-border/40 pb-6">
          {[
            { num: 1, label: "Identity & Category" },
            { num: 2, label: "Supply & Network" },
            { num: 3, label: "Extensions (Illustrative)" },
            { num: 4, label: "Review & Simulation" },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 text-xs font-semibold ${
                step >= s.num ? "text-primary" : "text-muted-foreground/60"
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-mono ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Active Form Content / Simulation View */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: IDENTITY & CATEGORY                                              */}
        {/* ========================================================================= */}
        {simulationStage === "idle" && step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 1: Token Identity & Classification</h2>
              <p className="text-xs text-muted-foreground">
                Define the public name, ticker symbol, catalog category, and ecosystem association for your asset.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Token Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g. Quantum Protocol"
                    maxLength={32}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Public asset name (2–32 characters)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Token Symbol (Ticker) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="e.g. QNTM"
                    maxLength={8}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs uppercase font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Uppercase exchange ticker (2–8 characters)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Catalog Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {TOKEN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-popover text-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Ecosystem Project Link (Optional)
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="" className="bg-popover text-foreground">
                      None (Standalone Community Asset)
                    </option>
                    {MOCK_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-popover text-foreground">
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Asset Purpose & Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe protocol governance, staking utility, or compute subsidies..."
                    rows={4}
                    maxLength={250}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                  <span className="text-[10px] text-muted-foreground float-right">
                    {description.length}/250 chars
                  </span>
                </div>
              </div>
            </div>

            {/* Live Token Badge Preview */}
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground">Live Pill Preview</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-sm shrink-0">
                  {tokenSymbol.slice(0, 2) || "TK"}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {tokenName || "Sample Protocol Token"}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>${tokenSymbol || "SMPL"}</span>
                    <span>•</span>
                    <span>{category}</span>
                    <span>•</span>
                    <span className="text-primary">ERC-20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SUPPLY & NETWORK                                                 */}
        {/* ========================================================================= */}
        {simulationStage === "idle" && step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 2: Supply & Network Configuration</h2>
              <p className="text-xs text-muted-foreground">
                Set initial mint volume and verify deployment parameters on Ethereum Sepolia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Target Blockchain Network (D-04 Approved)
                  </label>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground text-xs flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Ethereum Sepolia Testnet
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        Chain ID: 11155111 • Standard EVM Cancun
                      </div>
                    </div>
                    <span className="rounded bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-mono font-semibold">
                      D-04 Standard
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Multi-chain wallet deployments remain pending architecture decision D-04.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Decimals Precision
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[18, 6, 9].map((dec) => (
                      <button
                        key={dec}
                        type="button"
                        onClick={() => setDecimals(dec)}
                        className={`rounded-lg border px-3 py-2 text-xs font-mono font-medium transition-colors ${
                          decimals === dec
                            ? "border-primary bg-primary/15 text-primary font-bold"
                            : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {dec} Decimals {dec === 18 ? "(Standard)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Initial Total Supply <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    placeholder="e.g. 100,000,000"
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["1,000,000", "10,000,000", "100,000,000", "1,000,000,000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTotalSupply(preset)}
                        className="rounded bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Creator Wallet / Recipient */}
                <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-primary" />
                      Recipient & Owner Wallet
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isConnected ? "Connected Web3 Wallet" : "Simulated Demo Identity"}
                    </span>
                  </div>
                  <code className="text-xs font-mono text-foreground block break-all bg-black/40 p-2 rounded">
                    {creatorAddress}
                  </code>
                  {!isConnected && (
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[10px] text-amber-400">
                        Disconnected: Demo address used for simulation
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal("CONNECT_WALLET")}
                        className="h-6 text-[10px] border-border/60"
                      >
                        Connect Real Wallet
                      </Button>
                    </div>
                  )}
                </div>

                {/* Supply Math & Gas Assumptions */}
                <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-3 text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Fuel className="h-3.5 w-3.5 text-primary" />
                    Base Units & Illustrative Cost Assumptions
                  </span>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Human Supply:</span>
                      <span className="text-foreground">{totalSupply}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Decimals Multiplier:</span>
                      <span className="text-foreground">10^{decimals}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Calculated Base Units:</span>
                      <span className="text-foreground truncate max-w-[200px]" title={baseUnitsResult.formattedBaseUnits}>
                        {baseUnitsResult.isValid ? baseUnitsResult.formattedBaseUnits : "Invalid"}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/40">
                      <span>Illustrative Deployment Gas:</span>
                      <span className="text-primary">~1,842,500 gas (~0.0036 ETH)</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Note: Gas figures are illustrative deployment assumptions, not live network estimates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: EXTENSIONS & LIVE PREVIEW                                        */}
        {/* ========================================================================= */}
        {simulationStage === "idle" && step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 3: Contract Extensions (Illustrative Preview)</h2>
              <p className="text-xs text-muted-foreground">
                Explore proposed OpenZeppelin extension features. Note: Formal token feature specifications remain pending Architecture Decision D-05 and D-06.
              </p>
            </div>

            <div className="space-y-3">
              {/* Burnable */}
              <label className="flex items-start justify-between rounded-xl border border-border/60 bg-secondary/20 p-4 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">Burnable (ERC20Burnable)</span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      Proposed D-05
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Allows token holders to irreversibly destroy tokens from their personal balance, reducing total circulating supply.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isBurnable}
                  onChange={(e) => setIsBurnable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1"
                />
              </label>

              {/* Mintable */}
              <label className="flex items-start justify-between rounded-xl border border-border/60 bg-secondary/20 p-4 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-foreground">Mintable (Ownable)</span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      Proposed D-05
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Enables authorized contract owner to issue new tokens post-deployment.
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-medium">
                    ⚠️ Inflation Risk: Uncapped minting authority introduces supply dilution risk without multi-sig timelock governance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isMintable}
                  onChange={(e) => setIsMintable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1"
                />
              </label>

              {/* Pausable */}
              <label className="flex items-start justify-between rounded-xl border border-border/60 bg-secondary/20 p-4 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-semibold text-foreground">Pausable (ERC20Pausable)</span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      Proposed D-05
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Grants designated contract authority the ability to temporarily freeze all token transfers during an emergency.
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-medium">
                    ⚠️ Centralization Notice: Freezing capability grants administrative authority over user funds and must be disclosed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPausable}
                  onChange={(e) => setIsPausable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1"
                />
              </label>

              {/* Permit */}
              <label className="flex items-start justify-between rounded-xl border border-border/60 bg-secondary/20 p-4 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Permit (EIP-2612)</span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      Proposed D-05
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Enables gasless token approvals through cryptographically signed typed signatures (EIP-712).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPermit}
                  onChange={(e) => setIsPermit(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1"
                />
              </label>
            </div>

            {/* Live Source Code Preview Toggle */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCodePreview(!showCodePreview)}
                className="gap-2 text-xs border-border/60 text-muted-foreground hover:text-foreground"
              >
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                {showCodePreview ? "Hide Solidity Preview" : "View Live Solidity Source Preview"}
              </Button>

              {showCodePreview && (
                <div className="mt-3 rounded-xl border border-border/40 bg-black/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                    <span className="font-mono">contracts/preview/{tokenSymbol || "Token"}.sol</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(illustrativeSource, "code")}
                      className="h-6 text-[10px] text-primary hover:text-primary/90"
                    >
                      {copiedCode ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedCode ? "Copied" : "Copy Code"}
                    </Button>
                  </div>
                  <pre className="overflow-x-auto text-xs font-mono text-zinc-300 max-h-[300px] leading-relaxed">
                    <code>{illustrativeSource}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW & SIMULATION LAUNCH                                       */}
        {/* ========================================================================= */}
        {simulationStage === "idle" && step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 4: Review Specification & Launch Simulation</h2>
              <p className="text-xs text-muted-foreground">
                Verify all token parameters before initiating the simulated deployment state machine.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token Identity:</span>
                <span className="font-semibold text-foreground">
                  {tokenName || "Nexus Protocol"} (${tokenSymbol || "NXS"})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="text-foreground">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decimals:</span>
                <span className="font-mono text-foreground">{decimals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply:</span>
                <span className="font-mono font-semibold text-foreground">{totalSupply}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Units:</span>
                <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[250px]">
                  {baseUnitsResult.formattedBaseUnits}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Target:</span>
                <span className="font-mono text-primary font-semibold">
                  Ethereum Sepolia (Chain ID 11155111 — D-04)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient / Creator:</span>
                <span className="font-mono text-foreground text-[11px]">{creatorAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposed Features:</span>
                <span className="text-foreground">
                  {[
                    isBurnable && "Burnable",
                    isMintable && "Mintable",
                    isPausable && "Pausable",
                    isPermit && "Permit",
                  ].filter(Boolean).join(", ") || "Standard ERC-20"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Info className="h-4 w-4 text-primary" />
                <span>Simulation Only Confirmation</span>
              </div>
              <p className="leading-relaxed">
                Clicking &quot;Execute Deployment Simulation&quot; will run a multi-stage simulated deployment lifecycle without invoking blockchain wallet signatures or expending native ETH.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIMULATION IN PROGRESS                                                    */}
        {/* ========================================================================= */}
        {simulationStage !== "idle" && simulationStage !== "completed" && (
          <div className="py-8 space-y-6 text-center max-w-lg mx-auto">
            <div className="flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <Sparkles className="h-8 w-8 animate-pulse text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">
                Executing Simulated Deployment
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {simulationStage === "validating" && "1/5: Simulating parameter & schema validation..."}
                {simulationStage === "generating" && "2/5: Generating illustrative Solidity source template..."}
                {simulationStage === "preparing" && "3/5: Preparing simulated authorization payload..."}
                {simulationStage === "submitting" && "4/5: Simulating deployment transaction submission..."}
                {simulationStage === "confirming" && "5/5: Simulating testnet block inclusion..."}
              </p>
            </div>

            {/* Stage Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width:
                      simulationStage === "validating"
                        ? "20%"
                        : simulationStage === "generating"
                        ? "40%"
                        : simulationStage === "preparing"
                        ? "60%"
                        : simulationStage === "submitting"
                        ? "80%"
                        : "95%",
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Demonstration execution • Zero gas consumed
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIMULATION COMPLETED RECEIPT                                              */}
        {/* ========================================================================= */}
        {simulationStage === "completed" && receipt && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Simulated Deployment Confirmed
                </h3>
                <p className="text-xs text-muted-foreground">
                  Testnet simulation receipt generated for {receipt.name} (${receipt.symbol}).
                </p>
              </div>
            </div>

            {/* Receipt Credentials */}
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-border/40">
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground">Asset Identity</span>
                  <div className="font-semibold text-foreground text-sm mt-0.5">
                    {receipt.name} (${receipt.symbol})
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {receipt.totalSupply} tokens ({receipt.decimals} decimals)
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-muted-foreground">Target Network</span>
                  <div className="font-semibold text-primary text-sm mt-0.5">
                    {receipt.network}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    Chain ID: {receipt.chainId} • Block #{receipt.blockNumber}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Simulated Contract Address (Demonstration Record)
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="rounded bg-black/60 px-3 py-1.5 text-xs font-mono text-primary break-all flex-1">
                    {receipt.contractAddress}
                  </code>
                  <button
                    onClick={() => handleCopy(receipt.contractAddress, "address")}
                    className="inline-flex h-8 items-center gap-1 rounded bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground"
                    title="Copy contract address"
                  >
                    {copiedAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedAddress ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Simulated Transaction Hash
                </span>
                <code className="rounded bg-black/60 px-3 py-1.5 text-xs font-mono text-muted-foreground block break-all mt-1">
                  {receipt.transactionHash}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/40 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Creator Wallet:</span>
                  <p className="font-mono text-foreground truncate">{receipt.creatorAddress}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Illustrative Gas Spent:</span>
                  <p className="font-mono text-emerald-400">~1,842,500 gas (Simulated)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-mono text-primary">Simulated Record</p>
                </div>
              </div>
            </div>

            {/* Explicit Notice */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Simulation Disclosure: </span>
              <p className="leading-relaxed">
                This transaction was executed purely in demonstration simulation mode. No real gas was spent, no private key was requested for signature, and no smart contract bytecode was deployed to Ethereum Sepolia.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs border-border/60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Configure Another Token
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
                  <Link href="/tokens/explore">Inspect Token Explorer</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                  <Link href="/tokens">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Step Navigation Actions */}
        {simulationStage === "idle" && (
          <div className="pt-6 border-t border-border/40 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="gap-1.5 text-xs border-border/60"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                size="sm"
                onClick={handleNext}
                className="bg-primary text-primary-foreground text-xs font-semibold gap-1.5 px-4"
              >
                Next Step <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleLaunchSimulation}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-1.5 px-5 shadow-lg shadow-primary/25"
              >
                <Sparkles className="h-4 w-4" /> Execute Deployment Simulation
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
