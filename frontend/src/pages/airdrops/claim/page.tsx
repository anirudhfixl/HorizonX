import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { CircleAlert, Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClaimAirdropPage() {
  const { isConnected, shortAddress, isDemoMode, isUnsupportedNetwork } = useWallet();
  const { openModal } = useModal();

  return (
    <main className="airdrop-page w-full max-w-none px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Claim checker" }]} />
      <PageHeader
        title="Airdrop Claim Checker"
        description="Review the current claim-checking capabilities before connecting a wallet or signing a transaction."
        breadcrumbs={[{ label: "Airdrops", href: "/airdrops" }, { label: "Claim checker" }]}
      />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10"><ShieldCheck className="h-5 w-5 text-primary" /></div><div><h2 className="font-semibold text-foreground">Wallet connection</h2><p className="text-xs text-muted-foreground">Connection state only — not an eligibility result.</p></div></div>
          {!isConnected ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-secondary/15 p-8 text-center space-y-3">
              <Wallet className="mx-auto h-7 w-7 text-primary" />
              <h3 className="font-semibold text-foreground">Connect a wallet to continue</h3>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">The current frontend can display the connected address, but it does not have a production allocation lookup service wired into this page.</p>
              <Button onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Connected address</p>
              <p className="break-all font-mono text-sm font-semibold text-foreground">{shortAddress}</p>
              {isDemoMode && <p className="text-xs text-amber-300">Demo wallet session — this is not a signed wallet identity.</p>}
              {isUnsupportedNetwork && <p className="text-xs text-amber-300">Switch to Ethereum Sepolia before testing the supported demo flow.</p>}
            </div>
          )}
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 flex gap-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div className="space-y-1"><p className="text-sm font-semibold text-foreground">Eligibility verification is not connected</p><p className="text-sm leading-relaxed text-muted-foreground">No backend endpoint or on-chain contract read is currently configured here to verify a Merkle proof, calculate an allocation, or submit a claim. This page will not display a fabricated eligible allocation or a simulated successful claim.</p></div>
          </div>
          <Button asChild variant="outline"><Link to="/airdrops/campaigns">Browse distribution campaigns <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link></Button>
        </div>

        <aside className="rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground">What is required for real claims?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary">01</span><span>Verified campaign contract address and supported chain.</span></li>
            <li className="flex gap-2"><span className="text-primary">02</span><span>Trusted allocation source or Merkle proof endpoint.</span></li>
            <li className="flex gap-2"><span className="text-primary">03</span><span>On-chain claim-state check for the connected address.</span></li>
            <li className="flex gap-2"><span className="text-primary">04</span><span>Contract write flow with transaction receipt and error handling.</span></li>
          </ul>
          <div className="border-t border-border/50 pt-4 text-xs leading-relaxed text-muted-foreground">Never sign a transaction based solely on a campaign card or a displayed reward amount. Verify the contract and source independently.</div>
        </aside>
      </section>
    </main>
  );
}
