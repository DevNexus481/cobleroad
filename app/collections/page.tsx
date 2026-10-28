import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getCollections } from '@/lib/products/queries'

export const metadata: Metadata = {
  title: 'Collections — Leather Bags & Accessories',
  description: 'Browse Cobleroad collections: Work Bags, Everyday Bags, Travel Essentials, and Small Leather Goods.',
}

const FALLBACK_COLLECTIONS = [
  { slug: 'work-bags', name: 'Work Bags', description: 'Structured leather for the considered professional.', image: '/images/products/laptop-bag.jpg' },
  { slug: 'everyday-bags', name: 'Everyday Bags', description: 'Versatile companions for daily life.', image: '/images/products/tote-espresso.jpg' },
  { slug: 'travel-essentials', name: 'Travel Essentials', description: 'Travel with intention. Leather built for the journey.', image: '/images/products/duffle-travel.jpg' },
  { slug: 'small-leather-goods', name: 'Small Leather Goods', description: 'The finer details, carried with care.', image: '/images/products/cardholder.jpg' },
]

export default async function CollectionsPage() {
  const collections = await getCollections()
  const displayCollections = collections.length > 0 ? collections : FALLBACK_COLLECTIONS

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '3rem 0 2rem' }}>
        <div className="container-site">
          <span className="section-label">Collections</span>
          <h1 className="section-title">Shop by Collection</h1>
        </div>
      </div>

      <div className="container-site section-padding">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {displayCollections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'var(--colour-espresso)',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: 'var(--colour-parchment)', marginBottom: '1rem' }}>
                {(col as any).image_url || (col as any).image ? (
                  <Image
                    src={(col as any).image_url ?? (col as any).image}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--colour-parchment)' }} />
                )}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.375rem' }}>
                {col.name}
              </h2>
              {col.description && (
                <p style={{ fontSize: '0.875rem', opacity: 0.65, lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {col.description}
                </p>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--colour-cognac)' }}>
                Shop Collection <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
