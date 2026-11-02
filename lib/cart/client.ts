import type { ValidatedCart } from '@/types'

export async function fetchRemoteCart(): Promise<{
  cart: ValidatedCart | null
  isGuest: boolean
  guestSessionId: string
} | null> {
  try {
    const res = await fetch('/api/cart', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('[CartClient] fetchRemoteCart error:', err)
    return null
  }
}

export async function addRemoteCartItem(item: {
  productId: string
  variantId: string
  quantity: number
  personalisation?: { text: string; style: string | null } | null
  priceSnapshot?: { amountMinor: number; currency: any }
}): Promise<ValidatedCart | null> {
  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.cart
  } catch (err) {
    console.warn('[CartClient] addRemoteCartItem error:', err)
    return null
  }
}

export async function updateRemoteCartItem(
  cartItemId: string,
  quantity: number
): Promise<ValidatedCart | null> {
  try {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItemId, quantity }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.cart
  } catch (err) {
    console.warn('[CartClient] updateRemoteCartItem error:', err)
    return null
  }
}

export async function removeRemoteCartItem(cartItemId: string): Promise<ValidatedCart | null> {
  try {
    const res = await fetch(`/api/cart?id=${encodeURIComponent(cartItemId)}`, {
      method: 'DELETE',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.cart
  } catch (err) {
    console.warn('[CartClient] removeRemoteCartItem error:', err)
    return null
  }
}

export async function clearRemoteCart(): Promise<boolean> {
  try {
    const res = await fetch('/api/cart?clear=true', {
      method: 'DELETE',
    })
    return res.ok
  } catch (err) {
    console.warn('[CartClient] clearRemoteCart error:', err)
    return false
  }
}

export async function mergeGuestCartServer(
  guestSessionId?: string | null
): Promise<{ cart: ValidatedCart; warnings: string[] } | null> {
  try {
    const res = await fetch('/api/cart/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestSessionId }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('[CartClient] mergeGuestCartServer error:', err)
    return null
  }
}
