// =============================================================================
// COBLEROAD — Supabase Browser Client
// Used in Client Components only.
// =============================================================================

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const url = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''

  return createBrowserClient(url, key)
}
