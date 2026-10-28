'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from './CartProvider'
import { QuickSearchModal } from './QuickSearchModal'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/leather-care', label: 'Leather Care' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const { itemCount, toggleCart } = useCart()

  // Initialize announcement bar visibility on mount without hydration mismatch
  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('cobleroad-dismiss-announcement')
      if (!isDismissed) {
        setShowAnnouncement(true)
      }
    } catch {
      setShowAnnouncement(true)
    }
  }, [])

  function handleDismissAnnouncement() {
    setShowAnnouncement(false)
    try {
      localStorage.setItem('cobleroad-dismiss-announcement', 'true')
    } catch {
      // Ignore private browsing storage error
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      {/* Announcement bar */}
      {showAnnouncement && (
        <div className="announcement-bar" role="banner" aria-label="Site announcement">
          <div className="container-site announcement-inner">
            <span className="announcement-text">
              Complimentary personalisation on eligible products &mdash; no additional charge.
            </span>
            <button
              type="button"
              onClick={handleDismissAnnouncement}
              className="announcement-close-btn"
              aria-label="Dismiss announcement"
              title="Dismiss announcement"
              id="dismiss-announcement-btn"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Main nav with frosted glassmorphism */}
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

          {/* Wordmark */}
          <Link href="/" className="nav-wordmark" aria-label="Cobleroad — home">
            Cobleroad
          </Link>

          {/* Desktop nav links with slide-in underline */}
          <div className="hidden lg:flex items-center gap-8" role="menubar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Instant Ambient Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="nav-icon-btn"
              aria-label="Search catalogue"
              id="nav-search-btn"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/account"
              className="nav-icon-btn"
              aria-label="My account"
              id="nav-account-btn"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>

            {/* Slide-over Cart Trigger */}
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
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

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
        {/* Drawer header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="nav-wordmark"
            onClick={() => setDrawerOpen(false)}
            style={{ fontSize: '1.25rem' }}
          >
            Cobleroad
          </Link>
          <button
            className="nav-icon-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Links */}
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-drawer-link"
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto pt-8 flex gap-4">
          <Link
            href="/account"
            className="nav-drawer-link"
            onClick={() => setDrawerOpen(false)}
            style={{ border: 'none', padding: 0, fontSize: '0.8125rem', opacity: 0.6 }}
          >
            Account
          </Link>
          <Link
            href="/search"
            className="nav-drawer-link"
            onClick={() => setDrawerOpen(false)}
            style={{ border: 'none', padding: 0, fontSize: '0.8125rem', opacity: 0.6 }}
          >
            Search
          </Link>
        </div>
      </div>
    </>
  )
}
