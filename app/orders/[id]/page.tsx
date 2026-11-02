import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { formatAmount } from '@/lib/currency'
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { isValidUUID } from '@/lib/products/fallback-data'

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; desc: string; step: number }
> = {
  payment_pending: {
    label: 'Payment Pending',
    bg: '#fef3c7',
    color: '#92400e',
    desc: 'Waiting for payment confirmation',
    step: 1,
  },
  paid: {
    label: 'Order Confirmed',
    bg: '#dcfce7',
    color: '#15803d',
    desc: 'Payment received. Preparing for craftsmanship.',
    step: 2,
  },
  processing: {
    label: 'In Atelier',
    bg: '#fef9c3',
    color: '#854d0e',
    desc: 'Artisans are crafting and inspecting your leather piece.',
    step: 3,
  },
  shipped: {
    label: 'Dispatched',
    bg: '#e0e7ff',
    color: '#3730a3',
    desc: 'Handed over to courier with white-glove packaging.',
    step: 4,
  },
  delivered: {
    label: 'Delivered',
    bg: '#dcfce7',
    color: '#166534',
    desc: 'Successfully delivered to your destination.',
    step: 5,
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#fee2e2',
    color: '#991b1b',
    desc: 'This order was cancelled.',
    step: 0,
  },
  refunded: {
    label: 'Refunded',
    bg: '#f1f5f9',
    color: '#475569',
    desc: 'The payment has been refunded.',
    step: 0,
  },
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  if (!id) notFound()

  // Authenticated client checks RLS first
  const userSupabase = await createClient()
  const {
    data: { user },
  } = await userSupabase.auth.getUser()

  // Admin client ensures order is reachable by capability token (UUID) or order_number
  const adminSupabase = await createAdminClient()

  let query = adminSupabase.from('orders').select(`
      id, order_number, status, total_minor, subtotal_minor, shipping_minor, tax_minor, discount_minor, currency, created_at,
      user_id, guest_email, tracking_number,
      shipping_address,
      order_items (
        id, product_name_snapshot, variant_colour_snapshot, variant_sku_snapshot, quantity, unit_price_minor, currency, subtotal_minor, personalisation
      ),
      payments (
        id, razorpay_order_id, razorpay_payment_id, status, created_at
      )
    `)

  if (isValidUUID(id)) {
    query = query.eq('id', id)
  } else {
    query = query.eq('order_number', id)
  }

  const { data: order, error } = await query.maybeSingle()

  if (error || !order) {
    notFound()
  }

  // Security check: if order belongs to a user, make sure it's the owner or admin
  if (order.user_id && user && order.user_id !== user.id) {
    notFound()
  }

  const shippingAddr = order.shipping_address as any
  const statusInfo =
    STATUS_CONFIG[order.status] ?? {
      label: order.status.toUpperCase(),
      bg: '#f1f5f9',
      color: '#475569',
      desc: 'Order is being processed.',
      step: 2,
    }

  const paymentRecord = (order.payments as any[])?.[0]

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '80vh', paddingBottom: '6rem' }}>
      {/* Header breadcrumb banner */}
      <div
        style={{
          backgroundColor: 'var(--colour-parchment)',
          borderBottom: '1px solid var(--colour-border)',
          padding: '2.5rem 0 2rem',
        }}
      >
        <div className="container-site">
          <Link
            href="/account"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              color: 'var(--colour-cognac)',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Back to Account
          </Link>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  opacity: 0.55,
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Order Details
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: 'var(--colour-espresso)',
                  margin: 0,
                }}
              >
                {order.order_number}
              </h1>
              <p style={{ fontSize: '0.8125rem', opacity: 0.6, marginTop: '0.35rem' }}>
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.3rem 0.85rem',
                  background: statusInfo.bg,
                  color: statusInfo.color,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderRadius: '2px',
                }}
              >
                {statusInfo.label}
              </span>
              <p style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.4rem' }}>
                {statusInfo.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Order Items & Timeline */}
          <div>
            {/* Timeline Progress */}
            {statusInfo.step > 0 && (
              <div
                style={{
                  border: '1px solid var(--colour-border)',
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Clock size={16} style={{ color: 'var(--colour-cognac)' }} />
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Fulfillment Progress
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  {[
                    { title: 'Confirmed', step: 2 },
                    { title: 'In Atelier', step: 3 },
                    { title: 'Dispatched', step: 4 },
                    { title: 'Delivered', step: 5 },
                  ].map((s) => {
                    const isDone = statusInfo.step >= s.step
                    return (
                      <div key={s.title}>
                        <div
                          style={{
                            height: '4px',
                            backgroundColor: isDone
                              ? 'var(--colour-cognac)'
                              : 'var(--colour-border-light)',
                            marginBottom: '0.5rem',
                            transition: 'background-color 0.3s',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: isDone ? 600 : 400,
                            color: isDone
                              ? 'var(--colour-espresso)'
                              : 'var(--colour-espresso-muted)',
                            opacity: isDone ? 1 : 0.5,
                          }}
                        >
                          {s.title}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {order.tracking_number && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--colour-parchment)',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Truck size={15} style={{ color: 'var(--colour-cognac)' }} />
                    <span>
                      Tracking ID: <strong>{order.tracking_number}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Items List */}
            <div
              style={{
                border: '1px solid var(--colour-border)',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--colour-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  backgroundColor: 'var(--colour-parchment)',
                }}
              >
                <Package size={16} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)' }} />
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    letterSpacing: '0.04em',
                    color: 'var(--colour-espresso)',
                  }}
                >
                  Articles in this Order ({order.order_items?.length || 0})
                </span>
              </div>

              {(order.order_items as any[])?.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '1.25rem',
                    borderBottom:
                      i < order.order_items.length - 1
                        ? '1px solid var(--colour-border-light)'
                        : 'none',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 500,
                        fontSize: '1rem',
                        margin: 0,
                        color: 'var(--colour-espresso)',
                      }}
                    >
                      {item.product_name_snapshot}
                    </h3>

                    {item.variant_colour_snapshot && (
                      <p style={{ fontSize: '0.8125rem', opacity: 0.6, marginTop: '0.2rem' }}>
                        Colour: {item.variant_colour_snapshot}
                      </p>
                    )}

                    {item.variant_sku_snapshot && (
                      <p
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'monospace',
                          opacity: 0.45,
                          marginTop: '0.15rem',
                        }}
                      >
                        SKU: {item.variant_sku_snapshot}
                      </p>
                    )}

                    {item.personalisation?.text && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '0.35rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'var(--colour-parchment)',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          color: 'var(--colour-cognac)',
                          fontWeight: 500,
                        }}
                      >
                        ✦ Bespoke Monogram: {item.personalisation.text}
                      </div>
                    )}

                    <p style={{ fontSize: '0.8125rem', opacity: 0.55, marginTop: '0.35rem' }}>
                      Quantity: {item.quantity} × {formatAmount(item.unit_price_minor, item.currency)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'var(--colour-espresso)',
                      }}
                    >
                      {formatAmount(item.subtotal_minor, item.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary, Shipping & Payment */}
          <div>
            {/* Price Summary */}
            <div
              style={{
                border: '1px solid var(--colour-border)',
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  marginBottom: '1.25rem',
                  color: 'var(--colour-espresso)',
                }}
              >
                Payment Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                  <span>Subtotal</span>
                  <span>{formatAmount(order.subtotal_minor, order.currency)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                  <span>Shipping</span>
                  <span>
                    {order.shipping_minor === 0 ? 'Complimentary' : formatAmount(order.shipping_minor, order.currency)}
                  </span>
                </div>

                {order.tax_minor > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                    <span>Estimated GST</span>
                    <span>{formatAmount(order.tax_minor, order.currency)}</span>
                  </div>
                )}

                {order.discount_minor > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--colour-olive)' }}>
                    <span>Discount</span>
                    <span>-{formatAmount(order.discount_minor, order.currency)}</span>
                  </div>
                )}

                <div
                  style={{
                    borderTop: '1px solid var(--colour-border-light)',
                    paddingTop: '0.75rem',
                    marginTop: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: 'var(--colour-espresso)',
                  }}
                >
                  <span>Total Paid</span>
                  <span>{formatAmount(order.total_minor, order.currency)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--colour-border-light)',
                  fontSize: '0.75rem',
                  color: 'var(--colour-espresso)',
                  opacity: 0.75,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <CreditCard size={13} style={{ color: 'var(--colour-cognac)' }} />
                  <span>Razorpay Payment Gateway</span>
                </div>
                {paymentRecord?.razorpay_payment_id && (
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.6875rem', opacity: 0.65 }}>
                    Ref: {paymentRecord.razorpay_payment_id}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Destination */}
            {shippingAddr && (
              <div
                style={{
                  border: '1px solid var(--colour-border)',
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MapPin size={16} style={{ color: 'var(--colour-cognac)' }} />
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      margin: 0,
                      color: 'var(--colour-espresso)',
                    }}
                  >
                    Shipping Destination
                  </h2>
                </div>

                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--colour-espresso)' }}>
                  <strong>{shippingAddr.full_name}</strong>
                  <br />
                  {shippingAddr.line1}
                  {shippingAddr.line2 ? `, ${shippingAddr.line2}` : ''}
                  <br />
                  {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}
                  <br />
                  {shippingAddr.country === 'IN' ? 'India' : shippingAddr.country}
                </p>

                {shippingAddr.phone && (
                  <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.75rem', margin: 0 }}>
                    Phone: {shippingAddr.phone}
                  </p>
                )}
              </div>
            )}

            {/* Assurance Box */}
            <div
              style={{
                backgroundColor: 'var(--colour-parchment)',
                border: '1px solid var(--colour-border)',
                padding: '1.25rem',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--colour-cognac)' }} />
                <span style={{ fontWeight: 600 }}>Lifetime Craftsmanship Guarantee</span>
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.65, lineHeight: 1.6, margin: 0 }}>
                Every Cobleroad piece is guaranteed for life against artisanal defects in materials and hardware.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
