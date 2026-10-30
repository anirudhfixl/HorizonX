"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Gift, Wallet, CheckCircle2, Sparkles } from "lucide-react";

export default function ClaimAirdropPage() {
  const { isConnected, shortAddress } = useWallet();
  const { openModal } = useModal();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    toast.success("Airdrop Claim Simulated", {
      description: "Demo interaction recorded for testing. No on-chain tokens transferred.",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Claim Airdrop Rewards"
        description="Verify your connected Web3 address against active merkle roots to claim token distributions."
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "Claim" },
        ]}
      />

      {!isConnected ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/15 p-12 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary mx-auto">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">Connect Wallet to Check Eligibility</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Connect your Web3 address to instantly inspect your token rewards and merkle claim proofs.
          </p>
          <Button
            size="sm"
            onClick={() => openModal("CONNECT_WALLET")}
            className="bg-primary text-primary-foreground text-xs font-semibold"
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs text-muted-foreground">Connected Address</span>
              <code className="text-xs font-mono font-semibold text-primary">{shortAddress}</code>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Eligible Allocation Found
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ProMiners Genesis Early Adopter Merkle Distribution
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-foreground">250 PMIN</span>
                <p className="text-[10px] text-muted-foreground">~$370.00 USD</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleClaim}
                disabled={claimed}
                size="sm"
                className="bg-primary text-primary-foreground font-semibold px-6 text-xs gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                {claimed ? "Claimed ✓" : "Claim 250 PMIN Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
