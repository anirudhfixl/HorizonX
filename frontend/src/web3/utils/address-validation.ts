import type { BlockchainEcosystem } from '../types/wallet.types';

export const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export const TRON_ADDRESS_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
export const TON_RAW_ADDRESS_REGEX = /^-?[0-9]:[0-9a-fA-F]{64}$/;
export const TON_TESTNET_FRIENDLY_REGEX = /^(0Q|kQ)[0-9a-zA-Z_-]{46}$/;

/**
 * Validates whether an address string is valid for the specified ecosystem.
 */
export function validateAddress(ecosystem: BlockchainEcosystem, address: string | null | undefined): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();

  switch (ecosystem) {
    case 'evm':
      return EVM_ADDRESS_REGEX.test(trimmed);
    case 'solana':
      return SOLANA_ADDRESS_REGEX.test(trimmed);
    case 'tron':
      return TRON_ADDRESS_REGEX.test(trimmed);
    case 'ton':
      return TON_TESTNET_FRIENDLY_REGEX.test(trimmed) || TON_RAW_ADDRESS_REGEX.test(trimmed);
    default:
      return false;
  }
}

/**
 * Formats an address for UI display (e.g. 0x1234...abcd).
 */
export function shortenAddress(address: string | null | undefined, prefixLen = 6, suffixLen = 4): string {
  if (!address) return '';
  const trimmed = address.trim();
  if (trimmed.length <= prefixLen + suffixLen) return trimmed;
  return `${trimmed.slice(0, prefixLen)}...${trimmed.slice(-suffixLen)}`;
}
