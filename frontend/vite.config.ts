import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Some wallet SDKs (MetaMask, WalletConnect) expect a Node-style `global` in the browser.
  define: {
    global: "globalThis",
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
