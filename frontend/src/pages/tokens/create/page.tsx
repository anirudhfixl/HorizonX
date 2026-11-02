import { TokenBreadcrumb, TokenSectionNav } from "@/components/tokens/token-section-nav";
import React from "react";
import { TokenCreationWizard } from "@/components/tokens/token-creation-wizard";

/**
 * Token creation route. The animated launch hero lives on /tokens.
 * Keep the existing workflow header and stepper intact above the new form layout.
 */
export default function CreateTokenPage() {
  return (
    <main className="tk-page tk-page--create pb-20">
      <TokenSectionNav />
      <TokenBreadcrumb current="Create token" />
      <TokenCreationWizard />
    </main>
  );
}
