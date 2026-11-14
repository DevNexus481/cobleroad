'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, CreditCard, MapPin, ChevronRight, AlertTriangle } from 'lucide-react'
import { useCart } from '@/components/storefront/CartProvider'
import { formatAmount, calculateProductPrice } from '@/lib/currency'
import { ShippingAddressSchema } from '@/lib/validation'
import type { CurrencyCode } from '@/types'

type CheckoutFormData = z.infer<typeof ShippingAddressSchema>

const SUPPORTED_COUNTRIES = [
  { code: 'IN', name: 'India (Domestic)', currency: 'INR' as const },
  { code: 'US', name: 'United States (USD)', currency: 'USD' as const },
  { code: 'GB', name: 'United Kingdom (USD)', currency: 'USD' as const },
  { code: 'CA', name: 'Canada (USD)', currency: 'USD' as const },
  { code: 'AU', name: 'Australia (USD)', currency: 'USD' as const },
  { code: 'AE', name: 'United Arab Emirates (USD)', currency: 'USD' as const },
  { code: 'SG', name: 'Singapore (USD)', currency: 'USD' as const },
  { code: 'DE', name: 'Germany (USD)', currency: 'USD' as const },
  { code: 'FR', name: 'France (USD)', currency: 'USD' as const },
  { code: 'IT', name: 'Italy (USD)', currency: 'USD' as const },
  { code: 'CH', name: 'Switzerland (USD)', currency: 'USD' as const },
  { code: 'NL', name: 'Netherlands (USD)', currency: 'USD' as const },
  { code: 'JP', name: 'Japan (USD)', currency: 'USD' as const },
]

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, subtotalMinor, currency, clearCart, isHydrated, hasUnavailableItems } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: { country: currency === 'USD' ? 'US' : 'IN' },
  })

  const selectedCountry = watch('country') || (currency === 'USD' ? 'US' : 'IN')
  const isInternational = selectedCountry !== 'IN'
  const effectiveCurrency: CurrencyCode = isInternational ? 'USD' : (currency === 'USD' ? 'USD' : 'INR')

  const isRazorpayConfigured = !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.includes('your_key_id'))

  // Calculate subtotal in effective currency
  const effectiveSubtotalMinor = items.reduce((sum, item) => {
    let price = item.price_snapshot.amountMinor
    if (item.price_snapshot.currency !== effectiveCurrency) {
      if (item.price_snapshot.currency === 'INR' && effectiveCurrency === 'USD') {
        price = calculateProductPrice(price, 'USD')
      } else if (item.price_snapshot.currency === 'USD' && effectiveCurrency === 'INR') {
        price = Math.round(((price / 100) / 2) * 85) * 100
      }
    }
    return sum + price * item.quantity
  }, 0)

  const shippingThresholdMinor = isInternational ? 20000 : 299900 // $200 or ₹2,999
  const shippingMinor = effectiveSubtotalMinor >= shippingThresholdMinor ? 0 : (isInternational ? 2500 : 15000)
  const totalMinor = effectiveSubtotalMinor + shippingMinor

  if (!isHydrated) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', opacity: 0.6 }}>Loading checkout…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>
            Your bag is empty
          </h1>
          <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  async function onAddressSubmit(data: CheckoutFormData) {
    if (hasUnavailableItems) {
      setServerError('One or more pieces in your bag are no longer available. Please return to your bag to remove them before proceeding.')
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      // Create order on server — server will validate prices and stock
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
            personalisation_text: i.personalisation?.text || undefined,
          })),
          shipping_address: {
            ...data,
            country: data.country || selectedCountry,
          },
          currency: effectiveCurrency,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setServerError(result.error ?? 'Failed to create order. Please try again.')
        setIsSubmitting(false)
        return
      }

      setCreatedOrderId(result.order_id)

      if (!isRazorpayConfigured && !result.razorpay_order_id) {
        setServerError('Payment gateway not configured. Please set up Razorpay credentials to process payments.')
        setIsSubmitting(false)
        return
      }

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.head.appendChild(script)

      script.onload = () => {
        const keyId = result.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        const options = {
          key: keyId,
          amount: result.razorpay_amount,
          currency: result.currency,
          name: 'THE COBBLEROAD',
          description: `Order ${result.order_number}`,
          order_id: result.razorpay_order_id,
          prefill: {
            name: data.full_name,
            email: data.email,
            contact: data.phone ?? '',
          },
          theme: { color: '#9A633F' },
          handler: async (response: any) => {
            // Verify payment on server — never trust client callback alone
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: result.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyResult = await verifyRes.json()

            if (!verifyRes.ok || !verifyResult.success) {
              setServerError('Payment verification failed. Please contact support with your order reference.')
              return
            }

            // Payment verified server-side — clear cart and redirect
            clearCart()
            router.push(`/orders/${result.order_id}/confirmation`)
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false)
              setServerError('Payment was cancelled. Your order has been saved — you can retry payment from your account.')
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        setIsSubmitting(false)
      }

      script.onerror = () => {
        setServerError('Could not load payment gateway. Please check your internet connection and try again.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('[checkout]', err)
      setServerError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '70vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '2rem 0 1.5rem' }}>
        <div className="container-site">
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--colour-espresso)' }}>
            THE COBBLEROAD
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--colour-charcoal)', opacity: 0.6 }}>
            <Link href="/cart" style={{ color: 'inherit' }}>Bag</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--colour-espresso)', fontWeight: 600, opacity: 1 }}>Checkout</span>
          </div>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)', gap: '4rem', alignItems: 'start' }}>
          {/* Form */}
          <div>
            {hasUnavailableItems && (
              <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.5, color: '#b91c1c' }}>
                <AlertTriangle size={16} style={{ color: '#b91c1c', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Unavailable pieces in your bag.</strong> One or more items in your bag are currently out of stock or retired.{' '}
                  <Link href="/cart" style={{ textDecoration: 'underline', fontWeight: 600, color: 'inherit' }}>
                    Return to Bag
                  </Link>{' '}
                  to update your selection before completing checkout.
                </div>
              </div>
            )}

            {/* Not configured warning */}
            {!isRazorpayConfigured && (
              <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: '#fffbeb', border: '1px solid #f59e0b', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
                <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Payment gateway not configured.</strong> You can fill out your shipping address, but payment will not process until Razorpay credentials are added.
                  See <code>.env.example</code> for setup instructions.
                </div>
              </div>
            )}

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '2rem' }}>
              Shipping Information
            </h1>

            <form onSubmit={handleSubmit(onAddressSubmit)} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="full_name" className="form-label">Full Name *</label>
                  <input id="full_name" {...register('full_name')} className="form-input" placeholder="Jane Doe" autoComplete="name" />
                  {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input id="email" type="email" {...register('email')} className="form-input" placeholder="jane@example.com" autoComplete="email" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input id="phone" type="tel" {...register('phone')} className="form-input" placeholder="+91 98765 43210" autoComplete="tel" />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="line1" className="form-label">Address Line 1 *</label>
                  <input id="line1" {...register('line1')} className="form-input" placeholder="House/flat no., building, street" autoComplete="address-line1" />
                  {errors.line1 && <p className="form-error">{errors.line1.message}</p>}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="line2" className="form-label">Address Line 2</label>
                  <input id="line2" {...register('line2')} className="form-input" placeholder="Area, landmark (optional)" autoComplete="address-line2" />
                </div>

                <div className="form-group">
                  <label htmlFor="city" className="form-label">City *</label>
                  <input id="city" {...register('city')} className="form-input" placeholder="Mumbai" autoComplete="address-level2" />
                  {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country *</label>
                  <select id="country" {...register('country')} className="form-select" autoComplete="country">
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {isInternational && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)', marginTop: '0.25rem', fontWeight: 500 }}>
                      ✈ International delivery via DHL Express with all import duties included.
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">{selectedCountry === 'IN' ? 'State *' : 'State / Province *'}</label>
                  {selectedCountry === 'IN' ? (
                    <select id="state" {...register('state')} className="form-select" autoComplete="address-level1">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input id="state" {...register('state')} className="form-input" placeholder="State / Province / Region" autoComplete="address-level1" />
                  )}
                  {errors.state && <p className="form-error">{errors.state.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="postal_code" className="form-label">{selectedCountry === 'IN' ? 'PIN Code *' : 'Postal / ZIP Code *'}</label>
                  <input id="postal_code" {...register('postal_code')} className="form-input" placeholder={selectedCountry === 'IN' ? '400001' : '10001'} autoComplete="postal-code" maxLength={selectedCountry === 'IN' ? 6 : 12} />
                  {errors.postal_code && <p className="form-error">{errors.postal_code.message}</p>}
                </div>
              </div>

              {serverError && (
                <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: '#fff5f5', border: '1px solid #fcc', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.5 }} role="alert">
                  <AlertTriangle size={16} style={{ color: '#C0392B', flexShrink: 0, marginTop: '2px' }} />
                  <span>{serverError}</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.5, marginBottom: '1.25rem' }}>
                <Lock size={13} />
                Your information is encrypted and never stored insecurely.
              </div>

              <button
                type="submit"
                disabled={isSubmitting || hasUnavailableItems}
                className="btn btn-primary btn-full btn-lg"
                id="checkout-submit-btn"
                style={{
                  opacity: hasUnavailableItems ? 0.5 : 1,
                  cursor: hasUnavailableItems ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Processing...' : (
                  <><CreditCard size={16} /> Continue to Payment</>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--colour-parchment)', border: '1px solid var(--colour-border)', padding: '1.75rem', position: 'sticky', top: '6rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--colour-border)' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                    {item.variant.colour && <p style={{ opacity: 0.55, fontSize: '0.75rem' }}>{item.variant.colour}</p>}
                    {item.personalisation && <p style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)' }}>✦ {item.personalisation.text}</p>}
                    <p style={{ opacity: 0.55, fontSize: '0.75rem' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {formatAmount(item.price_snapshot.amountMinor * item.quantity, item.price_snapshot.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span><span>{formatAmount(effectiveSubtotalMinor, effectiveCurrency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping ({isInternational ? 'DHL Express' : 'Domestic'})</span>
                <span style={{ color: shippingMinor === 0 ? 'var(--colour-olive)' : 'inherit', fontWeight: shippingMinor === 0 ? 500 : 400 }}>
                  {shippingMinor === 0 ? 'Free' : formatAmount(shippingMinor, effectiveCurrency)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem', borderTop: '1px solid var(--colour-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Total</span><span>{formatAmount(totalMinor, effectiveCurrency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
