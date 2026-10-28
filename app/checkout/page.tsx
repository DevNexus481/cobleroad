'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, CreditCard, MapPin, ChevronRight, AlertTriangle } from 'lucide-react'
import { useCart } from '@/components/storefront/CartProvider'
import { formatAmount } from '@/lib/currency'
import { ShippingAddressSchema } from '@/lib/validation'

type CheckoutFormData = z.infer<typeof ShippingAddressSchema>

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
    formState: { errors },
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: { country: 'IN' },
  })

  const isRazorpayConfigured = !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.includes('your_key_id'))

  const shippingThresholdMinor = 299900
  const shippingMinor = subtotalMinor >= shippingThresholdMinor ? 0 : 15000
  const totalMinor = subtotalMinor + shippingMinor

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
            personalisation_text: i.personalisation?.text,
          })),
          shipping_address: data,
          currency: 'INR',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setServerError(result.error ?? 'Failed to create order. Please try again.')
        setIsSubmitting(false)
        return
      }

      setCreatedOrderId(result.order_id)

      if (!isRazorpayConfigured) {
        setServerError('Payment gateway not configured. Please set up Razorpay credentials to process payments.')
        setIsSubmitting(false)
        return
      }

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.head.appendChild(script)

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: result.razorpay_amount,
          currency: result.currency,
          name: 'Cobleroad',
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
            Cobleroad
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
                  <label htmlFor="state" className="form-label">State *</label>
                  <select id="state" {...register('state')} className="form-select" autoComplete="address-level1">
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="form-error">{errors.state.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="postal_code" className="form-label">PIN Code *</label>
                  <input id="postal_code" {...register('postal_code')} className="form-input" placeholder="400001" autoComplete="postal-code" maxLength={6} />
                  {errors.postal_code && <p className="form-error">{errors.postal_code.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select id="country" {...register('country')} className="form-select" autoComplete="country" disabled>
                    <option value="IN">India (INR)</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: '0.25rem' }}>International shipping coming soon.</p>
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
                <span>Subtotal</span><span>{formatAmount(subtotalMinor, currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ color: shippingMinor === 0 ? 'var(--colour-olive)' : 'inherit', fontWeight: shippingMinor === 0 ? 500 : 400 }}>
                  {shippingMinor === 0 ? 'Free' : formatAmount(shippingMinor, currency)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem', borderTop: '1px solid var(--colour-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Total</span><span>{formatAmount(totalMinor, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
