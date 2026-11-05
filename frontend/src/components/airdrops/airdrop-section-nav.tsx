import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const sections = [
  { to: "/airdrops", label: "Overview", end: true },
  { to: "/airdrops/campaigns", label: "Campaigns" },
  { to: "/airdrops/my", label: "My campaigns", end: true },
  { to: "/airdrops/claim", label: "Claim checker", end: true },
];

type Crumb = { label: string; to?: string };

export function AirdropSectionNav() {
  const { pathname } = useLocation();
  const createActive = pathname === "/airdrops/campaigns/create";
  return (
    <WorkspaceNavPortal>
      <nav className="ad-section-nav hx-workspace-nav" aria-label="Airdrop workspace">
      <div className="ad-section-nav__links hx-workspace-nav__links">
        {sections.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `ad-section-nav__link${isActive || (item.to === "/airdrops/campaigns" && pathname.startsWith("/airdrops/campaigns/")) ? " is-active" : ""}`}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="ad-section-nav__actions hx-workspace-nav__actions">
        <Link to="/tokens/explore" className="ad-section-nav__crosslink">Tokens</Link>
        <Link to="/launchpad" className="ad-section-nav__crosslink">Launchpad</Link>
        <Link to="/airdrops/campaigns/create" className={`ad-section-nav__create${createActive ? " is-active" : ""}`}>
          Create campaign <span aria-hidden="true">＋</span>
        </Link>
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}

export function AirdropWorkspaceHeader({ items }: { items: Crumb[] }) {
  return (
    <>
      <AirdropSectionNav />
      <nav aria-label="Breadcrumb" className="ad-breadcrumb">
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
