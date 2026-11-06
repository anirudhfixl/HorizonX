import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

/**
 * Persistent navigation for the token workspace.
 * Keep this visible on every top-level token destination so users can move
 * between Dashboard, Explore, Manage and Watchlist without backtracking.
 */
const destinations = [
  { to: "/tokens", label: "Dashboard", end: true },
  { to: "/tokens/explore", label: "Explore tokens" },
  { to: "/tokens/my", label: "Manage my tokens" },
  { to: "/tokens/watchlist", label: "Watchlist" },
];

export function TokenSectionNav() {
  const { pathname } = useLocation();
  const isTokenDetail = /^\/tokens\/[^/]+(?:\/(?:contract|activity))?$/.test(pathname) && !["/tokens/create", "/tokens/my", "/tokens/watchlist", "/tokens/explore"].includes(pathname);
  return (
    <WorkspaceNavPortal>
      <nav className="tk-section-nav hx-workspace-nav" aria-label="Token workspace">
      <div className="tk-section-nav__links hx-workspace-nav__links">
        {destinations.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `tk-section-nav__link${isActive || (item.to === "/tokens/explore" && isTokenDetail) ? " is-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <Link to="/tokens/create" className="tk-section-nav__create">
        Create token <span aria-hidden="true">＋</span>
      </Link>
    </nav>
    </WorkspaceNavPortal>
  );
}


/** Shared breadcrumb treatment used across every token workspace destination. */
export function TokenBreadcrumb({ current, parent, parentTo = "/tokens" }: { current: string; parent?: string; parentTo?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="tk-breadcrumb">
      <Link to={parentTo}>{parent || "Tokens"}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
