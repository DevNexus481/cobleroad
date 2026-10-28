'use client'

import React from 'react'
import type { PersonalisationPlacement, PersonalisationFinish } from '@/types'

interface LiveInitialsPreviewProps {
  initials: string
  finish?: PersonalisationFinish | 'blind' | 'gold' | 'silver'
  placement?: PersonalisationPlacement | null
  showPlaceholder?: boolean
  className?: string
}

export function LiveInitialsPreview({
  initials,
  finish = 'blind',
  placement,
  showPlaceholder = false,
  className = '',
}: LiveInitialsPreviewProps) {
  const cleanInitials = initials.trim().toUpperCase()

  if (!cleanInitials && !showPlaceholder) {
    return null
  }

  // Normalized placement parameters with safe defaults
  const x = placement?.x_percent ?? 50
  const y = placement?.y_percent ?? 68
  const scale = placement?.scale ?? 1.0
  const rotation = placement?.rotation_deg ?? 0
  const maxWidth = placement?.max_width_percent ? `${placement.max_width_percent}%` : '60%'

  // Map finish to appropriate luxury effect class
  const finishClass =
    finish === 'gold'
      ? 'finish-gold'
      : finish === 'silver'
      ? 'finish-silver'
      : 'finish-blind'

  return (
    <div
      className={`initials-preview-overlay ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        maxWidth,
      }}
      aria-hidden="true"
    >
      {cleanInitials ? (
        <span
          className={`initials-text ${finishClass}`}
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.75rem)',
          }}
        >
          {cleanInitials}
        </span>
      ) : showPlaceholder ? (
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(0.875rem, 1.8vw, 1.35rem)',
            letterSpacing: '0.3em',
            opacity: 0.25,
            color: '#21120B',
          }}
        >
          &bull; &bull; &bull;
        </span>
      ) : null}
    </div>
  )
}
