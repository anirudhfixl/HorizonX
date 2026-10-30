"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Briefcase, Plus, Wallet } from "lucide-react";

export default function MyProjectsPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="My Projects"
        description="Manage your verified project identity, linked token contracts, and developer credentials."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "My Projects" },
        ]}
      />

      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-7 w-7 text-primary" />}
          title="Connect Your Wallet"
          description="Connect your Web3 address to access your registered projects and developer permissions."
          action={
            <Button
              size="sm"
              onClick={() => openModal("CONNECT_WALLET")}
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              Connect Wallet
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<Briefcase className="h-7 w-7 text-primary" />}
          title="No Registered Projects"
          description="You haven't registered any Web3 projects with this wallet address yet."
          action={
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
              <Link href="/tokens/create">Create a Token & Project</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
