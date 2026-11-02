import React from "react";
import { Link } from "react-router-dom";

export interface RelationRow {
  id: string;
  /** Plain-language kind, e.g. "Presale". */
  kind: string;
  title: string;
  status: string;
  tone: "live" | "upcoming" | "ended" | "neutral";
  meta?: string;
  href: string;
  cta: string;
}

/**
 * Rows linking an asset to the other modules that reference it. Renders nothing when
 * there are no relations, so a missing presale or pool never shows an empty slot.
 */
export function EcosystemRelationships({ rows, heading }: { rows: RelationRow[]; heading: string }) {
  if (!rows.length) return null;
  return (
    <section className="mx-eco" aria-label={heading}>
      <h3 className="mx-eco__h">{heading}</h3>
      <ul>
        {rows.map((r) => (
          <li key={`${r.kind}-${r.id}`}>
            <div className="mx-eco__main">
              <span className="mx-eco__kind">{r.kind}</span>
              <b>{r.title}</b>
              <span className="mx-eco__meta">
                <span className={`mx-dot mx-dot--${r.tone}`} aria-hidden="true" />
                {r.status}
                {r.meta ? `, ${r.meta}` : ""}
              </span>
            </div>
            <Link to={r.href} className="mx-link">
              {r.cta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
