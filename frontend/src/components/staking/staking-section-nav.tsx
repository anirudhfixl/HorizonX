import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "@/components/staking/staking.css";

const sections = [
  { to: "/staking", label: "Overview", end: true },
  { to: "/staking/pools", label: "Staking pools", end: true },
  { to: "/staking/my", label: "My positions", end: true },
];

type Crumb = { label: string; to?: string };

/** Persistent workspace navigation shared by every canonical staking destination. */
export function StakingSectionNav() {
  const { pathname } = useLocation();
  const createActive = pathname === "/staking/pools/create";
  const poolDetail = pathname.startsWith("/staking/pools/") && !createActive;

  return (
    <nav className="st-section-nav hx-workspace-nav" aria-label="Staking workspace">
      <div className="st-section-nav__links hx-workspace-nav__links">
        {sections.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `st-section-nav__link${isActive || (item.to === "/staking/pools" && poolDetail) ? " is-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="st-section-nav__actions hx-workspace-nav__actions">
        <Link to="/staking/pools/create" className={`st-section-nav__create${createActive ? " is-active" : ""}`}>
          Deploy staking pool <span aria-hidden="true">＋</span>
        </Link>
      </div>
    </nav>
  );
}

export function StakingWorkspaceHeader({ items }: { items: Crumb[] }) {
  return (
    <>
      <StakingSectionNav />
      <nav aria-label="Breadcrumb" className="st-breadcrumb">
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}
