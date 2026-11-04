import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { AccountSectionNav } from "@/components/account/account-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface DocContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
}

const DOCS_DATA: Record<string, DocContent> = {
  guides: {
    title: "Developer & Creator Guides",
    subtitle: "Architecture specifications, token deployment requirements, and testnet tutorials.",
    lastUpdated: "2026-10-30",
    sections: [
      {
        heading: "1. Token Contract Standards",
        body: "All tokens generated through the HorizonX Factory utilize OpenZeppelin v5 contract libraries compiled with Solidity 0.8.24. Standard ERC-20 implementations support optional burn, mint, and pausable extensions.",
      },
      {
        heading: "2. Presale Escrow Security",
        body: "Presale contracts operate via non-custodial smart contracts. Raised capital remains locked in escrow until the target softcap is reached. If a presale fails to reach its softcap before the deadline, all contributors can claim 100% refunds without admin intervention.",
      },
      {
        heading: "3. Merkle Tree Airdrop Generation",
        body: "To distribute tokens to thousands of wallets efficiently, use the Merkle Airdrop wizard. The platform computes cryptographic proof roots client-side, storing the root on-chain while users submit cheap claim proofs.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about presale participation, wallet safety, and fees.",
    lastUpdated: "2026-10-30",
    sections: [
      {
        heading: "What networks does HorizonX support?",
        body: "HorizonX supports major EVM networks including Ethereum Mainnet, BNB Chain, Polygon, Arbitrum One, Base, and Sepolia Testnet for zero-cost developer sandboxing.",
      },
      {
        heading: "How are initial DEX liquidity pools locked?",
        body: "Upon finalization of a presale or fair launch, liquidity is automatically paired and deposited into the respective DEX router (Uniswap or PancakeSwap). The LP tokens are transferred to a time-locked vault for a minimum period of 365 days.",
      },
      {
        heading: "Are there platform fees?",
        body: "Token creation charges a minimal network deployment fee. Presales incur a 1.5% protocol success fee upon successful campaign finalization, a portion of which is shared with community referral partners.",
      },
    ],
  },
  risk: {
    title: "Risk Disclosure Notice",
    subtitle: "Mandatory regulatory and technological risk warnings for participants.",
    lastUpdated: "2026-10-30",
    sections: [
      {
        heading: "Market & Financial Volatility",
        body: "Digital assets are subject to extreme market price volatility. Past performance does not guarantee future results. Participants should never allocate funds they cannot afford to lose completely.",
      },
      {
        heading: "Permissionless Smart Contracts",
        body: "HorizonX provides decentralized software tooling. Tokens, fair launches, and staking vaults are deployed permissionlessly by third-party creators. HorizonX does not endorse, guarantee, or custody project tokens.",
      },
      {
        heading: "Smart Contract Risk",
        body: "Although smart contracts are built upon audited OpenZeppelin standards, all decentralized protocols carry inherent cryptographic and execution risks.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "General platform usage terms and conditions.",
    lastUpdated: "2026-10-30",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By connecting your Web3 wallet and interacting with HorizonX smart contracts or graphical user interfaces, you agree to comply with all applicable laws and these Terms of Service.",
      },
      {
        heading: "2. Prohibited Jurisdictions",
        body: "Users from jurisdictions subject to international sanctions or regional restrictions on digital asset offerings are strictly prohibited from participating in token presales on this platform.",
      },
      {
        heading: "3. Non-Custodial Architecture",
        body: "HorizonX at no point takes custody, possession, or control of your private keys, seed phrases, or cryptocurrency assets.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "Our commitment to decentralized user privacy and minimal data telemetry.",
    lastUpdated: "2026-10-30",
    sections: [
      {
        heading: "No Personally Identifiable Information",
        body: "HorizonX does not require email addresses, physical addresses, or passwords to access the core protocol. Your public blockchain address serves as your pseudonymous identifier.",
      },
      {
        heading: "Local Storage & Client Cache",
        body: "Theme preferences, recent transactions, and custom watchlists are stored solely in your browser's local storage and are never uploaded to central tracking databases.",
      },
      {
        heading: "Blockchain Public Record",
        body: "Please note that all blockchain transactions (token creation, presale contributions, and claims) are permanently broadcast on transparent public distributed ledgers.",
      },
    ],
  },
};

export default function DocSlugPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const doc = DOCS_DATA[slug];
  if (!doc) {
    return <NotFoundPage />;
  }

  return (
    <div className="mx-0 w-full max-w-none px-[clamp(1rem,2.25vw,2.5rem)] pt-0 pb-8 space-y-8">
      <AccountSectionNav />
      <PageHeader
        title={doc.title}
        description={doc.subtitle}
        breadcrumbs={[
          { label: "Docs", href: "/docs" },
          { label: doc.title },
        ]}
      />

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-10 backdrop-blur-md space-y-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/40 text-xs text-muted-foreground">
          <span>Last Updated: {doc.lastUpdated}</span>
          <span className="flex items-center gap-1 font-mono text-primary">
            <FileText className="h-3.5 w-3.5" /> Canonical Reference
          </span>
        </div>

        <div className="space-y-8">
          {doc.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-base font-bold text-foreground">{sec.heading}</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs">
          <Link to="/docs" className="text-primary hover:underline flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Documentation Hub
          </Link>
          <span className="text-muted-foreground">HorizonX Knowledge Base</span>
        </div>
      </div>
    </div>
  );
}
