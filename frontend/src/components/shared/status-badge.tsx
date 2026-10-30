import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "active"
  | "live"
  | "scheduled"
  | "pending"
  | "ended"
  | "finalized"
  | "failed"
  | "cancelled"
  | "draft"
  | "verified"
  | "unverified";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  pulse?: boolean;
}

export function StatusBadge({ status, variant, className, pulse }: StatusBadgeProps) {
  const norm = (variant || status || "").toLowerCase();

  let colorClasses = "border-border/60 bg-muted/50 text-muted-foreground";
  let dotClass = "bg-muted-foreground";
  let shouldPulse = pulse ?? false;

  if (norm === "active" || norm === "live") {
    colorClasses = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    dotClass = "bg-emerald-400";
    shouldPulse = pulse ?? true;
  } else if (norm === "scheduled" || norm === "pending") {
    colorClasses = "border-amber-500/30 bg-amber-500/10 text-amber-400";
    dotClass = "bg-amber-400";
  } else if (norm === "verified") {
    colorClasses = "border-primary/40 bg-primary/10 text-primary";
    dotClass = "bg-primary";
  } else if (norm === "ended" || norm === "finalized") {
    colorClasses = "border-zinc-700/60 bg-zinc-800/40 text-zinc-400";
    dotClass = "bg-zinc-500";
  } else if (norm === "failed" || norm === "cancelled") {
    colorClasses = "border-destructive/30 bg-destructive/10 text-destructive";
    dotClass = "bg-destructive";
  } else if (norm === "draft") {
    colorClasses = "border-border/60 bg-muted/60 text-muted-foreground";
    dotClass = "bg-muted-foreground";
  }

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
        colorClasses,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dotClass,
          shouldPulse && "animate-pulse"
        )}
      />
      {label}
    </span>
  );
}
