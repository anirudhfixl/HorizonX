import React from "react";
import { PresaleDirectory } from "@/components/launchpad/presale-directory";

export const metadata = {
  title: "All Presales | ProMiners Launchpad",
  description: "Browse verified initial token presales with transparent caps and non-custodial lockups on ProMiners.",
};

export default function LaunchpadAllPresalesPage() {
  return <PresaleDirectory mode="canonical" />;
}
