import { TRON_SHASTA_CONFIG } from '../../config/networks';
import { TRON_SHASTA_CHAIN_ID } from '../../config/tron.config';
import { validateAddress } from '../../utils/address-validation';
import { validateTestnetNetwork } from '../../utils/network-validation';
import type { SendTransactionParams, SendTransactionResult } from '../../types/transaction.types';

const TRON_API_BASE = TRON_SHASTA_CONFIG.rpcUrls[0];

export async function estimateTronTransferFee(): Promise<{ feeSun: bigint; estimatedFeeTrx: string }> {
  // Typical bandwidth / energy allocation fee for native TRX transfer
  const feeSun = 1_000_000n; // 1 TRX
  const estimatedFeeTrx = '1.000000';
  return { feeSun, estimatedFeeTrx };
}

interface TronWebInstance {
  ready?: boolean;
  defaultAddress?: { base58: string; hex: string };
  trx: {
    sendTransaction: (to: string, amount: number) => Promise<{ result: boolean; txid: string }>;
    sign: (transaction: unknown) => Promise<unknown>;
    sendRawTransaction: (signedTransaction: unknown) => Promise<{ result: boolean; txid: string }>;
    getTransaction: (txId: string) => Promise<{ ret?: Array<{ contractRet: string }> }>;
  };
  transactionBuilder: {
    sendTrx: (to: string, amount: number, from: string) => Promise<unknown>;
  };
}

function getTronWeb(): TronWebInstance | null {
  if (typeof window === 'undefined') return null;
  const anyWin = window as unknown as { tronWeb?: TronWebInstance; tronLink?: { tronWeb?: TronWebInstance } };
  return anyWin?.tronWeb || anyWin?.tronLink?.tronWeb || null;
}

export async function sendTronTransfer(
  params: SendTransactionParams,
  fromAddress: string,
  chainId: number | string | null | undefined
): Promise<SendTransactionResult> {
  // 1. Validate Network strictly
  validateTestnetNetwork('tron', chainId ?? TRON_SHASTA_CHAIN_ID);
  if (String(chainId ?? TRON_SHASTA_CHAIN_ID).toLowerCase() !== TRON_SHASTA_CHAIN_ID.toLowerCase()) {
    throw new Error(`Invalid TRON Chain ID ${chainId}. Only Shasta (${TRON_SHASTA_CHAIN_ID}) is permitted.`);
  }

  // 2. Validate Addresses
  if (!validateAddress('tron', fromAddress)) {
    throw new Error(`Invalid sender TRON address: ${fromAddress}`);
  }
  if (!validateAddress('tron', params.recipient)) {
    throw new Error(`Invalid recipient TRON address: ${params.recipient}. Must be a valid TRON address starting with T.`);
  }
  if (fromAddress === params.recipient) {
    throw new Error('Sender and recipient addresses cannot be identical.');
  }

  // 3. Validate Amount
  const amountNumber = parseFloat(params.amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    throw new Error('Transfer amount must be greater than zero.');
  }

  const sunAmount = Math.round(amountNumber * 1e6);

  // 4. Request Signature & Broadcast via TronLink / TronWeb
  const tronWeb = getTronWeb();
  let txId: string;

  if (tronWeb && tronWeb.trx) {
    try {
      const res = await tronWeb.trx.sendTransaction(params.recipient, sunAmount);
      if (!res.result || !res.txid) {
        throw new Error('TronLink transfer was rejected or failed on submission.');
      }
      txId = res.txid;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/declin|reject|cancel|denied/i.test(msg)) {
        throw new Error('Transaction was rejected in TronLink.');
      }
      throw new Error(`TronLink signing failed: ${msg}`);
    }
  } else {
    // If TronWeb is not injected, build unsigned via Shasta API and request provider
    const createUrl = `${TRON_API_BASE}/wallet/createtransaction`;
    const res = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_address: fromAddress,
        to_address: params.recipient,
        amount: sunAmount,
        visible: true,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create Shasta transfer transaction.');
    }

    const txData = await res.json();
    if (!txData.txID) {
      throw new Error('Invalid transaction envelope created by Shasta node.');
    }

    throw new Error('TronLink extension required to sign the Shasta transaction.');
  }

  return {
    hash: txId,
    explorerUrl: TRON_SHASTA_CONFIG.explorerTxUrl(txId),
    status: 'pending',
  };
}

export async function checkTronTransactionStatus(txId: string): Promise<'confirmed' | 'failed' | 'pending'> {
  try {
    const url = `${TRON_API_BASE}/wallet/gettransactionbyid`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: txId }),
    });

    if (!res.ok) return 'pending';
    const json = await res.json();
    if (!json.txID) return 'pending';

    const contractRet = json?.ret?.[0]?.contractRet;
    if (contractRet === 'SUCCESS') return 'confirmed';
    if (contractRet === 'REVERT' || contractRet === 'FAIL') return 'failed';
    return 'pending';
  } catch {
    return 'pending';
  }
}

