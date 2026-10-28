import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatAmount } from '@/lib/currency'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

interface OrderConfirmationProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, total_minor, currency, created_at,
      shipping_address,
      order_items (
        id, product_name_snapshot, variant_colour_snapshot, quantity, unit_price_minor, currency, subtotal_minor, personalisation
      )
    `)
    .eq('id', id)
    .single()

  if (error || !order) notFound()

  const shippingAddr = order.shipping_address as any

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '70vh' }}>
      <div className="container-site" style={{ paddingTop: '4rem', paddingBottom: '5rem', maxWidth: '46rem' }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <CheckCircle2 size={48} strokeWidth={1.5} style={{ color: 'var(--colour-olive)', margin: '0 auto 1.25rem' }} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', fontWeight: 400, marginBottom: '0.5rem' }}>
            Order Confirmed
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.6, lineHeight: 1.7 }}>
            Thank you. Your order <strong>{order.order_number}</strong> has been placed.
            We&apos;ll email you when it ships.
          </p>
        </div>

        {/* Order items */}
        <div style={{ border: '1px solid var(--colour-border)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--colour-border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Package size={15} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.04em' }}>Order Items</span>
          </div>
          {(order.order_items as any[]).map((item, i) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: i < order.order_items.length - 1 ? '1px solid var(--colour-border-light)' : 'none', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{item.product_name_snapshot}</p>
                {item.variant_colour_snapshot && <p style={{ fontSize: '0.8125rem', opacity: 0.55 }}>{item.variant_colour_snapshot}</p>}
                {item.personalisation && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)', marginTop: '0.125rem' }}>
                    ✦ Personalised: {item.personalisation.text}
                  </p>
                )}
                <p style={{ fontSize: '0.8125rem', opacity: 0.5, marginTop: '0.125rem' }}>Qty: {item.quantity}</p>
              </div>
              <span style={{ fontWeight: 500, fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>
                {formatAmount(item.subtotal_minor, item.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary + address */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ border: '1px solid var(--colour-border)', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5, marginBottom: '0.75rem' }}>Order Total</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400 }}>{formatAmount(order.total_minor, order.currency)}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: '0.25rem' }}>
              {order.status === 'paid' ? '✓ Payment received' : order.status}
            </p>
          </div>

          {shippingAddr && (
            <div style={{ border: '1px solid var(--colour-border)', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5, marginBottom: '0.75rem' }}>Ships To</p>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                {shippingAddr.full_name}<br />
                {shippingAddr.line1}{shippingAddr.line2 ? `, ${shippingAddr.line2}` : ''}<br />
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account" className="btn btn-secondary">View My Orders</Link>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
