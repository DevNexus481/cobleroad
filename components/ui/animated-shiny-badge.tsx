"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface AnimatedShinyBadgeProps {
  text: string;
  subtext?: string;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AnimatedShinyBadge({
  text,
  subtext,
  href,
  icon,
  className = "",
}: AnimatedShinyBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[rgba(247,244,238,0.2)] bg-[rgba(20,10,5,0.45)] backdrop-blur-md transition-all duration-300 hover:border-[rgba(181,150,10,0.5)] hover:bg-[rgba(20,10,5,0.65)] hover:shadow-[0_0_20px_rgba(181,150,10,0.18)] ${className}`}
      style={{
        textDecoration: "none",
      }}
    >
      {/* Pulsing heritage dot */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--colour-brass)] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--colour-brass)]" />
      </span>

      {icon ? (
        <span className="text-[var(--colour-brass)] opacity-90">{icon}</span>
      ) : (
        <Sparkles size={11} className="text-[var(--colour-brass)] opacity-90" />
      )}

      {/* Shimmering Text */}
      <span className="relative inline-flex items-center gap-1.5 overflow-hidden text-[0.6875rem] font-medium tracking-[0.16em] uppercase">
        <span
          className="bg-clip-text text-transparent transition-all duration-300"
          style={{
            backgroundImage:
              "linear-gradient(110deg, rgba(247,244,238,0.85) 30%, rgba(255,223,150,1) 50%, rgba(247,244,238,0.85) 70%)",
            backgroundSize: "200% 100%",
            animation: shouldReduceMotion ? "none" : "shinyText 4s linear infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {text}
        </span>
        {subtext && (
          <span className="text-[rgba(247,244,238,0.55)] font-light lowercase tracking-normal pl-0.5">
            — {subtext}
          </span>
        )}
      </span>

      {/* Subtle arrow indicator if link */}
      {href && (
        <span className="text-[0.625rem] text-[rgba(247,244,238,0.45)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--colour-ivory)]">
          →
        </span>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default AnimatedShinyBadge;
