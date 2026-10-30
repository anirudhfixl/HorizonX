"use client";

import React, { useRef } from "react";
import { TokenShaderHero } from "@/components/tokens/token-shader-hero";
import { TokenCreationWizard } from "@/components/tokens/token-creation-wizard";

/**
 * Token Creation Wizard & Deployment Simulation Route (/tokens/create)
 *
 * Implements Phase 3-D:
 * - Responsive WebGL2 shader hero background with optimized spacing and zero navbar collision.
 * - 4-step wizard: Identity & Category, Supply & Network, Extensions (Preview), Review & Simulation.
 * - BigInt / integer-string precision token base-unit calculations.
 * - Illustrative OpenZeppelin v5-compliant Solidity source template generation with live drawer preview.
 * - 6-stage pure simulation workflow (validation, source generation, prep, submit, confirm, receipt).
 * - Enforces Ethereum Sepolia (11155111) per Architecture Decision D-04.
 * - Preserves pending decisions D-05, D-06, and D-12 without unauthorized production claims.
 */
export default function CreateTokenPage() {
  const wizardRef = useRef<HTMLDivElement>(null);

  const handleScrollToWizard = () => {
    if (wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreSetup = () => {
    const el = document.getElementById("token-wizard-steps") || wizardRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TokenShaderHero
        onScrollToWizard={handleScrollToWizard}
        onExploreSetup={handleExploreSetup}
      />
      <div ref={wizardRef} className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <TokenCreationWizard />
      </div>
    </div>
  );
}
