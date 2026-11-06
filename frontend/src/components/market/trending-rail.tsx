import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AssetMark } from "./asset-mark";
import { Sparkline } from "./sparkline";
import { Link } from "react-router-dom";

export interface RailItem {
  id: string;
  href: string;
  symbol: string;
  name: string;
  logoUrl?: string;
  value: string;
  change: number;
  changeLabel: string;
  series: number[];
  meta?: string;
}

/**
 * Horizontal scroll-snap rail of ranked items. Scrolls natively (touch, trackpad, keyboard)
 * and has paging buttons for mouse users. Entries are divided by hairlines, not boxed.
 */
export function TrendingRail({ items, label, continuous = false }: { items: RailItem[]; label: string; continuous?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className={`mx-rail${continuous ? " mx-rail--continuous" : ""}`} role="region" aria-label={label}>
      {!continuous && (
        <button type="button" className="mx-rail__nav mx-rail__nav--prev" onClick={() => page(-1)} aria-label="Scroll back">
          <ChevronLeft />
        </button>
      )}
      <ul className={`mx-rail__track${continuous ? " mx-rail__track--continuous" : ""}`} ref={track}>
        {[...items, ...(continuous ? items : [])].map((it, index) => {
          const duplicate = continuous && index >= items.length;
          const rank = (index % Math.max(items.length, 1)) + 1;
          return (
            <li key={`${it.id}${duplicate ? "-duplicate" : ""}`} aria-hidden={duplicate || undefined}>
              <Link to={it.href} className="mx-rail__item" tabIndex={duplicate ? -1 : undefined}>
                <span className="mx-rail__rank">{rank}</span>
                <AssetMark symbol={it.symbol} logoUrl={it.logoUrl} />
                <span className="mx-rail__who">
                  <b>{it.symbol}</b>
                  <small>{it.meta ?? it.name}</small>
                </span>
                <Sparkline values={it.series} up={it.change >= 0} />
                <span className="mx-rail__figures">
                  <b>{it.value}</b>
                  <small className={it.change >= 0 ? "is-up" : "is-down"}>{it.changeLabel}</small>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {!continuous && (
        <button type="button" className="mx-rail__nav mx-rail__nav--next" onClick={() => page(1)} aria-label="Scroll forward">
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
