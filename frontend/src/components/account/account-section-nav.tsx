import { WorkspaceNavPortal } from "@/components/layout/workspace-nav-portal";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const accountSections = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/edit", label: "Edit profile", end: true },
  { to: "/account/wallets", label: "Wallets", end: true },
  { to: "/account/verification", label: "Verification", end: true },
  { to: "/account/security", label: "Security", end: true },
  { to: "/account/preferences", label: "Preferences", end: true },
  { to: "/docs", label: "Docs", end: false },
];

/** Account navigation deliberately uses the same shared tab classes as Tokens and Projects. */
export function AccountSectionNav() {
  const { pathname } = useLocation();
  return (
    <WorkspaceNavPortal>
      <nav className="tk-section-nav hx-workspace-nav" aria-label="Account workspace">
      <div className="tk-section-nav__links hx-workspace-nav__links">
        {accountSections.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `tk-section-nav__link${isActive || (item.to === "/docs" && pathname.startsWith("/docs")) ? " is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
    </WorkspaceNavPortal>
  );
}
