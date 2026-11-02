import React from "react";
import { useModal } from "@/contexts/modal-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export function RiskWarningModal() {
  const { isOpen, closeModal } = useModal();
  const open = isOpen("RISK_WARNING");

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2 text-amber-500">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
              Risk Disclosure & Disclaimer
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Please read carefully before interacting with smart contracts, presales, or tokens.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-3 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Cryptocurrency trading, token creation, and liquidity participation carry high financial risk.
                Only allocate capital you are willing to lose entirely.
              </p>
            </div>
          </div>
          <p>
            • <strong>Permissionless Contracts:</strong> ProMiners facilitates decentralized tooling. Tokens and presales can be created by any third party without custodial endorsement.
          </p>
          <p>
            • <strong>No Financial Advice:</strong> Content, metrics, and analytics displayed across ProMiners do not constitute investment or financial advisory.
          </p>
          <p>
            • <strong>Smart Contract Risk:</strong> While contracts are audited and verified where noted, blockchain protocols are subject to inherent technological risks.
          </p>
        </div>

        <div className="pt-3 border-t border-border/40 flex justify-end">
          <Button
            size="sm"
            onClick={closeModal}
            className="bg-primary text-primary-foreground font-semibold px-4"
          >
            I Understand & Acknowledge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
