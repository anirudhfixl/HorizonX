import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { FileText, ShieldAlert, HelpCircle, Code, ArrowRight } from "lucide-react";

export default function DocsHomePage() {
  const sections = [
    {
      title: "Developer Guides",
      slug: "guides",
      description: "Step-by-step documentation on smart contract standards, EVM parameters, and API integration.",
      icon: <Code className="h-5 w-5 text-primary" />,
    },
    {
      title: "Frequently Asked Questions",
      slug: "faq",
      description: "Answers to common questions regarding presale vesting, airdrop claims, and gas estimates.",
      icon: <HelpCircle className="h-5 w-5 text-amber-400" />,
    },
    {
      title: "Risk Disclosure",
      slug: "risk",
      description: "Legal and financial disclaimers regarding cryptocurrency volatility and decentralized protocol interaction.",
      icon: <ShieldAlert className="h-5 w-5 text-rose-400" />,
    },
    {
      title: "Terms of Service",
      slug: "terms",
      description: "Platform usage terms, permissionless contract boundaries, and disclaimers.",
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
      description: "Privacy commitments, non-custodial telemetry, and client-side encryption guarantees.",
      icon: <FileText className="h-5 w-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageHeader
        title="Documentation & Protocol Knowledge"
        description="Comprehensive guides, architecture overviews, developer references, and legal disclosures for ProMiners."
        breadcrumbs={[{ label: "Docs" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((sec) => (
          <Link
            key={sec.slug}
            href={`/docs/${sec.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/90"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border/40">
                {sec.icon}
              </div>
              <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {sec.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sec.description}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Read Documentation</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
