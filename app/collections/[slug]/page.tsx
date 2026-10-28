import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCollectionWithProducts } from '@/lib/products/queries'
import { ArrowLeft } from 'lucide-react'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'

const DEMO_COLLECTIONS: Record<string, { name: string; desc: string; image: string; products: any[] }> = {
  'work-bags': {
    name: 'Work Bags',
    desc: 'Structured leather bags designed for the modern professional.',
    image: '/images/products/laptop-bag.jpg',
    products: [
      { slug: 'advocate-briefcase', name: 'The Advocate Briefcase', price: 1299900, image: '/images/hero/hero-briefcase.jpg', personalisable: true },
      { slug: 'meridian-laptop-bag', name: 'The Meridian Laptop Bag', price: 1099900, image: '/images/products/laptop-bag.jpg', personalisable: false },
      { slug: 'telegraph-messenger', name: 'The Telegraph Messenger', price: 799900, image: '/images/products/messenger-cognac.jpg', personalisable: true },
    ],
  },
  'everyday-bags': {
    name: 'Everyday Bags',
    desc: 'Versatile leather companions for daily life.',
    image: '/images/products/tote-espresso.jpg',
    products: [
      { slug: 'marlow-tote', name: 'The Marlow Tote', price: 899900, image: '/images/products/tote-espresso.jpg', personalisable: false },
      { slug: 'crossroads-crossbody', name: 'The Crossroads Crossbody', price: 699900, image: '/images/products/messenger-cognac.jpg', personalisable: true },
      { slug: 'fielder-backpack', name: 'The Fielder Backpack', price: 1199900, image: '/images/products/backpack-tan.jpg', personalisable: false },
    ],
  },
  'travel-essentials': {
    name: 'Travel Essentials',
    desc: 'Travel with intention. Leather built for the journey.',
    image: '/images/products/duffle-travel.jpg',
    products: [
      { slug: 'meridian-duffle', name: 'The Meridian Duffle', price: 1599900, image: '/images/products/duffle-travel.jpg', personalisable: false },
      { slug: 'atlas-weekender', name: 'The Atlas Weekender', price: 1399900, image: '/images/products/weekender.jpg', personalisable: false },
      { slug: 'transit-passport-wallet', name: 'The Transit Passport Wallet', price: 299900, image: '/images/products/passport-holder.jpg', personalisable: true },
    ],
  },
  'small-leather-goods': {
    name: 'Small Leather Goods',
    desc: 'Refined accessories for the essentials.',
    image: '/images/products/cardholder.jpg',
    products: [
      { slug: 'folding-wallet-slim', name: 'The Folding Wallet', price: 249900, image: '/images/products/wallet-slim.jpg', personalisable: true },
      { slug: 'card-sleeve', name: 'The Card Sleeve', price: 149900, image: '/images/products/cardholder.jpg', personalisable: true },
      { slug: 'transit-passport-wallet', name: 'The Transit Passport Wallet', price: 299900, image: '/images/products/passport-holder.jpg', personalisable: true },
    ],
  },
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const demo = DEMO_COLLECTIONS[slug]
  const name = demo?.name ?? slug.replace(/-/g, ' ')
  return {
    title: `${name} — Cobleroad`,
    description: demo?.desc ?? `Shop ${name} at Cobleroad.`,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const { collection, products } = await getCollectionWithProducts(slug)
  const demo = DEMO_COLLECTIONS[slug]

  if (!collection && !demo) notFound()

  const displayName = collection?.name ?? demo?.name ?? slug
  const displayDesc = collection?.description ?? demo?.desc ?? ''
  const displayProducts = products.length > 0 ? products : (demo?.products ?? [])
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
                primaryImage={p.primary_image || { id: p.slug, url: p.image || '/images/hero/hero-briefcase.jpg', alt: p.name }}
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
