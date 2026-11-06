import { TON_TESTNET_CONFIG } from './networks';
import type { SupportedTokenConfig } from './evm.config';

export const TON_TESTNET_CHAIN_ID = -3;

export const TON_SUPPORTED_TOKENS: SupportedTokenConfig[] = [
  {
    address: 'kQA7q-154_mD9Hn73_K_839h3892_example_jetton',
    symbol: 'TEST-JETTON',
    name: 'Sample Testnet Jetton',
    decimals: 9,
  },
];

export const TON_CONFIG = {
  network: TON_TESTNET_CONFIG,
  chainId: TON_TESTNET_CHAIN_ID,
  apiEndpoint: TON_TESTNET_CONFIG.rpcUrls[0],
  manifestUrl: typeof window !== 'undefined'
    ? `${window.location.origin}/tonconnect-manifest.json`
    : 'https://localhost/tonconnect-manifest.json',
  preferredWallet: 'Tonkeeper',
  supportedTokens: TON_SUPPORTED_TOKENS,
};
