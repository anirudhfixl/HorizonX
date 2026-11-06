import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
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
  const navigate = useNavigate();

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
        focus={narrow ? [0.5, 0.76] : [0.76, 0.46]}
        scrim={narrow ? "top" : "left"}
        scrimStrength={narrow ? 0.96 : 0.91}
        viewRadius={narrow ? 2.2 : 3.05}
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
              THE DECENTRALIZED WEB3 ECOSYSTEM
            </div>

            <h1 id="explore-hero-title">
              Everything Web3.
              <br />
              <em>One Horizon.</em>
            </h1>

            <p>
              Discover tokens, explore emerging projects, access launch
              opportunities, find airdrops, and follow staking and market
              activity—all in one connected ecosystem.
            </p>

            <div className="explore-hero-actions">
              <button type="button" className="explore-hero-primary" onClick={scrollToContent}>
                Explore ecosystem
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="explore-hero-secondary"
                onClick={() => navigate("/projects")}
              >
                <Compass size={15} aria-hidden="true" />
                Discover projects
              </button>
            </div>

          </div>
          <aside className="explore-orbit-legend" aria-label="HorizonX ecosystem functionalities">
            <div className="explore-orbit-legend-list">
              <span><i style={{ background: "#fff0d0" }} />Tokens</span>
              <span><i style={{ background: "#ffc65a" }} />Projects</span>
              <span><i style={{ background: "#5fd8ff" }} />Launchpad</span>
              <span><i style={{ background: "#ff4a32" }} />Airdrops</span>
              <span><i style={{ background: "#ffa62e" }} />Staking</span>
              <span><i style={{ background: "#ffd884" }} />Markets</span>
              <span><i style={{ background: "#7fe6ff" }} />Partners</span>
            </div>
          </aside>
        </div>
      </OrbitalHeroSection>
      <style>{`
        .explore-orbit-legend {
          position: absolute;
          z-index: 3;
          top: 0%;
          right: clamp(24px, 4.2vw, 72px);
          max-width: min(620px, 58%);
          pointer-events: none;
        }
        .explore-orbit-legend-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: nowrap;
          gap: clamp(10px, 1.35vw, 20px);
        }
        .explore-orbit-legend-list span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(245, 241, 235, 0.82);
          font-size: 9px;
          line-height: 1;
          font-weight: 650;
          letter-spacing: .01em;
          white-space: nowrap;
          text-shadow: 0 1px 10px rgba(0, 0, 0, .95);
        }
        .explore-orbit-legend-list i {
          display: inline-block;
          flex: 0 0 5px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          box-shadow: 0 0 7px currentColor;
        }
        @media (max-width: 1050px) {
          .explore-orbit-legend {
            top: 0%;
            right: 22px;
            max-width: 62%;
          }
          .explore-orbit-legend-list {
            gap: 9px;
          }
          .explore-orbit-legend-list span {
            font-size: 8px;
          }
        }
        @media (max-width: 767px) {
          .explore-orbit-legend {
            top: auto;
            right: 18px;
            bottom: 24px;
            max-width: calc(100% - 36px);
          }
          .explore-orbit-legend-list {
            justify-content: flex-end;
            flex-wrap: wrap;
            column-gap: 12px;
            row-gap: 9px;
          }
        }
      `}</style>
      <div className="explore-hero-bottom-fade" aria-hidden="true" />
    </section>
  );
}

export default ExploreOrbitalHero;
