import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';
import { EVM_CONFIG } from '../../config/evm.config';
import { EVM_SEPOLIA_CONFIG } from '../../config/networks';
import { fetchEvmNativeBalance, fetchEvmTokenHoldings } from '../../services/balances/evm-balance';
import { shortenAddress } from '../../utils/address-validation';
import type { EcosystemWalletState, TokenHolding, WalletConnectionStatus } from '../../types/wallet.types';

const EvmWalletContext = createContext<EcosystemWalletState | undefined>(undefined);

export function EvmWalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, isConnecting, chainId, connector } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const [nativeBalance, setNativeBalance] = useState<string>('0.0000');
  const [nativeBalanceRaw, setNativeBalanceRaw] = useState<bigint | null>(null);
  const [tokens, setTokens] = useState<TokenHolding[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isUnsupportedNetwork = isConnected && chainId !== undefined && chainId !== EVM_CONFIG.chainId;

  const refreshBalance = useCallback(async () => {
    if (!address || !isConnected || isUnsupportedNetwork) {
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
      return;
    }

    try {
      const { balanceFormatted, balanceRaw } = await fetchEvmNativeBalance(address);
      setNativeBalance(balanceFormatted);
      setNativeBalanceRaw(balanceRaw);

      setIsLoadingTokens(true);
      const holdings = await fetchEvmTokenHoldings(address);
      setTokens(holdings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve balance';
      setError(msg);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [address, isConnected, isUnsupportedNetwork]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const connect = useCallback(async () => {
    setError(null);
    try {
      // Prefer MetaMask or injected connector
      const targetConnector =
        connectors.find((c) => c.name.toLowerCase().includes('metamask')) ||
        connectors.find((c) => c.type === 'injected') ||
        connectors[0];

      if (!targetConnector) {
        throw new Error('No EVM connector found. Please install MetaMask.');
      }

      await connectAsync({ connector: targetConnector, chainId: sepolia.id });

      // Ensure chain is Sepolia
      if (chainId && chainId !== EVM_CONFIG.chainId && switchChainAsync) {
        await switchChainAsync({ chainId: sepolia.id });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'MetaMask connection rejected';
      if (!/reject|cancel|denied/i.test(msg)) {
        setError(msg);
      }
      throw err;
    }
  }, [connectAsync, connectors, chainId, switchChainAsync]);

  const disconnect = useCallback(async () => {
    setError(null);
    try {
      await disconnectAsync();
      setNativeBalance('0.0000');
      setNativeBalanceRaw(null);
      setTokens([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Disconnection failed';
      setError(msg);
    }
  }, [disconnectAsync]);

  const status: WalletConnectionStatus = isUnsupportedNetwork
    ? 'unsupported_network'
    : isConnecting
    ? 'connecting'
    : isConnected
    ? 'connected'
    : 'disconnected';

  const value: EcosystemWalletState = useMemo(
    () => ({
      ecosystem: 'evm',
      status,
      isConnected,
      isConnecting,
      isUnsupportedNetwork,
      address: address || null,
      shortAddress: address ? shortenAddress(address) : null,
      walletName: connector?.name || EVM_CONFIG.preferredWallet,
      chainId: chainId ?? null,
      networkName: isUnsupportedNetwork ? 'Unsupported Network' : EVM_SEPOLIA_CONFIG.networkName,
      isTestnet: true,
      nativeBalance,
      nativeBalanceRaw,
      nativeSymbol: 'ETH',
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
      connector?.name,
      chainId,
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

  return <EvmWalletContext.Provider value={value}>{children}</EvmWalletContext.Provider>;
}

export function useEvmWallet(): EcosystemWalletState {
  const context = useContext(EvmWalletContext);
  if (!context) {
    throw new Error('useEvmWallet must be used within an EvmWalletProvider');
  }
  return context;
}
