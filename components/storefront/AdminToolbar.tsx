'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Plus, Package, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AdminToolbar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          setIsAdmin(true)
        }
      } catch {
        // Not admin
      }
    }

    checkAdmin()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        checkAdmin()
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!isAdmin) return null

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Open Store Manager"
        title="Open Store Manager"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          backgroundColor: 'var(--colour-espresso)',
          color: 'var(--colour-ivory)',
          border: '1px solid rgba(247,244,238,0.2)',
          borderRadius: '999px',
          padding: '0.625rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Shield size={18} style={{ color: 'var(--colour-cognac-light)' }} />
      </button>
    )
  }

  return (
    <aside
      aria-label="Store Manager Quick Controls"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        backgroundColor: 'var(--colour-espresso)',
        color: 'var(--colour-ivory)',
        borderRadius: '999px',
        padding: '0.375rem 0.5rem 0.375rem 1rem',
        boxShadow: '0 12px 32px rgba(26,22,19,0.35)',
        border: '1px solid rgba(247,244,238,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.75rem',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <Shield size={14} style={{ color: 'var(--colour-cognac-light)' }} />
        <span style={{ fontWeight: 600, letterSpacing: '0.04em', color: 'var(--colour-ivory)' }}>
          Store Manager
        </span>
      </div>

      <div style={{ height: '1rem', width: '1px', backgroundColor: 'rgba(247,244,238,0.2)' }} />

      <Link
        href="/admin/products/new"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: 'var(--colour-ivory)',
          textDecoration: 'none',
          padding: '0.25rem 0.625rem',
          backgroundColor: 'var(--colour-cognac)',
          borderRadius: '999px',
          fontWeight: 500,
          transition: 'opacity 0.15s ease',
        }}
      >
        <Plus size={12} strokeWidth={2.5} />
        <span>Add Piece</span>
      </Link>

      <Link
        href="/admin/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: 'var(--colour-ivory)',
          textDecoration: 'none',
          padding: '0.25rem 0.5rem',
          opacity: 0.85,
          fontWeight: 400,
        }}
      >
        <Package size={13} />
        <span>Manage Pieces</span>
      </Link>

      <button
        type="button"
        onClick={() => setMinimized(true)}
        aria-label="Minimize store manager"
        title="Minimize"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--colour-ivory)',
          opacity: 0.5,
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={13} />
      </button>
    </aside>
  )
}
