import { TRON_SHASTA_CONFIG } from '../../config/networks';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';
import type { TransactionRecord } from '../../types/transaction.types';

const TRON_API_BASE = TRON_SHASTA_CONFIG.rpcUrls[0];

const submittedTronTxStore: TransactionRecord[] = [];

export function recordSubmittedTronTransaction(tx: TransactionRecord): void {
  if (tx.ecosystem !== 'tron') return;
  const existing = submittedTronTxStore.findIndex((item) => item.hash === tx.hash);
  if (existing >= 0) {
    submittedTronTxStore[existing] = tx;
  } else {
    submittedTronTxStore.unshift(tx);
  }
}

export async function fetchTronTransactionHistory(address: string): Promise<TransactionRecord[]> {
  if (!validateAddress('tron', address)) return [];

  const sessionTxs = submittedTronTxStore.filter(
    (tx) => tx.sender === address || tx.recipient === address
  );

  try {
    const url = `${TRON_API_BASE}/v1/accounts/${encodeURIComponent(address)}/transactions?limit=15`;
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json?.data)) {
        const fetchedTxs: TransactionRecord[] = json.data.map((item: Record<string, unknown>) => {
          const txID = (item.txID as string) || '';
          const rawData = item.raw_data as { contract?: Array<{ parameter?: { value?: { owner_address?: string; to_address?: string; amount?: number } } }>; timestamp?: number };
          const contractVal = rawData?.contract?.[0]?.parameter?.value;

          const owner = contractVal?.owner_address || address;
          const to = contractVal?.to_address || 'Contract';
          const amountSun = BigInt(contractVal?.amount ?? 0);
          const timestamp = rawData?.timestamp || Date.now();
          const ret = (item.ret as Array<{ contractRet?: string }>) || [];
          const isSuccess = ret[0]?.contractRet === 'SUCCESS';

          return {
            hash: txID,
            ecosystem: 'tron',
            direction: owner === address ? 'outgoing' : 'incoming',
            assetSymbol: 'TRX',
            amount: formatUnits(amountSun, 6, 4),
            sender: owner,
            recipient: to,
            timestamp,
            status: isSuccess ? 'confirmed' : 'failed',
            networkName: TRON_SHASTA_CONFIG.networkName,
            explorerUrl: TRON_SHASTA_CONFIG.explorerTxUrl(txID),
          };
        });

        const seenHashes = new Set<string>();
        const merged: TransactionRecord[] = [];

        for (const tx of [...sessionTxs, ...fetchedTxs]) {
          if (!seenHashes.has(tx.hash)) {
            seenHashes.add(tx.hash);
            merged.push(tx);
          }
        }

        return merged;
      }
    }
  } catch {
    // Return session records on error
  }

  return sessionTxs;
}
