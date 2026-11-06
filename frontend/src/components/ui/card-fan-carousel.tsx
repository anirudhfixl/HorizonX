import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";

export interface FanCardItem {
  id: string;
  content: ReactNode;
}

interface SocialCardsProps {
  cards: FanCardItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -14, scale: 0.86, x: -30, y: 4.8, zIndex: 1 },
  { rot: -9.5, scale: 0.91, x: -20, y: 2.6, zIndex: 2 },
  { rot: -5, scale: 0.96, x: -10, y: 0.7, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 5, scale: 0.96, x: 10, y: 0.7, zIndex: 3 },
  { rot: 9.5, scale: 0.91, x: 20, y: 2.6, zIndex: 2 },
  { rot: 14, scale: 0.86, x: 30, y: 4.8, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1;
}

function getHeightMultiplier(width: number) {
  const idealHeight = width < 480 ? 352 : width < 640 ? 416 : width < 768 ? 448 : width < 1024 ? 544 : 608;
  return Math.min(1, (window.innerHeight * 0.78) / idealHeight);
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = (totalCards - 1) / 2;
  const distance = totalCards > 1 ? (slot - center) / Math.max(center, 1) : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 14,
    scale: 1 - 0.14 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 4.8,
    zIndex: 10 - Math.round(absDistance * 8) + (slot > center ? 0 : 1),
  };
}

const ARROW_CLASSES =
  "relative z-30 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.05] text-white/65 shadow-[0_4px_20px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 md:h-12 md:w-12";

export default function SocialCards({ cards }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const previousVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : Math.floor((totalCards - 1) / 2));

  const getVisibleMap = useCallback((center: number) => {
    const visible = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, index) => visible.set(index, index));
      return visible;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot += 1) {
      visible.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return visible;
  }, [cards, needsPagination, totalCards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex((previous) => direction === "right"
      ? (previous + 1) % totalCards
      : (previous - 1 + totalCards) % totalCards);
  }, [needsPagination, totalCards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const elements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!elements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const oldVisible = previousVisible.current;
    const direction = directionRef.current;
    const firstMount = !hasEntered.current;
    const xMultiplier = getResponsiveMultiplier(window.innerWidth);
    const yMultiplier = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (firstMount) isAnimating.current = true;
    let completed = 0;
    const onDone = () => {
      completed += 1;
      if (completed >= visibleMap.size) {
        isAnimating.current = false;
        if (firstMount) hasEntered.current = true;
      }
    };

    elements.forEach((element, index) => {
      const slot = visibleMap.get(index);
      const wasVisible = oldVisible.has(index);
      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * xMultiplier}rem`,
          y: `${y * yMultiplier}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (firstMount) {
          gsap.set(element, { xPercent: -50, yPercent: -50, x: 0, y: `${12 * yMultiplier}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(element, { ...target, duration: 1.15, ease: "elastic.out(1.05,.78)", delay: 0.16 + slot * 0.055, onComplete: onDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(element, { xPercent: -50, yPercent: -50, x: `${enterX}rem`, y: `${y * yMultiplier}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(element, { ...target, duration: 0.6, ease: "power2.out", onComplete: onDone });
        } else {
          gsap.to(element, { ...target, duration: 0.55, ease: "power2.out", onComplete: onDone });
        }
      } else if (wasVisible) {
        gsap.to(element, { x: direction === "right" ? "-40rem" : "40rem", opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (firstMount) {
        gsap.set(element, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    previousVisible.current = new Set(visibleMap.keys());

    const visibleEntries = elements
      .map((el, index) => ({ el, slot: visibleMap.get(index) }))
      .filter((entry): entry is { el: HTMLElement; slot: number } => entry.slot !== undefined)
      .sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    const centerSlot = Math.floor(visibleEntries.length / 2);

    const updateHoverLayout = (hoveredSlot: number | null) => {
      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * getResponsiveMultiplier(window.innerWidth);
        let targetY = base.y * getHeightMultiplier(window.innerWidth);
        let targetRotation = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;
          if (slot === hoveredSlot) {
            targetY -= 2.4 * getHeightMultiplier(window.innerWidth);
            targetScale *= 1.055;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const push = 5.5 * (1 - Math.abs(normalized)) * (1 + 0.12 * Math.max(0, 3 - distance));
            if (slot < hoveredSlot) {
              targetX -= push * getResponsiveMultiplier(window.innerWidth);
              targetRotation -= 3 / (distance + 1);
            } else {
              targetX += push * getResponsiveMultiplier(window.innerWidth);
              targetRotation += 3 / (distance + 1);
            }
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRotation,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        // Keep the hovered card above every overlapping card for readable content.
        gsap.set(el, { zIndex: slot === hoveredSlot ? 100 : base.zIndex });
      });
    };

    const handlers = visibleEntries.map(({ el, slot }) => {
      const onEnter = () => {
        if (isAnimating.current) return;
        if (leaveTimer) clearTimeout(leaveTimer);
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", onEnter);
      return { el, onEnter };
    });

    const onLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };

    container.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      handlers.forEach(({ el, onEnter }) => el.removeEventListener("mouseenter", onEnter));
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
      elements.forEach((element) => gsap.killTweensOf(element));
    };
  }, [centerIndex, getVisibleMap, needsPagination, totalCards]);

  if (!totalCards) return null;

  return (
    <section className="relative z-10 w-full px-2 py-4 sm:px-4 lg:px-5">
      <div
        ref={containerRef}
        className="fan-layout relative mx-auto h-[450px] w-full max-w-[112rem] overflow-visible sm:h-[480px] lg:h-[520px]"
        aria-label="HorizonX capabilities fan carousel"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="fan-card absolute left-1/2 top-1/2 h-[390px] w-[min(80vw,280px)] sm:h-[410px] sm:w-[310px] lg:h-[426px] lg:w-[350px]"
            style={{ transformOrigin: "50% 50%", opacity: 0 }}
          >
            {card.content}
          </div>
        ))}
      </div>

      {needsPagination && (
        <div className="relative z-30 mt-2 flex items-center justify-center gap-4">
          <button type="button" className={ARROW_CLASSES} onClick={() => cycle("left")} aria-label="Previous capability">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-2" aria-label={`Card ${centerIndex + 1} of ${totalCards}`}>
            {cards.map((card, index) => (
              <span key={card.id} className={`h-1.5 rounded-full transition-all duration-300 ${index === centerIndex ? "w-5 bg-white/80" : "w-1.5 bg-white/20"}`} />
            ))}
          </div>
          <button type="button" className={ARROW_CLASSES} onClick={() => cycle("right")} aria-label="Next capability">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}

