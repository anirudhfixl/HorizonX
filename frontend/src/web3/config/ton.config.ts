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

/**
 * Official TON Connect Wallet Registry metadata for Gram Wallet.
 * Verified against official TON Connect registry:
 * https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json
 */
export const GRAM_WALLET_REGISTRY = {
  appName: 'gramwallet',
  name: 'Gram Wallet',
  image: 'https://static.gramwallet.io/gramwallet/icon-288.png',
  aboutUrl: 'https://gramwallet.io/?utm_source=tc',
  universalUrl: 'https://connect.gramwallet.io',
  deepLink: 'gramwallet-tc://',
  jsBridgeKey: 'gramwallet',
  platforms: ['ios', 'android', 'chrome'],
  features: [
    { name: 'SendTransaction', maxMessages: 255, extraCurrencySupported: false },
    { name: 'SignData', types: ['text', 'binary', 'cell'] },
  ],
};

export const TON_CONFIG = {
  network: TON_TESTNET_CONFIG,
  chainId: TON_TESTNET_CHAIN_ID,
  apiEndpoint: TON_TESTNET_CONFIG.rpcUrls[0],
  manifestUrl:
    typeof window !== 'undefined'
      ? `${window.location.origin}/tonconnect-manifest.json`
      : 'https://localhost/tonconnect-manifest.json',
  preferredWallet: 'Gram Wallet',
  registry: GRAM_WALLET_REGISTRY,
  supportedTokens: TON_SUPPORTED_TOKENS,
};
