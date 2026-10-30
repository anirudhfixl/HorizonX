"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Gift, ShieldCheck } from "lucide-react";

export default function CreateAirdropCampaignPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [title, setTitle] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [airdropType, setAirdropType] = useState("merkle");
  const [totalReward, setTotalReward] = useState("100000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success("Airdrop Campaign Configured", {
      description: "Phase 1 demonstration: Merkle root simulated. No on-chain contract deployed.",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Launch Airdrop Campaign"
        description="Configure gasless merkle claim contracts or direct batch distributions for community members."
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "Campaigns", href: "/airdrops/campaigns" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Campaign Specifications</h2>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Campaign Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Genesis Community Airdrop"
              className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

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
                Distribution Architecture
              </label>
              <select
                value={airdropType}
                onChange={(e) => setAirdropType(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="merkle" className="bg-popover">Merkle Tree Claim (Gas efficient)</option>
                <option value="batch" className="bg-popover">Direct Batch Push</option>
                <option value="quest" className="bg-popover">Quest / Social Proof Gated</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Total Reward Allocation
              </label>
              <input
                type="number"
                value={totalReward}
                onChange={(e) => setTotalReward(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span>
            Merkle proofs enable up to 100,000 claimants to claim on-chain without the project paying expensive gas fees.
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-6 gap-2">
            <Gift className="h-4 w-4" /> Deploy Airdrop Contract
          </Button>
        </div>
      </form>
    </div>
  );
}
