import React from "react";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { PageMeta } from "@/components/seo/page-meta";

export default function ExploreProjectsPage() {
  return (
    <>
      <PageMeta title="Explore Projects | HorizonX" description="Explore verified decentralized protocols, developer DAOs, and crypto ecosystem projects across HorizonX." />
      <ProjectDirectory mode="explore" />
    </>
  );
}
