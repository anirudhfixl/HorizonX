import "@/components/shared/entity-detail.css";
import React, { useMemo, useState } from "react";
import { TokenSectionNav } from "@/components/tokens/token-section-nav";
import { TokenDetailTabs } from "@/components/tokens/token-detail-tabs";
import { ArrowDownUp, ExternalLink, Share2, Sliders } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { AllocationBar, type AllocationRow } from "@/components/market/allocation-bar";
import { AssetMark } from "@/components/market/asset-mark";
import { CopyText } from "@/components/market/copy-text";
import { DataTable, type Column } from "@/components/market/data-table";
import { DefinitionList } from "@/components/market/definition-list";
import { EcosystemRelationships, type RelationRow } from "@/components/market/ecosystem-relationships";
import { PriceChart } from "@/components/market/price-chart";
import { ProvenanceTag } from "@/components/market/provenance-tag";
import { TabBar } from "@/components/market/tab-bar";
import { WatchButton } from "@/components/market/watch-button";
import { useModal } from "@/contexts/modal-context";
import { useWallet } from "@/contexts/wallet-context";
import { CHART_RANGES } from "@/lib/tokens/config";
import { circulatingSupply, simulatedAllocations, simulatedHolders, simulatedSeries, simulatedTrades, seriesChange } from "@/lib/tokens/demo-data";
import {
  compactNumber,
  explorerTokenUrl,
  formatDate,
  formatDateTime,
  num,
  parseSupply,
  pct,
  shortAddress,
  usdCompact,
  usdPrice,
  verificationLabel,
} from "@/lib/tokens/format";
import { useTokenWatchlist } from "@/lib/tokens/hooks";
import type { ChartRange, Relation, RelationKind, TokenWithMarket, Trade } from "@/lib/tokens/model";
import { getProject, marketRank, sameAddress, TOKEN_CATALOG, tokenRelations } from "@/lib/tokens/selectors";
import { Link } from "react-router-dom";

type TabId = "overview" | "tokenomics" | "holders" | "trades";

const KIND_LABEL: Record<RelationKind, string> = {
  presale: "Presale",
  launch: "Fair launch",
  airdrop: "Airdrop",
  staking: "Staking pool",
  project: "Project",
  exchange: "Exchange",
};

/** Same category first, then same network, then the largest by market cap. */
function relatedTokens(token: TokenWithMarket, limit = 4): TokenWithMarket[] {
  const score = (t: TokenWithMarket) => (t.category && t.category === token.category ? 2 : 0) + (t.network === token.network ? 1 : 0);
  return TOKEN_CATALOG.filter((t) => t.id !== token.id)
    .sort((a, b) => score(b) - score(a) || num(b.market.marketCap) - num(a.market.marketCap))
    .slice(0, limit);
}

function Change({ value, digits }: { value?: number; digits?: number }) {
  const v = num(value);
  return <span className={v >= 0 ? "is-up" : "is-down"}>{pct(v, digits)}</span>;
}



export function InstantSwapWidget({ token }: { token: TokenWithMarket }) {
  const { isConnected } = useWallet();
  const { openModal } = useModal();
  const [payAmount, setPayAmount] = useState<string>("0.1");
  const [direction, setDirection] = useState<"eth_to_token" | "token_to_eth">("eth_to_token");

  // Reference ETH price of $2,500
  const ethPrice = 2500;
  const tokenPrice = Math.max(num(token.market.price), 0.000001);
  const rate = ethPrice / tokenPrice;

  const receiveAmount = useMemo(() => {
    const p = parseFloat(payAmount) || 0;
    if (direction === "eth_to_token") {
      const val = p * rate;
      return val >= 100 ? val.toFixed(2) : val >= 1 ? val.toFixed(4) : val.toFixed(6);
    } else {
      const val = p / rate;
      return val >= 100 ? val.toFixed(2) : val >= 1 ? val.toFixed(4) : val.toFixed(6);
    }
  }, [payAmount, direction, rate]);

  const handleSwap = () => {
    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }
    toast.success(`Swap Simulated Successfully`, {
      description: `Exchanged ${payAmount} ${direction === "eth_to_token" ? "ETH" : token.symbol} for ${receiveAmount} ${direction === "eth_to_token" ? token.symbol : "ETH"} on Sepolia.`,
    });
  };

  return (
    <div id="trade" className="rounded-xl border border-border/80 bg-card/70 p-5 backdrop-blur-md space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">Trade</span>
          <span className="text-[11px] font-mono text-muted-foreground">{token.symbol} / USD · {token.network}</span>
        </div>
        <h3 className="text-base font-semibold text-foreground mt-0.5">Instant swap</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Exchange {direction === "eth_to_token" ? `ETH for ${token.symbol}` : `${token.symbol} for ETH`}
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="entity-detail-swap-field">
          <label htmlFor="swap-pay">You pay</label>
          <div>
            <input
              id="swap-pay"
              type="number"
              min="0"
              step="any"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.0"
            />
            <span>{direction === "eth_to_token" ? "ETH" : token.symbol}</span>
          </div>
        </div>

        <div className="flex justify-center -my-1">
          <button
            type="button"
            aria-label="Switch swap direction"
            onClick={() => setDirection((d) => (d === "eth_to_token" ? "token_to_eth" : "eth_to_token"))}
            className="entity-detail-swap-switch hover:rotate-180 transition-transform cursor-pointer"
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="entity-detail-swap-field">
          <label htmlFor="swap-receive">You receive (estimated)</label>
          <div>
            <input
              id="swap-receive"
              type="text"
              readOnly
              value={receiveAmount}
              className="opacity-90"
            />
            <span>{direction === "eth_to_token" ? token.symbol : "ETH"}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-secondary/30 p-2.5 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Quoted Rate</span>
          <span className="font-mono text-foreground font-medium">
            1 {token.symbol} ≈ ${usdPrice(tokenPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Pool Liquidity</span>
          <span className="font-mono text-foreground font-medium">
            {token.market.liquidity ? usdCompact(token.market.liquidity) : "—"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSwap}
        className="mx-btn mx-btn--primary w-full justify-center py-2.5 font-medium"
      >
        {isConnected ? `Swap ${token.symbol}` : "Connect wallet to swap"}
      </button>

      <p className="text-[11px] leading-relaxed text-muted-foreground pt-1 border-t border-border/40">
        Demo swap execution operates as a client-side simulation. Review contract address before approving.
      </p>
    </div>
  );
}

export function TokenDetailHeader({ token, activeTab }: { token: TokenWithMarket; activeTab: "overview" | "contract" | "activity" }) {
  const watch = useTokenWatchlist();
  const { isConnected, address } = useWallet();
  const rank = (token as any).cmcRank || marketRank(token.id);
  const price = num(token.market.price);
  const change = num(token.market.priceChange24h);
  const project = getProject(token);
  const isCreator = isConnected && sameAddress(token.creatorAddress, address);
  const exchange = tokenRelations(token).find((r) => r.kind === "exchange");
  const explorerUrl = token.contractAddress ? explorerTokenUrl(token.network, token.contractAddress) : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Token link copied");
    } catch {
      toast.error("Could not copy token link", { description: "Clipboard access was denied by the browser." });
    }
  };

  return (
    <>
      <TokenSectionNav />
      <nav aria-label="Breadcrumb" className="tk-breadcrumb">
        <Link to="/tokens">Tokens</Link>
        <span aria-hidden="true">/</span>
        <Link to="/tokens/explore">Explore tokens</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{token.symbol}</span>
      </nav>

      <header className="td-head">
        <div className="td-ident">
          <AssetMark symbol={token.symbol} logoUrl={token.logoUrl || (token as any).logo || (token as any).image} size="lg" />
          <div className="min-w-0">
            <h1 className="td-name">
              {token.name}
              <span className="td-sym">{token.symbol}</span>
            </h1>
            <p className="td-sub">
              {[token.category, token.network, rank && rank > 0 ? `Rank #${rank} by market cap` : null].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="Token catalog metadata">
              <ProvenanceTag kind={token.market?.isLive ? "onchain" : "catalog"} label={token.market?.isLive ? "Live CoinMarketCap" : "Catalog"} />
              <StatusBadge status={token.status} />
              <span className="mx-prov mx-prov--catalog">{token.standard || "Standard not recorded"}</span>
              <span className="mx-prov mx-prov--catalog">{verificationLabel(token.verificationStatus)}</span>
              {project && (
                <Link to={`/projects/${project.id}`} className="mx-prov mx-prov--catalog hover:text-foreground">
                  Project: {project.name}
                </Link>
              )}
              {isCreator && (
                <Link to="/tokens/my" className="mx-prov mx-prov--session hover:text-foreground">
                  Created by your wallet
                </Link>
              )}
            </div>
            {token.contractAddress && (
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="shrink-0">Contract</span>
                <code className="mx-mono break-all" title={token.contractAddress}>{token.contractAddress}</code>
                <CopyText value={token.contractAddress} label={`${token.symbol} contract address`} />
                {explorerUrl && (
                  <a className="mx-icon-btn" href={explorerUrl} target="_blank" rel="noreferrer" aria-label={`Open ${token.symbol} on the block explorer`} title="Open on block explorer">
                    <ExternalLink />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="td-quote">
          <p className="td-price">{usdPrice(price)}</p>
          <p className="td-change">
            <Change value={change} /> <span className="mx-muted">24h</span>
          </p>
        </div>
      </header>

      <TokenDetailTabs tokenId={token.id} activeTab={activeTab} />

      <div className="td-actions">
        <WatchButton variant="labelled" name={token.symbol} watched={watch.has(token.id)} onToggle={() => watch.toggle(token.id)} />
        {exchange && <a href="#trade" className="mx-btn mx-btn--primary">Trade {token.symbol}</a>}
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noreferrer" className="mx-btn">
            Explorer <ExternalLink aria-hidden="true" />
          </a>
        )}
        <button type="button" onClick={handleShare} className="mx-btn">
          <Share2 aria-hidden="true" /> Share
        </button>
        {isCreator && (
          <Link to="/tokens/my" className="mx-btn">
            <Sliders aria-hidden="true" /> Manage
          </Link>
        )}
        <span className="td-source">
          <ProvenanceTag
            kind={token.market?.isLive ? "onchain" : "simulated"}
            label={token.market?.isLive ? "Live CoinMarketCap feed" : "Simulated market data"}
          />
        </span>
      </div>
    </>
  );
}

export function TokenDetail({ token }: { token: TokenWithMarket }) {
  const { isConnected, address } = useWallet();
  const [range, setRange] = useState<ChartRange>("7D");
  const [tab, setTab] = useState<TabId>("overview");

  const series = useMemo(() => simulatedSeries(token, range), [token, range]);
  const lows = useMemo(() => {
    const vs = series.map((p) => p.v);
    return { low: Math.min(...vs), high: Math.max(...vs), change: seriesChange(series) };
  }, [series]);

  const rank = marketRank(token.id);
  const price = num(token.market.price);
  const cap = num(token.market.marketCap);
  const volume = num(token.market.volume24h);
  const totalSupply = parseSupply(token.totalSupply);
  const circulating = circulatingSupply(token);
  const fdv = price * totalSupply;
  const turnover = cap ? (volume / cap) * 100 : 0;
  const change = num(token.market.priceChange24h);

  const relations: Relation[] = useMemo(() => tokenRelations(token), [token]);
  const relationRows: RelationRow[] = relations.map((r) => ({ ...r, kind: KIND_LABEL[r.kind] }));
  const project = getProject(token);
  const related = useMemo(() => relatedTokens(token), [token]);
  const isCreator = isConnected && sameAddress(token.creatorAddress, address);

  const allocations = useMemo(() => simulatedAllocations(token), [token]);
  const holders = useMemo(() => simulatedHolders(token), [token]);
  const trades = useMemo(() => simulatedTrades(token), [token]);

  const allocationRows: AllocationRow[] = allocations.map((a) => ({
    label: a.label,
    pct: a.pct,
    amount: totalSupply ? `${compactNumber((totalSupply * a.pct) / 100)} ${token.symbol}` : "—",
    note: a.vesting,
  }));

  const tradeCols: Column<Trade>[] = [
    { key: "time", header: "Time", cell: (t) => <span className="mx-muted">{formatDateTime(t.time)}</span> },
    { key: "type", header: "Type", cell: (t) => <span className={`td-trade-type--${t.type}`}>{t.type}</span> },
    { key: "amount", header: "Amount", align: "end", cell: (t) => `${compactNumber(t.amount)} ${token.symbol}` },
    { key: "price", header: "Price", align: "end", hideBelow: "sm", cell: (t) => usdPrice(t.price) },
    { key: "value", header: "Value", align: "end", cell: (t) => usdCompact(t.value) },
    { key: "wallet", header: "Wallet", hideBelow: "md", cell: (t) => <span className="mx-mono mx-muted">{t.wallet}</span> },
  ];

  const explorerUrl = token.contractAddress ? explorerTokenUrl(token.network, token.contractAddress) : null;



  return (
    <div className="tk-page">
      <TokenDetailHeader token={token} activeTab="overview" />

      <div className="td-layout">
        <div className="td-main">
          <section className="td-chart" aria-label={`${token.symbol} price chart`}>
            <div className="td-chart__top">
              <dl className="td-chart__stats">
                <div><dt>Change</dt><dd><Change value={lows.change} /></dd></div>
                <div><dt>High</dt><dd>{usdPrice(lows.high)}</dd></div>
                <div><dt>Low</dt><dd>{usdPrice(lows.low)}</dd></div>
              </dl>
              <div className="td-range" role="group" aria-label="Chart range">
                {CHART_RANGES.map((r) => (
                  <button key={r.key} type="button" data-active={range === r.key} aria-pressed={range === r.key} onClick={() => setRange(r.key)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <PriceChart
              points={series}
              height={300}
              ariaLabel={`${token.name} simulated price over the past ${CHART_RANGES.find((r) => r.key === range)?.label}`}
              formatValue={usdPrice}
              formatTime={(t) => (range === "24H" ? formatDateTime(t) : formatDate(t))}
            />
            {token.market?.isLive ? (
              <p className="tk-note">Live price feed anchored to CoinMarketCap. Trajectory rendered for historical context.</p>
            ) : (
              <p className="tk-note">Illustrative price path generated from the catalog price and 24h change. It is not historical market data.</p>
            )}
          </section>

          <dl className="td-stats" aria-label="Market statistics">
            <div><dt>Market cap</dt><dd>{usdCompact(cap)}<small>{token.market?.isLive && rank > 0 ? `Rank #${rank} Global Market Cap` : `Rank ${rank || 1} of ${TOKEN_CATALOG.length}`}</small></dd></div>
            <div><dt>Fully diluted</dt><dd>{totalSupply ? usdCompact(fdv) : "—"}<small>Price × total supply</small></dd></div>
            <div><dt>Volume 24h</dt><dd>{usdCompact(volume)}<small>{turnover.toFixed(1)}% of market cap</small></dd></div>
            <div><dt>Liquidity</dt><dd>{usdCompact(num(token.market.liquidity))}<small>{cap ? `${((num(token.market.liquidity) / cap) * 100).toFixed(1)}% of market cap` : ""}</small></dd></div>
          </dl>

          <section className="td-tabs" aria-label="Token information">
            <TabBar
              idPrefix="detail"
              label="Token information"
              active={tab}
              onChange={(id) => setTab(id as TabId)}
              tabs={[
                { id: "overview", label: "Overview" },
                { id: "tokenomics", label: "Tokenomics" },
                { id: "holders", label: "Holders" },
                { id: "trades", label: "Recent trades" },
              ]}
            />
            <div className="td-panel" role="tabpanel" id={`detail-panel-${tab}`} aria-labelledby={`detail-tab-${tab}`}>
              {tab === "overview" && (
                <>
                  <h2>About {token.name}</h2>
                  <p className="td-prose">{token.description ?? "No description has been recorded for this token."}</p>
                  {token.features && token.features.length > 0 && (
                    <ul className="td-features" aria-label="Features">
                      {token.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                  <div className="td-twocol">
                    <section aria-labelledby="td-token-h">
                      <h3 id="td-token-h">Token</h3>
                      <DefinitionList
                        items={[
                          { label: "Network", value: token.network },
                          { label: "Standard", value: token.standard ?? "—" },
                          { label: "Category", value: token.category ?? "—" },
                          { label: "Decimals", value: token.decimals ?? "—" },
                          { label: "Total supply", value: token.totalSupply ?? "—" },
                          { label: "Circulating supply", value: circulating ? compactNumber(circulating) : "—", hint: totalSupply && circulating ? `${((circulating / totalSupply) * 100).toFixed(1)}% of total` : undefined },
                        ]}
                      />
                    </section>
                    <section aria-labelledby="td-record-h">
                      <h3 id="td-record-h">Catalog record</h3>
                      <DefinitionList
                        items={[
                          {
                            label: "Contract",
                            value: token.contractAddress ? (
                              <span className="td-addr">
                                <span className="mx-mono" title={token.contractAddress}>{shortAddress(token.contractAddress, 8, 6)}</span>
                                <CopyText value={token.contractAddress} label={`${token.symbol} contract address`} />
                                {explorerUrl && (
                                  <a className="mx-icon-btn" href={explorerUrl} target="_blank" rel="noreferrer" aria-label={`Open ${token.symbol} on the block explorer`} title="Open on block explorer">
                                    <ExternalLink />
                                  </a>
                                )}
                              </span>
                            ) : "Not recorded",
                            hint: "Recorded in the catalog, not verified on-chain",
                          },
                          { label: "Verification", value: verificationLabel(token.verificationStatus), hint: (token.verificationStatus ?? "not_reviewed") === "not_reviewed" ? "No review recorded" : "Catalog status, not an on-chain check" },
                          { label: "Status", value: token.status.charAt(0).toUpperCase() + token.status.slice(1) },
                          { label: "Created", value: formatDate(token.createdAt) },
                          { label: "Updated", value: formatDate(token.updatedAt) },
                          { label: "Creator", value: token.creatorAddress ? <span className="mx-mono" title={token.creatorAddress}>{shortAddress(token.creatorAddress, 6, 4)}</span> : "—" },
                        ]}
                      />
                    </section>
                  </div>
                </>
              )}

              {tab === "tokenomics" && (
                <>
                  <h2>Token allocation</h2>
                  <p className="tk-note">
                    <ProvenanceTag kind="simulated" label="Simulated allocation" /> An illustrative split applied to the catalog total supply. It is not read from the token contract or a vesting schedule.
                  </p>
                  <AllocationBar rows={allocationRows} caption={`${token.name} illustrative allocation`} />
                  <DefinitionList
                    className="td-supply"
                    items={[
                      { label: "Total supply", value: token.totalSupply ?? "—" },
                      { label: "Circulating supply", value: circulating ? `${compactNumber(circulating)} ${token.symbol}` : "—", hint: "Market cap divided by price, from the catalog" },
                      { label: "Not yet circulating", value: totalSupply && circulating ? `${compactNumber(Math.max(0, totalSupply - circulating))} ${token.symbol}` : "—" },
                    ]}
                  />
                </>
              )}

              {tab === "holders" && (
                <>
                  <h2>Holder distribution</h2>
                  <p className="tk-note">
                    <ProvenanceTag kind="simulated" label="Simulated distribution" /> Aggregate figures only. HorizonX does not read holder balances from the blockchain yet, and no individual wallets are shown.
                  </p>
                  <DefinitionList
                    items={[
                      { label: "Holders", value: holders.holderCount.toLocaleString("en-US") },
                      { label: "Top 10 wallets hold", value: `${holders.top10Share.toFixed(1)}%`, hint: "of total supply" },
                    ]}
                  />
                  <table className="mx-table mx-table--dense" style={{ marginTop: "1.5rem" }}>
                    <caption className="mx-sr">Holders by share of supply</caption>
                    <thead>
                      <tr>
                        <th scope="col">Holding size</th>
                        <th scope="col" className="is-end">Holders</th>
                        <th scope="col" className="is-end">Share of supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holders.tiers.map((t) => (
                        <tr key={t.label}>
                          <td>{t.label}</td>
                          <td className="is-end">{t.holders.toLocaleString("en-US")}</td>
                          <td className="is-end">
                            {t.supplyShare.toFixed(1)}%
                            <span className="td-tier-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, t.supplyShare)}%` }} /></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {tab === "trades" && (
                <>
                  <h2>Recent trades</h2>
                  <p className="tk-note">
                    <ProvenanceTag kind="simulated" label="Simulated trades" /> Illustrative transactions with masked identifiers. They are not linked to real wallets or transaction hashes.
                  </p>
                  <DataTable caption={`${token.symbol} recent simulated trades`} columns={tradeCols} rows={trades} rowKey={(t) => t.id} dense />
                </>
              )}
            </div>
          </section>
        </div>

        <aside className="td-aside" aria-label="Related">
          <InstantSwapWidget token={token} />

          <div>
            {relationRows.length > 0 ? (
              <EcosystemRelationships rows={relationRows} heading={`${token.symbol} on HorizonX`} />
            ) : (
              <>
                <h3>{token.symbol} on HorizonX</h3>
                <p className="tk-note">No presale, airdrop, staking pool or project is linked to this token yet.</p>
              </>
            )}
            {isCreator && (
              <p className="td-owner">
                You created this token. <Link to="/tokens/my">Manage it</Link>, or set up a <Link to="/launchpad/presales/create">presale</Link>, <Link to="/airdrops/campaigns/create">airdrop</Link> or <Link to="/staking/pools/create">staking pool</Link>.
              </p>
            )}
            {project?.websiteUrl && (
              <p className="td-owner">
                <a href={project.websiteUrl} target="_blank" rel="noreferrer">Project website</a>
              </p>
            )}
          </div>

          <div>
            <h3>Similar tokens</h3>
            <ul className="td-similar">
              {related.map((t) => (
                <li key={t.id}>
                  <Link to={`/tokens/${t.id}`} className="mx-identity">
                    <AssetMark symbol={t.symbol} logoUrl={t.logoUrl} size="sm" />
                    <span className="mx-identity__text"><b>{t.symbol}</b><small>{t.category ?? t.network}</small></span>
                  </Link>
                  <span className="tk-list__fig">
                    <b>{usdPrice(t.market.price)}</b>
                    <small><Change value={t.market.priceChange24h} /></small>
                  </span>
                </li>
              ))}
            </ul>
            <div className="td-subnav">
              <Link to="/tokens/explore" className="mx-link">Explore all tokens</Link>
              <Link to="/tokens/watchlist" className="mx-link">Your watchlist</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
