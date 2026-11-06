import { SOLANA_DEVNET_CONFIG } from '../../config/networks';
import { validateAddress } from '../../utils/address-validation';
import { validateTestnetNetwork } from '../../utils/network-validation';
import type { SendTransactionParams, SendTransactionResult } from '../../types/transaction.types';

const SOLANA_RPC_URL = SOLANA_DEVNET_CONFIG.rpcUrls[0];

async function solanaRpc(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC error: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(`Solana RPC error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  return json.result;
}

export async function estimateSolanaTransferFee(): Promise<{ feeLamports: bigint; estimatedFeeSol: string }> {
  // Standard Solana Devnet signature fee
  const feeLamports = 5000n;
  const estimatedFeeSol = '0.000005';
  return { feeLamports, estimatedFeeSol };
}

export async function getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
  const result = (await solanaRpc('getLatestBlockhash', [{ commitment: 'confirmed' }])) as {
    value: { blockhash: string; lastValidBlockHeight: number };
  };

  return {
    blockhash: result.value.blockhash,
    lastValidBlockHeight: result.value.lastValidBlockHeight,
  };
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toBase58: () => string; toString: () => string };
  signAndSendTransaction: (transaction: unknown) => Promise<{ signature: string }>;
  connect: (args?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
}

function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as unknown as { phantom?: { solana?: PhantomProvider }; solana?: PhantomProvider };
  const provider = anyWindow?.phantom?.solana || anyWindow?.solana;
  if (provider && provider.isPhantom) return provider;
  return provider || null;
}

export async function sendSolanaTransfer(
  params: SendTransactionParams,
  fromAddress: string,
  networkCluster: string | null | undefined
): Promise<SendTransactionResult> {
  // 1. Validate Network strictly
  validateTestnetNetwork('solana', networkCluster || 'devnet');

  // 2. Validate Addresses
  if (!validateAddress('solana', fromAddress)) {
    throw new Error(`Invalid sender Solana address: ${fromAddress}`);
  }
  if (!validateAddress('solana', params.recipient)) {
    throw new Error(`Invalid recipient Solana address: ${params.recipient}`);
  }
  if (fromAddress === params.recipient) {
    throw new Error('Sender and recipient addresses cannot be identical.');
  }

  // 3. Validate Amount
  const amountNumber = parseFloat(params.amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    throw new Error('Transfer amount must be greater than zero.');
  }

  const lamports = BigInt(Math.round(amountNumber * 1e9));

  // 4. Request Signature & Broadcast via Phantom
  const phantom = getPhantomProvider();
  if (!phantom) {
    throw new Error('No Solana wallet (Phantom) found in this browser. Please install Phantom.');
  }

  // If Solana Web3 library is loaded in runtime or custom serializer:
  // We build transfer transaction instruction or request wallet
  const { blockhash } = await getLatestBlockhash();

  // Use Phantom's signAndSendTransaction with the built instruction or transaction
  // If the browser environment exposes @solana/web3.js or we construct the binary transaction:
  let signature: string;

  try {
    // Attempt standard window.solana signAndSendTransaction
    const txObj = {
      recentBlockhash: blockhash,
      feePayer: fromAddress,
      instructions: [
        {
          programId: '11111111111111111111111111111111', // SystemProgram
          keys: [
            { pubkey: fromAddress, isSigner: true, isWritable: true },
            { pubkey: params.recipient, isSigner: false, isWritable: true },
          ],
          data: lamports,
        },
      ],
    };

    const res = await phantom.signAndSendTransaction(txObj);
    signature = res.signature;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/reject|cancel|denied/i.test(msg)) {
      throw new Error('Transaction was cancelled in Phantom.');
    }
    throw new Error(`Solana transfer failed: ${msg}`);
  }

  return {
    hash: signature,
    explorerUrl: SOLANA_DEVNET_CONFIG.explorerTxUrl(signature),
    status: 'pending',
  };
}

export async function checkSolanaSignatureStatus(signature: string): Promise<'confirmed' | 'failed' | 'pending'> {
  try {
    const result = (await solanaRpc('getSignatureStatuses', [
      [signature],
      { searchTransactionHistory: true },
    ])) as { value: Array<{ confirmationStatus?: string; err?: unknown } | null> };

    const statusObj = result?.value?.[0];
    if (!statusObj) return 'pending';
    if (statusObj.err) return 'failed';
    if (statusObj.confirmationStatus === 'confirmed' || statusObj.confirmationStatus === 'finalized') {
      return 'confirmed';
    }
    return 'pending';
  } catch {
    return 'pending';
  }
}
