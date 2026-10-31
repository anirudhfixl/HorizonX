import { FairLaunchDetail } from "@/components/launchpad/fair-launch-detail";
import { MOCK_FAIR_LAUNCHES, MOCK_PRESALES, MOCK_PROJECTS, MOCK_TOKENS } from "@/lib/mock-data";
import { SessionFairLaunchDetailClientWrapper } from "@/components/launchpad/session-detail-resolver";

export function generateStaticParams() {
  return MOCK_FAIR_LAUNCHES.map((l) => ({ id: l.id }));
}

export default async function FairLaunchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialTab = resolvedSearchParams?.tab;

  const launch = MOCK_FAIR_LAUNCHES.find((l) => l.id === id);
  if (!launch) {
    return <SessionFairLaunchDetailClientWrapper id={id} initialTab={initialTab} />;
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
      initialTab={initialTab}
      provenance="catalog"
    />
  );
}
