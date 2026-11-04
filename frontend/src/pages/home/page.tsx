import { EarthHero } from "@/components/home/earth-hero";
import { GoogleGeminiEffectDemo } from "@/components/home/google-gemini-effect-demo";
import { CapabilityShowcase } from "@/components/home/capability-showcase";
import { WalletConnectSection } from "@/components/home/wallet-connect-section";
import { ArchitectureJourneySection } from "@/components/home/architecture-journey-section";

export default function Home() {
  return (
    <div className="home-page min-w-0 overflow-hidden text-[var(--text-primary)]">
      <EarthHero />

      <div className="relative bg-transparent">
        <GoogleGeminiEffectDemo />

        <CapabilityShowcase />

        <WalletConnectSection />

        <ArchitectureJourneySection />

      </div>
    </div>
  );
}
