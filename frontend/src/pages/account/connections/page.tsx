import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { AccountWorkspace } from "@/components/account/account-workspace";
import { CheckCircle2, Wallet, Plus, ExternalLink, LockKeyhole, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AccountConnectionsPage() {
  const { isConnected, address, shortAddress, walletProvider, disconnect } = useWallet();
  const { openModal } = useModal();

  const handleDisconnect = () => {
    disconnect();
    toast.info("Wallet disconnected", { description: "The active wallet connection has been closed." });
  };

  return (
    <AccountWorkspace
      active="connections"
      title="Wallet & security"
      description="Manage your active wallet connection and review the security boundaries of your HorizonX session."
    >
      <div className="account-security-stack">
        <section className="account-panel">
          <div className="account-panel__heading account-panel__heading--between">
            <div className="account-panel__heading-main">
              <div className="account-panel__heading-icon"><Wallet className="h-5 w-5" /></div>
              <div><h2>Wallet connection</h2><p>Your active wallet used across the HorizonX ecosystem.</p></div>
            </div>
            <Button size="sm" variant="outline" onClick={() => openModal("CONNECT_WALLET")} className="gap-2">
              <Plus className="h-4 w-4" /> {isConnected ? "Switch wallet" : "Connect wallet"}
            </Button>
          </div>
          {isConnected ? (
            <div className="account-wallet-card">
              <div className="account-wallet-card__icon"><Wallet className="h-5 w-5" /></div>
              <div className="account-wallet-card__details">
                <div className="account-wallet-card__name">{walletProvider || "Connected wallet"} <span><CheckCircle2 className="h-3 w-3" /> Connected</span></div>
                <code title={address || undefined}>{shortAddress || address}</code>
              </div>
              <Button size="sm" variant="ghost" onClick={() => openModal("WALLET_DETAILS")} className="gap-2">Details <ExternalLink className="h-3.5 w-3.5" /></Button>
            </div>
          ) : (
            <div className="account-empty-state">
              <div className="account-empty-state__icon"><Wallet className="h-6 w-6" /></div>
              <h3>No wallet connected</h3>
              <p>Connect a supported wallet to use wallet-based features and manage on-chain activity.</p>
              <Button size="sm" onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</Button>
            </div>
          )}
        </section>

        <section className="account-panel">
          <div className="account-panel__heading">
            <div className="account-panel__heading-icon"><ShieldCheck className="h-5 w-5" /></div>
            <div><h2>Wallet security</h2><p>Understand how wallet access and transaction approvals work.</p></div>
          </div>
          <div className="account-security-info">
            <LockKeyhole className="h-5 w-5" />
            <p>HorizonX does not need your recovery phrase or private key. Review every transaction and signature request in your wallet before approving it.</p>
          </div>
          <div className="account-security-action">
            <div><strong>{isConnected ? "Wallet is connected" : "No active wallet session"}</strong><span>{isConnected ? "Disconnect this wallet from the current HorizonX session when finished." : "There is no wallet session to disconnect."}</span></div>
            <Button size="sm" variant="destructive" onClick={handleDisconnect} disabled={!isConnected}>Disconnect wallet</Button>
          </div>
        </section>

        <div className="account-inline-note"><AlertTriangle className="h-4 w-4" /><span>Advanced session management, multi-factor authentication and contract-allowance revocation are not currently exposed in this account interface.</span></div>
      </div>
    </AccountWorkspace>
  );
}
