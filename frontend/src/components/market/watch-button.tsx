import React from "react";
import { Star } from "lucide-react";

export interface WatchButtonProps {
  watched: boolean;
  onToggle: () => void;
  /** Name used in the accessible label, e.g. "PMIN". */
  name: string;
  /** "icon" for table rows, "labelled" for headers. */
  variant?: "icon" | "labelled";
}

export function WatchButton({ watched, onToggle, name, variant = "icon" }: WatchButtonProps) {
  const label = watched ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`;
  return (
    <button
      type="button"
      className={variant === "icon" ? "mx-icon-btn mx-watch" : "mx-btn mx-watch"}
      data-on={watched}
      aria-pressed={watched}
      aria-label={label}
      title={label}
      onClick={onToggle}
    >
      <Star />
      {variant === "labelled" && <span>{watched ? "Watching" : "Watch"}</span>}
    </button>
  );
}
