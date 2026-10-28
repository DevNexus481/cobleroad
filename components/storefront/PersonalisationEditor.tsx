'use client'

import React, { useState } from 'react'
import { Sparkles, X, Check, Info } from 'lucide-react'
import type { PersonalisationConfig, PersonalisationFinish } from '@/types'

interface PersonalisationEditorProps {
  config: PersonalisationConfig | null
  variantSupportsPersonalisation?: boolean
  initials: string
  finish: 'blind' | 'gold' | 'silver'
  onChangeInitials: (text: string) => void
  onChangeFinish: (finish: 'blind' | 'gold' | 'silver') => void
  onClear: () => void
}

export function PersonalisationEditor({
  config,
  variantSupportsPersonalisation = true,
  initials,
  finish,
  onChangeInitials,
  onChangeFinish,
  onClear,
}: PersonalisationEditorProps) {
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!config || !config.enabled) {
    return null
  }

  const maxChars = config.max_chars ?? 3
  const availableStyles = (config.styles as string[]) || ['blind', 'gold', 'silver']

  // If this specific colour variant doesn't support personalisation
  if (!variantSupportsPersonalisation) {
    return (
      <div
        style={{
          border: '1px solid var(--colour-border)',
          padding: '1.25rem',
          backgroundColor: 'var(--colour-parchment)',
          borderRadius: '2px',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <Sparkles size={14} style={{ color: 'var(--colour-cognac)' }} />
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.125rem',
              fontWeight: 400,
              color: 'var(--colour-espresso)',
              margin: 0,
            }}
          >
            Make It Yours
          </h3>
        </div>
        <p style={{ fontSize: '0.8125rem', opacity: 0.65, margin: 0 }}>
          Personalisation is temporarily unavailable for this specific leather colour.
        </p>
      </div>
    )
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawVal = e.target.value
    // Remove disallowed characters and enforce uppercase
    const upperVal = rawVal.toUpperCase()
    
    // Pattern check: only Latin letters A-Z (and optionally digits 0-9)
    const validPattern = /^[A-Z0-9]*$/
    if (!validPattern.test(upperVal)) {
      setValidationError('Only standard letters A–Z are supported for hot-stamping.')
      return
    }

    setValidationError(null)
    const sliced = upperVal.slice(0, maxChars)
    onChangeInitials(sliced)
  }

  return (
    <div
      style={{
        border: '1px solid var(--colour-border)',
        padding: '1.25rem',
        backgroundColor: 'rgba(237, 233, 223, 0.45)',
        borderRadius: '2px',
        marginBottom: '1.75rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} style={{ color: 'var(--colour-cognac)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1875rem',
                fontWeight: 500,
                color: 'var(--colour-espresso)',
                margin: 0,
              }}
            >
              Make It Yours
            </h3>
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--colour-olive)',
                backgroundColor: 'rgba(109, 113, 85, 0.12)',
                padding: '0.125rem 0.375rem',
                borderRadius: '2px',
              }}
            >
              Complimentary
            </span>
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--colour-charcoal)',
              opacity: 0.75,
              marginTop: '0.25rem',
              marginBottom: 0,
            }}
          >
            Add up to three initials, complimentary.
          </p>
        </div>

        {initials.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--colour-espresso)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              opacity: 0.6,
              padding: '0.25rem',
              transition: 'opacity 0.2s ease',
            }}
            title="Remove initials"
            aria-label="Remove personalisation"
          >
            <X size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Input row & character counter */}
      <div style={{ marginTop: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ position: 'relative', width: '9rem' }}>
            <input
              id="initials-input"
              type="text"
              value={initials}
              onChange={handleInputChange}
              maxLength={maxChars}
              placeholder="e.g. AK"
              aria-label="Initials for personalisation (maximum 3 characters)"
              aria-describedby="initials-counter"
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                border: validationError ? '1px solid #C0392B' : '1px solid var(--colour-border)',
                backgroundColor: 'var(--colour-white)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--colour-espresso)',
                outline: 'none',
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
              }}
            />
          </div>

          <span
            id="initials-counter"
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--colour-charcoal)',
              opacity: 0.65,
              letterSpacing: '0.04em',
            }}
          >
            {initials.length} / {maxChars} INITIALS
          </span>
        </div>

        {validationError && (
          <p
            role="alert"
            style={{
              fontSize: '0.75rem',
              color: '#C0392B',
              marginTop: '0.25rem',
              marginBottom: '0.5rem',
            }}
          >
            {validationError}
          </p>
        )}

        {/* Finish Selector */}
        <div style={{ marginTop: '0.875rem' }}>
          <span
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--colour-charcoal)',
              opacity: 0.7,
              marginBottom: '0.4rem',
            }}
          >
            Personalisation Finish
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableStyles.includes('blind') && (
              <button
                type="button"
                onClick={() => onChangeFinish('blind')}
                style={{
                  padding: '0.4375rem 0.875rem',
                  borderRadius: '2px',
                  border: finish === 'blind'
                    ? '1.5px solid var(--colour-espresso)'
                    : '1px solid var(--colour-border)',
                  backgroundColor: finish === 'blind' ? 'var(--colour-espresso)' : 'var(--colour-white)',
                  color: finish === 'blind' ? 'var(--colour-ivory)' : 'var(--colour-espresso)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {finish === 'blind' && <Check size={12} />}
                <span>Blind Deboss</span>
              </button>
            )}

            {availableStyles.includes('gold') && (
              <button
                type="button"
                onClick={() => onChangeFinish('gold')}
                style={{
                  padding: '0.4375rem 0.875rem',
                  borderRadius: '2px',
                  border: finish === 'gold'
                    ? '1.5px solid #A16207'
                    : '1px solid var(--colour-border)',
                  backgroundColor: finish === 'gold' ? '#FDF8E2' : 'var(--colour-white)',
                  color: finish === 'gold' ? '#78350F' : 'var(--colour-espresso)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {finish === 'gold' && <Check size={12} />}
                <span>24K Gold Foil</span>
              </button>
            )}

            {availableStyles.includes('silver') && (
              <button
                type="button"
                onClick={() => onChangeFinish('silver')}
                style={{
                  padding: '0.4375rem 0.875rem',
                  borderRadius: '2px',
                  border: finish === 'silver'
                    ? '1.5px solid #4B5563'
                    : '1px solid var(--colour-border)',
                  backgroundColor: finish === 'silver' ? '#F3F4F6' : 'var(--colour-white)',
                  color: finish === 'silver' ? '#1F2937' : 'var(--colour-espresso)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {finish === 'silver' && <Check size={12} />}
                <span>Sterling Silver</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle note about artisan craftsmanship */}
        <p
          style={{
            fontSize: '0.6875rem',
            color: 'var(--colour-charcoal)',
            opacity: 0.55,
            lineHeight: 1.5,
            marginTop: '0.75rem',
            marginBottom: 0,
          }}
        >
          Artisan hand-embossed at our studio. Live preview provides a visual reference of placement and finish.
        </p>
      </div>
    </div>
  )
}
