import React from "react";
import { Search, X } from "lucide-react";

export interface FilterSelect {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export interface FilterToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder: string;
  selects: FilterSelect[];
  /** Right-aligned content such as a result count or reset link. */
  trailing?: React.ReactNode;
}

/** Search plus select filters in one quiet row. Selects use the native control for accessibility on mobile. */
export function FilterToolbar({ search, onSearch, searchPlaceholder, selects, trailing }: FilterToolbarProps) {
  return (
    <div className="mx-toolbar" role="search">
      <label className="mx-search">
        <Search aria-hidden="true" />
        <span className="mx-sr">Search</span>
        <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} />
        {search && (
          <button type="button" onClick={() => onSearch("")} aria-label="Clear search">
            <X />
          </button>
        )}
      </label>
      {selects.map((s) => (
        <label key={s.id} className="mx-select">
          <span className="mx-sr">{s.label}</span>
          <select value={s.value} onChange={(e) => s.onChange(e.target.value)} aria-label={s.label}>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {trailing && <div className="mx-toolbar__trailing">{trailing}</div>}
    </div>
  );
}
