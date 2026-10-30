"use client";

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="explore-orbital-hero relative isolate left-1/2 -translate-x-1/2 -mt-24 sm:-mt-28 w-screen overflow-hidden bg-black">
      <OrbitalHeroSection
        className="orbital-scene"
        focus={narrow ? [0.5, 0.77] : [0.76, 0.44]}
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
        <div className="hero-overlay">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-pulse" />
              THE PROMINERS DISCOVERY NETWORK
            </div>

            <h1>
              Explore what’s
              <br />
              <em>in orbit.</em>
            </h1>

            <p>
              Discover tokens, emerging projects, launch opportunities,
              airdrops and staking ecosystems—all connected in one place.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="hero-primary"
                onClick={() => scrollTo("explore-discovery-content")}
              >
                Explore the ecosystem
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="hero-secondary"
                onClick={() => scrollTo("explore-discovery-content")}
              >
                <Compass size={15} />
                Browse categories
              </button>
            </div>

            <div className="hero-caption">
              <Activity size={13} />
              SIX DISCOVERY SECTORS · ONE CONNECTED ECOSYSTEM
            </div>
          </div>
        </div>
      </OrbitalHeroSection>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-56 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505]"
      />

      <style jsx>{`
        .explore-orbital-hero {
          height: 680px;
          min-height: 620px;
          max-height: 780px;
        }

        .orbital-scene {
          height: 100%;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          background: #020305;
        }

        .hero-overlay {
          position: relative;
          height: 100%;
          width: 100%;
          min-width: 0;
          isolation: isolate;
        }

        .hero-overlay::after {
          content: "";
          position: absolute;
          z-index: 0;
          inset: auto 0 0;
          height: 130px;
          pointer-events: none;
          background: linear-gradient(180deg, transparent, #090909);
        }

        .hero-copy {
          position: absolute;
          z-index: 2;
          left: clamp(28px, 8.2vw, 138px);
          top: 51%;
          transform: translateY(-34%);
          width: min(570px, 45vw);
          max-width: calc(100% - 56px);
          color: #f5f3ed;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #e4a36e;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.19em;
        }

        .eyebrow-pulse {
          width: 6px;
          height: 6px;
          flex: 0 0 6px;
          border-radius: 50%;
          background: #f58b37;
          box-shadow: 0 0 14px #f58b37;
        }

        .hero-copy h1 {
          margin: 22px 0 0;
          font-family: "Space Grotesk", var(--font-geist-sans), sans-serif;
          font-size: clamp(54px, 6.2vw, 86px);
          line-height: 0.99;
          letter-spacing: -0.075em;
          font-weight: 500;
          color: #f5f3ed;
        }

        .hero-copy h1 em {
          color: #f18a3b;
          font-style: normal;
        }

        .hero-copy p {
          max-width: 460px;
          margin: 22px 0 0;
          color: rgba(239, 235, 225, 0.68);
          font-size: 15px;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .hero-primary,
        .hero-secondary {
          height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          font-size: 12px;
          font-weight: 700;
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
        }

        .hero-primary {
          border: 1px solid #f47b20;
          background: #f47b20;
          color: #17100a;
        }

        .hero-primary:hover {
          transform: translateY(-2px);
          background: #ff913c;
        }

        .hero-secondary {
          border: 1px solid rgba(255, 255, 255, 0.23);
          background: rgba(12, 12, 12, 0.28);
          color: #f2eee7;
          backdrop-filter: blur(8px);
        }

        .hero-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.48);
        }

        .hero-caption {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 40px;
          color: rgba(227, 220, 205, 0.42);
          font-size: 8px;
          letter-spacing: 0.17em;
        }

        .hero-caption :global(svg) {
          color: #e98b43;
        }

        @media (max-width: 860px) {
          .explore-orbital-hero {
            height: 650px;
          }

          .hero-copy {
            width: min(550px, 62vw);
            left: 6vw;
          }
        }

        @media (max-width: 767px) {
          .explore-orbital-hero {
            height: 760px;
            min-height: 720px;
            max-height: none;
          }

          .hero-copy {
            left: 23px;
            right: 23px;
            top: 40%;
            transform: none;
            width: auto;
            max-width: none;
          }

          .hero-copy h1 {
            font-size: clamp(47px, 12vw, 66px);
          }

          .hero-copy p {
            font-size: 13px;
            max-width: 420px;
          }

          .hero-caption {
            margin-top: 28px;
            font-size: 7px;
          }
        }

        @media (min-width: 768px) and (max-width: 1050px) {
          .hero-copy {
            width: 48vw;
            left: 5vw;
          }

          .hero-copy h1 {
            font-size: 62px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-primary,
          .hero-secondary {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
