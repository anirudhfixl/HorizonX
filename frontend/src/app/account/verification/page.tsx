import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ShieldCheck, AlertCircle, Lock } from "lucide-react";

export default function AccountVerificationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Identity & Trust Verification"
        description="Verification levels for launchpad creators, project owners, and compliant token distributions."
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Verification" },
        ]}
      />

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-amber-300">Phase 1 Foundation Status</span>
          KYC and custodial identity verifications are pending product decision D-09 (KYC Provider and Legal Review). Public browsing and basic testnet deployments require no KYC.
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Tier 0: Basic Contributor</span>
            <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
              Active by Default
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Connect any supported Web3 address to participate in public fair launches, claim airdrops, and stake in liquidity pools.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Tier 1: Verified Project Creator</span>
            <span className="rounded bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
              <Lock className="h-3 w-3" /> Decision D-09 Pending
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Contract owner verification, GitHub source code check, and community multi-sig badge for high-volume presales.
          </p>
        </div>
      </div>
    </div>
  );
}
