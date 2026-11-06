import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function marketApiPlugin() {
  return {
    name: "market-api-dev-proxy",
    configureServer(server: any) {
      server.middlewares.use("/api/market", async (req: any, res: any, next: any) => {
        try {
          const { handleMarketRequest } = await import("./api/market-handler");
          await handleMarketRequest(req, res);
        } catch (err) {
          next(err);
        }
      });
      server.middlewares.use("/api/cryptorank", async (req: any, res: any, next: any) => {
        try {
          const { handleCryptoRankRequest } = await import("./api/cryptorank-handler");
          await handleCryptoRankRequest(req, res);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.COINMARKETCAP_API_KEY && !process.env.COINMARKETCAP_API_KEY) {
    process.env.COINMARKETCAP_API_KEY = env.COINMARKETCAP_API_KEY;
  }
  if (env.CRYPTORANK_API_KEY && !process.env.CRYPTORANK_API_KEY) {
    process.env.CRYPTORANK_API_KEY = env.CRYPTORANK_API_KEY;
  }

  return {
    plugins: [react(), tailwindcss(), marketApiPlugin()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // Some wallet SDKs (MetaMask, WalletConnect) expect a Node-style `global` in the browser.
    define: {
      global: "globalThis",
    },
    build: {
      target: "es2022",
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Web3 & Query infrastructure (Wagmi, Viem, connectors, TanStack Query)
            if (
              id.includes("node_modules/wagmi") ||
              id.includes("node_modules/viem") ||
              id.includes("node_modules/@wagmi") ||
              id.includes("node_modules/@tanstack/react-query")
            ) {
              return "web3-vendor";
            }
            // 3D & Graphics libraries (Three.js, R3F)
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "three-vendor";
            }
            // React Core & Router
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router")
            ) {
              return "react-vendor";
            }
            // Animation engine (Motion, GSAP)
            if (
              id.includes("node_modules/motion") ||
              id.includes("node_modules/framer-motion") ||
              id.includes("node_modules/gsap")
            ) {
              return "animation-vendor";
            }
            // Icons
            if (id.includes("node_modules/lucide-react")) {
              return "lucide-vendor";
            }
          },
        },
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
  };
});
