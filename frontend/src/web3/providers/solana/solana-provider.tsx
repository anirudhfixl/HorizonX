import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { SOLANA_CONFIG } from '../../config/solana.config';
import { SOLANA_DEVNET_CONFIG } from '../../config/networks';
import { fetchSolanaNativeBalance, fetchSolanaTokenHoldings } from '../../services/balances/solana-balance';
import { shortenAddress } from '../../utils/address-validation';
import type { EcosystemWalletState, TokenHolding, WalletConnectionStatus } from '../../types/wallet.types';

const SolanaWalletContext = createContext<EcosystemWalletState | undefined>(undefined);

interface PhantomWindowProvider {
  isPhantom?: boolean;
  publicKey?: { toBase58: () => string; toString: () => string };
  connect: (args?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
}

function getPhantom(): PhantomWindowProvider | null {
  if (typeof window === 'undefined') return null;
  const anyWin = window as unknown as {
    phantom?: { solana?: PhantomWindowProvider & { isPhantom?: boolean } };
    solana?: PhantomWindowProvider & { isPhantom?: boolean };
  };

  // 1. Dedicated Phantom Solana namespace — strictly requiring isPhantom === true
  if (anyWin?.phantom?.solana && anyWin.phantom.solana.isPhantom === true) {
    return anyWin.phantom.solana;
  }

  // 2. Standard window.solana ONLY if isPhantom is explicitly true
  // (Prevents accidentally resolving MetaMask, Brave, or any other injected EVM/Solana provider)
  if (anyWin?.solana && anyWin.solana.isPhantom === true) {
    return anyWin.solana;
  }

  return null;
}

const SOLANA_LOCAL_STORAGE_KEY = 'horizonx_solana_connected';

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [nativeBalance, setNativeBalance] = useState<string>('0.0000');
  const [nativeBalanceRaw, setNativeBalanceRaw] = useState<bigint | null>(null);
  const [tokens, setTokens] = useState<TokenHolding[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = address !== null;

  const refreshBalance = useCallback(async () => {
    if (!address) {
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      return;
    }

    try {
      const { balanceFormatted, balanceRaw } = await fetchSolanaNativeBalance(address);
      setNativeBalance(balanceFormatted);
      setNativeBalanceRaw(balanceRaw);

      setIsLoadingTokens(true);
      const holdings = await fetchSolanaTokenHoldings(address);
      setTokens(holdings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve Solana Devnet balance';
      setError(msg);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [address]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // Event listeners for disconnect and account change while connected
  // Strictly no auto-connect on application load; explicit user action required.
  useEffect(() => {
    const phantom = getPhantom();
    if (!phantom) return;

    const handleDisconnect = () => {
      setAddress(null);
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      try {
        localStorage.removeItem(SOLANA_LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    };

    const handleAccountChanged = (pubKey: unknown) => {
      if (pubKey && typeof (pubKey as { toString?: () => string }).toString === 'function') {
        const addr = (pubKey as { toString: () => string }).toString();
        // Update only if already actively connected by the user
        setAddress((current) => (current ? addr : null));
      } else {
        handleDisconnect();
      }
    };

    phantom.on?.('disconnect', handleDisconnect);
    phantom.on?.('accountChanged', handleAccountChanged);

    return () => {
      phantom.off?.('disconnect', handleDisconnect);
      phantom.off?.('accountChanged', handleAccountChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const phantom = getPhantom();
      if (!phantom) {
        throw new Error('Phantom wallet extension is not installed in this browser.');
      }

      // Explicit user-initiated connection request: onlyIfTrusted: false
      const res = await phantom.connect({ onlyIfTrusted: false });
      if (!res?.publicKey) {
        throw new Error('No public key returned by Phantom');
      }
      const addr = res.publicKey.toString();
      setAddress(addr);
      try {
        localStorage.setItem(SOLANA_LOCAL_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Phantom connection rejected';
      if (!/reject|cancel|denied|user closed/i.test(msg)) {
        setError(msg);
      }
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setError(null);
    try {
      const phantom = getPhantom();
      if (phantom && typeof phantom.disconnect === 'function') {
        await phantom.disconnect();
      }
    } catch (err: unknown) {
      console.warn('Phantom disconnect notice:', err);
    } finally {
      setAddress(null);
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      try {
        localStorage.removeItem(SOLANA_LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const status: WalletConnectionStatus = isConnecting
    ? 'connecting'
    : isConnected
    ? 'connected'
    : 'disconnected';

  const value: EcosystemWalletState = useMemo(
    () => ({
      ecosystem: 'solana',
      status,
      isConnected,
      isConnecting,
      isUnsupportedNetwork: false,
      address,
      shortAddress: address ? shortenAddress(address) : null,
      walletName: SOLANA_CONFIG.preferredWallet,
      chainId: SOLANA_DEVNET_CONFIG.chainId,
      networkName: SOLANA_DEVNET_CONFIG.networkName,
      isTestnet: true,
      nativeBalance,
      nativeBalanceRaw,
      nativeSymbol: 'SOL',
      tokens,
      isLoadingTokens,
      error,
      connect,
      disconnect,
      clearError: () => setError(null),
      refreshBalance,
    }),
    [
      status,
      isConnected,
      isConnecting,
      address,
      nativeBalance,
      nativeBalanceRaw,
      tokens,
      isLoadingTokens,
      error,
      connect,
      disconnect,
      refreshBalance,
    ]
  );

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>;
}

export function useSolanaWallet(): EcosystemWalletState {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
}
