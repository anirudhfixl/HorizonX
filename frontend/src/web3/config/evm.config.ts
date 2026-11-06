import { sepolia } from 'viem/chains';
import { EVM_SEPOLIA_CONFIG } from './networks';

export const SEPOLIA_CHAIN_ID = 11155111;

export interface SupportedTokenConfig {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

/**
 * Standard testnet ERC-20 tokens deployed on Ethereum Sepolia.
 */
export const SEPOLIA_SUPPORTED_TOKENS: SupportedTokenConfig[] = [
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin (Sepolia)',
    decimals: 6,
  },
  {
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    symbol: 'LINK',
    name: 'ChainLink Token (Sepolia)',
    decimals: 18,
  },
  {
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    symbol: 'WETH',
    name: 'Wrapped Ether (Sepolia)',
    decimals: 18,
  },
];

export const EVM_CONFIG = {
  chain: sepolia,
  chainId: SEPOLIA_CHAIN_ID,
  network: EVM_SEPOLIA_CONFIG,
  supportedTokens: SEPOLIA_SUPPORTED_TOKENS,
  preferredWallet: 'MetaMask',
};

