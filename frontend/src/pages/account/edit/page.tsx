import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState("Web3 Contributor");
  const [bio, setBio] = useState("DeFi liquidity provider and early adopter.");
  const [website, setWebsite] = useState("https://prominers.org");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile Updated", {
      description: "Display settings updated in local storage. (Phase 1 Mock)",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Edit Profile"
        description="Customize your public display name, avatar, and linked social profiles."
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Edit Profile" },
        ]}
      />

      <form onSubmit={handleSave} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-5">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Website or Project Link
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-5 text-xs">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
