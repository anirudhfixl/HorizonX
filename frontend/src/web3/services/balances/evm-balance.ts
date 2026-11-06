import { createPublicClient, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { EVM_SEPOLIA_CONFIG } from '../../config/networks';
import { SEPOLIA_SUPPORTED_TOKENS } from '../../config/evm.config';
import type { TokenHolding } from '../../types/wallet.types';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(EVM_SEPOLIA_CONFIG.rpcUrls[0], { timeout: 15_000 }),
});

/**
 * Standard ERC-20 balanceOf ABI selector.
 * keccak256("balanceOf(address)").slice(0, 10) = 0x70a08231
 */
const BALANCE_OF_SELECTOR = '0x70a08231';

export async function fetchEvmNativeBalance(address: string): Promise<{ balanceFormatted: string; balanceRaw: bigint }> {
  if (!validateAddress('evm', address)) {
    throw new Error(`Invalid EVM address: ${address}`);
  }

  const balanceRaw = await publicClient.getBalance({
    address: address as `0x${string}`,
    blockTag: 'latest',
  });

  return {
    balanceFormatted: formatEther(balanceRaw),
    balanceRaw,
  };
}

export async function fetchEvmTokenHoldings(address: string): Promise<TokenHolding[]> {
  if (!validateAddress('evm', address)) {
    return [];
  }

  const holdings: TokenHolding[] = [];

  for (const token of SEPOLIA_SUPPORTED_TOKENS) {
    try {
      // Encode address param padded to 32 bytes
      const cleanAddr = address.toLowerCase().replace(/^0x/, '').padStart(64, '0');
      const callData = `${BALANCE_OF_SELECTOR}${cleanAddr}` as `0x${string}`;

      const result = await publicClient.call({
        to: token.address as `0x${string}`,
        data: callData,
      });

      let rawBalance = 0n;
      if (result.data && result.data !== '0x') {
        rawBalance = BigInt(result.data);
      }

      holdings.push({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        balance: formatUnits(rawBalance, token.decimals, 4),
        balanceRaw: rawBalance,
        logoUrl: token.logoUrl,
        ecosystem: 'evm',
      });
    } catch {
      // Gracefully handle tokens that fail to query or revert
      holdings.push({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        balance: '0.0000',
        balanceRaw: 0n,
        logoUrl: token.logoUrl,
        ecosystem: 'evm',
      });
    }
  }

  return holdings;
}
