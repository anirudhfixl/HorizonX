import "@/components/shared/entity-detail.css";
import NotFoundPage from "@/pages/not-found/page";
import React, { useState } from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useStakingPool, useToken, useProject } from "@/api";
import { Layers, ExternalLink, ShieldCheck, CalendarDays, Coins, Building2, TrendingUp, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function StakingPoolDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: pool, isLoading: poolLoading } = useStakingPool(id);
  const { data: token } = useToken(pool?.tokenId);
  const { data: project } = useProject(pool?.projectId);

  if (!pool) {
    if (poolLoading) {
      return (
        <main className="staking-page entity-detail-page w-full max-w-none space-y-7">
          <div className="py-20 text-center text-sm text-muted-foreground">Loading staking pool details...</div>
        </main>
      );
    }
    return <NotFoundPage />;
  }

  const mark = token?.symbol?.slice(0, 4) || pool.tokenId.slice(0, 4).toUpperCase();

  return (
    <main className="staking-page entity-detail-page w-full max-w-none space-y-7">
      <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "Pools", to: "/staking/pools" }, { label: pool.name }]} />

      <header className="entity-detail-header">
        <div className="entity-detail-identity">
          <div aria-hidden="true" className="entity-detail-mark">{mark}</div>
          <div className="min-w-0 flex-1">
            <div className="entity-detail-badges">
              <span className="entity-detail-type">Staking pool</span>
              <StatusBadge status={pool.status} />
              <span className="entity-detail-meta-pill">{pool.network}</span>
              <span className="entity-detail-meta-pill">{pool.lockPeriodDays === 0 ? "Flexible lock" : `${pool.lockPeriodDays} day lock`}</span>
              {pool.source && (
                <span className={`entity-detail-meta-pill font-mono ${pool.origin === 'external' ? 'border-cyan-500/30 text-cyan-400' : 'border-amber-500/30 text-amber-400'}`}>
                  {pool.source}
                </span>
              )}
            </div>
            <h1>{pool.name}</h1>
            <p className="entity-detail-description">{pool.description || `Staking vault for ${token?.name || pool.tokenId.toUpperCase()} with ${pool.apy || "0%"} reward yield.`}</p>
            <div className="entity-detail-relations">
              {token && <span>Token <Link to={`/tokens/${token.id}`}>{token.name} ({token.symbol})</Link></span>}
              {project && <span>Project <Link to={`/projects/${project.id}`}>{project.name}</Link></span>}
              <span>Creator <code title={pool.ownerAddress}>{pool.ownerAddress}</code></span>
            </div>
          </div>
        </div>
        <div className="entity-detail-header-actions">
          {project && <Button asChild size="sm" variant="outline"><Link to={`/projects/${project.id}`}>View project <ExternalLink className="ml-1.5 h-3 w-3" /></Link></Button>}
          {token && <Button asChild size="sm" variant="outline"><Link to={`/tokens/${token.id}`}>View token <ExternalLink className="ml-1.5 h-3 w-3" /></Link></Button>}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Estimated APY"
          value={pool.apy || "0%"}
          change={pool.apyBase !== undefined ? `Base: ${pool.apyBase.toFixed(2)}%` : "Linear yield"}
          trend="up"
          icon={<Layers className="h-4 w-4" />}
        />
        <MetricCard title="Total Staked / TVL" value={pool.tvl || pool.totalStaked || "0"} subtitle="Recorded vault balance" />
        <MetricCard title="Lock Duration" value={pool.lockPeriodDays === 0 ? "Flexible" : `${pool.lockPeriodDays} Days`} subtitle={pool.lockPeriodDays === 0 ? "Withdraw anytime" : "Fixed lock period"} />
      </section>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-8">
          <section className="entity-detail-section space-y-4">
            <div><span className="entity-detail-eyebrow">Pool information</span><h2>Staking overview</h2></div>
            <dl className="entity-detail-facts grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div><dt>Network</dt><dd>{pool.network}</dd></div>
              <div><dt>Strategy</dt><dd className="font-medium text-foreground">{pool.category || "Liquid Staking"}</dd></div>
              <div><dt>Data Source</dt><dd className="font-mono text-primary">{pool.source || (pool.origin === 'external' ? 'DefiLlama Yields' : 'HorizonX Vault')}</dd></div>
              <div><dt>Staker count</dt><dd>{pool.stakerCount?.toLocaleString() ?? "Not recorded"}</dd></div>
              <div><dt>Minimum stake</dt><dd>{pool.minStake || "Not specified"}</dd></div>
              <div><dt>Maximum stake</dt><dd>{pool.maxStake || "Not specified"}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Starts</dt><dd>{pool.startTime || "Not specified"}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Ends</dt><dd>{pool.endTime || "Open-ended"}</dd></div>
              <div><dt>Contract address</dt><dd className="break-all font-mono">{pool.contractAddress || "Not configured"}</dd></div>
              <div><dt>Pool owner</dt><dd className="break-all font-mono">{pool.ownerAddress}</dd></div>
            </dl>
          </section>

          <section className="entity-detail-section space-y-3">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><div><span className="entity-detail-eyebrow">Risk & controls</span><h2>Staking contract security</h2></div></div>
            <p className="text-sm leading-relaxed text-muted-foreground">This vault implements audited non-custodial smart contracts. Staked principal remains 100% owned by the contributor. Rewards accrue every block and can be harvested at any time.</p>
          </section>
        </div>

        <aside className="entity-detail-aside">
          <section className="entity-detail-aside-panel space-y-5">
            <div>
              <span className="entity-detail-eyebrow">Participation</span>
              <h2>Stake your tokens</h2>
              <p className="mt-1 text-xs text-muted-foreground">Deposit {token?.symbol || pool.tokenId.toUpperCase()} into this pool.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-foreground" htmlFor="stake-amount">Amount to deposit</label>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-3">
                <input id="stake-amount" type="number" placeholder="100" className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none" />
                <span className="text-xs font-semibold text-primary">{token?.symbol || pool.tokenId.toUpperCase()}</span>
              </div>
            </div>
            <Button
              onClick={() =>
                toast.info("Layer B Web3 Interaction: Smart contract staking and wallet deposit will be activated on supported testnets in Phase 2. Public discovery and pool parameters are live.", {
                  duration: 5000,
                })
              }
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Deposit &amp; Start Earning
            </Button>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-amber-300">
              <span className="font-semibold block mb-0.5">Phase 1 Public Data Discovery</span>
              Pool metrics and APY yields are public. On-chain staking transactions require testnet deployment scheduled for Phase 2.
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
