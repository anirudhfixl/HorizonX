import React from "react";
import { Web3Provider } from "@/components/providers/web3-provider";
import { MultiWalletProvider } from "@/web3";
import { WalletProvider } from "@/contexts/wallet-context";
import { ModalProvider } from "@/contexts/modal-context";

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized application-level provider composition.
 * Ensures singletons for Web3, TanStack Query, MultiWallet State, and Global Modals
 * without duplicate instances or circular dependencies.
 * Lenis smooth scrolling has been removed to restore native, immediate browser scrolling.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Web3Provider>
      <MultiWalletProvider>
        <WalletProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </WalletProvider>
      </MultiWalletProvider>
    </Web3Provider>
  );
}

export * from "./smooth-scroll-provider";
