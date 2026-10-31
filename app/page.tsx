import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Truck, RefreshCw, Shield, Leaf } from 'lucide-react'
import { ProductGridCard } from '@/components/storefront/ProductGridCard'
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero'
import { getPublishedProducts } from '@/lib/products/queries'

export const metadata: Metadata = {
  title: 'Cobleroad — Premium Genuine Leather Bags & Accessories',
  description:
    'Discover Cobleroad — genuine leather bags, briefcases, totes, backpacks, and small leather goods for India and beyond. Built to carry a lifetime.',
}

const CATEGORY_TILES = [
  {
    slug: 'work-bags',
    name: 'Work Bags',
    image: '/images/products/laptop-bag.jpg',
  },
  {
    slug: 'everyday-bags',
    name: 'Everyday Bags',
    image: '/images/products/tote-espresso.jpg',
  },
  {
    slug: 'travel-essentials',
    name: 'Travel Essentials',
    image: '/images/products/duffle-travel.jpg',
  },
  {
    slug: 'small-leather-goods',
    name: 'Small Leather Goods',
    image: '/images/products/wallet-slim.jpg',
  },
  {
    slug: 'backpacks',
    name: 'Backpacks',
    image: '/images/products/backpack-tan.jpg',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    image: '/images/products/cardholder.jpg',
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

const HERO_SIDE_LINKS = ['Travel', 'Work', 'Life', 'Personalise']

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
            { id: 'adv-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/advocate-briefcase-espresso-front.jpg', stock_quantity: 8, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1299900 }] },
            { id: 'adv-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/advocate-briefcase-black-front.jpg', stock_quantity: 10, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1299900 }] },
            { id: 'adv-tan', colour: 'Tan', colour_hex: '#B5784E', image_url: '/images/products/variants/advocate-briefcase-tan-front.jpg', stock_quantity: 6, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1299900 }] },
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
            { id: 'fie-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/fielder-backpack-espresso-front.jpg', stock_quantity: 10, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1199900 }] },
            { id: 'fie-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/variants/fielder-backpack-cognac-front.jpg', stock_quantity: 8, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1199900 }] },
            { id: 'fie-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/fielder-backpack-black-front.jpg', stock_quantity: 12, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1199900 }] },
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
            { id: 'mar-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/variants/marlow-tote-cognac-front.jpg', stock_quantity: 14, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 899900 }] },
            { id: 'mar-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/marlow-tote-black-front.jpg', stock_quantity: 9, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 899900 }] },
            { id: 'mar-tan', colour: 'Tan', colour_hex: '#B5784E', image_url: '/images/products/variants/marlow-tote-tan-front.jpg', stock_quantity: 11, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 899900 }] },
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
            { id: 'mer-esp', colour: 'Espresso', colour_hex: '#2B211D', image_url: '/images/products/variants/meridian-duffle-espresso-front.jpg', stock_quantity: 5, prices: [{ id: 'p2', currency: 'INR' as const, amount_minor: 1599900 }] },
            { id: 'mer-blk', colour: 'Black', colour_hex: '#1F1B18', image_url: '/images/products/variants/meridian-duffle-black-front.jpg', stock_quantity: 8, prices: [{ id: 'p3', currency: 'INR' as const, amount_minor: 1599900 }] },
            { id: 'mer-olv', colour: 'Olive', colour_hex: '#6D7155', image_url: '/images/products/variants/meridian-duffle-olive-front.jpg', stock_quantity: 6, prices: [{ id: 'p4', currency: 'INR' as const, amount_minor: 1599900 }] },
          ],
        },
        {
          id: 'marlow-tote-messenger',
          slug: 'messenger-cognac',
          name: 'The Ridge Messenger',
          desc: 'Slim shoulder messenger with quick-access flap.',
          isNew: false,
          isDemo: true,
          personalisable: true,
          primaryImage: { id: 'msg-img', url: '/images/products/messenger-cognac.jpg', alt: 'The Ridge Messenger' },
          variants: [
            { id: 'msg-cog', colour: 'Cognac', colour_hex: '#9A633F', image_url: '/images/products/messenger-cognac.jpg', stock_quantity: 10, prices: [{ id: 'p1', currency: 'INR' as const, amount_minor: 749900 }] },
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
            quality={92}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          />
        </div>
        <div className="hero__overlay" aria-hidden="true" />

        {/* Content */}
        <div className="container-site hero__content" style={{ paddingTop: '3.5rem', paddingBottom: '5.5rem', zIndex: 2 }}>
          <span className="hero__eyebrow">Leather Since Ages.</span>
          <h1 className="hero__title">
            Made to Carry<br />
            <span className="hero__title-accent">a Lifetime.</span>
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

      {/* ===== SHOP BY CATEGORY ===== */}
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
              key={cat.slug}
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

      {/* ===== CRAFT DARK SECTION ===== */}
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
              { img: '/images/products/cardholder.jpg', label: 'Full-Grain\nLeather' },
              { img: '/images/products/wallet-slim.jpg', label: 'Solid Brass\nHardware' },
              { img: '/images/products/passport-holder.jpg', label: 'Hand-Finished\nDetails' },
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

      {/* ===== EDITORIAL BENTO GRID ===== */}
      <section className="editorial-bento" aria-label="Editorial collection">
        {/* Tile 1 */}
        <div className="bento-tile">
          <div className="bento-tile__bg" aria-hidden="true">
            <Image src="/images/lifestyle/lifestyle-desk.jpg" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
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
        </div>

        {/* Tile 2 */}
        <div className="bento-tile">
          <div className="bento-tile__bg" aria-hidden="true">
            <Image src="/images/products/duffle-travel.jpg" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
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
        </div>

        {/* Tile 3 */}
        <div className="bento-tile">
          <div className="bento-tile__bg" aria-hidden="true">
            <Image src="/images/products/backpack-tan.jpg" alt="" fill sizes="33vw" style={{ objectFit: 'cover' }} />
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
        </div>
      </section>

      {/* ===== THE ESSENTIALS ===== */}
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
