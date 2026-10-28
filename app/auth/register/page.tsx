'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SignUpSchema } from '@/lib/validation'

type SignUpData = z.infer<typeof SignUpSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
  })

  async function onSubmit(data: SignUpData) {
    setIsSubmitting(true)
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('An account with this email already exists. Please sign in.')
      } else {
        setServerError(error.message)
      }
      setIsSubmitting(false)
      return
    }

    setSuccess(true)
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: 'var(--colour-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '22rem' }}>
          <CheckCircle size={40} style={{ color: 'var(--colour-olive)', margin: '0 auto 1rem' }} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.75rem' }}>
            Check Your Email
          </h1>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, opacity: 0.7 }}>
            We&apos;ve sent a confirmation link to your email address. Click the link to activate your account.
          </p>
          <Link href="/auth/login" className="btn btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '70vh', backgroundColor: 'var(--colour-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '24rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-espresso)', textDecoration: 'none' }}>
            Cobleroad
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginTop: '1.5rem', marginBottom: '0.375rem' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.55 }}>Join to track orders and save addresses.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="full_name" className="form-label">Full Name</label>
            <input id="full_name" {...register('full_name')} className="form-input" autoComplete="name" placeholder="Jane Doe" />
            {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" {...register('email')} className="form-input" autoComplete="email" placeholder="you@example.com" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="form-input"
                autoComplete="new-password"
                placeholder="Min 8 characters"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} aria-label={showPassword ? 'Hide' : 'Show'} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: '#fff5f5', border: '1px solid #fcc', fontSize: '0.8125rem' }} role="alert">
              <AlertTriangle size={14} style={{ color: '#C0392B', flexShrink: 0, marginTop: '1px' }} />
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" id="register-submit-btn">
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', opacity: 0.65 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--colour-cognac)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
