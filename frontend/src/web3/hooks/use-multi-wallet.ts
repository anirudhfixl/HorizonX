import { useMemo } from 'react';
import { useEvmWallet } from './use-evm-wallet';
import { useSolanaWallet } from './use-solana-wallet';
import { useTonWallet } from './use-ton-wallet';
import { useTronWallet } from './use-tron-wallet';
import type { MultiWalletState } from '../types/wallet.types';

export function useMultiWallet(): MultiWalletState {
  const evm = useEvmWallet();
  const solana = useSolanaWallet();
  const ton = useTonWallet();
  const tron = useTronWallet();

  const connectedCount = useMemo(() => {
    return [evm.isConnected, solana.isConnected, ton.isConnected, tron.isConnected].filter(Boolean).length;
  }, [evm.isConnected, solana.isConnected, ton.isConnected, tron.isConnected]);

  return {
    evm,
    solana,
    ton,
    tron,
    connectedCount,
    totalEcosystems: 4,
  };
}
