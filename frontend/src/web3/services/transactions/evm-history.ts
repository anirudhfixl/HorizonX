import { EVM_SEPOLIA_CONFIG } from '../../config/networks';
import { validateAddress } from '../../utils/address-validation';
import type { TransactionRecord } from '../../types/transaction.types';

// In-memory session transaction store for recently submitted Sepolia transactions
const submittedEvmTxStore: TransactionRecord[] = [];

export function recordSubmittedEvmTransaction(tx: TransactionRecord): void {
  if (tx.ecosystem !== 'evm') return;
  const existing = submittedEvmTxStore.findIndex((item) => item.hash === tx.hash);
  if (existing >= 0) {
    submittedEvmTxStore[existing] = tx;
  } else {
    submittedEvmTxStore.unshift(tx);
  }
}

export async function fetchEvmTransactionHistory(address: string): Promise<TransactionRecord[]> {
  if (!validateAddress('evm', address)) return [];

  const lowerAddr = address.toLowerCase();
  const sessionTxs = submittedEvmTxStore.filter(
    (tx) => tx.sender.toLowerCase() === lowerAddr || tx.recipient.toLowerCase() === lowerAddr
  );

  try {
    // Query Sepolia testnet explorer API if available
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=15&sort=desc`;
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data?.result)) {
        const fetchedTxs: TransactionRecord[] = data.result.map((item: Record<string, string>) => {
          const from = item.from || '';
          const to = item.to || '';
          const isSender = from.toLowerCase() === lowerAddr;
          const isRecipient = to.toLowerCase() === lowerAddr;
          const direction = isSender && isRecipient ? 'self' : isSender ? 'outgoing' : 'incoming';
          const valWei = BigInt(item.value || '0');
          const amountEth = (Number(valWei) / 1e18).toFixed(4);
          const isSuccess = item.isError === '0';

          return {
            hash: item.hash,
            ecosystem: 'evm',
            direction,
            assetSymbol: 'ETH',
            amount: amountEth,
            sender: from,
            recipient: to,
            timestamp: parseInt(item.timeStamp || '0', 10) * 1000 || Date.now(),
            status: isSuccess ? 'confirmed' : 'failed',
            networkName: EVM_SEPOLIA_CONFIG.networkName,
            explorerUrl: EVM_SEPOLIA_CONFIG.explorerTxUrl(item.hash),
            blockNumber: parseInt(item.blockNumber || '0', 10),
          };
        });

        // Merge session txs with fetched txs, de-duplicating by hash
        const seenHashes = new Set<string>();
        const merged: TransactionRecord[] = [];

        for (const tx of [...sessionTxs, ...fetchedTxs]) {
          if (!seenHashes.has(tx.hash.toLowerCase())) {
            seenHashes.add(tx.hash.toLowerCase());
            merged.push(tx);
          }
        }

        return merged;
      }
    }
  } catch {
    // If the public explorer API is rate-limited or unavailable, fall back to session transactions
  }

  return sessionTxs;
}
