import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollectionWithProducts } from '@/lib/products/queries'
import { getProductsByCollection } from '@/lib/products/catalogue'
import { ArrowLeft } from 'lucide-react'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'

const COLLECTION_META: Record<string, { name: string; desc: string; image: string }> = {
  'work-bags': {
    name: 'Work Bags',
    desc: 'Structured leather bags designed for the modern professional.',
    image: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
  },
  'everyday-bags': {
    name: 'Everyday Bags',
    desc: 'Versatile leather companions for daily life.',
    image: '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
  },
  'travel-essentials': {
    name: 'Travel Essentials',
    desc: 'Travel with intention. Leather built for the journey.',
    image: '/images/products/real/weekender-duffle/weekender-duffle-11.png',
  },
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = COLLECTION_META[slug]
  const name = meta?.name ?? slug.replace(/-/g, ' ')
  return {
    title: `${name} — THE COBBLEROAD`,
    description: meta?.desc ?? `Shop ${name} at THE COBBLEROAD.`,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const { collection, products } = await getCollectionWithProducts(slug)
  const meta = COLLECTION_META[slug]

  const realCatalogueProducts = getProductsByCollection(slug)
  if (!collection && !meta && realCatalogueProducts.length === 0) notFound()

  const displayName = collection?.name ?? meta?.name ?? slug
  const displayDesc = collection?.description ?? meta?.desc ?? ''
  
  const demoFallbackProducts = realCatalogueProducts.map((p) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    short_description: p.shortDescription,
    is_featured: p.featured,
    is_demo: true,
    personalisable: p.personalisable,
    primary_image: { id: p.slug, url: p.primaryImage, alt: p.name },
    variants: p.variants.map((v, i) => ({
      id: `${p.slug}-${i}`,
      colour: v.colour,
      colour_hex: v.colourHex,
      image_url: v.imageUrl,
      stock_quantity: 10,
      prices: [{ id: `p-${p.slug}-${i}`, currency: 'INR', amount_minor: p.priceINR || 999900 }],
    })),
  }))

  const displayProducts = products.length > 0 ? products : demoFallbackProducts
  const isDemo = products.length === 0

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)' }}>
      <div style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '3rem 0 2rem' }}>
        <div className="container-site">
          <Link
            href="/collections"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', opacity: 0.55, marginBottom: '1rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={13} /> Collections
          </Link>
          <span className="section-label">Collection</span>
          <h1 className="section-title">{displayName}</h1>
          {displayDesc && (
            <p style={{ fontSize: '1rem', opacity: 0.65, marginTop: '0.75rem', maxWidth: '44ch', lineHeight: 1.65 }}>
              {displayDesc}
            </p>
          )}
        </div>
      </div>

      <div className="container-site section-padding">
        {isDemo && (
          <div className="demo-notice" style={{ marginBottom: '2rem' }}>
            <span>ℹ</span>
            <span><strong>Demo collection.</strong> Connect Supabase to display live products.</span>
          </div>
        )}

        {displayProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>No products in this collection yet.</p>
            <Link href="/shop" className="btn btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Browse All Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2.5rem 1.75rem' }}>
            {displayProducts.map((p: any) => (
              <ProductGridCard
                key={p.slug}
                id={p.id || p.slug}
                slug={p.slug}
                name={p.name}
                shortDescription={p.short_description || p.desc}
                isFeatured={Boolean(p.is_featured)}
                isDemo={Boolean(p.is_demo)}
                personalisable={Boolean(p.personalisation?.enabled || p.personalisable)}
                primaryImage={p.primary_image || { id: p.slug, url: p.image || '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png', alt: p.name }}
                variants={
                  p.variants && p.variants.length > 0
                    ? p.variants
                    : [
                        {
                          id: `${p.slug}-v1`,
                          colour: p.colour || 'Cognac',
                          colour_hex: '#9A633F',
                          image_url: p.primary_image?.url || p.image,
                          stock_quantity: 10,
                          prices: [{ id: 'p1', currency: 'INR', amount_minor: p.price || 1299900 }],
                        },
                      ]
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
