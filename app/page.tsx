import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Truck, RefreshCw, Shield, Leaf } from 'lucide-react'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero'
import { FlipWords } from '@/components/ui/flip-words'
import { AnimatedShinyBadge } from '@/components/ui/animated-shiny-badge'
import { Marquee } from '@/components/ui/marquee'
import { AmbientHeroSpotlight, SpotlightCard } from '@/components/ui/spotlight'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { getPublishedProducts } from '@/lib/products/queries'
import { FEATURED_PRODUCTS } from '@/lib/products/catalogue'

export const metadata: Metadata = {
  title: 'Cobleroad — Premium Genuine Leather Bags & Accessories',
  description:
    'Discover Cobleroad — genuine leather bags, briefcases, totes, backpacks, and small leather goods for India and beyond. Built to carry a lifetime.',
}

const CATEGORY_TILES = [
  {
    slug: 'work-bags',
    name: 'Work Bags',
    image: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
  },
  {
    slug: 'everyday-bags',
    name: 'Everyday Bags',
    image: '/images/products/real/inappreciable-tote/inappreciable-tote-01.png',
  },
  {
    slug: 'travel-essentials',
    name: 'Travel Essentials',
    image: '/images/products/real/weekender-duffle/weekender-duffle-11.png',
  },
  {
    slug: 'everyday-bags',
    name: 'Backpacks',
    image: '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
  },
  {
    slug: 'everyday-bags',
    name: 'Gym Bags',
    image: '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
  },
  {
    slug: 'work-bags',
    name: 'Laptop Bags',
    image: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
  },
]

const TRUST_ITEMS = [
  {
    icon: <Truck size={18} strokeWidth={1.5} />,
    label: 'Free Shipping',
    sub: 'All over India',
  },
  {
    icon: <RefreshCw size={18} strokeWidth={1.5} />,
    label: 'Easy Returns',
    sub: '14-Day policy',
  },
  {
    icon: <Shield size={18} strokeWidth={1.5} />,
    label: 'Lifetime Guarantee',
    sub: 'On craftsmanship',
  },
  {
    icon: <Leaf size={18} strokeWidth={1.5} />,
    label: 'Premium Leather',
    sub: 'Built to last',
  },
]

export default async function HomePage() {
  const { products: liveProducts } = await getPublishedProducts({ limit: 5 })
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
        primaryImage: p.primary_image || { id: p.id, url: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png', alt: p.name },
        variants: p.variants as any,
      }))
    : FEATURED_PRODUCTS.map((p, i) => ({
        id: p.slug,
        slug: p.slug,
        name: p.name,
        desc: p.shortDescription,
        isNew: p.featured,
        isDemo: false,
        personalisable: p.personalisable,
        primaryImage: { id: `${p.slug}-img`, url: p.primaryImage, alt: p.name },
        variants: p.variants.map((v, vi) => ({
          id: `${p.slug}-${v.sku}`,
          colour: v.colour,
          colour_hex: v.colourHex,
          image_url: v.imageUrl,
          stock_quantity: 10,
          prices: [{ id: `price-${i}-${vi}`, currency: 'INR' as const, amount_minor: p.priceINR }],
        })),
      }))

  return (
    <>
      {/* ===== HERO WITH 21ST FLIP-WORDS, SHINY BADGE & AMBIENT SPOTLIGHT ===== */}
      <section className="hero" aria-label="Hero">
        <div className="hero__bg" aria-hidden="true">
          <Image
            src="/images/products/real/weekender-duffle/weekender-duffle-15.png"
            alt="Cobleroad genuine handcrafted leather bag"
            fill
            priority
            quality={92}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
        </div>
        <div className="hero__overlay" aria-hidden="true" />

        {/* 21st Ambient Interactive Spotlight */}
        <AmbientHeroSpotlight />

        {/* Content */}
        <div className="container-site hero__content" style={{ paddingTop: '3.5rem', paddingBottom: '5.5rem', zIndex: 2 }}>
          <div style={{ marginBottom: '1rem' }}>
            <AnimatedShinyBadge
              text="Artisanal Leather Atelier"
              subtext="Handcrafted in India"
              href="/our-story"
            />
          </div>

          <h1 className="hero__title">
            Made to Carry<br />
            <span className="hero__title-accent">
              <FlipWords
                words={[
                  'a Lifetime.',
                  'Your Legacy.',
                  'Every Journey.',
                  'Quiet Luxury.',
                  'Pure Craft.',
                ]}
                duration={3400}
              />
            </span>
          </h1>

          <p className="hero__body">
            Timeless leather goods for a more meaningful journey.
          </p>

          <div className="hero__actions">
            <Link
              href="/shop"
              className="btn btn-secondary btn-lg"
              id="hero-cta-primary"
              style={{ borderColor: 'rgba(247,244,238,0.6)', color: 'var(--colour-ivory)' }}
            >
              Explore the Collection <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
            <Link
              href="/personalisation"
              className="btn btn-secondary btn-lg"
              style={{
                borderColor: 'rgba(247,244,238,0.35)',
                color: 'rgba(247,244,238,0.88)',
                backgroundColor: 'rgba(20, 10, 5, 0.35)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Bespoke Monogramming <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Right-side vertical category nav */}
        <nav className="hero__side-nav" aria-label="Browse by journey">
          <Link href="/collections/travel-essentials" className="hero__side-nav-item">
            Travel
          </Link>
          <Link href="/collections/work-bags" className="hero__side-nav-item">
            Work
          </Link>
          <Link href="/collections/everyday-bags" className="hero__side-nav-item">
            Life
          </Link>
          <Link href="/personalisation" className="hero__side-nav-item">
            Personalise
          </Link>

          <span className="hero__side-divider" aria-hidden="true" />
          <span className="hero__side-tagline">
            One Material.<br />
            A Thousand<br />
            Journeys.
          </span>
        </nav>

        {/* Coordinates */}
        <div className="hero__coordinates" aria-hidden="true">
          <span>12.9716° N  77.5946° E  |  India</span>
        </div>
      </section>

      {/* ===== HERITAGE INFINITE MARQUEE (21ST) ===== */}
      <section className="heritage-marquee-bar" aria-label="Brand credentials ticker">
        <Marquee
          items={[
            'Full-Grain Vegetable Tanned Leather',
            'Solid Brass Hardware',
            'Hand-Stitched Integrity',
            'Complimentary Bespoke Monogramming',
            '14-Day Home Trial',
            'Lifetime Craftsmanship Guarantee',
            'Ethically Sourced in India',
            'Zero Synthetic Fillers',
          ]}
          speed={32}
        />
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <ScrollReveal yOffset={28}>
        <section className="category-row" aria-labelledby="category-heading">
          <div className="category-row__header">
            <div className="category-row__label-block">
              <span className="category-row__label">Shop by Category</span>
              <h2 className="category-row__title" id="category-heading">
                Objects for<br />Every Journey.
              </h2>
              <p className="category-row__subtitle">Crafted to age with you.</p>
            </div>
          </div>
          <div className="category-row__scroll" role="list">
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={`${cat.slug}-${cat.name}`}
                href={`/collections/${cat.slug}`}
                className="category-tile"
                role="listitem"
                aria-label={`Shop ${cat.name}`}
              >
                <div className="category-tile__image-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="220px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span className="category-tile__name">{cat.name}</span>
                <span className="category-tile__arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ===== CRAFT DARK SECTION ===== */}
      <ScrollReveal yOffset={32}>
        <section className="craft-dark" aria-labelledby="craft-heading">
          {/* Left: artisan image */}
          <div className="craft-dark__image-half">
            <Image
              src="/images/lifestyle/lifestyle-desk.jpg"
              alt="Artisan crafting leather goods by hand"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              quality={88}
            />
            <div className="craft-dark__play-btn">
              <span className="craft-dark__play-icon" aria-hidden="true">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0L10 6L0 12V0Z" />
                </svg>
              </span>
              <span>The Craft<br />In Every Stitch</span>
            </div>
          </div>

          {/* Right: content */}
          <div className="craft-dark__content">
            <span className="craft-dark__label">The Craft</span>
            <h2 className="craft-dark__title" id="craft-heading">
              More than a Bag.<br />
              A Story in Leather.
            </h2>
            <p className="craft-dark__body">
              Full-grain leather. Thoughtful design. Skilled hands. Every detail is
              crafted to age beautifully, travelling with you for years to come.
            </p>
            <Link href="/our-story" className="craft-dark__cta">
              Discover Our Craft <ArrowRight size={13} />
            </Link>

            {/* 3 detail thumbnails */}
            <div className="craft-dark__details">
              {[
                { img: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-04.png', label: 'Full-Grain\nLeather' },
                { img: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-01.png', label: 'Solid Brass\nHardware' },
                { img: '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-06.png', label: 'Hand-Finished\nDetails' },
              ].map((d) => (
                <div key={d.label} className="craft-detail-thumb">
                  <Image
                    src={d.img}
                    alt={d.label.replace('\n', ' ')}
                    width={120}
                    height={120}
                    className="craft-detail-thumb__image"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="craft-detail-thumb__label" style={{ whiteSpace: 'pre-line' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ===== EDITORIAL BENTO GRID WITH 21ST SPOTLIGHT CARDS ===== */}
      <ScrollReveal yOffset={32}>
        <section className="editorial-bento" aria-label="Editorial collection">
          {/* Tile 1 */}
          <SpotlightCard className="bento-tile" spotlightColor="rgba(181, 120, 78, 0.22)">
            <div className="bento-tile__bg" aria-hidden="true">
              <Image src="/images/products/real/weekender-duffle/weekender-duffle-17.png" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-tile__content">
              <span className="bento-tile__eyebrow">The Craft</span>
              <h3 className="bento-tile__title">
                Handed Down.<br />
                <em>Carried Forward.</em>
              </h3>
              <Link href="/our-story" className="bento-tile__cta">
                See the Craft <ArrowRight size={11} />
              </Link>
            </div>
          </SpotlightCard>

          {/* Tile 2 */}
          <SpotlightCard className="bento-tile" spotlightColor="rgba(181, 120, 78, 0.22)">
            <div className="bento-tile__bg" aria-hidden="true">
              <Image src="/images/products/real/barrel-gym-bag/barrel-gym-bag-09.png" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-tile__content">
              <span className="bento-tile__eyebrow">A Modern Classic</span>
              <h3 className="bento-tile__title">
                For Those Who<br />
                <em>Move Differently.</em>
              </h3>
              <Link href="/collections/everyday-bags" className="bento-tile__cta">
                Shop Bags <ArrowRight size={11} />
              </Link>
            </div>
          </SpotlightCard>

          {/* Tile 3 */}
          <SpotlightCard className="bento-tile" spotlightColor="rgba(181, 120, 78, 0.22)">
            <div className="bento-tile__bg" aria-hidden="true">
              <Image src="/images/products/real/inappreciable-tote/inappreciable-tote-07.png" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-tile__content">
              <span className="bento-tile__eyebrow">Complimentary</span>
              <h3 className="bento-tile__title">
                Make It<br />
                <em>Yours.</em>
              </h3>
              <Link href="/personalisation" className="bento-tile__cta">
                Add Monogram <ArrowRight size={11} />
              </Link>
            </div>
          </SpotlightCard>
        </section>
      </ScrollReveal>

      {/* ===== THE ESSENTIALS ===== */}
      <ScrollReveal yOffset={32}>
        <section className="essentials-section" aria-labelledby="essentials-heading">
          <div className="essentials-inner">
            {/* Label col */}
            <div className="essentials-label-col">
              <span className="essentials-label">Featured Products</span>
              <h2 className="essentials-title" id="essentials-heading">
                The<br />Essentials
              </h2>
              <p className="essentials-subtitle">Objects made to stay.</p>
              <Link href="/shop" className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {/* Scrollable product cards */}
            <div className="essentials-scroll">
              {featuredItems.map((product) => (
                <div key={product.slug} style={{ flex: '0 0 auto', width: '220px' }}>
                  <ProductGridCard
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
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ===== 3D PERSPECTIVE TUNNEL ===== */}
      <PerspectiveTunnelHero />

      {/* ===== TRUST BAR ===== */}
      <div className="trust-bar" role="complementary" aria-label="Shopping assurances">
        <div className="trust-bar__inner">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="trust-item">
              <span className="trust-item__icon" aria-hidden="true">{item.icon}</span>
              <div>
                <span className="trust-item__text-label">{item.label}</span>
                <span className="trust-item__text-sub">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
