import NotFoundPage from "@/pages/not-found/page";
import React, { useSyncExternalStore } from "react";
import { PresaleDetail } from "@/components/launchpad/presale-detail";
import { FairLaunchDetail } from "@/components/launchpad/fair-launch-detail";
import {
  findSessionPresaleById,
  findSessionFairLaunchById,
  sessionPresaleToPresale,
  sessionFairLaunchToFairLaunch,
  resolveLaunchContext,
} from "@/lib/launch-storage";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function SessionPresaleDetailClientWrapper({ id, initialTab }: { id: string; initialTab?: string }) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Loading launch simulation…</p>
      </div>
    );
  }

  const sessionRecord = findSessionPresaleById(id);
  if (!sessionRecord) {
    return <NotFoundPage />;
  }

  const presale = sessionPresaleToPresale(sessionRecord);
  const context = resolveLaunchContext(sessionRecord);

  return (
    <PresaleDetail
      presale={presale}
      token={context.token}
      project={context.project}
      siblingPresales={context.siblingPresales}
      fairLaunches={context.siblingFairLaunches}
      initialTab={initialTab}
      provenance="session"
    />
  );
}

export function SessionFairLaunchDetailClientWrapper({ id, initialTab }: { id: string; initialTab?: string }) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Loading launch simulation…</p>
      </div>
    );
  }

  const sessionRecord = findSessionFairLaunchById(id);
  if (!sessionRecord) {
    return <NotFoundPage />;
  }

  const launch = sessionFairLaunchToFairLaunch(sessionRecord);
  const context = resolveLaunchContext(sessionRecord);

  return (
    <FairLaunchDetail
      launch={launch}
      token={context.token}
      project={context.project}
      siblingLaunches={context.siblingFairLaunches}
      presales={context.siblingPresales}
      initialTab={initialTab}
      provenance="session"
    />
  );
}
