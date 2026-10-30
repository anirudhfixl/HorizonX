"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Copy, Check, Share2, Wallet } from "lucide-react";

export default function PartnerReferralsPage() {
  const { isConnected, shortAddress } = useWallet();
  const { openModal } = useModal();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://prominers.org/launchpad?ref=${shortAddress || "0xDEMO"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral Link Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Referral Links & Attribution"
        description="Share your unique on-chain partner link to earn automatic protocol commission on new presales."
        breadcrumbs={[
          { label: "Partners", href: "/partners" },
          { label: "Referrals" },
        ]}
      />

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <h2 className="text-base font-bold text-foreground">Your On-Chain Referral Link</h2>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none"
          />
          <Button
            size="sm"
            onClick={handleCopy}
            className="shrink-0 bg-primary text-primary-foreground text-xs font-semibold px-4 gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>

        <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">How Attribution Works:</p>
          <p>
            When a project creates a presale or launches a token using your referral code, 1.5% of the protocol fee is credited automatically to your connected wallet upon campaign finalization.
          </p>
        </div>
      </div>
    </div>
  );
}
