import { TokenBreadcrumb, TokenSectionNav } from "@/components/tokens/token-section-nav";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AssetIdentity } from "@/components/market/asset-identity";
import { DataTable, type Column } from "@/components/market/data-table";
import { FeaturedCarousel, type FeaturedSlide } from "@/components/market/featured-carousel";
import { FilterToolbar } from "@/components/market/filter-toolbar";
import { Sparkline } from "@/components/market/sparkline";
import { EmptyState } from "@/components/market/state-views";
import { TrendingRail, type RailItem } from "@/components/market/trending-rail";
import { WatchButton } from "@/components/market/watch-button";
import { MARKET_CAP_BANDS, VERIFICATION_TIERS } from "@/lib/tokens/config";
import { sparkValues } from "@/lib/tokens/demo-data";
import { num, pct, usdCompact, usdPrice } from "@/lib/tokens/format";
import { useTokenWatchlist } from "@/lib/tokens/hooks";
import type { TokenWithMarket } from "@/lib/tokens/model";
import {
  TOKEN_CATALOG,
  discoveryLists,
  featuredTokens,
  isReviewed,
  summarizeMarket,
  tokenRelations,
  trendingScore,
} from "@/lib/tokens/selectors";
import { useTokens, useMarketOverview } from "@/api";
import { Link } from "react-router-dom";

type SortKey = "name" | "price" | "change" | "cap" | "volume" | "liquidity" | "trend" | "new";
type Dir = "asc" | "desc";
type PresetId = "all" | "ecosystem" | "trending" | "new" | "gainers" | "volume" | "verified";

const PAGE = 10;

const PRESETS: { id: PresetId; label: string }[] = [
  { id: "all", label: "All tokens" },
  { id: "ecosystem", label: "HorizonX Ecosystem" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "Recently launched" },
  { id: "gainers", label: "Top gainers" },
  { id: "volume", label: "Top volume" },
  { id: "verified", label: "Verified" },
];

const sortValue: Record<SortKey, (t: TokenWithMarket) => number | string> = {
  name: (t) => t.name.toLowerCase(),
  price: (t) => num(t.market.price),
  change: (t) => num(t.market.priceChange24h),
  cap: (t) => num(t.market.marketCap),
  volume: (t) => num(t.market.volume24h),
  liquidity: (t) => num(t.market.liquidity),
  trend: trendingScore,
  new: (t) => Date.parse(t.createdAt || t.updatedAt || ""),
};

const PRESET_STATE: Record<PresetId, { sort: SortKey; dir: Dir; review: string }> = {
  all: { sort: "cap", dir: "desc", review: "any" },
  ecosystem: { sort: "cap", dir: "desc", review: "any" },
  trending: { sort: "trend", dir: "desc", review: "any" },
  new: { sort: "new", dir: "desc", review: "any" },
  gainers: { sort: "change", dir: "desc", review: "any" },
  volume: { sort: "volume", dir: "desc", review: "any" },
  verified: { sort: "cap", dir: "desc", review: "reviewed" },
};

const REL_TAG: Record<string, string> = {
  presale: "Presale",
  launch: "Fair launch",
  airdrop: "Airdrop",
  staking: "Staking pool",
};

function ChangeCell({ value }: { value?: number }) {
  const v = num(value);
  return <span className={v >= 0 ? "is-up" : "is-down"}>{pct(v)}</span>;
}

function RankedList({ title, items, metric, onAll }: { title: string; items: TokenWithMarket[]; metric: (t: TokenWithMarket) => React.ReactNode; onAll: () => void }) {
  return (
    <section className="tk-ranked" aria-label={title}>
      <header>
        <h3>{title}</h3>
        <button type="button" className="mx-link" onClick={onAll}>See all</button>
      </header>
      <ol>
        {items.map((t, i) => (
          <li key={t.id}>
            <span className="tk-ranked__n">{i + 1}</span>
            <Link to={`/tokens/${t.id}`} className="mx-identity">
              <AssetIdentity symbol={t.symbol} name={t.name} logoUrl={t.logoUrl || (t as any).logo || (t as any).image} size="sm" />
            </Link>
            <span className="tk-ranked__metric">{metric(t)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TokenExplore() {
  const watch = useTokenWatchlist();

  // Consume centralized data hooks from @/api
  const { data: apiTokens = [] } = useTokens();
  const { data: marketOverview } = useMarketOverview();

  // Merge live API tokens with catalog fallback if loading
  const allTokens = useMemo<TokenWithMarket[]>(() => {
    if (apiTokens && apiTokens.length > 0) {
      return apiTokens as unknown as TokenWithMarket[];
    }
    return TOKEN_CATALOG;
  }, [apiTokens]);

  const isLiveFeed = Boolean(
    allTokens.some((t) => t.market?.isLive || (t as any).isExternal) &&
    marketOverview?.volume24h
  );

  const networks = useMemo(
    () => Array.from(new Set(allTokens.map((t) => t.network))).filter(Boolean).sort(),
    [allTokens]
  );
  const categories = useMemo(
    () => Array.from(new Set(allTokens.map((t) => t.category).filter(Boolean) as string[])).sort(),
    [allTokens]
  );

  const [query, setQuery] = useState("");
  const [network, setNetwork] = useState("all");
  const [category, setCategory] = useState("all");
  const [review, setReview] = useState("any");
  const [cap, setCap] = useState("any");
  const [preset, setPreset] = useState<PresetId>("all");
  const [sortKey, setSortKey] = useState<SortKey>("cap");
  const [dir, setDir] = useState<Dir>("desc");
  const [visible, setVisible] = useState(PAGE);
  const [ready, setReady] = useState(false);

  /* Deep links: read once on mount, then mirror state into the query string. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pick = (k: string, allowed?: string[]) => {
      const v = p.get(k);
      return v && (!allowed || allowed.includes(v)) ? v : null;
    };
    setQuery(p.get("q") ?? p.get("search") ?? "");
    setNetwork(pick("network", networks) ?? "all");
    setCategory(pick("category", categories) ?? "all");
    setReview(pick("review", ["any", "reviewed", ...VERIFICATION_TIERS.map((v) => v.value)]) ?? "any");
    setCap(pick("cap", MARKET_CAP_BANDS.map((b) => b.value)) ?? "any");
    setPreset(((pick("view", PRESETS.map((x) => x.id)) || pick("preset", PRESETS.map((x) => x.id))) as PresetId) ?? "all");
    setSortKey((pick("sort", Object.keys(sortValue)) as SortKey) ?? "cap");
    setDir((pick("dir", ["asc", "desc"]) as Dir) ?? "desc");
    setReady(true);
  }, [networks, categories]);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (network !== "all") p.set("network", network);
    if (category !== "all") p.set("category", category);
    if (review !== "any") p.set("review", review);
    if (cap !== "any") p.set("cap", cap);
    if (preset !== "all") p.set("view", preset);
    if (sortKey !== "cap") p.set("sort", sortKey);
    if (dir !== "desc") p.set("dir", dir);
    const qs = p.toString();
    window.history.replaceState(window.history.state, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [ready, query, network, category, review, cap, preset, sortKey, dir]);

  const resetVisible = () => setVisible(PAGE);

  const applyPreset = useCallback((id: PresetId) => {
    const s = PRESET_STATE[id];
    setPreset(id);
    setSortKey(s.sort);
    setDir(s.dir);
    setReview(s.review);
    setVisible(PAGE);
    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onSort = (key: string) => {
    const k = key as SortKey;
    setDir(k === sortKey ? (dir === "desc" ? "asc" : "desc") : k === "name" ? "asc" : "desc");
    setSortKey(k);
    setPreset((p) => (p === "verified" || p === "ecosystem" ? p : "all"));
    resetVisible();
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const band = MARKET_CAP_BANDS.find((b) => b.value === cap) ?? MARKET_CAP_BANDS[0];
    const get = sortValue[sortKey];
    return allTokens
      .filter((t) => {
        if (preset === "ecosystem" && !(t as any).isEcosystem && (t as any).isExternal) return false;
        if (q && !`${t.name} ${t.symbol} ${t.contractAddress ?? ""} ${t.id}`.toLowerCase().includes(q)) return false;
        if (network !== "all" && t.network !== network) return false;
        if (category !== "all" && t.category !== category) return false;
        if (review === "reviewed" ? !isReviewed(t) : review !== "any" && (t.verificationStatus ?? "not_reviewed") !== review) return false;
        const c = num(t.market.marketCap);
        return c >= band.min && c < band.max;
      })
      .sort((a, b) => {
        const av = get(a), bv = get(b);
        const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
        return dir === "asc" ? cmp : -cmp;
      });
  }, [allTokens, query, network, category, review, cap, preset, sortKey, dir]);

  const filtersActive = query || network !== "all" || category !== "all" || review !== "any" || cap !== "any" || preset === "ecosystem";
  const reset = () => {
    setQuery(""); setNetwork("all"); setCategory("all"); setReview("any"); setCap("any");
    applyPreset("all");
  };

  /* Editorial content */
  const market = useMemo(() => summarizeMarket(allTokens), [allTokens]);
  const lists = useMemo(() => discoveryLists(allTokens), [allTokens]);

  const displayMarketCap = isLiveFeed && marketOverview?.totalMarketCap
    ? marketOverview.totalMarketCap
    : market.marketCap;

  const displayVolume24h = isLiveFeed && marketOverview?.volume24h
    ? marketOverview.volume24h
    : market.volume24h;

  const railItems: RailItem[] = useMemo(
    () =>
      lists.trending.slice(0, 12).map((t) => ({
        id: t.id,
        href: `/tokens/${t.id}`,
        symbol: t.symbol,
        name: t.name,
        logoUrl: t.logoUrl || (t as any).logo || (t as any).image,
        value: usdPrice(t.market.price),
        change: num(t.market.priceChange24h),
        changeLabel: pct(t.market.priceChange24h),
        series: sparkValues(t),
        meta: t.network,
      })),
    [lists],
  );

  const slides: FeaturedSlide[] = useMemo(
    () =>
      featuredTokens(allTokens).map((t) => {
        const live = tokenRelations(t).filter((r) => REL_TAG[r.kind] && r.tone === "live");
        const c = num(t.market.priceChange24h);
        return {
          id: t.id,
          href: `/tokens/${t.id}`,
          symbol: t.symbol,
          logoUrl: t.logoUrl || (t as any).logo || (t as any).image,
          title: t.name,
          kicker: `${t.category ?? "Token"} on ${t.network}`,
          description: t.description ?? "",
          stats: [
            { label: "Price", value: usdPrice(t.market.price) },
            { label: "24h change", value: pct(c), tone: c >= 0 ? "up" : "down" },
            { label: "Market cap", value: usdCompact(t.market.marketCap) },
            { label: "24h volume", value: usdCompact(t.market.volume24h) },
          ],
          tags: live.map((r) => `${REL_TAG[r.kind]} ${r.status.toLowerCase()}`),
          series: sparkValues(t),
          up: c >= 0,
          cta: `View ${t.symbol}`,
        };
      }),
    [allTokens],
  );

  const columns: Column<TokenWithMarket>[] = [
    { key: "rank", header: "#", cell: (_t, i) => <span className="mx-muted">{i + 1}</span>, className: "tk-col-rank" },
    {
      key: "name",
      header: "Token",
      sortable: true,
      cell: (t) => {
        const isEcosystem = (t as any).isEcosystem || !(t as any).isExternal;
        return (
          <Link to={`/tokens/${t.id}`} className="mx-identity">
            <AssetIdentity
              symbol={t.symbol}
              name={t.name}
              logoUrl={t.logoUrl || (t as any).logo || (t as any).image}
              meta={isEcosystem ? <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Ecosystem</span> : undefined}
            />
          </Link>
        );
      },
    },
    { key: "price", header: "Price", sortable: true, align: "end", cell: (t) => usdPrice(t.market.price) },
    { key: "change", header: "24h", sortable: true, align: "end", cell: (t) => <ChangeCell value={t.market.priceChange24h} /> },
    { key: "cap", header: "Market cap", sortable: true, align: "end", hideBelow: "sm", cell: (t) => usdCompact(t.market.marketCap) },
    { key: "volume", header: "Volume 24h", sortable: true, align: "end", hideBelow: "md", cell: (t) => usdCompact(t.market.volume24h) },
    { key: "liquidity", header: "Liquidity", sortable: true, align: "end", hideBelow: "lg", cell: (t) => usdCompact(t.market.liquidity) },
    { key: "network", header: "Network", hideBelow: "md", cell: (t) => <span className="mx-muted">{t.network}</span> },
    {
      key: "trend",
      header: "Last 7 days",
      hideBelow: "lg",
      cell: (t) => (
        <span className={num(t.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>
          <Sparkline values={sparkValues(t)} up={num(t.market.priceChange24h) >= 0} />
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="mx-sr">Actions</span>,
      align: "end",
      cell: (t) => (
        <span className="tk-row-actions">
          {t.status === "active" && (
            <Link to={`/tokens/${t.id}#trade`} className="mx-link hide-md">Trade</Link>
          )}
          <WatchButton name={t.symbol} watched={watch.has(t.id)} onToggle={() => watch.toggle(t.id)} />
        </span>
      ),
    },
  ];

  const shown = rows.slice(0, visible);

  return (
    <div className="tk-page tk-page--explore">
      <TokenSectionNav />
      <TokenBreadcrumb current="Explore tokens" />
      <header className="tk-head">
        <div>
          <h1 className="tk-title">Explore tokens</h1>
          <p className="tk-lede">
            Compare every token on HorizonX by price, volume and liquidity, then open one for its full market and ecosystem picture.
          </p>
        </div>
        <dl className="tk-summary" aria-label="Market summary">
          <div><dt>Market cap</dt><dd>{usdCompact(displayMarketCap)}</dd></div>
          <div><dt>24h volume</dt><dd>{usdCompact(displayVolume24h)}</dd></div>
          <div>
            <dt>Rising, falling</dt>
            <dd><span className="is-up">{market.advancing}</span> / <span className="is-down">{market.declining}</span></dd>
          </div>
        </dl>
      </header>


      <section className="tk-section" aria-labelledby="trending-h">
        <header className="tk-section__head">
          <h2 id="trending-h">Trending now</h2>
          <button type="button" className="mx-link" onClick={() => applyPreset("trending")}>Open trending list</button>
        </header>
        <TrendingRail items={railItems} label="Trending tokens" continuous />
      </section>

      <section className="tk-section" aria-labelledby="featured-h">
        <header className="tk-section__head">
          <h2 id="featured-h">Featured</h2>
        </header>
        <FeaturedCarousel slides={slides} label="Featured tokens" />
      </section>

      <section className="tk-section tk-cols3" aria-label="Market highlights">
        <RankedList title="Top gainers" items={lists.gainers.slice(0, 4)} metric={(t) => <ChangeCell value={t.market.priceChange24h} />} onAll={() => applyPreset("gainers")} />
        <RankedList title="Top volume" items={lists.volume.slice(0, 4)} metric={(t) => usdCompact(t.market.volume24h)} onAll={() => applyPreset("volume")} />
        <RankedList title="Recently launched" items={lists.recent.slice(0, 4)} metric={(t) => <span className="mx-muted">{new Date(t.createdAt || t.updatedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</span>} onAll={() => applyPreset("new")} />
      </section>

      <section className="tk-section tk-directory" id="directory" aria-labelledby="directory-h">
        <header className="tk-section__head">
          <h2 id="directory-h">All tokens</h2>
        </header>

        <div className="mx-tabs" role="group" aria-label="Token lists">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" data-active={preset === p.id} aria-pressed={preset === p.id} onClick={() => applyPreset(p.id)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="tk-toolbar">
          <FilterToolbar
            search={query}
            onSearch={(v) => { setQuery(v); resetVisible(); }}
            searchPlaceholder="Search name, symbol or contract"
            selects={[
              { id: "network", label: "Network", value: network, onChange: (v) => { setNetwork(v); resetVisible(); }, options: [{ value: "all", label: "All networks" }, ...networks.map((n) => ({ value: n, label: n }))] },
              { id: "category", label: "Category", value: category, onChange: (v) => { setCategory(v); resetVisible(); }, options: [{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c, label: c }))] },
              { id: "review", label: "Verification", value: review, onChange: (v) => { setReview(v); if (preset === "verified" && v !== "reviewed") setPreset("all"); resetVisible(); }, options: [{ value: "any", label: "Any verification" }, { value: "reviewed", label: "Reviewed or verified" }, ...VERIFICATION_TIERS.map((v) => ({ value: v.value, label: v.label }))] },
              { id: "cap", label: "Market cap", value: cap, onChange: (v) => { setCap(v); resetVisible(); }, options: MARKET_CAP_BANDS.map((b) => ({ value: b.value, label: b.label })) },
            ]}
            trailing={
              <>
                <span aria-live="polite">{rows.length} of {allTokens.length} tokens</span>
                {filtersActive && <button type="button" className="mx-link" onClick={reset}>Clear filters</button>}
              </>
            }
          />
        </div>

        <DataTable
          caption="Token directory"
          columns={columns}
          rows={shown}
          rowKey={(t) => t.id}
          sortKey={sortKey}
          sortDir={dir}
          onSort={onSort}
          empty={
            <EmptyState
              title="No tokens match these filters"
              body="Try a different network or category, or clear the filters to see every token."
              action={<button type="button" className="mx-btn" onClick={reset}>Clear filters</button>}
            />
          }
        />

        {rows.length > PAGE && (
          <footer className="tk-more">
            <span>Showing {shown.length} of {rows.length}</span>
            {shown.length < rows.length && (
              <button type="button" className="mx-btn" onClick={() => setVisible((v) => v + PAGE)}>
                Show {Math.min(PAGE, rows.length - shown.length)} more
              </button>
            )}
          </footer>
        )}
      </section>
    </div>
  );
}
