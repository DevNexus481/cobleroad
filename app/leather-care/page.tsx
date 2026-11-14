import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Droplets, Sun, Wind, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leather Care Guide — THE COBBLEROAD',
  description: 'Care, maintenance, and patina preservation instructions for your THE COBBLEROAD vegetable-tanned leather goods.',
}

export default function LeatherCarePage() {
  const steps = [
    {
      icon: <Wind size={22} strokeWidth={1.5} />,
      title: '1. Regular Dusting & Cleaning',
      desc: 'Use a soft, dry cotton cloth or horsehair brush once a week to gently sweep away dust and grit from seams. For light dirt, moisten a microfibre cloth with clean lukewarm water, wring out thoroughly, and wipe with gentle circular strokes. Allow to air-dry completely.',
    },
    {
      icon: <Sparkles size={22} strokeWidth={1.5} />,
      title: '2. Conditioning Every 3–6 Months',
      desc: 'Full-grain leather contains natural oils that can deplete over time in conditioned air or arid climates. Apply a dime-sized amount of natural beeswax or lanolin leather balm using a clean rag. Massage in circles, let sit for 15 minutes, then buff lightly to a satin sheen.',
    },
    {
      icon: <Droplets size={22} strokeWidth={1.5} />,
      title: '3. Handling Water & Rain Exposure',
      desc: 'If caught in sudden downpours, gently dab away excess droplets with an absorbent dry towel. Never rub vigorously. Hang or set your bag in an open, well-ventilated room to dry naturally at ambient room temperature.',
    },
    {
      icon: <Sun size={22} strokeWidth={1.5} />,
      title: '4. Mindful Storage & Resting',
      desc: 'When not in active rotation, store your bag in the breathable cotton dust bag provided. Lightly stuff the interior with acid-free unprinted tissue or clean cotton garments to maintain its architectural form. Store away from direct sunlight.',
    },
  ]

  const dosAndDonts = {
    dos: [
      'Condition your piece before and after periods of long travel or monsoon season.',
      'Embrace minor scuffs — gentle friction with the warmth of your thumb disperses natural oils into the scratch.',
      'Allow rain spots to dry naturally; as the leather absorbs ambient moisture, the color blends seamlessly into the patina.',
      'Keep heavy sharp objects inside organizer pouches to protect interior calfskin linings.',
    ],
    donts: [
      'NEVER use alcohol wipes, hand sanitizers, acetone, or household chemical sprays on genuine leather.',
      'NEVER place damp leather on radiators, near heating vents, or blow-dry with high heat, which causes brittle cracking.',
      'NEVER store in plastic bins or synthetic sealed bags where trapped humidity can breed mildew.',
      'Avoid prolonged direct exposure to scorching car dashboard sunbeds which bake out natural oils.',
    ],
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '5rem 0 3.5rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Artisan Longevity</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            The Living Care Guide
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', opacity: 0.85 }}>
            Vegetable-tanned leather is a natural, living material. With modest, thoughtful attention, your THE COBBLEROAD piece will not only withstand decades of daily use—it will develop a rich, luminous patina unique to your journey.
          </p>
        </div>
      </section>

      {/* 4 Core Care Pillars */}
      <section className="container-site section-padding" style={{ maxWidth: '60rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Rituals</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Four Principles of Leather Stewardship</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--colour-parchment)',
                border: '1px solid var(--colour-border)',
                padding: '2.25rem 1.75rem',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-paper)', borderRadius: '50%', color: 'var(--colour-cognac)', marginBottom: '1.25rem' }}>
                {s.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.75rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--colour-charcoal)', opacity: 0.85 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dos and Don'ts comparison */}
        <div style={{ border: '1px solid var(--colour-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '5rem' }}>
          <div style={{ padding: '1.75rem 2rem', backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400 }}>Essential Best Practices</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Do */}
            <div style={{ padding: '2rem', borderRight: '1px solid var(--colour-border)', backgroundColor: 'var(--colour-paper)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--colour-olive)', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <CheckCircle2 size={18} /> Recommended Care
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
                {dosAndDonts.dos.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--colour-charcoal)' }}>
                    <span style={{ color: 'var(--colour-olive)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Don't */}
            <div style={{ padding: '2rem', backgroundColor: 'var(--colour-paper)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <AlertTriangle size={18} /> Avoid Entirely
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
                {dosAndDonts.donts.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--colour-charcoal)' }}>
                    <span style={{ color: '#b91c1c', flexShrink: 0, marginTop: '2px' }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Concierge Support Callout */}
        <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '3rem 2.5rem', borderRadius: '2px', textAlign: 'center', border: '1px solid var(--colour-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.75rem' }}>
            Have a Specific Care Question?
          </h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.85, maxWidth: '32rem', margin: '0 auto 1.75rem' }}>
            Whether your bag endured a monsoon shower or you need advice on a stubborn stain, our master leatherworkers are at your service.
          </p>
          <Link href="/contact" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Speak with our Concierge <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
