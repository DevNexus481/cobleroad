"use client";

import React, { useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  size?: number;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(181, 120, 78, 0.16)",
  size = 400,
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Interactive Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 will-change-transform"
        style={{
          background,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export interface AmbientHeroSpotlightProps {
  className?: string;
}

export function AmbientHeroSpotlight({ className = "" }: AmbientHeroSpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(650px circle at ${smoothX}px ${smoothY}px, rgba(181, 120, 78, 0.22), rgba(181, 150, 10, 0.08) 45%, transparent 80%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute inset-0 z-[1] pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          background,
          opacity: isHovered ? 1 : 0.4,
        }}
      />
    </div>
  );
}

export default SpotlightCard;
