// =============================================================================
// COBLEROAD — Supabase Server Client
// Used in Server Components, Route Handlers, and Server Actions.
// =============================================================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return !!(
    url &&
    !url.includes('your-project') &&
    url.startsWith('http') &&
    key &&
    !key.includes('your-anon-public-key') &&
    !key.includes('your-publishable-key')
  )
}

function getCleanSupabaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  return rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

/**
 * Server client using the anon / publishable key — respects RLS.
 * Use this for all user-facing server operations.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const url = getCleanSupabaseUrl()
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'placeholder-anon-key'

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore cookie errors in Server Components (read-only context)
        }
      },
    },
  })
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Admin server client using the service-role key — bypasses RLS.
 * NEVER expose this to the browser. Only use in trusted server contexts.
 * Always validate admin role separately before calling admin operations.
 */
export async function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  const url = getCleanSupabaseUrl()

  return createSupabaseClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
