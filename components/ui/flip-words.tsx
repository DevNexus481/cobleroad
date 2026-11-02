"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({
  words,
  duration = 3200,
  className = "",
}: FlipWordsProps) {
  const [currentWord, setCurrentWord] = useState(words[0] || "");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const startAnimation = useCallback(() => {
    const nextIndex = (words.indexOf(currentWord) + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (words.length <= 1) return;

    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation, words.length]);

  if (!words || words.length === 0) return null;

  if (shouldReduceMotion) {
    return <span className={className}>{currentWord}</span>;
  }

  return (
    <span className="inline-block relative overflow-hidden align-baseline select-none">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setIsAnimating(false);
        }}
      >
        <motion.span
          key={currentWord}
          initial={{
            opacity: 0,
            y: 18,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -18,
            filter: "blur(8px)",
            transition: {
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            },
          }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 140,
            mass: 0.8,
          }}
          className={`inline-block whitespace-nowrap will-change-transform ${className}`}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${word}-${letterIndex}`}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.12 + letterIndex * 0.025,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
export default FlipWords;
