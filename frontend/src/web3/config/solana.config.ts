import { SOLANA_DEVNET_CONFIG } from './networks';
import type { SupportedTokenConfig } from './evm.config';

export const SOLANA_DEVNET_GENESIS_HASH = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';

/**
 * Standard testnet SPL tokens on Solana Devnet.
 */
export const SOLANA_DEVNET_SUPPORTED_TOKENS: SupportedTokenConfig[] = [
  {
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    symbol: 'USDC-Dev',
    name: 'USD Coin Devnet',
    decimals: 6,
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'wSOL',
    name: 'Wrapped SOL',
    decimals: 9,
  },
];

export const SOLANA_CONFIG = {
  network: SOLANA_DEVNET_CONFIG,
  genesisHash: SOLANA_DEVNET_GENESIS_HASH,
  rpcEndpoint: SOLANA_DEVNET_CONFIG.rpcUrls[0],
  supportedTokens: SOLANA_DEVNET_SUPPORTED_TOKENS,
  preferredWallet: 'Phantom',
};
