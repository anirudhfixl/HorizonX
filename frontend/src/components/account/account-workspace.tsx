import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useWallet } from "@/contexts/wallet-context";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleUserRound,
  LayoutGrid,
  LockKeyhole,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import "./account-workspace.css";

type AccountSection = "overview" | "profile" | "connections" | "preferences";

type AccountWorkspaceProps = {
  active: AccountSection;
  title: string;
  description: string;
  children: React.ReactNode;
};

const sections = [
  {
    id: "overview",
    label: "Overview",
    caption: "Account summary",
    to: "/account",
    icon: LayoutGrid,
    end: true,
  },
  {
    id: "profile",
    label: "Profile",
    caption: "Public identity",
    to: "/account/edit",
    icon: CircleUserRound,
    end: true,
  },
  {
    id: "connections",
    label: "Wallet & security",
    caption: "Access and protection",
    to: "/account/connections",
    icon: LockKeyhole,
    end: true,
  },
  {
    id: "preferences",
    label: "Preferences",
    caption: "Display and alerts",
    to: "/account/preferences",
    icon: SlidersHorizontal,
    end: true,
  },
] as const;

export function AccountWorkspace({
  active,
  title,
  description,
  children,
}: AccountWorkspaceProps) {
  const { isConnected, shortAddress } = useWallet();

  return (
    <main className="account-workspace">
      <header className="account-masthead">
        <div className="account-masthead__identity">
          <div className="account-masthead__avatar">
            {isConnected ? <Wallet className="h-5 w-5" /> : <CircleUserRound className="h-5 w-5" />}
          </div>
          <div className="account-masthead__copy">
            <span>HORIZONX / PERSONAL SPACE</span>
            <strong>{isConnected ? "Connected wallet" : "Your account"}</strong>
            <small>{isConnected ? shortAddress : "Connect a wallet to unlock Web3 features"}</small>
          </div>
        </div>
        <div className={`account-masthead__connection${isConnected ? " is-connected" : ""}`}>
          <span />
          {isConnected ? "Wallet connected" : "Wallet not connected"}
        </div>
      </header>

      <aside className="account-rail">
        <div className="account-rail__heading">
          <span>YOUR ACCOUNT</span>
          <small>Manage</small>
        </div>
        <nav className="account-rail__nav" aria-label="Account sections">
          {sections.map((section) => {
            const Icon = section.icon;
            const selected = active === section.id;
            return (
              <NavLink
                key={section.id}
                to={section.to}
                end={section.end}
                aria-current={selected ? "page" : undefined}
                className={`account-rail__link${selected ? " is-active" : ""}`}
              >
                <span className="account-rail__icon"><Icon className="h-[17px] w-[17px]" /></span>
                <span className="account-rail__link-copy">
                  <strong>{section.label}</strong>
                  <small>{section.caption}</small>
                </span>
                <ChevronRight className="account-rail__chevron h-4 w-4" />
              </NavLink>
            );
          })}
        </nav>

        <div className="account-rail__support">
          <span className="account-rail__support-icon"><Bell className="h-4 w-4" /></span>
          <div>
            <strong>Need a hand?</strong>
            <p>Find guidance for using your HorizonX account.</p>
            <Link to="/docs">Visit documentation <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
        </div>
      </aside>

      <section className="account-stage" aria-label={`${title} settings`}>
        <div className="account-stage__topline">
          <div className="account-stage__breadcrumb">
            <Link to="/account">Account</Link>
            <span>/</span>
            <strong>{title}</strong>
          </div>
          <span className="account-stage__index">ACCOUNT SETTINGS</span>
        </div>
        <div className="account-stage__heading">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        <div className="account-stage__scroll">
          <div className="account-stage__content">{children}</div>
        </div>
      </section>
    </main>
  );
}
