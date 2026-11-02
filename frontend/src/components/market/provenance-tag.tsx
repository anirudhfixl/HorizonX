import React from "react";
import { PROVENANCE_META, type DataProvenance } from "@/lib/data-provenance";

/**
 * Small inline marker for where a figure comes from. Uses the shared provenance
 * vocabulary (catalog, simulated, session, on-chain) so it reads the same across modules.
 */
export function ProvenanceTag({ kind, label }: { kind: DataProvenance; label?: string }) {
  const meta = PROVENANCE_META[kind];
  return (
    <span className={`mx-prov mx-prov--${kind}`} title={meta.description} data-provenance={kind}>
      <i aria-hidden="true" />
      {label ?? meta.label}
    </span>
  );
}
