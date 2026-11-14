'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, CheckCircle2, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'product_consultation',
    message: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)', color: 'var(--colour-espresso)' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--colour-parchment)', borderBottom: '1px solid var(--colour-border)', padding: '5rem 0 3.5rem' }}>
        <div className="container-site" style={{ maxWidth: '44rem', textAlign: 'center' }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Client Services</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Contact the Atelier
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--colour-charcoal)', opacity: 0.85 }}>
            Our team is at your disposal for leather consultation, order assistance, custom monogramming inquiries, or bespoke corporate commissions.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container-site section-padding" style={{ maxWidth: '64rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column: Direct Contact & Locations */}
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Direct Inquiries</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '2rem' }}>
              We Are Here to Assist You
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-parchment)', borderRadius: '50%', color: 'var(--colour-cognac)', flexShrink: 0 }}>
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Electronic Mail</h4>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '0.25rem' }}>General & Orders: <a href="mailto:concierge@cobleroad.com" style={{ textDecoration: 'underline' }}>concierge@cobleroad.com</a></p>
                  <p style={{ fontSize: '0.8125rem', opacity: 0.6 }}>Typically answered within 4 business hours.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-parchment)', borderRadius: '50%', color: 'var(--colour-cognac)', flexShrink: 0 }}>
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Direct Line & WhatsApp</h4>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '0.25rem' }}>
                    <a href="tel:+919820012345" style={{ textDecoration: 'none', color: 'inherit' }}>+91 98200 12345</a>
                  </p>
                  <a
                    href="https://wa.me/919820012345?text=Hello%20THE%20COBBLEROAD,%20I%20have%20an%20inquiry%20regarding%20your%20leathercraft."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.875rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
                  >
                    <MessageSquare size={14} /> Message on WhatsApp
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-parchment)', borderRadius: '50%', color: 'var(--colour-cognac)', flexShrink: 0 }}>
                  <Clock size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Atelier Hours</h4>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.85 }}>Monday through Saturday</p>
                  <p style={{ fontSize: '0.8125rem', opacity: 0.6 }}>10:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--colour-parchment)', borderRadius: '50%', color: 'var(--colour-cognac)', flexShrink: 0 }}>
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Studio & Workshop</h4>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--colour-charcoal)', opacity: 0.85 }}>THE COBBLEROAD Leatherworks, 42 Civil Lines, Kanpur, UP, India</p>
                  <p style={{ fontSize: '0.8125rem', opacity: 0.6 }}>Flagship showroom appointments available upon request.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div style={{ backgroundColor: 'var(--colour-parchment)', padding: '2.5rem 2rem', borderRadius: '2px', border: '1px solid var(--colour-border)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(74, 94, 66, 0.15)', color: 'var(--colour-olive)' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.75rem' }}>Message Received</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--colour-charcoal)', opacity: 0.85, marginBottom: '2rem' }}>
                  Thank you for reaching out to THE COBBLEROAD. An artisan client specialist will review your inquiry and reply to <strong>{formData.email}</strong> within four business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', phone: '', subject: 'product_consultation', message: '' })
                  }}
                  className="btn btn-secondary"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.25rem' }}>Send a Message</h3>
                <p style={{ fontSize: '0.8125rem', opacity: 0.7, marginBottom: '1rem' }}>Please fill in the details below and we will connect with you promptly.</p>

                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Full Name <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Alok Sharma"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.375rem' }}>
                      Email Address <span style={{ color: '#b91c1c' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="alok@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.375rem' }}>
                      Phone (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    style={{ backgroundColor: 'white' }}
                  >
                    <option value="product_consultation">Product Consultation & Sizing</option>
                    <option value="order_status">Existing Order & Shipping Inquiry</option>
                    <option value="custom_monogramming">Custom Monogramming / Personalisation</option>
                    <option value="corporate_gifting">Corporate / Bespoke Bulk Commissions</option>
                    <option value="care_repairs">Leather Care, Buffing & Restoration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Your Message <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    placeholder="How may our artisans assist you today?"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}
                >
                  {isSubmitting ? 'Sending Dispatch...' : <>Send Message <Send size={15} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
