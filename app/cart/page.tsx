'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle, Info, Sparkles, ShieldCheck } from 'lucide-react'
import { useCart } from '@/components/storefront/CartProvider'
import { formatAmount } from '@/lib/currency'

export default function CartPage() {
  const {
    items,
    subtotalMinor,
    currency,
    removeItem,
    updateQuantity,
    isHydrated,
    warnings,
    hasUnavailableItems,
    dismissWarnings,
  } = useCart()

  if (!isHydrated) {
    return (
      <div
        style={{
          backgroundColor: 'var(--colour-paper)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', opacity: 0.6 }}>
          Loading your bag…
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--colour-paper)',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <ShoppingBag size={40} strokeWidth={1} style={{ color: 'var(--colour-border)', marginBottom: '1.5rem' }} />
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 400,
            marginBottom: '0.75rem',
          }}
        >
          Your bag is empty
        </h1>
        <p style={{ fontSize: '0.9375rem', opacity: 0.6, marginBottom: '2rem' }}>
          Add something beautiful.
        </p>
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const shippingThresholdMinor = 299900 // ₹2,999 free shipping threshold
  const shippingMinor = subtotalMinor >= shippingThresholdMinor ? 0 : 15000 // ₹150 flat rate
  const totalMinor = subtotalMinor + shippingMinor

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '70vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--colour-parchment)',
          borderBottom: '1px solid var(--colour-border)',
          padding: '3rem 0 2rem',
        }}
      >
        <div className="container-site">
          <span className="section-label">Shopping Bag</span>
          <h1 className="section-title">Your Bag</h1>
        </div>
      </div>

      {/* Revalidation Banner */}
      {warnings && warnings.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fef3c7',
            padding: '1rem 0',
          }}
        >
          <div className="container-site" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5 }}>
              <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Important updates to pieces in your bag:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissWarnings}
              aria-label="Dismiss notice"
              style={{
                background: 'none',
                border: 'none',
                color: '#92400e',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1,
                padding: '0.25rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Items */}
          <div>
            {items.map((item) => {
              const isUnavailable = item.is_available === false
              const itemPrice = item.current_price?.amountMinor ?? item.price_snapshot?.amountMinor ?? 0
              const lineTotal = itemPrice * (item.quantity || 1)
              const maxAllowed = item.max_available ?? 10

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '6rem 1fr',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    backgroundColor: isUnavailable ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    border: isUnavailable ? '1px dashed #fca5a5' : '1px solid var(--colour-border)',
                    opacity: isUnavailable ? 0.75 : 1,
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      backgroundColor: 'var(--colour-parchment)',
                      overflow: 'hidden',
                    }}
                  >
                    {item.primary_image ? (
                      <Image
                        src={item.primary_image.url}
                        alt={item.primary_image.alt ?? item.product?.name ?? 'Cobleroad Piece'}
                        fill
                        sizes="96px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          opacity: 0.3,
                        }}
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <Link
                          href={`/products/${item.product?.slug || ''}`}
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.0625rem',
                            fontWeight: 400,
                            color: 'var(--colour-espresso)',
                            textDecoration: 'none',
                            display: 'block',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {item.product?.name || 'Cobleroad Leather Piece'}
                        </Link>
                      </div>

                      {item.variant?.colour && (
                        <p style={{ fontSize: '0.8125rem', opacity: 0.55, marginBottom: '0.25rem' }}>
                          Colour: {item.variant.colour}
                        </p>
                      )}

                      {/* Unavailable Notice */}
                      {isUnavailable && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.75rem',
                            color: '#b91c1c',
                            backgroundColor: '#fee2e2',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '2px',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                          }}
                        >
                          <AlertTriangle size={13} />
                          {item.unavailable_reason === 'out_of_stock'
                            ? 'Currently Out of Stock'
                            : 'This design has been retired'}
                        </div>
                      )}

                      {/* Price Change Notice */}
                      {item.price_changed && (
                        <div
                          style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            color: '#92400e',
                            backgroundColor: '#fef3c7',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '2px',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Price updated from {formatAmount(item.price_snapshot.amountMinor, item.price_snapshot.currency)} to {formatAmount(itemPrice, currency)}
                        </div>
                      )}

                      {/* Stock Limitation Notice */}
                      {item.stock_limited && (
                        <div
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#b45309',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Quantity was adjusted to remaining inventory ({maxAllowed} available).
                        </div>
                      )}

                      {item.personalisation?.text && (
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--colour-cognac)',
                            marginBottom: '0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Sparkles size={12} />
                          Personalisation: <strong>{item.personalisation.text}</strong>
                          {item.personalisation.style && <span>({item.personalisation.style})</span>}
                          <span style={{ opacity: 0.5 }}>(complimentary)</span>
                        </p>
                      )}

                      <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: isUnavailable ? '#9ca3af' : 'inherit' }}>
                        {formatAmount(itemPrice, currency)}
                        {item.price_changed && (
                          <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.5, marginLeft: '0.5rem' }}>
                            {formatAmount(item.price_snapshot.amountMinor, item.price_snapshot.currency)}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Quantity + remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUnavailable}
                          aria-label={`Decrease quantity of ${item.product?.name || 'item'}`}
                          style={{
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--colour-border)',
                            background: 'none',
                            cursor: item.quantity <= 1 || isUnavailable ? 'not-allowed' : 'pointer',
                            opacity: item.quantity <= 1 || isUnavailable ? 0.35 : 1,
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          style={{
                            width: '2.5rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--colour-border)',
                            borderLeft: 'none',
                            borderRight: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUnavailable || item.quantity >= maxAllowed}
                          aria-label={`Increase quantity of ${item.product?.name || 'item'}`}
                          style={{
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--colour-border)',
                            background: 'none',
                            cursor: isUnavailable || item.quantity >= maxAllowed ? 'not-allowed' : 'pointer',
                            opacity: isUnavailable || item.quantity >= maxAllowed ? 0.35 : 1,
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.product?.name || 'item'} from bag`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--colour-charcoal)',
                          fontSize: '0.75rem',
                          opacity: 0.6,
                          transition: 'opacity 0.15s',
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>

                      {/* Line total */}
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          color: isUnavailable ? '#9ca3af' : 'inherit',
                        }}
                      >
                        {formatAmount(lineTotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link href="/shop" className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div
            style={{
              background: 'var(--colour-parchment)',
              border: '1px solid var(--colour-border)',
              padding: '1.75rem',
              position: 'sticky',
              top: '6rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--colour-border)',
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                <span>Subtotal</span>
                <span>{formatAmount(subtotalMinor, currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                <span>Shipping</span>
                <span>
                  {shippingMinor === 0 ? (
                    <span style={{ color: 'var(--colour-olive)', fontWeight: 500 }}>Free</span>
                  ) : (
                    formatAmount(shippingMinor, currency)
                  )}
                </span>
              </div>
              {shippingMinor > 0 && (
                <p style={{ fontSize: '0.75rem', opacity: 0.55, lineHeight: 1.5 }}>
                  Free shipping on orders over {formatAmount(shippingThresholdMinor, currency)}.
                </p>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '1.0625rem',
                borderTop: '1px solid var(--colour-border)',
                paddingTop: '1rem',
                marginBottom: '1rem',
              }}
            >
              <span>Total (INR)</span>
              <span>{formatAmount(totalMinor, currency)}</span>
            </div>

            <p style={{ fontSize: '0.6875rem', opacity: 0.55, marginBottom: '1.25rem', lineHeight: 1.4 }}>
              *Pieces in your bag are reserved only upon completing checkout. Handcrafted in India.
            </p>

            {hasUnavailableItems && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  marginBottom: '1rem',
                }}
              >
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>Please remove unavailable pieces to proceed to checkout.</span>
              </div>
            )}

            {hasUnavailableItems ? (
              <button
                type="button"
                disabled
                className="btn btn-primary btn-full btn-lg"
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
            ) : (
              <Link href="/checkout" className="btn btn-primary btn-full btn-lg" id="checkout-btn">
                Proceed to Checkout <ArrowRight size={15} />
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.6875rem', opacity: 0.65 }}>
              <ShieldCheck size={13} style={{ color: 'var(--colour-olive)' }} />
              <span>Complimentary Personalisation &bull; Lifetime Stitch Warranty</span>
            </div>

            <p style={{ fontSize: '0.6875rem', opacity: 0.45, textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
              Payments processed securely by Razorpay.
              Tax calculated at checkout where applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
