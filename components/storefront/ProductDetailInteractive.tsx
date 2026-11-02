'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag, Minus, Plus, Check, AlertTriangle } from 'lucide-react'
import { ProductGallery, type GalleryImage } from './ProductGallery'
import { ProductColourSelector } from './ProductColourSelector'
import { PersonalisationEditor } from './PersonalisationEditor'
import { ProductAccordions } from './ProductAccordions'
import { useCart } from './CartProvider'
import { formatAmount, calculateProductPrice } from '@/lib/currency'
import type { Product, ProductVariant, PersonalisationConfig } from '@/types'

function generateId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

interface ProductDetailInteractiveProps {
  product: Product | null
  demoData?: {
    name: string
    desc: string
    shortDesc: string
    price: number
    image: string
    personalisable: boolean
    colour: string
    stock: number
    material: string | null
    variantId: string
    productId: string
  }
  isDemo: boolean
}

export function ProductDetailInteractive({
  product,
  demoData,
  isDemo,
}: ProductDetailInteractiveProps) {
  const { addItem, openCart, currency } = useCart()

  // 1. Initial Variant Selection
  const allVariants = useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants
    }
    // Fallback demo variant
    return [
      {
        id: demoData?.variantId || 'demo-v1',
        product_id: demoData?.productId || 'demo-prod',
        colour: demoData?.colour || 'Cognac',
        colour_hex: '#9A633F',
        sku: 'CBR-DEMO-001',
        stock_quantity: demoData?.stock ?? 10,
        is_active: true,
        personalisation_enabled: Boolean(demoData?.personalisable),
        prices: demoData ? [{ id: 'p1', currency: 'INR' as const, amount_minor: demoData.price }] : [],
      } as ProductVariant,
    ]
  }, [product, demoData])

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    allVariants[0]?.id || ''
  )

  const activeVariant = useMemo(() => {
    return allVariants.find((v) => v.id === selectedVariantId) || allVariants[0]
  }, [allVariants, selectedVariantId])

  // 2. Personalisation State
  const personalisationConfig: PersonalisationConfig | null = product?.personalisation || (demoData?.personalisable ? {
    enabled: true,
    label: 'Complimentary Monogramming',
    max_chars: 3,
    allowed_pattern: '^[A-Z0-9]{1,3}$',
    styles: ['blind', 'gold', 'silver'],
    placement: {
      x_percent: 50,
      y_percent: 68,
      scale: 1.0,
      rotation_deg: 0,
      max_width_percent: 55,
    },
  } : null)

  const isPersonalisable = Boolean(
    personalisationConfig?.enabled && activeVariant?.personalisation_enabled !== false
  )

  const [initials, setInitials] = useState<string>('')
  const [finish, setFinish] = useState<'blind' | 'gold' | 'silver'>('blind')

  // 3. Quantity & Cart State
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 4. Variant Images Calculation
  const galleryImages: GalleryImage[] = useMemo(() => {
    if (!product?.images || product.images.length === 0) {
      if (demoData?.productId === 'meridian-duffle' || demoData?.name?.includes('Meridian')) {
        return [
          {
            id: 'cbr-tan-main',
            url: '/images/products/duffle-travel.jpg',
            alt: 'The Cobleroad Duffle — Tan Heritage',
          },
          {
            id: 'cbr-black-carry',
            url: '/images/products/variants/meridian-duffle-black-front.jpg',
            alt: 'The Cobleroad Duffle — Black Carry',
          },
          {
            id: 'cbr-shoulder-strap',
            url: '/images/products/meridian-duffle-angle.jpg',
            alt: 'The Cobleroad Duffle — Shoulder Carry Silhouette',
          },
          {
            id: 'cbr-interior-craft',
            url: '/images/products/meridian-duffle-detail.jpg',
            alt: 'The Cobleroad Duffle — Interior Craftsmanship & Access',
          },
        ]
      }
      return [
        {
          id: 'demo-img-1',
          url: demoData?.image || '/images/hero/hero-briefcase.jpg',
          alt: product?.name || demoData?.name || 'Cobleroad Bag',
        },
        {
          id: 'demo-img-2',
          url: '/images/lifestyle/lifestyle-desk.jpg',
          alt: 'Studio Atelier View',
        },
      ]
    }

    // Filter images that specifically belong to this variant
    const variantSpecific = product.images.filter(
      (img) => img.variant_id === activeVariant?.id
    )

    // Images that are general/unassigned to any specific variant
    const generalImages = product.images.filter((img) => !img.variant_id)

    if (variantSpecific.length > 0) {
      return [...variantSpecific, ...generalImages].map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || `${product.name} in ${activeVariant?.colour || ''}`,
        variant_id: img.variant_id,
      }))
    }

    // If variant has no specific image assigned, check variant.images
    if (activeVariant?.images && activeVariant.images.length > 0) {
      return activeVariant.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || product.name,
      }))
    }

    // Fall back to all product images
    return product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
    }))
  }, [product, activeVariant, demoData])
  // Price & Stock for the selected variant
  const rawPrice =
    activeVariant?.prices?.find((p) => p.currency === currency) ??
    activeVariant?.prices?.[0] ??
    (demoData ? { currency: 'INR' as const, amount_minor: demoData.price } : null)

  const activePrice = rawPrice
    ? {
        currency,
        amount_minor:
          rawPrice.currency === currency
            ? rawPrice.amount_minor
            : calculateProductPrice(rawPrice.amount_minor, currency),
      }
    : null

  const stock = activeVariant?.stock_quantity ?? demoData?.stock ?? 0
  const isOutOfStock = stock <= 0

  // 5. Add to Cart Handler
  function handleAddToCart() {
    setErrorMessage(null)

    if (!activePrice) {
      setErrorMessage('Price is currently unavailable for this variant.')
      return
    }

    if (isOutOfStock) {
      setErrorMessage('This leather colour is currently sold out.')
      return
    }

    const cleanInitials = initials.trim().toUpperCase()
    if (cleanInitials.length > (personalisationConfig?.max_chars ?? 3)) {
      setErrorMessage(`Initials cannot exceed ${personalisationConfig?.max_chars ?? 3} characters.`)
      return
    }

    const primaryImg = galleryImages[0] ?? {
      id: generateId(),
      url: '/images/hero/hero-briefcase.jpg',
      alt: product?.name ?? demoData?.name ?? '',
    }

    addItem({
      id: generateId(),
      product_id: product?.id ?? demoData?.productId ?? 'demo-prod',
      variant_id: activeVariant.id,
      quantity,
      personalisation:
        isPersonalisable && cleanInitials.length > 0
          ? { text: cleanInitials, style: finish }
          : null,
      price_snapshot: {
        amountMinor: activePrice.amount_minor,
        currency: activePrice.currency,
      },
      product: {
        id: product?.id ?? demoData?.productId ?? 'demo-prod',
        slug: product?.slug ?? '',
        name: product?.name ?? demoData?.name ?? '',
        is_demo: Boolean(isDemo),
      },
      variant: {
        id: activeVariant.id,
        sku: activeVariant.sku ?? null,
        colour: activeVariant.colour ?? 'Cognac',
        size: null,
        stock_quantity: stock,
      },
      primary_image: {
        id: primaryImg.id || generateId(),
        product_id: product?.id ?? demoData?.productId ?? 'demo-prod',
        url: primaryImg.url,
        alt: primaryImg.alt ?? null,
        sort_order: 0,
        created_at: '',
      },
    })

    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2400)
  }

  const productName = product?.name ?? demoData?.name ?? 'Cobleroad Piece'
  const description = product?.description ?? demoData?.desc ?? ''
  const materialDesc = product?.material_description ?? demoData?.material ?? null

  return (
    <div className="pdp-grid-layout">
      {/* =========================================================================
          LEFT COLUMN: DYNAMIC GALLERY WITH LIVE MONOGRAM EMBOSS OVERLAY
          ========================================================================= */}
      <div>
        <ProductGallery
          images={galleryImages}
          productName={productName}
          isDemo={isDemo}
          initials={initials}
          finish={finish}
          placement={personalisationConfig?.placement}
          isPersonalisable={isPersonalisable}
        />
      </div>

      {/* =========================================================================
          RIGHT COLUMN: PRODUCT DETAILS & CONTROLS
          ========================================================================= */}
      <div className="pdp-details-col">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', fontSize: '0.75rem', opacity: 0.55 }}>
            <li><Link href="/shop">Shop</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page">{productName}</li>
          </ol>
        </nav>

        {/* Product Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--colour-espresso)',
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}
        >
          {productName}
        </h1>

        {/* Interactive Colour Swatches */}
        <ProductColourSelector
          variants={allVariants}
          selectedVariantId={activeVariant.id}
          onSelectVariant={(variant) => {
            setSelectedVariantId(variant.id)
            setErrorMessage(null)
          }}
        />

        {/* Price Display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {activePrice ? (
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.375rem',
                fontWeight: 500,
                color: 'var(--colour-espresso)',
              }}
            >
              {formatAmount(activePrice.amount_minor, activePrice.currency)}
            </span>
          ) : (
            <span style={{ fontSize: '0.875rem', opacity: 0.4 }}>Price not configured</span>
          )}

          {isOutOfStock ? (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#C0392B',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Out of stock
            </span>
          ) : stock <= 5 ? (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--colour-cognac)',
                fontWeight: 500,
              }}
            >
              Only {stock} available
            </span>
          ) : null}

          {isDemo && (
            <span
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--colour-olive)',
                fontWeight: 600,
              }}
            >
              Demo catalogue
            </span>
          )}
        </div>

        {/* Editorial Description */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.75,
              color: 'var(--colour-charcoal)',
            }}
          >
            {description}
          </p>
        </div>

        {/* "Make It Yours" Live Initials Personalisation Editor */}
        <PersonalisationEditor
          config={personalisationConfig}
          variantSupportsPersonalisation={activeVariant?.personalisation_enabled !== false}
          initials={initials}
          finish={finish}
          onChangeInitials={setInitials}
          onChangeFinish={setFinish}
          onClear={() => setInitials('')}
        />

        {/* Quantity Stepper */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="product-quantity-input"
            className="form-label"
            style={{ marginBottom: '0.375rem', display: 'block' }}
          >
            Quantity
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
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
                opacity: quantity <= 1 || isOutOfStock ? 0.35 : 1,
              }}
            >
              <Minus size={14} />
            </button>
            <span
              id="product-quantity-input"
              style={{
                width: '3.25rem',
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
              aria-label={`Selected quantity: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock || isOutOfStock}
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
                opacity: quantity >= stock || isOutOfStock ? 0.35 : 1,
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              color: '#C0392B',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
              padding: '0.625rem 0.875rem',
              background: '#fff5f5',
              border: '1px solid #fcc',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Add to Bag Button */}
        <button
          type="button"
          id="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className={`btn btn-lg btn-full ${added ? '' : 'btn-primary'}`}
          style={
            added
              ? {
                  background: 'var(--colour-olive)',
                  borderColor: 'var(--colour-olive)',
                  color: 'var(--colour-ivory)',
                }
              : { padding: '1.125rem 2rem' }
          }
          aria-live="polite"
        >
          {added ? (
            <>
              <Check size={16} /> Added to Bag
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Bag &mdash; Complimentarily Packaged
            </>
          )}
        </button>

        {/* Craftsmanship Accordions */}
        <ProductAccordions
          dimensionsCm={product?.dimensions_cm}
          weightGrams={product?.weight_grams}
          materialDesc={materialDesc}
          careInstructions={product?.care_instructions}
          personalisable={isPersonalisable}
        />
      </div>
    </div>
  )
}
