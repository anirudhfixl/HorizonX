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
  const anyWin = window as unknown as { phantom?: { solana?: PhantomWindowProvider }; solana?: PhantomWindowProvider };
  const provider = anyWin?.phantom?.solana || anyWin?.solana;
  if (provider && provider.isPhantom) return provider;
  return provider || null;
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

  // Handle Phantom event listeners and session restoration
  useEffect(() => {
    const phantom = getPhantom();
    if (!phantom) return;

    const handleConnect = (...args: unknown[]) => {
      const pubKey = args[0] as { toString?: () => string } | undefined;
      const addr = pubKey && typeof pubKey.toString === 'function' ? pubKey.toString() : phantom.publicKey?.toString() || null;
      if (addr) {
        setAddress(addr);
        try {
          localStorage.setItem(SOLANA_LOCAL_STORAGE_KEY, 'true');
        } catch {
          // ignore
        }
      }
    };

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

    const handleAccountChanged = (...args: unknown[]) => {
      const pubKey = args[0];
      if (pubKey && typeof (pubKey as { toString?: () => string }).toString === 'function') {
        handleConnect(pubKey);
      } else {
        handleDisconnect();
      }
    };

    phantom.on('connect', handleConnect);
    phantom.on('disconnect', handleDisconnect);
    phantom.on('accountChanged', handleAccountChanged);

    // Eager reconnect if previously connected
    const wasConnected = typeof localStorage !== 'undefined' && localStorage.getItem(SOLANA_LOCAL_STORAGE_KEY) === 'true';
    if (wasConnected && phantom.publicKey) {
      setAddress(phantom.publicKey.toString());
    } else if (wasConnected) {
      phantom.connect({ onlyIfTrusted: true }).then((res) => handleConnect(res?.publicKey)).catch(() => {});
    }

    return () => {
      phantom.off('connect', handleConnect);
      phantom.off('disconnect', handleDisconnect);
      phantom.off('accountChanged', handleAccountChanged);
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

      const res = await phantom.connect();
      const addr = res.publicKey.toString();
      setAddress(addr);
      try {
        localStorage.setItem(SOLANA_LOCAL_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Phantom connection rejected';
      if (!/reject|cancel|denied/i.test(msg)) {
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
      if (phantom) {
        await phantom.disconnect();
      }
      setAddress(null);
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      try {
        localStorage.removeItem(SOLANA_LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Solana disconnect failed';
      setError(msg);
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
