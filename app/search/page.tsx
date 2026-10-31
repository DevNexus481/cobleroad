import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedProducts } from '@/lib/products/queries'
import { REAL_PRODUCTS } from '@/lib/products/catalogue'
import { formatAmount } from '@/lib/currency'
import { Search as SearchIcon, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Search Catalogue — Cobleroad',
  description: 'Search handcrafted genuine leather bags, folios, travel essentials, and accessories.',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

const POPULAR_SEARCHES = [
  'Laptop Bag',
  'Laptop Sleeve',
  'Backpack',
  'Duffle',
  'Gym Bag',
  'Rucksack',
  'Tote',
  'Fanny Bag',
]

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = (params.q ?? '').trim()

  const { products, total } = await getPublishedProducts({
    search: query || undefined,
    currency: 'INR',
    limit: 24,
  })

  let displayProducts = products
  if (displayProducts.length === 0) {
    const qLower = query.toLowerCase()
    const matches = REAL_PRODUCTS.filter((p) =>
      !query ||
      p.name.toLowerCase().includes(qLower) ||
      p.shortDescription.toLowerCase().includes(qLower) ||
      p.description.toLowerCase().includes(qLower) ||
      p.material.toLowerCase().includes(qLower) ||
      p.collections.some((c) => c.toLowerCase().includes(qLower))
    )

    displayProducts = matches.map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      short_description: p.shortDescription,
      status: 'published' as const,
      is_featured: p.featured,
      is_demo: true,
      personalisation: p.personalisable
        ? {
            enabled: true,
            label: 'Complimentary Monogram',
            max_chars: 3,
            allowed_pattern: '^[A-Z]{1,3}$',
          }
        : null,
      primary_image: {
        id: `img-${p.slug}`,
        product_id: p.slug,
        variant_id: null,
        url: p.primaryImage,
        alt: p.name,
        sort_order: 1,
        is_primary: true,
        status: 'approved' as const,
        created_at: new Date().toISOString(),
      },
      variants: p.variants.map((v, i) => ({
        id: `${p.slug}-${i}`,
        colour: v.colour,
        colour_hex: v.colourHex,
        image_url: v.imageUrl,
        stock_quantity: 10,
        prices: [
          {
            id: `pr-${p.slug}-${i}`,
            product_id: p.slug,
            variant_id: `${p.slug}-${i}`,
            currency: 'INR' as const,
            amount_minor: p.priceINR || 999900,
            created_at: new Date().toISOString(),
          },
        ],
      })),
    }))
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', minHeight: '80vh' }}>
      {/* Search Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '4rem 0 3rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Catalogue Search</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '1.75rem' }}>
            Find Your Companion
          </h1>

          {/* Search Form */}
          <form action="/search" method="GET" style={{ position: 'relative', maxWidth: '36rem', margin: '0 auto 1.5rem' }}>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by product, material, or style..."
              className="input-field"
              style={{
                width: '100%',
                padding: '0.875rem 3rem 0.875rem 1.25rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                borderRadius: '2px',
                boxShadow: 'var(--shadow-sm)',
              }}
              autoFocus
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--colour-cognac)',
                padding: '0.375rem',
              }}
            >
              <SearchIcon size={20} strokeWidth={1.5} />
            </button>
          </form>

          {/* Quick Suggestions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  backgroundColor: query.toLowerCase() === term.toLowerCase() ? 'var(--colour-espresso)' : 'var(--colour-paper)',
                  color: query.toLowerCase() === term.toLowerCase() ? 'var(--colour-ivory)' : 'var(--colour-espresso)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-site section-padding">
        {query ? (
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)' }}>
              Showing {displayProducts.length} {displayProducts.length === 1 ? 'result' : 'results'} for &ldquo;<strong>{query}</strong>&rdquo;
            </p>
            <Link href="/shop" style={{ fontSize: '0.8125rem', color: 'var(--colour-cognac)', textDecoration: 'underline' }}>
              View full catalogue
            </Link>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400 }}>Featured in the Workshop</h2>
          </div>
        )}

        {displayProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2.5rem' }}>
            {displayProducts.map((product) => {
              const firstVariant = product.variants[0]
              const price = firstVariant?.prices[0]
              const image = product.primary_image

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: 'var(--colour-parchment)', overflow: 'hidden', marginBottom: '1rem', borderRadius: '2px' }}>
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--colour-parchment)' }} />
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.25rem' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--colour-charcoal)', opacity: 0.7, marginBottom: '0.5rem', lineHeight: 1.5, flexGrow: 1 }}>
                    {product.short_description}
                  </p>
                  <div>
                    {price ? (
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                        {formatAmount(price.amount_minor, price.currency)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8125rem', opacity: 0.5 }}>View details</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '30rem', margin: '0 auto' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--colour-parchment)', color: 'var(--colour-cognac)' }}>
              <SearchIcon size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.75rem' }}>
              No matching pieces found
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8, marginBottom: '2rem' }}>
              We could not find any items matching &ldquo;{query}&rdquo;. Try searching for a broader term like &ldquo;bag&rdquo;, &ldquo;leather&rdquo;, or &ldquo;briefcase&rdquo;.
            </p>
            <Link href="/shop" className="btn btn-secondary">
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
