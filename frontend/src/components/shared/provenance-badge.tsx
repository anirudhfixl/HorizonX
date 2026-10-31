import React from "react";
import { cn } from "@/lib/utils";
import {
  PROVENANCE_META,
  type DataProvenance,
} from "@/lib/data-provenance";

interface ProvenanceBadgeProps {
  kind: DataProvenance;
  /** Overrides the default label, for example "Simulated market data". */
  label?: string;
  className?: string;
}

// Dark-first, matching StatusBadge. The `.light` variants darken the text so the
// badge stays readable on the light theme. Squarer corners than StatusBadge keep
// "where this data comes from" visually separate from "what state it is in".
const TONES: Record<DataProvenance, { box: string; dot: string }> = {
  catalog: {
    box: "border-border/60 bg-muted/50 text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  simulated: {
    box: "border-violet-500/30 bg-violet-500/10 text-violet-400 [.light_&]:text-violet-700",
    dot: "bg-violet-400 [.light_&]:bg-violet-600",
  },
  session: {
    box: "border-sky-500/30 bg-sky-500/10 text-sky-400 [.light_&]:text-sky-700",
    dot: "bg-sky-400 [.light_&]:bg-sky-600",
  },
  onchain: {
    box: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 [.light_&]:text-emerald-700",
    dot: "bg-emerald-400 [.light_&]:bg-emerald-600",
  },
};

/**
 * Labels where a value comes from: Catalog, Simulated, Session or On-chain.
 * The explanation is available as a tooltip and to screen readers, and the
 * kind is always spelled out so colour is never the only signal.
 */
export function ProvenanceBadge({ kind, label, className }: ProvenanceBadgeProps) {
  const meta = PROVENANCE_META[kind];
  const tone = TONES[kind];
  const text = label ?? meta.label;

  return (
    <span
      title={meta.description}
      aria-label={`${text}. ${meta.description}`}
      data-provenance={kind}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tone.box,
        className
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-[2px]", tone.dot)} />
      {text}
    </span>
  );
}
