import { TON_TESTNET_CONFIG } from '../../config/networks';
import { validateAddress } from '../../utils/address-validation';
import { formatUnits } from '../../utils/formatters';
import type { TransactionRecord } from '../../types/transaction.types';

const TON_API_BASE = TON_TESTNET_CONFIG.rpcUrls[0];

const submittedTonTxStore: TransactionRecord[] = [];

export function recordSubmittedTonTransaction(tx: TransactionRecord): void {
  if (tx.ecosystem !== 'ton') return;
  const existing = submittedTonTxStore.findIndex((item) => item.hash === tx.hash);
  if (existing >= 0) {
    submittedTonTxStore[existing] = tx;
  } else {
    submittedTonTxStore.unshift(tx);
  }
}

export async function fetchTonTransactionHistory(address: string): Promise<TransactionRecord[]> {
  if (!validateAddress('ton', address)) return [];

  const sessionTxs = submittedTonTxStore.filter(
    (tx) => tx.sender === address || tx.recipient === address
  );

  try {
    const url = `${TON_API_BASE}/getTransactions?address=${encodeURIComponent(address)}&limit=15`;
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (response.ok) {
      const json = await response.json();
      if (json.ok && Array.isArray(json.result)) {
        const fetchedTxs: TransactionRecord[] = json.result.map((item: Record<string, unknown>) => {
          const txId = (item.transaction_id as { hash?: string })?.hash || '';
          const inMsg = item.in_msg as { source?: string; destination?: string; value?: string } | undefined;
          const outMsgs = (item.out_msgs as Array<{ destination?: string; value?: string }>) || [];

          let direction: 'incoming' | 'outgoing' = 'incoming';
          let amountNano = 0n;
          let counterparty = 'Multiple';

          if (inMsg && inMsg.value && BigInt(inMsg.value) > 0n) {
            direction = 'incoming';
            amountNano = BigInt(inMsg.value);
            counterparty = inMsg.source || 'External';
          } else if (outMsgs.length > 0 && outMsgs[0]?.value) {
            direction = 'outgoing';
            amountNano = BigInt(outMsgs[0].value);
            counterparty = outMsgs[0].destination || 'External';
          }

          const utime = typeof item.utime === 'number' ? item.utime * 1000 : Date.now();

          return {
            hash: txId,
            ecosystem: 'ton',
            direction,
            assetSymbol: 'TON',
            amount: formatUnits(amountNano, 9, 4),
            sender: direction === 'incoming' ? counterparty : address,
            recipient: direction === 'outgoing' ? counterparty : address,
            timestamp: utime,
            status: 'confirmed',
            networkName: TON_TESTNET_CONFIG.networkName,
            explorerUrl: TON_TESTNET_CONFIG.explorerTxUrl(txId),
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
    // Return session records on fetch failure
  }

  return sessionTxs;
}
