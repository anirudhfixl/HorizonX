import "@/components/airdrops/airdrops.css";
import "@/components/shared/entity-detail.css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import NotFoundPage from "@/pages/not-found/page";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAirdrop, useProject, useToken } from "@/api";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { calculateClaimProgress } from "@/lib/airdrop-storage";
import { ArrowLeft, ArrowUpRight, BarChart3, CircleAlert, FileCheck2, Gift, LockKeyhole, ShieldCheck, Users, Wallet } from "lucide-react";

function isOwner(ownerAddress: string | undefined, walletAddress: string | undefined) {
  if (!ownerAddress || !walletAddress) return false;
  const owner = ownerAddress.toLowerCase();
  const wallet = walletAddress.toLowerCase();
  const abbreviated = `0x${walletAddress.replace(/^0x/i, "").slice(0, 4)}...${walletAddress.slice(-4)}`.toLowerCase();
  const abbreviatedUnicode = `0x${walletAddress.replace(/^0x/i, "").slice(0, 4)}…${walletAddress.slice(-4)}`.toLowerCase();
  return owner === wallet || owner === abbreviated || owner === abbreviatedUnicode;
}

function formatDate(value?: string) {
  if (!value) return "Not configured";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

function OwnerMetric({ title, value, note, icon: Icon }: { title: string; value: string; note: string; icon: React.ElementType }) {
  return <article className="rounded-xl border border-border/70 bg-card/55 p-4"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">{title}</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/70 text-primary"><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></article>;
}

export default function AirdropOwnerDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useAirdrop(id);
  const { data: token } = useToken(campaign?.tokenId);
  const { data: project } = useProject(campaign?.projectId);
  const { isConnected, address, shortAddress } = useWallet();
  const { openModal } = useModal();

  if (!campaign) {
    if (isLoading) return <main className="airdrop-page w-full px-4 py-8 text-center text-sm text-muted-foreground">Loading owner workspace…</main>;
    return <NotFoundPage />;
  }

  const authorized = isConnected && isOwner(campaign.ownerAddress, address);
  const progress = calculateClaimProgress(campaign.claimedCount, campaign.recipientCount);

  return (
    <main className="airdrop-page entity-detail-page w-full max-w-none space-y-6 overflow-x-clip px-4 pb-16 pt-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "My campaigns", to: "/airdrops/my" }, { label: "Owner workspace" }]} />
      {!isConnected ? (
        <section className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-card/55 p-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-6 w-6" /></span><h1 className="mt-4 text-2xl font-semibold text-foreground">Connect your owner wallet</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This workspace is restricted to the wallet recorded as the campaign creator.</p><Button className="mt-5" onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</Button></section>
      ) : !authorized ? (
        <section className="mx-auto max-w-2xl rounded-2xl border border-amber-500/25 bg-card/55 p-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-300"><LockKeyhole className="h-6 w-6" /></span><h1 className="mt-4 text-2xl font-semibold text-foreground">Owner access not available</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The connected wallet ({shortAddress || address}) does not match the creator address stored for this campaign. No owner controls are exposed.</p><Button asChild variant="outline" className="mt-5"><Link to={`/airdrops/campaigns/${campaign.id}`}>Return to public campaign</Link></Button></section>
      ) : (
        <>
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-5">
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Campaign owner workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{campaign.title}</h1><div className="mt-3 flex flex-wrap items-center gap-2"><StatusBadge status={campaign.status} /><span className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">{campaign.network}</span><span className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">{campaign.type}</span></div></div>
            <div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to={`/airdrops/campaigns/${campaign.id}`}>Public campaign <ArrowUpRight className="ml-2 h-3.5 w-3.5" /></Link></Button><Button asChild size="sm"><Link to="/airdrops/my"><ArrowLeft className="mr-2 h-3.5 w-3.5" /> All my campaigns</Link></Button></div>
          </header>

          <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[.045] px-4 py-3"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /><div><p className="text-sm font-semibold text-foreground">Management controls are not connected to a production backend</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">This owner workspace presents the campaign records currently available to HorizonX. Editing recipient lists, publishing allocations, changing campaign state and initiating token distributions require authenticated backend endpoints and verified on-chain integrations. Those actions are intentionally not simulated here.</p></div></div>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><OwnerMetric title="Reward allocation" value={campaign.totalReward || "Not specified"} note="Recorded campaign pool" icon={Gift} /><OwnerMetric title="Recipients" value={(campaign.recipientCount ?? 0).toLocaleString()} note="Recorded eligible recipients" icon={Users} /><OwnerMetric title="Claims" value={(campaign.claimedCount ?? 0).toLocaleString()} note={`${progress}% recorded claim progress`} icon={BarChart3} /><OwnerMetric title="Campaign status" value={campaign.status.toUpperCase()} note={`Updated ${formatDate(campaign.updatedAt)}`} icon={FileCheck2} /></section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Performance</p><h2 className="mt-1 text-xl font-semibold text-foreground">Campaign analytics</h2><p className="mt-1 text-xs text-muted-foreground">Metrics available from the current campaign record.</p></div><BarChart3 className="h-5 w-5 text-primary" /></div><div className="mt-5"><div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">Claim completion</span><strong className="font-mono text-foreground">{progress}%</strong></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between gap-3 text-xs text-muted-foreground"><span>{(campaign.claimedCount ?? 0).toLocaleString()} claims</span><span>{(campaign.recipientCount ?? 0).toLocaleString()} recipients</span></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-border/50 p-3"><p className="text-xs text-muted-foreground">Start date</p><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(campaign.startTime)}</p></div><div className="rounded-lg border border-border/50 p-3"><p className="text-xs text-muted-foreground">End date</p><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(campaign.endTime)}</p></div></div><p className="mt-4 text-xs text-muted-foreground">Unique visitors, conversion rates, referral attribution and per-wallet activity are not available in the current data source.</p></section>

              <section className="rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Operations</p><h2 className="mt-1 text-xl font-semibold text-foreground">Campaign operations</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><OperationCard title="Eligibility management" description="Review recipient lists, eligibility rules and snapshot results." status="Backend integration required" /><OperationCard title="Reward distribution" description="Review allocation proofs, claim state and distribution batches." status="On-chain integration required" /><OperationCard title="Campaign configuration" description="Update metadata, schedule, campaign rules and official links." status="Authenticated editing unavailable" /><OperationCard title="Audit & activity log" description="Review administrative changes and campaign event history." status="Event log not connected" /></div></section>
            </div>

            <aside className="space-y-5"><section className="rounded-2xl border border-border/70 bg-card/45 p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h2 className="font-semibold text-foreground">Ownership & records</h2></div><dl className="mt-4 space-y-3 text-xs"><div><dt className="text-muted-foreground">Connected wallet</dt><dd className="mt-1 break-all font-mono text-foreground">{address}</dd></div><div><dt className="text-muted-foreground">Campaign creator</dt><dd className="mt-1 break-all font-mono text-foreground">{campaign.ownerAddress}</dd></div><div><dt className="text-muted-foreground">Project</dt><dd className="mt-1 text-foreground">{project?.name || "Not linked"}</dd></div><div><dt className="text-muted-foreground">Reward token</dt><dd className="mt-1 text-foreground">{token ? `${token.name} (${token.symbol})` : "Not linked"}</dd></div></dl></section><section className="rounded-2xl border border-border/70 bg-card/45 p-5"><h2 className="font-semibold text-foreground">Next implementation requirements</h2><ul className="mt-3 space-y-3 text-xs leading-relaxed text-muted-foreground"><li>01 · Authenticated campaign-owner API and authorization checks.</li><li>02 · Recipient import, validation and snapshot versioning.</li><li>03 · Auditable allocation/proof generation and secure storage.</li><li>04 · Contract read/write integration with transaction tracking.</li><li>05 · Campaign event stream and analytics aggregation.</li></ul></section></aside>
          </div>
        </>
      )}
    </main>
  );
}

function OperationCard({ title, description, status }: { title: string; description: string; status: string }) {
  return <article className="rounded-xl border border-border/60 bg-secondary/10 p-4"><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">{description}</p><span className="mt-3 inline-flex rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[10px] font-medium text-amber-200">{status}</span></article>;
}
