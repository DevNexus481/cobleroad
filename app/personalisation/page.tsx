import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Scissors, Sparkles, Check, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Complimentary Personalisation — Cobleroad',
  description: 'Artisanal monogramming and hot-foil debossing on Cobleroad genuine leather goods.',
}

export default function PersonalisationPage() {
  const techniques = [
    {
      title: 'Blind Debossing',
      subtitle: 'Quiet, tactile permanence',
      desc: 'Our master stampers heat solid brass letter dies to precisely 120°C and apply calibrated manual pressure. The heat and compression subtly darken the natural vegetable oils in the full grain, leaving an understated, tactile impression that never fades or peels.',
      bestFor: 'Advocate Briefcase, Meridian Laptop Bag, Minimalist Wallets',
    },
    {
      title: '24K Gold Foil Debossing',
      subtitle: 'Luminous classical luxury',
      desc: 'Micro-thin genuine 24-karat gold foil leaf is heat-bonded directly into the compressed leather fibers. The result is a sharp, brilliant monogram that catches the ambient light with rich elegance.',
      bestFor: 'Marlow Tote, Passport Wallets, Travel Tags',
    },
    {
      title: 'Silver Foil Debossing',
      subtitle: 'Contemporary architectural refinement',
      desc: 'For modern connoisseurs pairing their leather with stainless steel timepieces and silver accessories. Clean metallic foil heat-fused into the leather surface with crisp edges.',
      bestFor: 'Everyday Folios, Card Sleeves, Telegraph Messenger',
    },
  ]

  const placementGuides = [
    {
      category: 'Briefcases & Satchels',
      placement: 'Lower bottom-right of front flap or top handle keeper tab.',
      chars: 'Up to 3 uppercase letters (e.g. A·K·S)',
    },
    {
      category: 'Wallets & Cardholders',
      placement: 'Bottom inner card slot edge, maintaining clean exterior minimalism.',
      chars: 'Up to 3 uppercase letters (e.g. R·M)',
    },
    {
      category: 'Travel Bags & Weekenders',
      placement: 'Centred on detachable matching leather clochette or luggage tag.',
      chars: 'Up to 3 uppercase letters (e.g. V·J·P)',
    },
    {
      category: 'Notebook Covers & Folios',
      placement: 'Bottom right corner of the front leather cover.',
      chars: 'Up to 3 uppercase letters or full monogram',
    },
  ]

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '5rem 0 3.5rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Artisanal Signature</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Complimentary Personalisation
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', opacity: 0.85 }}>
            Every eligible piece in the Cobleroad collection can be stamped with your bespoke initials at our atelier—without surcharge. An enduring mark of ownership for a piece crafted to accompany you for life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-site section-padding" style={{ maxWidth: '64rem' }}>
        {/* The Craft Narrative */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Heated Brass Dies</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '1.25rem' }}>
              Hand-Pressed by Master Stampers
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', marginBottom: '1rem' }}>
              Unlike automated laser etching which burns the protein fibers of natural leather, Cobleroad relies on traditional manual stamping machines equipped with custom-milled brass typefaces.
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)' }}>
              Each hide density is slightly different; our artisans test and calibrate pressure and temperature by touch to guarantee a deep, sharp deboss that holds its crisp definition as the leather matures.
            </p>
          </div>
          <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '2px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="/images/products/cardholder.jpg"
              alt="Hand-crafted leather cardholder with fine stitching"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 3 Stamping Finishes */}
        <div style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 3rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Choice of Finish</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Three Distinct Expressions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {techniques.map((t, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--colour-parchment)',
                  border: '1px solid var(--colour-border)',
                  padding: '2.25rem 1.75rem',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', color: 'var(--colour-cognac)', marginBottom: '1.25rem' }}>
                  <Sparkles size={18} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.25rem' }}>
                  {t.title}
                </h3>
                <span style={{ fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.6, marginBottom: '1rem', display: 'block' }}>
                  {t.subtitle}
                </span>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '1.5rem', flexGrow: 1 }}>
                  {t.desc}
                </p>
                <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>
                  <strong>Recommended for:</strong> {t.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Guide Table */}
        <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '3.5rem 2.5rem', borderRadius: '2px', border: '1px solid var(--colour-border)', marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 2.5rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Placement</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Where Your Monogram Appears</h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
              We place all monograms in quiet, deliberate locations to maintain the understated silhouette of each design.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {placementGuides.map((g, i) => (
              <div key={i} style={{ backgroundColor: 'var(--colour-paper)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.5rem' }}>{g.category}</h4>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--colour-charcoal)', marginBottom: '0.75rem' }}>{g.placement}</p>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--colour-cognac)', fontWeight: 600 }}>{g.chars}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '0.75rem' }}>
            Ready to Create Yours?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.8, maxWidth: '30rem', margin: '0 auto 2rem' }}>
            Simply select your item, type your initials into the complimentary personalisation field on the product page, and our atelier will handle the rest.
          </p>
          <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Shop Personalisable Pieces <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
