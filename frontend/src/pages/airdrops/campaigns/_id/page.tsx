import "@/components/airdrops/airdrops.css";
import "@/components/shared/entity-detail.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "@/pages/not-found/page";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { Button } from "@/components/ui/button";
import { useAirdrop, useToken, useProject } from "@/api";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { getAirdropProvenance, calculateClaimProgress } from "@/lib/airdrop-storage";
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, CircleAlert, Clock3, Copy,
  ExternalLink, FileCheck2, Gift, Globe2, Info, LockKeyhole, Network,
  ShieldAlert, ShieldCheck, Users, Wallet, Zap,
} from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

function shortenAddress(value?: string) {
  if (!value) return "Not configured";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function requirementGroup(requirement: string) {
  const value = requirement.toLowerCase();
  if (/wallet|address|connect|sign.?in/.test(value)) return "Wallet & identity";
  if (/hold|balance|token|stake|snapshot|snapshot date/.test(value)) return "Holdings & snapshots";
  if (/social|follow|retweet|repost|discord|telegram|community|subscribe/.test(value)) return "Community & social";
  if (/quest|task|complete|submit|participat|transaction|swap|bridge|trade|volume/.test(value)) return "Tasks & activity";
  if (/network|chain|mainnet|testnet|gas|contract/.test(value)) return "Network & technical";
  return "Other published rules";
}

function getScheduleState(status: string, startTime?: string, endTime?: string) {
  const now = Date.now();
  const normalizedStatus = (status || "").toLowerCase();
  const start = startTime ? new Date(startTime).getTime() : NaN;
  const end = endTime ? new Date(endTime).getTime() : NaN;
  const hasStart = Number.isFinite(start);
  const hasEnd = Number.isFinite(end);
  if (hasStart && hasEnd && end < start) {
    return { label: "Invalid recorded date range", detail: "The recorded end date is earlier than the start date. Confirm the campaign schedule with the official source.", phase: "unknown" };
  }
  if (hasStart && now < start) {
    const mismatch = normalizedStatus === "active" || normalizedStatus === "live";
    return { label: "Scheduled start", detail: `The recorded start date is still in the future.${mismatch ? " The stored campaign status is already active; verify this discrepancy with the official source." : ""}`, phase: "upcoming" };
  }
  if (hasEnd && now > end) {
    const mismatch = normalizedStatus === "active" || normalizedStatus === "live";
    return { label: "Scheduled end passed", detail: `The recorded end date has passed; confirm whether claims remain open on the official source.${mismatch ? " The stored campaign status is still active; verify this discrepancy." : ""}`, phase: "ended" };
  }
  if (hasStart && hasEnd && now >= start && now <= end) {
    const mismatch = ["ended", "finalized", "cancelled"].includes(normalizedStatus);
    return { label: "Within recorded participation window", detail: `Current time falls between the published start and end dates.${mismatch ? " The stored campaign status indicates the campaign is no longer active; verify the official source." : ""}`, phase: "window" };
  }
  if (hasStart && now >= start) return { label: "Start date passed", detail: "No end date is available in this campaign record.", phase: "unknown" };
  if (hasEnd && now <= end) return { label: "End date not reached", detail: "A start date is not available in this campaign record.", phase: "unknown" };
  return { label: "Schedule not available", detail: "Campaign timing cannot be inferred because start and end dates are missing or invalid.", phase: "unknown" };
}

function verificationLabel(status?: string) {
  switch (status) {
    case "contract_source_verified": return { label: "Contract source verified", tone: "good" };
    case "audit_available": return { label: "Audit available", tone: "good" };
    case "project_reviewed": return { label: "Project reviewed", tone: "good" };
    case "wallet_ownership_confirmed": return { label: "Owner wallet confirmed", tone: "info" };
    case "wallet_connected": return { label: "Wallet connected only", tone: "warn" };
    case "risk_flag": return { label: "Risk flag recorded", tone: "bad" };
    default: return { label: "Not independently verified", tone: "warn" };
  }
}

function CopyValue({ value, label }: { value?: string; label: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span>Not supplied</span>;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2 align-middle">
      <span className="min-w-0 break-all">{value}</span>
      <button type="button" onClick={copy} aria-label={`Copy ${label}`} title={copied ? "Copied" : `Copy ${label}`} className="inline-grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? `${label} copied` : ""}</span>
    </span>
  );
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: React.ElementType }) {
  return (
    <article className="rounded-xl border border-border/70 bg-card/55 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[.13em] text-muted-foreground">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/70 text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 break-words text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>{detail && <p className="text-sm text-muted-foreground">{detail}</p>}</div>;
}

export default function AirdropDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: airdrop, isLoading: airdropLoading } = useAirdrop(id);
  const { data: token } = useToken(airdrop?.tokenId);
  const { data: project } = useProject(airdrop?.projectId);
  const { isConnected, address, shortAddress: walletShortAddress, isDemoMode } = useWallet();
  const { openModal } = useModal();

  const hasClaimCounts = Number.isFinite(airdrop?.claimedCount) && (airdrop?.claimedCount ?? -1) >= 0;
  const hasRecipientCount = Number.isFinite(airdrop?.recipientCount) && (airdrop?.recipientCount ?? -1) >= 0;
  const hasClaimMetrics = hasClaimCounts && hasRecipientCount && (airdrop?.recipientCount ?? 0) > 0 && (airdrop?.claimedCount ?? 0) <= (airdrop?.recipientCount ?? 0);
  const progress = hasClaimMetrics ? calculateClaimProgress(airdrop?.claimedCount, airdrop?.recipientCount) : null;
  const rewardPoolLabel = airdrop?.totalReward !== undefined && airdrop?.totalReward !== null && airdrop?.totalReward !== "" ? String(airdrop.totalReward) : "Not specified";
  const verification = useMemo(() => verificationLabel(airdrop?.verificationStatus), [airdrop?.verificationStatus]);
  const requirements = airdrop?.requirements?.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) ?? [];
  const groupedRequirements = useMemo(() => {
    const groups = new Map<string, string[]>();
    requirements.forEach((requirement) => {
      const group = requirementGroup(requirement);
      groups.set(group, [...(groups.get(group) ?? []), requirement]);
    });
    return Array.from(groups.entries());
  }, [requirements.join("\u0000")]);

  if (!airdrop) {
    if (airdropLoading) return <main className="airdrop-page entity-detail-page w-full max-w-none px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"><div className="py-20 text-center text-sm text-muted-foreground">Loading airdrop campaign…</div></main>;
    return <NotFoundPage />;
  }

  const provenance = getAirdropProvenance(airdrop as any);
  const officialUrl = airdrop.officialUrl || airdrop.externalUrl;
  const provenanceLabel = airdrop.isExternal
    ? `External provider${airdrop.source ? ` · ${airdrop.source}` : ""}`
    : provenance === "session"
      ? "Browser session record"
      : "HorizonX campaign catalog";
  const hasProjectLinks = Boolean(project?.website || project?.websiteUrl || project?.documentation || Object.keys(project?.socialLinks ?? {}).length);
  const ownerAddress = airdrop.ownerAddress?.toLowerCase() || "";
  const walletAddress = address?.toLowerCase() || "";
  const shortOwnerAscii = address ? `0x${address.replace(/^0x/i, "").slice(0, 4)}...${address.slice(-4)}`.toLowerCase() : "";
  const shortOwnerUnicode = address ? `0x${address.replace(/^0x/i, "").slice(0, 4)}…${address.slice(-4)}`.toLowerCase() : "";
  const canManage = Boolean(walletAddress && (ownerAddress === walletAddress || ownerAddress === shortOwnerAscii || ownerAddress === shortOwnerUnicode));

  return (
    <main className="airdrop-page entity-detail-page w-full max-w-none space-y-6 overflow-x-clip px-4 pb-16 pt-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Campaigns", to: "/airdrops/campaigns" }, { label: airdrop.title }]} />

      <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/55">
        {airdrop.bannerImage || airdrop.banner ? <div className="absolute inset-0 opacity-[.12]"><img src={airdrop.bannerImage || airdrop.banner} alt="" className="h-full w-full object-cover" /></div> : null}
        <div className="relative grid gap-6 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="flex min-w-0 items-start gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="entity-detail-type">Airdrop campaign</span>
                <StatusBadge status={airdrop.status} />
                <ProvenanceBadge kind={airdrop.isExternal ? "simulated" : provenance} label={airdrop.source || (airdrop.isExternal ? "External provider" : undefined)} />
                <span className="entity-detail-meta-pill">{airdrop.network}</span>
                <span className="entity-detail-meta-pill">{airdrop.category || airdrop.type}</span>
              </div>
              <h1 className="text-balance">{airdrop.title}</h1>
              <p className="entity-detail-description">{airdrop.description || "Campaign details have not been published yet."}</p>
              <div className="entity-detail-relations mt-3">
                {token && <span>Token <Link to={`/tokens/${token.id}`}>{token.name} ({token.symbol})</Link></span>}
                {project && <span>Project <Link to={`/projects/${project.id}`}>{project.name}</Link></span>}
                <span>Created {formatDate(airdrop.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {officialUrl && <Button asChild size="sm"><a href={officialUrl} target="_blank" rel="noopener noreferrer">Official campaign <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>}
            {project && <Button asChild size="sm" variant="outline"><Link to={`/projects/${project.id}`}>View project <ArrowUpRight className="ml-2 h-3.5 w-3.5" /></Link></Button>}
            {token && <Button asChild size="sm" variant="outline"><Link to={`/tokens/${token.id}`}>View token <ArrowUpRight className="ml-2 h-3.5 w-3.5" /></Link></Button>}
            {canManage && <Button asChild size="sm" variant="outline"><Link to={`/airdrops/my/${airdrop.id}`}>Owner workspace <ArrowUpRight className="ml-2 h-3.5 w-3.5" /></Link></Button>}
          </div>
        </div>
      </header>

      {airdrop.isExternal && <div className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /><p><strong className="text-foreground">External registry data.</strong> This record is synchronized from {airdrop.source || "an external provider"}. Confirm all participation requirements and links through the official project before connecting a wallet.</p></div>}

      <nav aria-label="Campaign sections" className="entity-detail-anchor-nav flex gap-6 overflow-x-auto border-b border-border/70" tabIndex={0}>
        <a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#campaign-overview">Overview</a><a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#eligibility">Eligibility</a><a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#rewards">Rewards</a><a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#timeline">Timeline</a><a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#distribution-history">History</a><a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href="#transparency">Transparency</a>
      </nav>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Campaign metrics">
        <Metric label="Total reward pool" value={rewardPoolLabel} detail="Published campaign allocation" icon={Gift} />
        <Metric label="Eligible recipients" value={hasRecipientCount ? (airdrop.recipientCount as number).toLocaleString() : "Not published"} detail="Recorded recipient count" icon={Users} />
        <Metric label="Claims recorded" value={hasClaimCounts ? (airdrop.claimedCount as number).toLocaleString() : "Not reported"} detail={progress === null ? "Claim metrics unavailable" : `${progress}% of recorded recipients`} icon={CheckCircle2} />
        <Metric label="Distribution model" value={airdrop.type.toUpperCase()} detail={`${airdrop.network} · ${airdrop.category || "Uncategorized"}`} icon={Network} />
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-4">
        <div className="min-w-0 space-y-5 xl:col-span-3">
          <section id="campaign-overview" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
            <SectionTitle eyebrow="Campaign details" title="Distribution overview" detail="The information currently published for this campaign." />
            <dl className="entity-detail-facts mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div><dt><Network className="h-3.5 w-3.5" /> Network</dt><dd>{airdrop.network}</dd></div>
              <div><dt>Campaign category</dt><dd>{airdrop.category || "Not specified"}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Participation starts</dt><dd>{formatDate(airdrop.startTime)}</dd></div>
              <div><dt><CalendarDays className="h-3.5 w-3.5" /> Participation ends</dt><dd>{formatDate(airdrop.endTime)}</dd></div>
              <div><dt>Campaign type</dt><dd className="capitalize">{airdrop.type}</dd></div>
              <div><dt>Last updated</dt><dd>{formatDate(airdrop.lastUpdated || airdrop.updatedAt)}</dd></div>
            </dl>
          </section>

          <section id="eligibility" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
            <SectionTitle eyebrow="Who can participate" title="Eligibility & requirements" detail="Only requirements explicitly supplied by the campaign are shown here." />
            {airdrop.eligibility && <div className="mt-4 rounded-lg border border-border/60 bg-secondary/20 p-3"><p className="mb-1 text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">Eligibility summary</p><p className="text-sm leading-relaxed text-foreground">{airdrop.eligibility}</p></div>}
            {groupedRequirements.length ? <div className="mt-4 space-y-4">{groupedRequirements.map(([group, items]) => <div key={group}><div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-xs font-semibold uppercase tracking-[.1em] text-foreground">{group}</h3><span className="text-[10px] text-muted-foreground">{items.length} {items.length === 1 ? "rule" : "rules"}</span></div><ul className="grid gap-2 sm:grid-cols-2">{items.map((requirement, index) => <li key={`${group}-${requirement}-${index}`} className="flex items-start gap-2 rounded-lg border border-border/50 bg-secondary/10 p-3 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{requirement}</li>)}</ul></div>)}</div> : <div className="mt-4 flex items-start gap-3 rounded-lg border border-dashed border-border/70 bg-secondary/10 p-4"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /><div><p className="text-sm font-medium text-foreground">Detailed requirements not published</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">This catalog record does not contain a full eligibility checklist, snapshot criteria or qualification rules. Check the official campaign source before taking action.</p></div></div>}
            <div className="mt-4 flex flex-wrap gap-2"><Button asChild size="sm" variant="outline"><Link to="/airdrops/claim">Open claim checker <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link></Button>{officialUrl && <Button asChild size="sm" variant="ghost"><a href={officialUrl} target="_blank" rel="noopener noreferrer">Review official rules <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>}</div>
          </section>

          <section id="rewards" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
            <SectionTitle eyebrow="Allocation details" title="Rewards & distribution" detail="Published allocation and claim progress. Unavailable allocation rules are not inferred." />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[.045] p-4"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Total reward pool</p><p className="mt-2 break-words text-2xl font-bold tracking-tight text-emerald-400">{rewardPoolLabel}</p><p className="mt-1 text-xs text-muted-foreground">Total campaign allocation</p></div>
              <div className="rounded-xl border border-border/60 bg-secondary/15 p-4"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Per-participant reward</p><p className="mt-2 text-xl font-semibold text-foreground">Not published</p><p className="mt-1 text-xs text-muted-foreground">No fixed or tiered individual allocation is supplied.</p></div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-sm font-semibold text-foreground">Claim distribution progress</p><p className="text-xs text-muted-foreground">Recorded claims compared with recorded recipients</p></div><span className="font-mono text-lg font-bold text-foreground">{progress === null ? "Not reported" : `${progress}%`}</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress ?? 0}%` }} /></div>
              <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{hasClaimCounts ? `${(airdrop.claimedCount as number).toLocaleString()} claimed` : "Claims not reported"}</span><span>{hasRecipientCount ? `${(airdrop.recipientCount as number).toLocaleString()} recorded recipients` : "Recipient count not reported"}</span></div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 p-3"><p className="text-xs text-muted-foreground">Distribution type</p><p className="mt-1 font-semibold capitalize text-foreground">{airdrop.type}</p></div>
              <div className="rounded-lg border border-border/50 p-3"><p className="text-xs text-muted-foreground">Claim contract</p><p className="mt-1 break-all font-mono text-xs text-foreground">{airdrop.contractAddress || "Not configured"}</p></div>
            </div>
          </section>

      <section className="rounded-2xl border border-border/70 bg-card/35 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Technical record</p><h2 className="mt-1 text-lg font-semibold text-foreground">Campaign configuration</h2><p className="mt-1 text-xs text-muted-foreground">Reference information for transparency and support.</p></div><span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">{airdrop.id}</span></div>
        <dl className="entity-detail-facts mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2"><div><dt>Campaign ID</dt><dd className="font-mono"><CopyValue value={airdrop.id} label="campaign ID" /></dd></div><div><dt>Creator address</dt><dd className="font-mono"><CopyValue value={airdrop.ownerAddress} label="creator address" /></dd></div><div><dt>Token contract</dt><dd className="font-mono"><CopyValue value={token?.contractAddress} label="token contract" /></dd></div><div><dt>Last updated</dt><dd>{formatDate(airdrop.lastUpdated || airdrop.updatedAt)}</dd></div></dl>
      </section>
        </div>

        <aside className="min-w-0 space-y-5 xl:col-span-1">
          <section className="rounded-2xl border border-primary/25 bg-card/70 p-5">
            <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Your participation</p><Wallet className="h-4 w-4 text-primary" /></div>
            <h2 className="mt-3 text-lg font-semibold text-foreground">{isConnected ? "Wallet connected" : "Check your eligibility"}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{isConnected ? `Connected wallet: ${walletShortAddress || shortenAddress(address)}` : "Connect a wallet to continue to the claim checker. A connection alone does not prove eligibility."}</p>
            {isDemoMode && <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-amber-300">Demo wallet session. This is not a verified wallet identity.</p>}
            <div className="mt-4 rounded-lg border border-border/60 bg-secondary/15 p-3"><div className="flex items-center gap-2 text-sm font-medium text-foreground"><LockKeyhole className="h-4 w-4 text-muted-foreground" /> Eligibility lookup unavailable</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">No campaign-specific allocation lookup or on-chain claim verification is connected. HorizonX will not invent an eligibility result or claimable amount.</p></div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{!isConnected ? <Button onClick={() => openModal("CONNECT_WALLET")} className="w-full">Connect wallet <Wallet className="ml-2 h-4 w-4" /></Button> : <Button asChild className="w-full"><Link to="/airdrops/claim">Open claim checker <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}<Button asChild variant="outline" className="w-full"><Link to="/airdrops/campaigns">Browse campaigns</Link></Button></div>
          </section>

          <section id="transparency" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h2 className="font-semibold text-foreground">Verification & trust</h2></div>
            <div className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold ${verification.tone === "good" ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-300" : verification.tone === "bad" ? "border-red-500/25 bg-red-500/5 text-red-300" : "border-amber-500/25 bg-amber-500/5 text-amber-200"}`}>
              {verification.tone === "bad" ? <ShieldAlert className="h-4 w-4" /> : verification.tone === "good" ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}{verification.label}
            </div>
            <dl className="mt-4 space-y-3 text-xs">
              <div><dt className="text-muted-foreground">Record origin</dt><dd className="mt-1 text-foreground">{provenanceLabel}</dd><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">This identifies where HorizonX obtained or stored this record; it is not an endorsement of the campaign.</p></div>
              <div><dt className="text-muted-foreground">Official campaign reference</dt><dd className="mt-1 text-foreground">{officialUrl ? <a className="inline-flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href={officialUrl} target="_blank" rel="noopener noreferrer">Reference link available <ExternalLink className="h-3 w-3" /></a> : "No official campaign link supplied"}</dd></div>
              <div><dt className="text-muted-foreground">Creator address</dt><dd className="mt-1 font-mono text-foreground"><CopyValue value={airdrop.ownerAddress} label="creator address" /></dd></div>
              <div><dt className="text-muted-foreground">Distribution contract</dt><dd className="mt-1 font-mono text-foreground"><CopyValue value={airdrop.contractAddress} label="distribution contract" /></dd><p className="mt-1 text-[11px] text-muted-foreground">Address presence alone does not confirm deployment or ownership.</p></div>
              <div><dt className="text-muted-foreground">Merkle root</dt><dd className="mt-1 font-mono text-foreground"><CopyValue value={airdrop.merkleRoot} label="Merkle root" /></dd><p className="mt-1 text-[11px] text-muted-foreground">No proof validation is performed on this page.</p></div>
              <div><dt className="text-muted-foreground">Record last updated</dt><dd className="mt-1 text-foreground">{formatDate(airdrop.lastUpdated || airdrop.updatedAt)}</dd></div>
            </dl>
            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-xs font-semibold text-foreground">What this page has not verified</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                <li>• Contract deployment, bytecode or ownership on the network</li>
                <li>• Audit validity, token allocation or Merkle proofs</li>
                <li>• Whether the official link is controlled by the project team</li>
                <li>• Whether recipient-level eligibility and claim outcomes match the published allocation</li>
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Treat the status above as the verification state recorded in the campaign data, not as an independent security assessment by HorizonX.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/45 p-5">
            <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /><h2 className="font-semibold text-foreground">Project & token</h2></div>
            <div className="mt-4 space-y-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Project</p>{project ? <Link className="mt-1 inline-flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" to={`/projects/${project.id}`}>{project.name}<ArrowUpRight className="h-3 w-3" /></Link> : <p className="mt-1 text-foreground">Not linked</p>}</div>
              <div><p className="text-xs text-muted-foreground">Reward token</p>{token ? <Link className="mt-1 inline-flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" to={`/tokens/${token.id}`}>{token.name} ({token.symbol})<ArrowUpRight className="h-3 w-3" /></Link> : <p className="mt-1 text-foreground">Not linked</p>}</div>
              {token?.contractAddress && <div><p className="text-xs text-muted-foreground">Token contract</p><p className="mt-1 break-all font-mono text-xs text-foreground">{token.contractAddress}</p></div>}
              {hasProjectLinks && <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">{(project?.website || project?.websiteUrl) && <a className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href={project.website || project.websiteUrl} target="_blank" rel="noreferrer">Website <ExternalLink className="inline h-3 w-3" /></a>}{project?.documentation && <a className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href={project.documentation} target="_blank" rel="noreferrer">Documentation <ExternalLink className="inline h-3 w-3" /></a>}{Object.entries(project?.socialLinks ?? {}).slice(0, 4).map(([name, url]) => <a key={name} className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" href={url} target="_blank" rel="noreferrer">{name} <ExternalLink className="inline h-3 w-3" /></a>)}</div>}
            </div>
          </section>
        </aside>
      </div>

      <section id="distribution-history" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
            <SectionTitle eyebrow="On-chain records" title="Distribution history" detail="Transaction-level events are shown only when a verified contract event source is connected." />
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-border/70 bg-secondary/10 p-4"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><div><p className="text-sm font-medium text-foreground">Transaction history is not connected</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">This campaign record does not currently provide distribution transaction hashes, batch timestamps or per-wallet claim events. The claim counter above is catalog metadata, not an independently indexed on-chain history.</p></div></div>
      </section>


      <section id="timeline" className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/45 p-5 sm:p-6">
            <SectionTitle eyebrow="Campaign schedule" title="Timeline" detail="Dates shown here come directly from the campaign record." />
            {(() => { const schedule = getScheduleState(airdrop.status, airdrop.startTime, airdrop.endTime); return <div className="mt-4 rounded-xl border border-border/60 bg-secondary/10 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">Date-based schedule reading</p><p className="mt-1 text-sm font-semibold text-foreground">{schedule.label}</p></div><span className="rounded-md border border-border px-2 py-1 text-[10px] font-medium capitalize text-muted-foreground">Recorded status: {airdrop.status}</span></div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{schedule.detail} This is a date comparison, not a live on-chain campaign status.</p></div>; })()}
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              <li className="relative rounded-xl border border-border/60 bg-secondary/10 p-4"><span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><FileCheck2 className="h-4 w-4" /></span><p className="text-xs text-muted-foreground">Campaign record created</p><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(airdrop.createdAt)}</p></li>
              <li className="relative rounded-xl border border-border/60 bg-secondary/10 p-4"><span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Zap className="h-4 w-4" /></span><p className="text-xs text-muted-foreground">Participation starts</p><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(airdrop.startTime)}</p></li>
              <li className="relative rounded-xl border border-border/60 bg-secondary/10 p-4"><span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Clock3 className="h-4 w-4" /></span><p className="text-xs text-muted-foreground">Participation ends</p><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(airdrop.endTime)}</p></li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">Snapshot, claim-opening and final distribution dates are not available in this campaign record.</p>
      </section>


    </main>
  );
}
