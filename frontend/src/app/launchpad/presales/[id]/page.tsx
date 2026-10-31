import { PresaleDetail } from "@/components/launchpad/presale-detail";
import { MOCK_FAIR_LAUNCHES, MOCK_PRESALES, MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { SessionPresaleDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";

export function generateStaticParams() {
  return MOCK_PRESALES.map((ps) => ({ id: ps.id }));
}

export default async function PresaleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialTab = resolvedSearchParams?.tab;

  const presale = MOCK_PRESALES.find((p) => p.id === id);
  if (!presale) {
    return <SessionPresaleDetailClientWrapper id={id} initialTab={initialTab} />;
  }

  const token = MOCK_TOKENS.find((t) => t.id === presale.tokenId);
  const project = presale.projectId ? MOCK_PROJECTS.find((p) => p.id === presale.projectId) : undefined;
  const siblingPresales = MOCK_PRESALES.filter((p) => p.tokenId === presale.tokenId && p.id !== presale.id);
  const fairLaunches = MOCK_FAIR_LAUNCHES.filter((f) => f.tokenId === presale.tokenId);

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
