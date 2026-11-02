"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface TunnelCardItem {
  id: string;
  brand: string;
  category: string;
  logo: string;
}

export const COBLEROAD_COLLABORATIONS: TunnelCardItem[] = [
  {
    id: "bmw-motorrad",
    brand: "BMW Motorrad",
    category: "Automotive Heritage",
    logo: "/images/collaborations/logos/bmw-motorrad.png",
  },
  {
    id: "the-macallan",
    brand: "The Macallan",
    category: "Luxury Single Malt",
    logo: "/images/collaborations/logos/the-macallan.png",
  },
  {
    id: "bacardi",
    brand: "Bacardí",
    category: "Heritage Spirits",
    logo: "/images/collaborations/logos/bacardi.png",
  },
  {
    id: "rajasthan-royals",
    brand: "Rajasthan Royals",
    category: "Premier Athletics",
    logo: "/images/collaborations/logos/rajasthan-royals.png",
  },
  {
    id: "wipro",
    brand: "Wipro",
    category: "Technology & Enterprise",
    logo: "/images/collaborations/logos/wipro.png",
  },
  {
    id: "vedanta",
    brand: "Vedanta",
    category: "Global Resources",
    logo: "/images/collaborations/logos/vedanta.png",
  },
  {
    id: "courtyard-marriott",
    brand: "Courtyard by Marriott",
    category: "Luxury Hospitality",
    logo: "/images/collaborations/logos/courtyard-marriott.png",
  },
  {
    id: "fairfield-marriott",
    brand: "Fairfield by Marriott",
    category: "Hospitality Suites",
    logo: "/images/collaborations/logos/fairfield-marriott.png",
  },
  {
    id: "doubletree-hilton",
    brand: "DoubleTree by Hilton",
    category: "Five-Star Hospitality",
    logo: "/images/collaborations/logos/doubletree-hilton.png",
  },
  {
    id: "sarovar-hotels",
    brand: "Sarovar Hotels & Resorts",
    category: "Hotels & Resorts",
    logo: "/images/collaborations/logos/sarovar-hotels.png",
  },
  {
    id: "maxim",
    brand: "Maxim Magazine",
    category: "Editorial Media",
    logo: "/images/collaborations/logos/maxim.png",
  },
  {
    id: "iifl-wealth",
    brand: "IIFL Wealth Management",
    category: "Private Wealth",
    logo: "/images/collaborations/logos/iifl-wealth.png",
  },
  {
    id: "holiday-inn",
    brand: "Holiday Inn",
    category: "Hospitality Group",
    logo: "/images/collaborations/logos/holiday-inn.png",
  },
  {
    id: "golden-tulip",
    brand: "Golden Tulip",
    category: "Inns & Resorts",
    logo: "/images/collaborations/logos/golden-tulip.png",
  },
  {
    id: "tulip-inn",
    brand: "Tulip Inn",
    category: "Boutique Hotels",
    logo: "/images/collaborations/logos/tulip-inn.png",
  },
  {
    id: "maxxis-tires",
    brand: "Maxxis Tires",
    category: "Motorsport & Touring",
    logo: "/images/collaborations/logos/maxxis-tires.png",
  },
  {
    id: "edrington",
    brand: "Edrington",
    category: "Fine Distillers",
    logo: "/images/collaborations/logos/edrington.png",
  },
  {
    id: "buzz-marketing",
    brand: "Buzz Marketing",
    category: "Creative Agency",
    logo: "/images/collaborations/logos/buzz-marketing.png",
  },
  {
    id: "india-liv-group",
    brand: "India Liv Group",
    category: "Enterprise Group",
    logo: "/images/collaborations/logos/india-liv-group.png",
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
  // Stagger window so first 3 cards are already visible when user arrives, and subsequent cards stream through
  const windowSpan = 0.36;
  const start = ((card.index - 1.5) / (total - 1)) * (1 - windowSpan * 0.4);
  const end = start + windowSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1400 : -2000;
  const nearZ = stage.isMobile ? 380 : 560;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  // Smooth fade in as it leaves the tunnel depth, stable while in view, soft fade out as it zooms past camera
  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(160, Math.min(220, stage.width * 0.45))
    : Math.max(200, Math.min(280, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 40;

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
        zIndex: card.index + 10,
      }}
      className="pointer-events-auto absolute left-1/2 top-1/2 will-change-transform select-none cursor-pointer flex items-center justify-center"
    >
      {/* Luxury Collaboration Tile with Glassmorphic Border */}
      <div className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[var(--colour-paper)]/85 dark:bg-[#1A120D]/90 backdrop-blur-md border border-[var(--colour-border)]/80 dark:border-[#38261C] shadow-[0_12px_32px_rgba(43,33,29,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[var(--colour-cognac)] hover:shadow-[0_16px_40px_rgba(154,99,63,0.2)] hover:scale-105">
        <div className="relative h-12 sm:h-14 w-full flex items-center justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.item.logo}
            alt={card.item.brand}
            draggable={false}
            className="max-h-12 sm:max-h-14 w-auto max-w-[190px] object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105 dark:brightness-110"
          />
        </div>
        <span className="text-[0.6875rem] font-serif font-medium tracking-wide text-[var(--colour-espresso)] text-center line-clamp-1">
          {card.item.brand}
        </span>
        <span className="text-[0.5rem] uppercase tracking-[0.16em] text-[var(--colour-cognac)] font-medium mt-0.5">
          {card.item.category}
        </span>
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

  // Standard CSS sticky-scroll track: native, fluid, zero scroll-jacking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 26,
    restDelta: 0.001,
  });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.96, 1.04, 1.0, 0.92]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.1, 0.85, 1], [0.85, 1, 0.8, 0.3]);
  const scrollPromptOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);

  const activeCards = cards.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.32 + (i % 3) * 0.08;
    const radiusFactorY = 0.28 + (i % 2) * 0.09;

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
      className={`relative h-[220vh] w-full bg-[var(--colour-paper)] transition-colors duration-300 ${className}`}
      aria-label="Brand Collaborations Showcase"
    >
      {/* Sticky Fullscreen 3D Viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none"
        style={{
          perspective: stage.isMobile ? "850px" : "1300px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Subtle Ambient Studio Texture & Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--colour-border)_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,120,78,0.08)_0%,transparent_75%)]" />

        {/* Quiet, Minimal Center Title Lockup */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex flex-col items-center text-center px-4 max-w-xl mx-auto"
        >
          <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.24em] font-medium text-[var(--colour-cognac)] mb-2.5">
            ✦ Partnerships of Distinction ✦
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[var(--colour-espresso)] leading-tight mb-3">
            Crafted in Union with the World&apos;s Finest.
          </h2>
          <p className="text-[0.75rem] sm:text-[0.8125rem] text-[var(--colour-charcoal)]/80 max-w-md leading-relaxed tracking-wide">
            From heritage automotive icons to historic distilleries — trusted to build leather goods that carry a legacy.
          </p>
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

        {/* Scroll Prompt Indicator */}
        <motion.div
          style={{ opacity: scrollPromptOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-[0.625rem] tracking-[0.18em] uppercase text-[var(--colour-charcoal)]/70"
        >
          <span>Scroll to explore</span>
          <span className="inline-block animate-bounce text-[var(--colour-cognac)] text-xs">
            ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}
