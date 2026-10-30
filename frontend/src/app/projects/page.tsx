import React from "react";
import { ProjectDirectory } from "@/components/projects/project-directory";

export const metadata = {
  title: "Project Directory | ProMiners",
  description: "Browse and discover verified decentralized protocols, developer DAOs, and crypto ecosystem projects on ProMiners.",
};

export default function ProjectsPage() {
  return <ProjectDirectory mode="canonical" />;
}
