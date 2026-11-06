import { SOLANA_DEVNET_CONFIG } from '../../config/networks';
import { SOLANA_DEVNET_SUPPORTED_TOKENS } from '../../config/solana.config';
import type { TokenHolding } from '../../types/wallet.types';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';

const SOLANA_RPC_URL = SOLANA_DEVNET_CONFIG.rpcUrls[0];

async function solanaRpcCall(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC error: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(`Solana RPC error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  return json.result;
}

export async function fetchSolanaNativeBalance(address: string): Promise<{ balanceFormatted: string; balanceRaw: bigint }> {
  if (!validateAddress('solana', address)) {
    throw new Error(`Invalid Solana address: ${address}`);
  }

  const result = (await solanaRpcCall('getBalance', [
    address,
    { commitment: 'confirmed' },
  ])) as { value: number };

  const lamports = BigInt(result?.value ?? 0);
  return {
    balanceFormatted: formatUnits(lamports, 9, 4),
    balanceRaw: lamports,
  };
}

interface SolanaTokenAccountItem {
  account: {
    data: {
      parsed: {
        info: {
          mint: string;
          tokenAmount: {
            amount: string;
            decimals: number;
            uiAmountString?: string;
          };
        };
      };
    };
  };
}

export async function fetchSolanaTokenHoldings(address: string): Promise<TokenHolding[]> {
  if (!validateAddress('solana', address)) {
    return [];
  }

  const holdings: TokenHolding[] = [];

  try {
    const result = (await solanaRpcCall('getTokenAccountsByOwner', [
      address,
      { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
      { encoding: 'jsonParsed', commitment: 'confirmed' },
    ])) as { value: SolanaTokenAccountItem[] };

    const accounts = result?.value || [];
    const balancesByMint = new Map<string, { amount: string; decimals: number }>();

    for (const acc of accounts) {
      const info = acc?.account?.data?.parsed?.info;
      if (info?.mint && info?.tokenAmount) {
        balancesByMint.set(info.mint, {
          amount: info.tokenAmount.amount,
          decimals: info.tokenAmount.decimals,
        });
      }
    }

    for (const supported of SOLANA_DEVNET_SUPPORTED_TOKENS) {
      const found = balancesByMint.get(supported.address);
      if (found) {
        const raw = BigInt(found.amount || '0');
        holdings.push({
          address: supported.address,
          symbol: supported.symbol,
          name: supported.name,
          decimals: supported.decimals,
          balance: formatUnits(raw, supported.decimals, 4),
          balanceRaw: raw,
          logoUrl: supported.logoUrl,
          ecosystem: 'solana',
        });
      } else {
        holdings.push({
          address: supported.address,
          symbol: supported.symbol,
          name: supported.name,
          decimals: supported.decimals,
          balance: '0.0000',
          balanceRaw: 0n,
          logoUrl: supported.logoUrl,
          ecosystem: 'solana',
        });
      }
    }
  } catch {
    // Fall back to default 0 balances for supported tokens
    for (const supported of SOLANA_DEVNET_SUPPORTED_TOKENS) {
      holdings.push({
        address: supported.address,
        symbol: supported.symbol,
        name: supported.name,
        decimals: supported.decimals,
        balance: '0.0000',
        balanceRaw: 0n,
        logoUrl: supported.logoUrl,
        ecosystem: 'solana',
      });
    }
  }

  return holdings;
}
