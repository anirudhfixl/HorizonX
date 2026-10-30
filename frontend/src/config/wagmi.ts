import { createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";
import { injected, metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

// WalletConnect Cloud project ID from environment variables
// Users obtain their project ID from https://cloud.reown.com / https://cloud.walletconnect.com
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6bba2d1de9622da67d1c4064d37d";

// Custom Sepolia RPC URL if configured, otherwise fall back to Viem's default public RPCs
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target: "metaMask",
    }),
    metaMask({
      dappMetadata: {
        name: "ProMiners",
        url: typeof window !== "undefined" ? window.location.origin : "https://prominers.io",
      },
    }),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: "ProMiners",
        description: "Token creation, presale launchpad, and staking protocol",
        url: typeof window !== "undefined" ? window.location.origin : "https://prominers.io",
        icons: ["https://prominers.io/favicon.ico"],
      },
    }),
    coinbaseWallet({
      appName: "ProMiners",
      appLogoUrl: "https://prominers.io/favicon.ico",
    }),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl || undefined),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
