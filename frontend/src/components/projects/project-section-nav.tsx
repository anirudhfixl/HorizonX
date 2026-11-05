import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const destinations = [
  { to: "/projects", label: "Directory", end: true },
  { to: "/projects/my", label: "My projects", end: true },
];

/** Persistent navigation shared by the Projects directory, owner workspace and detail pages. */
export function ProjectSectionNav() {
  const { pathname } = useLocation();
  const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects/my";

  return (
    <WorkspaceNavPortal>
      <nav className="tk-section-nav hx-workspace-nav" aria-label="Projects workspace">
      <div className="tk-section-nav__links hx-workspace-nav__links">
        {destinations.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `tk-section-nav__link${isActive || (item.to === "/projects" && isProjectDetail) ? " is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="hx-workspace-nav__actions">
        <Link to="/tokens">Tokens</Link>
        <Link to="/airdrops">Airdrops</Link>
        <Link to="/launchpad">Launchpad</Link>
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}

/** Breadcrumb treatment aligned with the Token workspace breadcrumb. */
export function ProjectBreadcrumb({ current, parent, parentTo = "/projects" }: { current: string; parent?: string; parentTo?: string }) {
  return (
    <nav className="tk-breadcrumb" aria-label="Breadcrumb">
      <Link to={parentTo}>{parent || "Projects"}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
