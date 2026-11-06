import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { TON_CONFIG, TON_TESTNET_CHAIN_ID } from '../../config/ton.config';
import { TON_TESTNET_CONFIG } from '../../config/networks';
import { fetchTonNativeBalance, fetchTonTokenHoldings } from '../../services/balances/ton-balance';
import { shortenAddress } from '../../utils/address-validation';
import type { EcosystemWalletState, TokenHolding, WalletConnectionStatus } from '../../types/wallet.types';

const TonWalletContext = createContext<EcosystemWalletState | undefined>(undefined);

interface TonConnectItem {
  name: string;
  address?: string;
  network?: string | number;
  publicKey?: string;
}

interface TonConnectResponse {
  event: 'connect';
  payload: {
    items: TonConnectItem[];
    device?: unknown;
  };
}

export interface GramWalletBridge {
  deviceInfo?: {
    platform?: string;
    appName?: string;
    appVersion?: string;
    maxProtocolVersion?: number;
    features?: unknown[];
  };
  walletInfo?: {
    name?: string;
    app_name?: string;
    image?: string;
    about_url?: string;
  };
  protocolVersion?: number;
  connect?: (
    protocolVersion: number,
    message?: { manifestUrl?: string; items?: Array<{ name: string }> }
  ) => Promise<TonConnectResponse | { address: string; chain?: string | number }>;
  restoreConnection?: () => Promise<unknown>;
  disconnect?: () => Promise<void>;
  send?: (message: unknown) => Promise<unknown>;
  sendTransaction?: (tx: unknown) => Promise<{ boc: string }>;
  listen?: (callback: (event: unknown) => void) => () => void;
  // Convenience direct properties
  account?: { address: string; chain?: string | number };
}

/**
 * Official TON Connect wallet discovery for Gram Wallet.
 * Identified by registry jsBridgeKey "gramwallet" at window.tonconnect.gramwallet or window.gramwallet.
 * Does NOT assume window.ton identifies Gram Wallet.
 */
function getGramWalletBridge(): GramWalletBridge | null {
  if (typeof window === 'undefined') return null;
  const anyWin = window as unknown as {
    tonconnect?: Record<string, GramWalletBridge>;
    gramwallet?: GramWalletBridge;
    gramWallet?: GramWalletBridge;
  };

  // 1. Official TON Connect JS Bridge standard: window.tonconnect.gramwallet
  if (anyWin?.tonconnect?.gramwallet) {
    return anyWin.tonconnect.gramwallet;
  }

  // 2. Direct JS bridge injection under its official jsBridgeKey: window.gramwallet / window.gramWallet
  if (anyWin?.gramwallet) {
    return anyWin.gramwallet;
  }
  if (anyWin?.gramWallet) {
    return anyWin.gramWallet;
  }

  return null;
}

const TON_LOCAL_STORAGE_KEY = 'horizonx_ton_connected';

export function TonWalletProvider({ children }: { children: React.ReactNode }) {
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
      const { balanceFormatted, balanceRaw } = await fetchTonNativeBalance(address);
      setNativeBalance(balanceFormatted);
      setNativeBalanceRaw(balanceRaw);

      setIsLoadingTokens(true);
      const holdings = await fetchTonTokenHoldings(address);
      setTokens(holdings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve TON Testnet balance';
      setError(msg);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [address]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // Session restoration
  useEffect(() => {
    const wasConnected = typeof localStorage !== 'undefined' && localStorage.getItem(TON_LOCAL_STORAGE_KEY);
    if (wasConnected && wasConnected !== 'false') {
      setAddress(wasConnected);
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const bridge = getGramWalletBridge();
      if (bridge) {
        let resolvedAddress: string | null = null;
        let resolvedNetwork: string | number | null = null;

        // 1. Official TON Connect 2.0 JS Bridge connect protocol
        if (typeof bridge.connect === 'function') {
          const res = await bridge.connect(2, {
            manifestUrl: TON_CONFIG.manifestUrl,
            items: [{ name: 'ton_addr' }],
          });

          if (res && 'payload' in res && Array.isArray(res.payload?.items)) {
            const addrItem = res.payload.items.find((it) => it.name === 'ton_addr');
            if (addrItem?.address) {
              resolvedAddress = addrItem.address;
              resolvedNetwork = addrItem.network ?? null;
            }
          } else if (res && 'address' in res && typeof res.address === 'string') {
            resolvedAddress = res.address;
            resolvedNetwork = res.chain ?? null;
          }
        }

        // 2. Direct account property if already authorized
        if (!resolvedAddress && bridge.account?.address) {
          resolvedAddress = bridge.account.address;
          resolvedNetwork = bridge.account.chain ?? null;
        }

        if (resolvedAddress) {
          // Strictly enforce TON Testnet (-3); reject Mainnet (-239)
          if (resolvedNetwork !== null) {
            const netStr = String(resolvedNetwork);
            if (netStr === '-239' || netStr === 'mainnet') {
              setIsUnsupportedNetwork(true);
              throw new Error('Gram Wallet is connected to TON Mainnet. Mainnet is strictly prohibited. Please switch to TON Testnet (-3).');
            }
          }

          setIsUnsupportedNetwork(false);
          setAddress(resolvedAddress);
          try {
            localStorage.setItem(TON_LOCAL_STORAGE_KEY, resolvedAddress);
          } catch {
            // ignore
          }
          return;
        }
      }

      // If no Gram Wallet extension injected, reject with clean actionable error
      // Never use window.prompt or accept unauthenticated manual addresses
      throw new Error('Gram Wallet extension is not installed. Please connect via TON Connect QR or install Gram Wallet.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gram Wallet connection rejected';
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
      const bridge = getGramWalletBridge();
      if (bridge?.disconnect && typeof bridge.disconnect === 'function') {
        await bridge.disconnect();
      }
      setAddress(null);
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      try {
        localStorage.removeItem(TON_LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'TON disconnect failed';
      setError(msg);
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
      ecosystem: 'ton',
      status,
      isConnected,
      isConnecting,
      isUnsupportedNetwork,
      address,
      shortAddress: address ? shortenAddress(address) : null,
      walletName: TON_CONFIG.preferredWallet,
      chainId: TON_TESTNET_CHAIN_ID,
      networkName: TON_TESTNET_CONFIG.networkName,
      isTestnet: true,
      nativeBalance,
      nativeBalanceRaw,
      nativeSymbol: 'TON',
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

  return <TonWalletContext.Provider value={value}>{children}</TonWalletContext.Provider>;
}

export function useTonWallet(): EcosystemWalletState {
  const context = useContext(TonWalletContext);
  if (!context) {
    throw new Error('useTonWallet must be used within a TonWalletProvider');
  }
  return context;
}

