"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HalftoneWordmarkFooter, {
  FooterColumn,
} from "@/components/ui/halftone-wordmark-footer";
import { FOOTER_NAV } from "@/config/navigation";

type FooterTheme = {
  background: string;
  ink: string;
  warm: string;
};

function getFooterTheme(pathname: string): FooterTheme {
  const path = pathname || "/";

  // Keep the footer in the same visual family as the page above it.
  if (path === "/") {
    return {
      background: "#100D20",
      ink: "#F2EFFF",
      warm: "#A78BFA",
    };
  }

  if (path === "/explore" || path.startsWith("/explore/")) {
    return {
      background: "#030405",
      ink: "#F0F0F2",
      warm: "#A78BFA",
    };
  }

  if (path === "/tokens" || path.startsWith("/tokens/") || path === "/markets" || path.startsWith("/markets/")) {
    return {
      background: "#080B13",
      ink: "#E5E9F4",
      warm: "#A99AFF",
    };
  }

  if (path === "/launchpad" || path.startsWith("/launchpad/") || path === "/airdrops" || path.startsWith("/airdrops/") || path === "/staking" || path.startsWith("/staking/")) {
    return {
      background: "#100E1B",
      ink: "#F0ECFF",
      warm: "#B19BFF",
    };
  }

  return {
    background: "#080711",
    ink: "#F2F0FF",
    warm: "#A78BFA",
  };
}

export function Footer() {
  const pathname = usePathname();
  const palette = getFooterTheme(pathname || "/");

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
      palette={palette}
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
