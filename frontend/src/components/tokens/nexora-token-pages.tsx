import React, { useEffect, useMemo, useState } from "react";
import { TokenShaderHero } from "@/components/tokens/token-shader-hero";
import { TOKENS } from "@/data";
import type { Token, TokenMarketData } from "@/types";
import {
  Search, X, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown,
  TrendingUp, TrendingDown, Activity, Globe2, BarChart3, Bookmark,
  LayoutGrid, Rows3, ChevronRight, Star, Info, Wallet, Plus,
  ExternalLink, ShieldCheck, ChevronLeft
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/projects/copy-button";
import { Link, useNavigate } from "react-router-dom";

type MarketToken = Token & { market: TokenMarketData };
const catalogue = TOKENS as MarketToken[];
const num = (v?: number) => Number.isFinite(v) ? (v as number) : 0;
const usd = (v?: number) => {
  if (v == null || !Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
  if (Math.abs(v) >= 1e9) return `$${(v/1e9).toFixed(2)}B`;
  if (Math.abs(v) >= 1e6) return `$${(v/1e6).toFixed(2)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v/1e3).toFixed(2)}K`;
  return `$${v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:v < .01 ? 6 : 2})}`;
};
const pct = (v?: number) => `${num(v)>=0?"+":""}${num(v).toFixed(2)}%`;
const networks = ["All networks", ...Array.from(new Set(catalogue.map(t => t.network)))];
const seriesFor = (t: MarketToken) => Array.from({length:24},(_,i) => {
  const change = num(t.market.priceChange24h);
  return 42 + Math.sin(i*1.21+t.symbol.length)*7 + Math.cos(i*.53+t.id.length)*4 + (i/23-.5)*change*.65;
});
function Spark({token,negative=false}:{token:MarketToken;negative?:boolean}) {
  const values=seriesFor(token), min=Math.min(...values), max=Math.max(...values);
  const points=values.map((v,i)=>`${(i/(values.length-1))*100},${28-((v-min)/(max-min||1))*24}`).join(" ");
  return <svg className="nxt-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden><polyline points={points} fill="none" stroke={negative?"#fb7185":"#70d8b1"} strokeWidth="1.7" vectorEffect="non-scaling-stroke"/></svg>;
}
function Mark({token,size="md"}:{token:MarketToken;size?:"sm"|"md"|"lg"}) {
  return <span className={`nxt-mark nxt-mark--${size}`}>{token.logoUrl ? <img src={token.logoUrl} alt="" /> : token.symbol.slice(0,1)}</span>;
}
function Section({title,hint,children,index}:{title:string;hint?:string;children:React.ReactNode;index?:string}) {
  return <section className="nxt-panel"><header className="nxt-panel__head">{index&&<i>{index}</i>}<b>{title}</b>{hint&&<span>{hint}</span>}</header>{children}</section>;
}
const readWatch = () => { try { const x=JSON.parse(localStorage.getItem("prominers_nexora_token_watchlist")||"[]"); return Array.isArray(x)?x as string[]:[]; } catch { return []; } };

export function NexoraTokenDirectory() {
  const navigate = useNavigate();
  const [query,setQuery]=useState("");
  const [network,setNetwork]=useState("All networks");
  const [category,setCategory]=useState("All categories");
  const [status,setStatus]=useState("All statuses");
  const [verification,setVerification]=useState("All verification");
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);
  const [sort,setSort]=useState<"marketCap"|"volume24h"|"priceChange24h"|"price"|"name">("marketCap");
  const [ascending,setAscending]=useState(false);
  const [direction,setDirection]=useState<"all"|"up"|"down">("all");
  const [layout,setLayout]=useState<"table"|"heatmap">("table");
  const [watched,setWatched]=useState<string[]>([]);
  const [watchOnly,setWatchOnly]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{setWatched(readWatch());setReady(true);},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem("prominers_nexora_token_watchlist",JSON.stringify(watched));}catch{}},[watched,ready]);
  const categories=["All categories",...Array.from(new Set(catalogue.map(t=>t.category).filter(Boolean) as string[])).sort()];
  const statuses=["All statuses",...Array.from(new Set(catalogue.map(t=>t.status).filter(Boolean) as string[])).sort()];
  const verifications=["All verification","audit_available","contract_source_verified","project_reviewed","not_reviewed"];
  const totalCap=catalogue.reduce((s,t)=>s+num(t.market.marketCap),0);
  const totalVol=catalogue.reduce((s,t)=>s+num(t.market.volume24h),0);
  const weighted=totalCap?catalogue.reduce((s,t)=>s+num(t.market.priceChange24h)*num(t.market.marketCap),0)/totalCap:0;
  const gainers=[...catalogue].sort((a,b)=>num(b.market.priceChange24h)-num(a.market.priceChange24h)).slice(0,4);
  const losers=[...catalogue].sort((a,b)=>num(a.market.priceChange24h)-num(b.market.priceChange24h)).slice(0,4);
  const bucketDefs:[string,number,number][]=[["< −8",-Infinity,-8],["−8–−4",-8,-4],["−4–−2",-4,-2],["−2–0",-2,0],["0–2",0,2],["2–4",2,4],["4–8",4,8],["> 8",8,Infinity]];
  const buckets=bucketDefs.map(([label,min,max])=>({label,count:catalogue.filter(t=>{const c=num(t.market.priceChange24h);return c>=min&&c<max;}).length,up:min>=0}));
  const networkStats=networks.slice(1).map(n=>({name:n,cap:catalogue.filter(t=>t.network===n).reduce((s,t)=>s+num(t.market.marketCap),0)})).sort((a,b)=>b.cap-a.cap);
  const filtered=useMemo(()=>catalogue.filter(t=>{
    const q=query.trim().toLowerCase();
    return (!q||`${t.name} ${t.symbol} ${t.network} ${t.contractAddress||""}`.toLowerCase().includes(q)) &&
      (network==="All networks"||t.network===network) &&
      (category==="All categories"||t.category===category) &&
      (status==="All statuses"||t.status===status) &&
      (verification==="All verification"||(t.verificationStatus||"not_reviewed")===verification) &&
      (direction==="all"||(direction==="up"?num(t.market.priceChange24h)>=0:num(t.market.priceChange24h)<0)) &&
      (!watchOnly||watched.includes(t.id));
  }).sort((a,b)=>{
    const av=sort==="name"?a.name:a.market[sort] as number|undefined;
    const bv=sort==="name"?b.name:b.market[sort] as number|undefined;
    const cmp=sort==="name"?(av as string).localeCompare(bv as string):num(av as number|undefined)-num(bv as number|undefined);
    return cmp*(ascending?1:-1);
  }),[query,network,category,status,verification,direction,watchOnly,watched,sort,ascending]);
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const currentPage=Math.min(page,totalPages);
  const paginated=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const resetFilters=()=>{
    setQuery("");
    setNetwork("All networks");
    setCategory("All categories");
    setStatus("All statuses");
    setVerification("All verification");
    setDirection("all");
    setWatchOnly(false);
    setSort("marketCap");
    setAscending(false);
    setPage(1);
  };
  const toggleWatch=(id:string)=>setWatched(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  return <>
    <TokenShaderHero
      onScrollToWizard={() => navigate("/tokens/create")}
      onExploreSetup={() => document.getElementById("nxt-directory")?.scrollIntoView({ behavior: "smooth", block: "start" })}
    />
    <main className="nxt-page">
    <div className="nxt-tape" aria-label="Largest assets">
      {[...catalogue].sort((a,b)=>num(b.market.marketCap)-num(a.market.marketCap)).slice(0,8).map((t,i)=><Link to={`/tokens/${t.id}`} key={t.id}><small>{i+1}</small><Mark token={t} size="sm"/><b>{t.symbol}</b><span>{usd(t.market.price)}</span><em className={num(t.market.priceChange24h)>=0?"is-up":"is-down"}>{num(t.market.priceChange24h)>=0?"↗":"↘"} {pct(t.market.priceChange24h)}</em></Link>)}
    </div>
    <div className="nxt-data-line"><b>Catalogue data</b><span>Values are illustrative · Not a live trading feed</span><span className="nxt-updated">UPDATED {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span></div>
    <div className="nxt-zone"><b>MARKET OVERVIEW</b><span>Catalogue indicators · 24h</span></div>
    <div className="nxt-stat-strip">
      <article><label>TRACKED MARKET CAP</label><strong>{usd(totalCap)}</strong><small>{catalogue.length} catalogue assets</small></article>
      <article><label>24H VOLUME</label><strong>{usd(totalVol)}</strong><small>{totalCap?(totalVol/totalCap*100).toFixed(1):"0.0"}% of cap</small></article>
      <article><label>CAP-WEIGHTED 24H</label><strong className={weighted>=0?"is-up":"is-down"}>{pct(weighted)}</strong><small>Weighted by market cap</small></article>
      <article><label>MARKET BREADTH</label><strong><span className="is-up">{catalogue.filter(t=>num(t.market.priceChange24h)>=0).length}</span><i>/</i><span className="is-down">{catalogue.filter(t=>num(t.market.priceChange24h)<0).length}</span></strong><div className="nxt-breadth"><i style={{width:`${catalogue.length?catalogue.filter(t=>num(t.market.priceChange24h)>=0).length/catalogue.length*100:0}%`}}/><i/></div></article>
    </div>
    <div className="nxt-insights">
      <Section title="Movers" index="01" hint="24h">
        <div className="nxt-movers">
          <div><label className="is-up">GAINERS</label>{gainers.map(t=><Link to={`/tokens/${t.id}`} key={t.id} className="nxt-mover"><Mark token={t} size="sm"/><span><b>{t.symbol}</b><small>{t.name}</small></span><Spark token={t}/><strong className="is-up">↗ {pct(t.market.priceChange24h)}</strong></Link>)}</div>
          <div><label className="is-down">LOSERS</label>{losers.map(t=><Link to={`/tokens/${t.id}`} key={t.id} className="nxt-mover"><Mark token={t} size="sm"/><span><b>{t.symbol}</b><small>{t.name}</small></span><Spark token={t} negative/><strong className="is-down">↘ {pct(t.market.priceChange24h)}</strong></Link>)}</div>
        </div>
      </Section>
      <Section title="24h distribution" index="02" hint="tokens per bucket (%)">
        <div className="nxt-hist">{buckets.map((b,i)=><div key={b.label}><small>{b.count}</small><span><i className={b.up?"is-up":"is-down"} style={{height:`${Math.max(2,b.count/Math.max(1,...buckets.map(x=>x.count))*100)}%`}}/></span><em>{b.label}</em></div>)}</div>
      </Section>
      <Section title="Cap by network" index="03" hint="click to filter">
        <div className="nxt-networks">{networkStats.map((n,i)=><button key={n.name} onClick={()=>{setNetwork(network===n.name?"All networks":n.name);setPage(1);document.getElementById("nxt-directory")?.scrollIntoView({behavior:"smooth",block:"start"});}}><span><i style={{background:["#a9b7d0","#70d8b1","#fb7185","#79aef5","#b99bff","#e7a16c"][i%6]}}/>{n.name}</span><b><i style={{width:`${totalCap?n.cap/totalCap*100:0}%`}}/></b><small>{totalCap?(n.cap/totalCap*100).toFixed(1):"0.0"}%</small></button>)}</div>
      </Section>
    </div>
    <div className="nxt-zone nxt-directory-zone" id="nxt-directory"><b>TOKEN DIRECTORY</b><span>Rank, filter and compare</span></div>
    <section className="nxt-directory">
      <div className="nxt-controls">
        <label className="nxt-search"><Search/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="Search ticker or name"/>{query&&<button onClick={()=>{setQuery("");setPage(1)}} aria-label="Clear search"><X/></button>}</label>
        <select aria-label="Network filter" value={network} onChange={e=>{setNetwork(e.target.value);setPage(1)}}>{networks.map(n=><option key={n}>{n}</option>)}</select>
        <select aria-label="Category filter" value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}}>{categories.map(n=><option key={n}>{n}</option>)}</select>
        <select aria-label="Status filter" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>{statuses.map(n=><option key={n}>{n}</option>)}</select>
        <select aria-label="Verification filter" value={verification} onChange={e=>{setVerification(e.target.value);setPage(1)}}>{verifications.map(n=><option key={n} value={n}>{n==="All verification"?"All verification":n.replaceAll("_"," ")}</option>)}</select>
        <select aria-label="Sort tokens" value={sort} onChange={e=>{setSort(e.target.value as typeof sort);setPage(1)}}><option value="marketCap">Market cap</option><option value="volume24h">Volume</option><option value="priceChange24h">24h change</option><option value="price">Price</option><option value="name">Name</option></select>
        <div className="nxt-direction">{(["all","up","down"] as const).map(d=><button key={d} className={direction===d?"active":""} onClick={()=>{setDirection(d);setPage(1)}}>{d==="all"?"All":d==="up"?"Gainers":"Losers"} <small>{d==="all"?catalogue.length:d==="up"?gainers.length+catalogue.filter(t=>num(t.market.priceChange24h)>=0).length-gainers.length:catalogue.filter(t=>num(t.market.priceChange24h)<0).length}</small></button>)}</div>
      </div>
      <div className="nxt-control-foot"><button className={watchOnly?"active":""} onClick={()=>{setWatchOnly(!watchOnly);setPage(1)}}><Bookmark/> Watchlist only <small>{watched.length}</small></button><button onClick={()=>setAscending(!ascending)}>{ascending?<ArrowUp/>:<ArrowDown/>} {ascending?"Ascending":"Descending"}</button><span><b>{filtered.length}</b> of {catalogue.length} tokens</span><button onClick={resetFilters}>Reset filters</button><label className="nxt-page-size">Rows <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}}><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option></select></label><div className="nxt-layout"><button className={layout==="table"?"active":""} onClick={()=>setLayout("table")}><Rows3/> Table</button><button className={layout==="heatmap"?"active":""} onClick={()=>setLayout("heatmap")}><LayoutGrid/> Heat map</button></div></div>
      {layout==="table"?<div className="nxt-table-scroll"><table className="nxt-table"><thead><tr><th>#</th><th>ASSET</th><th>NETWORK</th><th>CONTRACT</th><th>PRICE</th><th>24H</th><th>MARKET CAP <button onClick={()=>{setSort("marketCap");setAscending(!ascending)}}>↕</button></th><th>VOLUME 24H</th><th>TREND</th><th>STATUS</th><th>VERIFICATION</th><th/></tr></thead><tbody>{paginated.map((t,i)=><tr key={t.id}><td className="nxt-rank">{String((currentPage-1)*pageSize+i+1).padStart(2,"0")}</td><td><Link to={`/tokens/${t.id}`} className="nxt-asset"><Mark token={t}/><span><b>{t.symbol}</b><small>{t.name}</small></span></Link></td><td><span className="nxt-network-chip"><i/>{t.network.replace("Ethereum ","")}</span></td><td className="nxt-contract-cell">{t.contractAddress?<><span title={t.contractAddress}>{t.contractAddress.slice(0,6)}…{t.contractAddress.slice(-4)}</span><CopyButton value={t.contractAddress} label={`${t.symbol} contract`} className="nxt-copy"/></>:<span className="nxt-muted-dash">—</span>}{t.contractAddress&&<a href={`${t.network.toLowerCase().includes("sepolia")||t.network.toLowerCase()==="ethereum"?"https://sepolia.etherscan.io":t.network.toLowerCase().includes("base")?"https://basescan.org":t.network.toLowerCase().includes("arbitrum")?"https://arbiscan.io":"https://polygonscan.com"}/token/${t.contractAddress}`} target="_blank" rel="noreferrer" aria-label={`Open ${t.symbol} contract explorer`}><ExternalLink/></a>}</td><td className="nxt-num">{usd(t.market.price)}</td><td className={num(t.market.priceChange24h)>=0?"is-up":"is-down"}>{num(t.market.priceChange24h)>=0?"↗":"↘"} {pct(t.market.priceChange24h)}</td><td className="nxt-num"><span>{usd(t.market.marketCap)}</span><i className="nxt-capline"><b style={{width:`${totalCap?num(t.market.marketCap)/totalCap*100:0}%`}}/></i></td><td className="nxt-num">{usd(t.market.volume24h)}<small className="nxt-subnum">{totalVol?(num(t.market.volume24h)/totalVol*100).toFixed(1):"0"}% of vol</small></td><td><Spark token={t} negative={num(t.market.priceChange24h)<0}/></td><td><StatusBadge status={t.status} className="nxt-status-badge"/></td><td><span className={`nxt-verification ${t.verificationStatus==="audit_available"?"verified":t.verificationStatus==="contract_source_verified"?"source":t.verificationStatus==="project_reviewed"?"reviewed":""}`}><ShieldCheck/>{(t.verificationStatus||"not_reviewed").replaceAll("_"," ")}</span></td><td><button className={`nxt-watch ${watched.includes(t.id)?"selected":""}`} onClick={()=>toggleWatch(t.id)} aria-label={`Toggle ${t.symbol} watchlist`}><Bookmark/></button></td></tr>)}</tbody></table>{!filtered.length&&<div className="nxt-empty">No tokens match these filters.</div>}</div>:<div className="nxt-heatmap">{filtered.map(t=><Link to={`/tokens/${t.id}`} key={t.id} className={`nxt-heat-tile ${num(t.market.priceChange24h)>=0?"up":"down"}`} style={{flex:`${Math.max(1,Math.sqrt(num(t.market.marketCap)))} 1 130px`}}><b>{t.symbol}</b><strong>{pct(t.market.priceChange24h)}</strong><small>{usd(t.market.marketCap)}</small></Link>)}</div>}
      {layout==="table"&&totalPages>1&&<nav className="nxt-pagination" aria-label="Token pagination"><span>Page {currentPage} of {totalPages}</span><div><button disabled={currentPage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft/> Previous</button><button disabled={currentPage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next <ChevronRight/></button></div></nav>}
      <footer className="nxt-table-foot"><span>SHOWING {filtered.length} OF {catalogue.length} ASSETS</span><span>VALUES IN USD · CATALOG SNAPSHOT</span></footer>
    </section>
  </main>
  </>;
}

export function NexoraTokenDetail({token}:{token:MarketToken}) {
  const [period,setPeriod]=useState<"12"|"20"|"28">("28");
  const [watched,setWatched]=useState(false);
  useEffect(()=>setWatched(readWatch().includes(token.id)),[token.id]);
  const peers=catalogue.filter(t=>t.network===token.network&&t.id!==token.id).sort((a,b)=>num(b.market.marketCap)-num(a.market.marketCap)).slice(0,5);
  const cap=num(token.market.marketCap), vol=num(token.market.volume24h), price=num(token.market.price), change24=num(token.market.priceChange24h);
  const ranked=[...catalogue].sort((a,b)=>num(b.market.marketCap)-num(a.market.marketCap));
  const rank=ranked.findIndex(t=>t.id===token.id)+1;
  const totalCap=catalogue.reduce((s,t)=>s+num(t.market.marketCap),0);
  const raw=Array.from({length:28},(_,i)=>price*(1+Math.sin(i*1.17+token.id.length)*.026+Math.cos(i*.41+token.symbol.length)*.013+(i/28-.5)*(change24/150)));
  const values=raw.slice(-Number(period)), low=Math.min(...values), high=Math.max(...values);
  const points=values.map((v,i)=>`${i/(values.length-1)*100},${36-(v-low)/(high-low||1)*32}`).join(" ");
  const up=change24>=0;
  const metrics=[["Market cap",usd(cap),`Rank ${rank} of ${catalogue.length}`],["24h volume",usd(vol),`Volume ÷ market cap`],["Turnover",`${cap?(vol/cap*100).toFixed(1):"0.0"}%`,"Trading activity"],["Book share",`${totalCap?(cap/totalCap*100).toFixed(2):"0.00"}%`,"Of tracked catalogue cap"]];
  const toggle=()=>{const next=watched?readWatch().filter(x=>x!==token.id):Array.from(new Set([...readWatch(),token.id]));setWatched(!watched);try{localStorage.setItem("prominers_nexora_token_watchlist",JSON.stringify(next));}catch{}};
  return <main className="nxt-page nxt-detail-page">
    <nav className="nxt-detail-crumb"><Link to="/tokens">← TOKENS</Link><ChevronRight/><span>{token.symbol}</span></nav>
    <header className="nxt-detail-hero"><div className="nxt-detail-identity"><Mark token={token} size="lg"/><div><div className="nxt-eyebrow">{token.network.toUpperCase()} <span>·</span> MARKET CAP RANK #{rank}</div><h1>{token.name} <small>{token.symbol}</small></h1><p>{token.description||"Digital asset in the HorizonX token catalogue."}</p></div></div><div className="nxt-detail-quote"><span>CATALOGUE QUOTE</span><strong>{usd(price)}</strong><em className={up?"is-up":"is-down"}>{up?"↗":"↘"} {pct(change24)} <small>24H</small></em><button onClick={toggle} className={watched?"selected":""}><Bookmark/> {watched?"WATCHING":"ADD TO WATCHLIST"}</button></div></header>
    <div className="nxt-detail-grid"><div className="nxt-detail-main">
      <section className="nxt-panel nxt-price-panel"><header className="nxt-panel__head"><b>PRICE PERFORMANCE</b><span>ILLUSTRATIVE PRICE PATH</span></header><div className="nxt-chart-top"><strong>{usd(price)}</strong><em className={up?"is-up":"is-down"}>{pct(change24)}</em><div>{(["12","20","28"] as const).map(p=><button key={p} className={period===p?"active":""} onClick={()=>setPeriod(p)}>{p==="12"?"12H":p==="20"?"20D":"28D"}</button>)}</div></div><div className="nxt-price-chart"><span>{usd(high)}</span><span>{usd((high+low)/2)}</span><span>{usd(low)}</span><svg viewBox="0 0 100 40" preserveAspectRatio="none"><defs><linearGradient id="nxt-detail-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={up?"#70d8b1":"#fb7185"} stopOpacity=".25"/><stop offset="1" stopColor={up?"#70d8b1":"#fb7185"} stopOpacity="0"/></linearGradient></defs><polygon points={`0,40 ${points} 100,40`} fill="url(#nxt-detail-fill)"/><polyline points={points} fill="none" stroke={up?"#70d8b1":"#fb7185"} strokeWidth=".65" vectorEffect="non-scaling-stroke"/></svg></div><footer className="nxt-chart-foot"><span>LOW <b>{usd(low)}</b></span><span>DEMO SERIES · NOT HISTORICAL MARKET DATA</span><span>HIGH <b>{usd(high)}</b></span></footer></section>
      <div className="nxt-detail-metrics">{metrics.map(([l,v,s])=><article key={l}><label>{l.toUpperCase()}</label><strong>{v}</strong><small>{s}</small></article>)}</div>
      <Section title="Asset profile" index="01" hint="TOKEN INFORMATION"><p className="nxt-profile-desc">{token.description||"No additional asset description is available."}</p><div className="nxt-profile-grid"><span>Network</span><b>{token.network}</b><span>Token standard</span><b>{token.standard||"—"}</b><span>Total supply</span><b>{token.totalSupply||"—"}</b><span>Decimals</span><b>{token.decimals??"—"}</b><span>Contract address</span><b className="nxt-contract">{token.contractAddress||"Not published"}</b><span>Verification</span><b>{(token.verificationStatus||"not_reviewed").replaceAll("_"," ")}</b></div><div className="nxt-detail-links"><Link to={`/tokens/${token.id}/contract`}>CONTRACT DETAILS ↗</Link><Link to={`/tokens/${token.id}/activity`}>TOKEN ACTIVITY ↗</Link></div></Section>
    </div><aside className="nxt-detail-aside"><Section title="Network peers" index="02" hint={`${peers.length} ASSETS`}><div className="nxt-peer-list">{peers.length?peers.map(p=><Link to={`/tokens/${p.id}`} key={p.id}><Mark token={p} size="sm"/><span><b>{p.symbol}</b><small>{p.name}</small></span><strong>{usd(p.market.price)}</strong><em className={num(p.market.priceChange24h)>=0?"is-up":"is-down"}>{pct(p.market.priceChange24h)}</em></Link>):<p className="nxt-empty">No other assets on this network.</p>}</div><Link className="nxt-all-tokens" to="/tokens">EXPLORE ALL TOKENS ↗</Link></Section><Section title="Asset metadata" index="03"><div className="nxt-profile-grid"><span>Market cap rank</span><b>#{rank}</b><span>Network</span><b>{token.network}</b><span>Created</span><b>{new Date(token.createdAt).toLocaleDateString()}</b><span>Data source</span><b>Catalogue</b></div><p className="nxt-disclaimer"><Info/> Market figures are illustrative catalogue values and are not live trading data.</p></Section></aside></div>
    <footer className="nxt-detail-bottom"><Link to="/tokens">← BACK TO TOKEN DIRECTORY</Link><span>CATALOGUE DATA · NOT A LIVE TRADING TERMINAL</span></footer>
  </main>;
}
