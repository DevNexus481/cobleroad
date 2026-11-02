"use client";

import React, { useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface MarqueeProps {
  items?: string[];
  children?: React.ReactNode;
  speed?: number; // duration in seconds
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  children,
  speed = 28,
  direction = "left",
  pauseOnHover = true,
  className = "",
  itemClassName = "",
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultItems = [
    "100% Genuine Full-Grain Leather",
    "Handcrafted in India",
    "Solid Brass Hardware",
    "Bespoke Monogramming Studio",
    "14-Day Compliant Home Trial",
    "Lifetime Guarantee on Craftsmanship",
    "Zero Synthetic Fillers",
  ];

  const contentItems = items || defaultItems;

  const renderContent = (keyPrefix: string) => (
    <div
      className={`flex shrink-0 items-center gap-8 ${
        direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
      }`}
      style={{
        animationDuration: `${speed}s`,
        animationPlayState: shouldReduceMotion ? "paused" : undefined,
      }}
    >
      {children
        ? children
        : contentItems.map((item, index) => (
            <div
              key={`${keyPrefix}-${index}`}
              className={`inline-flex items-center gap-6 whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.2em] font-medium text-[rgba(247,244,238,0.78)] transition-colors hover:text-[var(--colour-ivory)] ${itemClassName}`}
            >
              <span>{item}</span>
              <span
                className="inline-block text-[var(--colour-brass)] opacity-70 text-[0.55rem] select-none"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`group relative flex w-full overflow-hidden select-none ${
        pauseOnHover ? "[&:hover_.animate-marquee-left]:[animation-play-state:paused] [&:hover_.animate-marquee-right]:[animation-play-state:paused]" : ""
      } ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {renderContent("marquee-1")}
      {renderContent("marquee-2")}
      {renderContent("marquee-3")}
    </div>
  );
}

export default Marquee;
