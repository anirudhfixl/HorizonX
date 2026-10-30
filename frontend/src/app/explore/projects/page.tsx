import React from "react";
import { ProjectDirectory } from "@/components/projects/project-directory";

export const metadata = {
  title: "Explore Projects | ProMiners",
  description: "Explore verified decentralized protocols, developer DAOs, and crypto ecosystem projects across ProMiners.",
};

export default function ExploreProjectsPage() {
  return <ProjectDirectory mode="explore" />;
}
