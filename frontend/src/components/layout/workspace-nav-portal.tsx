import React from "react";
import { createPortal } from "react-dom";

type WorkspaceNavPortalProps = {
  children: React.ReactNode;
};

/**
 * Renders workspace navigation in the document layer, outside animated route
 * wrappers. This keeps fixed positioning reliable while a spacer preserves the
 * original page flow where the navigation was declared.
 */
export function WorkspaceNavPortal({ children }: WorkspaceNavPortalProps) {
  const navigation = (
    <div className="hx-workspace-nav-portal">
      {children}
    </div>
  );

  return (
    <>
      <div className="hx-workspace-nav-spacer" aria-hidden="true" />
      {typeof document !== "undefined" ? createPortal(navigation, document.body) : null}
    </>
  );
}
