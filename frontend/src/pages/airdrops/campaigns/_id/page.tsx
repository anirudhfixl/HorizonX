import "@/components/airdrops/airdrops.css";
import "@/components/shared/entity-detail.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useMemo, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "@/pages/not-found/page";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { Button } from "@/components/ui/button";
import { AIRDROPS, PROJECTS, TOKENS } from "@/data";
import {
  readSessionAirdropsRaw,
  subscribeSessionAirdrops,
  parseSessionAirdrops,
  getAirdropProvenance,
  calculateClaimProgress,
} from "@/lib/airdrop-storage";
import { CalendarDays, CircleAlert, ExternalLink, Gift, Network, Users, ShieldCheck, ArrowUpRight } from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

export default function AirdropDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const sessionRaw = useSyncExternalStore(subscribeSessionAirdrops, readSessionAirdropsRaw, () => "");
  const airdrop = useMemo(() => {
    const sessionItems = parseSessionAirdrops(sessionRaw);
    return sessionItems.find((item) => item.id === id) ?? AIRDROPS.find((item) => item.id === id);
  }, [id, sessionRaw]);

  if (!airdrop) return <NotFoundPage />;

  const token = TOKENS.find((item) => item.id === airdrop.tokenId);
  const project = airdrop.projectId ? PROJECTS.find((item) => item.id === airdrop.projectId) : undefined;
  const progress = calculateClaimProgress(airdrop.claimedCount, airdrop.recipientCount);
  const provenance = getAirdropProvenance(airdrop);
  const mark = token?.symbol?.slice(0, 4) || airdrop.tokenId.slice(0, 4).toUpperCase();

  return (
    <main className="airdrop-page entity-detail-page w-full max-w-none px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Campaigns", to: "/airdrops/campaigns" }, { label: airdrop.title }]} />

      <header className="entity-detail-header">
        <div className="entity-detail-identity">
          <div aria-hidden="true" className="entity-detail-mark">{mark}</div>
          <div className="min-w-0 flex-1">
            <div className="entity-detail-badges">
              <span className="entity-detail-type">Airdrop campaign</span>
              <StatusBadge status={airdrop.status} />
              <ProvenanceBadge kind={provenance} />
              <span className="entity-detail-meta-pill">{airdrop.network}</span>
              <span className="entity-detail-meta-pill">{airdrop.type}</span>
            </div>
            <h1>{airdrop.title}</h1>
            {airdrop.description && <p className="entity-detail-description">{airdrop.description}</p>}
            <div className="entity-detail-relations">
              {token && <span>Token <Link to={`/tokens/${token.id}`}>{token.name} ({token.symbol})</Link></span>}
              {project && <span>Project <Link to={`/projects/${project.id}`}>{project.name}</Link></span>}
              <span>Creator <code title={airdrop.ownerAddress}>{airdrop.ownerAddress}</code></span>
            </div>
          </div>
        </div>
        <div className="entity-detail-header-actions">
          {project && <Button asChild size="sm" variant="outline"><Link to={`/projects/${project.id}`}>View project <ExternalLink className="ml-1.5 h-3 w-3" /></Link></Button>}
          <Button asChild size="sm" variant="outline"><Link to="/airdrops/campaigns">All campaigns <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button>
        </div>
      </header>

      <div className="flex items-start gap-3 border-l-2 border-amber-400/70 py-1 pl-3 text-xs leading-relaxed text-muted-foreground">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p><strong className="text-foreground">Demonstration data.</strong> This record is stored in the local catalog or browser session. It is not proof of a live on-chain distribution, allocation, or claim availability.</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Reward Pool" value={airdrop.totalReward || "Not specified"} subtitle="Campaign allocation" icon={<Gift className="h-4 w-4" />} />
        <MetricCard title="Eligible Recipients" value={airdrop.recipientCount?.toLocaleString() || "Not specified"} subtitle="Recorded recipient count" icon={<Users className="h-4 w-4" />} />
        <MetricCard title="Claims Recorded" value={airdrop.claimedCount?.toLocaleString() || "0"} subtitle={`${progress}% of recorded recipients`} trend={progress > 0 ? "up" : "neutral"} />
        <MetricCard title="Distribution Model" value={airdrop.type.toUpperCase()} subtitle={airdrop.network} icon={<Network className="h-4 w-4" />} />
      </section>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <section className="entity-detail-section space-y-6" aria-labelledby="distribution-title">
            <div className="entity-detail-section-heading">
              <div><span className="entity-detail-eyebrow">Campaign</span><h2 id="distribution-title">Distribution overview</h2></div>
              {project && <Link className="entity-detail-inline-link" to={`/projects/${project.id}`}>View project <ExternalLink className="h-3 w-3" /></Link>}
            </div>
            <p className="text-sm text-muted-foreground">{project?.name || "Project not linked"}{token ? ` · ${token.name} (${token.symbol})` : ""}</p>
            <dl className="entity-detail-facts grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div><dt><Network className="h-3.5 w-3.5" /> Network</dt><dd>{airdrop.network}</dd></div>
              <div><dt>Campaign category</dt><dd>{airdrop.category || "Uncategorized"}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Starts</dt><dd>{formatDate(airdrop.startTime)}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Ends</dt><dd>{formatDate(airdrop.endTime)}</dd></div>
            </dl>
          </section>

          <section className="entity-detail-section space-y-4" aria-labelledby="claim-progress-title">
            <div className="entity-detail-section-heading"><div><span className="entity-detail-eyebrow">Distribution status</span><h2 id="claim-progress-title">Claim progress</h2></div><span className="font-mono text-sm font-semibold text-foreground">{progress}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} /></div>
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{(airdrop.claimedCount || 0).toLocaleString()} recorded claims</span><span>{(airdrop.recipientCount || 0).toLocaleString()} recorded recipients</span></div>
          </section>

          <section className="entity-detail-section space-y-4" aria-labelledby="distribution-config-title">
            <div><span className="entity-detail-eyebrow">Technical details</span><h2 id="distribution-config-title">Distribution configuration</h2></div>
            <dl className="entity-detail-facts grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div><dt>Campaign ID</dt><dd className="font-mono break-all">{airdrop.id}</dd></div>
              <div><dt>Creator address</dt><dd className="font-mono break-all">{airdrop.ownerAddress}</dd></div>
              <div><dt>Contract address</dt><dd className="font-mono break-all">{airdrop.contractAddress || "Not configured"}</dd></div>
              <div><dt>Merkle root</dt><dd className="font-mono break-all">{airdrop.merkleRoot || "Not applicable / not configured"}</dd></div>
            </dl>
          </section>
        </div>

        <aside className="entity-detail-aside space-y-6">
          <section className="entity-detail-aside-panel space-y-4">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h2>Verification & trust</h2></div>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-200">Not independently verified</div>
            <p className="text-xs leading-relaxed text-muted-foreground">A catalog entry, session record, or displayed Merkle root does not establish that a contract is deployed, audited, or safe. Verify the campaign through its official project channels before interacting with a wallet.</p>
          </section>
          <section className="entity-detail-aside-panel space-y-3">
            <h2>Next steps</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Eligibility and claim execution require a verified backend/on-chain integration. The current frontend does not independently verify wallet allocations.</p>
            <Button asChild className="w-full"><Link to="/airdrops/claim">Open claim checker</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/airdrops">Back to Airdrop Hub</Link></Button>
          </section>
        </aside>
      </div>
    </main>
  );
}
