import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShoppingBag, Users, Package, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { formatAmount } from '@/lib/currency'

export const metadata = { title: 'Admin Dashboard — THE COBBLEROAD' }

async function getDashboardStats() {
  const supabase = await createAdminClient()

  const [
    ordersResult,
    usersResult,
    productsResult,
    recentOrdersResult,
    revenueResult,
    pendingOrdersResult,
  ] = await Promise.allSettled([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, order_number, status, total_minor, currency, created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('orders').select('total_minor').eq('status', 'paid').then(({ data }) =>
      (data ?? []).reduce((sum, o) => sum + (o.total_minor ?? 0), 0)
    ),
    supabase.from('orders').select('id', { count: 'exact', head: true }).in('status', ['payment_pending', 'paid', 'processing']),
  ])

  return {
    totalOrders: ordersResult.status === 'fulfilled' ? (ordersResult.value.count ?? 0) : 0,
    totalCustomers: usersResult.status === 'fulfilled' ? (usersResult.value.count ?? 0) : 0,
    totalProducts: productsResult.status === 'fulfilled' ? (productsResult.value.count ?? 0) : 0,
    recentOrders: recentOrdersResult.status === 'fulfilled' ? (recentOrdersResult.value.data ?? []) : [],
    totalRevenuePaise: revenueResult.status === 'fulfilled' ? revenueResult.value : 0,
    pendingOrders: pendingOrdersResult.status === 'fulfilled' ? (pendingOrdersResult.value.count ?? 0) : 0,
  }
}

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

export default async function AdminDashboardPage() {
  await requireAdmin()
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Total Revenue', value: formatAmount(stats.totalRevenuePaise, 'INR'), icon: <TrendingUp size={18} strokeWidth={1.5} />, note: 'Paid orders only' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: <ShoppingBag size={18} strokeWidth={1.5} />, note: `${stats.pendingOrders} active` },
    { label: 'Customers', value: stats.totalCustomers.toLocaleString(), icon: <Users size={18} strokeWidth={1.5} />, note: 'Registered accounts' },
    { label: 'Products', value: stats.totalProducts.toLocaleString(), icon: <Package size={18} strokeWidth={1.5} />, note: 'In catalogue' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--colour-espresso)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.875rem', opacity: 0.55, marginTop: '0.25rem' }}>
          Overview of store activity
        </p>
      </div>

      {/* Demo notice */}
      <div className="demo-notice" style={{ marginBottom: '2rem' }}>
        <AlertCircle size={15} />
        <span>
          Stats show live database data. Products remain in <strong>draft</strong> until reviewed
          and published via the Products page. All prices are demo placeholders — verify before publishing.
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'var(--colour-paper)',
              border: '1px solid var(--colour-border)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5 }}>
                {card.label}
              </span>
              <span style={{ color: 'var(--colour-cognac)', opacity: 0.7 }}>{card.icon}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.25rem' }}>
              {card.value}
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.45 }}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400 }}>
            Recent Orders
          </h2>
          <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.4 }}>
            <ShoppingBag size={32} strokeWidth={1} style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.875rem' }}>No orders yet. Connect Supabase and run migrations to see live data.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--colour-border)' }}>
                  {['Order #', 'Date', 'Status', 'Total'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5, fontFamily: 'var(--font-sans)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => {
                  const s = STATUS_STYLE[order.status] ?? { bg: '#f1f5f9', color: '#475569', label: order.status }
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--colour-border-light)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--colour-cognac)', textDecoration: 'none', fontWeight: 500 }}>
                          {order.order_number}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem', opacity: 0.6 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.125rem 0.625rem', background: s.bg, color: s.color, fontSize: '0.6875rem', letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase' }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>
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
  )
}
