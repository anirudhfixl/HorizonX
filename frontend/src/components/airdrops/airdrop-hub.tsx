import "@/components/airdrops/airdrops.css";
import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useAirdrops, useTokens, useProjects } from "@/api";
import {
  readSessionAirdropsRaw,
  subscribeSessionAirdrops,
  parseSessionAirdrops,
  calculateAirdropKpis,
  calculateClaimProgress,
} from "@/lib/airdrop-storage";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CalendarDays,
  Target,
  Tags,
  Gift,
  Layers3,
  Network,
  Plus,
  Rocket,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const STATUS_ORDER = ["active", "pending", "ended", "draft"] as const;
const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  pending: "#f59e0b",
  ended: "#64748b",
  draft: "#a78bfa",
};
const NETWORK_COLORS = ["#a78bfa", "#2563eb", "#10b981", "#f59e0b", "#64748b"];

type ChartPeriod = "daily" | "weekly" | "monthly";

function safeDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string): string {
  const date = safeDate(value);
  if (!date) return "Date not set";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function getRecordDate(campaign: any): string | undefined {
  return campaign.createdAt;
}

function getChartBuckets(period: ChartPeriod, campaigns: any[]) {
  const now = new Date();
  const count = period === "daily" ? 7 : period === "weekly" ? 8 : 12;
  const buckets = Array.from({ length: count }, (_, index) => {
    const start = new Date(now);
    if (period === "daily") {
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (count - 1 - index));
    } else if (period === "weekly") {
      start.setHours(0, 0, 0, 0);
      const day = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - day - (count - 1 - index) * 7);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - (count - 1 - index));
    }
    const end = new Date(start);
    if (period === "daily") end.setDate(end.getDate() + 1);
    else if (period === "weekly") end.setDate(end.getDate() + 7);
    else end.setMonth(end.getMonth() + 1);

    const label = period === "daily"
      ? start.toLocaleDateString(undefined, { weekday: "short" })
      : period === "weekly"
        ? start.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : start.toLocaleDateString(undefined, { month: "short" });
    const matching = campaigns.filter((campaign) => {
      const date = safeDate(getRecordDate(campaign));
      return !!date && date >= start && date < end;
    });
    return {
      key: `${period}-${start.toISOString()}`,
      label,
      range: period === "monthly"
        ? start.toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${new Date(end.getTime() - 1).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
      count: matching.length,
      campaigns: matching,
    };
  });
  return buckets;
}

export function AirdropHub() {
  const { data: airdrops = [] } = useAirdrops();
  const { data: tokens = [] } = useTokens();
  const { data: projects = [] } = useProjects();
  const sessionRaw = useSyncExternalStore(
    subscribeSessionAirdrops,
    readSessionAirdropsRaw,
    () => ""
  );

  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("monthly");
  const [selectedBucketKey, setSelectedBucketKey] = useState<string | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [breakdown, setBreakdown] = useState<{ title: string; campaigns: any[] } | null>(null);

  const allAirdrops = useMemo(() => {
    const session = parseSessionAirdrops(sessionRaw);
    const merged = new Map<string, any>();
    session.forEach((campaign) => merged.set(campaign.id, campaign));
    (airdrops as any[]).forEach((campaign) => merged.set(campaign.id, campaign));
    return Array.from(merged.values());
  }, [airdrops, sessionRaw]);

  const tokenMap = useMemo(() => {
    const map = new Map<string, any>();
    (tokens as any[]).forEach((token) => map.set(token.id, token));
    return map;
  }, [tokens]);

  const projectMap = useMemo(() => {
    const map = new Map<string, any>();
    (projects as any[]).forEach((project) => map.set(project.id, project));
    return map;
  }, [projects]);

  const kpis = useMemo(() => calculateAirdropKpis(allAirdrops), [allAirdrops]);

  const statusStats = useMemo(() => STATUS_ORDER.map((status) => {
    const campaigns = allAirdrops.filter((campaign) => campaign.status === status);
    return {
      status,
      count: campaigns.length,
      campaigns,
      percent: kpis.totalCampaigns ? Math.round((campaigns.length / kpis.totalCampaigns) * 100) : 0,
    };
  }), [allAirdrops, kpis.totalCampaigns]);

  const networkStats = useMemo(() => {
    const counts = new Map<string, any[]>();
    allAirdrops.forEach((campaign) => {
      const network = campaign.network || "Unspecified";
      counts.set(network, [...(counts.get(network) || []), campaign]);
    });
    const ranked = Array.from(counts.entries())
      .map(([network, campaigns]) => ({ network, count: campaigns.length, campaigns }))
      .sort((a, b) => b.count - a.count);
    const visible = ranked.slice(0, 4);
    const rest = ranked.slice(4);
    if (rest.length) {
      visible.push({
        network: "Others",
        count: rest.reduce((sum, item) => sum + item.count, 0),
        campaigns: rest.flatMap((item) => item.campaigns),
      });
    }
    return visible;
  }, [allAirdrops]);

  const chartBuckets = useMemo(
    () => getChartBuckets(chartPeriod, allAirdrops),
    [chartPeriod, allAirdrops]
  );
  const selectedBucket = chartBuckets.find((bucket) => bucket.key === selectedBucketKey);
  const maxLaunchCount = Math.max(1, ...chartBuckets.map((bucket) => bucket.count));

  const featuredCampaigns = useMemo(() => {
    return [...allAirdrops]
      .sort((a, b) => {
        const statusRank = (status: string) =>
          status === "active" ? 0 : status === "pending" ? 1 : status === "draft" ? 2 : 3;
        const rankDiff = statusRank(a.status) - statusRank(b.status);
        if (rankDiff !== 0) return rankDiff;
        return calculateClaimProgress(b.claimedCount, b.recipientCount) -
          calculateClaimProgress(a.claimedCount, a.recipientCount);
      });
  }, [allAirdrops]);

  const featuredRailCampaigns = useMemo(() => {
    if (!featuredCampaigns.length) return [];
    const start = featuredIndex % featuredCampaigns.length;
    const rotated = [
      ...featuredCampaigns.slice(start),
      ...featuredCampaigns.slice(0, start),
    ];
    return [...rotated, ...rotated.slice(0, 3)];
  }, [featuredCampaigns, featuredIndex]);

  useEffect(() => {
    if (featuredPaused || featuredCampaigns.length <= 1) return;
    const interval = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % featuredCampaigns.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, [featuredCampaigns.length, featuredPaused]);

  const recentActivity = useMemo(() => {
    return [...allAirdrops]
      .sort((a, b) => {
        const dateA = safeDate(a.updatedAt || a.createdAt)?.getTime() || 0;
        const dateB = safeDate(b.updatedAt || b.createdAt)?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [allAirdrops]);

  const campaignsWithRewards = useMemo(
    () => allAirdrops.filter((campaign) => Boolean(campaign.totalReward)),
    [allAirdrops]
  );

  const categoryStats = useMemo(() => {
    const grouped = new Map<string, any[]>();
    allAirdrops.forEach((campaign) => {
      const category = campaign.category || "Uncategorized";
      grouped.set(category, [...(grouped.get(category) || []), campaign]);
    });
    return Array.from(grouped.entries())
      .map(([category, campaigns]) => ({ category, campaigns, count: campaigns.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allAirdrops]);

  const deadlineCampaigns = useMemo(() => {
    const now = Date.now();
    return allAirdrops
      .map((campaign) => ({
        campaign,
        deadline: safeDate(campaign.endTime || campaign.endDate),
      }))
      .filter((item) =>
        item.deadline &&
        item.deadline.getTime() >= now &&
        (item.campaign.status === "active" || item.campaign.status === "pending")
      )
      .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
      .slice(0, 5)
      .map((item) => ({
        ...item,
        daysLeft: Math.max(0, Math.ceil((item.deadline!.getTime() - now) / 86400000)),
      }));
  }, [allAirdrops]);

  const claimRankings = useMemo(() => {
    return allAirdrops
      .filter((campaign) => Number(campaign.recipientCount || 0) > 0)
      .map((campaign) => ({
        campaign,
        progress: calculateClaimProgress(campaign.claimedCount, campaign.recipientCount),
      }))
      .sort((a, b) => b.progress - a.progress);
  }, [allAirdrops]);

  const remainingClaims = Math.max(0, kpis.totalRecipients - kpis.totalClaimed);
  const unclaimedPercent = kpis.totalRecipients
    ? Math.round((remainingClaims / kpis.totalRecipients) * 100)
    : 0;
  const activePercent = kpis.totalCampaigns
    ? Math.round((kpis.activeCampaigns / kpis.totalCampaigns) * 100)
    : 0;
  const claimRate = kpis.overallClaimRate;

  const openBreakdown = (title: string, campaigns: any[]) => setBreakdown({ title, campaigns });
  const networkTotal = Math.max(1, networkStats.reduce((sum, item) => sum + item.count, 0));
  let networkCursor = 0;
  const donutStops = networkStats.map((item, index) => {
    const start = networkCursor;
    networkCursor += (item.count / networkTotal) * 100;
    return `${NETWORK_COLORS[index % NETWORK_COLORS.length]} ${start}% ${networkCursor}%`;
  }).join(", ");

  return (
    <div className="airdrop-page airdrop-overview-dashboard w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-7 space-y-6">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Overview" }]} />

      <PageHeader
        title="Airdrop Hub"
        description="Discover airdrop opportunities, track ecosystem activity, and manage campaign participation in one place."
        breadcrumbs={[{ label: "Airdrops" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-9 border-border/60 text-xs">
              <Link to="/airdrops/claim">
                <Wallet className="mr-1.5 h-3.5 w-3.5" /> Claim rewards
              </Link>
            </Button>
            <Button asChild size="sm" className="h-9 gap-1.5 text-xs font-semibold">
              <Link to="/airdrops/campaigns">
                Explore campaigns <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      {allAirdrops.length === 0 ? (
        <EmptyState
          icon={<Gift className="h-8 w-8 text-primary/70" />}
          title="No campaign data available"
          description="Campaign metrics and activity will appear here when campaign records are available."
          action={
            <Button asChild size="sm">
              <Link to="/airdrops/campaigns/create"><Plus className="mr-1.5 h-3.5 w-3.5" /> Create campaign</Link>
            </Button>
          }
        />
      ) : (
        <>
          <section className="airdrop-dashboard-kpis grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Airdrop ecosystem metrics">
            <button type="button" className="airdrop-dashboard-kpi airdrop-dashboard-kpi--button" onClick={() => openBreakdown("All campaign records", allAirdrops)} title="Show all campaigns">
              <span className="airdrop-dashboard-kpi__icon airdrop-dashboard-kpi__icon--purple"><Layers3 /></span>
              <span className="airdrop-dashboard-kpi__content">
                <span>Total campaigns <small className="airdrop-dashboard-info" title="All stored campaign records">ⓘ</small></span>
                <strong>{kpis.totalCampaigns.toLocaleString()}</strong>
                <small>Open the full campaign catalog</small>
              </span>
              <span className="airdrop-dashboard-kpi__corner"><ArrowUpRight /></span>
            </button>
            <button type="button" className="airdrop-dashboard-kpi airdrop-dashboard-kpi--button" onClick={() => openBreakdown("Active campaigns", allAirdrops.filter((campaign) => campaign.status === "active"))} title="Show active campaigns">
              <span className="airdrop-dashboard-kpi__icon airdrop-dashboard-kpi__icon--green"><Rocket /></span>
              <span className="airdrop-dashboard-kpi__content">
                <span>Active campaigns <small className="airdrop-dashboard-info" title="Campaigns currently marked active">ⓘ</small></span>
                <strong>{kpis.activeCampaigns.toLocaleString()}</strong>
                <small>{activePercent}% of the current catalog</small>
              </span>
              <span className="airdrop-dashboard-kpi__corner"><ArrowUpRight /></span>
            </button>
            <button type="button" className="airdrop-dashboard-kpi airdrop-dashboard-kpi--button" onClick={() => openBreakdown("Campaigns with reward allocations", campaignsWithRewards)} title="Show campaigns with reward allocations">
              <span className="airdrop-dashboard-kpi__icon airdrop-dashboard-kpi__icon--purple"><Gift /></span>
              <span className="airdrop-dashboard-kpi__content">
                <span>Reward pools <small className="airdrop-dashboard-info" title="Campaigns with a recorded reward amount">ⓘ</small></span>
                <strong>{campaignsWithRewards.length.toLocaleString()}</strong>
                <small>Campaigns with a recorded allocation</small>
              </span>
              <span className="airdrop-dashboard-kpi__corner"><ArrowUpRight /></span>
            </button>
            <button type="button" className="airdrop-dashboard-kpi airdrop-dashboard-kpi--button" onClick={() => openBreakdown("Campaigns with recipient allocations", allAirdrops.filter((campaign) => Number(campaign.recipientCount || 0) > 0))} title="Show campaigns with recipient allocations">
              <span className="airdrop-dashboard-kpi__icon airdrop-dashboard-kpi__icon--cyan"><Users /></span>
              <span className="airdrop-dashboard-kpi__content">
                <span>Participants <small className="airdrop-dashboard-info" title="Combined recipient allocations across campaigns">ⓘ</small></span>
                <strong>{formatCompact(kpis.totalRecipients)}</strong>
                <small>{formatCompact(kpis.totalClaimed)} claims recorded · {claimRate}% claim rate</small>
              </span>
              <span className="airdrop-dashboard-kpi__corner"><ArrowUpRight /></span>
            </button>
          </section>

          <div className="airdrop-dashboard-disclosure">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <p>
              <strong>Data transparency:</strong> Dashboard metrics are calculated from stored campaign records.
              Recipient and claim totals are catalog figures; they do not independently verify on-chain distributions.
              Reward amounts remain token-specific and are not combined across different assets.
            </p>
          </div>

          <section className="airdrop-dashboard-analytics-grid" aria-label="Campaign analytics">
            <div className="airdrop-dashboard-panel airdrop-dashboard-activity-chart">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Performance overview</div>
                  <h2>Airdrop activity</h2>
                  <p>Campaign records created during the selected period.</p>
                </div>
                <div className="airdrop-dashboard-period-toggle" role="group" aria-label="Activity chart period">
                  {(["daily", "weekly", "monthly"] as ChartPeriod[]).map((period) => (
                    <button type="button" key={period} aria-pressed={chartPeriod === period} className={chartPeriod === period ? "is-active" : ""} onClick={() => { setChartPeriod(period); setSelectedBucketKey(null); }}>
                      {period[0].toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="airdrop-dashboard-chart" aria-label={`Campaign activity, ${chartPeriod}`}>
                <div className="airdrop-dashboard-chart__plot" style={{ gridTemplateColumns: `1.3rem repeat(${chartBuckets.length}, minmax(0, 1fr))` }}>
                  <div className="airdrop-dashboard-chart__grid"><span>{maxLaunchCount}</span><span>{Math.ceil(maxLaunchCount * .66)}</span><span>{Math.ceil(maxLaunchCount * .33)}</span><span>0</span></div>
                  {chartBuckets.map((bucket) => (
                    <button
                      type="button"
                      key={bucket.key}
                      className={cn("airdrop-dashboard-chart__bar-column", selectedBucketKey === bucket.key && "is-selected")}
                      onClick={() => {
                        setSelectedBucketKey(bucket.key);
                        openBreakdown(`${bucket.range} · ${bucket.count} campaign${bucket.count === 1 ? "" : "s"}`, bucket.campaigns);
                      }}
                      title={`${bucket.range}: ${bucket.count} campaigns. Click to inspect records.`}
                      aria-label={`${bucket.range}: ${bucket.count} campaigns`}
                    >
                      <span className="airdrop-dashboard-chart__bar-track">
                        <span className="airdrop-dashboard-chart__bar" style={{ height: `${bucket.count === 0 ? 2 : Math.max(5, (bucket.count / maxLaunchCount) * 100)}%` }} />
                      </span>
                      <span className="airdrop-dashboard-chart__value">{bucket.count || ""}</span>
                      <span className="airdrop-dashboard-chart__label">{bucket.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedBucket && (
                <div className="airdrop-dashboard-chart-selection">
                  <span><strong>{selectedBucket.range}</strong> · {selectedBucket.count} campaign records</span>
                  <button type="button" onClick={() => { setSelectedBucketKey(null); setBreakdown(null); }}>Clear selection</button>
                </div>
              )}
              <div className="airdrop-dashboard-panel__footnote">
                <span><span className="airdrop-dashboard-dot airdrop-dashboard-dot--purple" /> Stored campaign creation dates</span>
                <span>{allAirdrops.length} total records</span>
              </div>
            </div>

            <div className="airdrop-dashboard-panel airdrop-dashboard-network-panel">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Ecosystem coverage</div>
                  <h2>Network distribution</h2>
                  <p>Select a network to inspect its campaigns.</p>
                </div>
                <span className="airdrop-dashboard-panel__header-icon"><Network /></span>
              </div>
              <div className="airdrop-dashboard-donut-layout">
                <button type="button" className="airdrop-dashboard-donut" style={{ background: `conic-gradient(${donutStops})` }} onClick={() => openBreakdown("All network campaigns", allAirdrops)} aria-label="Show campaigns across all networks">
                  <span><strong>{kpis.totalCampaigns}</strong><small>Campaigns</small></span>
                </button>
                <div className="airdrop-dashboard-network-list">
                  {networkStats.map((item, index) => (
                    <button type="button" className="airdrop-dashboard-network-row" key={item.network} onClick={() => openBreakdown(`${item.network} campaigns`, item.campaigns)}>
                      <span className="airdrop-dashboard-network-row__name"><i style={{ background: NETWORK_COLORS[index % NETWORK_COLORS.length] }} />{item.network}</span>
                      <strong>{item.count}</strong>
                      <small>{Math.round((item.count / networkTotal) * 100)}%</small>
                    </button>
                  ))}
                  {networkStats.length === 0 && <p className="text-xs text-muted-foreground">No network data recorded.</p>}
                </div>
              </div>
              <div className="airdrop-dashboard-network-footer">
                <span>Supported transaction network</span>
                <strong>Ethereum Sepolia · Chain ID 11155111</strong>
              </div>
            </div>

            <div className="airdrop-dashboard-panel airdrop-dashboard-status-panel">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Catalog pulse</div>
                  <h2>Campaign status</h2>
                  <p>Select a status to view matching records.</p>
                </div>
                <span className="airdrop-dashboard-panel__header-icon"><Zap /></span>
              </div>
              <div className="airdrop-dashboard-status-list">
                {statusStats.map((item) => (
                  <button type="button" className="airdrop-dashboard-status-row" key={item.status} onClick={() => openBreakdown(`${item.status[0].toUpperCase() + item.status.slice(1)} campaigns`, item.campaigns)}>
                    <span className="airdrop-dashboard-status-row__top">
                      <span><i style={{ background: STATUS_COLORS[item.status] }} />{item.status[0].toUpperCase() + item.status.slice(1)}</span>
                      <strong>{item.count}</strong>
                      <small>{item.percent}%</small>
                    </span>
                    <span className="airdrop-dashboard-progress"><span style={{ width: `${item.percent}%`, background: STATUS_COLORS[item.status] }} /></span>
                  </button>
                ))}
              </div>
              <button type="button" className="airdrop-dashboard-claim-rate" onClick={() => openBreakdown("Campaigns with recorded claims", allAirdrops.filter((campaign) => Number(campaign.claimedCount || 0) > 0))}>
                <span className="airdrop-dashboard-claim-rate__icon"><CheckCircle2 /></span>
                <span><small>Overall claim rate</small><strong>{claimRate}%</strong></span>
                <span>{formatCompact(kpis.totalClaimed)} / {formatCompact(kpis.totalRecipients)}</span>
              </button>
            </div>
          </section>

          {breakdown && (
            <section className="airdrop-dashboard-drilldown" aria-live="polite">
              <div className="airdrop-dashboard-drilldown__header">
                <div><span className="airdrop-dashboard-eyebrow">Interactive details</span><h2>{breakdown.title}</h2><p>{breakdown.campaigns.length} matching campaign records</p></div>
                <button type="button" onClick={() => setBreakdown(null)} aria-label="Close campaign details"><X /></button>
              </div>
              {breakdown.campaigns.length ? (
                <div className="airdrop-dashboard-drilldown__list">
                  {breakdown.campaigns.slice(0, 8).map((campaign) => {
                    const token = tokenMap.get(campaign.tokenId);
                    return (
                      <Link key={campaign.id} to={`/airdrops/campaigns/${campaign.id}`} className="airdrop-dashboard-drilldown__item">
                        <span className="airdrop-dashboard-featured__symbol">{token?.symbol?.slice(0, 3) || "A"}</span>
                        <span><strong>{campaign.title}</strong><small>{campaign.network} · {campaign.totalReward || "Reward not specified"}</small></span>
                        <StatusBadge status={campaign.status} />
                        <ArrowUpRight />
                      </Link>
                    );
                  })}
                </div>
              ) : <p className="airdrop-dashboard-drilldown__empty">No campaign records match this selection.</p>}
            </section>
          )}

          <section className="airdrop-dashboard-lower-grid" aria-label="Featured airdrops and recent activity">
            <div className="airdrop-dashboard-panel airdrop-dashboard-featured-panel" onMouseEnter={() => setFeaturedPaused(true)} onMouseLeave={() => setFeaturedPaused(false)}>
              <div className="airdrop-dashboard-panel__header">
                <div className="airdrop-dashboard-heading-with-icon"><div><h2>Featured airdrops</h2><p>Priority opportunities from the current catalog.</p></div></div>
                <div className="airdrop-dashboard-featured-controls">
                  <Link to="/airdrops/campaigns" className="airdrop-dashboard-text-link">View all campaigns <ArrowRight /></Link>
                </div>
              </div>
              <div className="airdrop-dashboard-featured-cards" aria-label="Featured airdrop campaign rail">
                {featuredCampaigns.length > 1 && (
                  <div className="airdrop-dashboard-featured-rail-arrows" aria-label="Featured airdrop navigation">
                    <button
                      type="button"
                      className="airdrop-dashboard-rail-arrow"
                      onClick={() => setFeaturedIndex((index) => (index - 1 + featuredCampaigns.length) % featuredCampaigns.length)}
                      aria-label="Previous featured airdrops"
                    ><ChevronLeft /></button>
                    <button
                      type="button"
                      className="airdrop-dashboard-rail-arrow"
                      onClick={() => setFeaturedIndex((index) => (index + 1) % featuredCampaigns.length)}
                      aria-label="Next featured airdrops"
                    ><ChevronRight /></button>
                  </div>
                )}
                {featuredCampaigns.length ? (
                  <div className="airdrop-dashboard-featured-track" key={featuredIndex}>
                    {featuredRailCampaigns.map((campaign, index) => {
                      const token = tokenMap.get(campaign.tokenId);
                      const project = campaign.projectId ? projectMap.get(campaign.projectId) : undefined;
                      const progress = calculateClaimProgress(campaign.claimedCount, campaign.recipientCount);
                      return (
                        <Link to={`/airdrops/campaigns/${campaign.id}`} className={cn("airdrop-dashboard-featured-card", `accent-${index % 3}`)} key={campaign.id}>
                          <div className="airdrop-dashboard-featured-card__top">
                            <span className="airdrop-dashboard-featured__symbol">{token?.symbol?.slice(0, 4) || String(campaign.tokenId || "AIR").slice(0, 3).toUpperCase()}</span>
                            <StatusBadge status={campaign.status} />
                          </div>
                          <strong className="airdrop-dashboard-featured-card__title">{campaign.title}</strong>
                          <div className="airdrop-dashboard-featured-card__tags"><span>{campaign.network}</span>{campaign.category && <span>{campaign.category}</span>}</div>
                          {project && <small className="airdrop-dashboard-featured-card__project">{project.name}</small>}
                          <div className="airdrop-dashboard-featured-card__reward"><small>Reward pool</small><strong>{campaign.totalReward || "Not specified"}</strong></div>
                          <div className="airdrop-dashboard-featured-card__progress"><span><small>{(campaign.claimedCount || 0).toLocaleString()} / {(campaign.recipientCount || 0).toLocaleString()} claimed</small><b>{progress}%</b></span><i><i style={{ width: `${progress}%` }} /></i></div>
                        </Link>
                      );
                    })}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No featured campaigns available.</p>}
              </div>
            </div>

            <div className="airdrop-dashboard-panel airdrop-dashboard-recent-panel">
              <div className="airdrop-dashboard-panel__header">
                <div className="airdrop-dashboard-heading-with-icon"><span className="airdrop-dashboard-panel__header-icon"><Clock3 /></span><div><h2>Recent activity</h2><p>Latest changes to stored campaign records.</p></div></div>
                <Link to="/airdrops/campaigns" className="airdrop-dashboard-text-link">View all <ArrowRight /></Link>
              </div>
              <div className="airdrop-dashboard-activity-list">
                {recentActivity.map((campaign, index) => {
                  const date = campaign.updatedAt || campaign.createdAt;
                  const isNew = !campaign.updatedAt || (campaign.createdAt && new Date(campaign.createdAt).toDateString() === new Date(campaign.updatedAt).toDateString());
                  return (
                    <Link to={`/airdrops/campaigns/${campaign.id}`} className="airdrop-dashboard-activity" key={campaign.id}>
                      <span className={cn("airdrop-dashboard-activity__icon", index % 2 === 0 ? "is-purple" : "is-green")}>{isNew ? <Plus /> : <Clock3 />}</span>
                      <span className="airdrop-dashboard-activity__copy"><strong>{isNew ? "New campaign added" : "Campaign record updated"}</strong><small>{campaign.title}</small></span>
                      <span className="airdrop-dashboard-activity__date">{formatDate(date)}</span>
                      <ArrowUpRight className="airdrop-dashboard-activity__arrow" />
                    </Link>
                  );
                })}
                {!recentActivity.length && <p className="p-4 text-sm text-muted-foreground">No recent campaign records.</p>}
              </div>
            </div>
          </section>

          <section className="airdrop-dashboard-operations-grid" aria-label="Airdrop operations and insights">
            <div className="airdrop-dashboard-panel airdrop-dashboard-claim-insights">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Distribution health</div>
                  <h2>Claim performance</h2>
                  <p>How much of the recorded recipient allocation has been claimed.</p>
                </div>
                <span className="airdrop-dashboard-panel__header-icon"><Target /></span>
              </div>
              <div className="airdrop-dashboard-claim-summary">
                <div>
                  <small>Claimed</small>
                  <strong>{formatCompact(kpis.totalClaimed)}</strong>
                </div>
                <div>
                  <small>Still unclaimed</small>
                  <strong>{formatCompact(remainingClaims)}</strong>
                </div>
                <div>
                  <small>Overall rate</small>
                  <strong>{claimRate}%</strong>
                </div>
              </div>
              <div className="airdrop-dashboard-claim-stacked" aria-label={`${claimRate}% claimed and ${unclaimedPercent}% unclaimed`}>
                <span style={{ width: `${claimRate}%` }} />
                <span style={{ width: `${unclaimedPercent}%` }} />
              </div>
              <div className="airdrop-dashboard-claim-legend">
                <span><i className="is-claimed" /> Claimed</span>
                <span><i className="is-unclaimed" /> Unclaimed</span>
                <button type="button" onClick={() => openBreakdown("Campaigns with unclaimed allocations", allAirdrops.filter((campaign) => Number(campaign.recipientCount || 0) > Number(campaign.claimedCount || 0)))}>
                  Inspect unclaimed <ArrowUpRight />
                </button>
              </div>
              <div className="airdrop-dashboard-ranking">
                <div className="airdrop-dashboard-ranking__heading">
                  <strong>Highest claim completion</strong>
                  <span>Top 3</span>
                </div>
                {claimRankings.slice(0, 3).map(({ campaign, progress }) => (
                  <Link to={`/airdrops/campaigns/${campaign.id}`} className="airdrop-dashboard-ranking__row" key={campaign.id}>
                    <span className="airdrop-dashboard-ranking__name"><strong>{campaign.title}</strong><small>{campaign.network}</small></span>
                    <span className="airdrop-dashboard-ranking__bar"><i style={{ width: `${progress}%` }} /></span>
                    <b>{progress}%</b>
                  </Link>
                ))}
                {!claimRankings.length && <p className="airdrop-dashboard-empty-note">No recipient allocation data is available yet.</p>}
              </div>
            </div>

            <div className="airdrop-dashboard-panel airdrop-dashboard-deadlines">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Time-sensitive</div>
                  <h2>Upcoming deadlines</h2>
                  <p>Active and pending campaigns with a recorded end date.</p>
                </div>
                <span className="airdrop-dashboard-panel__header-icon"><CalendarDays /></span>
              </div>
              <div className="airdrop-dashboard-deadline-list">
                {deadlineCampaigns.map(({ campaign, deadline, daysLeft }) => (
                  <Link to={`/airdrops/campaigns/${campaign.id}`} className="airdrop-dashboard-deadline-row" key={campaign.id}>
                    <span className="airdrop-dashboard-deadline-date">
                      <strong>{deadline!.toLocaleDateString(undefined, { day: "2-digit" })}</strong>
                      <small>{deadline!.toLocaleDateString(undefined, { month: "short" })}</small>
                    </span>
                    <span className="airdrop-dashboard-deadline-copy">
                      <strong>{campaign.title}</strong>
                      <small>{campaign.network} · {campaign.totalReward || "Reward not specified"}</small>
                    </span>
                    <span className={cn("airdrop-dashboard-deadline-count", daysLeft <= 7 && "is-soon")}>
                      {daysLeft === 0 ? "Ends today" : `${daysLeft}d left`}
                    </span>
                    <ArrowUpRight />
                  </Link>
                ))}
                {!deadlineCampaigns.length && (
                  <div className="airdrop-dashboard-deadline-empty">
                    <CalendarDays />
                    <strong>No upcoming deadlines recorded</strong>
                    <span>Campaign end dates will appear here when available.</span>
                  </div>
                )}
              </div>
              <Link to="/airdrops/campaigns" className="airdrop-dashboard-panel-link">Browse all campaigns <ArrowRight /></Link>
            </div>

            <div className="airdrop-dashboard-panel airdrop-dashboard-category-panel">
              <div className="airdrop-dashboard-panel__header">
                <div>
                  <div className="airdrop-dashboard-eyebrow">Opportunity landscape</div>
                  <h2>Campaign categories</h2>
                  <p>Explore how the catalog is distributed by sector.</p>
                </div>
                <span className="airdrop-dashboard-panel__header-icon"><Tags /></span>
              </div>
              <div className="airdrop-dashboard-category-list">
                {categoryStats.map((item, index) => (
                  <button type="button" className="airdrop-dashboard-category-row" key={item.category} onClick={() => openBreakdown(`${item.category} campaigns`, item.campaigns)}>
                    <span className="airdrop-dashboard-category-row__top">
                      <strong>{item.category}</strong>
                      <small>{item.count} campaign{item.count === 1 ? "" : "s"}</small>
                    </span>
                    <span className="airdrop-dashboard-category-track">
                      <i style={{ width: `${Math.round((item.count / Math.max(1, kpis.totalCampaigns)) * 100)}%`, background: NETWORK_COLORS[index % NETWORK_COLORS.length] }} />
                    </span>
                  </button>
                ))}
                {!categoryStats.length && <p className="airdrop-dashboard-empty-note">No category data has been recorded.</p>}
              </div>
              <div className="airdrop-dashboard-category-footer">
                <span>{categoryStats.length} leading categories shown</span>
                <button type="button" onClick={() => openBreakdown("All categorized campaigns", allAirdrops.filter((campaign) => Boolean(campaign.category)))}>
                  View category records <ArrowUpRight />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
