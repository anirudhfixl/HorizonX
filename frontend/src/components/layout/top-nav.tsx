"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOP_NAV_ITEMS } from "@/config/navigation";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Loader2, AlertTriangle, Wallet } from "lucide-react";

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`chevron ${open ? "is-open" : ""}`}
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3.5 6 4.5 4.5L12.5 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const {
    isConnected,
    isConnecting,
    isUnsupportedNetwork,
    shortAddress,
    balance,
    switchNetwork,
  } = useWallet();
  const { openModal } = useModal();

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const navRef = useRef<HTMLElement>(null);

  // Scroll detection: window.scrollY > 36 activates subtle glass treatment
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Restore saved nav theme if present (scoped strictly to navbar)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prominers_nav_theme") as "light" | "dark" | null;
      if (saved === "light" || saved === "dark") {
        requestAnimationFrame(() => setNavTheme(saved));
      }
    } catch {}
  }, []);

  // Click-outside and Escape key listener
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveMenu((current) => (current === label ? null : label));
  };

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const toggleNavTheme = () => {
    setNavTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("prominers_nav_theme", next);
      } catch {}
      return next;
    });
  };

  return (
    <header
      className={`navbar-shell theme-${navTheme} ${scrolled ? "is-scrolled" : ""}`}
      ref={navRef}
    >
      <nav className="navbar" aria-label="Main navigation">
        {/* Column 1: Brand Identity */}
        <Link
          className="brand"
          href="/"
          aria-label="ProMiners home"
          onClick={closeMenus}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/prominers-logo.svg" alt="ProMiners" />
        </Link>

        {/* Column 2: Navigation Links */}
        <div className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>
          {TOP_NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isMenuOpen = activeMenu === item.label;
            const isCurrent = item.href ? pathname.startsWith(item.href) : false;

            if (hasChildren) {
              return (
                <div className="nav-item has-dropdown" key={item.label}>
                  <button
                    type="button"
                    className={`nav-link ${isMenuOpen || isCurrent ? "active" : ""}`}
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={isMenuOpen}
                  >
                    <span>{item.label}</span>
                    <Chevron open={isMenuOpen} />
                  </button>
                  <div
                    className={`dropdown-panel ${isMenuOpen ? "visible" : ""}`}
                    role="menu"
                  >
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href || "/"}
                        role="menuitem"
                        onClick={closeMenus}
                      >
                        <span className="dropdown-label">{child.label}</span>
                        {child.description && (
                          <span className="dropdown-detail">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                className={`nav-link ${isCurrent ? "active" : ""}`}
                href={item.href || "/"}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Column 3: Actions (Dashboard, Scoped Theme Toggle, Connect Wallet) */}
        <div className="nav-actions">
          <Link
            className="dashboard-link"
            href="/explore"
            onClick={closeMenus}
          >
            Dashboard
          </Link>

          {/* Scoped Theme Toggle (36px circular button) */}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleNavTheme}
            aria-label={`Switch navbar to ${navTheme === "light" ? "dark" : "light"} mode`}
            title={`Switch navbar to ${navTheme === "light" ? "dark" : "light"} mode`}
          >
            {navTheme === "light" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            )}
          </button>

          {/* Real ProMiners Connect Wallet Control (41px height) */}
          {isConnecting ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-loading"
              disabled
              aria-label="Connecting wallet"
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Connecting...</span>
            </button>
          ) : isUnsupportedNetwork ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-warning"
              onClick={() => switchNetwork(11155111)}
              title="Click to switch to Ethereum Sepolia Testnet"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Switch to Sepolia</span>
            </button>
          ) : isConnected ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-connected"
              onClick={() => openModal("WALLET_DETAILS")}
              title="View wallet details"
            >
              <span className="wallet-dot" />
              <span className="wallet-balance">{balance} ETH</span>
              <span className="wallet-address">{shortAddress}</span>
            </button>
          ) : (
            <button
              type="button"
              className="wallet-btn wallet-btn-connect"
              onClick={() => openModal("CONNECT_WALLET")}
            >
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Hamburger */}
        <button
          className={`mobile-toggle ${mobileOpen ? "opened" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          type="button"
        >
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
