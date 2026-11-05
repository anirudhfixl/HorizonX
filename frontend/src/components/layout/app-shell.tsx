import React, { Suspense, useEffect } from "react";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { GlobalModalRenderer } from "@/components/modals/modal-provider";
import { Toaster } from "sonner";
import { Web3Provider } from "@/components/providers/web3-provider";
import { WalletProvider } from "@/contexts/wallet-context";
import { ModalProvider } from "@/contexts/modal-context";
import { getRouteTheme } from "@/config/theme-tokens";
import { ScrollToTop } from "./scroll-to-top";
import { Outlet, useLocation } from "react-router-dom";

export function AppShell() {
  const { pathname } = useLocation();
  const isHomeRoute = pathname === "/";
  const isExploreRoute = pathname === "/explore" || pathname.startsWith("/explore/");
  const isProjectsRoute = pathname === "/projects" || pathname.startsWith("/projects/");
  const theme = getRouteTheme(pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Web3Provider>
      <WalletProvider>
        <ModalProvider>
          <div
            data-theme={theme}
            className={`route-shell relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary-foreground transition-colors duration-300${isHomeRoute ? " home-route" : ""}${isExploreRoute ? " explore-route" : ""}${isProjectsRoute ? " projects-route" : ""}`}
          >

            <ScrollToTop />

            <Suspense fallback={<div className="h-[68px]" />}>
              <TopNav />
            </Suspense>

            {/* One viewport-level glass sheet: blurs scrolling content behind both navbars. */}
            <div className="hx-navigation-glass-overlay" aria-hidden="true" />

            <main className={`route-main min-w-0 flex-1 ${isHomeRoute ? "pt-0" : "pt-[84px] sm:pt-[84px]"} pb-0`}>
<div key={pathname} className="route-page-transition">
                <Suspense
                  fallback={
                    <div className="route-suspense-fallback" aria-label="Loading page">
                      <div className="route-skeleton route-skeleton-heading" />
                      <div className="route-skeleton route-skeleton-copy" />
                      <div className="route-skeleton-grid">
                        <div className="route-skeleton route-skeleton-card" />
                        <div className="route-skeleton route-skeleton-card" />
                        <div className="route-skeleton route-skeleton-card" />
                      </div>
                    </div>
                  }
                >
                  <Outlet />
                </Suspense>
              </div>
            </main>

            <Footer />

            {/* Global Modal Layer */}
            <GlobalModalRenderer />

            {/* Sonner Toast Container */}
            <Toaster
              position="bottom-right"
              theme="dark"
              richColors
              closeButton
              toastOptions={{
                className: "border border-border/80 bg-card text-foreground font-sans",
              }}
            />
          </div>
        </ModalProvider>
      </WalletProvider>
    </Web3Provider>
  );
}
