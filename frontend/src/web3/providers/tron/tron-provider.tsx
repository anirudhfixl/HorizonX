import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { TRON_CONFIG, TRON_SHASTA_CHAIN_ID } from '../../config/tron.config';
import { TRON_SHASTA_CONFIG } from '../../config/networks';
import { fetchTronNativeBalance, fetchTronTokenHoldings } from '../../services/balances/tron-balance';
import { shortenAddress } from '../../utils/address-validation';
import type { EcosystemWalletState, TokenHolding, WalletConnectionStatus } from '../../types/wallet.types';

const TronWalletContext = createContext<EcosystemWalletState | undefined>(undefined);

interface TronLinkWindow {
  request: (args: { method: string; params?: unknown }) => Promise<{ code: number; message?: string }>;
  tronWeb?: {
    ready?: boolean;
    defaultAddress?: { base58: string; hex: string };
  };
}

function getTronLink(): TronLinkWindow | null {
  if (typeof window === 'undefined') return null;
  const anyWin = window as unknown as { tronLink?: TronLinkWindow; tronWeb?: { ready?: boolean; defaultAddress?: { base58: string; hex: string } } };
  if (anyWin?.tronLink) return anyWin.tronLink;
  if (anyWin?.tronWeb) return { request: async () => ({ code: 200 }), tronWeb: anyWin.tronWeb };
  return null;
}

const TRON_LOCAL_STORAGE_KEY = 'horizonx_tron_connected';

export function TronWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [nativeBalance, setNativeBalance] = useState<string>('0.0000');
  const [nativeBalanceRaw, setNativeBalanceRaw] = useState<bigint | null>(null);
  const [tokens, setTokens] = useState<TokenHolding[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState<boolean>(false);

  const isConnected = address !== null;

  const refreshBalance = useCallback(async () => {
    if (!address) {
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      return;
    }

    try {
      const { balanceFormatted, balanceRaw } = await fetchTronNativeBalance(address);
      setNativeBalance(balanceFormatted);
      setNativeBalanceRaw(balanceRaw);

      setIsLoadingTokens(true);
      const holdings = await fetchTronTokenHoldings(address);
      setTokens(holdings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve TRON Shasta balance';
      setError(msg);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [address]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // Handle TronLink event listeners & session restoration
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.message && e.data.message.action === 'setAccount') {
        const newAddress = e.data.message.data?.address;
        if (newAddress) {
          setAddress(newAddress);
          localStorage.setItem(TRON_LOCAL_STORAGE_KEY, newAddress);
        } else {
          setAddress(null);
          localStorage.removeItem(TRON_LOCAL_STORAGE_KEY);
        }
      }
      if (e.data?.message && e.data.message.action === 'setNode') {
        const node = e.data.message.data?.node?.chain;
        if (node && !node.toLowerCase().includes('shasta')) {
          setIsUnsupportedNetwork(true);
        } else {
          setIsUnsupportedNetwork(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Eager connect if stored or tronWeb ready
    const wasConnected = typeof localStorage !== 'undefined' && localStorage.getItem(TRON_LOCAL_STORAGE_KEY);
    const tronLink = getTronLink();
    if (tronLink?.tronWeb?.defaultAddress?.base58) {
      setAddress(tronLink.tronWeb.defaultAddress.base58);
    } else if (wasConnected && wasConnected !== 'false') {
      setAddress(wasConnected);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const tronLink = getTronLink();
      if (!tronLink) {
        throw new Error('TronLink wallet extension is not installed in this browser.');
      }

      const res = await tronLink.request({ method: 'tron_requestAccounts' });
      if (res.code === 200) {
        const anyWin = window as unknown as { tronWeb?: { defaultAddress?: { base58: string } } };
        const addr = anyWin?.tronWeb?.defaultAddress?.base58;
        if (addr) {
          setAddress(addr);
          localStorage.setItem(TRON_LOCAL_STORAGE_KEY, addr);
          return;
        }
      }

      if (tronLink.tronWeb?.defaultAddress?.base58) {
        setAddress(tronLink.tronWeb.defaultAddress.base58);
        localStorage.setItem(TRON_LOCAL_STORAGE_KEY, tronLink.tronWeb.defaultAddress.base58);
        return;
      }

      throw new Error('TronLink connection was rejected or no account selected.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'TronLink connection rejected';
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
    setAddress(null);
    setNativeBalance('0.0000');
    setNativeBalanceRaw(null);
    setTokens([]);
    try {
      localStorage.removeItem(TRON_LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const status: WalletConnectionStatus = isUnsupportedNetwork
    ? 'unsupported_network'
    : isConnecting
    ? 'connecting'
    : isConnected
    ? 'connected'
    : 'disconnected';

  const value: EcosystemWalletState = useMemo(
    () => ({
      ecosystem: 'tron',
      status,
      isConnected,
      isConnecting,
      isUnsupportedNetwork,
      address,
      shortAddress: address ? shortenAddress(address) : null,
      walletName: TRON_CONFIG.preferredWallet,
      chainId: TRON_SHASTA_CHAIN_ID,
      networkName: TRON_SHASTA_CONFIG.networkName,
      isTestnet: true,
      nativeBalance,
      nativeBalanceRaw,
      nativeSymbol: 'TRX',
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
      isUnsupportedNetwork,
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

  return <TronWalletContext.Provider value={value}>{children}</TronWalletContext.Provider>;
}

export function useTronWallet(): EcosystemWalletState {
  const context = useContext(TronWalletContext);
  if (!context) {
    throw new Error('useTronWallet must be used within a TronWalletProvider');
  }
  return context;
}
