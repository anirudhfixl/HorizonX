import { TRON_SHASTA_CONFIG } from './networks';
import type { SupportedTokenConfig } from './evm.config';

export const TRON_SHASTA_CHAIN_ID = '0x94a9059e';

export const TRON_SUPPORTED_TOKENS: SupportedTokenConfig[] = [
  {
    address: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    symbol: 'USDT-Shasta',
    name: 'Tether USD (Shasta Testnet)',
    decimals: 6,
  },
];

export const TRON_CONFIG = {
  network: TRON_SHASTA_CONFIG,
  chainId: TRON_SHASTA_CHAIN_ID,
  apiEndpoint: TRON_SHASTA_CONFIG.rpcUrls[0],
  preferredWallet: 'TronLink',
  supportedTokens: TRON_SUPPORTED_TOKENS,
};

