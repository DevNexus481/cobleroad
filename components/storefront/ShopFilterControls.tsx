'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react'
import type { RecommendationChip } from '@/lib/navigation/taxonomy'

export interface SortOption {
  value: string
  label: string
}

export interface ShopFilterControlsProps {
  chips: RecommendationChip[]
  sortOptions: SortOption[]
  currentSort: string
  currentQuery?: string
}

export function ShopFilterControls({
  chips,
  sortOptions,
  currentSort,
  currentQuery,
}: ShopFilterControlsProps) {
  const router = useRouter()
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  function navigateToChip(href: string) {
    if (currentQuery) {
      const separator = href.includes('?') ? '&' : '?'
      router.push(`${href}${separator}q=${encodeURIComponent(currentQuery)}`)
    } else {
      router.push(href)
    }
  }

  function updateSort(sortValue: string) {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (sortValue && sortValue !== 'featured') {
      url.searchParams.set('sort', sortValue)
    } else {
      url.searchParams.delete('sort')
    }
    router.push(url.pathname + url.search)
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentSortLabel =
    sortOptions.find((o) => o.value === currentSort)?.label ?? 'Featured'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Dynamic Context-Aware Recommendation Chips */}
      <div className="filter-chip-group" role="tablist" aria-label="Category recommendation filters">
        {chips.map((chip) => (
          <button
            key={chip.slug || 'all'}
            type="button"
            role="tab"
            aria-selected={chip.isActive}
            className={`filter-chip ${chip.isActive ? 'active' : ''}`}
            onClick={() => navigateToChip(chip.href)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Custom Luxury Sort Dropdown */}
      <div ref={sortRef} style={{ position: 'relative', marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={() => setSortOpen(!sortOpen)}
          className="luxury-select-btn"
          aria-haspopup="listbox"
          aria-expanded={sortOpen}
          aria-label={`Sort by: ${currentSortLabel}`}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <SlidersHorizontal size={13} style={{ opacity: 0.6 }} />
            <span>Sort: <strong>{currentSortLabel}</strong></span>
          </span>
          <ChevronDown
            size={14}
            style={{
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: sortOpen ? 'rotate(180deg)' : 'rotate(0)',
              opacity: 0.6,
            }}
          />
        </button>

        {sortOpen && (
          <div
            role="listbox"
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 0.375rem)',
              backgroundColor: 'var(--colour-paper)',
              border: '1px solid var(--colour-border)',
              borderRadius: '2px',
              boxShadow: '0 8px 24px rgba(43, 33, 29, 0.12)',
              minWidth: '12rem',
              zIndex: 30,
              overflow: 'hidden',
              animation: 'modalSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {sortOptions.map((opt) => {
              const isSelected = currentSort === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    updateSort(opt.value)
                    setSortOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    background: isSelected ? 'var(--colour-parchment)' : 'none',
                    border: 'none',
                    color: isSelected ? 'var(--colour-espresso)' : 'var(--colour-charcoal)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 600 : 400,
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--colour-ivory)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={13} style={{ color: 'var(--colour-cognac)' }} />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
