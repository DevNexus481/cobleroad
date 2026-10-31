import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedProducts, getCollections } from '@/lib/products/queries'
import { formatAmount } from '@/lib/currency'
import type { CurrencyCode } from '@/types'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { ShopFilterControls } from '@/components/storefront/ShopFilterControls'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'
import { REAL_PRODUCTS } from '@/lib/products/catalogue'

export const metadata: Metadata = {
  title: 'Shop All Leather Bags & Accessories',
  description:
    'Browse the full Cobleroad collection of premium genuine leather bags, briefcases, totes, backpacks, wallets, and small leather goods.',
}

interface ShopPageProps {
  searchParams: Promise<{
    q?: string
    collection?: string
    sort?: string
    page?: string
  }>
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

// Demo fallback — all 14 real products from BAG AND LUGGAGE catalogue
const DEMO_PRODUCTS = REAL_PRODUCTS.map((p) => ({
  slug: p.slug,
  name: p.name,
  desc: p.shortDescription,
  price: p.priceINR,
  image: p.primaryImage,
  personalisable: p.personalisable,
  colours: p.variants.map((v) => v.colour),
  colourHexes: p.variants.map((v) => v.colourHex),
  variantImages: p.variants.map((v) => v.imageUrl),
}))

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  const collectionFilter = params.collection ?? ''
  const sortBy = (params.sort as 'featured' | 'newest' | 'price_asc' | 'price_desc') ?? 'featured'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const limit = 12
  const offset = (page - 1) * limit

  const { products, total, error } = await getPublishedProducts({
    search: query || undefined,
    collectionSlug: collectionFilter || undefined,
    sortBy,
    currency: 'INR',
    limit,
    offset,
  })

  const collections = await getCollections()
  const isConfigured = error !== 'supabase_not_configured'
  const displayProducts = isConfigured && products.length > 0 ? products : DEMO_PRODUCTS.map((p, idx) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    short_description: p.desc,
    status: 'published' as const,
    is_featured: idx < 6,
    is_demo: false,
    personalisation: p.personalisable ? { enabled: true, label: 'Add initials', max_chars: 3, allowed_pattern: null, styles: [] } : null,
    primary_image: { id: p.slug, product_id: p.slug, url: p.image, alt: p.name, sort_order: 0, created_at: '' },
    variants: p.colours.map((col, vi) => ({
      id: `${p.slug}-${vi}`,
      colour: col,
      colour_hex: p.colourHexes?.[vi] ?? null,
      image_url: p.variantImages?.[vi] ?? p.image,
      stock_quantity: 10,
      prices: [{ id: `${p.slug}-${vi}-inr`, product_id: p.slug, variant_id: `${p.slug}-${vi}`, currency: 'INR' as CurrencyCode, amount_minor: p.price, created_at: '' }],
    })),
  }))

  const totalPages = Math.ceil((isConfigured ? total : DEMO_PRODUCTS.length) / limit)

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '70vh' }}>
      {/* Page header */}
      <div
        style={{
          backgroundColor: 'var(--colour-parchment)',
          borderBottom: '1px solid var(--colour-border)',
          padding: '3.5rem 0 2.5rem',
        }}
      >
        <div className="container-site">
          <span className="section-label">All Handcrafted Pieces</span>
          <h1 className="section-title">The Collection</h1>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        {/* Luxury Filters & Search bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--colour-border)',
          }}
        >
          {/* Top Row: Search and Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <form method="GET" style={{ display: 'flex', gap: 0, flex: '1 1 240px', maxWidth: '24rem' }}>
              <label htmlFor="shop-search" className="sr-only">Search products</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--colour-charcoal)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="shop-search"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="Search full-grain leather pieces..."
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', height: '2.5rem', fontSize: '0.8125rem' }}
                />
              </div>
            </form>

            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--colour-charcoal)',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              {isConfigured
                ? `${total} piece${total !== 1 ? 's' : ''}`
                : `${DEMO_PRODUCTS.length} pieces (demo)`}
            </span>
          </div>

          {/* Bottom Row: Minimalist Collection Chips & Custom Sort Dropdown */}
          <ShopFilterControls
            collections={collections}
            sortOptions={SORT_OPTIONS}
            currentCollection={collectionFilter}
            currentSort={sortBy}
            currentQuery={query}
          />
        </div>

        {/* Demo notice */}
        {!isConfigured && (
          <div className="demo-notice" style={{ marginBottom: '2rem' }}>
            <span>ℹ</span>
            <span>
              <strong>Supabase not configured.</strong> Showing demo catalogue. Connect Supabase
              and run migrations to display live products.
            </span>
          </div>
        )}

        {/* Product grid */}
        {displayProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '6rem 0',
              color: 'var(--colour-charcoal)',
              opacity: 0.6,
            }}
          >
            <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
              No products found
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              {query ? `No results for "${query}"` : 'This collection is currently empty.'}
            </p>
            <Link href="/shop" className="btn btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              Clear filters
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2.5rem 1.75rem',
            }}
          >
            {displayProducts.map((product) => {
              const primaryImage = product.primary_image

              return (
                <ProductGridCard
                  key={product.slug}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  shortDescription={product.short_description}
                  isFeatured={product.is_featured}
                  isDemo={product.is_demo}
                  personalisable={Boolean(product.personalisation?.enabled)}
                  primaryImage={primaryImage}
                  variants={product.variants as any}
                />
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {isConfigured && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '3rem',
            }}
          >
            {page > 1 && (
              <Link
                href={`/shop?q=${query}&collection=${collectionFilter}&sort=${sortBy}&page=${page - 1}`}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </Link>
            )}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                fontSize: '0.8125rem',
                opacity: 0.6,
              }}
            >
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/shop?q=${query}&collection=${collectionFilter}&sort=${sortBy}&page=${page + 1}`}
                className="btn btn-secondary btn-sm"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
