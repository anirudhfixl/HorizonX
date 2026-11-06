import { PresaleDetail } from "@/components/launchpad/presale-detail";
import { usePresale, usePresales, useFairLaunches, useToken, useProject } from "@/api";
import { SessionPresaleDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";
import { useParams, useSearchParams } from "react-router-dom";

export default function PresaleDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") ?? undefined;

  const { data: presale, isLoading } = usePresale(id);
  const { data: allPresales = [] } = usePresales();
  const { data: allFairLaunches = [] } = useFairLaunches();
  const { data: token } = useToken(presale?.tokenId);
  const { data: project } = useProject(presale?.projectId);

  if (!presale) {
    if (isLoading) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xs text-muted-foreground animate-pulse">Loading presale details…</p>
        </div>
      );
    }
    return <SessionPresaleDetailClientWrapper id={id} initialTab={initialTab} />;
  }

  const siblingPresales = allPresales.filter((p) => p.tokenId === presale.tokenId && p.id !== presale.id);
  const fairLaunches = allFairLaunches.filter((f) => f.tokenId === presale.tokenId);
  const provenance = presale.id.startsWith("session-") ? "session" : "catalog";

  return (
    <PresaleDetail
      presale={presale as any}
      token={token as any}
      project={project as any}
      siblingPresales={siblingPresales as any}
      fairLaunches={fairLaunches as any}
      initialTab={initialTab}
      provenance={provenance}
    />
  );
}
