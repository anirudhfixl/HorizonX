import React, { useState, useEffect } from 'react';
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
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Wallet,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { QrCodeSvg } from '@/web3/utils/qr-code';
import { SUPPORTED_TESTNETS } from '@/web3/config/networks';
import type { BlockchainEcosystem } from '@/web3/types/wallet.types';

export function ReceiveTransactionModal() {
  const { isOpen, closeModal, modalProps } = useModal();
  const multiWallet = useMultiWallet();

  const initialEcosystem = (modalProps?.ecosystem as BlockchainEcosystem) || 'evm';
  const [selectedEcosystem, setSelectedEcosystem] = useState<BlockchainEcosystem>(initialEcosystem);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (modalProps?.ecosystem) {
      setSelectedEcosystem(modalProps.ecosystem as BlockchainEcosystem);
    }
  }, [modalProps?.ecosystem]);

  const activeWallet = multiWallet[selectedEcosystem];
  const networkConfig = SUPPORTED_TESTNETS[selectedEcosystem];

  const open = isOpen('RECEIVE_TRANSACTION');

  const handleCopy = () => {
    if (activeWallet.address) {
      navigator.clipboard.writeText(activeWallet.address);
      setCopied(true);
      toast.success('Address Copied', {
        description: `${networkConfig.shortName} address copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 text-foreground">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <QrCode className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Receive Testnet Assets
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Strict Testnet · {networkConfig.networkName}
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
                onClick={() => setSelectedEcosystem(eco)}
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

        {!activeWallet.isConnected || !activeWallet.address ? (
          <div className="space-y-4 py-8 text-center">
            <Wallet className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {networkConfig.networkName} Disconnected
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your {activeWallet.walletName} wallet to view your receive address and QR code.
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
          <div className="space-y-5 pt-2 text-center">
            {/* SVG QR Code */}
            <div className="flex justify-center">
              <QrCodeSvg value={activeWallet.address} size={170} />
            </div>

            {/* Address Display & Copy */}
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Your {networkConfig.shortName} Address
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs break-all text-foreground select-all bg-background/50 p-2 rounded-lg border border-border/30">
                {activeWallet.address}
              </p>
            </div>

            {/* Testnet Warning Notice */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-200/90 leading-relaxed">
                <strong>Testnet-Only Address:</strong> Send only testnet tokens on {networkConfig.networkName}.
                Mainnet transfers or assets from other blockchains will not be recognized.
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <Button asChild size="sm" variant="outline" className="text-xs border-border/60 gap-1.5">
                <a
                  href={networkConfig.explorerAddressUrl(activeWallet.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button size="sm" onClick={closeModal} className="text-xs font-semibold px-5">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

