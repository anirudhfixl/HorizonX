import React, { useEffect, useRef, useState } from "react";
import { TOP_NAV_ITEMS } from "@/data";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Loader2, AlertTriangle, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const PRIMARY_ENTRY_LABELS = new Set(["Explore", "Projects", "Tokens", "Launchpad", "Airdrops", "Staking", "Markets", "Partners", "Account"]);

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
  const pathname = useLocation().pathname;
  const {
    isConnected,
    isConnecting,
    isReconnecting,
    isUnsupportedNetwork,
    shortAddress,
    balance,
    switchNetwork,
  } = useWallet();
  const { openModal } = useModal();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const navRef = useRef<HTMLElement>(null);

  // Retain the last confirmed wallet display during short Wagmi reconnects.
  // Route navigation must never make a connected wallet flash "Connect Wallet"
  // or reset its displayed balance while the provider refreshes.
  const lastConnectedWallet = useRef<{ address: string; balance: string } | null>(null);
  const [confirmedDisconnected, setConfirmedDisconnected] = useState(true);

  useEffect(() => {
    if (isConnected && shortAddress) {
      lastConnectedWallet.current = {
        address: shortAddress,
        balance: balance !== "0.0000" || !lastConnectedWallet.current
          ? balance
          : lastConnectedWallet.current.balance,
      };
      setConfirmedDisconnected(false);
      return;
    }

    if (isConnecting || isReconnecting) return;

    // A brief grace period filters transient disconnect states while changing
    // routes, without keeping a disconnected wallet visible indefinitely.
    const timeout = window.setTimeout(() => {
      lastConnectedWallet.current = null;
      setConfirmedDisconnected(true);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [isConnected, isConnecting, isReconnecting, shortAddress, balance]);

  const retainedWallet = !confirmedDisconnected ? lastConnectedWallet.current : null;
  const displayConnected = isConnected || Boolean(retainedWallet);
  const displayAddress = isConnected ? shortAddress : retainedWallet?.address;
  const displayBalance = isConnected
    ? balance === "0.0000" && retainedWallet ? retainedWallet.balance : balance
    : retainedWallet?.balance;

  // Keep wallet-dependent markup identical during SSR and the first client render.
  // Wagmi may restore a wallet session immediately on the client, so render its
  // resolved state only after hydration has completed.
  useEffect(() => {
    setMounted(true);
  }, []);

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
        {/* Left zone: Brand identity */}
        <div className="nav-zone nav-zone-brand">
        <Link
          className="brand"
          to="/"
          aria-label="HorizonX home"
          onClick={closeMenus}
        >
          <img src="/prominers-logo.svg" alt="HorizonX" />
        </Link>
        </div>

        {/* Center zone: primary entry links and secondary dropdowns */}
        <div className="nav-links-zone">
        <div className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>
          {TOP_NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isMenuOpen = activeMenu === item.label;
            const isCurrent = item.href ? pathname.startsWith(item.href) : false;

            if (PRIMARY_ENTRY_LABELS.has(item.label)) {
              return (
                <Link
                  key={item.label}
                  className={`nav-link primary-entry ${isCurrent ? "active" : ""}`}
                  to={item.href || "/"}
                  onClick={closeMenus}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <svg className="primary-entry-arrow" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.25 8h9.5M8.5 3.75 12.75 8 8.5 12.25" />
                  </svg>
                </Link>
              );
            }

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
                        to={child.href || "/"}
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
                to={item.href || "/"}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        </div>

        {/* Right zone: theme toggle and wallet */}
        <div className="nav-zone nav-zone-actions">
        <div className="nav-actions">
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
          {mounted ? (!isConnected && isConnecting ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-loading"
              disabled
              aria-label="Connecting wallet"
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Connecting...</span>
            </button>
          ) : isUnsupportedNetwork && !displayConnected ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-warning"
              onClick={() => switchNetwork(11155111)}
              title="Click to switch to Ethereum Sepolia Testnet"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Switch to Sepolia</span>
            </button>
          ) : displayConnected ? (
            <button
              type="button"
              className="wallet-btn wallet-btn-connected"
              onClick={() => openModal("WALLET_DETAILS")}
              title="View wallet details"
            >
              <span className="wallet-dot" />
              <span className="wallet-balance">{displayBalance} ETH</span>
              <span className="wallet-address">{displayAddress}</span>
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
          )) : (
            <button
              type="button"
              className="wallet-btn wallet-btn-connect"
              disabled
              aria-label="Wallet status loading"
            >
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
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
