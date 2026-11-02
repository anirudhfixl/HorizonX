import { FairLaunchDetail } from "@/components/launchpad/fair-launch-detail";
import { FAIR_LAUNCHES, PRESALES, PROJECTS, TOKENS } from "@/data";
import { SessionFairLaunchDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";
import { useParams, useSearchParams } from "react-router-dom";

export default function FairLaunchDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") ?? undefined;

  const launch = FAIR_LAUNCHES.find((l) => l.id === id);
  if (!launch) {
    return <SessionFairLaunchDetailClientWrapper id={id} initialTab={initialTab} />;
  }

  const token = TOKENS.find((t) => t.id === launch.tokenId);
  const project = launch.projectId ? PROJECTS.find((p) => p.id === launch.projectId) : undefined;
  const siblingLaunches = FAIR_LAUNCHES.filter((f) => f.tokenId === launch.tokenId && f.id !== launch.id);
  const presales = PRESALES.filter((p) => p.tokenId === launch.tokenId);

  return (
    <FairLaunchDetail
      launch={launch}
      token={token}
      project={project}
      siblingLaunches={siblingLaunches}
      presales={presales}
      initialTab={initialTab}
      provenance="catalog"
    />
  );
}
