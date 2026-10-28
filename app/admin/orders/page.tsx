import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatAmount } from '@/lib/currency'

export const metadata = { title: 'Orders — Admin' }

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

const STATUS_OPTIONS = ['all', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed']

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  payment_pending: { bg: '#ffe4e6', color: '#9f1239', label: 'Awaiting Payment' },
  paid: { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing' },
  shipped: { bg: '#e0e7ff', color: '#3730a3', label: 'Shipped' },
  delivered: { bg: '#f0fdf4', color: '#166534', label: 'Delivered' },
  cancelled: { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' },
  refunded: { bg: '#faf5ff', color: '#6b21a8', label: 'Refunded' },
  failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  await requireAdmin()
  const params = await searchParams
  const statusFilter = params.status === 'all' || !params.status ? null : params.status
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const limit = 20
  const offset = (page - 1) * limit

  const supabase = await createAdminClient()
  let query = supabase
    .from('orders')
    .select('id, order_number, status, total_minor, currency, created_at, user_id, guest_email, profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data: orders, count, error } = await query

  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400 }}>Orders</h1>
        <p style={{ fontSize: '0.875rem', opacity: 0.5, marginTop: '0.25rem' }}>{count ?? 0} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid var(--colour-border)', paddingBottom: '1rem' }}>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            style={{
              padding: '0.375rem 0.875rem',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'capitalize',
              textDecoration: 'none',
              border: '1px solid var(--colour-border)',
              color: (params.status ?? 'all') === s ? 'var(--colour-ivory)' : 'var(--colour-charcoal)',
              background: (params.status ?? 'all') === s ? 'var(--colour-espresso)' : 'transparent',
              fontWeight: 500,
            }}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {error && <div className="demo-notice" style={{ marginBottom: '1.5rem' }}>Could not load orders. Check Supabase connection.</div>}

      {(orders ?? []).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.4, border: '1px solid var(--colour-border)', background: 'var(--colour-paper)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>No orders{statusFilter ? ` with status "${statusFilter}"` : ''} yet.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--colour-border)' }}>
                  {['Order', 'Date', 'Customer', 'Status', 'Total'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(orders ?? []).map((order: any) => {
                  const s = STATUS_STYLE[order.status] ?? { bg: '#f1f5f9', color: '#475569', label: order.status }
                  const customer = (order.profiles as any)?.full_name ?? (order.profiles as any)?.email ?? order.guest_email ?? 'Guest'

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--colour-border-light)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--colour-cognac)', textDecoration: 'none', fontWeight: 500 }}>
                          {order.order_number}
                        </Link>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', opacity: 0.6 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>{customer}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.125rem 0.625rem', background: s.bg, color: s.color, fontSize: '0.6875rem', letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase' }}>
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {page > 1 && <Link href={`/admin/orders?status=${params.status ?? 'all'}&page=${page - 1}`} className="btn btn-secondary btn-sm">← Prev</Link>}
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8125rem', opacity: 0.5, padding: '0 0.75rem' }}>Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`/admin/orders?status=${params.status ?? 'all'}&page=${page + 1}`} className="btn btn-secondary btn-sm">Next →</Link>}
        </div>
      )}
    </div>
  )
}
