import React from 'react';
import { EvmWalletProvider } from './evm/evm-provider';
import { SolanaWalletProvider } from './solana/solana-provider';
import { TonWalletProvider } from './ton/ton-provider';
import { TronWalletProvider } from './tron/tron-provider';

/**
 * MultiWalletProvider mounts four isolated wallet contexts:
 * - Ethereum Sepolia (MetaMask)
 * - Solana Devnet (Phantom)
 * - TON Testnet (Tonkeeper)
 * - TRON Shasta (TronLink)
 * 
 * Isolation guarantees:
 * 1. Each network initializes independently.
 * 2. Connecting one wallet does NOT connect another.
 * 3. Disconnecting one wallet does NOT disconnect another.
 * 4. Switching one network does NOT affect another.
 * 5. All four wallets can coexist simultaneously with independent address and balance states.
 */
export function MultiWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <EvmWalletProvider>
      <SolanaWalletProvider>
        <TonWalletProvider>
          <TronWalletProvider>
            {children}
          </TronWalletProvider>
        </TonWalletProvider>
      </SolanaWalletProvider>
    </EvmWalletProvider>
  );
}
