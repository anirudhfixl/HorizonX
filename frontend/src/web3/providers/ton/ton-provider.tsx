import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { TON_CONFIG, TON_TESTNET_CHAIN_ID } from '../../config/ton.config';
import { TON_TESTNET_CONFIG } from '../../config/networks';
import { fetchTonNativeBalance, fetchTonTokenHoldings } from '../../services/balances/ton-balance';
import { shortenAddress } from '../../utils/address-validation';
import type { EcosystemWalletState, TokenHolding, WalletConnectionStatus } from '../../types/wallet.types';

const TonWalletContext = createContext<EcosystemWalletState | undefined>(undefined);

interface TonInjectedProvider {
  isTonkeeper?: boolean;
  account?: { address: string; chain: string | number };
  send?: (method: string, params?: unknown[]) => Promise<unknown>;
  connect?: () => Promise<{ address: string }>;
  disconnect?: () => Promise<void>;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
}

function getTonProvider(): TonInjectedProvider | null {
  if (typeof window === 'undefined') return null;
  const anyWin = window as unknown as { tonkeeper?: TonInjectedProvider; ton?: TonInjectedProvider };
  return anyWin?.tonkeeper || anyWin?.ton || null;
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
      const provider = getTonProvider();
      if (provider) {
        if (provider.connect) {
          const res = await provider.connect();
          if (res?.address) {
            setAddress(res.address);
            localStorage.setItem(TON_LOCAL_STORAGE_KEY, res.address);
            return;
          }
        }
        if (provider.account?.address) {
          const chain = String(provider.account.chain);
          if (chain && chain !== '-3' && chain !== 'testnet') {
            setIsUnsupportedNetwork(true);
            throw new Error('Tonkeeper is connected to mainnet. Please switch to TON Testnet.');
          }
          setAddress(provider.account.address);
          localStorage.setItem(TON_LOCAL_STORAGE_KEY, provider.account.address);
          return;
        }
      }

      // If no extension injected, open prompt or provide testnet connection
      const promptAddress = window.prompt(
        'Tonkeeper Web / Extension: Enter your TON Testnet address (starts with 0Q or kQ):'
      );
      if (promptAddress && promptAddress.trim()) {
        const clean = promptAddress.trim();
        if (!clean.startsWith('0Q') && !clean.startsWith('kQ')) {
          throw new Error('Only TON Testnet addresses (starting with 0Q or kQ) are permitted.');
        }
        setAddress(clean);
        localStorage.setItem(TON_LOCAL_STORAGE_KEY, clean);
      } else {
        throw new Error('Tonkeeper connection cancelled.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tonkeeper connection rejected';
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
      const provider = getTonProvider();
      if (provider?.disconnect) {
        await provider.disconnect();
      }
      setAddress(null);
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      localStorage.removeItem(TON_LOCAL_STORAGE_KEY);
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
