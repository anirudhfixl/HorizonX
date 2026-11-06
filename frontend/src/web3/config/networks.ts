/**
 * STRICT TESTNET-ONLY CONFIGURATION FOR HORIZONX
 * 
 * MAINNET SUPPORT IS STRICTLY PROHIBITED.
 * Any request targeting mainnet or unsupported networks will be explicitly rejected.
 */

export interface TestnetNetworkConfig {
  ecosystem: 'evm' | 'solana' | 'ton' | 'tron';
  networkId: string;
  networkName: string;
  shortName: string;
  chainId: number | string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  explorerUrl: string;
  explorerTxUrl: (hash: string) => string;
  explorerAddressUrl: (address: string) => string;
}

export const EVM_SEPOLIA_CONFIG: TestnetNetworkConfig = {
  ecosystem: 'evm',
  networkId: 'sepolia',
  networkName: 'Ethereum Sepolia Testnet',
  shortName: 'Sepolia',
  chainId: 11155111,
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SEPOLIA_RPC_URL) || 'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc.sepolia.org',
  ],
  explorerUrl: 'https://sepolia.etherscan.io',
  explorerTxUrl: (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`,
  explorerAddressUrl: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
};

export const SOLANA_DEVNET_CONFIG: TestnetNetworkConfig = {
  ecosystem: 'solana',
  networkId: 'devnet',
  networkName: 'Solana Devnet',
  shortName: 'Devnet',
  chainId: 'devnet',
  nativeCurrency: {
    name: 'Solana Devnet SOL',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: [
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com',
  ],
  explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
  explorerTxUrl: (hash: string) => `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
  explorerAddressUrl: (address: string) => `https://explorer.solana.com/address/${address}?cluster=devnet`,
};

export const TON_TESTNET_CONFIG: TestnetNetworkConfig = {
  ecosystem: 'ton',
  networkId: 'testnet',
  networkName: 'TON Testnet',
  shortName: 'TON Testnet',
  chainId: -3,
  nativeCurrency: {
    name: 'Testnet TON',
    symbol: 'TON',
    decimals: 9,
  },
  rpcUrls: [
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TON_TESTNET_API_URL) || 'https://testnet.toncenter.com/api/v2',
  ],
  explorerUrl: 'https://testnet.tonscan.org',
  explorerTxUrl: (hash: string) => `https://testnet.tonviewer.com/transaction/${hash}`,
  explorerAddressUrl: (address: string) => `https://testnet.tonscan.org/address/${address}`,
};

export const TRON_SHASTA_CONFIG: TestnetNetworkConfig = {
  ecosystem: 'tron',
  networkId: 'shasta',
  networkName: 'TRON Shasta Testnet',
  shortName: 'Shasta',
  chainId: '0x94a9059e',
  nativeCurrency: {
    name: 'Shasta TRX',
    symbol: 'TRX',
    decimals: 6,
  },
  rpcUrls: [
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TRON_SHASTA_API_URL) || 'https://api.shasta.trongrid.io',
  ],
  explorerUrl: 'https://shasta.tronscan.org',
  explorerTxUrl: (hash: string) => `https://shasta.tronscan.org/#/transaction/${hash}`,
  explorerAddressUrl: (address: string) => `https://shasta.tronscan.org/#/address/${address}`,
};

export const SUPPORTED_TESTNETS = {
  evm: EVM_SEPOLIA_CONFIG,
  solana: SOLANA_DEVNET_CONFIG,
  ton: TON_TESTNET_CONFIG,
  tron: TRON_SHASTA_CONFIG,
} as const;

/**
 * List of strictly prohibited mainnet identifiers.
 * Attempting to configure or connect to these will trigger instant rejection.
 */
export const PROHIBITED_MAINNET_IDENTIFIERS = new Set<string | number>([
  1, // Ethereum Mainnet
  '1',
  'mainnet',
  'solana-mainnet',
  'mainnet-beta',
  'https://api.mainnet-beta.solana.com',
  'ton-mainnet',
  '-239', // TON Mainnet global ID
  '0x2b6653dc', // TRON Mainnet chain ID
  'tron-mainnet',
]);

