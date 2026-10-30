"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AccountPreferencesPage() {
  const [currency, setCurrency] = useState("USD");
  const [gasPreset, setGasPreset] = useState("standard");
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences Saved", {
      description: "Default currency and gas presets updated in local session.",
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Preferences & Alerts"
        description="Configure your client defaults, pricing display currency, and notification rules."
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Preferences" },
        ]}
      />

      <form onSubmit={handleSave} className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Display Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="USD" className="bg-popover">USD ($)</option>
            <option value="EUR" className="bg-popover">EUR (€)</option>
            <option value="ETH" className="bg-popover">ETH (Ξ)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Default Gas Priority Preset
          </label>
          <select
            value={gasPreset}
            onChange={(e) => setGasPreset(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="standard" className="bg-popover">Standard (Recommended)</option>
            <option value="fast" className="bg-popover">Fast (Higher priority)</option>
            <option value="instant" className="bg-popover">Instant (Max gas fee)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-5 text-xs">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
