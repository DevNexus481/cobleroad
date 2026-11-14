'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingBag, User, Package, ChevronDown } from 'lucide-react'
import { useCart } from './CartProvider'
import { QuickSearchModal } from './QuickSearchModal'
import { NAV_TAXONOMY } from '@/lib/navigation/taxonomy'

export const MAIN_NAV_ITEMS = NAV_TAXONOMY

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const { itemCount, toggleCart, currency, setCurrency } = useCart()

  function toggleMobileAccordion(label: string) {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

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
    } catch { }
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
          <Link href="/" className="nav-logo-wrap" aria-label="THE COBBLEROAD — home">
            <span className="nav-wordmark">THE COBBLEROAD</span>
            <span className="nav-logo-tagline">Leather · Craft · Journey</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7" role="menubar">
            {MAIN_NAV_ITEMS.map((item) => {
              const hasChildren = item.subItems && item.subItems.length > 0

              if (hasChildren) {
                const isOpen = activeDropdown === item.label
                return (
                  <div
                    key={item.label}
                    className="nav-dropdown-group"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onFocus={() => setActiveDropdown(item.label)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setActiveDropdown(null)
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-link ${isOpen ? 'active text-[var(--colour-espresso)]' : ''}`}
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={12}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </Link>

                    <div
                      className={`nav-dropdown-panel ${isOpen ? 'open' : ''}`}
                      role="menu"
                      aria-label={item.label}
                    >
                      <div className="nav-dropdown-inner">
                        {item.subItems!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="nav-dropdown-item"
                            role="menuitem"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                  role="menuitem"
                >
                  {item.label}
                </Link>
              )
            })}
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
            <span className="nav-wordmark" style={{ fontSize: '1.25rem' }}>THE COBBLEROAD</span>
            <span className="nav-logo-tagline">Leather · Craft · Journey</span>
          </Link>
          <button className="nav-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav aria-label="Mobile navigation" style={{ display: 'flex', flexDirection: 'column' }}>
          {MAIN_NAV_ITEMS.map((item) => {
            const hasChildren = item.subItems && item.subItems.length > 0
            const isExpanded = !!mobileExpanded[item.label]

            if (hasChildren) {
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--colour-border-light)',
                    }}
                  >
                    <Link
                      href={item.href}
                      className="nav-drawer-link"
                      style={{ borderBottom: 'none', flex: 1, paddingRight: '0.5rem' }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="nav-drawer-accordion-btn"
                      onClick={() => toggleMobileAccordion(item.label)}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${item.label} sub-menu`}
                    >
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          color: isExpanded ? 'var(--colour-cognac)' : 'inherit',
                        }}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="nav-drawer-sublist">
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="nav-drawer-sublink"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <span className="sublink-bullet">·</span>
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="nav-drawer-link"
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Secondary Atelier Navigation Links */}
          <div style={{ paddingTop: '1.25rem', marginTop: '0.75rem', borderTop: '1px solid var(--colour-border-light)' }}>
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--colour-charcoal)',
                opacity: 0.5,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              The Atelier
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Link
                href="/our-story"
                style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--colour-charcoal)',
                  padding: '0.375rem 0',
                }}
                onClick={() => setDrawerOpen(false)}
              >
                Our Story &amp; Craft
              </Link>
              <Link
                href="/leather-care"
                style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--colour-charcoal)',
                  padding: '0.375rem 0',
                }}
                onClick={() => setDrawerOpen(false)}
              >
                Leather Care
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--colour-charcoal)',
                  padding: '0.375rem 0',
                }}
                onClick={() => setDrawerOpen(false)}
              >
                Contact Concierge
              </Link>
            </div>
          </div>
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
