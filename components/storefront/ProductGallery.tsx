'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LiveInitialsPreview } from './LiveInitialsPreview'
import type { PersonalisationPlacement, PersonalisationFinish } from '@/types'

export interface GalleryImage {
  id?: string
  url: string
  alt?: string | null
  variant_id?: string | null
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productName: string
  isDemo?: boolean
  initials?: string
  finish?: PersonalisationFinish | 'blind' | 'gold' | 'silver'
  placement?: PersonalisationPlacement | null
  isPersonalisable?: boolean
}

export function ProductGallery({
  images,
  productName,
  isDemo,
  initials = '',
  finish = 'blind',
  placement,
  isPersonalisable = false,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Ensure activeIndex is within range when images change (e.g. colour variant changed)
  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  const validImages = images.filter((img) => Boolean(img?.url && img.url.trim().length > 0))
  const hasImages = validImages.length > 0
  const safeImages = validImages

  const hasInitials = Boolean(initials && initials.trim().length > 0 && isPersonalisable)

  return (
    <div>
      {/* Main Feature Image with smooth cross-fade */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/11',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          marginBottom: '1rem',
          borderRadius: '2px',
          border: '1px solid var(--colour-border-light)',
          boxShadow: '0 4px 20px rgba(43, 33, 29, 0.04)',
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {!hasImages ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                border: '1px dashed var(--colour-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
              }}
            >
              <span style={{ fontSize: '1.25rem', opacity: 0.7 }}>✦</span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              Photograph Pending
            </span>
          </div>
        ) : (
          safeImages.map((img, i) => (
            <div
              key={img.id ?? `${img.url}-${i}`}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === activeIndex ? 1 : 0,
                pointerEvents: i === activeIndex ? 'auto' : 'none',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productName} view ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  padding: '0.5rem',
                  transform: isZoomed && i === activeIndex ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                quality={90}
              />
            </div>
          ))
        )}

        {/* LIVE MONOGRAM PREVIEW OVERLAY (Rendered on primary front view) */}
        {hasInitials && activeIndex === 0 && (
          <LiveInitialsPreview
            initials={initials}
            finish={finish}
            placement={placement}
          />
        )}

        {/* Context indicator when viewing secondary angles */}
        {hasInitials && activeIndex > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              backgroundColor: 'rgba(43, 33, 29, 0.85)',
              backdropFilter: 'blur(6px)',
              color: 'var(--colour-ivory)',
              fontSize: '0.6875rem',
              letterSpacing: '0.04em',
              padding: '0.5rem 0.75rem',
              borderRadius: '2px',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            Monogram &ldquo;{initials.toUpperCase()}&rdquo; applied to exterior front leather panel (View 1)
          </div>
        )}

        {isDemo && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'var(--colour-olive)',
              color: 'var(--colour-ivory)',
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '0.25rem 0.625rem',
              zIndex: 10,
            }}
          >
            Demo
          </div>
        )}
      </div>

      {/* Interactive Thumbnails */}
      {safeImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.625rem',
            flexWrap: 'wrap',
          }}
          role="tablist"
          aria-label="Product thumbnails"
        >
          {safeImages.map((img, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={img.id ?? `${img.url}-thumb-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show image ${i + 1} of ${safeImages.length}`}
                onClick={() => setActiveIndex(i)}
                style={{
                  position: 'relative',
                  width: '4.75rem',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  border: isActive
                    ? '2px solid var(--colour-espresso)'
                    : '1px solid var(--colour-border)',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  opacity: isActive ? 1 : 0.65,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'contain', padding: '0.25rem' }}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
