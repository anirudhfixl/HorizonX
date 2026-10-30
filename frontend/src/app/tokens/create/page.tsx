"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { SUPPORTED_NETWORKS, useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import {
  Coins,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function CreateTokenPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();
  const [step, setStep] = useState(1);

  // Form state
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("18");
  const [network, setNetwork] = useState(SUPPORTED_NETWORKS[0].id);
  const [totalSupply, setTotalSupply] = useState("10000000");
  const [isMintable, setIsMintable] = useState(false);
  const [isBurnable, setIsBurnable] = useState(true);
  const [isPausable, setIsPausable] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!tokenName.trim() || !tokenSymbol.trim())) {
      toast.error("Please enter a token name and symbol");
      return;
    }
    if (step === 2 && !totalSupply) {
      toast.error("Please specify total token supply");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleDeploy = () => {
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success("Token Deployment Simulated", {
      description: `Phase 1 demonstration: Parameters validated for ${tokenName} ($${tokenSymbol.toUpperCase()}) on ${network.toUpperCase()}. No on-chain contract deployed.`,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Create Token Wizard"
        description="Deploy an audited, production-ready ERC-20 token on your chosen blockchain with no coding required."
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: "Create" },
        ]}
      />

      {/* Stepper Header */}
      <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-6">
        {[
          { num: 1, label: "Identity" },
          { num: 2, label: "Supply & Network" },
          { num: 3, label: "Features" },
          { num: 4, label: "Review & Deploy" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step >= s.num ? "text-primary" : "text-muted-foreground/60"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                step >= s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-foreground">Step 1: Token Identity</h2>
            <p className="text-xs text-muted-foreground">
              Define the public name and ticker symbol for your cryptocurrency.
            </p>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Token Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. Nexus Protocol"
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Token Symbol (Ticker) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. NXS"
                  maxLength={10}
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs uppercase font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Decimals (Standard: 18)
                </label>
                <input
                  type="number"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-foreground">Step 2: Supply & Network</h2>
            <p className="text-xs text-muted-foreground">
              Configure initial issuance and choose your target deployment blockchain.
            </p>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Target Blockchain
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  {SUPPORTED_NETWORKS.map((n) => (
                    <option key={n.id} value={n.id} className="bg-popover text-foreground">
                      {n.icon} {n.name} (Chain ID: {n.chainId})
                    </option>
                  ))}
                </select>
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
                <p className="mt-1 text-[11px] text-muted-foreground">
                  The initial supply minted directly into your creator wallet upon deployment.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-foreground">Step 3: Features & Capabilities</h2>
            <p className="text-xs text-muted-foreground">
              Select verified OpenZeppelin module extensions for your token contract.
            </p>

            <div className="space-y-3 max-w-lg">
              <label className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3.5 cursor-pointer hover:border-primary/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-foreground">Burnable</span>
                  <p className="text-[11px] text-muted-foreground">
                    Allows holders to permanently reduce token supply by burning.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isBurnable}
                  onChange={(e) => setIsBurnable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3.5 cursor-pointer hover:border-primary/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-foreground">Mintable</span>
                  <p className="text-[11px] text-muted-foreground">
                    Authorized owners can mint additional tokens post-deployment.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isMintable}
                  onChange={(e) => setIsMintable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3.5 cursor-pointer hover:border-primary/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-foreground">Pausable</span>
                  <p className="text-[11px] text-muted-foreground">
                    Ability to pause contract transfers in case of emergency.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPausable}
                  onChange={(e) => setIsPausable(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-foreground">Step 4: Review & Deploy</h2>
            <p className="text-xs text-muted-foreground">
              Confirm your token parameters. Once deployed on the blockchain, name and symbol are immutable.
            </p>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token Name:</span>
                <span className="font-semibold text-foreground">{tokenName || "Nexus Protocol"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol:</span>
                <span className="font-mono font-semibold text-primary">${tokenSymbol || "NXS"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decimals:</span>
                <span className="font-mono text-foreground">{decimals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply:</span>
                <span className="font-mono text-foreground">{totalSupply || "10,000,000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-semibold text-foreground uppercase">{network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Features:</span>
                <span className="text-foreground">
                  {[isBurnable && "Burnable", isMintable && "Mintable", isPausable && "Pausable"]
                    .filter(Boolean)
                    .join(", ") || "Standard"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center gap-3 text-xs text-muted-foreground">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <span>
                Standard ERC-20 contract compiled using OpenZeppelin v5. Contract source code is automatically verified.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Navigation Actions */}
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
              onClick={handleDeploy}
              className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground text-xs font-semibold gap-1.5 px-5 shadow-lg shadow-primary/20"
            >
              <Sparkles className="h-4 w-4" /> Deploy Token Contract
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
