import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./partners-section-nav.css";

const sections = [
  { to: "/partners", label: "Overview", end: true },
  { to: "/partners/referrals", label: "Referrals", end: true },
];

type Crumb = { label: string; to?: string };

export function PartnersSectionNav() {
  return (
    <WorkspaceNavPortal>
      <nav className="pt-section-nav hx-workspace-nav" aria-label="Partners workspace">
      <div className="pt-section-nav__links hx-workspace-nav__links">
        {sections.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `pt-section-nav__link${isActive ? " is-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}

export function PartnersBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PartnersWorkspaceHeader({ items }: { items: Crumb[] }) {
  return <><PartnersSectionNav /><PartnersBreadcrumb items={items} /></>;
}
