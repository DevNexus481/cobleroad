import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewProductForm } from './NewProductForm'

export const metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            color: 'var(--colour-cognac)',
            textDecoration: 'none',
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400 }}>
          List New Product
        </h1>
        <p style={{ fontSize: '0.875rem', opacity: 0.55, marginTop: '0.25rem' }}>
          Create and publish a handcrafted leather piece to THE COBBLEROAD storefront.
        </p>
      </div>

      <NewProductForm collections={collections || []} />
    </div>
  )
}
