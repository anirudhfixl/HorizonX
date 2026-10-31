import React from "react";
import { cn } from "@/lib/utils";

export interface NetworkChipProps {
  network: string;
  className?: string;
}

export function NetworkChip({ network, className }: NetworkChipProps) {
  const isSepolia =
    network.toLowerCase().includes("sepolia") || network.toLowerCase() === "ethereum";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-tight",
        isSepolia
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "bg-secondary text-muted-foreground",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          isSepolia ? "bg-primary" : "bg-muted-foreground/60"
        )}
      />
      <span className="truncate">{network}</span>
    </span>
  );
}
