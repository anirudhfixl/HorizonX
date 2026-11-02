import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description?: string;
}

/**
 * Per-page document metadata (replaces Next.js `export const metadata`).
 * Sets <title> and the description <meta> while the page is mounted, and restores the
 * previous values on unmount so pages without their own metadata fall back to index.html.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    const previousDescription = meta.content;
    if (description) meta.content = description;

    return () => {
      document.title = previousTitle;
      if (created) meta?.remove();
      else if (meta) meta.content = previousDescription;
    };
  }, [title, description]);

  return null;
}
