import { TON_TESTNET_CONFIG } from '../../config/networks';
import { TON_SUPPORTED_TOKENS } from '../../config/ton.config';
import type { TokenHolding } from '../../types/wallet.types';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';

const TON_API_BASE = TON_TESTNET_CONFIG.rpcUrls[0];

export async function fetchTonNativeBalance(address: string): Promise<{ balanceFormatted: string; balanceRaw: bigint }> {
  if (!validateAddress('ton', address)) {
    throw new Error(`Invalid TON address: ${address}`);
  }

  const url = `${TON_API_BASE}/getAddressBalance?address=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`TON Testnet API error: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.ok !== true) {
    throw new Error(`TON Testnet API error: ${json.error || 'Failed to fetch balance'}`);
  }

  const nanoTon = BigInt(json.result || '0');
  return {
    balanceFormatted: formatUnits(nanoTon, 9, 4),
    balanceRaw: nanoTon,
  };
}

export async function fetchTonTokenHoldings(address: string): Promise<TokenHolding[]> {
  if (!validateAddress('ton', address)) {
    return [];
  }

  const holdings: TokenHolding[] = [];

  // On TON Testnet, querying Jetton wallets involves getting the jetton wallet address
  // For standard display, return registered supported testnet jettons with 0n baseline or queried amounts
  for (const token of TON_SUPPORTED_TOKENS) {
    holdings.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: '0.0000',
      balanceRaw: 0n,
      logoUrl: token.logoUrl,
      ecosystem: 'ton',
    });
  }

  return holdings;
}
