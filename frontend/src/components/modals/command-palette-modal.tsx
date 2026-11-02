import React, { useState, useMemo } from "react";
import { useModal } from "@/contexts/modal-context";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Search,
  Coins,
  Rocket,
  Gift,
  Layers,
  LineChart,
  FileText,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResultItem {
  id: string;
  category: "Navigation" | "Actions" | "Explore" | "Docs";
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

const SEARCH_ITEMS: SearchResultItem[] = [
  // Actions
  {
    id: "act-create-token",
    category: "Actions",
    title: "Create Token",
    subtitle: "Deploy a standard, burnable, mintable, or custom token",
    href: "/tokens/create",
    icon: <PlusCircle className="h-4 w-4 text-primary" />,
  },
  {
    id: "act-create-presale",
    category: "Actions",
    title: "Create Presale",
    subtitle: "Launch a tiered presale with softcap and hardcap",
    href: "/launchpad/presales/create",
    icon: <Rocket className="h-4 w-4 text-amber-400" />,
  },
  {
    id: "act-create-airdrop",
    category: "Actions",
    title: "Create Airdrop",
    subtitle: "Configure batch, merkle, or quest-based token rewards",
    href: "/airdrops/campaigns/create",
    icon: <Gift className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: "act-create-staking",
    category: "Actions",
    title: "Create Staking Pool",
    subtitle: "Provide yield incentive pools for your token community",
    href: "/staking/pools/create",
    icon: <Layers className="h-4 w-4 text-primary" />,
  },
  // Navigation
  {
    id: "nav-tokens",
    category: "Navigation",
    title: "Token Dashboard",
    subtitle: "Explore market caps, trending coins, and deployers",
    href: "/tokens",
    icon: <Coins className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "nav-launchpad",
    category: "Navigation",
    title: "Launchpad Hub",
    subtitle: "All live presales and fair launches",
    href: "/launchpad",
    icon: <Rocket className="h-4 w-4 text-amber-400" />,
  },
  {
    id: "nav-airdrops",
    category: "Navigation",
    title: "Airdrops & Claims",
    subtitle: "Explore claimable token campaigns",
    href: "/airdrops",
    icon: <Gift className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: "nav-staking",
    category: "Navigation",
    title: "Staking Pools",
    subtitle: "Earn yield with locked and flexible staking",
    href: "/staking",
    icon: <Layers className="h-4 w-4 text-primary" />,
  },
  {
    id: "nav-exchange",
    category: "Navigation",
    title: "Markets & Analytics",
    subtitle: "Live trading charts, liquidity, and volume metrics",
    href: "/exchange",
    icon: <LineChart className="h-4 w-4 text-sky-400" />,
  },
  // Docs
  {
    id: "docs-overview",
    category: "Docs",
    title: "Documentation & Guides",
    subtitle: "Architecture, developer guidelines, and token standards",
    href: "/docs",
    icon: <FileText className="h-4 w-4 text-zinc-400" />,
  },
];

export function CommandPaletteModal() {
  const navigate = useNavigate();
  const { isOpen, closeModal } = useModal();
  const [query, setQuery] = useState("");

  const open = isOpen("COMMAND_PALETTE");

  const filtered = useMemo(() => {
    if (!query.trim()) return SEARCH_ITEMS;
    const lower = query.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.subtitle.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [query]);

  const handleSelect = (href: string) => {
    closeModal();
    setQuery("");
    navigate(href);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-xl border-border/70 bg-card/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tokens, pools, launchpads, actions, docs..."
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-border/60 bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="group flex w-full items-center justify-between rounded-lg p-2.5 text-left transition-colors hover:bg-secondary/60 hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/80 border border-border/40">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-border/40 bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="rounded border border-border/40 bg-card px-1.5 py-0.5 text-[10px]">↑↓</kbd>
            <kbd className="rounded border border-border/40 bg-card px-1.5 py-0.5 text-[10px]">↵ Select</kbd>
          </div>
          <span>ProMiners Command</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
