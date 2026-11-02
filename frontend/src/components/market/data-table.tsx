import React from "react";

export type Hide = "sm" | "md" | "lg";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: "start" | "end";
  /** Sort key reported to onSort. Omit for unsortable columns. */
  sortable?: boolean;
  /** Hide this column below a breakpoint (sm 640, md 900, lg 1120). */
  hideBelow?: Hide;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  empty?: React.ReactNode;
  dense?: boolean;
}

/**
 * Compact table for financial data: numeric columns right-aligned with tabular figures,
 * sticky header, sortable columns announced with aria-sort, and columns that step
 * out of the way on narrow screens instead of forcing horizontal scrolling.
 */
export function DataTable<T>({ columns, rows, rowKey, caption, sortKey, sortDir, onSort, empty, dense }: DataTableProps<T>) {
  if (!rows.length && empty) return <>{empty}</>;
  return (
    <div className="mx-table-wrap">
      <table className={`mx-table ${dense ? "mx-table--dense" : ""}`}>
        <caption className="mx-sr">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const sorted = sortKey === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  className={`${c.align === "end" ? "is-end" : ""} ${c.hideBelow ? `hide-${c.hideBelow}` : ""} ${c.className ?? ""}`}
                  aria-sort={sorted ? (sortDir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}
                >
                  {c.sortable && onSort ? (
                    <button type="button" onClick={() => onSort(c.key)} data-sorted={sorted}>
                      {c.header}
                      <i aria-hidden="true">{sorted ? (sortDir === "asc" ? "↑" : "↓") : ""}</i>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key} className={`${c.align === "end" ? "is-end" : ""} ${c.hideBelow ? `hide-${c.hideBelow}` : ""} ${c.className ?? ""}`}>
                  {c.cell(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
