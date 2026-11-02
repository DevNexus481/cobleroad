'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ThemeToggleProps {
  variant?: 'icon' | 'row'
  className?: string
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    if (variant === 'row') {
      return (
        <div className={`flex items-center justify-between py-2.5 ${className}`}>
          <span className="text-[0.75rem] uppercase tracking-[0.14em] font-medium opacity-60">
            Appearance
          </span>
          <div className="w-12 h-6 rounded-full bg-[var(--colour-parchment)] opacity-50" />
        </div>
      )
    }

    return (
      <button
        type="button"
        className={`nav-icon-btn ${className}`}
        aria-label="Toggle theme"
        disabled
      >
        <span className="w-4 h-4 rounded-full opacity-30" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  if (variant === 'row') {
    return (
      <div
        className={`flex items-center justify-between py-3 border-t border-[var(--colour-border)] ${className}`}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <Moon size={15} className="text-[var(--colour-cognac-light)]" />
          ) : (
            <Sun size={15} className="text-[var(--colour-brass)]" />
          )}
          <span className="text-[0.8125rem] uppercase tracking-[0.12em] font-medium text-[var(--colour-espresso)]">
            {isDark ? 'Dark Atelier' : 'Light Paper'}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-[var(--colour-border)] bg-[var(--colour-parchment)] p-0.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--colour-cognac)]"
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-colors ${
              isDark
                ? 'translate-x-5 bg-[var(--colour-cognac-light)] text-[var(--colour-paper)]'
                : 'translate-x-0 bg-[var(--colour-espresso)] text-[var(--colour-ivory)]'
            }`}
          >
            {isDark ? <Moon size={10} strokeWidth={2.5} /> : <Sun size={10} strokeWidth={2.5} />}
          </motion.span>
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`nav-icon-btn group relative overflow-hidden ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      id="theme-toggle-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-icon"
            initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center text-[var(--colour-brass)] transition-colors group-hover:text-[var(--colour-cognac-light)]"
          >
            <Sun size={18} strokeWidth={1.75} />
          </motion.div>
        ) : (
          <motion.div
            key="light-icon"
            initial={{ rotate: 70, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -70, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center text-[var(--colour-espresso)] transition-colors group-hover:text-[var(--colour-cognac)]"
          >
            <Moon size={18} strokeWidth={1.75} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggle
