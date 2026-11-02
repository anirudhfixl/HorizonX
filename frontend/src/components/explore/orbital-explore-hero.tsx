import { useEffect, useState } from "react";
import { Activity, ArrowRight, Compass } from "lucide-react";
import { OrbitalHeroSection } from "@/components/ui/orbital-hero-section";

function useNarrowViewport() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return narrow;
}

export function ExploreOrbitalHero() {
  const narrow = useNarrowViewport();

  const scrollToContent = () => {
    document.getElementById("explore-discovery-content")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="explore-hero" aria-labelledby="explore-hero-title">
      <OrbitalHeroSection
        className="explore-hero-scene"
        focus={narrow ? [0.5, 0.76] : [0.76, 0.52]}
        scrim={narrow ? "top" : "left"}
        scrimStrength={narrow ? 0.96 : 0.91}
        viewRadius={narrow ? 2.2 : 3.45}
        lead={narrow ? 0.04 : 0.1}
        glow={narrow ? 0.58 : 0.92}
        starCount={narrow ? 420 : 1050}
        interactive={!narrow}
        planeSpread={0.82}
        eccentricity={0.22}
      >
        <div className="explore-hero-overlay">
          <div className="explore-hero-copy">
            <div className="explore-hero-eyebrow">
              <span className="explore-hero-eyebrow-dot" aria-hidden="true" />
              THE PROMINERS DISCOVERY NETWORK
            </div>

            <h1 id="explore-hero-title">
              Explore what’s
              <br />
              <em>in orbit.</em>
            </h1>

            <p>
              Discover tokens, emerging projects, launch opportunities,
              airdrops and staking ecosystems—all connected in one place.
            </p>

            <div className="explore-hero-actions">
              <button type="button" className="explore-hero-primary" onClick={scrollToContent}>
                Explore the ecosystem
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="explore-hero-secondary" onClick={scrollToContent}>
                <Compass size={15} aria-hidden="true" />
                Browse categories
              </button>
            </div>

            <div className="explore-hero-caption">
              <Activity size={13} aria-hidden="true" />
              SIX DISCOVERY SECTORS · ONE CONNECTED ECOSYSTEM
            </div>
          </div>
        </div>
      </OrbitalHeroSection>
      <div className="explore-hero-bottom-fade" aria-hidden="true" />
    </section>
  );
}

export default ExploreOrbitalHero;
