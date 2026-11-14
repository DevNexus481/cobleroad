import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock, Shield, EyeOff, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — THE COBBLEROAD',
  description: 'How THE COBBLEROAD collects, protects, and handles your personal information with absolute discretion.',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '4.5rem 0 3rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Data Protection</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
            Privacy & Data Policy
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.75 }}>
            Last revised: October 2026 &bull; Strict Discretion Standard
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-site section-padding" style={{ maxWidth: '48rem' }}>
        {/* Core Principles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <Lock size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Zero Card Storage</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>We never store payment card numbers or banking secrets on our servers. All transactions are PCI-DSS Level 1 tokenized.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <EyeOff size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Never Sold or Traded</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>Your email, phone number, and address are solely utilized to craft and deliver your orders.</p>
          </div>
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '1.75rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            <Shield size={22} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Customer Rights</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, opacity: 0.8 }}>You can request access, corrections, or full deletion of your customer profile at any time.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.8, fontSize: '0.9375rem', color: 'var(--colour-charcoal)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              When you purchase a piece or register an account at THE COBBLEROAD, we collect only the information essential for creating and delivering your order:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Contact Information:</strong> Full name, email address, and mobile phone number for shipping notifications and order updates.</li>
              <li><strong>Delivery Details:</strong> Physical shipping and billing addresses for dispatch via our trusted logistics carriers.</li>
              <li><strong>Customisation Instructions:</strong> Chosen initials or monogram text requested for embossing.</li>
              <li><strong>Order History:</strong> Record of items purchased, dates, and order numbers for warranty tracking and customer service.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              2. Payment Information & Security
            </h2>
            <p>
              All online payment processing is handled externally via <strong>Razorpay</strong>, which adheres strictly to PCI-DSS Level 1 compliance (the most rigorous industry security standard). THE COBBLEROAD does not see, transmit, or retain your raw debit/credit card numbers, expiry dates, or CVV codes. All payments are encrypted end-to-end using 256-bit SSL protocols.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              3. How We Share Your Information
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We share your details exclusively with service providers directly required to fulfill your order:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Courier & Fulfillment Partners (Blue Dart, Delhivery):</strong> Shared strictly for doorstep delivery and real-time SMS tracking updates.</li>
              <li><strong>SMS & Email Gateways:</strong> Used solely to transmit transactional order receipts and dispatch tracking links.</li>
            </ul>
            <p>
              We will never sell, lease, or distribute your private contact details to advertising brokers, spam networks, or third-party marketers.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              4. Cookies & Session Storage
            </h2>
            <p>
              Our website uses essential session cookies to remember the contents of your shopping bag as you browse between pages, maintain your sign-in authentication session securely, and recognize your preferred market/currency settings. We do not engage in invasive tracking across third-party websites.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--colour-espresso)', marginBottom: '0.75rem' }}>
              5. Your Privacy Rights
            </h2>
            <p>
              Under Indian digital data protection standards and international privacy best practices, you possess the right to review, update, or request the permanent deletion of your customer profile and mailing preferences. To exercise any of these rights, contact our Data Privacy Officer at <a href="mailto:privacy@cobleroad.com" style={{ color: 'var(--colour-cognac)', textDecoration: 'underline' }}>privacy@cobleroad.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
