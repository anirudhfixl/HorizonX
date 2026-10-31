"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { useWallet } from "@/contexts/wallet-context";
import { cn } from "@/lib/utils";
import type { Token, TokenMarketData, Project } from "@/types";
import {
  getExplorerBaseUrl,
  isSepoliaNetwork,
  toneFor,
} from "./token-profile";
import {
  BookOpen,
  FileCode2,
  Activity,
  ExternalLink,
  Share2,
  Check,
  ChevronRight,
  Sliders,
} from "lucide-react";

export type DetailTab = "overview" | "contract" | "activity";

interface TokenDetailShellProps {
  token: Token & { market?: TokenMarketData };
  project?: Project;
  activeTab: DetailTab;
  children: React.ReactNode;
}

const VERIFICATION_LABELS: Record<string, string> = {
  not_reviewed: "Not reviewed",
  project_reviewed: "Project reviewed",
  contract_source_verified: "Source verified",
  audit_available: "Audit available",
};

export function TokenDetailShell({
  token,
  project,
  activeTab,
  children,
}: TokenDetailShellProps) {
  const { isConnected, address: userAddress } = useWallet();
  const [copiedLink, setCopiedLink] = useState(false);

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);
  const tone = toneFor(token.category);
  const verifStatus = token.verificationStatus || "not_reviewed";
  const verifLabel = VERIFICATION_LABELS[verifStatus] || "Catalog Record";

  const isOwner =
    isConnected &&
    Boolean(userAddress) &&
    Boolean(token.creatorAddress) &&
    userAddress?.toLowerCase() === token.creatorAddress?.toLowerCase();

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success("Link Copied", { description: window.location.href });
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        toast.error("Copy Failed", { description: "Clipboard access was denied by the browser." });
      }
    }
  };

  const navTabs: { id: DetailTab; label: string; href: string; icon: React.ElementType }[] = [
    {
      id: "overview",
      label: "Overview",
      href: `/tokens/${token.id}`,
      icon: BookOpen,
    },
    {
      id: "contract",
      label: "Contract & Source",
      href: `/tokens/${token.id}/contract`,
      icon: FileCode2,
    },
    {
      id: "activity",
      label: "Activity & Provenance",
      href: `/tokens/${token.id}/activity`,
      icon: Activity,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 space-y-8">
      {/* ─── 1. Breadcrumb ──────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/tokens" className="transition-colors hover:text-foreground">Tokens</Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span aria-current="page" className="text-foreground font-medium">
          {token.name} ({token.symbol})
        </span>
      </nav>

      {/* ─── 2. Token Identity Header ────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-secondary/40 via-secondary/15 to-transparent p-6 sm:p-8 lg:p-10">
        <div
          aria-hidden
          className={cn("pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-50", tone.glow)}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* Identity Left */}
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div
              aria-hidden
              className={cn(
                "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br font-mono text-xl font-bold tracking-tight shadow-md sm:h-24 sm:w-24 sm:text-2xl",
                tone.tile
              )}
            >
              {token.symbol.slice(0, 4)}
            </div>

            {/* Info */}
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-primary">
                  {token.category || "General"} · {token.standard || "ERC-20"}
                </span>
                {project && (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Project: {project.name}</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {token.name}
                </h1>
                <span className="font-mono text-base font-medium text-muted-foreground sm:text-lg">
                  ${token.symbol}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ProvenanceBadge kind="catalog" />
                <StatusBadge status={token.status} />
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
                    sepolia
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/40 text-muted-foreground"
                  )}
                >
                  {sepolia ? "Ethereum Sepolia" : token.network}
                </span>
                <span className="rounded-full border border-border/50 bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {verifLabel}
                </span>
                {isOwner && (
                  <Link
                    href="/tokens/my"
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <span>Created by your wallet</span>
                    <Sliders className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {/* Compact Contract Address row */}
              {token.contractAddress && (
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-muted-foreground">
                  <span className="text-[11px] font-sans text-muted-foreground/80">Contract:</span>
                  <span className="break-all">{token.contractAddress}</span>
                  <CopyButton value={token.contractAddress} label={`${token.symbol} contract address`} />
                  <a
                    href={`${explorerBase}/token/${token.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${token.symbol} on block explorer`}
                    className="inline-flex items-center gap-1 rounded p-0.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Open explorer</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar Right */}
          <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
            <Button asChild size="sm" className="h-9 gap-1.5 bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm">
              <Link href={`/exchange/tokens/${token.id}`}>
                Trade {token.symbol}
              </Link>
            </Button>

            {token.contractAddress && (
              <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground">
                <a href={`${explorerBase}/token/${token.contractAddress}`} target="_blank" rel="noopener noreferrer">
                  <span>Explorer</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 gap-1.5 border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </Button>

            {isOwner && (
              <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 border-emerald-500/40 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/tokens/my">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Manage</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ─── 3. Contextual Navigation Tabs ───────────────────────────────── */}
      <nav aria-label="Token detail views" className="border-b border-border/40">
        <ul className="-mb-px flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <li key={tab.id} className="shrink-0">
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── 4. Page Content Slot ────────────────────────────────────────── */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}
