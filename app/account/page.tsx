import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatAmount } from '@/lib/currency'
import { User, Package, LogOut, Shield } from 'lucide-react'

export const metadata = { title: 'My Account — THE COBBLEROAD' }

export default async function AccountPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const [profileResult, ordersResult] = await Promise.allSettled([
    supabase.from('profiles').select('full_name, email, role, created_at').eq('id', user.id).single(),
    supabase.from('orders').select('id, order_number, status, total_minor, currency, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
  ])

  const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
  const orders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data ?? []) : []

  const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
    paid: { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
    shipped: { bg: '#e0e7ff', color: '#3730a3', label: 'Shipped' },
    delivered: { bg: '#f0fdf4', color: '#166534', label: 'Delivered' },
    payment_pending: { bg: '#ffe4e6', color: '#9f1239', label: 'Pending Payment' },
    cancelled: { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' },
    refunded: { bg: '#faf5ff', color: '#6b21a8', label: 'Refunded' },
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '70vh' }}>
      <div style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '3rem 0 2rem' }}>
        <div className="container-site">
          <span className="section-label">Account</span>
          <h1 className="section-title">My Account</h1>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Profile card */}
          <div style={{ background: 'var(--colour-parchment)', border: '1px solid var(--colour-border)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--colour-border)' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--colour-espresso)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} style={{ color: 'var(--colour-ivory)' }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{profile?.full_name ?? 'Account'}</p>
                <p style={{ fontSize: '0.8125rem', opacity: 0.55 }}>{profile?.email ?? user.email}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', opacity: 0.55, marginBottom: '1.5rem' }}>
              Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
            </div>

            {profile?.role === 'admin' && (
              <div style={{ marginBottom: '1.5rem', padding: '0.875rem', background: 'var(--colour-paper)', border: '1px solid var(--colour-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <Shield size={14} style={{ color: 'var(--colour-cognac)' }} />
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--colour-cognac)' }}>
                    Admin Privileges
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', opacity: 0.65, marginBottom: '0.75rem' }}>
                  Manage catalogue, add new products, and track orders.
                </p>
                <Link
                  href="/admin"
                  className="btn btn-primary btn-sm btn-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
                  id="account-admin-panel-link"
                >
                  <Shield size={13} /> Open Admin Dashboard
                </Link>
              </div>
            )}

            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={13} /> Sign Out
              </button>
            </form>
          </div>

          {/* Orders */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Package size={18} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>Order History</h2>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid var(--colour-border)', background: 'var(--colour-parchment)', opacity: 0.6 }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', marginBottom: '0.75rem' }}>No orders yet</p>
                <Link href="/shop" className="btn btn-primary btn-sm">Browse the Collection</Link>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--colour-border)', background: 'var(--colour-paper)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--colour-border)' }}>
                      {['Order', 'Date', 'Status', 'Total'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => {
                      const s = STATUS_BADGE[order.status] ?? { bg: '#f1f5f9', color: '#475569', label: order.status }
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--colour-border-light)' }}>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <Link href={`/orders/${order.id}`} style={{ color: 'var(--colour-cognac)', textDecoration: 'none', fontWeight: 500 }}>{order.order_number}</Link>
                          </td>
                          <td style={{ padding: '0.875rem 1rem', opacity: 0.6 }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <span style={{ display: 'inline-block', padding: '0.125rem 0.625rem', background: s.bg, color: s.color, fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>
                            {formatAmount(order.total_minor, order.currency)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
