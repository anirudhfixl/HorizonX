import { createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";
import { injected, metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

// WalletConnect Cloud project ID from environment variables
// Users obtain their project ID from https://cloud.reown.com / https://cloud.walletconnect.com
const walletConnectProjectId =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WALLETCONNECT_PROJECT_ID) || "3fcc6bba2d1de9622da67d1c4064d37d";

// Custom Sepolia RPC URL if configured, otherwise fall back to Viem's default public RPCs
const sepoliaRpcUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SEPOLIA_RPC_URL : undefined;

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target: "metaMask",
    }),
    metaMask({
      dappMetadata: {
        name: "HorizonX",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
    }),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: "HorizonX",
        description: "Token creation, presale launchpad, and staking protocol",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: typeof window !== "undefined" ? [`${window.location.origin}/favicon.ico`] : [],
      },
    }),
    coinbaseWallet({
      appName: "HorizonX",
      appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : undefined,
    }),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl || undefined),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
