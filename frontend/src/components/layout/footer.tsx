import React from "react";
import HalftoneWordmarkFooter, {
  FooterColumn,
} from "@/components/ui/halftone-wordmark-footer";
import { FOOTER_NAV } from "@/config/navigation";

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
      wordmark="Horizon X"
      label="PROMINERS"
      meta="© 2026 • BUILDING THE OPEN WEB"
      preset="night"
      palette={{
        background: "#0C0C0B",
        ink: "#E9E4DA",
        warm: "#E9762B",
      }}
      height="490px"
      dotGap={6}
      radius={95}
      crop={0.19}
      grain={0.35}
      columns={columns}
      backToTop={true}
    />
  );
}
