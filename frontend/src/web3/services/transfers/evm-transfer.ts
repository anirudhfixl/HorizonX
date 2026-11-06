import { createPublicClient, http, parseEther, parseUnits as viemParseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { EVM_SEPOLIA_CONFIG } from '../../config/networks';
import { SEPOLIA_CHAIN_ID } from '../../config/evm.config';
import { validateAddress } from '../../utils/address-validation';
import { validateTestnetNetwork } from '../../utils/network-validation';
import type { SendTransactionParams, SendTransactionResult } from '../../types/transaction.types';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(EVM_SEPOLIA_CONFIG.rpcUrls[0], { timeout: 15_000 }),
});

export async function estimateEvmTransferGas(
  from: string,
  to: string,
  amountEth: string
): Promise<{ gasLimit: bigint; maxFeePerGas: bigint; estimatedFeeEth: string }> {
  validateAddress('evm', from);
  validateAddress('evm', to);

  const value = parseEther(amountEth || '0');
  const [gasLimit, feeData] = await Promise.all([
    publicClient.estimateGas({
      account: from as `0x${string}`,
      to: to as `0x${string}`,
      value,
    }).catch(() => 21000n),
    publicClient.estimateFeesPerGas().catch(() => ({
      maxFeePerGas: 2000000000n, // 2 gwei fallback
      maxPriorityFeePerGas: 1000000000n,
    })),
  ]);

  const maxFeePerGas = feeData.maxFeePerGas ?? 2000000000n;
  const estimatedCostWei = gasLimit * maxFeePerGas;
  const estimatedFeeEth = (Number(estimatedCostWei) / 1e18).toFixed(6);

  return { gasLimit, maxFeePerGas, estimatedFeeEth };
}

export async function sendEvmTransfer(
  params: SendTransactionParams,
  fromAddress: string,
  chainId: number | string | null | undefined
): Promise<SendTransactionResult> {
  // 1. Validate Network strictly
  validateTestnetNetwork('evm', chainId);
  if (Number(chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error(`Invalid EVM Chain ID ${chainId}. Only Sepolia (${SEPOLIA_CHAIN_ID}) is permitted.`);
  }

  // 2. Validate Addresses
  if (!validateAddress('evm', fromAddress)) {
    throw new Error(`Invalid sender EVM address: ${fromAddress}`);
  }
  if (!validateAddress('evm', params.recipient)) {
    throw new Error(`Invalid recipient EVM address: ${params.recipient}`);
  }
  if (fromAddress.toLowerCase() === params.recipient.toLowerCase()) {
    throw new Error('Sender and recipient addresses cannot be identical.');
  }

  // 3. Validate Amount
  const parsedAmount = parseFloat(params.amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Transfer amount must be greater than zero.');
  }

  // 4. Request Signature & Broadcast via Injected Provider (MetaMask / EIP-1193)
  if (typeof window === 'undefined' || !(window as unknown as { ethereum?: { request: (args: unknown) => Promise<string> } }).ethereum) {
    throw new Error('No Ethereum wallet provider (MetaMask) found in this browser.');
  }

  const ethereum = (window as unknown as { ethereum: { request: (args: { method: string; params: unknown[] }) => Promise<string> } }).ethereum;

  let txHash: string;

  if (!params.tokenAddress) {
    // Native ETH Transfer
    const valueHex = `0x${parseEther(params.amount).toString(16)}`;
    txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: fromAddress,
        to: params.recipient,
        value: valueHex,
      }],
    });
  } else {
    // ERC-20 Token Transfer
    const ERC20_TRANSFER_SELECTOR = '0xa9059cbb'; // transfer(address,uint256)
    const cleanTo = params.recipient.toLowerCase().replace(/^0x/, '').padStart(64, '0');
    const tokenAmountWei = viemParseUnits(params.amount, 18);
    const amountHex = tokenAmountWei.toString(16).padStart(64, '0');
    const data = `${ERC20_TRANSFER_SELECTOR}${cleanTo}${amountHex}`;

    txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: fromAddress,
        to: params.tokenAddress,
        data,
      }],
    });
  }

  if (!txHash || !txHash.startsWith('0x')) {
    throw new Error('Transaction submission failed: no valid transaction hash returned by wallet.');
  }

  return {
    hash: txHash,
    explorerUrl: EVM_SEPOLIA_CONFIG.explorerTxUrl(txHash),
    status: 'pending',
  };
}

export async function waitForEvmReceipt(txHash: string): Promise<'confirmed' | 'reverted'> {
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      timeout: 60_000,
    });
    return receipt.status === 'success' ? 'confirmed' : 'reverted';
  } catch {
    return 'confirmed';
  }
}

