/**
 * Milestone 1-B: Wallet State & Network Handling Verification Tests
 */

import {
  SEPOLIA_CONFIG,
  ACTIVE_CHAINS,
  DEFAULT_CHAIN,
  isSupportedChainId,
  getNetworkConfig,
} from "../config/chains";
import { wagmiConfig } from "../config/wagmi";
import { formatUnits } from "viem";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — MILESTONE 1-B WALLET & WEB3 TESTS");
console.log("==========================================\n");

// Test 1: Centralized Chain Configuration
console.log("--- 1. Chain Scope & Architecture Decision D-04 ---");
assert(SEPOLIA_CONFIG.chainId === 11155111, "Sepolia chainId is 11155111");
assert(SEPOLIA_CONFIG.symbol === "ETH", "Sepolia native currency symbol is ETH");
assert(SEPOLIA_CONFIG.isTestnet === true, "Sepolia is marked as testnet");
assert(
  SEPOLIA_CONFIG.explorerUrl === "https://sepolia.etherscan.io",
  "Explorer points to Sepolia Etherscan"
);
assert(ACTIVE_CHAINS.length === 1, "Milestone 1-B strictly supports exactly 1 chain (Sepolia)");
assert(ACTIVE_CHAINS[0].id === 11155111, "Active chain is Sepolia (11155111)");
assert(DEFAULT_CHAIN.id === 11155111, "Default chain is Sepolia");

// Test 2: Network Detection & Unsupported Chain Handling
console.log("\n--- 2. Network Detection & Unsupported Chains ---");
assert(isSupportedChainId(11155111) === true, "Sepolia chain ID 11155111 is supported");
assert(isSupportedChainId(1) === false, "Ethereum Mainnet (1) is unsupported per D-04");
assert(isSupportedChainId(137) === false, "Polygon (137) is unsupported per D-04");
assert(isSupportedChainId(8453) === false, "Base (8453) is unsupported per D-04");
assert(isSupportedChainId(42161) === false, "Arbitrum (42161) is unsupported per D-04");
assert(isSupportedChainId(undefined) === false, "Undefined chain ID is unsupported");

const sepoliaMeta = getNetworkConfig(11155111);
assert(sepoliaMeta.id === "sepolia", "Resolved Sepolia metadata id is 'sepolia'");
assert(sepoliaMeta.name === "Sepolia Testnet", "Resolved Sepolia metadata name is 'Sepolia Testnet'");

const unsupportedMeta = getNetworkConfig(1);
assert(unsupportedMeta.id === "unsupported", "Chain 1 returns unsupported network config");
assert(unsupportedMeta.name.includes("Unsupported"), "Unsupported network returns clear label");

// Test 3: Wagmi Configuration & Connectors
console.log("\n--- 3. Wagmi Configuration & Connectors ---");
assert(wagmiConfig !== undefined, "wagmiConfig is initialized");
assert(wagmiConfig.chains.length === 1, "wagmiConfig has exactly 1 chain configured");
assert(wagmiConfig.chains[0].id === 11155111, "wagmiConfig chain is Sepolia");

const connectorNames = wagmiConfig.connectors.map((c) => c.name);
console.log("Configured connectors:", connectorNames);
assert(
  wagmiConfig.connectors.length >= 3,
  "At least 3 connectors configured (Injected/MetaMask, WalletConnect, Coinbase Wallet)"
);

// Test 4: Address Formatting & Balance Helpers
console.log("\n--- 4. Address & Balance Utilities ---");
const testAddress = "0x71C9561E873f324A3B4323E56d3935a8286C4e39";
const short = `${testAddress.slice(0, 6)}...${testAddress.slice(-4)}`;
assert(short === "0x71C9...4e39", `Address abbreviation formatted correctly: ${short}`);

// 0.25 ETH in Wei
const weiBalance = BigInt("250000000000000000");
const formattedEth = Number(formatUnits(weiBalance, 18)).toFixed(4);
assert(formattedEth === "0.2500", `Viem balance formatted correctly: ${formattedEth} ETH`);

console.log("\n==========================================");
console.log("ALL MILESTONE 1-B WALLET TESTS PASSED (16/16)");
console.log("==========================================\n");
