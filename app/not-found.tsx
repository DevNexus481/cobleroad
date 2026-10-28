import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
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
          404 — Not Found
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
          This Path Has Ended
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--colour-muted)',
            marginBottom: '2.5rem',
          }}
        >
          The page you are looking for has moved, been archived, or does not exist in our workshop.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/shop" className="btn btn-primary" id="not-found-shop-btn">
            Explore Collection
          </Link>
          <Link href="/" className="btn btn-outline" id="not-found-home-btn">
            Return to Workshop
          </Link>
        </div>
      </div>
    </div>
  )
}
