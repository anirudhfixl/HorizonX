import React from "react";
import HalftoneWordmarkFooter, {
  FooterColumn,
} from "@/components/ui/halftone-wordmark-footer";
import { FOOTER_NAV } from "@/data";

export function Footer() {
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
      wordmark="HorizonX"
      label="HORIZONX"
      meta="© 2026 • BUILDING THE OPEN WEB"
      preset="night"
      height="210px"
      dotGap={6}
      radius={95}
      crop={0.19}
      grain={0}
      columns={columns}
      className="route-themed-footer"
    />
  );
}
