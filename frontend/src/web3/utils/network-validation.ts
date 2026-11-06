import {
  PROHIBITED_MAINNET_IDENTIFIERS,
  SUPPORTED_TESTNETS,
  type TestnetNetworkConfig,
} from '../config/networks';
import type { BlockchainEcosystem } from '../types/wallet.types';

export class NetworkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkValidationError';
  }
}

/**
 * Validates that an ecosystem chain identifier matches its approved testnet.
 * Throws NetworkValidationError if the network is prohibited or unsupported.
 */
export function validateTestnetNetwork(
  ecosystem: BlockchainEcosystem,
  chainId: number | string | null | undefined
): TestnetNetworkConfig {
  if (chainId === null || chainId === undefined) {
    throw new NetworkValidationError(`No network chain ID detected for ${ecosystem.toUpperCase()}. Please check wallet connection.`);
  }

  // Check for prohibited mainnet identifiers
  if (PROHIBITED_MAINNET_IDENTIFIERS.has(chainId) || PROHIBITED_MAINNET_IDENTIFIERS.has(String(chainId).toLowerCase())) {
    throw new NetworkValidationError(
      `CRITICAL ERROR: Mainnet connection detected (${chainId}). HorizonX is strictly restricted to testnet environments. Transaction aborted.`
    );
  }

  const expected = SUPPORTED_TESTNETS[ecosystem];
  const expectedChainId = String(expected.chainId).toLowerCase();
  const actualChainId = String(chainId).toLowerCase();

  if (actualChainId !== expectedChainId) {
    throw new NetworkValidationError(
      `Network mismatch for ${ecosystem.toUpperCase()}: Connected to '${chainId}', but expected '${expected.networkName}' (${expected.chainId}).`
    );
  }

  return expected;
}

/**
 * Checks whether an ecosystem and chain ID are valid testnet without throwing.
 */
export function isTestnetNetworkValid(
  ecosystem: BlockchainEcosystem,
  chainId: number | string | null | undefined
): boolean {
  try {
    validateTestnetNetwork(ecosystem, chainId);
    return true;
  } catch {
    return false;
  }
}

