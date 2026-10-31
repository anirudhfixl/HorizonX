import React from "react";
import { MyLaunchesHub } from "@/components/launchpad/my-launches-hub";

export const metadata = {
  title: "My Launches | ProMiners Launchpad",
  description: "Creator and investor workspace for managing user-created presales, fair launches, and tracked contributions on ProMiners.",
};

export default function MyLaunchesPage() {
  return <MyLaunchesHub />;
}
