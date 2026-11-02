import React from "react";

export interface DefinitionItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

/** Dense label and value rows separated by hairlines. Use instead of a grid of stat cards. */
export function DefinitionList({ items, className }: { items: DefinitionItem[]; className?: string }) {
  return (
    <dl className={`mx-deflist ${className ?? ""}`}>
      {items.map((it) => (
        <div key={it.label} className="mx-deflist__row">
          <dt>{it.label}</dt>
          <dd>
            {it.value}
            {it.hint && <small>{it.hint}</small>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
