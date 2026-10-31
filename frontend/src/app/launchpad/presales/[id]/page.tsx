import { notFound } from "next/navigation";
import { PresaleDetail } from "@/components/launchpad/presale-detail";
import { MOCK_FAIR_LAUNCHES, MOCK_PRESALES, MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_PRESALES.map((ps) => ({ id: ps.id }));
}

export default async function PresaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presale = MOCK_PRESALES.find((p) => p.id === id);
  if (!presale) {
    notFound();
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
    />
  );
}
