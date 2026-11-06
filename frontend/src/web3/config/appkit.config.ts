import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sepolia } from '@reown/appkit/networks';

export const REOWN_PROJECT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_REOWN_PROJECT_ID) ||
  '9e6ab930a025957cc6c238edad0a1e03';

/**
 * Reown AppKit EVM Wagmi Adapter.
 * 
 * STRICT ARCHITECTURAL RESTRICTION:
 * 1. Dedicated to Ethereum Sepolia only (Chain ID 11155111).
 * 2. MAINNET IS STRICTLY PROHIBITED - no mainnet chains are passed.
 * 3. NO SHARED SOLANA ADAPTER - Solana uses dedicated independent Phantom provider.
 *    This completely prevents the Reown provider-collision bugs observed in NEXORA.
 * 4. TON and TRON maintain independent native connections.
 */
export const evmWagmiAdapter = new WagmiAdapter({
  projectId: REOWN_PROJECT_ID,
  networks: [sepolia],
});

let appKitInstance: ReturnType<typeof createAppKit> | null = null;

export function getAppKitInstance() {
  if (typeof window === 'undefined') return null;
  if (!appKitInstance) {
    try {
      appKitInstance = createAppKit({
        adapters: [evmWagmiAdapter],
        networks: [sepolia],
        defaultNetwork: sepolia,
        projectId: REOWN_PROJECT_ID,
        metadata: {
          name: 'HorizonX',
          description: 'HorizonX Multi-Chain Web3 Protocol',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://horizonx.io',
          icons: [
            typeof window !== 'undefined'
              ? `${window.location.origin}/prominers-logo.svg`
              : 'https://horizonx.io/prominers-logo.svg',
          ],
        },
        themeMode: 'dark',
        themeVariables: {
          '--apkt-accent': '#f59e0b', // HorizonX warm gold / amber
          '--apkt-color-mix': '#0a0b0e', // HorizonX warm black card surface
          '--apkt-color-mix-strength': 15,
          '--apkt-border-radius-master': '12px',
          '--apkt-font-family': 'inherit',
          '--apkt-z-index': 1000,
        },
        features: {
          analytics: false,
          email: false,
          socials: false,
          swaps: false,
          onramp: false,
          send: false,
          receive: false,
          history: false,
        },
        enableWalletGuide: false,
      });
    } catch (err) {
      console.warn('Reown AppKit initialization notice:', err);
    }
  }
  return appKitInstance;
}

/**
 * Open the Reown AppKit modal for EVM wallet selection.
 */
export async function openReownAppKit(view: 'Connect' | 'Account' | 'Networks' = 'Connect') {
  const instance = getAppKitInstance();
  if (instance) {
    await instance.open({ view });
  }
}

/**
 * Close the Reown AppKit modal.
 */
export async function closeReownAppKit() {
  const instance = getAppKitInstance();
  if (instance) {
    await instance.close();
  }
}

