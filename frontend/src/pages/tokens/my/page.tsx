import React from "react";
import { MyTokensHub } from "@/components/tokens/my-tokens-hub";

/**
 * Token Management Hub Page (/tokens/my)
 * Implements Phase 3-E:
 * - Normalized creatorAddress matching against connected wallet.
 * - Predefined demo creator assets separated from temporary session simulations.
 * - Accurate telemetry metrics (Managed Tokens, Aggregate Token Supply, Active Catalog Assets, Simulated Creator Assets).
 * - Interactive simulated creator management actions (mint, burn, pause, transfer) with D-05/D-06 disclaimers.
 * - Verified canonical navigation directly to /tokens/[id].
 * - Strict simulation boundaries under Architecture Decision D-04 (Ethereum Sepolia 11155111).
 */
export default function MyTokensPage() {
  return <MyTokensHub />;
}
