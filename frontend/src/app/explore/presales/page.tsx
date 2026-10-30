import React from "react";
import { PresaleDirectory } from "@/components/launchpad/presale-directory";

export const metadata = {
  title: "Presales Discovery | ProMiners",
  description: "Explore live, scheduled, and past presales across the ProMiners ecosystem with non-custodial escrow.",
};

export default function ExplorePresalesPage() {
  return <PresaleDirectory mode="explore" />;
}
