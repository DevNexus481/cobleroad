// =============================================================================
// COBLEROAD — Auth Helpers (Server-side)
// =============================================================================

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserProfile } from '@/types'

/**
 * Get the current authenticated user from the server session.
 * Returns null if not authenticated.
 */
export async function getServerUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get the current user's profile including role.
 * Returns null if not authenticated or profile not found.
 */
export async function getServerProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, role, created_at')
    .eq('id', user.id)
    .single()

  return profile as UserProfile | null
}

/**
 * Require authentication. Redirects to /auth/login if not authenticated.
 */
export async function requireAuth() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login')
  return user
}

/**
 * Require admin role. Redirects to / if not admin.
 * NEVER rely on client-supplied role claims.
 */
export async function requireAdmin() {
  const profile = await getServerProfile()
  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }
  return profile
}

/**
 * Check if current user is an admin (non-redirecting).
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getServerProfile()
  return profile?.role === 'admin'
}
