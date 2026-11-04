import React from "react";
import { MyLaunchesHub } from "@/components/launchpad/my-launches-hub";
import { PageMeta } from "@/components/seo/page-meta";

export default function MyLaunchesPage() {
  return (
    <>
      <PageMeta title="My Launches | HorizonX Launchpad" description="Creator and investor workspace for managing user-created presales, fair launches, and tracked contributions on HorizonX." />
      <MyLaunchesHub />
    </>
  );
}
