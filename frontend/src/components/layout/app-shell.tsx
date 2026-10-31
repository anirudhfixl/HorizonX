"use client";

import React, { Suspense } from "react";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { GlobalModalRenderer } from "@/components/modals/modal-provider";
import { Toaster } from "sonner";
import { Web3Provider } from "@/components/providers/web3-provider";
import { WalletProvider } from "@/contexts/wallet-context";
import { ModalProvider } from "@/contexts/modal-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <WalletProvider>
        <ModalProvider>
          <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary-foreground">

            <Suspense fallback={<div className="h-[68px]" />}>
              <TopNav />
            </Suspense>

            <main className="flex-1 pt-24 sm:pt-28 pb-0">
              <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>}>
                {children}
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
