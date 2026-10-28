import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  CART_CONFIG,
  getValidatedCart,
  getOrCreateCartRow,
  addItemToServerCart,
  updateLineQuantity,
  removeLineItem,
  clearAllItems,
  isValidUuid,
} from '@/lib/cart/service'

function getOrCreateGuestSessionId(cookieStore: any): { sessionId: string; isNew: boolean } {
  let cookieVal = cookieStore.get(CART_CONFIG.GUEST_COOKIE_NAME)?.value
  if (cookieVal && isValidUuid(cookieVal)) {
    return { sessionId: cookieVal, isNew: false }
  }
  const newId = crypto.randomUUID()
  return { sessionId: newId, isNew: true }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const { sessionId, isNew } = getOrCreateGuestSessionId(cookieStore)

    // Check user authentication
    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    const adminClient = await createAdminClient()

    const context = {
      userId: user?.id ?? null,
      guestSessionId: sessionId,
      currency: 'INR' as const,
    }

    const cartRow = await getOrCreateCartRow(adminClient, context)
    const validatedCart = cartRow ? await getValidatedCart(adminClient, cartRow.id) : null

    const res = NextResponse.json({
      cart: validatedCart,
      isGuest: !user,
      guestSessionId: sessionId,
    })

    if (isNew) {
      res.cookies.set(CART_CONFIG.GUEST_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: CART_CONFIG.GUEST_COOKIE_MAX_AGE_SECONDS,
        path: '/',
      })
    }

    return res
  } catch (err: any) {
    console.error('[API /api/cart GET] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, variantId, quantity, personalisation, priceSnapshot } = body

    if (!productId || !variantId) {
      return NextResponse.json({ error: 'Missing productId or variantId' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const { sessionId, isNew } = getOrCreateGuestSessionId(cookieStore)

    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    const adminClient = await createAdminClient()

    const context = {
      userId: user?.id ?? null,
      guestSessionId: sessionId,
      currency: 'INR' as const,
    }

    const updatedCart = await addItemToServerCart(adminClient, context, {
      productId,
      variantId,
      quantity: Number(quantity) || 1,
      personalisation,
      priceSnapshot,
    })

    const res = NextResponse.json({ cart: updatedCart })

    if (isNew) {
      res.cookies.set(CART_CONFIG.GUEST_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: CART_CONFIG.GUEST_COOKIE_MAX_AGE_SECONDS,
        path: '/',
      })
    }

    return res
  } catch (err: any) {
    console.error('[API /api/cart POST] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to add item' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { cartItemId, quantity } = body

    if (!cartItemId) {
      return NextResponse.json({ error: 'Missing cartItemId' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const { sessionId } = getOrCreateGuestSessionId(cookieStore)

    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    const adminClient = await createAdminClient()

    const context = {
      userId: user?.id ?? null,
      guestSessionId: sessionId,
      currency: 'INR' as const,
    }

    const updatedCart = await updateLineQuantity(
      adminClient,
      context,
      cartItemId,
      Number(quantity)
    )

    return NextResponse.json({ cart: updatedCart })
  } catch (err: any) {
    console.error('[API /api/cart PATCH] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update item' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cartItemId = searchParams.get('id')
    const clearAll = searchParams.get('clear') === 'true'

    const cookieStore = await cookies()
    const { sessionId } = getOrCreateGuestSessionId(cookieStore)

    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    const adminClient = await createAdminClient()

    const context = {
      userId: user?.id ?? null,
      guestSessionId: sessionId,
      currency: 'INR' as const,
    }

    if (clearAll) {
      await clearAllItems(adminClient, context)
      return NextResponse.json({ success: true })
    }

    if (!cartItemId) {
      return NextResponse.json({ error: 'Missing cartItemId' }, { status: 400 })
    }

    const updatedCart = await removeLineItem(adminClient, context, cartItemId)
    return NextResponse.json({ cart: updatedCart })
  } catch (err: any) {
    console.error('[API /api/cart DELETE] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to remove item' }, { status: 400 })
  }
}
