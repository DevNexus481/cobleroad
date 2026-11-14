'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { useCart } from './CartProvider'
import { formatAmount } from '@/lib/currency'

const SHIPPING_THRESHOLD_MINOR = 299900 // ₹2,999

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    subtotalMinor,
    currency,
    updateQuantity,
    removeItem,
    warnings,
    hasUnavailableItems,
    dismissWarnings,
  } = useCart()

  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCart])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const safeSubtotal = Number.isFinite(subtotalMinor) ? subtotalMinor : 0
  const freeShippingProgress = Math.min(
    100,
    Math.max(0, Math.round((safeSubtotal / SHIPPING_THRESHOLD_MINOR) * 100))
  )
  const freeShippingDifference = Math.max(0, SHIPPING_THRESHOLD_MINOR - safeSubtotal)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-drawer-backdrop ${isOpen ? 'open' : ''}`}
        aria-hidden="true"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping bag"
        aria-modal={isOpen}
        className={`cart-drawer-panel ${isOpen ? 'open' : ''}`}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <ShoppingBag size={18} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>
              Shopping Bag{' '}
              {itemCount > 0 && (
                <span style={{ fontSize: '0.875rem', opacity: 0.6 }}>({itemCount})</span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="nav-icon-btn"
            style={{ width: '2rem', height: '2rem' }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Revalidation Warnings Banner (e.g. Price Changes / Out of Stock) */}
        {warnings && warnings.length > 0 && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fffbeb',
              borderBottom: '1px solid #fef3c7',
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: '#92400e',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                {warnings.map((w, idx) => (
                  <p key={idx}>{w}</p>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={dismissWarnings}
              aria-label="Dismiss notice"
              style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', padding: 0 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Free Shipping Progress Bar */}
        {items.length > 0 && (
          <div className="cart-shipping-bar">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
              {freeShippingDifference > 0 ? (
                <span>
                  Add <strong>{formatAmount(freeShippingDifference, currency)}</strong> more for complimentary delivery
                </span>
              ) : (
                <span style={{ color: 'var(--colour-olive)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ✓ Unlocked Complimentary Express Delivery
                </span>
              )}
              <span style={{ opacity: 0.5 }}>{freeShippingProgress}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${freeShippingProgress}%`,
                  backgroundColor: freeShippingDifference === 0 ? 'var(--colour-olive)' : 'var(--colour-cognac)',
                }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: 'var(--colour-parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--colour-cognac)', marginBottom: '1.25rem' }}>
                <ShoppingBag size={24} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                Your bag is empty
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, maxWidth: '18rem', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Explore our collection of handcrafted leather bags, folios, and everyday goods.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  router.push('/shop')
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.625rem 1.5rem' }}
              >
                Discover Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => {
                const itemPrice = item.current_price?.amountMinor ?? item.price_snapshot?.amountMinor ?? 0
                const itemTotal = itemPrice * (item.quantity || 1)
                const imgUrl = item.primary_image?.url || '/images/hero/hero-briefcase.jpg'
                const productName = item.product?.name || 'THE COBBLEROAD Leather Piece'
                const productSlug = item.product?.slug || ''
                const colour = item.variant?.colour
                const isUnavailable = item.is_available === false

                return (
                  <div
                    key={item.id}
                    className="cart-item-row"
                    style={{
                      opacity: isUnavailable ? 0.6 : 1,
                      backgroundColor: isUnavailable ? 'rgba(0,0,0,0.02)' : undefined,
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="cart-item-img">
                      <Image
                        src={imgUrl}
                        alt={productName}
                        fill
                        sizes="72px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '0.25rem' }}>
                          {productSlug ? (
                            <Link href={`/products/${productSlug}`} onClick={closeCart}>
                              {productName}
                            </Link>
                          ) : (
                            <span>{productName}</span>
                          )}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${productName}`}
                          className="cart-item-remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant colour */}
                      {colour && (
                        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>
                          Colour: {colour}
                        </p>
                      )}

                      {/* Availability status badges */}
                      {isUnavailable && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '0.125rem 0.375rem', borderRadius: '2px', marginBottom: '0.375rem', fontWeight: 600 }}>
                          <AlertTriangle size={11} />
                          {item.unavailable_reason === 'out_of_stock' ? 'Out of Stock' : 'Discontinued'}
                        </div>
                      )}

                      {/* Price change badge */}
                      {item.price_changed && (
                        <div style={{ fontSize: '0.6875rem', color: '#92400e', backgroundColor: '#fef3c7', padding: '0.125rem 0.375rem', borderRadius: '2px', marginBottom: '0.375rem', display: 'inline-block' }}>
                          Price updated to {formatAmount(itemPrice, currency)}
                        </div>
                      )}

                      {/* Personalisation Badge */}
                      {item.personalisation?.text && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--colour-cognac)', backgroundColor: 'var(--colour-parchment)', padding: '0.125rem 0.375rem', borderRadius: '2px', marginBottom: '0.5rem' }}>
                          <Sparkles size={11} /> Initials: <strong>{item.personalisation.text}</strong>
                          {item.personalisation.style && <span style={{ opacity: 0.7 }}>({item.personalisation.style})</span>}
                        </div>
                      )}

                      {/* Controls & Price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        {/* Stepper */}
                        <div className="cart-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUnavailable}
                            aria-label="Decrease quantity"
                            className="stepper-btn"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="stepper-val">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUnavailable || item.quantity >= (item.max_available ?? 10)}
                            aria-label="Increase quantity"
                            className="stepper-btn"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isUnavailable ? '#9ca3af' : 'inherit' }}>
                          {formatAmount(itemTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 500 }}>
                {formatAmount(subtotalMinor, currency)}
              </span>
            </div>
            <p style={{ fontSize: '0.6875rem', opacity: 0.55, marginBottom: '1rem', lineHeight: 1.4 }}>
              *Pieces in your bag are reserved only upon completing checkout. Handcrafted in India.
            </p>

            {hasUnavailableItems && (
              <p style={{ fontSize: '0.75rem', color: '#b91c1c', marginBottom: '0.75rem', fontWeight: 500 }}>
                Please remove unavailable pieces to proceed to checkout.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  router.push('/checkout')
                }}
                disabled={hasUnavailableItems}
                className="btn btn-primary btn-full"
                id="cart-drawer-checkout-btn"
                style={{ opacity: hasUnavailableItems ? 0.5 : 1, cursor: hasUnavailableItems ? 'not-allowed' : 'pointer' }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => {
                  closeCart()
                  router.push('/cart')
                }}
                className="btn btn-secondary btn-full"
                style={{ fontSize: '0.8125rem' }}
              >
                View Full Bag
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.6875rem', opacity: 0.5 }}>
              <ShieldCheck size={13} style={{ color: 'var(--colour-olive)' }} />
              <span>Complimentary Personalisation &bull; Lifetime Stitch Warranty</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
