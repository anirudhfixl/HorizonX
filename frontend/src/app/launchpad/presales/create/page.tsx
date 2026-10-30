"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Rocket, Sparkles, Shield, ArrowRight } from "lucide-react";

export default function CreatePresalePage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [tokenAddress, setTokenAddress] = useState("");
  const [presaleRate, setPresaleRate] = useState("1000");
  const [softCap, setSoftCap] = useState("50");
  const [hardCap, setHardCap] = useState("150");
  const [minContribution, setMinContribution] = useState("0.1");
  const [maxContribution, setMaxContribution] = useState("3.0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success("Presale Contract Simulation Created", {
      description: "Presale parameters submitted for deployment. (Phase 1 Mock)",
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Create Presale Campaign"
        description="Launch an automated initial presale with non-custodial escrow, custom caps, and automatic liquidity lockup."
        breadcrumbs={[
          { label: "Launchpad", href: "/launchpad" },
          { label: "Presales", href: "/launchpad/presales" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Presale Configuration</h2>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Token Contract Address <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Presale Rate (Tokens per 1 ETH/BNB)
              </label>
              <input
                type="number"
                value={presaleRate}
                onChange={(e) => setPresaleRate(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Softcap (ETH / BNB)
              </label>
              <input
                type="number"
                value={softCap}
                onChange={(e) => setSoftCap(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Hardcap (ETH / BNB)
              </label>
              <input
                type="number"
                value={hardCap}
                onChange={(e) => setHardCap(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Max Contribution per Wallet
              </label>
              <input
                type="number"
                value={maxContribution}
                onChange={(e) => setMaxContribution(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <span>
            Liquidity is automatically deposited into Uniswap / PancakeSwap and LP tokens are locked for 365 days.
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-6 gap-2">
            <Rocket className="h-4 w-4" /> Create Presale Contract
          </Button>
        </div>
      </form>
    </div>
  );
}
