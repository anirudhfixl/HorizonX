import React, { useMemo, useState } from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleAlert,
  Coins,
  Info,
  Layers,
  LockKeyhole,
  Network,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import "./staking-create-page.css";

const fieldClassName =
  "w-full rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function shortenAddress(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 18) return trimmed;
  return `${trimmed.slice(0, 10)}…${trimmed.slice(-6)}`;
}

export default function CreateStakingPoolPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  const [poolName, setPoolName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [apy, setApy] = useState("");
  const [lockDays, setLockDays] = useState("");

  const lockDescription = useMemo(() => {
    if (!lockDays || Number(lockDays) === 0) return "Flexible withdrawals";
    const days = Number(lockDays);
    return `${days} ${days === 1 ? "day" : "days"} fixed lock`;
  }, [lockDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      openModal("CONNECT_WALLET");
      return;
    }

    if (!poolName.trim() || !tokenAddress.trim()) {
      toast.error("Complete the required pool details.");
      return;
    }

    const apyValue = Number(apy);
    const lockValue = Number(lockDays || "0");
    if (apy && (!Number.isFinite(apyValue) || apyValue < 0 || apyValue > 1000)) {
      toast.error("Enter an estimated APY between 0 and 1,000%.");
      return;
    }
    if (lockDays && (!Number.isInteger(lockValue) || lockValue < 0)) {
      toast.error("Lock period must be a whole number of days.");
      return;
    }

    toast.success("Pool configuration validated", {
      description: "This is a local simulation. No smart contract has been deployed.",
    });
  };

  return (
    <main className="staking-create-page">
      <StakingWorkspaceHeader
        items={[
          { label: "Staking", to: "/staking" },
          { label: "Pools", to: "/staking/pools" },
          { label: "Deploy pool" },
        ]}
      />

      <header className="staking-create-hero">
        <div className="staking-create-hero__copy">
          <div className="staking-create-kicker"><span /> POOL DEPLOYMENT WORKSPACE</div>
          <h1>Create a staking pool</h1>
          <p>
            Configure the asset, target reward rate, and lock terms for a new pool.
            Review the setup before moving to a future testnet deployment flow.
          </p>
        </div>
        <div className="staking-create-hero__status">
          <span className={`staking-create-connection ${isConnected ? "is-connected" : ""}`}>
            <span className="staking-create-connection__dot" />
            {isConnected ? "Wallet connected" : "Wallet not connected"}
          </span>
          {!isConnected && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-border/70 bg-card/60 text-xs"
              onClick={() => openModal("CONNECT_WALLET")}
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect wallet
            </Button>
          )}
        </div>
      </header>

      <div className="staking-create-workspace">
        <form onSubmit={handleSubmit} className="staking-create-form">
          <div className="staking-create-form__topline">
            <div>
              <span className="staking-create-section-index">01 / CONFIGURATION</span>
              <h2>Pool parameters</h2>
              <p>Set the details participants will see when they review this pool.</p>
            </div>
            <span className="staking-create-required"><span>*</span> Required fields</span>
          </div>

          <section className="staking-create-form-section" aria-labelledby="pool-identity-heading">
            <div className="staking-create-section-heading">
              <span className="staking-create-section-icon"><Layers className="h-4 w-4" /></span>
              <div>
                <h3 id="pool-identity-heading">Pool identity</h3>
                <p>Identify the vault and the token users will stake.</p>
              </div>
            </div>

            <div className="staking-create-fields">
              <div className="staking-create-field staking-create-field--full">
                <label htmlFor="staking-pool-name">Pool name <span>*</span></label>
                <input
                  id="staking-pool-name"
                  type="text"
                  required
                  maxLength={64}
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  placeholder="e.g. AURA Community Staking"
                  className={fieldClassName}
                  autoComplete="off"
                />
                <small>Use a recognizable name. Maximum 64 characters.</small>
              </div>

              <div className="staking-create-field staking-create-field--full">
                <label htmlFor="staking-token-address">Staked token contract <span>*</span></label>
                <div className="staking-create-input-prefix">
                  <Coins className="h-4 w-4" />
                  <input
                    id="staking-token-address"
                    type="text"
                    required
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="0x…"
                    className={`${fieldClassName} font-mono`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <small>Enter the ERC-20 contract address deployed on Ethereum Sepolia.</small>
              </div>
            </div>
          </section>

          <div className="staking-create-form-divider" />

          <section className="staking-create-form-section" aria-labelledby="reward-terms-heading">
            <div className="staking-create-section-heading">
              <span className="staking-create-section-icon"><Zap className="h-4 w-4" /></span>
              <div>
                <h3 id="reward-terms-heading">Reward & lock terms</h3>
                <p>Define the indicative reward target and withdrawal conditions.</p>
              </div>
            </div>

            <div className="staking-create-fields">
              <div className="staking-create-field">
                <label htmlFor="staking-apy">Target estimated APY</label>
                <div className="staking-create-input-suffix">
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
                  <span>%</span>
                </div>
                <small>Illustrative target only; actual rewards are not guaranteed.</small>
              </div>

              <div className="staking-create-field">
                <label htmlFor="staking-lock-days">Lock period</label>
                <div className="staking-create-input-suffix">
                  <input
                    id="staking-lock-days"
                    type="number"
                    min="0"
                    step="1"
                    value={lockDays}
                    onChange={(e) => setLockDays(e.target.value)}
                    placeholder="0"
                    className={`${fieldClassName} font-mono`}
                  />
                  <span>days</span>
                </div>
                <small>Set to 0 for flexible withdrawals.</small>
              </div>
            </div>
          </section>

          <div className="staking-create-form-footer">
            <div className="staking-create-footer-note">
              <Info className="h-4 w-4 shrink-0" />
              <p>Submitting validates these values locally. It does not deploy a contract or move tokens.</p>
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground sm:w-auto"
            >
              Validate configuration <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <aside className="staking-create-sidebar">
          <section className="staking-create-preview">
            <div className="staking-create-preview__header">
              <span className="staking-create-preview__icon"><BadgeCheck className="h-4 w-4" /></span>
              <span className="staking-create-preview__label">LIVE PREVIEW</span>
              <span className="staking-create-preview__draft">Draft</span>
            </div>
            <div className="staking-create-preview__body">
              <span className="staking-create-preview__eyebrow">YOUR POOL</span>
              <h2>{poolName.trim() || "Your staking pool name"}</h2>
              <p>{tokenAddress.trim() ? shortenAddress(tokenAddress) : "Token contract not added yet"}</p>
              <div className="staking-create-preview__apy">
                <span>Target estimated APY</span>
                <strong>{apy && Number(apy) >= 0 ? `${apy}%` : "—"}</strong>
              </div>
              <div className="staking-create-preview__details">
                <div><span><Network className="h-3.5 w-3.5" /> Network</span><strong>Ethereum Sepolia</strong></div>
                <div><span><LockKeyhole className="h-3.5 w-3.5" /> Lock terms</span><strong>{lockDescription}</strong></div>
                <div><span><CalendarDays className="h-3.5 w-3.5" /> Pool status</span><strong>Not deployed</strong></div>
              </div>
            </div>
            <div className="staking-create-preview__foot">
              <CircleAlert className="h-4 w-4 shrink-0" />
              Preview values update as you configure the form. No live pool is created.
            </div>
          </section>

          <section className="staking-create-network-card">
            <div className="staking-create-network-card__title">
              <span><Network className="h-4 w-4" /></span>
              <div><h3>Deployment environment</h3><p>Current supported configuration</p></div>
            </div>
            <div className="staking-create-network-row"><span>Network</span><strong>Ethereum Sepolia</strong></div>
            <div className="staking-create-network-row"><span>Chain ID</span><strong className="font-mono">11155111</strong></div>
            <div className="staking-create-network-row"><span>Execution</span><strong>Simulation only</strong></div>
            <div className="staking-create-security">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <p>Use a token contract on Sepolia. Contract deployment and security auditing are not performed by this page.</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
