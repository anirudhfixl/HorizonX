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
  const pathname = useLocation().pathname;
  const isHomeRoute = pathname === "/";
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
            className={`route-shell relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary-foreground transition-colors duration-300${isHomeRoute ? " home-route" : ""}`}
          >

            <ScrollToTop />

            <Suspense fallback={<div className="h-[68px]" />}>
              <TopNav />
            </Suspense>

            <main className="flex-1 pt-[84px] sm:pt-[84px] pb-0">
              <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>}>
                <Outlet />
              </Suspense>
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
