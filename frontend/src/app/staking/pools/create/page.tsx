"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Layers, ShieldCheck } from "lucide-react";

export default function CreateStakingPoolPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [poolName, setPoolName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [apy, setApy] = useState("24");
  const [lockDays, setLockDays] = useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success("Staking Pool Simulation Configured", {
      description: "Phase 1 demonstration: Form parameters validated. No on-chain contract deployed.",
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Deploy Staking Pool"
        description="Launch an audited staking vault for your token holders with custom reward APY and lockup terms."
        breadcrumbs={[
          { label: "Staking", href: "/staking" },
          { label: "Pools", href: "/staking/pools" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Vault Configuration</h2>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Pool Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="e.g. PMIN 30-Day Staking Vault"
              className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Staked Token Contract Address <span className="text-destructive">*</span>
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
                Target Estimated APY (%)
              </label>
              <input
                type="number"
                value={apy}
                onChange={(e) => setApy(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Lock Period (Days, 0 for flexible)
              </label>
              <input
                type="number"
                value={lockDays}
                onChange={(e) => setLockDays(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span>
            Staking pools distribute reward tokens linearly per block with mathematical precision.
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-6 gap-2">
            <Layers className="h-4 w-4" /> Deploy Staking Vault
          </Button>
        </div>
      </form>
    </div>
  );
}
