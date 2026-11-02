import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/** Underlined tab list with arrow-key navigation. Panels are rendered by the caller with role="tabpanel". */
export function TabBar({ tabs, active, onChange, label, idPrefix }: { tabs: TabItem[]; active: string; onChange: (id: string) => void; label: string; idPrefix: string }) {
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    onChange(next.id);
    document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus();
  };
  return (
    <div className="mx-tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          id={`${idPrefix}-tab-${t.id}`}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          aria-controls={`${idPrefix}-panel-${t.id}`}
          tabIndex={active === t.id ? 0 : -1}
          data-active={active === t.id}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
          {t.count != null && <small>{t.count}</small>}
        </button>
      ))}
    </div>
  );
}
