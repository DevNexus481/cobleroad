'use client'

import { useState } from 'react'
import { Plus, Ruler, Sparkles, Shield, Truck, Feather } from 'lucide-react'

interface ProductAccordionsProps {
  dimensionsCm?: string | null
  weightGrams?: number | null
  materialDesc?: string | null
  careInstructions?: string | null
  personalisable?: boolean
}

export function ProductAccordions({
  dimensionsCm,
  weightGrams,
  materialDesc,
  careInstructions,
  personalisable = true,
}: ProductAccordionsProps) {
  // Start with materials open, others closed cleanly
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    materials: true,
    dimensions: false,
    personalisation: false,
    shipping: false,
    warranty: false,
  })

  function toggleSection(key: string) {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const sections = [
    {
      id: 'materials',
      title: 'Materials & Atelier Craftsmanship',
      icon: <Feather size={14} />,
      content: (
        <div>
          <p style={{ marginBottom: '0.875rem', lineHeight: 1.7 }}>
            {materialDesc
              ? `${materialDesc}. Full-grain vegetable-tanned leather carefully selected for natural grain character, longevity, and rich patina development over time.`
              : 'Full-grain vegetable-tanned leather sourced from historic tanneries in Tamil Nadu, India. Naturally dyed using organic chestnut and mimosa tannins without harsh chemicals.'}
          </p>
          <ul
            style={{
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
            }}
          >
            <li>Solid brass hardware with hand-brushed matte antiqued finish</li>
            <li>Heavy-duty YKK Excella metal zippers with reinforced cotton pull tabs</li>
            <li>Hand-burnished and waxed leather edges for fray-free durability</li>
            <li>Double-needle bonded nylon thread with back-tacked stress points</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'dimensions',
      title: 'Dimensions & Specifications',
      icon: <Ruler size={14} />,
      content: (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.8125rem',
            marginTop: '0.25rem',
          }}
        >
          <div
            style={{
              padding: '0.875rem',
              background: 'var(--colour-parchment)',
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 600,
              }}
            >
              Dimensions
            </span>
            <strong style={{ fontSize: '0.8125rem', color: 'var(--colour-espresso)' }}>
              {dimensionsCm || '40 cm (W) × 30 cm (H) × 9 cm (D)'}
            </strong>
          </div>

          <div
            style={{
              padding: '0.875rem',
              background: 'var(--colour-parchment)',
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 600,
              }}
            >
              Weight
            </span>
            <strong style={{ fontSize: '0.8125rem', color: 'var(--colour-espresso)' }}>
              {weightGrams ? `${(weightGrams / 1000).toFixed(2)} kg` : '1.25 kg (Approx.)'}
            </strong>
          </div>

          <div
            style={{
              padding: '0.875rem',
              background: 'var(--colour-parchment)',
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 600,
              }}
            >
              Device Fit
            </span>
            <strong style={{ fontSize: '0.8125rem', color: 'var(--colour-espresso)' }}>
              Fits up to 16&quot; MacBook Pro
            </strong>
          </div>
        </div>
      ),
    },
    {
      id: 'personalisation',
      title: 'Complimentary Monogramming',
      icon: <Sparkles size={14} />,
      content: (
        <div>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
            Every eligible THE COBBLEROAD piece includes complimentary custom hot-stamp monogramming
            (up to 3 uppercase Latin letters).
          </p>
          <p style={{ fontSize: '0.8125rem', opacity: 0.8, lineHeight: 1.65 }}>
            Our artisans use precision heated brass letterpress type hand-set at 160°C. Choose
            between a quiet, tactile <strong>Blind Deboss</strong> (indented into the grain), luminous{' '}
            <strong>24K Gold Foil</strong>, or <strong>Sterling Silver</strong> stamping.
          </p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Complimentary Shipping & 14-Day Returns',
      icon: <Truck size={14} />,
      content: (
        <div>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
            Complimentary express domestic courier (Bluedart / Delhivery Air) for all orders over
            ₹2,999. Dispatched in 24–48 hours from our studio with real-time tracking and signature
            on delivery.
          </p>
          <p style={{ fontSize: '0.8125rem', opacity: 0.8, lineHeight: 1.65 }}>
            Unpersonalised items in pristine condition are eligible for our complimentary 14-day
            exchange or refund service. Bespoke monogrammed items are custom crafted and
            non-returnable.
          </p>
        </div>
      ),
    },
    {
      id: 'warranty',
      title: 'Lifetime Craftsmanship Guarantee',
      icon: <Shield size={14} />,
      content: (
        <div>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
            THE COBBLEROAD goods are constructed to be handed down. We guarantee our leathers, hardware,
            zippers, and structural stitching against manufacturing flaws for life.
          </p>
          <p style={{ fontSize: '0.8125rem', opacity: 0.8, lineHeight: 1.65 }}>
            {careInstructions ||
              'Natural surface scratches and deepening patina are inherent hallmarks of genuine full-grain leather. Maintain with organic beeswax balm every 4–6 months.'}
          </p>
        </div>
      ),
    },
  ].filter((sec) => sec.id !== 'personalisation' || personalisable)

  return (
    <div className="luxury-accordion">
      {sections.map((sec) => {
        const isOpen = Boolean(openSections[sec.id])
        const isMonogram = sec.id === 'personalisation'

        return (
          <div key={sec.id} className="luxury-accordion-item">
            <button
              type="button"
              id={`accordion-trigger-${sec.id}`}
              className="luxury-accordion-trigger"
              onClick={() => toggleSection(sec.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${sec.id}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ color: 'var(--colour-cognac)' }}>{sec.icon}</span>
                <span
                  style={
                    isMonogram
                      ? { color: 'var(--colour-cognac)', fontWeight: 600 }
                      : undefined
                  }
                >
                  {sec.title}
                </span>
              </span>
              <span
                className="luxury-accordion-icon"
                style={{
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  color: isOpen || isMonogram ? 'var(--colour-cognac)' : 'inherit',
                }}
              >
                <Plus size={16} />
              </span>
            </button>
            <div
              id={`accordion-content-${sec.id}`}
              className={`luxury-accordion-panel ${isOpen ? 'open' : ''}`}
              role="region"
              aria-labelledby={`accordion-trigger-${sec.id}`}
              aria-hidden={!isOpen}
              hidden={!isOpen}
              style={!isOpen ? { display: 'none' } : undefined}
            >
              <div className="luxury-accordion-content">{sec.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
