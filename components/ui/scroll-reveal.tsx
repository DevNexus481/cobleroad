"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = "",
  viewportMargin = "0px",
  once = true,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: viewportMargin as any, amount: 0.08 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
