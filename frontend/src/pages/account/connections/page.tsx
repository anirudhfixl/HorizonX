import React from "react";
import { Button } from "@/components/ui/button";
import { useMultiWallet } from "@/web3";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { AccountWorkspace } from "@/components/account/account-workspace";
import {
  CheckCircle2,
  Wallet,
  Plus,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import {
  MetaMaskLogo,
  PhantomLogo,
  GramWalletLogo,
  TronLinkLogo,
} from "@/components/shared/wallet-icons";
import { SUPPORTED_TESTNETS } from "@/web3/config/networks";
import type { BlockchainEcosystem } from "@/web3/types/wallet.types";

interface EcosystemConnectionConfig {
  id: BlockchainEcosystem;
  name: string;
  renderIcon: (props: { className?: string }) => React.JSX.Element;
  iconBg: string;
}

const ECOSYSTEM_CONFIGS: EcosystemConnectionConfig[] = [
  {
    id: "evm",
    name: "Ethereum Sepolia (MetaMask)",
    iconBg: "bg-[#e2761b]/10 border-[#e2761b]/25",
    renderIcon: (props) => <MetaMaskLogo {...props} />,
  },
  {
    id: "solana",
    name: "Solana Devnet (Phantom)",
    iconBg: "bg-[#534bb1]/10 border-[#534bb1]/25",
    renderIcon: (props) => <PhantomLogo {...props} />,
  },
  {
    id: "ton",
    name: "TON Testnet (Gram Wallet)",
    iconBg: "bg-[#0098ea]/10 border-[#0098ea]/25",
    renderIcon: (props) => <GramWalletLogo {...props} />,
  },
  {
    id: "tron",
    name: "TRON Shasta (TronLink)",
    iconBg: "bg-[#ff0613]/10 border-[#ff0613]/25",
    renderIcon: (props) => <TronLinkLogo {...props} />,
  },
];

export default function AccountConnectionsPage() {
  const multiWallet = useMultiWallet();
  const { openModal } = useModal();

  const handleDisconnect = async (eco: BlockchainEcosystem) => {
    await multiWallet[eco].disconnect();
    toast.info("Wallet disconnected", {
      description: `${SUPPORTED_TESTNETS[eco].shortName} wallet connection closed.`,
    });
  };

  return (
    <AccountWorkspace
      active="connections"
      title="Multi-Chain Connections & Security"
      description="Manage four independent Web3 connections and review the testnet security boundaries of your HorizonX session."
    >
      <div className="account-security-stack space-y-6">
        <section className="account-panel">
          <div className="account-panel__heading account-panel__heading--between">
            <div className="account-panel__heading-main">
              <div className="account-panel__heading-icon"><Wallet className="h-5 w-5" /></div>
              <div>
                <h2>Independent Testnet Wallets</h2>
                <p>Manage individual connections across all 4 supported blockchain ecosystems.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => openModal("CONNECT_WALLET")} className="gap-2">
              <Plus className="h-4 w-4" /> Connect Wallets
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            {ECOSYSTEM_CONFIGS.map((eco) => {
              const state = multiWallet[eco.id];
              const net = SUPPORTED_TESTNETS[eco.id];
              const isConnected = state.isConnected;

              return (
                <div
                  key={eco.id}
                  className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${eco.iconBg} shadow-sm`}>
                        {eco.renderIcon({ className: "h-4 w-4 object-contain" })}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{eco.name}</div>
                        <div className="text-[10px] text-muted-foreground">{net.networkName}</div>
                      </div>
                    </div>
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground">Off</span>
                    )}
                  </div>

                  {isConnected && state.address ? (
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between">
                        <code className="text-[11px] font-mono text-muted-foreground truncate" title={state.address}>
                          {state.shortAddress || state.address}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openModal("WALLET_DETAILS", { ecosystem: eco.id })}
                          className="h-6 text-[10px] px-2 text-primary"
                        >
                          Details <ExternalLink className="h-2.5 w-2.5 ml-1" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground">Balance:</span>
                        <span className="font-semibold text-foreground">
                          {state.nativeBalance} {state.nativeSymbol}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDisconnect(eco.id)}
                        className="w-full text-xs h-7"
                      >
                        <LogOut className="h-3 w-3 mr-1.5" /> Disconnect {net.shortName}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => state.connect()}
                      disabled={state.isConnecting}
                      className="w-full text-xs h-8"
                    >
                      Connect {state.walletName}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
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
            <div>
              <strong>{multiWallet.connectedCount > 0 ? `${multiWallet.connectedCount} Wallets Active` : "No active wallet sessions"}</strong>
              <span>All 4 ecosystems remain isolated. Disconnecting one wallet does not affect any other.</span>
            </div>
          </div>
        </section>

        <div className="account-inline-note">
          <AlertTriangle className="h-4 w-4" />
          <span>MAINNET NOTICE: HorizonX is strictly restricted to testnets (Sepolia, Devnet, TON Testnet, Shasta). Mainnet transactions are permanently prohibited.</span>
        </div>
      </div>
    </AccountWorkspace>
  );
}
