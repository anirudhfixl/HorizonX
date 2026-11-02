import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { sepolia } from "viem/chains";
import { formatUnits } from "viem";
import { toast } from "sonner";
import {
  SEPOLIA_CONFIG,
  getNetworkConfig,
  isSupportedChainId,
  type NetworkConfig,
} from "@/config/chains";

export type { NetworkConfig as Network };

/**
 * Re-export supported networks list for UI components.
 * Per D-04, this currently contains ONLY Sepolia Testnet.
 */
export const SUPPORTED_NETWORKS: NetworkConfig[] = [SEPOLIA_CONFIG];

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "unsupported_network";

export interface WalletContextType {
  // Connection states
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isUnsupportedNetwork: boolean;
  status: ConnectionStatus;

  // Account data
  address: string | null;
  shortAddress: string | null;
  balance: string;
  balanceRaw?: bigint;
  balanceFormatted?: string;

  // Network data
  chainId: number | undefined;
  network: NetworkConfig;

  // Connector data
  walletProvider: string | null;
  connectors: readonly Connector[];

  // Actions
  connect: (connectorIdOrName?: string) => Promise<void>;
  connectDemo: () => void;
  disconnect: () => void;
  switchNetwork: (chainIdOrId?: number | string) => Promise<void>;
  isDemoMode: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DEMO_ADDRESS = "0x71C9561E873f324A3B4323E56d3935a8286C4e39";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Real Wagmi hooks
  const {
    address: wagmiAddress,
    isConnected: wagmiIsConnected,
    isConnecting: wagmiIsConnecting,
    isReconnecting: wagmiIsReconnecting,
    connector: activeConnector,
    chainId: activeChainId,
  } = useAccount();

  const { connectAsync, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  // Retrieve native Sepolia ETH balance for connected address
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: wagmiAddress,
    chainId: sepolia.id,
  });

  // Demo fallback state (for testing sandbox without Web3 extension)
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoConnected, setDemoConnected] = useState(false);

  // Load persisted demo session if active
  useEffect(() => {
    try {
      const savedDemo = localStorage.getItem("prominers_demo_wallet_active");
      if (savedDemo === "true" && !wagmiIsConnected) {
        queueMicrotask(() => {
          setIsDemoMode(true);
          setDemoConnected(true);
        });
      }
    } catch {
      // ignore
    }
  }, [wagmiIsConnected]);

  // If real wallet connects, immediately clear demo mode
  useEffect(() => {
    if (wagmiIsConnected) {
      queueMicrotask(() => {
        setIsDemoMode(false);
        setDemoConnected(false);
      });
      try {
        localStorage.removeItem("prominers_demo_wallet_active");
      } catch {
        // ignore
      }
    }
  }, [wagmiIsConnected]);

  // Track previous connection state to trigger friendly toast notifications
  const prevConnectedRef = useRef(wagmiIsConnected);
  const prevAddressRef = useRef(wagmiAddress);

  useEffect(() => {
    if (!prevConnectedRef.current && wagmiIsConnected && wagmiAddress) {
      toast.success("Wallet Connected", {
        description: `Connected with ${activeConnector?.name || "Web3 Wallet"} on Sepolia.`,
      });
      refetchBalance();
    } else if (prevConnectedRef.current && !wagmiIsConnected) {
      toast.info("Wallet Disconnected", {
        description: "Active Web3 session terminated.",
      });
    } else if (
      wagmiIsConnected &&
      prevAddressRef.current &&
      wagmiAddress &&
      prevAddressRef.current !== wagmiAddress
    ) {
      toast.info("Account Changed", {
        description: `Active address switched to ${wagmiAddress.slice(0, 6)}...${wagmiAddress.slice(-4)}`,
      });
      refetchBalance();
    }
    prevConnectedRef.current = wagmiIsConnected;
    prevAddressRef.current = wagmiAddress;
  }, [wagmiIsConnected, wagmiAddress, activeConnector?.name, refetchBalance]);

  // Detect unsupported network
  const isUnsupportedNetwork = useMemo(() => {
    if (isDemoMode) return false;
    if (!wagmiIsConnected) return false;
    return !isSupportedChainId(activeChainId);
  }, [wagmiIsConnected, activeChainId, isDemoMode]);

  // Resolved active address
  const address = useMemo(() => {
    if (wagmiIsConnected && wagmiAddress) {
      return wagmiAddress;
    }
    if (isDemoMode && demoConnected) {
      return DEMO_ADDRESS;
    }
    return null;
  }, [wagmiIsConnected, wagmiAddress, isDemoMode, demoConnected]);

  const shortAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const isConnected = wagmiIsConnected || (isDemoMode && demoConnected);
  const isConnecting = wagmiIsConnecting;
  const isReconnecting = wagmiIsReconnecting;

  // Formatted balance
  const balance = useMemo(() => {
    if (isDemoMode) {
      return "3.428";
    }
    if (balanceData) {
      const formatted = Number(formatUnits(balanceData.value, balanceData.decimals));
      // Display up to 4 significant decimal places
      return formatted.toFixed(4);
    }
    return "0.0000";
  }, [isDemoMode, balanceData]);

  // Resolved network metadata
  const network = useMemo<NetworkConfig>(() => {
    if (isDemoMode) {
      return SEPOLIA_CONFIG;
    }
    return getNetworkConfig(activeChainId);
  }, [isDemoMode, activeChainId]);

  // Overall connection status
  const status: ConnectionStatus = useMemo(() => {
    if (isConnecting || isReconnecting) return "connecting";
    if (isUnsupportedNetwork) return "unsupported_network";
    if (isConnected) return "connected";
    return "disconnected";
  }, [isConnecting, isReconnecting, isUnsupportedNetwork, isConnected]);

  // Active connector / provider name
  const walletProvider = useMemo(() => {
    if (isDemoMode) {
      return "Demo Sandbox";
    }
    if (activeConnector) {
      return activeConnector.name;
    }
    return null;
  }, [isDemoMode, activeConnector]);

  // Real connector dispatch
  const connect = async (connectorIdOrName?: string) => {
    // If demo connection requested
    if (connectorIdOrName === "demo" || connectorIdOrName === "Demo Account (Tester)") {
      connectDemo();
      return;
    }

    try {
      // Find matching connector by id or name
      let targetConnector = connectors.find(
        (c) =>
          c.id.toLowerCase() === connectorIdOrName?.toLowerCase() ||
          c.name.toLowerCase() === connectorIdOrName?.toLowerCase()
      );

      // If specific connector not matched, pick first available injected or connector
      if (!targetConnector) {
        targetConnector = connectors[0];
      }

      if (!targetConnector) {
        throw new Error("No Web3 connector available. Please install MetaMask or another wallet.");
      }

      await connectAsync({
        connector: targetConnector,
        chainId: sepolia.id,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to connect wallet. User rejected or closed window.";
      // Don't show toast for benign user rejection
      if (
        !errorMsg.includes("User rejected") &&
        !errorMsg.includes("cancelled") &&
        !errorMsg.includes("User denied")
      ) {
        toast.error("Connection Failed", {
          description: errorMsg,
        });
      }
      throw err;
    }
  };

  const connectDemo = () => {
    setIsDemoMode(true);
    setDemoConnected(true);
    try {
      localStorage.setItem("prominers_demo_wallet_active", "true");
    } catch {
      // ignore
    }
    toast.success("Wallet Connected (Demo Sandbox)", {
      description: `Simulated session as Demo Tester (${DEMO_ADDRESS.slice(0, 6)}...${DEMO_ADDRESS.slice(-4)}) on Sepolia.`,
    });
  };

  const disconnect = () => {
    if (wagmiIsConnected) {
      wagmiDisconnect();
    }
    setIsDemoMode(false);
    setDemoConnected(false);
    try {
      localStorage.removeItem("prominers_demo_wallet_active");
    } catch {
      // ignore
    }
  };

  const switchNetwork = async (chainIdOrId?: number | string) => {
    if (isDemoMode) {
      toast.info("Demo Network Active", {
        description: "Simulated sandbox is fixed on Sepolia Testnet (Chain ID: 11155111).",
      });
      return;
    }

    try {
      // Per D-04: Only Sepolia is supported
      const targetChainId =
        typeof chainIdOrId === "number"
          ? chainIdOrId
          : chainIdOrId === "sepolia"
          ? sepolia.id
          : sepolia.id;

      if (targetChainId !== sepolia.id) {
        toast.error("Unsupported Network", {
          description: "Milestone 1-B exclusively supports Ethereum Sepolia Testnet (Chain ID: 11155111).",
        });
        return;
      }

      await switchChainAsync({ chainId: sepolia.id });
      toast.success("Network Switched", {
        description: "Active network successfully changed to Ethereum Sepolia Testnet.",
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Network switch failed or was rejected by user.";
      if (!errorMsg.includes("User rejected")) {
        toast.error("Network Switch Failed", {
          description: errorMsg,
        });
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        isReconnecting,
        isUnsupportedNetwork,
        status,
        address,
        shortAddress,
        balance,
        balanceRaw: balanceData?.value,
        balanceFormatted: balanceData
          ? formatUnits(balanceData.value, balanceData.decimals)
          : undefined,
        chainId: activeChainId,
        network,
        walletProvider,
        connectors,
        connect,
        connectDemo,
        disconnect,
        switchNetwork,
        isDemoMode,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
