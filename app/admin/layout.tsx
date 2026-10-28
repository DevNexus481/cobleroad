import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, BarChart3, Tag } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
    { href: '/admin/products', label: 'Products', icon: <Package size={16} strokeWidth={1.5} /> },
    { href: '/admin/collections', label: 'Collections', icon: <Tag size={16} strokeWidth={1.5} /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={16} strokeWidth={1.5} /> },
    { href: '/admin/customers', label: 'Customers', icon: <Users size={16} strokeWidth={1.5} /> },
    { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={16} strokeWidth={1.5} /> },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--colour-ivory)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(247,244,238,0.08)', marginBottom: '0.5rem' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.125rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--colour-ivory)',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            Cobleroad
          </Link>
          <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--colour-cognac-light)', fontWeight: 600 }}>
            Admin
          </span>
        </div>

        <nav aria-label="Admin menu">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="admin-sidebar-link">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem 1.5rem', borderTop: '1px solid rgba(247,244,238,0.08)' }}>
          <Link href="/" style={{ fontSize: '0.75rem', color: 'rgba(247,244,238,0.4)', textDecoration: 'none', transition: 'color 0.15s', display: 'block' }}>
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
