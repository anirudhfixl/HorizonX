import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const sections = [
  { to: "/launchpad", label: "Overview", end: true },
  { to: "/launchpad/presales", label: "Presales" },
  { to: "/launchpad/launches", label: "Fair launches" },
  { to: "/launchpad/my", label: "My launches", end: true },
];

export function LaunchpadSectionNav() {
  const { pathname } = useLocation();
  const createPresale = pathname === "/launchpad/presales/create";
  const createFair = pathname === "/launchpad/launches/create";
  return (
    <WorkspaceNavPortal>
      <nav className="lp-section-nav hx-workspace-nav" aria-label="Launchpad workspace">
      <div className="lp-section-nav__links hx-workspace-nav__links">
        {sections.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `lp-section-nav__link${isActive ? " is-active" : ""}`}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="lp-section-nav__actions hx-workspace-nav__actions">
        <Link to="/tokens/explore" className="lp-section-nav__crosslink">Tokens</Link>
        <Link to="/airdrops" className="lp-section-nav__crosslink">Airdrops</Link>
        <Link to="/launchpad/presales/create" className={`lp-section-nav__create${createPresale ? " is-active" : ""}`}>Create presale <span aria-hidden="true">＋</span></Link>
        <Link to="/launchpad/launches/create" className={`lp-section-nav__create lp-section-nav__create--secondary${createFair ? " is-active" : ""}`}>Create fair launch <span aria-hidden="true">＋</span></Link>
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}

type Crumb = { label: string; to?: string };
export function LaunchpadBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="lp-breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function LaunchpadWorkspaceHeader({ items }: { items: Crumb[] }) {
  return <><LaunchpadSectionNav /><LaunchpadBreadcrumb items={items} /></>;
}
