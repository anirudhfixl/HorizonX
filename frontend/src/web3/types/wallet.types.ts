export type BlockchainEcosystem = 'evm' | 'solana' | 'ton' | 'tron';

export type WalletConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'unsupported_network'
  | 'error';

export interface TokenHolding {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceRaw: bigint;
  logoUrl?: string;
  ecosystem: BlockchainEcosystem;
}

export interface EcosystemWalletState {
  ecosystem: BlockchainEcosystem;
  status: WalletConnectionStatus;
  isConnected: boolean;
  isConnecting: boolean;
  isUnsupportedNetwork: boolean;
  address: string | null;
  shortAddress: string | null;
  walletName: string | null;
  chainId: number | string | null;
  networkName: string;
  isTestnet: true;
  nativeBalance: string;
  nativeBalanceRaw: bigint | null;
  nativeSymbol: string;
  tokens: TokenHolding[];
  isLoadingTokens: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void> | void;
  clearError: () => void;
  refreshBalance: () => Promise<void>;
}

export interface MultiWalletState {
  evm: EcosystemWalletState;
  solana: EcosystemWalletState;
  ton: EcosystemWalletState;
  tron: EcosystemWalletState;
  connectedCount: number;
  totalEcosystems: 4;
}
