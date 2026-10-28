'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--colour-paper)',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '32rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--colour-cognac)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          Workshop Interruption
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            color: 'var(--colour-espresso)',
            marginBottom: '1.25rem',
          }}
        >
          Something Went Awry
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--colour-muted)',
            marginBottom: '2.5rem',
          }}
        >
          We encountered an unexpected error while preparing this page. Our team has been notified.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
