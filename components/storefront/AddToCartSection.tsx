'use client'

import { useState } from 'react'
import { ShoppingBag, Minus, Plus, Check, Sparkles } from 'lucide-react'
import { useCart } from './CartProvider'
import type { Product, PersonalisationConfig } from '@/types'

function generateId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

interface AddToCartSectionProps {
  product: Product | null
  demoData?: {
    name: string
    price: { amount_minor: number; currency: string } | null
    stock: number
    personalisation: PersonalisationConfig | null
    variantId: string
    productId: string
  }
  isDemo: boolean
}

export function AddToCartSection({ product, demoData, isDemo }: AddToCartSectionProps) {
  const { addItem, openCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [personalisationText, setPersonalisationText] = useState('')
  const [foilStyle, setFoilStyle] = useState<'blind' | 'gold'>('blind')
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const personalisation = product?.personalisation ?? demoData?.personalisation
  const firstVariant = product?.variants[0]
  const price =
    firstVariant?.prices.find((p) => p.currency === 'INR') ??
    demoData?.price ??
    null

  const stock = firstVariant?.stock_quantity ?? demoData?.stock ?? 10
  const variantId = firstVariant?.id ?? demoData?.variantId ?? 'var-1'
  const productId = product?.id ?? demoData?.productId ?? 'prod-1'
  const isOutOfStock = stock <= 0
  const isPersonalisable = personalisation?.enabled

  // Client-side personalisation validation
  function validatePersonalisation(text: string): string | null {
    if (!isPersonalisable) return null
    if (!text) return null // Optional
    if (text.length > (personalisation?.max_chars ?? 3)) {
      return `Maximum ${personalisation?.max_chars} characters allowed`
    }
    if (personalisation?.allowed_pattern) {
      try {
        const regex = new RegExp(personalisation.allowed_pattern)
        if (!regex.test(text)) return 'Only uppercase English letters allowed (e.g., AKR)'
      } catch {
        // ignore invalid regex
      }
    }
    return null
  }

  function handleAddToCart() {
    setError(null)

    if (!price) {
      setError('Price not available for your selected currency.')
      return
    }

    if (isOutOfStock) {
      setError('This product is currently out of stock.')
      return
    }

    const personalisationErr = validatePersonalisation(personalisationText.trim())
    if (personalisationErr) {
      setError(personalisationErr)
      return
    }

    const primaryImg = product?.images?.[0] ?? {
      id: productId,
      product_id: productId,
      url: '/images/hero/hero-briefcase.jpg',
      alt: product?.name ?? demoData?.name ?? '',
      sort_order: 0,
      created_at: '',
    }

    addItem({
      id: generateId(),
      product_id: productId,
      variant_id: variantId,
      quantity,
      personalisation:
        isPersonalisable && personalisationText.trim()
          ? { text: personalisationText.trim().toUpperCase(), style: foilStyle }
          : null,
      price_snapshot: {
        amountMinor: price.amount_minor,
        currency: 'INR',
      },
      product: {
        id: productId,
        slug: product?.slug ?? '',
        name: product?.name ?? demoData?.name ?? '',
        is_demo: Boolean(isDemo),
      },
      variant: {
        id: variantId,
        sku: firstVariant?.sku ?? null,
        colour: firstVariant?.colour ?? 'Cognac',
        size: firstVariant?.size ?? null,
        stock_quantity: stock,
      },
      primary_image: primaryImg,
    })

    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div>
      {/* Quantity Stepper */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" htmlFor="product-quantity">Quantity</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--colour-border)',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--colour-espresso)',
              opacity: quantity <= 1 ? 0.35 : 1,
            }}
          >
            <Minus size={14} />
          </button>
          <span
            id="product-quantity"
            style={{
              width: '3rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--colour-border)',
              borderLeft: 'none',
              borderRight: 'none',
              fontSize: '0.9375rem',
              fontWeight: 500,
            }}
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            aria-label="Increase quantity"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--colour-border)',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--colour-espresso)',
              opacity: quantity >= stock ? 0.35 : 1,
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Personalisation & Real-time Live Deboss Mockup */}
      {isPersonalisable && (
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <label className="form-label" htmlFor="personalisation-text" style={{ margin: 0 }}>
              {personalisation?.label ?? 'Complimentary Monogramming'}
            </label>
            <span style={{ fontSize: '0.6875rem', opacity: 0.5, letterSpacing: '0.04em' }}>
              {personalisationText.length} / {personalisation?.max_chars ?? 3} CHARACTERS
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <input
              id="personalisation-text"
              type="text"
              className="form-input"
              value={personalisationText}
              onChange={(e) => {
                setPersonalisationText(e.target.value.toUpperCase().slice(0, personalisation?.max_chars ?? 3))
                setError(null)
              }}
              maxLength={personalisation?.max_chars ?? 3}
              placeholder="e.g. AKR"
              style={{
                width: '10rem',
                letterSpacing: '0.15em',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            />

            {/* Foil style selector */}
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                type="button"
                onClick={() => setFoilStyle('blind')}
                className={`filter-chip ${foilStyle === 'blind' ? 'active' : ''}`}
                style={{ fontSize: '0.6875rem', padding: '0.375rem 0.75rem' }}
              >
                Blind Deboss
              </button>
              <button
                type="button"
                onClick={() => setFoilStyle('gold')}
                className={`filter-chip ${foilStyle === 'gold' ? 'active' : ''}`}
                style={{ fontSize: '0.6875rem', padding: '0.375rem 0.75rem' }}
              >
                24K Gold Foil
              </button>
            </div>
          </div>

          {/* REAL-TIME LEATHER DEBOSS PREVIEW MOCKUP */}
          <div className="leather-deboss-preview">
            <span className="leather-deboss-tag">
              Live Mockup &bull; {foilStyle === 'gold' ? 'Gold Foil Stamping' : 'Blind Hot Deboss'}
            </span>

            {personalisationText ? (
              <span className={foilStyle === 'gold' ? 'deboss-text-gold' : 'deboss-text-blind'}>
                {personalisationText}
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.4 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', letterSpacing: '0.35em', color: '#382012' }}>
                  &middot; &middot; &middot;
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', letterSpacing: '0.04em' }}>
                  Type initials above for real-time deboss preview
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          role="alert"
          style={{
            color: '#C0392B',
            fontSize: '0.8125rem',
            marginBottom: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#fff5f5',
            border: '1px solid #fcc',
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      )}

      {/* Add to cart button */}
      <button
        type="button"
        id="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={isOutOfStock || added}
        className={`btn btn-lg btn-full ${added ? '' : 'btn-primary'}`}
        style={
          added
            ? { background: 'var(--colour-olive)', borderColor: 'var(--colour-olive)', color: 'var(--colour-ivory)' }
            : { padding: '1.125rem 2rem' }
        }
        aria-live="polite"
      >
        {added ? (
          <>
            <Check size={16} /> Added to Bag
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          <>
            <ShoppingBag size={16} /> Add to Bag &mdash; Complimentarily Packaged
          </>
        )}
      </button>

      {isOutOfStock && (
        <p style={{ fontSize: '0.8125rem', opacity: 0.55, marginTop: '0.5rem', textAlign: 'center' }}>
          Currently unavailable.
        </p>
      )}
    </div>
  )
}
