'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const SHOP_LINKS = [
  { href: '/shop', label: 'All Products' },
  { href: '/collections/work-bags', label: 'Work Bags' },
  { href: '/collections/everyday-bags', label: 'Everyday Bags' },
  { href: '/collections/travel-essentials', label: 'Travel Essentials' },
  { href: '/collections/small-leather-goods', label: 'Small Leather Goods' },
]

const BRAND_LINKS = [
  { href: '/our-story', label: 'Our Story' },
  { href: '/leather-care', label: 'Leather Care' },
  { href: '/personalisation', label: 'Personalisation' },
  { href: '/contact', label: 'Contact' },
]

const POLICY_LINKS = [
  { href: '/policies/shipping', label: 'Shipping Policy' },
  { href: '/policies/returns', label: 'Returns & Exchanges' },
  { href: '/policies/privacy', label: 'Privacy Policy' },
  { href: '/policies/terms', label: 'Terms & Conditions' },
]

export function Footer() {
  const year = 2026

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container-site">
        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <span className="footer__wordmark">Cobleroad</span>
            <p className="footer__tagline">
              Genuine leather bags and accessories, crafted for those who carry with intention.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a
                href="#"
                aria-label="Cobleroad on Instagram"
                style={{ color: 'rgba(247,244,238,0.5)', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--colour-ivory)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,244,238,0.5)')}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Cobleroad on Facebook"
                style={{ color: 'rgba(247,244,238,0.5)', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--colour-ivory)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,244,238,0.5)')}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="mailto:hello@cobleroad.com"
                aria-label="Email Cobleroad"
                style={{ color: 'rgba(247,244,238,0.5)', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--colour-ivory)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,244,238,0.5)')}
              >
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <span className="footer__heading">Shop</span>
            <nav aria-label="Shop links">
              {SHOP_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Brand */}
          <div>
            <span className="footer__heading">The Brand</span>
            <nav aria-label="Brand links">
              {BRAND_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div>
            <span className="footer__heading">Policies</span>
            <nav aria-label="Policy links">
              {POLICY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Newsletter */}
        <div
          style={{
            borderTop: '1px solid rgba(247,244,238,0.08)',
            paddingTop: '2.5rem',
            marginBottom: '0',
          }}
        >
          <p
            style={{
              fontSize: '0.625rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--colour-cognac-light)',
              marginBottom: '0.75rem',
            }}
          >
            Newsletter
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgba(247,244,238,0.55)',
              marginBottom: '1rem',
              maxWidth: '40ch',
              lineHeight: 1.6,
            }}
          >
            New arrivals, leather care guides, and occasional stories about craft.
            Unsubscribe at any time.
          </p>
          <form
            action="/api/newsletter"
            method="POST"
            style={{ display: 'flex', gap: '0', maxWidth: '22rem' }}
            onSubmit={(e) => {
              e.preventDefault()
              // Will be handled by server route
            }}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: 'rgba(247,244,238,0.07)',
                border: '1px solid rgba(247,244,238,0.15)',
                borderRight: 'none',
                color: 'var(--colour-ivory)',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--colour-cognac)',
                color: 'var(--colour-ivory)',
                border: '1px solid var(--colour-cognac)',
                padding: '0.625rem 1.25rem',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <span>
            &copy; {year} Cobleroad. All rights reserved.
          </span>
          <span style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>India &amp; International</span>
            <span>Payments secured by Razorpay</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
