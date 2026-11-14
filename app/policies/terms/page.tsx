import type { Metadata } from 'next'
import Link from 'next/link'
import { FileCheck, Shield, Scale, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions — THE COBBLEROAD',
  description: 'Terms of sale, product authenticity guidelines, craftsmanship warranty, and service agreements.',
}

export default function TermsPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '4.5rem 0 3rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Legal Agreement</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
            Terms & Conditions of Service
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.75 }}>
            Last revised: October 2026 &bull; THE COBBLEROAD Goods & Atelier
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-site section-padding" style={{ maxWidth: '48rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.8, fontSize: '0.9375rem', color: 'var(--colour-charcoal)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              1. Scope & Acceptance
            </h2>
            <p>
              These Terms & Conditions govern your use of the website <strong>THE COBBLEROAD</strong> (accessible at <Link href="/" style={{ color: 'var(--colour-cognac)', textDecoration: 'underline' }}>cobleroad.com</Link>) and all purchases of handcrafted leather goods made through our online store. By browsing our catalogue, creating an account, or placing an order, you agree to be bound by these terms.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              2. Authentic Full-Grain Leather Characteristics
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              THE COBBLEROAD products are handcrafted exclusively from genuine, vegetable-tanned full-grain leather. Because leather is an organic material harvested from natural hides:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Subtle variations in grain density, natural neck growth marks, small healed scratches, and tone differences are authentic hallmarks of genuine hide, not manufacturing flaws.</li>
              <li>Vegetable-tanned leather naturally absorbs sunlight, skin oils, and ambient humidity. It is designed to deepen in shade and develop a smooth, lustrous patina with wear.</li>
              <li>We make every effort to display accurate product photography; however, individual display screens may slightly affect color temperature.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              3. Pricing, Taxes & Orders
            </h2>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>All prices displayed on the store are denominated in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) where applicable.</li>
              <li>Receipt of an order confirmation email indicates acknowledgment of your request; contract formation occurs upon dispatch of your goods from our atelier.</li>
              <li>THE COBBLEROAD reserves the right to decline or cancel orders resulting from typographical pricing errors or unexpected inventory discrepancies, with an immediate full refund.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              4. Lifetime Craftsmanship Warranty
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Every piece crafted by THE COBBLEROAD carries a Lifetime Craftsmanship Warranty against manufacturing defects under normal intended use:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Covered:</strong> Broken solid brass hardware, failed zippers, separated stitching, or detached handle rivets.</li>
              <li><strong>Not Covered:</strong> Cosmetic surface scratches from routine use, damage from chemical solvents, misuse, overloading, or unauthorized third-party repairs.</li>
            </ul>
            <p>
              In the event of a verified warranty claim, THE COBBLEROAD will repair the piece free of charge or replace it with an equivalent item if repair is unfeasible.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              5. Intellectual Property
            </h2>
            <p>
              All trademarks, product photography, editorial copy, silhouettes, and website designs are the exclusive intellectual property of THE COBBLEROAD. Unauthorized reproduction, scraping, or commercial duplication is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be interpreted and governed by the laws of India. Any legal dispute or claim arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts of Kanpur and Mumbai, India.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
