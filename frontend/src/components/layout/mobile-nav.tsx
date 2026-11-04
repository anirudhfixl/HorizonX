import React from "react";
import { TOP_NAV_ITEMS, CREATE_ITEMS, USER_MENU_ITEMS } from "@/data";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Button } from "@/components/ui/button";
import { X, Wallet, Zap, Plus, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = useLocation().pathname;
  const { isConnected, isUnsupportedNetwork, shortAddress, balance, switchNetwork } = useWallet();
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
              <span className="font-bold text-foreground">HorizonX</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Wallet CTA & Network State */}
          <div className="space-y-2">
            {isUnsupportedNetwork ? (
              <Button
                variant="destructive"
                className="w-full text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25"
                onClick={() => {
                  switchNetwork(11155111);
                }}
              >
                Switch to Sepolia (11155111)
              </Button>
            ) : isConnected ? (
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
                  <span>{shortAddress}</span>
                </span>
                <span className="text-[11px] font-semibold text-primary">{balance} ETH</span>
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
                  to={item.href || "/"}
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
                    to={item.href || item.children?.[0]?.href || "/"}
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
                          to={child.href || "/"}
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
                    to={uItem.href || "/"}
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
          <span>HorizonX Protocol</span>
          
        </div>
      </div>
    </div>
  );
}
