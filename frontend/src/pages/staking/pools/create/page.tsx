import React, { useState } from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import { Layers, LockKeyhole, Network, ShieldCheck, Wallet } from "lucide-react";

const fieldClassName =
  "w-full rounded-lg border border-border bg-secondary/40 px-3.5 py-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors hover:border-foreground/25 " +
  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25";

export default function CreateStakingPoolPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [poolName, setPoolName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [apy, setApy] = useState("");
  const [lockDays, setLockDays] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }

    if (!poolName.trim() || !tokenAddress.trim()) {
      toast.error("Complete the required vault details.");
      return;
    }

    const apyValue = Number(apy);
    const lockValue = Number(lockDays || "0");
    if (apy && (!Number.isFinite(apyValue) || apyValue < 0)) {
      toast.error("Enter a valid estimated APY.");
      return;
    }
    if (lockDays && (!Number.isInteger(lockValue) || lockValue < 0)) {
      toast.error("Lock period must be a whole number of days.");
      return;
    }

    toast.success("Staking Pool Simulation Configured", {
      description: "Parameters validated. No on-chain contract has been deployed.",
    });
  };

  return (
    <main className="staking-page staking-create-page">
      <StakingWorkspaceHeader
        items={[
          { label: "Staking", to: "/staking" },
          { label: "Pools", to: "/staking/pools" },
          { label: "Deploy pool" },
        ]}
      />

      <header className="staking-create-heading">
        <div>
          <h1>Deploy staking pool</h1>
          <p className="staking-create-description">
            Configure a reward vault for your token holders. Set the pool identity,
            token contract, estimated APY and lock period before reviewing the simulation.
          </p>
        </div>
        <div className="staking-create-wallet">
          {isConnected ? (
            <span><span className="staking-create-wallet__dot" /> Wallet connected</span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs"
              onClick={() => openModal("CONNECT_WALLET")}
            >
              <Wallet className="h-3.5 w-3.5 text-primary" />
              Connect wallet
            </Button>
          )}
        </div>
      </header>

      <div className="staking-create-layout">
        <aside className="staking-create-aside">
          <h2>
            Build a vault.
            <span> Define the terms.</span>
          </h2>
          <p className="staking-create-aside__copy">
            Set the conditions under which users can stake your token and receive
            rewards. Keep the parameters clear; the values below are configuration
            inputs, not a guarantee of yield.
          </p>

          <dl className="staking-create-context">
            <div>
              <dt><Network className="h-4 w-4" /> Network</dt>
              <dd>Ethereum Sepolia</dd>
            </div>
            <div>
              <dt><Layers className="h-4 w-4" /> Execution</dt>
              <dd>Simulation only</dd>
            </div>
            <div>
              <dt><LockKeyhole className="h-4 w-4" /> Lock period</dt>
              <dd>Flexible or fixed</dd>
            </div>
          </dl>

          <div className="staking-create-note">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>
              Use an ERC-20 token contract on Sepolia. This interface validates the
              configuration but does not deploy an audited or live staking contract.
            </p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="staking-create-form">
          <div className="staking-create-form__intro">
            <h2>Vault configuration</h2>
            <p>Enter the parameters for your staking pool.</p>
          </div>

          <div className="staking-create-fields">
            <div className="staking-create-field staking-create-field--full">
              <label htmlFor="staking-pool-name">
                Pool name <span aria-hidden="true">*</span>
              </label>
              <input
                id="staking-pool-name"
                type="text"
                required
                maxLength={64}
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                placeholder="e.g. PMIN 30-Day Staking Vault"
                className={fieldClassName}
                autoComplete="off"
              />
              <small>A clear name that identifies this reward pool.</small>
            </div>

            <div className="staking-create-field staking-create-field--full">
              <label htmlFor="staking-token-address">
                Staked token contract address <span aria-hidden="true">*</span>
              </label>
              <input
                id="staking-token-address"
                type="text"
                required
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value.trim())}
                placeholder="0x..."
                className={`${fieldClassName} font-mono`}
                autoComplete="off"
                spellCheck={false}
              />
              <small>Enter the ERC-20 contract address on Ethereum Sepolia.</small>
            </div>

            <div className="staking-create-field">
              <label htmlFor="staking-apy">Target estimated APY (%)</label>
              <input
                id="staking-apy"
                type="number"
                min="0"
                max="1000"
                step="0.01"
                value={apy}
                onChange={(e) => setApy(e.target.value)}
                placeholder="e.g. 12"
                className={`${fieldClassName} font-mono`}
              />
              <small>Illustrative target rate; actual rewards are not guaranteed.</small>
            </div>

            <div className="staking-create-field">
              <label htmlFor="staking-lock-days">Lock period (days)</label>
              <input
                id="staking-lock-days"
                type="number"
                min="0"
                step="1"
                value={lockDays}
                onChange={(e) => setLockDays(e.target.value)}
                placeholder="0 for flexible"
                className={`${fieldClassName} font-mono`}
              />
              <small>Enter 0 for a flexible, no-lock pool.</small>
            </div>
          </div>

          <div className="staking-create-form__footer">
            <p>All values can be reviewed before any future on-chain deployment.</p>
            <Button
              type="submit"
              size="lg"
              className="h-10 gap-2 bg-primary px-5 text-xs font-semibold text-primary-foreground"
            >
              <Layers className="h-4 w-4" />
              Deploy staking vault
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
