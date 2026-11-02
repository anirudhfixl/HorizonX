import React from "react";
import HalftoneWordmarkFooter, {
  FooterColumn,
} from "@/components/ui/halftone-wordmark-footer";
import { FOOTER_NAV } from "@/data";
import { useLocation } from "react-router-dom";

export function Footer() {
  const isHomeRoute = useLocation().pathname === "/";
  const columns: FooterColumn[] = Object.entries(FOOTER_NAV).map(
    ([title, links]) => ({
      title,
      links: links.map((link) => ({
        label: link.label,
        href: link.href || "/",
      })),
    })
  );

  return (
    <HalftoneWordmarkFooter
      wordmark="Horizon X"
      label="PROMINERS"
      meta="© 2026 • BUILDING THE OPEN WEB"
      preset="night"
      palette={isHomeRoute ? { background: "transparent" } : undefined}
      height="490px"
      dotGap={6}
      radius={95}
      crop={0.19}
      grain={0}
      columns={columns}
      backToTop={true}
      className="route-themed-footer"
    />
  );
}
