import React from "react";
import { PresaleDirectory } from "@/components/launchpad/presale-directory";
import { PageMeta } from "@/components/seo/page-meta";

export default function ExplorePresalesPage() {
  return (
    <>
      <PageMeta title="Presales Discovery | HorizonX" description="Explore live, scheduled, and past presales across the HorizonX ecosystem with non-custodial escrow." />
      <PresaleDirectory mode="explore" />
    </>
  );
}
