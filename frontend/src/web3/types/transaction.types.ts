import type { BlockchainEcosystem } from './wallet.types';

export type TransactionDirection = 'incoming' | 'outgoing' | 'self';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'reverted';

export interface TransactionRecord {
  hash: string;
  ecosystem: BlockchainEcosystem;
  direction: TransactionDirection;
  assetSymbol: string;
  amount: string;
  sender: string;
  recipient: string;
  timestamp: number; // millisecond epoch
  status: TransactionStatus;
  networkName: string;
  explorerUrl: string;
  fee?: string;
  blockNumber?: number;
}

export interface SendTransactionParams {
  recipient: string;
  amount: string;
  tokenAddress?: string; // empty/undefined for native asset
  assetSymbol: string;
}

export interface SendTransactionResult {
  hash: string;
  explorerUrl: string;
  status: TransactionStatus;
}
