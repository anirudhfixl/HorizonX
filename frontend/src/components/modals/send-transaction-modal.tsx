import React, { useState, useEffect, useMemo } from 'react';
import { useModal } from '@/contexts/modal-context';
import { useMultiWallet } from '@/web3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { validateAddress } from '@/web3/utils/address-validation';
import { sendEvmTransfer, estimateEvmTransferGas } from '@/web3/services/transfers/evm-transfer';
import { sendSolanaTransfer, estimateSolanaTransferFee } from '@/web3/services/transfers/solana-transfer';
import { sendTonTransfer, estimateTonTransferFee } from '@/web3/services/transfers/ton-transfer';
import { sendTronTransfer, estimateTronTransferFee } from '@/web3/services/transfers/tron-transfer';
import { recordSubmittedEvmTransaction } from '@/web3/services/transactions/evm-history';
import { recordSubmittedSolanaTransaction } from '@/web3/services/transactions/solana-history';
import { recordSubmittedTonTransaction } from '@/web3/services/transactions/ton-history';
import { recordSubmittedTronTransaction } from '@/web3/services/transactions/tron-history';
import { SUPPORTED_TESTNETS } from '@/web3/config/networks';
import type { BlockchainEcosystem } from '@/web3/types/wallet.types';

export function SendTransactionModal() {
  const { isOpen, closeModal, modalProps } = useModal();
  const multiWallet = useMultiWallet();

  const initialEcosystem = (modalProps?.ecosystem as BlockchainEcosystem) || 'evm';
  const [selectedEcosystem, setSelectedEcosystem] = useState<BlockchainEcosystem>(initialEcosystem);

  useEffect(() => {
    if (modalProps?.ecosystem) {
      setSelectedEcosystem(modalProps.ecosystem as BlockchainEcosystem);
    }
  }, [modalProps?.ecosystem]);

  const activeWallet = multiWallet[selectedEcosystem];
  const networkConfig = SUPPORTED_TESTNETS[selectedEcosystem];

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<string>('NATIVE');

  const [estimatedFee, setEstimatedFee] = useState<string>('Calculating...');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [txSuccessResult, setTxSuccessResult] = useState<{ hash: string; explorerUrl: string } | null>(null);

  const open = isOpen('SEND_TRANSACTION');

  // Recipient address validity check
  const isRecipientValid = useMemo(() => {
    if (!recipient.trim()) return false;
    return validateAddress(selectedEcosystem, recipient.trim());
  }, [recipient, selectedEcosystem]);

  // Available balance
  const availableBalance = useMemo(() => {
    if (selectedAsset === 'NATIVE') {
      return activeWallet.nativeBalance;
    }
    const token = activeWallet.tokens.find((t) => t.symbol === selectedAsset);
    return token ? token.balance : '0.0000';
  }, [selectedAsset, activeWallet.nativeBalance, activeWallet.tokens]);

  // Estimate Fee effect
  useEffect(() => {
    let isCancelled = false;

    async function updateFee() {
      if (!activeWallet.isConnected || !activeWallet.address) {
        setEstimatedFee('Connect wallet');
        return;
      }

      setEstimatedFee('Estimating...');
      try {
        if (selectedEcosystem === 'evm') {
          const to = isRecipientValid ? recipient.trim() : '0x0000000000000000000000000000000000000000';
          const { estimatedFeeEth } = await estimateEvmTransferGas(activeWallet.address, to, amount || '0.001');
          if (!isCancelled) setEstimatedFee(`~${estimatedFeeEth} ETH`);
        } else if (selectedEcosystem === 'solana') {
          const { estimatedFeeSol } = await estimateSolanaTransferFee();
          if (!isCancelled) setEstimatedFee(`~${estimatedFeeSol} SOL`);
        } else if (selectedEcosystem === 'ton') {
          const { estimatedFeeTon } = await estimateTonTransferFee();
          if (!isCancelled) setEstimatedFee(`~${estimatedFeeTon} TON`);
        } else if (selectedEcosystem === 'tron') {
          const { estimatedFeeTrx } = await estimateTronTransferFee();
          if (!isCancelled) setEstimatedFee(`~${estimatedFeeTrx} TRX`);
        }
      } catch {
        if (!isCancelled) setEstimatedFee('Dynamic (Network default)');
      }
    }

    updateFee();
    return () => {
      isCancelled = true;
    };
  }, [selectedEcosystem, activeWallet.isConnected, activeWallet.address, recipient, amount, isRecipientValid]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWallet.isConnected || !activeWallet.address) {
      setSubmissionError('Wallet is not connected.');
      return;
    }
    if (!isRecipientValid) {
      setSubmissionError(`Invalid ${networkConfig.networkName} address.`);
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setSubmissionError('Please enter a valid amount greater than 0.');
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      let result: { hash: string; explorerUrl: string };
      const tokenObj = selectedAsset !== 'NATIVE' ? activeWallet.tokens.find((t) => t.symbol === selectedAsset) : undefined;
      const sendParams = {
        recipient: recipient.trim(),
        amount: amount.trim(),
        tokenAddress: tokenObj?.address,
        assetSymbol: selectedAsset === 'NATIVE' ? activeWallet.nativeSymbol : selectedAsset,
      };

      if (selectedEcosystem === 'evm') {
        result = await sendEvmTransfer(sendParams, activeWallet.address, activeWallet.chainId);
        recordSubmittedEvmTransaction({
          hash: result.hash,
          ecosystem: 'evm',
          direction: 'outgoing',
          assetSymbol: sendParams.assetSymbol,
          amount: sendParams.amount,
          sender: activeWallet.address,
          recipient: sendParams.recipient,
          timestamp: Date.now(),
          status: 'pending',
          networkName: networkConfig.networkName,
          explorerUrl: result.explorerUrl,
        });
      } else if (selectedEcosystem === 'solana') {
        result = await sendSolanaTransfer(sendParams, activeWallet.address, String(activeWallet.chainId));
        recordSubmittedSolanaTransaction({
          hash: result.hash,
          ecosystem: 'solana',
          direction: 'outgoing',
          assetSymbol: sendParams.assetSymbol,
          amount: sendParams.amount,
          sender: activeWallet.address,
          recipient: sendParams.recipient,
          timestamp: Date.now(),
          status: 'pending',
          networkName: networkConfig.networkName,
          explorerUrl: result.explorerUrl,
        });
      } else if (selectedEcosystem === 'ton') {
        result = await sendTonTransfer(sendParams, activeWallet.address, activeWallet.chainId);
        recordSubmittedTonTransaction({
          hash: result.hash,
          ecosystem: 'ton',
          direction: 'outgoing',
          assetSymbol: sendParams.assetSymbol,
          amount: sendParams.amount,
          sender: activeWallet.address,
          recipient: sendParams.recipient,
          timestamp: Date.now(),
          status: 'pending',
          networkName: networkConfig.networkName,
          explorerUrl: result.explorerUrl,
        });
      } else {
        result = await sendTronTransfer(sendParams, activeWallet.address, activeWallet.chainId);
        recordSubmittedTronTransaction({
          hash: result.hash,
          ecosystem: 'tron',
          direction: 'outgoing',
          assetSymbol: sendParams.assetSymbol,
          amount: sendParams.amount,
          sender: activeWallet.address,
          recipient: sendParams.recipient,
          timestamp: Date.now(),
          status: 'pending',
          networkName: networkConfig.networkName,
          explorerUrl: result.explorerUrl,
        });
      }

      setTxSuccessResult(result);
      toast.success('Transaction Submitted!', {
        description: `Submitted to ${networkConfig.shortName}. Click to view on explorer.`,
      });
      activeWallet.refreshBalance();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setSubmissionError(msg);
      toast.error('Transaction Failed', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTxSuccessResult(null);
    setRecipient('');
    setAmount('');
    setSubmissionError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 text-foreground">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Send className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Send Testnet Assets
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Strict Testnet Execution · {networkConfig.networkName}
                </DialogDescription>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {networkConfig.shortName}
            </span>
          </div>
        </DialogHeader>

        {/* Network Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-secondary/30 border border-border/40 text-xs">
          {(['evm', 'solana', 'ton', 'tron'] as BlockchainEcosystem[]).map((eco) => {
            const isSelected = selectedEcosystem === eco;
            const w = multiWallet[eco];
            return (
              <button
                key={eco}
                type="button"
                onClick={() => {
                  setSelectedEcosystem(eco);
                  handleReset();
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold text-center transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="truncate uppercase">{eco}</div>
                <div className="text-[9px] opacity-80">{w.isConnected ? '● Connected' : '○ Off'}</div>
              </button>
            );
          })}
        </div>

        {txSuccessResult ? (
          <div className="space-y-4 py-4 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Transaction Broadcasted</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your transfer was signed and submitted to {networkConfig.networkName}.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-left space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Transaction Hash</span>
              <p className="font-mono text-xs break-all text-primary">{txSuccessResult.hash}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                <a href={txSuccessResult.explorerUrl} target="_blank" rel="noopener noreferrer">
                  View on Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button size="sm" onClick={handleReset} className="text-xs">
                Send Another
              </Button>
            </div>
          </div>
        ) : !activeWallet.isConnected ? (
          <div className="space-y-4 py-6 text-center">
            <Wallet className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {networkConfig.shortName} Wallet Disconnected
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your {activeWallet.walletName} wallet to send {activeWallet.nativeSymbol}.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => activeWallet.connect()}
              disabled={activeWallet.isConnecting}
              className="text-xs"
            >
              {activeWallet.isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              Connect {activeWallet.walletName}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 pt-1">
            {submissionError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="break-words leading-relaxed">{submissionError}</span>
              </div>
            )}

            {/* Recipient Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="recipient" className="text-xs font-semibold">Recipient Address</Label>
                {recipient.trim() && (
                  <span className={`text-[10px] font-semibold ${isRecipientValid ? 'text-emerald-400' : 'text-destructive'}`}>
                    {isRecipientValid ? '✓ Valid format' : '✗ Invalid address'}
                  </span>
                )}
              </div>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={`Enter ${networkConfig.shortName} recipient address`}
                className="font-mono text-xs border-border/60"
                required
              />
            </div>

            {/* Asset Selection & Available Balance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="asset" className="text-xs font-semibold">Asset</Label>
                <span className="text-[11px] text-muted-foreground">
                  Available: <span className="font-semibold text-foreground">{availableBalance}</span>
                </span>
              </div>
              <select
                id="asset"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="NATIVE">{activeWallet.nativeSymbol} (Native Testnet)</option>
                {activeWallet.tokens.map((token) => (
                  <option key={token.address} value={token.symbol}>
                    {token.symbol} — {token.name} ({token.balance})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="amount" className="text-xs font-semibold">Amount</Label>
                <button
                  type="button"
                  onClick={() => {
                    const max = parseFloat(availableBalance);
                    if (!isNaN(max) && max > 0) {
                      // Leave a small buffer for gas if native asset
                      const safeMax = selectedAsset === 'NATIVE' ? Math.max(0, max - 0.01).toFixed(4) : availableBalance;
                      setAmount(safeMax);
                    }
                  }}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Max
                </button>
              </div>
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-xs border-border/60"
                required
              />
            </div>

            {/* Transaction Fee Preview */}
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Estimated Network Fee:</span>
                <span className="font-mono text-foreground font-semibold">{estimatedFee}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 pt-1">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>Testnet transaction only. No real funds are involved.</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isRecipientValid || !amount}
              className="w-full text-xs font-semibold gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Broadcasting to {networkConfig.shortName}...
                </>
              ) : (
                <>
                  Send {amount || '0'} {selectedAsset === 'NATIVE' ? activeWallet.nativeSymbol : selectedAsset}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
