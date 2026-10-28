import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, AlertCircle, Sparkles } from 'lucide-react'
import { ProductsTable } from './ProductsTable'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, slug, name, status, is_featured, is_demo, created_at,
      product_variants (id, stock_quantity),
      product_prices (id, currency, amount_minor)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400 }}>
            Manage Store Pieces
          </h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.25rem' }}>
            List new handcrafted goods, update stock, or toggle pieces on/off the website.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn btn-primary btn-sm"
          id="admin-new-product-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
        >
          <Plus size={16} /> + Add New Piece
        </Link>
      </div>

      {/* Helpful client guide banner */}
      <div
        style={{
          background: 'var(--colour-parchment)',
          border: '1px solid var(--colour-border)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--colour-cognac)', flexShrink: 0 }} />
        <span>
          <strong>Quick Store Guide:</strong> Click <strong>&quot;Live on Store&quot;</strong> to temporarily hide any piece without deleting it. Click <strong>&quot;Remove&quot;</strong> if you want to permanently take it down.
        </span>
      </div>

      {error && (
        <div className="demo-notice" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={15} />
          <span>Could not load products. Ensure Supabase is connected.</span>
        </div>
      )}

      {!error && (!products || products.length === 0) && (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5, border: '1px solid var(--colour-border)', background: 'var(--colour-paper)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products listed yet.</p>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            List your first piece
          </Link>
        </div>
      )}

      {products && products.length > 0 && (
        <ProductsTable initialProducts={products as any} />
      )}
    </div>
  )
}
