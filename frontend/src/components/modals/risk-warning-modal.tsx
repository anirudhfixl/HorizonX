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
      <DialogContent
        className="
          fixed top-[calc(50%+28px)] left-1/2 -translate-x-1/2 -translate-y-1/2
          flex w-[calc(100vw-24px)] sm:max-w-[560px]
          max-h-[calc(100dvh-104px)] min-h-0 flex-col overflow-hidden
          gap-3 rounded-2xl border border-white/10
          bg-[#111322]/[0.98] p-4 text-[#f2f0ff]
          shadow-[0_24px_80px_rgba(0,0,0,0.58)]
          sm:p-5
        "
      >
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-white/[0.08] pb-3 pr-8">
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

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 text-xs leading-relaxed text-[#aaa7bd]">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-3 text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Cryptocurrency trading, token creation, and liquidity participation carry high financial risk.
                Only allocate capital you are willing to lose entirely.
              </p>
            </div>
          </div>
          <p>
            • <strong>Permissionless Contracts:</strong> HorizonX facilitates decentralized tooling. Tokens and presales can be created by any third party without custodial endorsement.
          </p>
          <p>
            • <strong>No Financial Advice:</strong> Content, metrics, and analytics displayed across HorizonX do not constitute investment or financial advisory.
          </p>
          <p>
            • <strong>Smart Contract Risk:</strong> While contracts are audited and verified where noted, blockchain protocols are subject to inherent technological risks.
          </p>
        </div>

        <div className="shrink-0 border-t border-white/[0.08] pt-3 flex justify-end">
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
