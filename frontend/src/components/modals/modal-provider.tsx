import React, { Suspense, lazy } from "react";
import { useModal } from "@/contexts/modal-context";

const ConnectWalletModal = lazy(() =>
  import("./connect-wallet-modal").then((m) => ({ default: m.ConnectWalletModal }))
);
const WalletDetailsModal = lazy(() =>
  import("./wallet-details-modal").then((m) => ({ default: m.WalletDetailsModal }))
);
const CommandPaletteModal = lazy(() =>
  import("./command-palette-modal").then((m) => ({ default: m.CommandPaletteModal }))
);
const RiskWarningModal = lazy(() =>
  import("./risk-warning-modal").then((m) => ({ default: m.RiskWarningModal }))
);

export function GlobalModalRenderer() {
  const { activeModal } = useModal();

  if (!activeModal) return null;

  return (
    <Suspense fallback={null}>
      {activeModal === "CONNECT_WALLET" && <ConnectWalletModal />}
      {activeModal === "WALLET_DETAILS" && <WalletDetailsModal />}
      {activeModal === "COMMAND_PALETTE" && <CommandPaletteModal />}
      {activeModal === "RISK_WARNING" && <RiskWarningModal />}
    </Suspense>
  );
}
