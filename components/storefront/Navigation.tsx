'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingBag, User, Package } from 'lucide-react'
import { useCart } from './CartProvider'
import { QuickSearchModal } from './QuickSearchModal'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/our-story', label: 'Craft' },
  { href: '/leather-care', label: 'Leather Care' },
  { href: '/contact', label: 'Contact' },
]

const ANNOUNCEMENT_ITEMS = [
  'Complimentary Personalisation on Selected Products',
  'Free Shipping on Orders Above \u20B95,000',
  'Crafted for a Lifetime',
]

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const { itemCount, toggleCart, currency, setCurrency } = useCart()

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('cobleroad-dismiss-announcement')
      if (!isDismissed) setShowAnnouncement(true)
    } catch {
      setShowAnnouncement(true)
    }
  }, [])

  // Cycle single announcement on mobile
  useEffect(() => {
    if (!showAnnouncement) return
    const timer = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % ANNOUNCEMENT_ITEMS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [showAnnouncement])

  function handleDismissAnnouncement() {
    setShowAnnouncement(false)
    try {
      localStorage.setItem('cobleroad-dismiss-announcement', 'true')
    } catch {}
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      {/* 3-column Announcement bar */}
      {showAnnouncement && (
        <div className="announcement-bar" role="banner" aria-label="Site announcement">
          <div className="announcement-inner">
            {/* Desktop 3-col */}
            <div className="announcement-3col">
              {ANNOUNCEMENT_ITEMS.map((item, i) => (
                <div key={i} className="announcement-col">
                  <Package size={11} strokeWidth={1.5} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {/* Mobile single cycling */}
            <div className="announcement-3col-single">
              <span className="announcement-text">{ANNOUNCEMENT_ITEMS[announcementIndex]}</span>
            </div>
            <button
              type="button"
              onClick={handleDismissAnnouncement}
              className="announcement-close-btn"
              aria-label="Dismiss announcement"
              id="dismiss-announcement-btn"
            >
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav
        className={`nav-root ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-site nav-inner">
          {/* Mobile: hamburger */}
          <button
            id="nav-menu-btn"
            className="nav-icon-btn lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Logo lockup */}
          <Link href="/" className="nav-logo-wrap" aria-label="Cobleroad — home">
            <span className="nav-wordmark">Cobleroad</span>
            <span className="nav-logo-tagline">Leather · Craft · Journey</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8" role="menubar">
            {NAV_LINKS.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="nav-link" role="menuitem">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* INR currency indicator */}
            {/* Currency Selector */}
            <button
              type="button"
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[0.6875rem] font-medium tracking-[0.08em] transition-all"
              style={{
                border: '1px solid var(--colour-border)',
                backgroundColor: 'var(--colour-parchment)',
                color: 'var(--colour-espresso)',
                cursor: 'pointer',
              }}
              title={`Currently viewing in ${currency}. Click to switch to ${currency === 'INR' ? 'USD ($)' : 'INR (₹)'}.`}
              aria-label={`Switch currency from ${currency}`}
            >
              <span>{currency === 'INR' ? '🇮🇳 INR ₹' : '🌐 USD $'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="nav-icon-btn"
              aria-label="Search catalogue"
              id="nav-search-btn"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>


            <Link href="/account" className="nav-icon-btn" aria-label="My account" id="nav-account-btn">
              <User size={18} strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              onClick={toggleCart}
              className="nav-icon-btn"
              aria-label={`Shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              id="nav-cart-btn"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="nav-cart-count" aria-hidden="true">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Mobile overlay */}
      <div
        className={`nav-overlay ${drawerOpen ? 'open' : ''}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`nav-drawer ${drawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={drawerOpen}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="nav-logo-wrap" onClick={() => setDrawerOpen(false)}>
            <span className="nav-wordmark" style={{ fontSize: '1.25rem' }}>Cobleroad</span>
            <span className="nav-logo-tagline">Leather · Craft · Journey</span>
          </Link>
          <button className="nav-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={`mobile-${link.href}-${link.label}`}
              href={link.href}
              className="nav-drawer-link"
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-2">
          {/* Mobile Currency Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--colour-border-light)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Currency</span>
            <button
              type="button"
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                border: '1px solid var(--colour-border)',
                backgroundColor: 'var(--colour-parchment)',
                borderRadius: '2px',
                fontWeight: 600,
                color: 'var(--colour-espresso)',
                cursor: 'pointer',
              }}
            >
              {currency === 'INR' ? '🇮🇳 INR (₹)' : '🌐 USD ($)'}
            </button>
          </div>

          <div className="flex gap-4 pt-2">
            <Link href="/account" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}
              style={{ border: 'none', padding: 0, fontSize: '0.8125rem', opacity: 0.6 }}>
              Account
            </Link>
            <Link href="/search" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}
              style={{ border: 'none', padding: 0, fontSize: '0.8125rem', opacity: 0.6 }}>
              Search
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
