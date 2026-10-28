import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Scissors, Package, Leaf } from 'lucide-react'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'
import { getPublishedProducts } from '@/lib/products/queries'

export const metadata: Metadata = {
  title: 'Cobleroad — Premium Genuine Leather Bags & Accessories',
  description:
    'Discover Cobleroad — genuine leather bags, briefcases, totes, backpacks, and small leather goods for India and beyond. Built to carry a lifetime.',
}


// =============================================================================
// Featured Collections (matches seed data)
// =============================================================================
const FEATURED_COLLECTIONS = [
  {
    slug: 'work-bags',
    name: 'Work Bags',
    desc: 'Structured leather for the considered professional.',
    image: '/images/products/laptop-bag.jpg',
  },
  {
    slug: 'everyday-bags',
    name: 'Everyday Bags',
    desc: 'Versatile companions for daily life and beyond.',
    image: '/images/products/tote-espresso.jpg',
  },
  {
    slug: 'travel-essentials',
    name: 'Travel Essentials',
    desc: 'Travel with intention. Leather built for the journey.',
    image: '/images/products/duffle-travel.jpg',
  },
  {
    slug: 'small-leather-goods',
    name: 'Small Leather Goods',
    desc: 'The finer details, carried with care.',
    image: '/images/products/wallet-slim.jpg',
  },
]

// =============================================================================
// Craft pillars (no unverified claims)
// =============================================================================
const CRAFT_PILLARS = [
  {
    icon: <Scissors size={20} strokeWidth={1.5} />,
    title: 'Considered Design',
    body: 'Every pocket, strap, and closure is placed with purpose. Nothing superfluous.',
  },
  {
    icon: <Package size={20} strokeWidth={1.5} />,
    title: 'Genuine Leather',
    body: 'We use genuine leather throughout. Material descriptions and grades are provided only when verified.',
  },
  {
    icon: <Leaf size={20} strokeWidth={1.5} />,
    title: 'Built to Last',
    body: 'Good leather is designed to improve with use. Each Cobleroad piece is built to accompany you for years.',
  },
]

export default async function HomePage() {
  const { products: liveProducts } = await getPublishedProducts({ limit: 4 })
  const hasLive = liveProducts && liveProducts.length > 0

  const featuredItems = hasLive
    ? liveProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        desc: p.short_description,
        isNew: p.is_featured,
        isDemo: Boolean(p.is_demo),
        personalisable: Boolean(p.personalisation?.enabled),
        primaryImage: p.primary_image || { id: p.id, url: '/images/hero/hero-briefcase.jpg', alt: p.name },
        variants: p.variants as any,
      }))
    : [
        {
          id: 'advocate-briefcase',
          slug: 'advocate-briefcase',
          name: 'The Advocate Briefcase',
          desc: 'Dual-buckle closure, removable strap.',
          isNew: true,
          isDemo: true,
          personalisable: true,
          primaryImage: { id: 'adv-img', url: '/images/hero/hero-briefcase.jpg', alt: 'The Advocate Briefcase' },
          variants: [
            { id: 'adv-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/hero/hero-briefcase.jpg', stock_quantity: 12, prices: [{ id: 'p1', currency: 'INR' as const, amount_minor: 1299900 }] },
            { id: 'adv-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/advocate-briefcase-espresso-front.webp', stock_quantity: 8, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1299900 }] },
            { id: 'adv-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/advocate-briefcase-black-front.webp', stock_quantity: 10, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1299900 }] },
            { id: 'adv-tan', colour: 'Tan', colour_hex: '#B5784E', image_url: '/images/products/variants/advocate-briefcase-tan-front.webp', stock_quantity: 6, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1299900 }] },
          ],
        },
        {
          id: 'fielder-backpack',
          slug: 'fielder-backpack',
          name: 'The Fielder Backpack',
          desc: 'Structured leather, padded laptop sleeve.',
          isNew: true,
          isDemo: true,
          personalisable: true,
          primaryImage: { id: 'fie-img', url: '/images/products/backpack-tan.jpg', alt: 'The Fielder Backpack' },
          variants: [
            { id: 'fie-tan', colour: 'Tan', colour_hex: '#B5784E', image_url: '/images/products/backpack-tan.jpg', stock_quantity: 15, prices: [{ id: 'p1', currency: 'INR' as const, amount_minor: 1199900 }] },
            { id: 'fie-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/fielder-backpack-espresso-front.webp', stock_quantity: 10, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1199900 }] },
            { id: 'fie-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/variants/fielder-backpack-cognac-front.webp', stock_quantity: 8, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1199900 }] },
            { id: 'fie-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/fielder-backpack-black-front.webp', stock_quantity: 12, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1199900 }] },
          ],
        },
        {
          id: 'marlow-tote',
          slug: 'marlow-tote',
          name: 'The Marlow Tote',
          desc: 'Open-top tote with interior zip pocket.',
          isNew: false,
          isDemo: true,
          personalisable: true,
          primaryImage: { id: 'mar-img', url: '/images/products/tote-espresso.jpg', alt: 'The Marlow Tote' },
          variants: [
            { id: 'mar-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/tote-espresso.jpg', stock_quantity: 18, prices: [{ id: 'p1', currency: 'INR' as const, amount_minor: 899900 }] },
            { id: 'mar-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/variants/marlow-tote-cognac-front.webp', stock_quantity: 14, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 899900 }] },
            { id: 'mar-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/marlow-tote-black-front.webp', stock_quantity: 9, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 899900 }] },
            { id: 'mar-tan', colour: 'Tan', colour_hex: '#B5784E', image_url: '/images/products/variants/marlow-tote-tan-front.webp', stock_quantity: 11, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 899900 }] },
          ],
        },
        {
          id: 'meridian-duffle',
          slug: 'meridian-duffle',
          name: 'The Meridian Duffle',
          desc: 'Travel duffle with reinforced base.',
          isNew: true,
          isDemo: true,
          personalisable: true,
          primaryImage: { id: 'mer-img', url: '/images/products/duffle-travel.jpg', alt: 'The Meridian Duffle' },
          variants: [
            { id: 'mer-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/duffle-travel.jpg', stock_quantity: 7, prices: [{ id: 'p1', currency: 'INR' as const, amount_minor: 1599900 }] },
            { id: 'mer-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/meridian-duffle-espresso-front.webp', stock_quantity: 5, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1599900 }] },
            { id: 'mer-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/meridian-duffle-black-front.webp', stock_quantity: 8, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1599900 }] },
            { id: 'mer-olv', colour: 'Olive', colour_hex: '#6D7155', image_url: '/images/products/variants/meridian-duffle-olive-front.webp', stock_quantity: 6, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1599900 }] },
          ],
        },
      ]
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" aria-label="Hero">
        <div className="hero__bg" aria-hidden="true">
          <Image
            src="/images/hero/hero-briefcase.jpg"
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container-site hero__content" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          <span className="hero__eyebrow">New Collection · Autumn 2026</span>
          <h1 className="hero__title">
            Made to Carry<br />a Lifetime.
          </h1>
          <p className="hero__body">
            Cobleroad makes genuine leather bags and accessories for those who carry with
            intention. Each piece is designed to improve with use and carry quietly.
          </p>
          <div className="hero__actions">
            <Link href="/shop" className="btn btn-primary btn-lg" id="hero-cta-primary">
              Explore the Collection
            </Link>
            <Link
              href="/our-story"
              className="btn btn-ghost btn-lg"
              id="hero-cta-secondary"
              style={{ color: 'var(--colour-espresso)', fontWeight: 500 }}
            >
              Discover Our Craft
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== COLLECTIONS ===== */}
      <section className="section-padding" aria-labelledby="collections-heading">
        <div className="container-site">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Collections</span>
            <h2 className="section-title" id="collections-heading">
              Shop by Category
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {FEATURED_COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="collection-card"
                aria-label={`Shop ${col.name}`}
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="collection-card__img"
                  style={{ objectFit: 'cover' }}
                />
                <div className="collection-card__overlay" aria-hidden="true" />
                <div className="collection-card__label">
                  <span className="collection-card__label-eyebrow">Collection</span>
                  <span className="collection-card__label-name">{col.name}</span>
                  <p
                    style={{
                      marginTop: '0.375rem',
                      fontSize: '0.8125rem',
                      opacity: 0.75,
                      lineHeight: 1.4,
                    }}
                  >
                    {col.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CRAFT STORY ===== */}
      <section
        className="section-padding"
        aria-labelledby="craft-heading"
        style={{ backgroundColor: 'var(--colour-parchment)' }}
      >
        <div className="container-site">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Image side */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/images/lifestyle/lifestyle-desk.jpg"
                alt="A cognac leather briefcase resting on a wooden desk in warm morning light"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                quality={85}
              />
            </div>

            {/* Text side */}
            <div>
              <span className="section-label">The Craft</span>
              <h2
                className="section-title"
                id="craft-heading"
                style={{ marginBottom: '1.5rem' }}
              >
                Designed for<br />How You Live
              </h2>
              <p className="section-body" style={{ marginBottom: '2rem' }}>
                A Cobleroad bag doesn't announce itself. It becomes part of your routine — the
                briefcase that goes into every meeting, the tote that carries everything without
                complaint, the wallet that you forget about because it simply works.
              </p>
              <p className="section-body" style={{ marginBottom: '2.5rem', opacity: 0.75 }}>
                Every detail is considered. Every material is genuine. Every price is what we
                actually charge — no inflation, no artificial markdowns.
              </p>

              {/* Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {CRAFT_PILLARS.map((p) => (
                  <div key={p.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        color: 'var(--colour-cognac)',
                        flexShrink: 0,
                        marginTop: '0.125rem',
                      }}
                      aria-hidden="true"
                    >
                      {p.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: 'var(--colour-espresso)',
                          marginBottom: '0.25rem',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.65, opacity: 0.7 }}>
                        {p.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <Link href="/our-story" className="btn btn-secondary">
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PERSONALISATION ===== */}
      <section
        className="section-padding"
        aria-labelledby="personalisation-heading"
        style={{ backgroundColor: 'var(--colour-ivory)' }}
      >
        <div className="container-site" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ display: 'block' }}>
            Complimentary Personalisation
          </span>
          <h2
            className="section-title"
            id="personalisation-heading"
            style={{ marginBottom: '1.25rem', display: 'inline-block' }}
          >
            Made for You
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--colour-charcoal)',
              lineHeight: 1.7,
              maxWidth: '48ch',
              margin: '0 auto 2.5rem',
            }}
          >
            Eligible Cobleroad pieces can be personalised with your initials or a short
            monogram. Personalisation is complimentary — there is no additional charge.
            Select eligible products are marked on their product page.
          </p>
          <Link href="/shop?personalisation=true" className="btn btn-accent">
            Shop Personalisable Pieces
          </Link>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS (placeholder until Supabase connected) ===== */}
      <section
        className="section-padding"
        aria-labelledby="featured-heading"
        style={{ backgroundColor: 'var(--colour-paper)' }}
      >
        <div className="container-site">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <span className="section-label">Featured</span>
              <h2 className="section-title" id="featured-heading">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Product grid with cinematic hover zoom and interactive swatches */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '2.5rem 1.75rem',
            }}
          >
            {featuredItems.map((product) => (
              <ProductGridCard
                key={product.slug}
                id={product.id}
                slug={product.slug}
                name={product.name}
                shortDescription={product.desc}
                isFeatured={product.isNew}
                isDemo={product.isDemo}
                personalisable={product.personalisable}
                primaryImage={product.primaryImage}
                variants={product.variants}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div className="demo-notice" style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'left' }}>
              <span>ℹ</span>
              <span>
                <strong>Development mode:</strong> Featured products above use demo data. Connect
                Supabase and run the seed migration to display live catalogue with real pricing.
                Products remain in draft until an administrator reviews and publishes them.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section
        aria-labelledby="story-heading"
        style={{
          backgroundColor: 'var(--colour-espresso)',
          color: 'var(--colour-ivory)',
          padding: '6rem 0',
        }}
      >
        <div className="container-site" style={{ maxWidth: '42rem' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--colour-cognac-light)',
              display: 'block',
              marginBottom: '1.25rem',
            }}
          >
            The Story
          </span>
          <h2
            id="story-heading"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            A Brand Built on<br />Honest Leather Work
          </h2>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'rgba(247,244,238,0.75)',
              marginBottom: '1.25rem',
            }}
          >
            Cobleroad was built around a simple belief: that a well-made leather bag should
            be sold at an honest price, without inflated markups or invented heritage.
          </p>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'rgba(247,244,238,0.6)',
              marginBottom: '2.5rem',
            }}
          >
            We describe our materials accurately. We price our products clearly. We do not
            fabricate reviews, certifications, or tanning claims. What we make, we stand behind.
          </p>
          <Link
            href="/our-story"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--colour-cognac-light)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Read our story <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
