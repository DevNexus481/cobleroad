import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartItem, CurrencyCode } from '@/types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUuid(str?: string | null): boolean {
  if (!str) return false
  return UUID_REGEX.test(str)
}

function getItemKey(item: CartItem): string {
  const text = item.personalisation?.text?.trim().toUpperCase() || ''
  const style = item.personalisation?.style || ''
  return `${item.variant_id}::${text}::${style}`
}

/**
 * Merges two cart item lists (e.g. local guest items and server account items).
 * If an item exists in both lists, the higher quantity is retained.
 */
export function mergeCartItems(localItems: CartItem[], serverItems: CartItem[]): CartItem[] {
  const mergedMap = new Map<string, CartItem>()

  for (const item of serverItems) {
    mergedMap.set(getItemKey(item), { ...item })
  }

  for (const item of localItems) {
    const key = getItemKey(item)
    const existing = mergedMap.get(key)
    if (existing) {
      mergedMap.set(key, {
        ...existing,
        quantity: Math.max(existing.quantity, item.quantity),
      })
    } else {
      mergedMap.set(key, { ...item })
    }
  }

  return Array.from(mergedMap.values())
}

/**
 * Fetches the user's cart from Supabase. Creates one if not present.
 */
export async function fetchServerCart(
  supabase: SupabaseClient,
  userId: string
): Promise<{ cartId: string; items: CartItem[] } | null> {
  try {
    // 1. Get or create cart row
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id, currency')
      .eq('user_id', userId)
      .maybeSingle()

    if (cartError) {
      console.warn('[CartSync] Failed to fetch cart row:', cartError.message)
      return null
    }

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId, currency: 'INR' })
        .select('id, currency')
        .single()

      if (createError) {
        console.warn('[CartSync] Failed to create new user cart:', createError.message)
        return null
      }
      cart = newCart
    }

    if (!cart?.id) return null

    // 2. Fetch cart items with product & variant details
    const { data: rawItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        variant_id,
        quantity,
        personalisation,
        price_minor_snapshot,
        currency_snapshot,
        products (
          id,
          slug,
          name,
          is_demo,
          product_images (
            id,
            url,
            alt,
            sort_order
          )
        ),
        product_variants (
          id,
          sku,
          colour,
          size,
          stock_quantity
        )
      `)
      .eq('cart_id', cart.id)

    if (itemsError) {
      console.warn('[CartSync] Failed to fetch cart items:', itemsError.message)
      return { cartId: cart.id, items: [] }
    }

    const items: CartItem[] = (rawItems || []).map((row: any) => {
      const product = row.products || {}
      const variant = row.product_variants || {}
      const images = (product.product_images || []).sort(
        (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
      const primaryImage = images[0] || null

      return {
        id: row.id,
        product_id: row.product_id,
        variant_id: row.variant_id,
        quantity: row.quantity || 1,
        personalisation: row.personalisation
          ? {
              text: row.personalisation.text || '',
              style: row.personalisation.style || null,
            }
          : null,
        price_snapshot: {
          amountMinor: row.price_minor_snapshot ?? 0,
          currency: (row.currency_snapshot || 'INR') as CurrencyCode,
        },
        product: {
          id: product.id || row.product_id,
          slug: product.slug || '',
          name: product.name || 'Cobleroad Piece',
          is_demo: Boolean(product.is_demo),
        },
        variant: {
          id: variant.id || row.variant_id,
          sku: variant.sku || null,
          colour: variant.colour || null,
          size: variant.size || null,
          stock_quantity: variant.stock_quantity ?? 10,
        },
        primary_image: primaryImage
          ? {
              id: primaryImage.id || row.product_id,
              url: primaryImage.url,
              alt: primaryImage.alt || product.name || '',
              product_id: product.id || row.product_id,
              sort_order: primaryImage.sort_order ?? 0,
              created_at: '',
            }
          : null,
      }
    })

    return { cartId: cart.id, items }
  } catch (err) {
    console.warn('[CartSync] Exception in fetchServerCart:', err)
    return null
  }
}

/**
 * Saves current cart items to Supabase under the user's cart.
 * Reconciles additions, updates, and removals.
 */
export async function syncCartToServer(
  supabase: SupabaseClient,
  cartId: string,
  items: CartItem[]
): Promise<void> {
  if (!cartId || !isValidUuid(cartId)) return

  try {
    // Only sync items that have valid UUIDs in DB
    const validItems = items.filter(
      (item) => isValidUuid(item.product_id) && isValidUuid(item.variant_id)
    )

    // 1. Fetch current existing items in this cart to diff
    const { data: existingRows } = await supabase
      .from('cart_items')
      .select('id, variant_id, personalisation')
      .eq('cart_id', cartId)

    const existingMap = new Map<string, string>() // key -> id
    if (existingRows) {
      for (const row of existingRows) {
        const text = row.personalisation?.text?.trim().toUpperCase() || ''
        const style = row.personalisation?.style || ''
        existingMap.set(`${row.variant_id}::${text}::${style}`, row.id)
      }
    }

    const currentKeys = new Set<string>()

    // 2. Upsert each valid item
    for (const item of validItems) {
      const key = getItemKey(item)
      currentKeys.add(key)
      const existingId = existingMap.get(key)

      const payload = {
        cart_id: cartId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        personalisation: item.personalisation || null,
        price_minor_snapshot: item.price_snapshot.amountMinor,
        currency_snapshot: item.price_snapshot.currency,
      }

      if (existingId) {
        await supabase
          .from('cart_items')
          .update(payload)
          .eq('id', existingId)
      } else {
        await supabase
          .from('cart_items')
          .insert(payload)
      }
    }

    // 3. Delete items from DB that are no longer in cart
    if (existingRows) {
      const toDeleteIds: string[] = []
      for (const row of existingRows) {
        const text = row.personalisation?.text?.trim().toUpperCase() || ''
        const style = row.personalisation?.style || ''
        const key = `${row.variant_id}::${text}::${style}`
        if (!currentKeys.has(key)) {
          toDeleteIds.push(row.id)
        }
      }

      if (toDeleteIds.length > 0) {
        await supabase
          .from('cart_items')
          .delete()
          .in('id', toDeleteIds)
      }
    }
  } catch (err) {
    console.warn('[CartSync] Background sync to server failed:', err)
  }
}
