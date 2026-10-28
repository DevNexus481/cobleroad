import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { ProductEditorClient } from './ProductEditorClient'

interface ProductEditPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createAdminClient()

  // Fetch product with variants and images
  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      id, slug, name, short_description, description, status, is_featured, is_demo, personalisation,
      product_variants (
        id, colour, colour_hex, sku, stock_quantity, personalisation_enabled, is_active, sort_order,
        product_prices (id, currency, amount_minor)
      ),
      product_images (
        id, url, alt, variant_id, is_primary, status, sort_order
      )
      `
    )
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const rawVariants = ((product as any).product_variants ?? []).map((v: any) => ({
    id: v.id,
    colour: v.colour,
    colour_hex: v.colour_hex,
    sku: v.sku,
    stock_quantity: v.stock_quantity,
    personalisation_enabled: v.personalisation_enabled ?? true,
    is_active: v.is_active ?? true,
    prices: (v.product_prices ?? []).map((pr: any) => ({
      currency: pr.currency,
      amount_minor: pr.amount_minor,
    })),
  }))

  const rawImages = ((product as any).product_images ?? []).map((img: any) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    variant_id: img.variant_id,
    is_primary: Boolean(img.is_primary),
    status: img.status || 'approved',
    sort_order: img.sort_order ?? 0,
  }))

  return (
    <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <ProductEditorClient
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          short_description: product.short_description,
          description: product.description,
          status: product.status as any,
          is_featured: product.is_featured,
          personalisation: product.personalisation,
        }}
        variants={rawVariants}
        images={rawImages}
      />
    </div>
  )
}
