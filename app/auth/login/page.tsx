'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SignInSchema } from '@/lib/validation'

type SignInData = z.infer<typeof SignInSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  })

  async function onSubmit(data: SignInData) {
    setIsSubmitting(true)
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError('Invalid email or password. Please try again.')
      setIsSubmitting(false)
      return
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '70vh', backgroundColor: 'var(--colour-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '24rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--colour-espresso)', textDecoration: 'none' }}>
            Cobleroad
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginTop: '1.5rem', marginBottom: '0.375rem' }}>
            Sign In
          </h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.55 }}>Access your account and orders.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colour-charcoal)', opacity: 0.5 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <Link href="/auth/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--colour-cognac)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: '#fff5f5', border: '1px solid #fcc', fontSize: '0.8125rem' }} role="alert">
              <AlertTriangle size={14} style={{ color: '#C0392B', flexShrink: 0, marginTop: '1px' }} />
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" id="login-submit-btn">
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', opacity: 0.65 }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={{ color: 'var(--colour-cognac)', textDecoration: 'none', fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
