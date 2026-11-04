import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AccountWorkspace } from "@/components/account/account-workspace";
import { Bell, Rocket, Coins, Gift, Megaphone } from "lucide-react";

const notificationOptions = [
  { id: "launches", title: "Launchpad activity", description: "Updates about presales and launches you follow.", icon: Rocket },
  { id: "staking", title: "Staking activity", description: "Pool and position updates, including reward events.", icon: Coins },
  { id: "airdrops", title: "Airdrop updates", description: "Campaign announcements and claim availability.", icon: Gift },
  { id: "platform", title: "HorizonX announcements", description: "Important product updates and platform notices.", icon: Megaphone },
];

export default function AccountNotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    launches: true, staking: true, airdrops: true, platform: true,
  });

  const toggle = (id: string) => setEnabled((current) => ({ ...current, [id]: !current[id] }));

  const handleSave = () => {
    toast.success("Notification preferences updated", {
      description: "Selections are currently held in this page session; notification delivery is not connected yet.",
    });
  };

  return (
    <AccountWorkspace
      active="notifications"
      title="Notifications"
      description="Choose the HorizonX ecosystem updates you want to keep visible."
    >
      <section className="account-panel">
        <div className="account-panel__heading">
          <div className="account-panel__heading-icon"><Bell className="h-5 w-5" /></div>
          <div><h2>Activity updates</h2><p>Manage the categories shown in your notification preferences.</p></div>
        </div>
        <div className="account-notification-list">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div className="account-notification-row" key={option.id}>
                <div className="account-notification-row__icon"><Icon className="h-[18px] w-[18px]" /></div>
                <div className="account-notification-row__copy"><strong>{option.title}</strong><span>{option.description}</span></div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!enabled[option.id]}
                  aria-label={`${option.title} notifications`}
                  className={`account-switch${enabled[option.id] ? " is-on" : ""}`}
                  onClick={() => toggle(option.id)}
                ><span /></button>
              </div>
            );
          })}
        </div>
        <div className="account-form__footer">
          <p>Notification delivery and persistent preferences are not connected to a backend yet.</p>
          <Button size="sm" onClick={handleSave}>Save preferences</Button>
        </div>
      </section>
    </AccountWorkspace>
  );
}
