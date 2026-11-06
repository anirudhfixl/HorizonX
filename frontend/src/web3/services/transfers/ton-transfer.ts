import { TON_TESTNET_CONFIG } from '../../config/networks';
import { TON_TESTNET_CHAIN_ID } from '../../config/ton.config';
import { validateAddress } from '../../utils/address-validation';
import { validateTestnetNetwork } from '../../utils/network-validation';
import type { SendTransactionParams, SendTransactionResult } from '../../types/transaction.types';

export async function estimateTonTransferFee(): Promise<{ feeNano: bigint; estimatedFeeTon: string }> {
  // Standard TON testnet transfer fee estimate
  const feeNano = 50_000_000n; // 0.05 TON reserve
  const estimatedFeeTon = '0.0500';
  return { feeNano, estimatedFeeTon };
}

export interface TonConnectSender {
  sendTransaction: (tx: {
    validUntil: number;
    messages: Array<{ address: string; amount: string; payload?: string }>;
  }) => Promise<{ boc: string }>;
}

export async function sendTonTransfer(
  params: SendTransactionParams,
  fromAddress: string,
  chainId: number | string | null | undefined,
  tonConnectSender?: TonConnectSender | null
): Promise<SendTransactionResult> {
  // 1. Validate Network strictly
  validateTestnetNetwork('ton', chainId ?? TON_TESTNET_CHAIN_ID);
  if (Number(chainId ?? TON_TESTNET_CHAIN_ID) !== TON_TESTNET_CHAIN_ID) {
    throw new Error(`Invalid TON Chain ID ${chainId}. Only Testnet (-3) is permitted.`);
  }

  // 2. Validate Addresses
  if (!validateAddress('ton', fromAddress)) {
    throw new Error(`Invalid sender TON address: ${fromAddress}`);
  }
  if (!validateAddress('ton', params.recipient)) {
    throw new Error(`Invalid recipient TON address: ${params.recipient}. Must be a valid TON testnet address.`);
  }
  if (fromAddress === params.recipient) {
    throw new Error('Sender and recipient addresses cannot be identical.');
  }

  // 3. Validate Amount
  const amountNumber = parseFloat(params.amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    throw new Error('Transfer amount must be greater than zero.');
  }

  const nanoTon = BigInt(Math.round(amountNumber * 1e9));

  // 4. Request Signature & Broadcast via TON Connect
  if (!tonConnectSender) {
    // Official TON Connect JS Bridge discovery for Gram Wallet (jsBridgeKey: gramwallet)
    const anyWin = typeof window !== 'undefined'
      ? (window as unknown as {
          tonconnect?: Record<string, TonConnectSender>;
          gramwallet?: TonConnectSender;
          gramWallet?: TonConnectSender;
        })
      : null;
    const provider =
      anyWin?.tonconnect?.gramwallet ||
      anyWin?.gramwallet ||
      anyWin?.gramWallet;

    if (!provider) {
      throw new Error('Gram Wallet provider not connected. Please connect Gram Wallet.');
    }
    tonConnectSender = provider;
  }

  const validUntil = Math.floor(Date.now() / 1000) + 300; // 5 minutes validity

  const txPayload = {
    validUntil,
    messages: [
      {
        address: params.recipient,
        amount: nanoTon.toString(),
      },
    ],
  };

  try {
    const result = await tonConnectSender.sendTransaction(txPayload);
    // TON Connect returns { boc: string }. Hash of the outer message or boc identifier
    const txHash = result.boc ? result.boc.slice(0, 64) : `ton-${Date.now()}`;

    return {
      hash: txHash,
      explorerUrl: TON_TESTNET_CONFIG.explorerTxUrl(txHash),
      status: 'pending',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/reject|cancel|declined/i.test(msg)) {
      throw new Error('Transaction was declined in Gram Wallet.');
    }
    throw new Error(`TON transfer failed: ${msg}`);
  }
}

