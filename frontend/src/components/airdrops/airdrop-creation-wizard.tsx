import "@/components/airdrops/airdrops.css";
import { AirdropWorkspaceHeader } from "@/components/airdrops/airdrop-section-nav";
import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TokenPicker, type SelectedToken } from "@/components/launchpad/token-picker";
import { ProvenanceBadge } from "@/components/shared/provenance-badge";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "sonner";
import {
  saveSessionAirdrop,
  generateSessionAirdropId,
  getDefaultAirdropDates,
  type SessionAirdropCampaign,
} from "@/lib/airdrop-storage";
import {
  parseRecipientList,
  buildMerkleTree,
  type MerkleTreeResult,
} from "@/lib/merkle";
import type { AirdropCampaignType } from "@/types";
import {
  Gift,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Upload,
  AlertCircle,
  Copy,
  Info,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

export const AIRDROP_TYPES: {
  type: AirdropCampaignType;
  label: string;
  description: string;
  badge: string;
}[] = [
  {
    type: "merkle",
    label: "Merkle Tree Distribution",
    description: "Cryptographic gasless distribution. Claimants verify proofs on-chain.",
    badge: "Gas Efficient",
  },
  {
    type: "batch",
    label: "Direct Batch Push",
    description: "Direct push distribution to recipient groups executed in batches by creator.",
    badge: "Creator Funded",
  },
  {
    type: "quest",
    label: "Quest & Social Rewards",
    description: "Reward users for completing verifiable on-chain actions or platform bounties.",
    badge: "Task Gated",
  },
  {
    type: "governance",
    label: "Governance Drop",
    description: "Weighted reward distribution based on snapshot voting and proposal participation.",
    badge: "DAO Aligned",
  },
  {
    type: "lottery",
    label: "Lottery & Raffle",
    description: "Randomized provably-fair draw awarding prizes to selected eligible winners.",
    badge: "Randomized",
  },
  {
    type: "referral",
    label: "Referral Commission",
    description: "Reward referrers for onboarding qualifying community members.",
    badge: "Growth Bounty",
  },
  {
    type: "recurring",
    label: "Recurring Epochs",
    description: "Scheduled recurring distribution rounds (e.g. weekly or monthly epochs).",
    badge: "Scheduled",
  },
  {
    type: "legacy",
    label: "Legacy Compatibility Drop",
    description: "Compatibility mode for retroactive snapshot distributions and migrations.",
    badge: "Migration",
  },
];

const CATEGORIES = [
  "DeFi",
  "AI & Compute",
  "Infrastructure",
  "Governance",
  "Security & Privacy",
  "Gaming",
  "DePIN",
  "General",
];

const SAMPLE_CSV = `0x71C9561E873f324A3B4323E56d3935a8286C4e39, 2500
0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1, 1500
0x34291849a0293847291038472910482910293847, 3000
0x7492a43b2f671b2691e9b24ee945c35d5d8c4712, 1000`;

export function AirdropCreationWizard() {
  const navigate = useNavigate();
  const { isConnected, address } = useWallet();
  const { openModal } = useModal();

  // Wizard Step (1: Identity, 2: Token, 3: Rules & Schedule, 4: Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Campaign Identity
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("DeFi");
  const [airdropType, setAirdropType] = useState<AirdropCampaignType>("merkle");

  // Step 2: Token & Reward
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(null);
  const [totalReward, setTotalReward] = useState("50000");

  // Step 3: Schedule & Type-specific
  const defaultDates = useMemo(() => getDefaultAirdropDates(), []);
  const [startTime, setStartTime] = useState(defaultDates.startTime.slice(0, 16));
  const [endTime, setEndTime] = useState(defaultDates.endTime.slice(0, 16));

  // Merkle Recipient List State
  const [recipientRawText, setRecipientRawText] = useState(SAMPLE_CSV);
  const [merkleTree, setMerkleTree] = useState<MerkleTreeResult | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Type-specific configs
  const [batchSize, setBatchSize] = useState("100");
  const [lotteryWinners, setLotteryWinners] = useState("25");
  const [referralBonus, setReferralBonus] = useState("50");
  const [questProvider, setQuestProvider] = useState("Galxe / On-chain Proof");
  const [governanceProposal, setGovernanceProposal] = useState("HorizonX DAO Proposal #14");
  const [recurringEpochs, setRecurringEpochs] = useState("4");
  const [legacyContract, setLegacyContract] = useState("0x3918...4920 (V1 Distributor)");

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRoot, setCopiedRoot] = useState(false);

  // Auto-build merkle tree when in Merkle mode and input changes
  const handleParseMerkleRecipients = (rawText: string) => {
    const decimals = selectedToken?.decimals ?? 18;
    const parsed = parseRecipientList(rawText, decimals);
    setParseErrors(parsed.errors);
    setDuplicateCount(parsed.duplicateCount);

    if (parsed.recipients.length > 0) {
      const tree = buildMerkleTree(parsed.recipients);
      setMerkleTree(tree);
      // Auto update total reward based on parsed recipients
      setTotalReward(parsed.totalAmountNumeric.toLocaleString("en-US"));
    } else {
      setMerkleTree(null);
    }
  };

  // CSV File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || "");
      setRecipientRawText(content);
      handleParseMerkleRecipients(content);
    };
    reader.readAsText(file);
  };

  // Form Validation per step
  const validateStep1 = () => {
    if (!title.trim()) {
      toast.error("Please enter a campaign title");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please provide a brief campaign description");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!selectedToken) {
      toast.error("Please select a token from the picker");
      return false;
    }
    if (!totalReward || Number(totalReward.replace(/,/g, "")) <= 0) {
      toast.error("Please enter a valid total reward allocation");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (airdropType === "merkle") {
      if (!merkleTree || merkleTree.recipients.length === 0) {
        toast.error("Please provide a valid recipient list with at least 1 address");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  // Final Submission Handler
  const handleCreateCampaign = () => {
    setIsSubmitting(true);

    try {
      const campaignId = generateSessionAirdropId();
      const creatorOwner = address || "0x71C9561E873f324A3B4323E56d3935a8286C4e39";
      const tokenSymbol = selectedToken?.symbol || "TOKEN";
      const totalRewardFormatted = `${totalReward} ${tokenSymbol}`;

      const sessionCampaign: SessionAirdropCampaign = {
        id: campaignId,
        title: title.trim(),
        description: description.trim(),
        category,
        type: airdropType,
        tokenId: selectedToken?.tokenId || selectedToken?.address || "custom",
        ownerAddress: creatorOwner,
        status: new Date(startTime).getTime() > Date.now() ? "pending" : "active",
        totalReward: totalRewardFormatted,
        recipientCount: airdropType === "merkle" ? (merkleTree?.recipientCount || 0) : 500,
        claimedCount: 0,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        network: "Ethereum Sepolia",
        contractAddress: selectedToken?.address,
        merkleRoot: airdropType === "merkle" ? merkleTree?.root : undefined,
        merkleTreeData:
          airdropType === "merkle" && merkleTree
            ? {
                root: merkleTree.root,
                recipients: merkleTree.recipients.map((r) => ({
                  address: r.address,
                  amount: r.amount,
                  amountWei: r.amountWei,
                })),
                proofs: merkleTree.proofs,
              }
            : undefined,
        typeConfig: {
          batchSize: airdropType === "batch" ? batchSize : undefined,
          lotteryWinners: airdropType === "lottery" ? lotteryWinners : undefined,
          referralBonus: airdropType === "referral" ? referralBonus : undefined,
          questProvider: airdropType === "quest" ? questProvider : undefined,
          governanceProposal: airdropType === "governance" ? governanceProposal : undefined,
          recurringEpochs: airdropType === "recurring" ? recurringEpochs : undefined,
          legacyContract: airdropType === "legacy" ? legacyContract : undefined,
        },
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        provenance: "session",
        isSimulated: true,
      };

      // Save to canonical session storage & trigger reactive event
      saveSessionAirdrop(sessionCampaign);

      toast.success("Airdrop Campaign Configured", {
        description: "Simulation recorded in browser sessionStorage under Ethereum Sepolia.",
      });

      // Redirect to newly created campaign detail view
      navigate(`/airdrops/campaigns/${campaignId}`);
    } catch {
      toast.error("Failed to create campaign. Please check inputs.");
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRoot(true);
    setTimeout(() => setCopiedRoot(false), 2000);
  };

  return (
    <div className="airdrop-page w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-7 space-y-7">
      <AirdropWorkspaceHeader items={[{ label: "Airdrops", to: "/airdrops" }, { label: "Create campaign" }]} />
      {/* Header */}
      <PageHeader
        title="Launch Airdrop Campaign"
        description="Configure gas-efficient merkle distributions, direct batch pushes, or quest-gated community rewards."
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "Campaigns", href: "/airdrops/campaigns" },
          { label: "Create" },
        ]}
      />

      {/* Wallet Simulation Banner */}
      {!isConnected && (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-primary">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>
              <strong>Simulation Mode:</strong> Wallet not connected. Campaign will be registered with a demonstration creator address.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => openModal("CONNECT_WALLET")}
            className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
          >
            Connect Wallet
          </Button>
        </div>
      )}

      {/* Multi-Step Progression Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-6 backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {[
            { step: 1, title: "1. Identity & Type", desc: "Category & Model" },
            { step: 2, title: "2. Token & Pool", desc: "TokenPicker & Reward" },
            { step: 3, title: "3. Rules & Merkle", desc: "Recipients & Schedule" },
            { step: 4, title: "4. Review & Deploy", desc: "Confirm Simulation" },
          ].map((s) => (
            <div
              key={s.step}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                currentStep === s.step
                  ? "border-primary bg-primary/10 text-primary"
                  : currentStep > s.step
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                  : "border-border/40 bg-secondary/15 text-muted-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{s.title}</span>
                {currentStep > s.step && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Body */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-8">
        {/* STEP 1: CAMPAIGN IDENTITY & MODEL */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Campaign Specifications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define the title, thematic category, and distribution model for your community drop.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Campaign Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HorizonX Genesis Early Adopters Airdrop"
                  className="bg-secondary/30 border-border/60 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Category Tag <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-popover text-popover-foreground">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Host Transaction Network
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2 text-xs font-mono text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-foreground font-semibold">Ethereum Sepolia</span> (Chain ID: 11155111 - D-04)
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Campaign Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline who is eligible, what tasks qualify, or snapshot criteria..."
                  rows={3}
                  className="bg-secondary/30 border-border/60 text-xs"
                />
              </div>

              {/* Distribution Model Selection (All 8 Baseline Types) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground block">
                  Distribution Architecture (8 Baseline Models)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {AIRDROP_TYPES.map((t) => (
                    <div
                      key={t.type}
                      onClick={() => setAirdropType(t.type)}
                      className={cn(
                        "rounded-xl border p-3.5 cursor-pointer transition-all flex flex-col justify-between space-y-2",
                        airdropType === t.type
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/40 bg-secondary/15 hover:border-primary/40"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{t.label}</span>
                          <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase">
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                      <div className="pt-1 flex items-center justify-end">
                        <span className={cn(
                          "h-3.5 w-3.5 rounded-full border flex items-center justify-center text-[8px]",
                          airdropType === t.type ? "border-primary bg-primary text-primary-foreground font-bold" : "border-border/60"
                        )}>
                          {airdropType === t.type && "✓"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TOKENPICKER & REWARD POOL */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Token & Reward Allocation</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select the token to distribute and configure the reward pool parameters.
              </p>
            </div>

            {/* TokenPicker Integration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Select Reward Token <span className="text-destructive">*</span>
              </label>
              <TokenPicker
                value={selectedToken?.address}
                onSelectToken={(token) => {
                  setSelectedToken(token);
                  if (airdropType === "merkle" && recipientRawText) {
                    handleParseMerkleRecipients(recipientRawText);
                  }
                }}
              />
            </div>

            {/* Selected Token Information Box */}
            {selectedToken && (
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Chosen Token</span>
                  <ProvenanceBadge kind={selectedToken.provenance === "custom" ? "session" : selectedToken.provenance} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm font-mono text-primary">
                    {selectedToken.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      {selectedToken.name}
                      <span className="text-xs font-mono text-primary font-semibold">(${selectedToken.symbol})</span>
                    </h3>
                    <code className="text-[11px] font-mono text-muted-foreground block truncate">
                      {selectedToken.address}
                    </code>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Decimals:</span>
                    <p className="font-mono font-semibold text-foreground">{selectedToken.decimals}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Network:</span>
                    <p className="font-semibold text-foreground">Ethereum Sepolia</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Standard:</span>
                    <p className="font-semibold text-foreground">ERC-20</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Supply:</span>
                    <p className="font-mono font-semibold text-foreground">{selectedToken.totalSupply || "10,000,000"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Total Reward Allocation */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Total Reward Pool Allocation <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={totalReward}
                  onChange={(e) => setTotalReward(e.target.value)}
                  placeholder="e.g. 100,000"
                  className="bg-secondary/30 border-border/60 text-xs font-mono pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-primary pointer-events-none">
                  {selectedToken?.symbol || "TOKENS"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {airdropType === "merkle"
                  ? "In Merkle mode, this total is verified and synchronized with the sum of recipient allocations."
                  : "The total token amount allocated to this distribution campaign."}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & TYPE-SPECIFIC RULES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Timeline & Distribution Rules</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set campaign active dates and configure parameters specific to the{" "}
                <strong className="text-primary uppercase">{airdropType}</strong> model.
              </p>
            </div>

            {/* Schedule Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Campaign Start Date & Time
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-secondary/30 border-border/60 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Campaign Expiration Date & Time
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-secondary/30 border-border/60 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 1. MERKLE TREE RECIPIENTS SECTION */}
            {airdropType === "merkle" && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Merkle Recipient List</h3>
                    <p className="text-xs text-muted-foreground">
                      Upload a CSV file or paste addresses and allocations to generate the cryptographic Merkle root.
                    </p>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/40 bg-primary/10 rounded-lg px-3 py-1.5 hover:bg-primary/20">
                      <Upload className="h-3.5 w-3.5" /> Upload CSV
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <Textarea
                    value={recipientRawText}
                    onChange={(e) => {
                      setRecipientRawText(e.target.value);
                      handleParseMerkleRecipients(e.target.value);
                    }}
                    placeholder={`0x..., 1000\n0x..., 2500`}
                    rows={5}
                    className="bg-secondary/30 border-border/60 text-xs font-mono leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Format: <code>0xRecipientAddress, Amount</code> (one entry per line)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientRawText(SAMPLE_CSV);
                        handleParseMerkleRecipients(SAMPLE_CSV);
                      }}
                      className="text-primary hover:underline"
                    >
                      Load Sample Recipients
                    </button>
                  </div>
                </div>

                {/* Parsing Errors Banner */}
                {parseErrors.length > 0 && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 space-y-1 text-xs text-destructive">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" /> Validation Errors Found ({parseErrors.length})
                    </span>
                    <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                      {parseErrors.slice(0, 3).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {parseErrors.length > 3 && <li>...and {parseErrors.length - 3} more errors</li>}
                    </ul>
                  </div>
                )}

                {/* Merkle Generation Output Preview */}
                {merkleTree && merkleTree.recipients.length > 0 && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" /> Merkle Tree Cryptographically Generated
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {merkleTree.recipientCount} Recipients Verified
                        {duplicateCount > 0 && ` (${duplicateCount} duplicates merged)`}
                      </span>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-card/60 p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-muted-foreground block uppercase font-mono">Merkle Root Hash</span>
                        <code className="text-xs font-mono font-bold text-emerald-400 block truncate">
                          {merkleTree.root}
                        </code>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(merkleTree.root)}
                        className="h-7 text-xs border border-border/40 shrink-0 gap-1"
                      >
                        <Copy className="h-3 w-3" /> {copiedRoot ? "Copied" : "Copy Root"}
                      </Button>
                    </div>

                    {/* First 3 leaves preview */}
                    <div className="space-y-1.5 text-[11px]">
                      <span className="text-muted-foreground font-semibold">Leaves Sample:</span>
                      {merkleTree.recipients.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-center justify-between font-mono text-[10px] bg-secondary/30 px-2.5 py-1 rounded">
                          <span className="text-foreground">{r.address.slice(0, 10)}...{r.address.slice(-6)}</span>
                          <span className="text-emerald-400 font-bold">{r.amount} {selectedToken?.symbol || "TOKENS"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. BATCH DISTRIBUTION FIELDS */}
            {airdropType === "batch" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Direct Batch Push Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Batch Execution Chunk Size
                    </label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-foreground"
                    >
                      <option value="50">50 Recipients per Transaction</option>
                      <option value="100">100 Recipients per Transaction</option>
                      <option value="250">250 Recipients per Transaction</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Gas Settlement Policy
                    </label>
                    <p className="text-xs text-muted-foreground py-2">
                      Creator funds transaction gas across Ethereum Sepolia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. LOTTERY CONFIG */}
            {airdropType === "lottery" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Lottery & Raffle Draw Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Number of Selected Winners
                    </label>
                    <Input
                      type="number"
                      value={lotteryWinners}
                      onChange={(e) => setLotteryWinners(e.target.value)}
                      className="bg-secondary/30 border-border/60 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Draw Mechanism
                    </label>
                    <p className="text-xs text-muted-foreground py-2">
                      Simulated Chainlink VRF pseudorandom verifiable draw.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. REFERRAL CONFIG */}
            {airdropType === "referral" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Referral Bounty Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Bonus Tokens per Qualified Referee
                    </label>
                    <Input
                      type="number"
                      value={referralBonus}
                      onChange={(e) => setReferralBonus(e.target.value)}
                      className="bg-secondary/30 border-border/60 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Qualification Rule
                    </label>
                    <p className="text-xs text-muted-foreground py-2">
                      Referee must connect a valid Web3 address on Sepolia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. QUEST CONFIG */}
            {airdropType === "quest" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Quest Reward Configuration</h3>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Quest Verification Provider / Activity
                  </label>
                  <Input
                    value={questProvider}
                    onChange={(e) => setQuestProvider(e.target.value)}
                    className="bg-secondary/30 border-border/60 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 6. GOVERNANCE CONFIG */}
            {airdropType === "governance" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Governance Participation Rules</h3>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Snapshot Proposal / Space ENS
                  </label>
                  <Input
                    value={governanceProposal}
                    onChange={(e) => setGovernanceProposal(e.target.value)}
                    className="bg-secondary/30 border-border/60 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 7. RECURRING CONFIG */}
            {airdropType === "recurring" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Recurring Epoch Schedule</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Number of Distribution Epochs
                    </label>
                    <Input
                      type="number"
                      value={recurringEpochs}
                      onChange={(e) => setRecurringEpochs(e.target.value)}
                      className="bg-secondary/30 border-border/60 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Interval Period
                    </label>
                    <p className="text-xs text-muted-foreground py-2">Weekly recurring epochs with rollover.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. LEGACY CONFIG */}
            {airdropType === "legacy" && (
              <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Legacy Migration Compatibility</h3>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Target Legacy Contract
                  </label>
                  <Input
                    value={legacyContract}
                    onChange={(e) => setLegacyContract(e.target.value)}
                    className="bg-secondary/30 border-border/60 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: REVIEW & DEPLOY SIMULATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Review & Confirm Campaign Configuration</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify all parameters before deploying the browser-persisted airdrop simulation.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <h3 className="text-base font-bold text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
                <span className="rounded bg-primary/10 border border-primary/25 px-2.5 py-1 text-xs font-semibold text-primary uppercase">
                  {airdropType}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Reward Token</span>
                  <p className="font-bold text-foreground mt-0.5">
                    {selectedToken?.name} (${selectedToken?.symbol})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Total Reward Pool</span>
                  <p className="font-mono font-bold text-emerald-400 mt-0.5">
                    {totalReward} {selectedToken?.symbol}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Category</span>
                  <p className="font-semibold text-foreground mt-0.5">{category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Network</span>
                  <p className="font-semibold text-foreground mt-0.5">Ethereum Sepolia</p>
                </div>
              </div>

              {airdropType === "merkle" && merkleTree && (
                <div className="pt-3 border-t border-border/40 space-y-1.5 text-xs">
                  <span className="text-muted-foreground block font-mono text-[11px] uppercase">
                    Generated Merkle Root ({merkleTree.recipientCount} Recipients)
                  </span>
                  <code className="text-xs font-mono font-bold text-emerald-400 block bg-secondary/40 p-2.5 rounded-lg truncate">
                    {merkleTree.root}
                  </code>
                </div>
              )}

              <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground">
                <div>
                  <span>Starts: {startTime.replace("T", " ")}</span>
                </div>
                <div>
                  <span>Expires: {endTime.replace("T", " ")}</span>
                </div>
              </div>
            </div>

            {/* Simulation Disclosure Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs text-muted-foreground">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-foreground">Phase 5 Simulation (D-04):</strong> Submitting this form records a
                browser-session airdrop in <code>sessionStorage</code> (<code>pm_session_airdrops_v1</code>). It will immediately appear
                in the Airdrop Hub, All Campaigns Directory, and your personal workspace without real gas fees or deployed contracts.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              className="text-xs border-border/60 gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Link to="/airdrops">Cancel</Link>
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground text-xs font-semibold gap-1.5 px-5"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={handleCreateCampaign}
              className="bg-primary text-primary-foreground text-xs font-semibold gap-2 px-6 hover:brightness-110"
            >
              <Gift className="h-4 w-4" />
              {isSubmitting ? "Deploying..." : "Launch Airdrop Campaign"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
