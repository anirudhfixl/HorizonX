import React from "react";
import { ConnectWalletModal } from "./connect-wallet-modal";
import { WalletDetailsModal } from "./wallet-details-modal";
import { CommandPaletteModal } from "./command-palette-modal";
import { RiskWarningModal } from "./risk-warning-modal";

export function GlobalModalRenderer() {
  return (
    <>
      <ConnectWalletModal />
      <WalletDetailsModal />
      <CommandPaletteModal />
      <RiskWarningModal />
    </>
  );
}
