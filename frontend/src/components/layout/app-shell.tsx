"use client";

import React, { Suspense } from "react";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { GlobalModalRenderer } from "@/components/modals/modal-provider";
import { Toaster } from "sonner";
import { WalletProvider } from "@/contexts/wallet-context";
import { ModalProvider } from "@/contexts/modal-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ModalProvider>
        <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
          {/* Subtle Ambient Glow Gradients in Background */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-full bg-gradient-to-b from-primary/10 via-indigo-600/5 to-transparent blur-3xl opacity-70" />
            <div className="absolute top-1/3 -left-40 h-[400px] w-[600px] rounded-full bg-violet-600/5 blur-3xl" />
            <div className="absolute top-2/3 -right-40 h-[400px] w-[600px] rounded-full bg-blue-600/5 blur-3xl" />
          </div>

          <Suspense fallback={<div className="h-16 border-b border-border/50 bg-background/85" />}>
            <TopNav />
          </Suspense>

          <main className="flex-1 pb-16">
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
  );
}
