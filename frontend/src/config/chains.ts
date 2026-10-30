import { sepolia } from "viem/chains";
import type { Chain } from "viem";

export interface NetworkConfig {
  id: string;
  name: string;
  chainId: number;
  symbol: string;
  icon: string;
  isTestnet: boolean;
  explorerUrl: string;
  rpcUrl?: string;
}

/**
 * Milestone 1-B: Architecture Decision D-04
 * Initial network scope is STRICTLY Ethereum Sepolia Testnet (Chain ID: 11155111).
 * Future networks can be appended to ACTIVE_CHAINS without redesigning wallet state.
 */
export const SEPOLIA_CONFIG: NetworkConfig = {
  id: "sepolia",
  name: "Sepolia Testnet",
  chainId: sepolia.id,
  symbol: "ETH",
  icon: "🧪",
  isTestnet: true,
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || undefined,
};

/**
 * Active EVM chains supported by the ProMiners protocol.
 * For Milestone 1-B, this list contains ONLY Sepolia.
 */
export const ACTIVE_CHAINS = [sepolia] as const;

export const DEFAULT_CHAIN = sepolia;

/**
 * Central registry mapping chain IDs to display configurations.
 */
export const NETWORK_REGISTRY: Record<number, NetworkConfig> = {
  [sepolia.id]: SEPOLIA_CONFIG,
};

/**
 * Check whether a given chain ID is currently supported.
 */
export function isSupportedChainId(chainId: number | undefined): boolean {
  if (!chainId) return false;
  return ACTIVE_CHAINS.some((chain: Chain) => chain.id === chainId);
}

/**
 * Retrieve network display metadata by chain ID.
 * Returns an Unsupported Network fallback if not registered.
 */
export function getNetworkConfig(chainId: number | undefined): NetworkConfig {
  if (chainId && NETWORK_REGISTRY[chainId]) {
    return NETWORK_REGISTRY[chainId];
  }

  return {
    id: "unsupported",
    name: chainId ? `Unsupported (${chainId})` : "Unsupported Network",
    chainId: chainId || 0,
    symbol: "ETH",
    icon: "⚠️",
    isTestnet: false,
    explorerUrl: "https://etherscan.io",
  };
}
