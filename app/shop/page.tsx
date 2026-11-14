
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedProducts } from '@/lib/products/queries'
import type { CurrencyCode } from '@/types'
import { Search, Package } from 'lucide-react'
import { ShopFilterControls } from '@/components/storefront/ShopFilterControls'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'
import { REAL_PRODUCTS } from '@/lib/products/catalogue'
import { getContextRecommendationChips, findCategoryNode } from '@/lib/navigation/taxonomy'

export const metadata: Metadata = {
  title: 'Shop All Leather Bags & Accessories',
  description:
    'Browse the full THE COBBLEROAD collection of premium genuine leather bags, briefcases, totes, backpacks, wallets, and small leather goods.',
}

interface ShopPageProps {
  searchParams: Promise<{
    q?: string
    collection?: string
    category?: string
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

// Demo fallback — all real products from BAG AND LUGGAGE catalogue
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
  collections: p.collections,
}))

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const categoryFilter = params.category ?? ''
  const query = params.q ?? ''
  const collectionFilter = params.collection ?? ''
  const sortBy = (params.sort as 'featured' | 'newest' | 'price_asc' | 'price_desc') ?? 'featured'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const limit = 12
  const offset = (page - 1) * limit

  // Context-aware recommendation chips & taxonomy lookup
  const { parentTitle, currentTitle, chips } = getContextRecommendationChips(categoryFilter)
  const categoryNode = findCategoryNode(categoryFilter)
  const activeKeywords = categoryNode.current?.keywords ?? categoryNode.parent?.keywords ?? []

  const isAeiou =
    categoryFilter === 'aeiou' ||
    categoryFilter === 'bad-boy-accessories' ||
    categoryFilter === 'joint-case-tan' ||
    categoryNode.parent?.slug === 'aeiou' ||
    collectionFilter === 'aeiou'

  // Effective search query for database lookup
  const dbSearchQuery = query || (activeKeywords[0] ?? undefined)

  const { products, total, error } = await getPublishedProducts({
    search: dbSearchQuery,
    collectionSlug: collectionFilter || undefined,
    sortBy,
    currency: 'INR',
    limit,
    offset,
  })

  const isConfigured = error !== 'supabase_not_configured'

  // Filter demo fallback if active
  let filteredDemo = DEMO_PRODUCTS
  if (isAeiou) {
    // AEIOU section: nocturnal artifacts showcase message
    filteredDemo = []
  } else if (categoryFilter || collectionFilter) {
    const targetFilter = (categoryFilter || collectionFilter).toLowerCase()
    const kws = activeKeywords.map((k) => k.toLowerCase())
    const matches = DEMO_PRODUCTS.filter((p) => {
      // 1. Direct collection / category slug match
      if (p.collections && p.collections.some((c) => c.toLowerCase() === targetFilter)) {
        return true
      }
      // 2. Keyword fallback match
      if (kws.length > 0) {
        const target = `${p.slug} ${p.name} ${p.desc}`.toLowerCase()
        return kws.some((kw) => target.includes(kw))
      }
      return false
    })
    filteredDemo = matches
  }

  if (query) {
    const qLower = query.toLowerCase()
    filteredDemo = filteredDemo.filter((p) =>
      `${p.slug} ${p.name} ${p.desc}`.toLowerCase().includes(qLower)
    )
  }

  const rawProducts = isConfigured && products.length > 0 ? products : filteredDemo.map((p, idx) => ({
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

  const displayProducts = rawProducts
  const totalPages = Math.ceil((isConfigured && products.length > 0 ? total : filteredDemo.length) / limit)

  return (
    <div
      className={isAeiou ? 'theme-aeiou-gothic' : undefined}
      style={{
        backgroundColor: isAeiou ? '#0c0a09' : 'var(--colour-paper)',
        minHeight: '70vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Page header */}
      {isAeiou ? (
        <div className="aeiou-hero-banner">
          <div className="aeiou-hero-banner__bg" />
          
          {/* Devil's Trap Occult Pentagram Watermark SVG */}
          <svg
            className="aeiou-hero-sigil-watermark"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer rings */}
            <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="88" />
            <circle cx="100" cy="100" r="80" strokeWidth="0.8" />
            
            {/* 5-pointed Devil's Trap Pentagram */}
            <polygon
              points="100,20 148,168 22,76 178,76 52,168"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            
            {/* Inner warding circle */}
            <circle cx="100" cy="100" r="32" strokeWidth="1" />
            <circle cx="100" cy="100" r="6" fill="currentColor" opacity="0.6" />
            
            {/* Cardinal sigil glyph marks */}
            <path d="M100 8 L100 16 M100 184 L100 192 M8 100 L16 100 M184 100 L192 100" strokeWidth="1.5" />
            <path d="M35 35 L42 42 M158 158 L165 165 M165 35 L158 42 M35 165 L42 158" strokeWidth="1.2" />
          </svg>

          <div className="container-site" style={{ position: 'relative', zIndex: 2 }}>
            <span
              className="section-label"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--aeiou-gold)',
                letterSpacing: '0.2em',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              <span>✦</span>
              <span>SUPERNATURAL ATELIER · WARDING DIVISION</span>
              <span>✦</span>
            </span>

            <h1
              className="section-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
                lineHeight: 1.1,
              }}
            >
              {currentTitle === 'AEIOU' ? '✦ A · E · I · O · U ✦' : currentTitle}
            </h1>

            <p
              style={{
                maxWidth: '42rem',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: '#d6cfc2',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                marginBottom: '1.25rem',
              }}
            >
              &ldquo;Non Timebo Mala&rdquo; — Artifacts forged for the rogue, the nocturnal, and those who carry the weight of the hunt.
            </p>

            <div className="aeiou-hunter-tribute">
              <span style={{ color: '#821818' }}>⛤</span>
              <span>DEAN WINCHESTER SPEC · [ SW · DW · CAS ]</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ color: 'var(--aeiou-gold)' }}>ANTIQUE HARNESS & OBSIDIAN HIDE</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--colour-parchment)',
            borderBottom: '1px solid var(--colour-border)',
            padding: '3.5rem 0 2.5rem',
          }}
        >
          <div className="container-site">
            <span className="section-label">
              {parentTitle !== currentTitle ? `${parentTitle} · Category` : categoryFilter ? 'Curated Collection' : 'All Handcrafted Pieces'}
            </span>
            <h1 className="section-title">
              {currentTitle}
            </h1>
          </div>
        </div>
      )}

      <div className="container-site" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        {/* Luxury Filters & Search bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: isAeiou ? '1px solid rgba(197, 160, 89, 0.25)' : '1px solid var(--colour-border)',
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
                    color: isAeiou ? 'var(--aeiou-gold)' : 'var(--colour-charcoal)',
                    opacity: 0.6,
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="shop-search"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder={
                    isAeiou
                      ? 'Search occult artifacts, tubes, EDC, flasks...'
                      : 'Search full-grain leather pieces...'
                  }
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', height: '2.5rem', fontSize: '0.8125rem' }}
                />
                {categoryFilter && (
                  <input type="hidden" name="category" value={categoryFilter} />
                )}
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
              {isConfigured && products.length > 0
                ? `${total} piece${total !== 1 ? 's' : ''}`
                : `${displayProducts.length} piece${displayProducts.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Bottom Row: Context-Aware Recommendation Chips & Custom Sort Dropdown */}
          <ShopFilterControls
            chips={chips}
            sortOptions={SORT_OPTIONS}
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
          categoryFilter ? (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1.5rem',
                maxWidth: '40rem',
                margin: '0 auto',
                backgroundColor: isAeiou ? '#14110f' : 'var(--colour-parchment)',
                border: isAeiou ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid var(--colour-border)',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  margin: '0 auto 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isAeiou ? '#1a1614' : 'var(--colour-paper)',
                  color: isAeiou ? 'var(--aeiou-gold)' : 'var(--colour-cognac)',
                  border: isAeiou ? '1px solid rgba(197, 160, 89, 0.3)' : undefined,
                }}
              >
                <Package size={22} strokeWidth={1.5} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  marginBottom: '0.75rem',
                  color: isAeiou ? 'var(--aeiou-gold)' : 'var(--colour-espresso)',
                }}
              >
                {currentTitle}
              </h2>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: isAeiou ? '#cfc8bd' : 'var(--colour-charcoal)',
                  opacity: 0.85,
                  lineHeight: 1.75,
                  marginBottom: '2rem',
                }}
              >
                {isAeiou
                  ? 'Nocturnal artifacts in this supernatural collection are currently being handcrafted in our New Delhi darkroom. Contact our concierge to reserve allocations or commission custom engraved sigils.'
                  : 'Pieces in this curated category are currently being handcrafted in our New Delhi atelier. Connect with our concierge specialist to register your interest, reserve early allocations, or commission a custom bespoke piece.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-primary">
                  Inquire with Concierge
                </Link>
                <Link href="/shop" className="btn btn-secondary">
                  View Full Catalogue
                </Link>
              </div>
            </div>
          ) : (
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
          )
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
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '4rem',
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page
              const qs = new URLSearchParams()
              if (query) qs.set('q', query)
              if (categoryFilter) qs.set('category', categoryFilter)
              if (sortBy !== 'featured') qs.set('sort', sortBy)
              qs.set('page', String(p))

              return (
                <Link
                  key={p}
                  href={`/shop?${qs.toString()}`}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: isCurrent ? 'var(--colour-espresso)' : 'var(--colour-border)',
                    backgroundColor: isCurrent ? 'var(--colour-espresso)' : 'var(--colour-paper)',
                    color: isCurrent ? 'var(--colour-ivory)' : 'var(--colour-espresso)',
                    fontWeight: isCurrent ? 600 : 400,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
