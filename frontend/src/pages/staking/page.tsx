import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useStakingPools } from "@/api";
import {
  Layers,
  ShieldCheck,
  TrendingUp,
  Users,
  ArrowUpRight,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Activity,
  Network,
  Trophy,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const parseApy = (value?: string) => {
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatApy = (value?: string) => value || "—";

export default function StakingDashboardPage() {
  const { data: pools = [] } = useStakingPools();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const metrics = useMemo(() => {
    const activePools = pools.filter((pool) => pool.status === "active");
    const totalStakers = pools.reduce((total, pool) => total + (pool.stakerCount || 0), 0);
    const sortedByApy = [...pools].sort((a, b) => parseApy(b.apy) - parseApy(a.apy));
    const highestApyPool = sortedByApy[0];
    const topApyPools = sortedByApy.slice(0, 3);
    const topParticipationPools = [...pools]
      .sort((a, b) => (b.stakerCount || 0) - (a.stakerCount || 0))
      .slice(0, 3);
    const statusCounts = {
      active: pools.filter((pool) => pool.status === "active").length,
      pending: pools.filter((pool) => pool.status === "pending").length,
      ended: pools.filter((pool) => pool.status === "ended").length,
      draft: pools.filter((pool) => pool.status === "draft").length,
    };
    const flexiblePools = pools.filter((pool) => !pool.lockPeriodDays || pool.lockPeriodDays === 0).length;
    const networks = new Map<string, number>();

    pools.forEach((pool) => {
      networks.set(pool.network, (networks.get(pool.network) || 0) + 1);
    });

    const topNetwork = [...networks.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      activePools,
      totalStakers,
      highestApyPool,
      topApyPools,
      topParticipationPools,
      statusCounts,
      flexiblePools,
      lockedPools: pools.length - flexiblePools,
      topNetwork,
    };
  }, [pools]);

  const totalPages = Math.max(1, Math.ceil(pools.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visiblePools = pools.slice(startIndex, startIndex + pageSize);
  const endIndex = Math.min(startIndex + pageSize, pools.length);

  return (
    <main className="staking-page space-y-8">
      <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "Overview" }]} />

      <PageHeader
        title="Staking Protocol"
        description="Monitor staking opportunities, reward rates, pool participation, and protocol coverage."
        actions={
          <Button asChild size="sm" className="h-9 bg-primary text-primary-foreground font-semibold">
            <Link to="/staking/pools">
              Explore all pools <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {/* Protocol summary */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total staking pools</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Layers className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{pools.length.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Pools in the current catalog</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active pools</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><Activity className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{metrics.activePools.length.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Currently marked as active</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Highest listed APY</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-tight text-emerald-400">{formatApy(metrics.highestApyPool?.apy)}</div>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{metrics.highestApyPool?.name || "No pool data available"}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Recorded stakers</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400"><Users className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{metrics.totalStakers.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Combined depositor count across pools</p>
        </div>
      </section>

      {/* Pool directory and protocol snapshot */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 min-h-[680px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">Staking opportunities</h2>
                <span className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">Catalog</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Compare reward rates, participation, and lock terms across pools.</p>
            </div>
            <Link to="/staking/pools" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Advanced discovery <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pools.length === 0 ? (
            <div className="p-10 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-medium text-foreground">No staking pools available</p>
              <p className="mt-1 text-xs text-muted-foreground">Pool listings will appear here when catalog data is available.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-secondary/20">
                    <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3">Pool / Network</th>
                      <th className="px-4 py-3">Reward APY</th>
                      <th className="px-4 py-3">Total staked</th>
                      <th className="px-4 py-3">Stakers</th>
                      <th className="px-4 py-3">Lockup</th>
                      <th className="px-5 py-3 text-right"> </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {visiblePools.map((pool) => (
                      <tr key={pool.id} className="transition-colors hover:bg-secondary/20">
                        <td className="px-5 py-3.5">
                          <div className="min-w-0">
                            <Link to={`/staking/pools/${pool.id}`} className="block truncate text-sm font-semibold text-foreground hover:text-primary">{pool.name}</Link>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">{pool.network}</span>
                              <span className="text-[10px] text-muted-foreground/60">·</span>
                              <span className="text-[10px] font-mono text-muted-foreground">{pool.tokenId.toUpperCase()}</span>
                              <StatusBadge status={pool.status} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-sm font-semibold text-emerald-400">{formatApy(pool.apy)}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-foreground">{pool.totalStaked || "—"}</td>
                        <td className="px-4 py-3.5 text-xs font-mono text-foreground">{pool.stakerCount?.toLocaleString() ?? "—"}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            {pool.lockPeriodDays ? <Lock className="h-3 w-3 text-amber-400" /> : <Unlock className="h-3 w-3 text-emerald-400" />}
                            {pool.lockPeriodDays ? `${pool.lockPeriodDays} days` : "Flexible"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button asChild size="sm" variant="outline" className="h-7 border-border/60 px-2.5 text-[11px]">
                            <Link to={`/staking/pools/${pool.id}`}>View pool</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {visiblePools.length < pageSize && (
                      <tr aria-hidden="true">
                        <td colSpan={6} className="h-64 px-5 text-center align-middle">
                          <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                            <Layers className="h-5 w-5 opacity-40" />
                            <span className="text-sm font-medium">No more data to show</span>
                            <span className="text-[11px] opacity-70">You’ve reached the end of the available staking pools.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-auto flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{startIndex + 1}–{endIndex}</span> of{" "}
                    <span className="font-semibold text-foreground">{pools.length}</span> pools
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage <= 1} className="h-8 px-3 text-xs disabled:opacity-40">
                      <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
                    </Button>
                    <span className="px-1 text-xs text-muted-foreground">Page {safeCurrentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage >= totalPages} className="h-8 px-3 text-xs disabled:opacity-40">
                      Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><Trophy className="h-4 w-4" /></span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Highest listed rewards</h3>
                <p className="text-[10px] text-muted-foreground">Top APY values in the catalog</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {metrics.topApyPools.map((pool, index) => (
                <Link key={pool.id} to={`/staking/pools/${pool.id}`} className="flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-secondary/30">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-mono text-muted-foreground">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">{pool.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{pool.network} · {pool.tokenId.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold text-emerald-400">{formatApy(pool.apy)}</span>
                </Link>
              ))}
              {metrics.topApyPools.length === 0 && <p className="text-xs text-muted-foreground">No APY data available.</p>}
            </div>
            <p className="mt-3 border-t border-border/60 pt-3 text-[10px] leading-relaxed text-muted-foreground">
              Listed rates are catalog figures, not guaranteed returns. Check each pool's status and terms before interacting.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400"><BarChart3 className="h-4 w-4" /></span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Pool status</h3>
                <p className="text-[10px] text-muted-foreground">Lifecycle breakdown</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {([
                ["Active", metrics.statusCounts.active, "bg-emerald-400"],
                ["Pending", metrics.statusCounts.pending, "bg-amber-400"],
                ["Ended", metrics.statusCounts.ended, "bg-zinc-400"],
                ["Draft", metrics.statusCounts.draft, "bg-slate-500"],
              ] as const).map(([label, count, color]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono text-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pools.length ? (count / pools.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"><Users className="h-4 w-4" /></span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Most participated pools</h3>
                <p className="text-[10px] text-muted-foreground">Ranked by recorded staker count</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {metrics.topParticipationPools.map((pool) => (
                <Link key={pool.id} to={`/staking/pools/${pool.id}`} className="flex items-center justify-between gap-3 hover:text-primary">
                  <span className="min-w-0 truncate text-xs font-medium text-foreground">{pool.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{(pool.stakerCount || 0).toLocaleString()}</span>
                </Link>
              ))}
              {metrics.topParticipationPools.length === 0 && <p className="text-xs text-muted-foreground">No participation data available.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Explore the ecosystem</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Browse the full pool catalog to filter by network, reward rate, category, status, and lock duration.
            </p>
            <Button asChild className="mt-4 w-full bg-primary text-primary-foreground">
              <Link to="/staking/pools">Open pool discovery <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
