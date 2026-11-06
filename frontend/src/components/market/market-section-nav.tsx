import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./market-section-nav.css";

const sections = [
  { to: "/tokens", label: "Dashboard", end: true },
  { to: "/tokens/explore", label: "Explore Tokens", end: true },
  { to: "/tokens/watchlist", label: "Watchlist", end: true },
];

type Crumb = { label: string; to?: string };

export function MarketSectionNav() {
  const { pathname } = useLocation();
  const isAssetDetail = pathname.startsWith("/tokens/");
  return (
    <WorkspaceNavPortal>
      <nav className="mk-section-nav hx-workspace-nav" aria-label="Markets workspace">
      <div className="mk-section-nav__links hx-workspace-nav__links">
        {sections.map((item) => {
          const active = item.to === "/tokens/explore"
            ? pathname === item.to || isAssetDetail
            : undefined;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mk-section-nav__link${(active ?? isActive) ? " is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}

export function MarketBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mk-breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function MarketWorkspaceHeader({ items }: { items: Crumb[] }) {
  return <><MarketSectionNav /><MarketBreadcrumb items={items} /></>;
}
