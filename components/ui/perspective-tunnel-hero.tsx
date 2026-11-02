"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface TunnelCardItem {
  id: string;
  brand: string;
  category: string;
  logo: string;
}

// 100% background-less, pure transparent vector SVG logos
export const COBLEROAD_COLLABORATIONS: TunnelCardItem[] = [
  {
    id: "bmw-motorrad",
    brand: "BMW Motorrad",
    category: "Automotive Heritage",
    logo: "/images/collaborations/logos/bmw-motorrad.svg",
  },
  {
    id: "the-macallan",
    brand: "The Macallan",
    category: "Luxury Single Malt",
    logo: "/images/collaborations/logos/the-macallan.svg",
  },
  {
    id: "bacardi",
    brand: "Bacardí",
    category: "Heritage Spirits",
    logo: "/images/collaborations/logos/bacardi.svg",
  },
  {
    id: "rajasthan-royals",
    brand: "Rajasthan Royals",
    category: "Premier Athletics",
    logo: "/images/collaborations/logos/rajasthan-royals.svg",
  },
  {
    id: "wipro",
    brand: "Wipro",
    category: "Technology & Enterprise",
    logo: "/images/collaborations/logos/wipro.svg",
  },
  {
    id: "vedanta",
    brand: "Vedanta",
    category: "Global Resources",
    logo: "/images/collaborations/logos/vedanta.svg",
  },
  {
    id: "courtyard-marriott",
    brand: "Courtyard by Marriott",
    category: "Luxury Hospitality",
    logo: "/images/collaborations/logos/courtyard-marriott.svg",
  },
  {
    id: "fairfield-marriott",
    brand: "Fairfield by Marriott",
    category: "Hospitality Suites",
    logo: "/images/collaborations/logos/fairfield-marriott.svg",
  },
  {
    id: "doubletree-hilton",
    brand: "DoubleTree by Hilton",
    category: "Five-Star Hospitality",
    logo: "/images/collaborations/logos/doubletree-hilton.svg",
  },
  {
    id: "sarovar-hotels",
    brand: "Sarovar Hotels & Resorts",
    category: "Hotels & Resorts",
    logo: "/images/collaborations/logos/sarovar-hotels.svg",
  },
  {
    id: "maxim",
    brand: "Maxim Magazine",
    category: "Editorial Media",
    logo: "/images/collaborations/logos/maxim.svg",
  },
  {
    id: "iifl-wealth",
    brand: "IIFL Wealth Management",
    category: "Private Wealth",
    logo: "/images/collaborations/logos/iifl-wealth.svg",
  },
  {
    id: "holiday-inn",
    brand: "Holiday Inn",
    category: "Hospitality Group",
    logo: "/images/collaborations/logos/holiday-inn.svg",
  },
  {
    id: "golden-tulip",
    brand: "Golden Tulip",
    category: "Inns & Resorts",
    logo: "/images/collaborations/logos/golden-tulip.svg",
  },
  {
    id: "tulip-inn",
    brand: "Tulip Inn",
    category: "Boutique Hotels",
    logo: "/images/collaborations/logos/tulip-inn.svg",
  },
  {
    id: "maxxis-tires",
    brand: "Maxxis Tires",
    category: "Motorsport & Touring",
    logo: "/images/collaborations/logos/maxxis-tires.svg",
  },
  {
    id: "edrington",
    brand: "Edrington",
    category: "Fine Distillers",
    logo: "/images/collaborations/logos/edrington.svg",
  },
  {
    id: "buzz-marketing",
    brand: "Buzz Marketing",
    category: "Creative Agency",
    logo: "/images/collaborations/logos/buzz-marketing.svg",
  },
  {
    id: "india-liv-group",
    brand: "India Liv Group",
    category: "Enterprise Group",
    logo: "/images/collaborations/logos/india-liv-group.svg",
  },
];

interface TunnelCardData {
  item: TunnelCardItem;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.26;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1400 : -2000;
  const nearZ = stage.isMobile ? 380 : 540;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(160, Math.min(230, stage.width * 0.46))
    : Math.max(220, Math.min(300, stage.width * 0.2));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 22 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    }
  );

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      className="pointer-events-auto absolute left-1/2 top-1/2 will-change-transform select-none cursor-pointer flex items-center justify-center"
    >
      {/* Pure Frameless Floating Brand Logo in 3D Perspective — NO BOX, NO BORDER */}
      <div className="group relative flex items-center justify-center p-3 transition-transform duration-500 hover:scale-115">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.item.logo}
          alt={card.item.brand}
          draggable={false}
          className="max-h-16 sm:max-h-22 w-auto max-w-[260px] object-contain filter drop-shadow-[0_12px_24px_rgba(43,33,29,0.16)] transition-all duration-500 group-hover:drop-shadow-[0_18px_32px_rgba(154,99,63,0.32)]"
        />
      </div>
    </motion.div>
  );
}

export interface PerspectiveTunnelHeroProps {
  cards?: TunnelCardItem[];
  className?: string;
}

export default function PerspectiveTunnelHero({
  cards = COBLEROAD_COLLABORATIONS,
  className = "",
}: PerspectiveTunnelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 850,
    isMobile: false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setStage({
        width: w,
        height: h,
        isMobile: w < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Motion value controlled directly by wheel / touch
  // Calibrated with a slow, graceful, museum-grade spring (from commit 8b3d68e)
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 45,
    damping: 30,
    restDelta: 0.0001,
  });

  const progressRef = useRef(0);

  // Precise scroll & wheel controller from commit 8b3d68e:
  // 1. Locks the viewport when this section is in view
  // 2. Drives the 3D tunnel through all 19 cards at an unhurried, calm, luxurious pace
  // 3. Downward scroll advances (0 -> 1); upward scroll rewinds (1 -> 0) at the EXACT same calibrated speed
  // 4. Downward scroll to the rest of the site is unlocked only upon 100% completion (progress >= 0.995)
  // 5. Upward scroll back to the store is unlocked only upon 100% rewind (progress <= 0.005)
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const getSectionTop = () => {
      const rect = section.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const sectionTop = getSectionTop();

      // When section is in view occupying the screen
      const isInView = rect.top <= 25 && rect.bottom >= winH - 25;

      if (isInView) {
        // Downward scroll: advance tunnel if not yet at end
        if (e.deltaY > 0 && progressRef.current < 0.995) {
          e.preventDefault();
          window.scrollTo(0, sectionTop);
          const delta = Math.min(0.016, Math.max(0.0035, Math.abs(e.deltaY) * 0.000085));
          const next = Math.min(1, progressRef.current + delta);
          progressRef.current = next;
          rawProgress.set(next);
          return;
        }

        // Upward scroll: rewind tunnel at the EXACT same speed
        if (e.deltaY < 0 && progressRef.current > 0.005) {
          e.preventDefault();
          window.scrollTo(0, sectionTop);
          const delta = Math.min(0.016, Math.max(0.0035, Math.abs(e.deltaY) * 0.000085));
          const next = Math.max(0, progressRef.current - delta);
          progressRef.current = next;
          rawProgress.set(next);
          return;
        }

        // If progress >= 0.995 and scrolling down: allows normal page scroll down!
        // If progress <= 0.005 and scrolling up: allows normal page scroll up!
      }
    };

    // Scroll listener: enforces mandatory completion before scrolling down
    const onScroll = () => {
      const sectionTop = getSectionTop();
      const scrollY = window.scrollY;

      // Prevent scrolling down past section until all 19 cards have completed
      if (progressRef.current < 0.995 && scrollY > sectionTop + 5) {
        window.scrollTo(0, sectionTop);
      }
    };

    // Touch handling for mobile/tablet
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const sectionTop = getSectionTop();
      const isInView = rect.top <= 25 && rect.bottom >= winH - 25;
      if (!isInView) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // positive = swipe up = scroll down
      touchStartY = touchY;

      // Downward swipe: advance
      if (deltaY > 0 && progressRef.current < 0.995) {
        e.preventDefault();
        window.scrollTo(0, sectionTop);
        const delta = Math.min(0.02, Math.max(0.005, Math.abs(deltaY) * 0.00025));
        const next = Math.min(1, progressRef.current + delta);
        progressRef.current = next;
        rawProgress.set(next);
      }
      // Upward swipe: rewind at the EXACT same speed
      else if (deltaY < 0 && progressRef.current > 0.005) {
        e.preventDefault();
        window.scrollTo(0, sectionTop);
        const delta = Math.min(0.02, Math.max(0.005, Math.abs(deltaY) * 0.00025));
        const next = Math.max(0, progressRef.current - delta);
        progressRef.current = next;
        rawProgress.set(next);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove", onTouchMove);
    };
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.45, 0.7, 0.7, 0.15]);

  const activeCards = cards.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.32 + (i % 3) * 0.09;
    const radiusFactorY = 0.28 + (i % 2) * 0.1;

    return {
      item,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX,
      radiusFactorY,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3) * 1.5),
      index: i,
    };
  });

  return (
    <section
      ref={containerRef}
      className={`relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#FAF8F5] text-[var(--colour-espresso)] select-none flex items-center justify-center ${className}`}
      style={{
        perspective: stage.isMobile ? "900px" : "1200px",
        transformStyle: "preserve-3d",
      }}
      aria-label="Brand Collaborations Showcase"
    >
      {/* Ambient Warm Paper Texture & Subtle Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D8CEBF_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,207,193,0.3)_0%,transparent_70%)]" />

      {/* Quiet, Minimal Center Wordmark — NO other text, NO overlapping layers */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none z-0 flex flex-col items-center text-center px-4"
      >
        <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-light tracking-[0.28em] uppercase text-[var(--colour-espresso)]/30">
          Collaborations
        </h2>
      </motion.div>

      {/* 3D Z-Space Corridor Plane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {activeCards.map((card) => (
          <TunnelCard
            key={card.item.id}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={activeCards.length}
            stage={stage}
          />
        ))}
      </div>
    </section>
  );
}
