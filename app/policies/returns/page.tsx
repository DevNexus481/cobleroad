import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Exchanges Policy — THE COBBLEROAD',
  description: '14-day trial period, complimentary reverse pickup, and lifetime craftsmanship warranty policy.',
}

export default function ReturnsPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '4.5rem 0 3rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Client Services</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
            Returns, Exchanges & Warranty
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.75 }}>
            Last revised: October 2026 &bull; 14-Day Doorstep Trial
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-site section-padding" style={{ maxWidth: '48rem' }}>
        {/* Core Return Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <RotateCcw size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>14-Day Return Window</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Inspect the leather at home for 14 days from the date of confirmed delivery.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <ShieldCheck size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Complimentary Pickup</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>We schedule our courier partner to collect the item directly from your doorstep at zero cost.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <AlertCircle size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Personalisation Policy</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Pieces debossed with custom initials are final sale unless a manufacturing flaw is present.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.8, fontSize: '0.9375rem', color: 'var(--colour-charcoal)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              1. Return Eligibility Criteria
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              To qualify for a full refund or exchange:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>The item must be in entirely unused, pristine condition, showing no signs of wear, oil marks, deep folding, or exterior scuffs.</li>
              <li>The item must be returned with all original tags, protective tissue, shoulder straps, and the breathable cotton dust bag.</li>
              <li>Returns must be requested within 14 calendar days of delivery.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              2. Custom & Monogrammed Goods
            </h2>
            <p>
              Because personalized pieces are permanently embossed with bespoke initials using heated brass dies, they cannot be resold or repurposed. As such, <strong>personalized items cannot be returned or exchanged for change of mind</strong>. If your personalized bag arrives damaged or contains an error on our part, we will replace it immediately with top priority.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              3. Refund Timelines
            </h2>
            <p>
              Once your return arrives back at our atelier and passes our quality inspection (typically within 48 hours of receipt), a full refund is automatically issued to your original method of payment via Razorpay. Depending on your issuing bank, the credit will reflect on your statement within 3 to 5 business days.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              4. Lifetime Craftsmanship Warranty
            </h2>
            <p>
              THE COBBLEROAD stands behind every stitch. We provide a lifetime warranty covering structural defects in our craftsmanship, including:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Separation or unravelling of saddle stitching</li>
              <li>Failure of solid brass zippers, rivets, or buckle mechanisms</li>
              <li>Detachment of handle anchors or shoulder strap hardware</li>
            </ul>
            <p>
              <em>(Note: Natural patina development, normal surface scuffing from everyday journeys, and damage caused by improper chemical cleaning are part of the leather&rsquo;s natural life and are not covered under warranty.)</em>
            </p>
          </div>

          {/* Initiation CTA */}
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '2.5rem', borderRadius: '2px', border: '1px solid var(--colour-border)', marginTop: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem' }}>Need to Request a Return or Exchange?</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1.25rem' }}>
              Send an email to our concierge team with your order number and photos of the item. We will arrange your doorstep pickup promptly.
            </p>
            <Link href="/contact" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Contact Returns Concierge <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
