import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Flame, Sparkles, Check, Clock } from 'lucide-react'
import { MonogramStudioInteractive } from '@/components/storefront/MonogramStudioInteractive'

export const metadata: Metadata = {
  title: 'Complimentary Personalisation & Monogramming — Cobleroad',
  description:
    'Artisanal hot-stamped monogramming on Cobleroad genuine leather goods. Hand-set using solid brass typographic dies heated to 120°C at our New Delhi atelier.',
}

export default function PersonalisationPage() {
  const finishes = [
    {
      title: '24K Gold Foil Leaf',
      subtitle: 'Classical Radiance',
      image: '/images/monogram/monogram-gold-foil.jpg',
      alt: 'Macro photograph of warm Cognac leather with 24K gold foil debossed initials',
      desc: 'Genuine micro-thin 24-karat gold leaf is heat-fused directly into the compressed leather pores. The result is a sharp, luminous monogram that catches the raking light with classical dignity.',
      recommended: '2 Unfold Laptop Bag Heritage, The Inappreciable Tote, Weekender Duffle',
    },
    {
      title: 'Thermal Blind Deboss',
      subtitle: 'Quiet, Tactile Permanence',
      image: '/images/monogram/monogram-blind-deboss.jpg',
      alt: 'Tactile blind debossed impression on deep espresso leather',
      desc: 'Our master stampers heat solid brass dies to 120°C and apply calibrated hand pressure. The heat gently darkens the hide’s natural oils without any foil, leaving an impression that patinas with the leather for decades.',
      recommended: 'Atlanta Laptop Sleeve, Optimus Transformer Bag, Leather Luggage Tags',
    },
    {
      title: 'Sterling Silver Leaf',
      subtitle: 'Modern Architectural Sheen',
      image: '/images/monogram/monogram-lifestyle-atelier.jpg',
      alt: 'Editorial flatlay of leather luggage tag and passport wallet with silver foil monogramming',
      desc: 'For modern connoisseurs pairing their leather with stainless steel timepieces and silver accessories. A clean metallic foil heat-bonded with razor-sharp micro-bevel edges.',
      recommended: 'Metropolitan Backpack, Shoe Compartment Duffle, Weekend Bags',
    },
  ]

  const placementGuides = [
    {
      number: '01',
      category: 'Work Bags & Briefcases',
      placement: 'Discreetly stamped on the lower right of the front flap, or on the handle keeper tab.',
      specs: 'Up to 3 letters (e.g. A · K · S)',
    },
    {
      number: '02',
      category: 'Travel Bags & Weekenders',
      placement: 'Centred on the matching detachable full-grain leather clochette luggage tag.',
      specs: 'Up to 3 letters (e.g. V · J · P)',
    },
    {
      number: '03',
      category: 'Wallets & Cardholders',
      placement: 'Pressed on the interior card slot edge, preserving clean exterior minimalism.',
      specs: 'Up to 3 letters (e.g. R · M)',
    },
    {
      number: '04',
      category: 'Passport Covers & Folios',
      placement: 'Lower right quadrant of the exterior cover, aligned with perimeter saddle-stitching.',
      specs: 'Up to 3 letters (e.g. C · R)',
    },
  ]

  const eligibleProducts = [
    {
      slug: 'advocate-briefcase',
      name: 'The Advocate Briefcase',
      category: 'Work Bags',
      price: '₹12,999',
      image: '/images/hero/hero-briefcase.jpg',
      desc: 'Structured dual-buckle briefcase in full-grain leather.',
    },
    {
      slug: 'meridian-duffle',
      name: 'The Meridian Duffle',
      category: 'Travel Essentials',
      price: '₹15,999',
      image: '/images/products/duffle-travel.jpg',
      desc: 'Heritage travel weekender with reinforced base and clochette tag.',
    },
    {
      slug: 'marlow-tote',
      name: 'The Marlow Tote',
      category: 'Everyday Bags',
      price: '₹8,999',
      image: '/images/products/tote-espresso.jpg',
      desc: 'Generous open-top tote with substantial rolled leather handles.',
    },
    {
      slug: 'transit-passport-wallet',
      name: 'The Transit Passport Wallet',
      category: 'Small Leather Goods',
      price: '₹2,999',
      image: '/images/products/passport-holder.jpg',
      desc: 'Dedicated holder for passport, currency, and travel boarding passes.',
    },
  ]

  const faqs = [
    {
      q: 'Does personalisation delay my shipment?',
      a: 'Each piece is hand-typeset with milled brass dies and individually stamped in our New Delhi atelier. This bespoke step adds only 24 to 48 hours to crafting before immediate dispatch via insured express courier.',
    },
    {
      q: 'Which characters and symbols are supported?',
      a: 'We support all standard Latin uppercase letters (A–Z) and the traditional center dot separator ( · ). Up to 3 characters can be stamped on bags, wallets, and travel accessories.',
    },
    {
      q: 'Can personalised pieces be returned or exchanged?',
      a: 'Because a bespoke monogram is a permanent artisanal alteration made specifically for you, personalised pieces cannot be returned or exchanged for change of mind. However, every item remains fully protected under our Lifetime Craftsmanship Guarantee.',
    },
    {
      q: 'Is there any additional charge for monogramming?',
      a: 'No. Bespoke personalisation is entirely complimentary across all eligible items in the Cobleroad collection. Simply enter your initials on the product page prior to adding to cart.',
    },
  ]

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* ===== HERO HEADER (Warm Parchment matching /our-story) ===== */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '5rem 0 4rem' }}>
        <div className="container-site" style={{ maxWidth: '52rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            Atelier Service &bull; New Delhi
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--colour-espresso)' }}>
            The Mark of Ownership.
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', opacity: 0.85, maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
            In an era of disposable mass manufacturing, Cobleroad offers something enduringly personal. Every eligible piece is hand-stamped in our New Delhi atelier using solid milled brass dies heated to 120&deg;C—provided complimentary on every order.
          </p>

          {/* 4 Atelier Credentials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', borderTop: '1px solid var(--colour-border)', paddingTop: '2rem', maxWidth: '42rem', margin: '0 auto' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--colour-espresso)', display: 'block' }}>120&deg;C Thermal</span>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.65 }}>Calibrated Heat</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--colour-espresso)', display: 'block' }}>Solid Brass</span>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.65 }}>Milled Dies</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--colour-espresso)', display: 'block' }}>24K Gold &amp; Silver</span>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.65 }}>Precious Leaf</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--colour-cognac)', display: 'block' }}>Complimentary</span>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.65 }}>Zero Surcharge</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL ATELIER PHOTOGRAPHY SHOWCASE ===== */}
      <section className="container-site" style={{ maxWidth: '68rem', marginTop: '3.5rem', marginBottom: '4.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Main Wide Photo */}
          <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--colour-border)', boxShadow: '0 4px 16px rgba(43,33,29,0.06)' }}>
            <Image
              src="/images/monogram/hero-atelier-artisan.jpg"
              alt="Master craftsman operating vintage cast-iron stamping press in atelier"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(20, 10, 5, 0.7)', backdropFilter: 'blur(4px)', padding: '0.35rem 0.75rem', borderRadius: '2px', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--colour-ivory)' }}>
              The Atelier &bull; Hand Stamping Machine
            </div>
          </div>

          {/* Right Column with 2 Detail Photos */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ position: 'relative', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--colour-border)', boxShadow: '0 4px 16px rgba(43,33,29,0.06)' }}>
              <Image
                src="/images/monogram/brass-typeset-dies.jpg"
                alt="Solid milled brass letterpress alphabet dies in walnut compositor drawer"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', backgroundColor: 'rgba(20, 10, 5, 0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem', borderRadius: '2px', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--colour-ivory)' }}>
                Solid Milled Brass Type
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--colour-border)', boxShadow: '0 4px 16px rgba(43,33,29,0.06)' }}>
              <Image
                src="/images/monogram/monogram-gold-foil.jpg"
                alt="Macro photograph of 24K gold foil monogram on full-grain cognac leather"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', backgroundColor: 'rgba(20, 10, 5, 0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem', borderRadius: '2px', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--colour-ivory)' }}>
                24K Gold Leaf on Full-Grain Hide
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTAINER ===== */}
      <main className="container-site" style={{ maxWidth: '68rem', paddingBottom: '6rem' }}>
        {/* ===== INTERACTIVE STUDIO SIMULATOR ===== */}
        <div style={{ marginBottom: '6rem' }}>
          <MonogramStudioInteractive />
        </div>

        {/* ===== THREE STAMPING TECHNIQUES ===== */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
              Atelier Finishing
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 400, color: 'var(--colour-espresso)' }}>
              Three Expressions of Distinction
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8, marginTop: '0.5rem' }}>
              Choose the aesthetic finish that best harmonises with your personal style and travel accessories.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {finishes.map((f, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--colour-parchment)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 10px rgba(43,33,29,0.03)',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/10', width: '100%', borderBottom: '1px solid var(--colour-border)' }}>
                  <Image src={f.image} alt={f.alt} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.25rem' }}>
                    {f.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--colour-cognac)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', display: 'block' }}>
                    {f.subtitle}
                  </span>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '1.5rem', flexGrow: 1 }}>
                    {f.desc}
                  </p>
                  <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '1rem', fontSize: '0.75rem', opacity: 0.75 }}>
                    <strong style={{ color: 'var(--colour-espresso)' }}>Best for:</strong> {f.recommended}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== THREE UNBENDING ATELIER RULES (Matched to /our-story) ===== */}
        <section style={{ backgroundColor: 'var(--colour-parchment)', padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)', borderRadius: '2px', border: '1px solid var(--colour-border)', marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 3rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>The Standard</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 400, color: 'var(--colour-espresso)' }}>
              Built on Three Unbending Rules
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <Flame size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem', color: 'var(--colour-espresso)' }}>
                No Laser Engraving
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Automated laser burning fries collagen protein fibers, producing brittle ash and an acrid scent. We exclusively use traditional hot-pressing with solid milled brass type.
              </p>
            </div>

            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <Clock size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem', color: 'var(--colour-espresso)' }}>
                120&deg;C Calibrated Heat
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Every hide section has unique density. Our artisans calibrate hand pressure and heat by touch to naturally darken the hide&rsquo;s vegetable oils for a permanent, graceful patina.
              </p>
            </div>

            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem', color: 'var(--colour-espresso)' }}>
                Lifetime Guarantee
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Personalisation never voids your coverage. Every piece stamped at our New Delhi atelier remains fully backed by our unyielding guarantee against craftsmanship defects.
              </p>
            </div>
          </div>
        </section>

        {/* ===== PLACEMENT ARCHITECTURE ===== */}
        <section style={{ backgroundColor: 'var(--colour-white)', padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)', borderRadius: '2px', border: '1px solid var(--colour-border)', marginBottom: '6rem', boxShadow: '0 2px 10px rgba(43,33,29,0.03)' }}>
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 3rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Understated Placement</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 400, color: 'var(--colour-espresso)' }}>
              Where Your Monogram Appears
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.75, marginTop: '0.5rem', color: 'var(--colour-charcoal)' }}>
              We place all debossing in deliberate, quiet zones to preserve the understated architectural silhouette of each piece.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {placementGuides.map((g) => (
              <div
                key={g.number}
                style={{
                  backgroundColor: 'var(--colour-paper)',
                  padding: '1.75rem',
                  borderRadius: '2px',
                  border: '1px solid var(--colour-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--colour-cognac)', fontWeight: 600, display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>
                    {g.number}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.5rem', color: 'var(--colour-espresso)' }}>
                    {g.category}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '1rem' }}>
                    {g.placement}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--colour-cognac)', fontWeight: 600 }}>
                    {g.specs}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CURATED SHOPPABLE PIECES ===== */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Atelier Selection</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 400, color: 'var(--colour-espresso)' }}>
                Signature Personalisable Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--colour-cognac)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Browse Full Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.75rem' }}>
            {eligibleProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                style={{
                  backgroundColor: 'var(--colour-white)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '2px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                  boxShadow: '0 2px 8px rgba(43,33,29,0.03)',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', backgroundColor: 'var(--colour-parchment)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 240px" style={{ objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.625rem',
                      left: '0.625rem',
                      backgroundColor: 'rgba(20, 10, 5, 0.7)',
                      backdropFilter: 'blur(3px)',
                      color: 'var(--colour-ivory)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '2px',
                    }}
                  >
                    Free Monogram
                  </span>
                </div>
                <span style={{ fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--colour-charcoal)', opacity: 0.6, marginBottom: '0.25rem' }}>
                  {p.category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.5rem' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--colour-charcoal)', opacity: 0.75, marginBottom: '1rem', flexGrow: 1 }}>
                  {p.desc}
                </p>
                <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--colour-espresso)' }}>{p.price}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--colour-cognac)', fontWeight: 500, letterSpacing: '0.06em' }}>
                    Personalise &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== ATELIER FAQS ===== */}
        <section style={{ maxWidth: '44rem', margin: '0 auto 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Atelier Policy</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 400, color: 'var(--colour-espresso)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--colour-white)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '2px',
                  padding: '1.5rem 1.75rem',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.5rem' }}>
                  {f.q}
                </h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.85 }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FINAL ATELIER CALL TO ACTION ===== */}
        <section style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto', borderTop: '1px solid var(--colour-border)', paddingTop: '4rem' }}>
          <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Artisanal Heritage</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '1rem' }}>
            Ready to Stamp Your Piece?
          </h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--colour-charcoal)', opacity: 0.8, marginBottom: '2.25rem' }}>
            Simply select any eligible briefcase, weekender, tote, or wallet from our catalog. Add your bespoke initials in the personalisation field, and our artisans will handcraft the rest.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Shop Personalisable Pieces <ArrowRight size={14} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link href="/our-story" className="btn btn-secondary" style={{ padding: '0.875rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Read Our Story
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
