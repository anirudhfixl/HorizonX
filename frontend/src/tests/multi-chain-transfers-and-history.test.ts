import assert from 'node:assert';
import { formatUnits, parseUnits } from '../web3/utils/formatters';
import { SUPPORTED_TESTNETS } from '../web3/config/networks';
import {
  recordSubmittedEvmTransaction,
  fetchEvmTransactionHistory,
} from '../web3/services/transactions/evm-history';
import {
  recordSubmittedSolanaTransaction,
  fetchSolanaTransactionHistory,
} from '../web3/services/transactions/solana-history';
import {
  recordSubmittedTonTransaction,
  fetchTonTransactionHistory,
} from '../web3/services/transactions/ton-history';
import {
  recordSubmittedTronTransaction,
  fetchTronTransactionHistory,
} from '../web3/services/transactions/tron-history';
import type { TransactionRecord } from '../web3/types/transaction.types';

console.log('\n======================================================');
console.log('HORIZONX — MULTI-CHAIN TRANSFERS & HISTORY TESTS');
console.log('======================================================\n');

// -------------------------------------------------------------------
// 1. Decimals and Monetary Precision Tests
// -------------------------------------------------------------------
console.log('--- 1. Decimal Precision & Base Unit Conversions ---');

// EVM: 18 decimals
const oneEthInWei = 1_000_000_000_000_000_000n;
assert.strictEqual(formatUnits(oneEthInWei, 18, 4), '1.0000');
assert.strictEqual(formatUnits(500_000_000_000_000_000n, 18, 4), '0.5000');
assert.strictEqual(parseUnits('1.5', 18), 1_500_000_000_000_000_000n);
console.log('✅ PASSED: EVM 18-decimal formatting and parsing');

// Solana: 9 decimals
const oneSolInLamports = 1_000_000_000n;
assert.strictEqual(formatUnits(oneSolInLamports, 9, 4), '1.0000');
assert.strictEqual(formatUnits(5000n, 9, 6), '0.000005');
assert.strictEqual(parseUnits('2.25', 9), 2_250_000_000n);
console.log('✅ PASSED: Solana 9-decimal lamport formatting and parsing');

// TON: 9 decimals
const oneTonInNano = 1_000_000_000n;
assert.strictEqual(formatUnits(oneTonInNano, 9, 4), '1.0000');
assert.strictEqual(formatUnits(50_000_000n, 9, 4), '0.0500');
assert.strictEqual(parseUnits('0.1', 9), 100_000_000n);
console.log('✅ PASSED: TON 9-decimal nanoTON formatting and parsing');

// TRON: 6 decimals
const oneTrxInSun = 1_000_000n;
assert.strictEqual(formatUnits(oneTrxInSun, 6, 4), '1.0000');
assert.strictEqual(formatUnits(2_500_000n, 6, 4), '2.5000');
assert.strictEqual(parseUnits('10.5', 6), 10_500_000n);
console.log('✅ PASSED: TRON 6-decimal SUN formatting and parsing');

// -------------------------------------------------------------------
// 2. Testnet Explorer Link Formatting
// -------------------------------------------------------------------
console.log('\n--- 2. Network-Specific Testnet Explorer URLs ---');

const evmTx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const solanaTx = '5UfD8vxyzabcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const tonTx = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
const tronTx = '7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456';

const evmUrl = SUPPORTED_TESTNETS.evm.explorerTxUrl(evmTx);
assert.strictEqual(evmUrl, `https://sepolia.etherscan.io/tx/${evmTx}`);
console.log('✅ PASSED: EVM Sepolia explorer link formatted correctly');

const solUrl = SUPPORTED_TESTNETS.solana.explorerTxUrl(solanaTx);
assert.strictEqual(solUrl, `https://explorer.solana.com/tx/${solanaTx}?cluster=devnet`);
console.log('✅ PASSED: Solana Devnet explorer link formatted with ?cluster=devnet');

const tonUrl = SUPPORTED_TESTNETS.ton.explorerTxUrl(tonTx);
assert.strictEqual(tonUrl, `https://testnet.tonviewer.com/transaction/${tonTx}`);
console.log('✅ PASSED: TON Testnet explorer link formatted with testnet.tonviewer.com');

const tronUrl = SUPPORTED_TESTNETS.tron.explorerTxUrl(tronTx);
assert.strictEqual(tronUrl, `https://shasta.tronscan.org/#/transaction/${tronTx}`);
console.log('✅ PASSED: TRON Shasta explorer link formatted with shasta.tronscan.org');

// -------------------------------------------------------------------
// 3. Multi-Chain Transaction History Services
// -------------------------------------------------------------------
async function testTransactionHistories() {
  console.log('\n--- 3. Multi-Chain Transaction History Independent Tracking ---');

  const testSenderEvm = '0x71C9561E873f324A3B4323E56d3935a8286C4e39';
  const testRecipientEvm = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

  const mockEvmTx: TransactionRecord = {
    hash: evmTx,
    ecosystem: 'evm',
    direction: 'outgoing',
    assetSymbol: 'ETH',
    amount: '0.0500',
    sender: testSenderEvm,
    recipient: testRecipientEvm,
    timestamp: Date.now(),
    status: 'confirmed',
    networkName: 'Ethereum Sepolia Testnet',
    explorerUrl: evmUrl,
  };

  recordSubmittedEvmTransaction(mockEvmTx);
  const evmHistory = await fetchEvmTransactionHistory(testSenderEvm);
  assert.ok(evmHistory.length >= 1);
  assert.strictEqual(evmHistory[0].ecosystem, 'evm');
  assert.strictEqual(evmHistory[0].hash, evmTx);
  console.log('✅ PASSED: EVM transaction recorded and retrieved independently');

  const testSenderSol = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
  const mockSolTx: TransactionRecord = {
    hash: solanaTx,
    ecosystem: 'solana',
    direction: 'outgoing',
    assetSymbol: 'SOL',
    amount: '0.1000',
    sender: testSenderSol,
    recipient: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
    timestamp: Date.now(),
    status: 'confirmed',
    networkName: 'Solana Devnet',
    explorerUrl: solUrl,
  };

  recordSubmittedSolanaTransaction(mockSolTx);
  const solHistory = await fetchSolanaTransactionHistory(testSenderSol);
  assert.ok(solHistory.length >= 1);
  assert.strictEqual(solHistory[0].ecosystem, 'solana');
  assert.strictEqual(solHistory[0].hash, solanaTx);
  console.log('✅ PASSED: Solana transaction recorded and retrieved independently');

  const testSenderTon = '0QC7q-154_mD9Hn73_K_839h3892_example_jetton_testn';
  const mockTonTx: TransactionRecord = {
    hash: tonTx,
    ecosystem: 'ton',
    direction: 'outgoing',
    assetSymbol: 'TON',
    amount: '0.5000',
    sender: testSenderTon,
    recipient: 'kQC7q-154_mD9Hn73_K_839h3892_example_jetton_testn',
    timestamp: Date.now(),
    status: 'confirmed',
    networkName: 'TON Testnet',
    explorerUrl: tonUrl,
  };

  recordSubmittedTonTransaction(mockTonTx);
  const tonHistory = await fetchTonTransactionHistory(testSenderTon);
  assert.ok(tonHistory.length >= 1);
  assert.strictEqual(tonHistory[0].ecosystem, 'ton');
  assert.strictEqual(tonHistory[0].hash, tonTx);
  console.log('✅ PASSED: TON transaction recorded and retrieved independently');

  const testSenderTron = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
  const mockTronTx: TransactionRecord = {
    hash: tronTx,
    ecosystem: 'tron',
    direction: 'outgoing',
    assetSymbol: 'TRX',
    amount: '10.0000',
    sender: testSenderTron,
    recipient: 'TNDP5uPZJ9dG1893XmXz1839a83jK2193b',
    timestamp: Date.now(),
    status: 'confirmed',
    networkName: 'TRON Shasta Testnet',
    explorerUrl: tronUrl,
  };

  recordSubmittedTronTransaction(mockTronTx);
  const tronHistory = await fetchTronTransactionHistory(testSenderTron);
  assert.ok(tronHistory.length >= 1);
  assert.strictEqual(tronHistory[0].ecosystem, 'tron');
  assert.strictEqual(tronHistory[0].hash, tronTx);
  console.log('✅ PASSED: TRON transaction recorded and retrieved independently');

  // Verify that histories do NOT bleed into each other
  assert.strictEqual(
    evmHistory.every((tx) => tx.ecosystem === 'evm'),
    true,
    'EVM history must contain ONLY EVM transactions'
  );
  assert.strictEqual(
    solHistory.every((tx) => tx.ecosystem === 'solana'),
    true,
    'Solana history must contain ONLY Solana transactions'
  );
  assert.strictEqual(
    tonHistory.every((tx) => tx.ecosystem === 'ton'),
    true,
    'TON history must contain ONLY TON transactions'
  );
  assert.strictEqual(
    tronHistory.every((tx) => tx.ecosystem === 'tron'),
    true,
    'TRON history must contain ONLY TRON transactions'
  );
  console.log('✅ PASSED: Complete transaction history isolation across all 4 ecosystems verified');

  console.log('\n======================================================');
  console.log('🎉 ALL MULTI-CHAIN TRANSFERS & HISTORY TESTS PASSED!');
  console.log('======================================================\n');
}

testTransactionHistories().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
