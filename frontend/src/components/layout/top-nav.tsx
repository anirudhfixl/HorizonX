"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet, SUPPORTED_NETWORKS } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { TOP_NAV_ITEMS, CREATE_ITEMS } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  ChevronDown,
  Wallet,
  Menu,
  Sparkles,
  Zap,
} from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function TopNav() {
  const pathname = usePathname();
  const { isConnected, shortAddress, network, switchNetwork } = useWallet();
  const { openModal } = useModal();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-violet-600 p-0.5 shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90 backdrop-blur-xs">
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  ProMiners
                  <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[9px] font-semibold text-primary uppercase tracking-wider">
                    v1.0
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block -mt-1 font-mono">
                  Token & Launch Protocol
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {TOP_NAV_ITEMS.map((item) => {
                const isActive = item.href ? pathname.startsWith(item.href) : false;

                if (item.children && item.children.length > 0) {
                  return (
                    <DropdownMenu key={item.label}>
                      <DropdownMenuTrigger
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary/60 hover:text-foreground outline-none cursor-pointer ${
                          isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56 p-1.5 bg-popover/95 backdrop-blur-xl border-border/60 shadow-xl">
                        {item.description && (
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                            {item.description}
                          </DropdownMenuLabel>
                        )}
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.label}>
                            <Link
                              href={child.href || "/"}
                              className="flex flex-col gap-0.5 px-2 py-1.5 rounded-md hover:bg-secondary w-full"
                            >
                              <span className="text-xs font-medium text-foreground">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="text-[10px] text-muted-foreground line-clamp-1">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href || "/"}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary/60 hover:text-foreground ${
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Create, Search, Network, Wallet, Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Create Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-semibold h-8 px-3 rounded-lg cursor-pointer outline-none">
                <Plus className="h-3.5 w-3.5" />
                <span>Create</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5 bg-popover/95 backdrop-blur-xl border-border/60 shadow-xl">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                  Creation Tools
                </DropdownMenuLabel>
                {CREATE_ITEMS.map((createItem) => (
                  <DropdownMenuItem key={createItem.label}>
                    <Link
                      href={createItem.href || "/"}
                      className="flex items-center justify-between px-2 py-1.5 text-xs font-medium w-full"
                    >
                      <span>{createItem.label}</span>
                      <Sparkles className="h-3 w-3 text-primary/70" />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Command Search Button */}
            <button
              onClick={() => openModal("COMMAND_PALETTE")}
              className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary/60 hover:text-foreground cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="pr-2">Search...</span>
              <kbd className="rounded border border-border/50 bg-background/80 px-1.5 py-0.2 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Network Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 inline-flex items-center gap-1.5 border border-border/60 bg-secondary/20 hover:bg-secondary/50 text-xs px-2.5 rounded-lg cursor-pointer outline-none">
                <span className="text-sm">{network.icon}</span>
                <span className="hidden sm:inline-block font-medium">{network.name}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 bg-popover/95 backdrop-blur-xl border-border/60 shadow-xl">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                  Select Network
                </DropdownMenuLabel>
                {SUPPORTED_NETWORKS.map((net) => (
                  <DropdownMenuItem
                    key={net.id}
                    onClick={() => switchNetwork(net.id)}
                    className="flex items-center justify-between px-2 py-2 text-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>{net.icon}</span>
                      <span className={net.id === network.id ? "font-semibold text-primary" : ""}>
                        {net.name}
                      </span>
                    </span>
                    {net.id === network.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Button */}
            {isConnected ? (
              <Button
                size="sm"
                onClick={() => openModal("WALLET_DETAILS")}
                className="h-8 gap-1.5 bg-secondary border border-border/70 hover:border-primary/40 text-foreground text-xs font-mono font-medium px-3 rounded-lg shadow-xs"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{shortAddress}</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => openModal("CONNECT_WALLET")}
                className="h-8 gap-1.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-primary-foreground text-xs font-semibold px-3.5 rounded-lg shadow-sm shadow-primary/20"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="h-8 w-8 p-0 lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
