import React from "react";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { PageMeta } from "@/components/seo/page-meta";

export default function ProjectsPage() {
  return (
    <>
      <PageMeta title="Project Directory | ProMiners" description="Browse and discover verified decentralized protocols, developer DAOs, and crypto ecosystem projects on ProMiners." />
      <ProjectDirectory mode="canonical" />
    </>
  );
}
