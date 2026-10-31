import { notFound } from "next/navigation";
import { FairLaunchDetail } from "@/components/launchpad/fair-launch-detail";
import { MOCK_FAIR_LAUNCHES, MOCK_PRESALES, MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_FAIR_LAUNCHES.map((l) => ({ id: l.id }));
}

export default async function FairLaunchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const launch = MOCK_FAIR_LAUNCHES.find((l) => l.id === id);
  if (!launch) {
    notFound();
  }

  const token = MOCK_TOKENS.find((t) => t.id === launch.tokenId);
  const project = launch.projectId ? MOCK_PROJECTS.find((p) => p.id === launch.projectId) : undefined;
  const siblingLaunches = MOCK_FAIR_LAUNCHES.filter((f) => f.tokenId === launch.tokenId && f.id !== launch.id);
  const presales = MOCK_PRESALES.filter((p) => p.tokenId === launch.tokenId);

  return (
    <FairLaunchDetail
      launch={launch}
      token={token}
      project={project}
      siblingLaunches={siblingLaunches}
      presales={presales}
    />
  );
}
