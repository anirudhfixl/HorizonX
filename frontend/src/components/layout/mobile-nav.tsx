"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOP_NAV_ITEMS, CREATE_ITEMS, USER_MENU_ITEMS } from "@/config/navigation";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Button } from "@/components/ui/button";
import { X, Wallet, Zap, Plus, ExternalLink } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { isConnected, shortAddress } = useWallet();
  const { openModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-card/95 border-l border-border/60 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground">ProMiners</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Wallet CTA */}
          <div className="space-y-2">
            {isConnected ? (
              <Button
                variant="outline"
                className="w-full justify-between text-xs font-mono border-border/60"
                onClick={() => {
                  onClose();
                  openModal("WALLET_DETAILS");
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {shortAddress}
                </span>
                <span className="text-[10px] text-muted-foreground">Manage</span>
              </Button>
            ) : (
              <Button
                className="w-full gap-2 bg-primary text-primary-foreground text-xs font-semibold"
                onClick={() => {
                  onClose();
                  openModal("CONNECT_WALLET");
                }}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Create Shortcut CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
              <Plus className="h-3 w-3" /> Quick Launch
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CREATE_ITEMS.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href || "/"}
                  onClick={onClose}
                  className="rounded-md border border-border/40 bg-secondary/40 px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-center"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <nav className="space-y-1">
              {TOP_NAV_ITEMS.map((item) => (
                <div key={item.label} className="space-y-1">
                  <Link
                    href={item.href || item.children?.[0]?.href || "/"}
                    onClick={onClose}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.href && pathname.startsWith(item.href)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-0.5 border-l border-border/40 ml-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href || "/"}
                          onClick={onClose}
                          className="block rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* User Account Links if connected */}
          {isConnected && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                My Profile
              </p>
              <div className="space-y-1">
                {USER_MENU_ITEMS.map((uItem) => (
                  <Link
                    key={uItem.label}
                    href={uItem.href || "/"}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  >
                    {uItem.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info in drawer */}
        <div className="pt-6 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>ProMiners Protocol</span>
          <Link
            href="/docs"
            onClick={onClose}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
