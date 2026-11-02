import "@/components/launchpad/launchpad.css";
import { LaunchpadWorkspaceHeader } from "@/components/launchpad/launchpad-section-nav";
import React, { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { NetworkChip } from "@/components/shared/network-chip";
import { CopyButton } from "@/components/projects/copy-button";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { getExplorerBaseUrl, toneFor } from "@/components/tokens/token-profile";
import { isAuthorizedCreator } from "@/lib/presale-detail";
import { cn } from "@/lib/utils";
import type { PresaleStatus, Project, Token } from "@/types";
import {
  ExternalLink,
  Share2,
  Check,
  BookOpen,
  FileSpreadsheet,
  ShieldAlert,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";

export type LaunchpadDetailTab = "overview" | "terms" | "management";

export interface LaunchpadDetailTabItem {
  id: LaunchpadDetailTab;
  label: string;
  icon?: React.ElementType;
  badge?: string | number;
  disabled?: boolean;
}

export interface LaunchpadDetailShellProps {
  kind: "presale" | "fair";
  id: string;
  title: string;
  description?: string;
  status: PresaleStatus | string;
  network: string;
  category?: string;
  ownerAddress: string;
  provenance: "catalog" | "session";
  isSimulated?: boolean;
  token?: Token;
  project?: Project;
  contractAddress?: string;
  activeTab: LaunchpadDetailTab;
  onTabChange: (tab: LaunchpadDetailTab) => void;
  headerAside?: React.ReactNode;
  children: React.ReactNode;
}

function shortenAddress(addr: string): string {
  if (!addr) return "—";
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function LaunchpadDetailShell({
  kind,
  title,
  description,
  status,
  network,
  category,
  ownerAddress,
  provenance,
  isSimulated: _isSimulated = true,
  token,
  project,
  contractAddress,
  activeTab,
  onTabChange,
  headerAside,
  children,
}: LaunchpadDetailShellProps) {
  const { isConnected, address: userAddress } = useWallet();
  const [copiedLink, setCopiedLink] = useState(false);

  const tone = toneFor(token?.category ?? category);
  const explorerBase = getExplorerBaseUrl(network);
  const isCreator = isAuthorizedCreator(ownerAddress, userAddress, isConnected);

  const tileText = (token?.symbol ?? title).slice(0, 4).toUpperCase();
  const directoryLabel = kind === "presale" ? "Presales" : "Fair Launches";
  const directoryHref = kind === "presale" ? "/launchpad/presales" : "/launchpad/launches";

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

  const navTabs: { id: LaunchpadDetailTab; label: string; icon: React.ElementType; badge?: string }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BookOpen,
    },
    {
      id: "terms",
      label: "Allocation & Terms",
      icon: FileSpreadsheet,
    },
    {
      id: "management",
      label: "Creator Management",
      icon: isCreator ? Crown : ShieldAlert,
      badge: isCreator ? "Creator" : undefined,
    },
  ];

  return (
    <div className={cn("launchpad-page launchpad-detail-shell mx-auto w-full max-w-none px-4 pb-16 pt-6 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-8", "launchpad-detail-shell--detail")}>
      <LaunchpadWorkspaceHeader items={[{ label: "Launchpad", to: "/launchpad" }, { label: directoryLabel, to: directoryHref }, { label: title }]} />

      {/* ─── 2. Launch identity: shared token-style open header for individual launches ─── */}
      {kind === "fair" || kind === "presale" ? (
        <>
          <header className="lf-detail-head">
            <div className="lf-detail-identity">
              <div aria-hidden="true" className={cn("lf-detail-mark", tone.tile)}>{tileText}</div>
              <div className="lf-detail-copy">
                <div className="lf-detail-badges">
                  <span className="lf-detail-type">{kind === "presale" ? "Presale" : "Fair launch"}</span>
                  <StatusBadge status={status} />
                  <NetworkChip network={network} />
                  <ProvenanceBadge kind={provenance} />
                  {category && <span className="lf-detail-category">{category}</span>}
                </div>
                <h1>{title}</h1>
                {description && <p className="lf-detail-description">{description}</p>}
                <div className="lf-detail-relations">
                  {token && <span>Token <Link to={`/tokens/${token.id}`}>{token.name} ({token.symbol})</Link></span>}
                  {project && <span>Project <Link to={`/projects/${project.id}`}>{project.name}</Link></span>}
                  <span>Creator <code title={ownerAddress}>{shortenAddress(ownerAddress)}</code><CopyButton value={ownerAddress} label="creator address" /></span>
                  {isCreator && <span className="lf-detail-creator"><Crown className="h-3 w-3" /> You are creator</span>}
                </div>
              </div>
            </div>
            <div className="lf-detail-head-aside">
              {headerAside}
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs font-medium border-border/60 hover:bg-secondary/50">
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Copied" : "Share"}</span>
              </Button>
              {contractAddress && explorerBase && (
                <a href={`${explorerBase}/address/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                  Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </header>

          <nav aria-label="Launch sections" className="lf-detail-tabs">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} aria-current={isActive ? "page" : undefined}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{tab.label}</span>
                  {tab.badge && <span className="lf-detail-tab-badge">{tab.badge}</span>}
                </button>
              );
            })}
          </nav>
        </>
      ) : (
        <header className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-secondary/40 via-secondary/15 to-transparent p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.5)]">
          <div aria-hidden className={cn("pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-40", tone.glow)} />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
              <div aria-hidden className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br font-mono text-xl font-bold tracking-tight shadow-md sm:h-24 sm:w-24 sm:text-2xl", tone.tile)}>{tileText}</div>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">{kind === "presale" ? "Presale" : "Fair Launch"}</span>
                  <StatusBadge status={status} /><NetworkChip network={network} /><ProvenanceBadge kind={provenance} />
                  {category && <span className="text-muted-foreground/80 font-medium">· {category}</span>}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{title}</h1>
                {description && <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-none">{description}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                  {token && <div className="flex items-center gap-1.5"><span>Token:</span><Link to={`/tokens/${token.id}`} className="font-medium text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline">{token.name} ({token.symbol})</Link></div>}
                  {project && <div className="flex items-center gap-1.5"><span>· Project:</span><Link to={`/projects/${project.id}`} className="font-medium text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline">{project.name}</Link></div>}
                  <div className="flex items-center gap-1.5"><span>· Creator:</span><span className="font-mono text-foreground" title={ownerAddress}>{shortenAddress(ownerAddress)}</span><CopyButton value={ownerAddress} label="creator address" /></div>
                  {isCreator && <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary"><Crown className="h-2.5 w-2.5" />You are Creator</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
              {headerAside}
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs font-medium border-border/60 hover:bg-secondary/50" title="Share launchpad link">
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Copied" : "Share"}</span>
              </Button>
              {contractAddress && explorerBase && <a href={`${explorerBase}/address/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors" title="View contract on block explorer">Explorer <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
          </div>
          <nav aria-label="Launch sections" className="mt-8 flex flex-wrap gap-2 border-t border-border/40 pt-5 text-sm">
            {navTabs.map((tab) => {
              const Icon = tab.icon; const isActive = activeTab === tab.id;
              return <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} aria-current={isActive ? "page" : undefined} className={cn("relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all text-xs sm:text-sm", isActive ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden /><span>{tab.label}</span>
                {tab.badge && <span className={cn("ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold uppercase", isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary")}>{tab.badge}</span>}
              </button>;
            })}
          </nav>
        </header>
      )}

      {/* ─── 4. Active Tab Content ──────────────────────────────────────────── */}
      <main className="space-y-10">{children}</main>
    </div>
  );
}
