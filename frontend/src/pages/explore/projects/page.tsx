import React from "react";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { PageMeta } from "@/components/seo/page-meta";

export default function ExploreProjectsPage() {
  return (
    <>
      <PageMeta title="Explore Projects | ProMiners" description="Explore verified decentralized protocols, developer DAOs, and crypto ecosystem projects across ProMiners." />
      <ProjectDirectory mode="explore" />
    </>
  );
}
