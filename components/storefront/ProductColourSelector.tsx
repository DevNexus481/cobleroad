'use client'

import React from 'react'
import type { ProductVariant } from '@/types'

const LEATHER_COLOUR_MAP: Record<string, string> = {
  cognac: '#9A633F',
  tan: '#B5784E',
  espresso: '#2B211D',
  black: '#1F1B18',
  charcoal: '#3D3530',
  olive: '#6D7155',
  brown: '#5C3826',
  brass: '#B5960A',
}

interface ProductColourSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string
  onSelectVariant: (variant: ProductVariant) => void
}

export function ProductColourSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: ProductColourSelectorProps) {
  // Filter active variants with colours
  const activeVariants = variants.filter(
    (v) => (v.is_active !== false) && Boolean(v.colour)
  )

  if (activeVariants.length <= 1) {
    const single = activeVariants[0]
    if (!single?.colour) return null
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8125rem', opacity: 0.75 }}>
          Colour: <strong style={{ color: 'var(--colour-espresso)' }}>{single.colour}</strong>
        </p>
      </div>
    )
  }

  const selectedVariant =
    activeVariants.find((v) => v.id === selectedVariantId) || activeVariants[0]

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    let nextIndex = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % activeVariants.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + activeVariants.length) % activeVariants.length
    }

    if (nextIndex >= 0) {
      e.preventDefault()
      onSelectVariant(activeVariants[nextIndex])
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '0.625rem',
        }}
      >
        <span
          id="colour-selector-label"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--colour-charcoal)',
          }}
        >
          Colour:{' '}
          <strong
            style={{
              color: 'var(--colour-espresso)',
              fontWeight: 600,
            }}
          >
            {selectedVariant?.colour || 'Select Colour'}
          </strong>
        </span>

        {selectedVariant?.sku && (
          <span style={{ fontSize: '0.6875rem', opacity: 0.5, letterSpacing: '0.05em' }}>
            SKU: {selectedVariant.sku}
          </span>
        )}
      </div>

      <div
        className="pdp-swatches"
        role="radiogroup"
        aria-labelledby="colour-selector-label"
      >
        {activeVariants.map((variant, index) => {
          const isSelected = variant.id === selectedVariant?.id
          const hex =
            variant.colour_hex ||
            (variant.colour ? LEATHER_COLOUR_MAP[variant.colour.toLowerCase()] : null) ||
            '#9A633F'

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${variant.colour} colour option`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectVariant(variant)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`pdp-swatch-btn ${isSelected ? 'active' : ''}`}
              style={{
                backgroundColor: hex,
              }}
              title={variant.colour || ''}
            >
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
