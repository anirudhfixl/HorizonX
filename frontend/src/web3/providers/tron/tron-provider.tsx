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

export function isTronLinkInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const anyWin = window as unknown as {
    tronLink?: { ready?: boolean; request?: unknown };
    tronWeb?: { ready?: boolean; defaultAddress?: unknown };
  };
  return Boolean(anyWin?.tronLink || anyWin?.tronWeb);
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
      let tronLink = getTronLink();
      // Allow a brief wait for injected script if page just loaded
      if (!tronLink && typeof window !== 'undefined') {
        await new Promise((resolve) => setTimeout(resolve, 300));
        tronLink = getTronLink();
      }

      if (!tronLink) {
        throw new Error('TronLink wallet extension is not installed in this browser.');
      }

      // Request authorization from TronLink
      if (typeof tronLink.request === 'function') {
        const res = await tronLink.request({ method: 'tron_requestAccounts' });
        if (res && (res.code === 4001 || (res.code !== 200 && res.code !== 0))) {
          throw new Error('TronLink connection was rejected by user.');
        }
      }

      // Poll up to 2 seconds for address to become available
      let addr: string | null = null;
      const anyWin = window as unknown as {
        tronWeb?: {
          ready?: boolean;
          defaultAddress?: { base58: string; hex: string };
          fullNode?: { host?: string };
        };
      };

      for (let i = 0; i < 20; i++) {
        addr = anyWin?.tronWeb?.defaultAddress?.base58 || tronLink.tronWeb?.defaultAddress?.base58 || null;
        if (addr) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (!addr) {
        throw new Error('TronLink is locked or no account is selected. Please unlock TronLink.');
      }

      // Verify Shasta network
      const host = anyWin?.tronWeb?.fullNode?.host || '';
      if (host && !host.toLowerCase().includes('shasta')) {
        // Warn if not Shasta, but allow testnet node
        if (host.toLowerCase().includes('api.trongrid.io') && !host.toLowerCase().includes('shasta')) {
          setIsUnsupportedNetwork(true);
          throw new Error('TronLink is connected to TRON Mainnet. Mainnet is strictly prohibited. Please switch to Shasta Testnet.');
        }
      }

      setIsUnsupportedNetwork(false);
      setAddress(addr);
      try {
        localStorage.setItem(TRON_LOCAL_STORAGE_KEY, addr);
      } catch {
        // ignore
      }
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

