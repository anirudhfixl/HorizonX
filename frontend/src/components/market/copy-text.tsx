import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies a value (address, hash) to the clipboard and confirms inline. */
export function CopyText({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="mx-icon-btn"
      aria-label={done ? `${label} copied` : `Copy ${label}`}
      title={done ? "Copied" : `Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        } catch {
          /* clipboard blocked: nothing to confirm */
        }
      }}
    >
      {done ? <Check /> : <Copy />}
    </button>
  );
}
