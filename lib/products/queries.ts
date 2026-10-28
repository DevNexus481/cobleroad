// =============================================================================
// COBLEROAD — Product Queries (Server-side)
// All queries use the server Supabase client and respect RLS.
// =============================================================================

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ProductCard, Product, Collection, CurrencyCode } from '@/types'

/**
 * Fetch all published products for the shop page.
 * Returns only published products (RLS enforced at DB level too).
 */
export async function getPublishedProducts({
  collectionSlug,
  search,
  sortBy = 'featured',
  currency = 'INR',
  limit = 24,
  offset = 0,
}: {
  collectionSlug?: string
  search?: string
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc'
  currency?: CurrencyCode
  limit?: number
  offset?: number
}): Promise<{ products: ProductCard[]; total: number; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { products: [], total: 0, error: 'supabase_not_configured' }
  }

  const supabase = await createClient()

  try {
    let query = supabase
      .from('products')
      .select(
        `
        id, slug, name, short_description, status, is_featured, is_demo, personalisation,
        product_images (id, product_id, variant_id, url, alt, sort_order, is_primary, status),
        product_variants (
          id, colour, colour_hex, stock_quantity, is_active, sort_order, personalisation_enabled,
          product_prices (id, currency, amount_minor)
        ),
        product_collections!inner (
          collections (id, slug, name)
        )
        `,
        { count: 'exact' }
      )
      .eq('status', 'published')

    // Search
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Collection filter
    if (collectionSlug) {
      query = query.eq('product_collections.collections.slug', collectionSlug)
    }

    // Sorting
    switch (sortBy) {
      case 'featured':
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'price_asc':
      case 'price_desc':
        // Price sorting is done post-query since prices are in a nested table
        query = query.order('created_at', { ascending: false })
        break
    }

    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('[getPublishedProducts]', error)
      return { products: [], total: 0, error: error.message }
    }

    // Map to ProductCard shape
    const products: ProductCard[] = (data ?? []).map((p: any) => {
      const allImages = (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      const primaryImage = allImages.find((img: any) => img.is_primary) ?? allImages[0] ?? null

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        short_description: p.short_description,
        status: p.status,
        is_featured: p.is_featured,
        is_demo: p.is_demo,
        personalisation: p.personalisation,
        primary_image: primaryImage,
        variants: (p.product_variants ?? [])
          .filter((v: any) => v.is_active !== false)
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((v: any) => {
            const variantImg = allImages.find((img: any) => img.variant_id === v.id)
            return {
              id: v.id,
              colour: v.colour,
              colour_hex: v.colour_hex,
              stock_quantity: v.stock_quantity,
              prices: (v.product_prices ?? []).filter((pr: any) => pr.currency === currency),
              image_url: variantImg?.url ?? primaryImage?.url ?? null,
            }
          }),
      }
    })

    // Price sorting post-query
    if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      products.sort((a, b) => {
        const aPrice = a.variants[0]?.prices[0]?.amount_minor ?? 0
        const bPrice = b.variants[0]?.prices[0]?.amount_minor ?? 0
        return sortBy === 'price_asc' ? aPrice - bPrice : bPrice - aPrice
      })
    }

    return { products, total: count ?? 0, error: null }
  } catch (err) {
    console.error('[getPublishedProducts] unexpected', err)
    return { products: [], total: 0, error: 'Unexpected error' }
  }
}

/**
 * Fetch a single published product by slug.
 * Returns null if not found or not published.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id, slug, name, description, short_description, status, is_featured, is_demo,
      personalisation, seo_title, seo_description, weight_grams, dimensions_cm,
      material_description, care_instructions, created_at, updated_at,
      product_images (id, product_id, variant_id, url, alt, sort_order, is_primary, status, created_at),
      product_variants (
        id, product_id, sku, colour, colour_hex, size, stock_quantity, allow_backorder, is_active, sort_order, personalisation_enabled, created_at, updated_at,
        product_prices (id, product_id, variant_id, currency, amount_minor, created_at)
      ),
      product_collections (
        collections (id, slug, name, description, image_url, sort_order, created_at)
      )
      `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null

  const allImages = (data.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)

  return {
    ...data,
    images: allImages,
    variants: (data.product_variants ?? [])
      .filter((v: any) => v.is_active !== false)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((v: any) => ({
        ...v,
        prices: v.product_prices ?? [],
        images: allImages.filter((img: any) => img.variant_id === v.id),
      })),
    collections: (data.product_collections ?? []).map((pc: any) => pc.collections),
  } as unknown as Product
}

/**
 * Fetch all collections.
 */
export async function getCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createClient()

  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')

  return (data ?? []) as Collection[]
}

/**
 * Fetch a collection by slug with its published products.
 */
export async function getCollectionWithProducts(slug: string, currency: CurrencyCode = 'INR') {
  if (!isSupabaseConfigured()) {
    return { collection: null, products: [] }
  }

  const supabase = await createClient()

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!collection) return { collection: null, products: [] }

  const { products } = await getPublishedProducts({ collectionSlug: slug, currency })

  return { collection: collection as Collection, products }
}

/**
 * Server-side price validation before checkout.
 * Returns the server-verified price for a variant+currency combination.
 * Never trusts client-supplied prices.
 */
export async function verifyProductPrice(
  variantId: string,
  currency: CurrencyCode
): Promise<{ amountMinor: number; productId: string } | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('product_prices')
    .select('amount_minor, product_id, product_variants!inner(product_id, products!inner(status))')
    .eq('variant_id', variantId)
    .eq('currency', currency)
    .single()

  if (!data) return null

  // Validate product is still published
  const productStatus = (data as any).product_variants?.products?.status
  if (productStatus !== 'published') return null

  return { amountMinor: data.amount_minor, productId: data.product_id }
}

/**
 * Server-side stock check.
 * Returns current stock for a variant. Never trusts client stock values.
 */
export async function getVariantStock(variantId: string): Promise<number | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('product_variants')
    .select('stock_quantity, allow_backorder')
    .eq('id', variantId)
    .single()

  if (!data) return null
  return data.stock_quantity
}
