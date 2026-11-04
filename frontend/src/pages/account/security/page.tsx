import React from "react";
import { AccountSectionNav } from "@/components/account/account-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { toast } from "sonner";
import { ShieldCheck, Lock, AlertTriangle } from "lucide-react";

export default function AccountSecurityPage() {
  const { disconnect, isConnected } = useWallet();

  const handleRevokeAll = () => {
    disconnect();
    toast.info("Active Session Terminated", {
      description: "Local cache and wallet authorizations have been cleared.",
    });
  };

  return (
    <div className="mx-0 w-full max-w-none px-[clamp(1rem,2.25vw,2.5rem)] pt-0 pb-8 space-y-8">
      <AccountSectionNav />
      <PageHeader
        title="Security & Session Controls"
        description="Review connected session authorizations and smart contract allowances."
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Security" },
        ]}
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Session Expiration</span>
            <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
              Client Encrypted
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Wallet authorizations do not store private keys or seed phrases on servers. All signatures require explicit hardware or software approval.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-foreground">Active Session Controls</h2>
          <p className="text-xs text-muted-foreground">
            Instantly terminate active wallet sessions and flush local storage state.
          </p>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRevokeAll}
            disabled={!isConnected}
            className="text-xs"
          >
            Revoke All Session Access
          </Button>
        </div>
      </div>
    </div>
  );
}
