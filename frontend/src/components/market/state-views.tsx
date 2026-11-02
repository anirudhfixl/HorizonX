import React from "react";

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="mx-state" role="status">
      <b>{title}</b>
      {body && <p>{body}</p>}
      {action && <div className="mx-state__action">{action}</div>}
    </div>
  );
}

export function LoadingState({ rows = 4, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div className="mx-loading" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="mx-loading__row" style={{ width: `${88 - ((i * 13) % 34)}%` }} />
      ))}
    </div>
  );
}

export function ErrorState({ title, body, onRetry }: { title: string; body?: string; onRetry?: () => void }) {
  return (
    <div className="mx-state mx-state--error" role="alert">
      <b>{title}</b>
      {body && <p>{body}</p>}
      {onRetry && (
        <div className="mx-state__action">
          <button type="button" className="mx-btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
