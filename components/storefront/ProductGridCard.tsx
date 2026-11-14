'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from './CartProvider'
import { formatAmount, calculateProductPrice } from '@/lib/currency'
import type { CurrencyCode } from '@/types'

const LEATHER_COLOUR_MAP: Record<string, string> = {
  cognac: '#9A633F',
  tan: '#B5784E',
  espresso: '#2B211D',
  black: '#1F1B18',
  charcoal: '#3D3530',
  olive: '#6D7155',
  brass: '#B5960A',
  brown: '#5C3826',
}

interface ProductVariantPrice {
  id: string
  currency: CurrencyCode
  amount_minor: number
}

interface ProductVariantItem {
  id: string
  colour: string | null
  colour_hex?: string | null
  image_url?: string | null
  stock_quantity: number
  prices: ProductVariantPrice[]
}

interface ProductImageItem {
  id: string
  url: string
  alt?: string | null
}

export interface ProductGridCardProps {
  id: string
  slug: string
  name: string
  shortDescription?: string | null
  isFeatured?: boolean
  isDemo?: boolean
  personalisable?: boolean
  primaryImage: ProductImageItem | null
  secondaryImage?: ProductImageItem | null
  variants: ProductVariantItem[]
}

export function ProductGridCard({
  id,
  slug,
  name,
  shortDescription,
  isFeatured,
  isDemo,
  personalisable,
  primaryImage,
  secondaryImage,
  variants,
}: ProductGridCardProps) {
  const { addItem, openCart, currency } = useCart()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const activeVariant = variants[selectedVariantIndex] ?? variants[0]
  const rawPrice = activeVariant?.prices.find((p) => p.currency === currency) ?? activeVariant?.prices[0]
  const displayPrice = rawPrice
    ? {
        currency,
        amount_minor:
          rawPrice.currency === currency
            ? rawPrice.amount_minor
            : calculateProductPrice(rawPrice.amount_minor, currency),
      }
    : null
  const isOutOfStock = activeVariant ? activeVariant.stock_quantity <= 0 : false

  // Image dynamically updates to selected variant's genuine photograph
  const candidateImg = activeVariant?.image_url || primaryImage?.url || ''
  const hasImage = Boolean(candidateImg && candidateImg.trim().length > 0)
  const mainImgUrl = candidateImg
  const hoverImgUrl = secondaryImage?.url || ''

  // Quick add to cart
  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock || !displayPrice) return

    setIsAdding(true)
    addItem({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      product_id: id,
      variant_id: activeVariant?.id ?? id,
      quantity: 1,
      personalisation: null,
      price_snapshot: {
        amountMinor: displayPrice.amount_minor,
        currency: displayPrice.currency,
      },
      product: {
        id,
        slug,
        name,
        is_demo: Boolean(isDemo),
      },
      variant: {
        id: activeVariant?.id ?? id,
        sku: null,
        colour: activeVariant?.colour ?? null,
        size: null,
        stock_quantity: activeVariant?.stock_quantity ?? 10,
      },
      primary_image: {
        id: primaryImage?.id || id,
        url: mainImgUrl,
        alt: primaryImage?.alt ?? name,
        product_id: id,
        sort_order: 0,
        created_at: '',
      },
    })

    setTimeout(() => {
      setIsAdding(false)
      openCart()
    }, 400)
  }

  // Extract unique colours for swatches
  const availableColours = variants
    .map((v, idx) => ({
      colour: v.colour,
      colour_hex: v.colour_hex ?? null,
      index: idx,
    }))
    .filter(
      (item): item is { colour: string; colour_hex: string | null; index: number } =>
        typeof item.colour === 'string' && item.colour.length > 0
    )

  return (
    <div
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* 1. Image wrap with clickable link to detail page */}
      <Link
        href={`/products/${slug}`}
        aria-label={`View details for ${name}`}
        style={{ display: 'block' }}
      >
        <div
          className="product-card__image-wrap"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {hasImage && mainImgUrl ? (
            <>
              {/* Primary variant image */}
              <Image
                src={mainImgUrl}
                alt={primaryImage?.alt ?? `${name} in ${activeVariant?.colour || 'Leather'}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  padding: '0.25rem',
                  opacity: hoverImgUrl && isHovered ? 0 : 1,
                  transition:
                    'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                }}
              />

              {/* Secondary image crossfade if available */}
              {hoverImgUrl && (
                <Image
                  src={hoverImgUrl}
                  alt={`${name} alternate detail`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    padding: '0.25rem',
                    opacity: isHovered ? 1 : 0,
                    transition:
                      'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '50%',
                  border: '1px dashed var(--colour-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.6,
                }}
              >
                <Sparkles size={18} style={{ opacity: 0.75 }} />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity: 0.55,
                  fontWeight: 500,
                }}
              >
                Photo Pending
              </span>
            </div>
          )}

          {/* Badges */}
          {isDemo && (
            <span className="product-card__badge product-card__badge--demo">Demo</span>
          )}
          {!isDemo && isFeatured && (
            <span className="product-card__badge product-card__badge--new">Featured</span>
          )}
          {isOutOfStock && (
            <span className="product-card__badge product-card__badge--out">Out of Stock</span>
          )}

          {/* Quick Add Overlay on hover */}
          {!isOutOfStock && displayPrice && (
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                right: '0.75rem',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
              }}
            >
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isAdding}
                aria-label={`Quick add ${name} (${activeVariant?.colour || ''}) to bag`}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  backgroundColor: isAdding
                    ? 'var(--colour-olive)'
                    : 'rgba(43, 33, 29, 0.94)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--colour-ivory)',
                  border: 'none',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isAdding ? (
                  <>
                    <Check size={14} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> Quick Add
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* 2. Card Body — completely outside the image link */}
      <div className="product-card__body">
        {/* Swatches (Independent state, no navigation) */}
        {availableColours.length > 1 && (
          <div
            className="product-card__swatches"
            role="radiogroup"
            aria-label={`Available colours for ${name}`}
            style={{ marginBottom: '0.4rem' }}
          >
            {availableColours.map(({ colour, colour_hex, index }) => {
              const hex =
                colour_hex ||
                LEATHER_COLOUR_MAP[colour.toLowerCase()] ||
                '#9A633F'
              const isSelected = selectedVariantIndex === index

              return (
                <button
                  key={`${colour}-${index}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedVariantIndex(index)
                  }}
                  title={`Colour: ${colour}`}
                  aria-label={`Select ${colour} colour`}
                  className={`swatch-dot ${isSelected ? 'active' : ''}`}
                  style={{ backgroundColor: hex }}
                />
              )
            })}
            <span
              style={{
                fontSize: '0.6875rem',
                opacity: 0.65,
                marginLeft: '0.375rem',
                color: 'var(--colour-charcoal)',
                fontWeight: 500,
              }}
            >
              {activeVariant?.colour}
            </span>
          </div>
        )}

        {/* Product Name Link */}
        <Link
          href={`/products/${slug}`}
          className="product-card__name"
          style={{ textDecoration: 'none', display: 'block' }}
        >
          {name}
        </Link>

        {shortDescription && (
          <p className="product-card__desc">{shortDescription}</p>
        )}

        {/* Price & Monogram tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginTop: '0.25rem',
          }}
        >
          {displayPrice ? (
            <span className="product-card__price">
              {formatAmount(displayPrice.amount_minor, displayPrice.currency)}
            </span>
          ) : (
            <span
              className="product-card__price"
              style={{ opacity: 0.4, fontSize: '0.8125rem' }}
            >
              Price not set
            </span>
          )}

          {personalisable && (
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--colour-cognac)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Sparkles size={11} /> Monogrammable
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
