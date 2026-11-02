import React from "react";

export interface AllocationRow {
  label: string;
  pct: number;
  /** Formatted amount, e.g. "38.00M PMIN". */
  amount: string;
  note: string;
}

/**
 * One stacked bar for the split, then a table that carries the detail. The bar shows
 * proportion at a glance; the table is the accessible source of every number.
 */
export function AllocationBar({ rows, caption }: { rows: AllocationRow[]; caption: string }) {
  return (
    <div className="mx-alloc">
      <div className="mx-alloc__bar" role="img" aria-label={caption}>
        {rows.map((r, i) => (
          <span key={r.label} style={{ width: `${r.pct}%` }} data-i={i % 6} title={`${r.label}: ${r.pct}%`} />
        ))}
      </div>
      <table className="mx-table mx-table--dense">
        <caption className="mx-sr">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Allocation</th>
            <th scope="col" className="is-end">Share</th>
            <th scope="col" className="is-end hide-sm">Tokens</th>
            <th scope="col" className="hide-md">Release</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label}>
              <td>
                <span className="mx-alloc__key" data-i={i % 6} aria-hidden="true" />
                {r.label}
              </td>
              <td className="is-end">{r.pct}%</td>
              <td className="is-end hide-sm">{r.amount}</td>
              <td className="hide-md mx-muted">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
