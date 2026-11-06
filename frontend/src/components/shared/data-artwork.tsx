import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveImageSource } from "@/lib/media/image-resolver";

type DataArtworkProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
};

/** Same-origin catalog artwork with lazy loading and a deterministic visual fallback. */
export function DataArtwork({ src, alt, className = "", fallbackLabel }: DataArtworkProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageSource(src, { kind: "project" });

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/50 to-background ${className}`} role="img" aria-label={`${alt} artwork unavailable`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground/70">
          <ImageOff className="h-5 w-5" />
          {fallbackLabel && <span className="text-[10px] font-medium tracking-widest uppercase">{fallbackLabel}</span>}
        </div>
      </div>
    );
  }
  return <img src={resolved} alt={alt} loading="lazy" decoding="async" fetchPriority="low" onError={() => setFailed(true)} className={`block object-cover ${className}`} />;
}
