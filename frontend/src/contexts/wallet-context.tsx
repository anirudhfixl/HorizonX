"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Network {
  id: string;
  name: string;
  chainId: number;
  symbol: string;
  icon: string;
  isTestnet?: boolean;
}

export const SUPPORTED_NETWORKS: Network[] = [
  { id: "ethereum", name: "Ethereum", chainId: 1, symbol: "ETH", icon: "⟠" },
  { id: "bnb", name: "BNB Chain", chainId: 56, symbol: "BNB", icon: "🟡" },
  { id: "polygon", name: "Polygon", chainId: 137, symbol: "POL", icon: "🟣" },
  { id: "arbitrum", name: "Arbitrum One", chainId: 42161, symbol: "ETH", icon: "🔷" },
  { id: "base", name: "Base", chainId: 8453, symbol: "ETH", icon: "🔵" },
  { id: "sepolia", name: "Sepolia Testnet", chainId: 11155111, symbol: "ETH", icon: "🧪", isTestnet: true },
];

export interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  shortAddress: string | null;
  balance: string;
  network: Network;
  walletProvider: string | null;
  connect: (providerName?: string) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (networkId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DEMO_ADDRESS = "0x71C9561E873f324A3B4323E56d3935a8286C4e39";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("3.428");
  const [walletProvider, setWalletProvider] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>(SUPPORTED_NETWORKS[0]);

  // Load persisted mock session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prominers_wallet_connected");
      if (saved === "true") {
        queueMicrotask(() => {
          setIsConnected(true);
          setAddress(DEMO_ADDRESS);
          setWalletProvider("MetaMask (Demo)");
        });
      }
    } catch {
      // ignore SSR / storage restrictions
    }
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const connect = async (providerName: string = "MetaMask") => {
    setIsConnected(true);
    setAddress(DEMO_ADDRESS);
    setBalance("3.428");
    setWalletProvider(providerName);
    try {
      localStorage.setItem("prominers_wallet_connected", "true");
    } catch {
      // ignore
    }
    toast.success("Wallet Connected", {
      description: `Connected to ${providerName} (${DEMO_ADDRESS.slice(0, 6)}...${DEMO_ADDRESS.slice(-4)})`,
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setWalletProvider(null);
    try {
      localStorage.removeItem("prominers_wallet_connected");
    } catch {
      // ignore
    }
    toast.info("Wallet Disconnected", {
      description: "You have disconnected your active wallet.",
    });
  };

  const switchNetwork = (networkId: string) => {
    const target = SUPPORTED_NETWORKS.find((n) => n.id === networkId);
    if (target) {
      setNetwork(target);
      toast.success("Network Switched", {
        description: `Active network changed to ${target.name}`,
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        shortAddress,
        balance,
        network,
        walletProvider,
        connect,
        disconnect,
        switchNetwork,
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
