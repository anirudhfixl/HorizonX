"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  User,
  ShieldCheck,
  Wallet,
  Settings,
  Lock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function AccountOverviewPage() {
  const { isConnected, shortAddress, address, balance, network } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Account & Security"
        description="Manage your Web3 identity, multi-wallet connections, verification tier, and notification preferences."
        breadcrumbs={[{ label: "Account" }]}
      />

      {/* Profile Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white font-bold text-2xl shadow-lg shadow-primary/20">
            {isConnected ? "0x" : "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {isConnected ? "Web3 Contributor" : "Anonymous Explorer"}
              </h2>
              {isConnected && (
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Wallet Verified
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {isConnected ? shortAddress : "No wallet connected"}
            </p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <Button asChild size="sm" variant="outline" className="text-xs border-border/60">
              <Link href="/account/edit">Edit Profile</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => openModal("CONNECT_WALLET")}
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden divide-y divide-border/40 backdrop-blur-md">
        <Link
          href="/account/wallets"
          className="flex items-center justify-between p-4.5 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Wallet Connections</p>
              <p className="text-xs text-muted-foreground">
                Manage primary address, cold storage signers, and switch networks.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          href="/account/verification"
          className="flex items-center justify-between p-4.5 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Identity & KYC Verification</p>
              <p className="text-xs text-muted-foreground">
                Developer verification levels, trust badges, and jurisdictional compliance.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          href="/account/preferences"
          className="flex items-center justify-between p-4.5 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-violet-400">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Preferences & Notifications</p>
              <p className="text-xs text-muted-foreground">
                Default gas presets, display currencies, and presale push alerts.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          href="/account/security"
          className="flex items-center justify-between p-4.5 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Security Settings</p>
              <p className="text-xs text-muted-foreground">
                Session expiration, signature allowances, and multi-factor authentication.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
