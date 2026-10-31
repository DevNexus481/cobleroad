'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

type FinishType = 'gold' | 'blind' | 'silver'
type LeatherType = 'cognac' | 'espresso'

interface LeatherOption {
  id: LeatherType
  name: string
  hex: string
  tagImage: string
  tagAlt: string
}

const LEATHER_OPTIONS: LeatherOption[] = [
  {
    id: 'cognac',
    name: 'Warm Cognac',
    hex: '#9A633F',
    tagImage: '/images/monogram/tag-cognac.jpg',
    tagAlt: 'Handcrafted Warm Cognac leather luggage tag',
  },
  {
    id: 'espresso',
    name: 'Deep Espresso',
    hex: '#2B211D',
    tagImage: '/images/monogram/tag-espresso.jpg',
    tagAlt: 'Handcrafted Deep Espresso leather luggage tag',
  },
]

const FINISH_OPTIONS: { id: FinishType; label: string; sub: string; detail: string }[] = [
  {
    id: 'gold',
    label: '24K Gold Foil',
    sub: 'Classical Radiance',
    detail: 'Genuine 24-karat gold leaf heat-bonded directly into leather fibers.',
  },
  {
    id: 'blind',
    label: 'Thermal Blind Deboss',
    sub: 'Tactile Permanence',
    detail: '120°C heated brass die darkens natural oils with zero metallic foil.',
  },
  {
    id: 'silver',
    label: 'Sterling Silver',
    sub: 'Architectural Sheen',
    detail: 'Clean metallic foil fused with razor-sharp edges for modern contrast.',
  },
]

export function MonogramStudioInteractive() {
  const [initials, setInitials] = useState<string>('C · R')
  const [selectedLeather, setSelectedLeather] = useState<LeatherType>('cognac')
  const [selectedFinish, setSelectedFinish] = useState<FinishType>('gold')

  const activeLeather = LEATHER_OPTIONS.find((l) => l.id === selectedLeather) || LEATHER_OPTIONS[0]

  const handleInitialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow Latin letters A-Z, space, dots, and center dot (·)
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9·\s.-]/g, '')
    if (raw.length <= 5) {
      setInitials(raw)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-white)', border: '1px solid var(--colour-border)', borderRadius: '2px', padding: 'clamp(1.5rem, 4vw, 3.5rem)', boxShadow: '0 4px 20px rgba(43, 33, 29, 0.04)' }}>
      {/* Studio Header */}
      <div style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto clamp(2rem, 4vw, 3rem)' }}>
        <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
          Interactive Atelier Studio
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
          Preview Your Bespoke Monogram
        </h2>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
          Test your initials live on our handcrafted leather tag. Choose your hide and stamping finish to observe the tactile impression before placing your order.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
        {/* Left: Tag Photographic Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '1 / 1',
              backgroundColor: 'var(--colour-parchment)',
              border: '1px solid var(--colour-border)',
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 40px rgba(43, 33, 29, 0.05), 0 8px 24px rgba(43, 33, 29, 0.06)',
            }}
          >
            {/* Tag Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLeather.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image
                  src={activeLeather.tagImage}
                  alt={activeLeather.tagAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: 'contain' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Precision Hot-Stamped Initials on the Tag Surface */}
            <div
              style={{
                position: 'absolute',
                top: '64%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '45%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${initials}-${selectedFinish}-${selectedLeather}`}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.06 }}
                  transition={{ duration: 0.22 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                  <span
                    className={`initials-text ${
                      selectedFinish === 'gold'
                        ? 'finish-gold'
                        : selectedFinish === 'silver'
                        ? 'finish-silver'
                        : 'finish-blind'
                    }`}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.25rem, 2.6vw, 1.85rem)',
                      letterSpacing: '0.22em',
                      lineHeight: 1,
                    }}
                  >
                    {initials || 'C · R'}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle Tag Overlay Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(20, 10, 5, 0.65)',
                backdropFilter: 'blur(4px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '2px',
                fontSize: '0.5625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--colour-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {activeLeather.name} &bull; {selectedFinish === 'gold' ? '24K Gold Leaf' : selectedFinish === 'blind' ? 'Blind Deboss' : 'Sterling Silver'}
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--colour-charcoal)', opacity: 0.65, marginTop: '1rem', fontStyle: 'italic' }}>
            &bull; Stamped at 120&deg;C using solid brass dies in our New Delhi atelier
          </span>
        </div>

        {/* Right: Studio Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Step 1: Initials Input */}
          <div>
            <label
              htmlFor="monogram-initials-input"
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--colour-espresso)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              1. Your Bespoke Initials
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                id="monogram-initials-input"
                type="text"
                value={initials}
                onChange={handleInitialsChange}
                maxLength={5}
                placeholder="C · R"
                style={{
                  width: '9rem',
                  backgroundColor: 'var(--colour-paper)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '2px',
                  padding: '0.75rem 1rem',
                  fontSize: '1.125rem',
                  color: 'var(--colour-espresso)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  fontFamily: 'var(--font-serif)',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--colour-charcoal)', opacity: 0.8, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--colour-espresso)', display: 'block' }}>Complimentary on all orders</strong>
                <span>Up to 3 letters (A&ndash;Z) and center dot ( &middot; )</span>
              </div>
            </div>
          </div>

          {/* Step 2: Leather Palette */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--colour-espresso)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              2. Select Leather Palette
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {LEATHER_OPTIONS.map((opt) => {
                const isSelected = selectedLeather === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedLeather(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '2px',
                      backgroundColor: isSelected ? 'var(--colour-paper)' : 'var(--colour-white)',
                      border: isSelected ? '1px solid var(--colour-espresso)' : '1px solid var(--colour-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      outline: isSelected ? '1px solid var(--colour-espresso)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '1rem',
                        height: '1rem',
                        borderRadius: '50%',
                        backgroundColor: opt.hex,
                        border: '1px solid rgba(0,0,0,0.15)',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-serif)', color: 'var(--colour-espresso)', display: 'block' }}>
                        {opt.name}
                      </span>
                      <span style={{ fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.65 }}>
                        Full-Grain Hide
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 3: Stamping Technique */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--colour-espresso)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              3. Stamping Finish
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FINISH_OPTIONS.map((fin) => {
                const isSelected = selectedFinish === fin.id
                return (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() => setSelectedFinish(fin.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderRadius: '2px',
                      backgroundColor: isSelected ? 'var(--colour-paper)' : 'var(--colour-white)',
                      border: isSelected ? '1px solid var(--colour-espresso)' : '1px solid var(--colour-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      outline: isSelected ? '1px solid var(--colour-espresso)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-serif)', color: 'var(--colour-espresso)', fontWeight: 500 }}>
                          {fin.label}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--colour-cognac)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                          &mdash; {fin.sub}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--colour-charcoal)', opacity: 0.75, margin: '0.2rem 0 0', lineHeight: 1.4 }}>
                        {fin.detail}
                      </p>
                    </div>
                    {isSelected && (
                      <span style={{ width: '1.125rem', height: '1.125rem', borderRadius: '50%', backgroundColor: 'var(--colour-espresso)', color: 'var(--colour-ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '0.75rem' }}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Link */}
          <div style={{ paddingTop: '0.5rem' }}>
            <Link
              href="/shop"
              className="btn btn-primary btn-full"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '1rem 1.5rem',
              }}
            >
              Shop Personalisable Pieces <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MonogramStudioInteractive
