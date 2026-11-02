import React, { useEffect, useState } from "react";
import { Sparkline } from "./sparkline";
import { AssetMark } from "./asset-mark";
import { Link } from "react-router-dom";

export interface FeaturedStat {
  label: string;
  value: string;
  tone?: "up" | "down";
}

export interface FeaturedSlide {
  id: string;
  href: string;
  symbol: string;
  logoUrl?: string;
  title: string;
  kicker: string;
  description: string;
  stats: FeaturedStat[];
  series: number[];
  up: boolean;
  /** Short facts such as "Presale live" shown under the stats. */
  tags?: string[];
  cta: string;
}

/**
 * Editorial feature area: one large slide and a selectable index of the others.
 * Advances itself slowly until the person interacts, never when reduced motion is requested.
 */
export function FeaturedCarousel({ slides, label, intervalMs = 9000 }: { slides: FeaturedSlide[]; label: string; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  const s = slides[Math.min(index, slides.length - 1)];
  if (!s) return null;

  return (
    <section
      className="mx-feature"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <article className="mx-feature__stage" key={s.id} aria-live="polite">
        <div className="mx-feature__copy">
          <p className="mx-feature__kicker">{s.kicker}</p>
          <h3>
            <AssetMark symbol={s.symbol} logoUrl={s.logoUrl} size="lg" />
            {s.title}
          </h3>
          <p className="mx-feature__desc">{s.description}</p>
          <dl className="mx-feature__stats">
            {s.stats.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd className={st.tone ? `is-${st.tone}` : undefined}>{st.value}</dd>
              </div>
            ))}
          </dl>
          {s.tags && s.tags.length > 0 && <p className="mx-feature__tags">{s.tags.join(", ")}</p>}
          <Link to={s.href} className="mx-btn mx-btn--primary">
            {s.cta}
          </Link>
        </div>
        <div className="mx-feature__art" aria-hidden="true">
          <Sparkline values={s.series} up={s.up} fill />
        </div>
      </article>
      <ol className="mx-feature__index">
        {slides.map((sl, i) => (
          <li key={sl.id}>
            <button type="button" data-active={i === index} aria-current={i === index} onClick={() => { setIndex(i); setPaused(true); }}>
              <AssetMark symbol={sl.symbol} logoUrl={sl.logoUrl} size="sm" />
              <span>
                <b>{sl.symbol}</b>
                <small>{sl.kicker}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
