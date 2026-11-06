import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useMemo, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { useAirdrops } from "@/api";
import { getAirdropProvenance, calculateClaimProgress } from "@/lib/airdrop-storage";
import { Gift, Plus, Wallet, ArrowUpRight, CalendarDays } from "lucide-react";

export default function MyAirdropsPage() {
  const { isConnected, address } = useWallet();
  const { openModal } = useModal();
  const { data: allCampaigns = [] } = useAirdrops();

  const campaigns = useMemo(() => {
    if (!address) return [];
    return allCampaigns.filter((item) => item.ownerAddress?.toLowerCase() === address.toLowerCase());
  }, [address, allCampaigns]);

  return (
    <main className="airdrop-page w-full max-w-none px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "My campaigns" }]} />
      <PageHeader
        title="My Airdrop Campaigns"
        description="Campaigns associated with the currently connected wallet."
        breadcrumbs={[{ label: "Airdrops", href: "/airdrops" }, { label: "My Campaigns" }]}
        actions={<Button asChild size="sm"><Link to="/airdrops/campaigns/create"><Plus className="mr-1.5 h-3.5 w-3.5" /> Launch campaign</Link></Button>}
      />

      {!isConnected ? (
        <EmptyState icon={<Wallet className="h-7 w-7 text-primary" />} title="Connect your wallet" description="Connect the wallet used to create campaigns. Only matching campaign owner addresses will appear here." action={<Button size="sm" onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</Button>} />
      ) : campaigns.length === 0 ? (
        <EmptyState icon={<Gift className="h-7 w-7 text-primary" />} title="No campaigns found for this wallet" description="No catalog or browser-session campaign has an owner address matching the connected wallet. Campaigns created in this browser are temporary and may not persist across devices." action={<Button asChild size="sm"><Link to="/airdrops/campaigns/create">Create an airdrop</Link></Button>} />
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-foreground">Your campaigns</h2><p className="text-sm text-muted-foreground">{campaigns.length} matching records</p></div></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {campaigns.map((campaign) => {
              const progress = calculateClaimProgress(campaign.claimedCount, campaign.recipientCount);
              return <article key={campaign.id} className="flex min-w-0 flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge status={campaign.status} /><ProvenanceBadge kind={getAirdropProvenance(campaign)} /></div>
                  <div><h3 className="line-clamp-2 text-base font-semibold text-foreground">{campaign.title}</h3><p className="mt-1 text-xs text-muted-foreground">{campaign.network} · {campaign.type}</p></div>
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/40 bg-secondary/20 p-3">
                    <div><p className="text-[11px] text-muted-foreground">Reward pool</p><p className="mt-1 text-sm font-semibold text-emerald-400">{campaign.totalReward || "Not specified"}</p></div>
                    <div><p className="text-[11px] text-muted-foreground">Recipients</p><p className="mt-1 text-sm font-semibold text-foreground">{campaign.recipientCount?.toLocaleString() || "—"}</p></div>
                  </div>
                  <div className="space-y-1.5"><div className="flex justify-between text-xs text-muted-foreground"><span>Recorded claim progress</span><span>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div></div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{campaign.startTime ? new Date(campaign.startTime).toLocaleDateString() : "Start date not set"}</p>
                </div>
                <div className="mt-5 border-t border-border/50 pt-4"><Button asChild size="sm" variant="outline" className="w-full"><Link to={`/airdrops/campaigns/${campaign.id}`}>Manage campaign <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button></div>
              </article>;
            })}
          </div>
        </section>
      )}
    </main>
  );
}
