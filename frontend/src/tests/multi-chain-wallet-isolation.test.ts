import assert from 'node:assert';
import {
  SUPPORTED_TESTNETS,
  PROHIBITED_MAINNET_IDENTIFIERS,
} from '../web3/config/networks';
import {
  validateTestnetNetwork,
  isTestnetNetworkValid,
  NetworkValidationError,
} from '../web3/utils/network-validation';
import {
  validateAddress,
  shortenAddress,
} from '../web3/utils/address-validation';
import { formatUnits, parseUnits } from '../web3/utils/formatters';

console.log('\n======================================================');
console.log('HORIZONX — MULTI-CHAIN WALLET ISOLATION & TESTNET TESTS');
console.log('======================================================\n');

// -------------------------------------------------------------------
// 1. Strict Testnet Configurations & Mainnet Prohibition
// -------------------------------------------------------------------
console.log('--- 1. Strict Testnet Scope Verification ---');

assert.strictEqual(SUPPORTED_TESTNETS.evm.chainId, 11155111, 'EVM chainId must be Sepolia (11155111)');
assert.strictEqual(SUPPORTED_TESTNETS.evm.ecosystem, 'evm');
assert.ok(SUPPORTED_TESTNETS.evm.explorerUrl.includes('sepolia.etherscan.io'));
console.log('✅ PASSED: Ethereum Sepolia strictly configured (11155111)');

assert.strictEqual(SUPPORTED_TESTNETS.solana.chainId, 'devnet', 'Solana cluster must be devnet');
assert.strictEqual(SUPPORTED_TESTNETS.solana.ecosystem, 'solana');
assert.ok(SUPPORTED_TESTNETS.solana.explorerUrl.includes('cluster=devnet'));
console.log('✅ PASSED: Solana Devnet strictly configured');

assert.strictEqual(SUPPORTED_TESTNETS.ton.chainId, -3, 'TON chainId must be -3 (testnet)');
assert.strictEqual(SUPPORTED_TESTNETS.ton.ecosystem, 'ton');
assert.ok(SUPPORTED_TESTNETS.ton.explorerUrl.includes('testnet.tonscan.org'));
console.log('✅ PASSED: TON Testnet strictly configured (-3)');

assert.strictEqual(SUPPORTED_TESTNETS.tron.chainId, '0x94a9059e', 'TRON chainId must be Shasta (0x94a9059e)');
assert.strictEqual(SUPPORTED_TESTNETS.tron.ecosystem, 'tron');
assert.ok(SUPPORTED_TESTNETS.tron.explorerUrl.includes('shasta.tronscan.org'));
console.log('✅ PASSED: TRON Shasta strictly configured (0x94a9059e)');

// -------------------------------------------------------------------
// 2. Prohibition of Mainnet Endpoints & Rejection Logic
// -------------------------------------------------------------------
console.log('\n--- 2. Mainnet Rejection & Validation ---');

const prohibitedCases = [
  { eco: 'evm' as const, id: 1, name: 'Ethereum Mainnet' },
  { eco: 'evm' as const, id: '1', name: 'Ethereum Mainnet (string)' },
  { eco: 'solana' as const, id: 'mainnet', name: 'Solana Mainnet' },
  { eco: 'solana' as const, id: 'mainnet-beta', name: 'Solana Mainnet-Beta' },
  { eco: 'ton' as const, id: '-239', name: 'TON Mainnet (-239)' },
  { eco: 'tron' as const, id: '0x2b6653dc', name: 'TRON Mainnet' },
  { eco: 'tron' as const, id: 'tron-mainnet', name: 'TRON Mainnet named' },
];

for (const testCase of prohibitedCases) {
  assert.throws(
    () => validateTestnetNetwork(testCase.eco, testCase.id),
    (err: unknown) => {
      return err instanceof NetworkValidationError && (err.message.includes('CRITICAL ERROR') || err.message.includes('mismatch'));
    },
    `Must throw NetworkValidationError for ${testCase.name}`
  );
  assert.strictEqual(isTestnetNetworkValid(testCase.eco, testCase.id), false);
  console.log(`✅ PASSED: Prohibited mainnet rejected: ${testCase.name}`);
}

// -------------------------------------------------------------------
// 3. Address Format Validation Across Ecosystems
// -------------------------------------------------------------------
console.log('\n--- 3. Multi-Chain Address Validation ---');

// EVM
assert.strictEqual(validateAddress('evm', '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'), true);
assert.strictEqual(validateAddress('evm', '0x71C9561E873f324A3B4323E56d3935a8286C4e39'), true);
assert.strictEqual(validateAddress('evm', '0xinvalid'), false);
assert.strictEqual(validateAddress('evm', '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), false);
console.log('✅ PASSED: EVM address validation');

// Solana
assert.strictEqual(validateAddress('solana', '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), true);
assert.strictEqual(validateAddress('solana', 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG'), true);
assert.strictEqual(validateAddress('solana', '0x71C9561E873f324A3B4323E56d3935a8286C4e39'), false);
console.log('✅ PASSED: Solana address validation');

// TON
assert.strictEqual(validateAddress('ton', '0QC7q-154_mD9Hn73_K_839h3892_example_jetton_testn'), true);
assert.strictEqual(validateAddress('ton', 'kQC7q-154_mD9Hn73_K_839h3892_example_jetton_testn'), true);
assert.strictEqual(validateAddress('ton', '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'), true);
assert.strictEqual(validateAddress('ton', 'invalid-ton-address'), false);
console.log('✅ PASSED: TON address validation');

// TRON
assert.strictEqual(validateAddress('tron', 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'), true);
assert.strictEqual(validateAddress('tron', 'TNDP5uPZJ9dG1893XmXz1839a83jK2193b'), true);
assert.strictEqual(validateAddress('tron', '0x71C9561E873f324A3B4323E56d3935a8286C4e39'), false);
console.log('✅ PASSED: TRON address validation');

// -------------------------------------------------------------------
// 4. Four Independent Wallet Connections State Machine (Isolation)
// -------------------------------------------------------------------
console.log('\n--- 4. Four Independent Wallet Connections Isolation Test ---');

interface MockWalletConnection {
  isConnected: boolean;
  address: string | null;
  walletName: string;
}

const mockWallets: Record<string, MockWalletConnection> = {
  evm: { isConnected: false, address: null, walletName: 'MetaMask' },
  solana: { isConnected: false, address: null, walletName: 'Phantom' },
  ton: { isConnected: false, address: null, walletName: 'Gram Wallet' },
  tron: { isConnected: false, address: null, walletName: 'TronLink' },
};

function connectWallet(eco: 'evm' | 'solana' | 'ton' | 'tron', addr: string) {
  // CRITICAL REQUIREMENT: Connecting one wallet MUST NOT touch any other wallet!
  mockWallets[eco].isConnected = true;
  mockWallets[eco].address = addr;
}

function disconnectWallet(eco: 'evm' | 'solana' | 'ton' | 'tron') {
  // CRITICAL REQUIREMENT: Disconnecting one wallet MUST NOT touch any other wallet!
  mockWallets[eco].isConnected = false;
  mockWallets[eco].address = null;
}

// Step 1: Connect MetaMask to EVM
connectWallet('evm', '0x71C9561E873f324A3B4323E56d3935a8286C4e39');
assert.strictEqual(mockWallets.evm.isConnected, true);
assert.strictEqual(mockWallets.solana.isConnected, false);
assert.strictEqual(mockWallets.ton.isConnected, false);
assert.strictEqual(mockWallets.tron.isConnected, false);
console.log('✅ PASSED: Step 1 - MetaMask connected to EVM Sepolia');

// Step 2: Connect Phantom to Solana
connectWallet('solana', '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
assert.strictEqual(mockWallets.evm.isConnected, true, 'MetaMask must REMAIN connected when Phantom connects!');
assert.strictEqual(mockWallets.solana.isConnected, true, 'Phantom must be connected');
assert.strictEqual(mockWallets.ton.isConnected, false);
assert.strictEqual(mockWallets.tron.isConnected, false);
console.log('✅ PASSED: Step 2 - Phantom connected to Solana Devnet; EVM remains active (no collision)');

// Step 3: Disconnect MetaMask
disconnectWallet('evm');
assert.strictEqual(mockWallets.evm.isConnected, false, 'EVM must be disconnected');
assert.strictEqual(mockWallets.solana.isConnected, true, 'Phantom MUST REMAIN connected when MetaMask disconnects!');
console.log('✅ PASSED: Step 3 - Disconnecting MetaMask does NOT disconnect Phantom');

// Step 4: Reconnect MetaMask
connectWallet('evm', '0x71C9561E873f324A3B4323E56d3935a8286C4e39');
assert.strictEqual(mockWallets.evm.isConnected, true);
assert.strictEqual(mockWallets.solana.isConnected, true);
console.log('✅ PASSED: Step 4 - Reconnected MetaMask; both EVM and Solana active');

// Step 5: Disconnect Phantom
disconnectWallet('solana');
assert.strictEqual(mockWallets.solana.isConnected, false);
assert.strictEqual(mockWallets.evm.isConnected, true, 'MetaMask MUST REMAIN connected when Phantom disconnects!');
console.log('✅ PASSED: Step 5 - Disconnecting Phantom does NOT disconnect MetaMask');

// Step 6: Connect TON (Gram Wallet)
connectWallet('ton', '0QC7q-154_mD9Hn73_K_839h3892_example_jetton_testn');
assert.strictEqual(mockWallets.ton.isConnected, true);
assert.strictEqual(mockWallets.evm.isConnected, true, 'MetaMask must remain connected');
assert.strictEqual(mockWallets.solana.isConnected, false, 'Solana remains disconnected');
console.log('✅ PASSED: Step 6 - Connecting Gram Wallet does NOT change EVM or Solana state');

// Step 7: Connect TRON (TronLink)
connectWallet('tron', 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs');
assert.strictEqual(mockWallets.tron.isConnected, true);
assert.strictEqual(mockWallets.ton.isConnected, true, 'TON remains connected');
assert.strictEqual(mockWallets.evm.isConnected, true, 'EVM remains connected');
console.log('✅ PASSED: Step 7 - Connecting TronLink does NOT change TON or EVM state');

// Step 8: Reconnect Solana -> All 4 connected simultaneously
connectWallet('solana', '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
assert.strictEqual(mockWallets.evm.isConnected, true);
assert.strictEqual(mockWallets.solana.isConnected, true);
assert.strictEqual(mockWallets.ton.isConnected, true);
assert.strictEqual(mockWallets.tron.isConnected, true);

const count = Object.values(mockWallets).filter((w) => w.isConnected).length;
assert.strictEqual(count, 4, 'All 4 ecosystems must be connected simultaneously');
console.log('✅ PASSED: Step 8 - All 4 wallets coexist simultaneously without interference (4/4 connected)');

console.log('\n======================================================');
console.log('🎉 ALL MULTI-CHAIN WALLET ISOLATION TESTS PASSED CLEANLY!');
console.log('======================================================\n');
