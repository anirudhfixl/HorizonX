import React from "react";
import Link from "next/link";
import { FOOTER_NAV } from "@/config/navigation";
import { Zap, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-violet-600 p-0.5 shadow-md shadow-primary/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                ProMiners
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              A comprehensive Web2 and Web3 token creation, discovery, launchpad, airdrop,
              and staking platform built for transparent decentralized ecosystems.
            </p>

            {/* Protocol Status Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
              <span className="text-border">|</span>
              <span className="text-primary font-mono text-[10px]">EVM Ready</span>
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(FOOTER_NAV).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {category}
              </p>
              <ul className="space-y-2 text-xs">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href || "/"}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground">
          <p>© 2026 ProMiners Protocol. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Audited Architecture
            </span>
            <Link href="/docs/risk" className="hover:text-foreground transition-colors">
              Risk Notice
            </Link>
            <Link href="/docs/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/docs/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
