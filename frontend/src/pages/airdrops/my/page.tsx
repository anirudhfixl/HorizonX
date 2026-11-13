import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { useAirdrops } from "@/api";
import { getAirdropProvenance, calculateClaimProgress } from "@/lib/airdrop-storage";
import { ArrowUpRight, CalendarDays, TrendingUp, CircleAlert, Gift, Plus, Users, Wallet } from "lucide-react";

function matchesOwner(ownerAddress: string | undefined, address: string | undefined) {
  if (!ownerAddress || !address) return false;
  const owner = ownerAddress.toLowerCase();
  const full = address.toLowerCase();
  const abbreviated = `0x${address.replace(/^0x/i, "").slice(0, 4)}...${address.slice(-4)}`.toLowerCase();
  const abbreviatedUnicode = `0x${address.replace(/^0x/i, "").slice(0, 4)}…${address.slice(-4)}`.toLowerCase();
  return owner === full || owner === abbreviated || owner === abbreviatedUnicode;
}

function SummaryCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: React.ElementType }) {
  return <article className="rounded-xl border border-border/70 bg-card/55 p-4"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">{label}</p><span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/70 text-primary"><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></article>;
}

export default function MyAirdropsPage() {
  const { isConnected, address, shortAddress } = useWallet();
  const { openModal } = useModal();
  const { data: allCampaigns = [], isLoading } = useAirdrops();
  const campaigns = useMemo(() => allCampaigns.filter((item) => matchesOwner(item.ownerAddress, address)), [address, allCampaigns]);
  const active = campaigns.filter((item) => item.status === "active" || item.status === "live").length;
  const totalRecipients = campaigns.reduce((sum, item) => sum + (item.recipientCount || 0), 0);
  const totalClaims = campaigns.reduce((sum, item) => sum + (item.claimedCount || 0), 0);

  return (
    <main className="airdrop-page w-full max-w-none space-y-6 overflow-x-clip px-4 pb-16 pt-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "My campaigns" }]} />
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Campaign owner workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My campaigns</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Monitor campaign records associated with your connected creator wallet and open the management workspace for each campaign.</p></div><Button asChild><Link to="/airdrops/campaigns/create"><Plus className="mr-2 h-4 w-4" /> Create campaign</Link></Button></header>

      {!isConnected ? <EmptyState icon={<Wallet className="h-7 w-7 text-primary" />} title="Connect your owner wallet" description="Connect the wallet used to create a campaign. HorizonX will only show campaign records whose stored creator address matches the connected wallet." action={<Button size="sm" onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</Button>} /> : isLoading ? <div className="py-16 text-center text-sm text-muted-foreground">Loading your campaign records…</div> : campaigns.length === 0 ? <EmptyState icon={<Gift className="h-7 w-7 text-primary" />} title="No campaigns found for this wallet" description="No catalog or browser-session campaign has a creator address matching this wallet. Campaigns created in this browser may be temporary and are not automatically available across devices." action={<Button asChild size="sm"><Link to="/airdrops/campaigns/create">Create an airdrop</Link></Button>} /> : <>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/10 px-4 py-3"><div><p className="text-xs text-muted-foreground">Connected creator wallet</p><p className="mt-1 font-mono text-sm font-semibold text-foreground">{shortAddress || address}</p></div><span className="rounded-md border border-emerald-500/25 bg-emerald-500/5 px-2.5 py-1 text-xs text-emerald-300">Wallet connected</span></div>
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard label="Your campaigns" value={campaigns.length.toLocaleString()} note="Matching creator records" icon={Gift} /><SummaryCard label="Active campaigns" value={active.toLocaleString()} note="Currently marked active" icon={TrendingUp} /><SummaryCard label="Recorded recipients" value={totalRecipients.toLocaleString()} note="Across your campaigns" icon={Users} /><SummaryCard label="Recorded claims" value={totalClaims.toLocaleString()} note="Across your campaigns" icon={CalendarDays} /></section>
        <section className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-3"><div><h2 className="text-lg font-semibold text-foreground">Campaign portfolio</h2><p className="mt-1 text-xs text-muted-foreground">Open the owner workspace for campaign-level metrics and operational readiness.</p></div><span className="font-mono text-xs text-muted-foreground">{campaigns.length} records</span></div>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{campaigns.map((campaign) => { const progress = calculateClaimProgress(campaign.claimedCount, campaign.recipientCount); return <article key={campaign.id} className="flex min-w-0 flex-col rounded-xl border border-border/70 bg-card/50 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge status={campaign.status} /><ProvenanceBadge kind={getAirdropProvenance(campaign)} /></div><div className="mt-4 min-w-0"><h3 className="line-clamp-2 text-base font-semibold text-foreground">{campaign.title}</h3><p className="mt-1 text-xs text-muted-foreground">{campaign.network} · {campaign.category || campaign.type}</p></div><div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-secondary/15 p-3"><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Reward pool</p><p className="mt-1 break-words text-sm font-semibold text-emerald-400">{campaign.totalReward || "Not specified"}</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recipients</p><p className="mt-1 text-sm font-semibold text-foreground">{campaign.recipientCount?.toLocaleString() || "—"}</p></div></div><div className="mt-4 space-y-2"><div className="flex justify-between text-xs text-muted-foreground"><span>Recorded claim progress</span><strong className="text-foreground">{progress}%</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div></div><p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{campaign.startTime ? new Date(campaign.startTime).toLocaleDateString() : "Start date not set"}</p><div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/50 pt-4"><Button asChild size="sm" variant="outline"><Link to={`/airdrops/campaigns/${campaign.id}`}>Public page <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button><Button asChild size="sm"><Link to={`/airdrops/my/${campaign.id}`}>Manage <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button></div></article>; })}</div>
        </section>
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[.035] p-4 text-xs leading-relaxed text-muted-foreground"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /><p><strong className="text-foreground">Operational limitation:</strong> campaign records and metrics are currently sourced from HorizonX catalog/session data. Editing campaign configuration, managing recipient eligibility and executing token distributions require production backend and on-chain integrations.</p></div>
      </>}
    </main>
  );
}
