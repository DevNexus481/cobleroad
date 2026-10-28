import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  CART_CONFIG,
  mergeGuestCartIntoUserCart,
  isValidUuid,
  getValidatedCart,
  getOrCreateCartRow,
} from '@/lib/cart/service'

export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — must be signed in to merge cart.' }, { status: 401 })
    }

    let guestSessionId: string | null = null

    // Check request body first
    try {
      const body = await req.json()
      if (body?.guestSessionId && isValidUuid(body.guestSessionId)) {
        guestSessionId = body.guestSessionId
      }
    } catch {
      // Body might be empty
    }

    // Fall back to cookie
    if (!guestSessionId) {
      const cookieStore = await cookies()
      const cookieVal = cookieStore.get(CART_CONFIG.GUEST_COOKIE_NAME)?.value
      if (cookieVal && isValidUuid(cookieVal)) {
        guestSessionId = cookieVal
      }
    }

    const adminClient = await createAdminClient()

    if (!guestSessionId) {
      // No guest cart to merge — return user's account cart
      const userCartRow = await getOrCreateCartRow(adminClient, { userId: user.id })
      const validatedCart = userCartRow ? await getValidatedCart(adminClient, userCartRow.id) : null
      return NextResponse.json({ cart: validatedCart, mergedCount: 0, warnings: [] })
    }

    const result = await mergeGuestCartIntoUserCart(adminClient, user.id, guestSessionId)

    const res = NextResponse.json({
      cart: result.cart,
      mergedCount: result.mergedLineCount,
      warnings: result.warnings,
    })

    // Establish fresh guest ID so subsequent logout starts clean
    res.cookies.set(CART_CONFIG.GUEST_COOKIE_NAME, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: CART_CONFIG.GUEST_COOKIE_MAX_AGE_SECONDS,
      path: '/',
    })

    return res
  } catch (err: any) {
    console.error('[API /api/cart/merge] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to merge cart.' }, { status: 500 })
  }
}
