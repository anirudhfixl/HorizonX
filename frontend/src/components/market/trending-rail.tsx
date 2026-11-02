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
export function TrendingRail({ items, label }: { items: RailItem[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="mx-rail" role="region" aria-label={label}>
      <button type="button" className="mx-rail__nav mx-rail__nav--prev" onClick={() => page(-1)} aria-label="Scroll back">
        <ChevronLeft />
      </button>
      <ul className="mx-rail__track" ref={track}>
        {items.map((it, i) => (
          <li key={it.id}>
            <Link to={it.href} className="mx-rail__item">
              <span className="mx-rail__rank">{i + 1}</span>
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
        ))}
      </ul>
      <button type="button" className="mx-rail__nav mx-rail__nav--next" onClick={() => page(1)} aria-label="Scroll forward">
        <ChevronRight />
      </button>
    </div>
  );
}
