import React from "react";
import { PresaleDirectory } from "@/components/launchpad/presale-directory";
import { PageMeta } from "@/components/seo/page-meta";

export default function LaunchpadAllPresalesPage() {
  return (
    <>
      <PageMeta title="All Presales | ProMiners Launchpad" description="Browse verified initial token presales with transparent caps and non-custodial lockups on ProMiners." />
      <PresaleDirectory mode="canonical" />
    </>
  );
}
