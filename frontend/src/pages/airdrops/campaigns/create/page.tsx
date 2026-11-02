import React from "react";
import { AirdropCreationWizard } from "@/components/airdrops/airdrop-creation-wizard";

/**
 * Create Airdrop Campaign Page (/airdrops/campaigns/create)
 *
 * Multi-step wizard supporting all 8 baseline campaign models,
 * TokenPicker integration, cryptographic Merkle tree generation, and session persistence.
 */
export default function CreateAirdropCampaignPage() {
  return <AirdropCreationWizard />;
}

