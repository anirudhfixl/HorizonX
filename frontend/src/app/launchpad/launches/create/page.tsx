"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function CreateFairLaunchPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [tokenAddress, setTokenAddress] = useState("");
  const [totalSelling, setTotalSelling] = useState("5000000");
  const [softCap, setSoftCap] = useState("20");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success("Fair Launch Created", {
      description: "Fair launch contract deployment simulated. (Phase 1 Mock)",
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Create Fair Launch"
        description="Launch an un-tiered community offering where the final token price is determined dynamically by the total pool contributions."
        breadcrumbs={[
          { label: "Launchpad", href: "/launchpad" },
          { label: "Fair Launches", href: "/launchpad/launches" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Launch Parameters</h2>

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
                Total Tokens for Launch
              </label>
              <input
                type="number"
                value={totalSelling}
                onChange={(e) => setTotalSelling(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Minimum Softcap (ETH / BNB)
              </label>
              <input
                type="number"
                value={softCap}
                onChange={(e) => setSoftCap(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span>
            No hardcap exists in a fair launch. All participants receive tokens proportional to their contribution.
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-6 gap-2">
            <Sparkles className="h-4 w-4" /> Deploy Fair Launch Contract
          </Button>
        </div>
      </form>
    </div>
  );
}
