import React from "react";
import { Web3Provider } from "@/components/providers/web3-provider";
import { MultiWalletProvider } from "@/web3";
import { WalletProvider } from "@/contexts/wallet-context";
import { ModalProvider } from "@/contexts/modal-context";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized application-level provider composition.
 * Ensures singletons for Web3, TanStack Query, MultiWallet State, Global Modals,
 * and Smooth Scrolling without duplicate instances or circular dependencies.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SmoothScrollProvider>
      <Web3Provider>
        <MultiWalletProvider>
          <WalletProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </WalletProvider>
        </MultiWalletProvider>
      </Web3Provider>
    </SmoothScrollProvider>
  );
}

export * from "./smooth-scroll-provider";

