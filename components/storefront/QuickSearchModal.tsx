'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react'

interface QuickSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SEARCH_SUGGESTIONS = [
  'Briefcase',
  'Laptop Bag',
  'Tote',
  'Backpack',
  'Messenger',
  'Duffle',
  'Wallet',
  'Passport',
]

const FEATURED_ITEMS = [
  { slug: 'advocate-briefcase', name: 'The Advocate Briefcase', category: 'Work Bags', price: '₹12,999', image: '/images/hero/hero-briefcase.jpg' },
  { slug: 'meridian-laptop-bag', name: 'The Meridian Laptop Bag', category: 'Work Bags', price: '₹10,999', image: '/images/products/laptop-bag.jpg' },
  { slug: 'marlow-tote', name: 'The Marlow Tote', category: 'Everyday Bags', price: '₹8,999', image: '/images/products/tote-espresso.jpg' },
  { slug: 'meridian-duffle', name: 'The Meridian Duffle', category: 'Travel Essentials', price: '₹15,999', image: '/images/products/duffle-travel.jpg' },
]

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const filteredPreview = query.trim()
    ? FEATURED_ITEMS.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase()))
    : FEATURED_ITEMS

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search catalog">
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="search-modal-form">
          <Search size={22} strokeWidth={1.5} className="search-icon" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search full-grain leather pieces, styles, or collections..."
            className="search-modal-input"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="search-clear-btn"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="search-kbd-hint">ESC</kbd>
          )}
        </form>

        {/* Suggestions Bar */}
        <div className="search-modal-suggestions">
          <span style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Popular:</span>
          {SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                onClose()
                router.push(`/search?q=${encodeURIComponent(term)}`)
              }}
              className="suggestion-chip"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Live / Curated Preview */}
        <div className="search-modal-results">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.6 }}>
              {query.trim() ? `Matching Pieces (${filteredPreview.length})` : 'Curated Atelier Highlights'}
            </span>
            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                }}
                style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                View all results <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {filteredPreview.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                onClick={onClose}
                className="search-result-card"
              >
                <div style={{ position: 'relative', width: '3.75rem', height: '3.75rem', borderRadius: '2px', overflow: 'hidden', backgroundColor: 'var(--colour-parchment)', flexShrink: 0 }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="60px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.6875rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.category}</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--colour-espresso)' }}>{item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="search-modal-footer">
          <span>Press <strong>Enter</strong> to search &bull; <strong>ESC</strong> to exit</span>
        </div>
      </div>
    </div>
  )
}
