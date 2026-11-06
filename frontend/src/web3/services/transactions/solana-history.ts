import { SOLANA_DEVNET_CONFIG } from '../../config/networks';
import { validateAddress } from '../../utils/address-validation';
import type { TransactionRecord } from '../../types/transaction.types';

const SOLANA_RPC_URL = SOLANA_DEVNET_CONFIG.rpcUrls[0];

const submittedSolanaTxStore: TransactionRecord[] = [];

export function recordSubmittedSolanaTransaction(tx: TransactionRecord): void {
  if (tx.ecosystem !== 'solana') return;
  const existing = submittedSolanaTxStore.findIndex((item) => item.hash === tx.hash);
  if (existing >= 0) {
    submittedSolanaTxStore[existing] = tx;
  } else {
    submittedSolanaTxStore.unshift(tx);
  }
}

interface SolanaSignatureEntry {
  signature: string;
  slot: number;
  err: unknown | null;
  memo: string | null;
  blockTime: number | null;
  confirmationStatus: string;
}

export async function fetchSolanaTransactionHistory(address: string): Promise<TransactionRecord[]> {
  if (!validateAddress('solana', address)) return [];

  const sessionTxs = submittedSolanaTxStore.filter(
    (tx) => tx.sender === address || tx.recipient === address
  );

  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'getSignaturesForAddress',
        params: [
          address,
          { limit: 15, commitment: 'confirmed' },
        ],
      }),
    });

    if (response.ok) {
      const json = await response.json();
      const entries = json?.result as SolanaSignatureEntry[];

      if (Array.isArray(entries)) {
        const fetchedTxs: TransactionRecord[] = entries.map((entry) => {
          const isSuccess = entry.err === null;
          const timestamp = entry.blockTime ? entry.blockTime * 1000 : Date.now();

          return {
            hash: entry.signature,
            ecosystem: 'solana',
            direction: 'outgoing', // Default unless detailed instruction parsed
            assetSymbol: 'SOL',
            amount: '—',
            sender: address,
            recipient: 'Multiple / Program',
            timestamp,
            status: isSuccess ? 'confirmed' : 'failed',
            networkName: SOLANA_DEVNET_CONFIG.networkName,
            explorerUrl: SOLANA_DEVNET_CONFIG.explorerTxUrl(entry.signature),
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
    // Return session records on RPC error
  }

  return sessionTxs;
}
