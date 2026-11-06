import { FairLaunchDetail } from "@/components/launchpad/fair-launch-detail";
import { useFairLaunch, useFairLaunches, usePresales, useToken, useProject } from "@/api";
import { SessionFairLaunchDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";
import { useParams, useSearchParams } from "react-router-dom";

export default function FairLaunchDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") ?? undefined;

  const { data: launch, isLoading } = useFairLaunch(id);
  const { data: allFairLaunches = [] } = useFairLaunches();
  const { data: allPresales = [] } = usePresales();
  const { data: token } = useToken(launch?.tokenId);
  const { data: project } = useProject(launch?.projectId);

  if (!launch) {
    if (isLoading) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xs text-muted-foreground animate-pulse">Loading launch simulation…</p>
        </div>
      );
    }
    return <SessionFairLaunchDetailClientWrapper id={id} initialTab={initialTab} />;
  }

  const siblingLaunches = allFairLaunches.filter((f) => f.tokenId === launch.tokenId && f.id !== launch.id);
  const presales = allPresales.filter((p) => p.tokenId === launch.tokenId);
  const provenance = launch.id.startsWith("session-") ? "session" : "catalog";

  return (
    <FairLaunchDetail
      launch={launch as any}
      token={token as any}
      project={project as any}
      siblingLaunches={siblingLaunches as any}
      presales={presales as any}
      initialTab={initialTab}
      provenance={provenance}
    />
  );
}
