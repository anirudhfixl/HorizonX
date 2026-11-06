import { TRON_SHASTA_CONFIG } from '../../config/networks';
import { TRON_SUPPORTED_TOKENS } from '../../config/tron.config';
import type { TokenHolding } from '../../types/wallet.types';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';

const TRON_API_BASE = TRON_SHASTA_CONFIG.rpcUrls[0];

export async function fetchTronNativeBalance(address: string): Promise<{ balanceFormatted: string; balanceRaw: bigint }> {
  if (!validateAddress('tron', address)) {
    throw new Error(`Invalid TRON address: ${address}`);
  }

  const url = `${TRON_API_BASE}/wallet/getaccount`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ address, visible: true }),
  });

  if (!response.ok) {
    throw new Error(`TRON Shasta API error: HTTP ${response.status}`);
  }

  const json = await response.json();
  const sunRaw = BigInt(json?.balance ?? 0);

  return {
    balanceFormatted: formatUnits(sunRaw, 6, 4),
    balanceRaw: sunRaw,
  };
}

export async function fetchTronTokenHoldings(address: string): Promise<TokenHolding[]> {
  if (!validateAddress('tron', address)) {
    return [];
  }

  const holdings: TokenHolding[] = [];

  for (const token of TRON_SUPPORTED_TOKENS) {
    try {
      // Query TRC-20 balanceOf using triggerconstantcontract
      const url = `${TRON_API_BASE}/wallet/triggerconstantcontract`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          owner_address: address,
          contract_address: token.address,
          function_selector: 'balanceOf(address)',
          parameter: address, // TronWeb accepts base58 or hex
          visible: true,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const hexVal = json?.constant_result?.[0];
        const raw = hexVal ? BigInt(`0x${hexVal}`) : 0n;
        holdings.push({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          balance: formatUnits(raw, token.decimals, 4),
          balanceRaw: raw,
          logoUrl: token.logoUrl,
          ecosystem: 'tron',
        });
        continue;
      }
    } catch {
      // fall through to default 0
    }

    holdings.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: '0.0000',
      balanceRaw: 0n,
      logoUrl: token.logoUrl,
      ecosystem: 'tron',
    });
  }

  return holdings;
}

