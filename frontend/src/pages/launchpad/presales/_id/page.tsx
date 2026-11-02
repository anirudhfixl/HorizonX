import { PresaleDetail } from "@/components/launchpad/presale-detail";
import { FAIR_LAUNCHES, PRESALES, PROJECTS, TOKENS } from "@/data";
import { SessionPresaleDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";
import { useParams, useSearchParams } from "react-router-dom";

export default function PresaleDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") ?? undefined;

  const presale = PRESALES.find((p) => p.id === id);
  if (!presale) {
    return <SessionPresaleDetailClientWrapper id={id} initialTab={initialTab} />;
  }

  const token = TOKENS.find((t) => t.id === presale.tokenId);
  const project = presale.projectId ? PROJECTS.find((p) => p.id === presale.projectId) : undefined;
  const siblingPresales = PRESALES.filter((p) => p.tokenId === presale.tokenId && p.id !== presale.id);
  const fairLaunches = FAIR_LAUNCHES.filter((f) => f.tokenId === presale.tokenId);

  return (
    <PresaleDetail
      presale={presale}
      token={token}
      project={project}
      siblingPresales={siblingPresales}
      fairLaunches={fairLaunches}
      initialTab={initialTab}
      provenance="catalog"
    />
  );
}
