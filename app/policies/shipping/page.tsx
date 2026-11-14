import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Clock, ShieldCheck, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — THE COBBLEROAD',
  description: 'Delivery timelines, courier partnerships, and complimentary domestic shipping thresholds across India.',
}

export default function ShippingPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '4.5rem 0 3rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Client Services</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.75 }}>
            Last revised: October 2026 &bull; Direct Atelier Fulfillment
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-site section-padding" style={{ maxWidth: '48rem' }}>
        {/* Key Delivery Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <Truck size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Complimentary Shipping</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Orders of ₹2,999 and above ship free across all serviceable pin codes in India.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <Clock size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Atelier Dispatch</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Standard orders dispatch in 24–48 hours. Custom personalised pieces dispatch in 48–72 hours.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <ShieldCheck size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Tamper-Proof Packaging</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Every bag arrives sealed inside a bespoke breathable cotton dust bag within a rigid reinforced box.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.8, fontSize: '0.9375rem', color: 'var(--colour-charcoal)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              1. Domestic Shipping Rates & Thresholds
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We deliver to over 19,000 postal codes across India via our priority logistics partners, including Blue Dart, Delhivery, and DTDC.
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Orders ₹2,999 and Above:</strong> Complimentary Express Delivery across India (₹0).</li>
              <li><strong>Orders Below ₹2,999:</strong> Standard domestic delivery fee of ₹150 applies at checkout.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              2. Estimated Transit Timelines
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Once dispatched from our workshop in Uttar Pradesh, expected delivery times are:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Tier 1 Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
              <li><strong>Tier 2 & Tier 3 Regional Cities:</strong> 3 to 6 business days.</li>
              <li><strong>Remote / Island Locations (Northeast, J&K, Andaman & Nicobar):</strong> 5 to 8 business days.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              3. Order Tracking & Real-Time Updates
            </h2>
            <p>
              As soon as your shipment is scanned by the courier, you will receive an SMS and email notification containing your AWB tracking link. You can track your courier&rsquo;s journey in real-time or view status updates directly within your <Link href="/account" style={{ color: 'var(--colour-cognac)', textDecoration: 'underline' }}>THE COBBLEROAD Account</Link>.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              4. International Shipping Status
            </h2>
            <p>
              We are currently finalizing our international duty-paid global logistics pipeline to serve North America, Europe, the Middle East, and Southeast Asia. International orders will launch in the upcoming quarter. If you reside outside India and wish to arrange a private courier dispatch, please contact our concierge at <a href="mailto:concierge@cobleroad.com" style={{ color: 'var(--colour-cognac)', textDecoration: 'underline' }}>concierge@cobleroad.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
