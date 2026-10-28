import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Feather, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Story — Cobleroad Leathercraft',
  description: 'The philosophy, heritage, and uncompromising craftsmanship behind Cobleroad genuine leather goods.',
}

export default function OurStoryPage() {
  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Hero Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '5rem 0 4rem' }}>
        <div className="container-site" style={{ maxWidth: '48rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Heritage & Craft</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: '1.5rem', color: 'var(--colour-espresso)' }}>
            Engineered for Decades, Not Seasons.
          </h1>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', opacity: 0.85, maxWidth: '40rem', margin: '0 auto' }}>
            Cobleroad was founded on a singular conviction: that in an era of disposable goods, a truly exceptional bag should endure, age with distinction, and become more personal with every passing year.
          </p>
        </div>
      </section>

      {/* Main Narrative with Photography */}
      <section className="container-site section-padding" style={{ maxWidth: '64rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>The Material</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '1.25rem' }}>
              Only Full-Grain Leather
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', marginBottom: '1rem' }}>
              We do not use bonded, split, or synthetic &ldquo;genuine&rdquo; composites. Every piece is cut from the uppermost layer of the hide—the full grain—where the fibers are densest, strongest, and most naturally water-repellent.
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)' }}>
              Natural markings, subtle neck wrinkles, and organic grain variations are preserved rather than sanded away. These are not flaws; they are the fingerprint of authentic hide that will develop an irreplaceable, rich patina over time.
            </p>
          </div>
          <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '2px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="/images/lifestyle/lifestyle-desk.jpg"
              alt="Artisanal leather bag on work desk"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '2px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', order: 2 }}>
            <Image
              src="/images/hero/hero-briefcase.jpg"
              alt="The Advocate Briefcase in rich cognac leather"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ order: 1 }}>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>The Tanning Tradition</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '1.25rem' }}>
              Vegetable-Tanned with Tree Barks
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', marginBottom: '1rem' }}>
              Our tanneries employ an ancient process that relies on organic vegetable tannins extracted from chestnut, mimosa, and quebracho barks. It requires 40 to 60 days of slow immersion in wooden vats.
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--colour-charcoal)' }}>
              Unlike harsh chrome tanning which coats the leather in heavy metals, vegetable tanning allows the leather to breathe. It imparts that unmistakable rich, earthy scent and gives the material the structural integrity needed to hold its shape for a lifetime.
            </p>
          </div>
        </div>

        {/* 3 Pillars of Cobleroad */}
        <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '4rem 3rem', borderRadius: '2px', border: '1px solid var(--colour-border)', marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 3rem' }}>
            <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>The Standard</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Built on Three Unbending Rules</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem' }}>Solid Brass Hardware</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Every zipper, buckle, rivet, and D-ring is cast from solid brass or stainless steel. No zinc alloys, no brittle plating that peels away after a few trips.
              </p>
            </div>
            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <Feather size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem' }}>Reinforced Stress Points</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Handles and shoulder strap anchors are doubly anchored with hand-set copper rivets and hidden structural webbing to prevent stretching under heavy loads.
              </p>
            </div>
            <div>
              <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', marginBottom: '1.25rem', color: 'var(--colour-cognac)' }}>
                <Award size={20} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem' }}>Hand-Burnished Edges</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.8 }}>
                Rather than covering raw cuts with rubbery edge paint that cracks over time, our artisans hand-bevel and burnish every edge with organic beeswax and friction wood.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', fontWeight: 400, marginBottom: '1rem' }}>
            Experience the Craft
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--colour-charcoal)', opacity: 0.8, maxWidth: '30rem', margin: '0 auto 2rem' }}>
            Discover our collection of handcrafted leather briefcases, travel duffles, and everyday essentials.
          </p>
          <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore Catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
