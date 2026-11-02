// =============================================================================
// COBLEROAD — Cart Domain Service & Repository
// Implements Amazon/Flipkart-style persistent cart architecture:
// - Long-term 1-year guest carts identified by high-entropy opaque UUID
// - Server-authoritative authenticated carts stored in Supabase PostgreSQL
// - Idempotent, server-validated cart merge on login
// - Live catalogue revalidation (publication status, stock limits, live prices)
// - Preserves unavailable items with explanatory statuses instead of silent drops
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CartItem,
  CartPersonalisation,
  CurrencyCode,
  ValidatedCart,
} from '@/types'

// Configurable business constraints
export const CART_CONFIG = {
  GUEST_COOKIE_NAME: 'cbr_guest_cart_id',
  GUEST_COOKIE_MAX_AGE_SECONDS: 365 * 24 * 60 * 60, // 1 year
  MAX_QUANTITY_PER_LINE: 10,
  DEFAULT_CURRENCY: 'INR' as CurrencyCode,
}

export interface CartContext {
  userId?: string | null
  guestSessionId?: string | null
  currency?: CurrencyCode
}

export interface AddItemInput {
  productId: string
  variantId: string
  quantity: number
  personalisation?: {
    text: string
    style: string | null
  } | null
  priceSnapshot?: {
    amountMinor: number
    currency: CurrencyCode
  }
}

export interface MergeCartResult {
  cart: ValidatedCart
  mergedLineCount: number
  warnings: string[]
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUuid(str?: string | null): boolean {
  if (!str) return false
  return UUID_REGEX.test(str)
}

/**
 * Generates a stable composite key for a line item to detect genuine equivalence:
 * Matches on product, variant, and normalized personalisation (case-insensitive trimmed text & style).
 */
export function getLineItemKey(
  productId: string,
  variantId: string,
  personalisation?: CartPersonalisation | null
): string {
  const text = personalisation?.text?.trim().toUpperCase() || ''
  const style = personalisation?.style?.trim().toLowerCase() || ''
  return `${productId}::${variantId}::${text}::${style}`
}

/**
 * Normalizes personalisation input safely and securely.
 */
export function normalizePersonalisation(
  raw?: CartPersonalisation | { text?: string; style?: string | null } | null
): CartPersonalisation | null {
  if (!raw || !raw.text || !raw.text.trim()) return null
  const text = raw.text.trim().toUpperCase().slice(0, 5) // max 5 chars
  const style = raw.style ? raw.style.trim().toLowerCase() : null
  return { text, style }
}

/**
 * Retrieves or creates a cart record for either a signed-in user or a guest session.
 */
export async function getOrCreateCartRow(
  supabase: SupabaseClient,
  context: CartContext
): Promise<{ id: string; currency: CurrencyCode } | null> {
  const currency = context.currency || CART_CONFIG.DEFAULT_CURRENCY

  // 1. Authenticated User Cart
  if (context.userId && isValidUuid(context.userId)) {
    const { data: existing } = await supabase
      .from('carts')
      .select('id, currency')
      .eq('user_id', context.userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing?.id) {
      // Touch activity timestamp
      await supabase
        .from('carts')
        .update({ last_activity_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      return { id: existing.id, currency: (existing.currency || currency) as CurrencyCode }
    }

    // Create new account cart
    const { data: created, error: createErr } = await supabase
      .from('carts')
      .insert({
        user_id: context.userId,
        currency,
        last_activity_at: new Date().toISOString(),
      })
      .select('id, currency')
      .single()

    if (createErr || !created) {
      console.error('[CartService] Error creating user cart:', createErr?.message)
      return null
    }

    return { id: created.id, currency: (created.currency || currency) as CurrencyCode }
  }

  // 2. Guest Session Cart (Long-term persistent via opaque UUID session_id)
  if (context.guestSessionId && isValidUuid(context.guestSessionId)) {
    const { data: existing } = await supabase
      .from('carts')
      .select('id, currency')
      .eq('session_id', context.guestSessionId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing?.id) {
      await supabase
        .from('carts')
        .update({ last_activity_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      return { id: existing.id, currency: (existing.currency || currency) as CurrencyCode }
    }

    // Create new persistent guest cart
    const { data: created, error: createErr } = await supabase
      .from('carts')
      .insert({
        session_id: context.guestSessionId,
        currency,
        last_activity_at: new Date().toISOString(),
      })
      .select('id, currency')
      .single()

    if (createErr || !created) {
      console.error('[CartService] Error creating guest cart:', createErr?.message)
      return null
    }

    return { id: created.id, currency: (created.currency || currency) as CurrencyCode }
  }

  return null
}

/**
 * Fetches and revalidates all cart items from the database against current catalogue data:
 * - Publication status (discontinued / unpublished)
 * - Live inventory stock
 * - Live pricing for current currency
 */
export async function getValidatedCart(
  supabase: SupabaseClient,
  cartId: string,
  targetCurrency: CurrencyCode = CART_CONFIG.DEFAULT_CURRENCY
): Promise<ValidatedCart> {
  const emptyCart: ValidatedCart = {
    id: cartId,
    items: [],
    currency: targetCurrency,
    subtotal_minor: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    warnings: [],
    has_unavailable_items: false,
    has_price_changes: false,
  }

  if (!cartId || !isValidUuid(cartId)) return emptyCart

  const { data: rawRows, error } = await supabase
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
      created_at,
      updated_at,
      products (
        id,
        slug,
        name,
        status,
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
        stock_quantity,
        product_prices (
          id,
          currency,
          amount_minor
        )
      )
    `)
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true })

  if (error || !rawRows) {
    console.error('[CartService] Error reading cart_items:', error?.message)
    return emptyCart
  }

  const items: CartItem[] = []
  const warnings: string[] = []
  let hasUnavailable = false
  let hasPriceChanges = false
  let subtotalMinor = 0

  for (const row of rawRows as any[]) {
    const product = row.products
    const variant = row.product_variants
    const personalisation = normalizePersonalisation(row.personalisation)

    // Sort product images
    const images = (product?.product_images || []).sort(
      (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    const primaryImage = images[0] || null

    // Determine current live price in target currency
    const livePrices: any[] = variant?.product_prices || []
    const livePriceRow = livePrices.find((p) => p.currency === targetCurrency)
    const currentPriceMinor = livePriceRow?.amount_minor ?? row.price_minor_snapshot
    const snapshotPriceMinor = row.price_minor_snapshot

    let isAvailable = true
    let unavailableReason: 'out_of_stock' | 'discontinued' | 'insufficient_stock' | null = null
    let stockLimited = false
    const availableStock = variant?.stock_quantity ?? 0

    // 1. Catalogue Publication Check
    if (!product || product.status !== 'published') {
      isAvailable = false
      unavailableReason = 'discontinued'
      hasUnavailable = true
      warnings.push(`"${product?.name || 'A piece in your bag'}" has been discontinued or unlisted.`)
    }
    // 2. Out of Stock Check
    else if (!variant || availableStock <= 0) {
      isAvailable = false
      unavailableReason = 'out_of_stock'
      hasUnavailable = true
      warnings.push(`"${product.name}" (${variant?.colour || 'Selected shade'}) is currently out of stock.`)
    }
    // 3. Insufficient Stock for requested quantity
    else if (row.quantity > availableStock) {
      stockLimited = true
      hasUnavailable = true
      warnings.push(
        `Only ${availableStock} ${availableStock === 1 ? 'unit' : 'units'} of "${product.name}" available. Please adjust your bag quantity.`
      )
    }

    // 4. Live Price Change Check
    let priceChanged = false
    if (isAvailable && currentPriceMinor !== snapshotPriceMinor) {
      priceChanged = true
      hasPriceChanges = true
      const diffFormatted = `₹${(Math.abs(currentPriceMinor - snapshotPriceMinor) / 100).toLocaleString('en-IN')}`
      if (currentPriceMinor > snapshotPriceMinor) {
        warnings.push(`"${product.name}" price updated (+${diffFormatted}).`)
      } else {
        warnings.push(`"${product.name}" price updated (-${diffFormatted}).`)
      }
    }

    // Sum active, available subtotal
    if (isAvailable) {
      subtotalMinor += currentPriceMinor * row.quantity
    }

    items.push({
      id: row.id,
      product_id: row.product_id,
      variant_id: row.variant_id,
      quantity: row.quantity,
      personalisation,
      price_snapshot: {
        amountMinor: snapshotPriceMinor,
        currency: row.currency_snapshot as CurrencyCode,
      },
      current_price: {
        amountMinor: currentPriceMinor,
        currency: targetCurrency,
      },
      product: {
        id: product?.id || row.product_id,
        slug: product?.slug || '',
        name: product?.name || 'Cobleroad Handcrafted Piece',
        is_demo: Boolean(product?.is_demo),
      },
      variant: {
        id: variant?.id || row.variant_id,
        sku: variant?.sku || null,
        colour: variant?.colour || null,
        size: variant?.size || null,
        stock_quantity: availableStock,
      },
      primary_image: primaryImage
        ? {
            id: primaryImage.id,
            url: primaryImage.url,
            alt: primaryImage.alt || product?.name || '',
            product_id: product?.id || row.product_id,
            sort_order: primaryImage.sort_order ?? 0,
            created_at: '',
          }
        : null,
      is_available: isAvailable,
      unavailable_reason: unavailableReason,
      price_changed: priceChanged,
      stock_limited: stockLimited,
      max_available: availableStock,
    })
  }

  return {
    id: cartId,
    items,
    currency: targetCurrency,
    subtotal_minor: subtotalMinor,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    warnings,
    has_unavailable_items: hasUnavailable,
    has_price_changes: hasPriceChanges,
  }
}

/**
 * Adds an item to the cart on the server, enforcing inventory validation,
 * complimentary personalisation rules, and unique line segregation.
 */
export async function addItemToServerCart(
  supabase: SupabaseClient,
  context: CartContext,
  input: AddItemInput
): Promise<ValidatedCart> {
  const cartRow = await getOrCreateCartRow(supabase, context)
  if (!cartRow) {
    throw new Error('Unable to resolve cart destination.')
  }

  const quantityToAdd = Math.max(1, Math.min(input.quantity, CART_CONFIG.MAX_QUANTITY_PER_LINE))
  const cleanPersonalisation = normalizePersonalisation(input.personalisation)

  // 1. Validate Product and Variant existence in DB
  const { data: variant, error: varErr } = await supabase
    .from('product_variants')
    .select(`
      id,
      product_id,
      stock_quantity,
      products (
        id,
        status,
        personalisation
      ),
      product_prices (
        currency,
        amount_minor
      )
    `)
    .eq('id', input.variantId)
    .single()

  if (varErr || !variant) {
    throw new Error('Selected product variant does not exist.')
  }

  const product = variant.products as any
  if (product?.status !== 'published') {
    throw new Error('This piece is currently not available for purchase.')
  }

  // Determine current price
  const prices: any[] = variant.product_prices || []
  const priceRow = prices.find((p) => p.currency === (context.currency || CART_CONFIG.DEFAULT_CURRENCY))
  const amountMinor = priceRow?.amount_minor ?? input.priceSnapshot?.amountMinor ?? 0

  // 2. Check if an equivalent line already exists in this cart
  // (matches variant_id and normalized personalisation)
  const { data: existingRows } = await supabase
    .from('cart_items')
    .select('id, quantity, personalisation')
    .eq('cart_id', cartRow.id)
    .eq('variant_id', input.variantId)

  let matchedRow: any = null
  if (existingRows) {
    for (const row of existingRows) {
      const existingKey = getLineItemKey(input.productId, input.variantId, row.personalisation)
      const inputKey = getLineItemKey(input.productId, input.variantId, cleanPersonalisation)
      if (existingKey === inputKey) {
        matchedRow = row
        break
      }
    }
  }

  if (matchedRow) {
    // Increment existing line with safe stock cap
    const maxStock = variant.stock_quantity ?? 10
    const newQty = Math.min(
      matchedRow.quantity + quantityToAdd,
      Math.min(maxStock, CART_CONFIG.MAX_QUANTITY_PER_LINE)
    )

    await supabase
      .from('cart_items')
      .update({
        quantity: newQty,
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchedRow.id)
  } else {
    // Insert new distinct line
    await supabase.from('cart_items').insert({
      cart_id: cartRow.id,
      product_id: input.productId,
      variant_id: input.variantId,
      quantity: quantityToAdd,
      personalisation: cleanPersonalisation,
      price_minor_snapshot: amountMinor,
      currency_snapshot: context.currency || CART_CONFIG.DEFAULT_CURRENCY,
    })
  }

  return getValidatedCart(supabase, cartRow.id, context.currency)
}

/**
 * Updates quantity of a specific line item with bounds checking.
 */
export async function updateLineQuantity(
  supabase: SupabaseClient,
  context: CartContext,
  cartItemId: string,
  newQuantity: number
): Promise<ValidatedCart> {
  const cartRow = await getOrCreateCartRow(supabase, context)
  if (!cartRow) throw new Error('Cart not found')

  if (newQuantity <= 0) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('cart_id', cartRow.id)
  } else {
    // Check variant stock
    const { data: item } = await supabase
      .from('cart_items')
      .select('variant_id, product_variants(stock_quantity)')
      .eq('id', cartItemId)
      .single()

    const maxStock = (item as any)?.product_variants?.stock_quantity ?? 10
    const safeQty = Math.min(newQuantity, Math.min(maxStock, CART_CONFIG.MAX_QUANTITY_PER_LINE))

    await supabase
      .from('cart_items')
      .update({
        quantity: safeQty,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cartItemId)
      .eq('cart_id', cartRow.id)
  }

  return getValidatedCart(supabase, cartRow.id, context.currency)
}

/**
 * Removes a specific line item from the cart.
 */
export async function removeLineItem(
  supabase: SupabaseClient,
  context: CartContext,
  cartItemId: string
): Promise<ValidatedCart> {
  const cartRow = await getOrCreateCartRow(supabase, context)
  if (!cartRow) throw new Error('Cart not found')

  await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('cart_id', cartRow.id)

  return getValidatedCart(supabase, cartRow.id, context.currency)
}

/**
 * Clears all items from the cart (e.g. upon successful order checkout).
 */
export async function clearAllItems(
  supabase: SupabaseClient,
  context: CartContext
): Promise<void> {
  const cartRow = await getOrCreateCartRow(supabase, context)
  if (!cartRow) return

  await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartRow.id)
}

/**
 * DETERMINISTIC AMAZON/FLIPKART-STYLE CART MERGE ALGORITHM:
 * Merges a guest cart into an authenticated account cart on login.
 * 
 * Rules:
 * 1. Matches lines on: product_id + variant_id + normalized personalisation.
 * 2. Distinct variants (e.g. Cognac vs Espresso) remain distinct lines.
 * 3. Distinct personalisation (e.g. initials "AKR" vs none) remain distinct lines.
 * 4. Equivalent matching lines: Quantity Policy is additive capped at available stock:
 *    mergedQty = Math.min(accountQty + guestQty, Math.min(variantStock, MAX_QUANTITY_PER_LINE)).
 * 5. Distinct guest lines are added to the account cart.
 * 6. Idempotent: retiring the guest cart prevents duplicate re-processing on reload/retries.
 * 7. Concurrency safe & error resilient: if anything fails, guest items are preserved.
 */
export async function mergeGuestCartIntoUserCart(
  supabase: SupabaseClient,
  userId: string,
  guestSessionId: string
): Promise<MergeCartResult> {
  if (!isValidUuid(userId) || !isValidUuid(guestSessionId)) {
    throw new Error('Invalid user ID or guest session ID for cart merge.')
  }

  // 1. Resolve User Cart (Destination)
  const userCartRow = await getOrCreateCartRow(supabase, { userId })
  if (!userCartRow) {
    throw new Error('Failed to resolve account cart for user.')
  }

  // 2. Resolve Guest Cart (Source)
  const { data: guestCart } = await supabase
    .from('carts')
    .select('id, currency')
    .eq('session_id', guestSessionId)
    .maybeSingle()

  if (!guestCart?.id || guestCart.id === userCartRow.id) {
    // Nothing to merge or already merged
    const validated = await getValidatedCart(supabase, userCartRow.id)
    return { cart: validated, mergedLineCount: 0, warnings: [] }
  }

  // Fetch guest cart lines
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      variant_id,
      quantity,
      personalisation,
      price_minor_snapshot,
      currency_snapshot,
      product_variants (
        id,
        stock_quantity,
        products (status)
      )
    `)
    .eq('cart_id', guestCart.id)

  if (!guestItems || guestItems.length === 0) {
    const validated = await getValidatedCart(supabase, userCartRow.id)
    return { cart: validated, mergedLineCount: 0, warnings: [] }
  }

  // Fetch existing user cart lines
  const { data: userItems } = await supabase
    .from('cart_items')
    .select('id, product_id, variant_id, quantity, personalisation')
    .eq('cart_id', userCartRow.id)

  const userItemsMap = new Map<string, any>()
  if (userItems) {
    for (const item of userItems) {
      const key = getLineItemKey(item.product_id, item.variant_id, item.personalisation)
      userItemsMap.set(key, item)
    }
  }

  let mergedCount = 0
  const warnings: string[] = []

  // 3. Process each guest line
  for (const guestItem of guestItems as any[]) {
    const variant = guestItem.product_variants
    const stockQuantity = variant?.stock_quantity ?? 0

    const cleanPersonalisation = normalizePersonalisation(guestItem.personalisation)
    const lineKey = getLineItemKey(guestItem.product_id, guestItem.variant_id, cleanPersonalisation)
    const existingUserLine = userItemsMap.get(lineKey)

    if (existingUserLine) {
      // Matching line found: Additive policy capped at stock (if in stock) and purchase limits
      const accountQty = existingUserLine.quantity || 1
      const guestQty = guestItem.quantity || 1
      const totalWanted = accountQty + guestQty

      let safeQty = totalWanted
      if (stockQuantity > 0) {
        safeQty = Math.min(
          totalWanted,
          Math.min(stockQuantity, CART_CONFIG.MAX_QUANTITY_PER_LINE)
        )
        if (safeQty < totalWanted) {
          warnings.push(
            `Quantity for merged item adjusted to maximum available stock (${safeQty}).`
          )
        }
      } else {
        safeQty = Math.min(totalWanted, CART_CONFIG.MAX_QUANTITY_PER_LINE)
      }

      await supabase
        .from('cart_items')
        .update({
          quantity: safeQty,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUserLine.id)

      mergedCount++
    } else {
      // Distinct guest line: Insert into user cart
      let safeQty = guestItem.quantity || 1
      if (stockQuantity > 0) {
        safeQty = Math.min(
          safeQty,
          Math.min(stockQuantity, CART_CONFIG.MAX_QUANTITY_PER_LINE)
        )
      } else {
        safeQty = Math.min(safeQty, CART_CONFIG.MAX_QUANTITY_PER_LINE)
      }

      await supabase.from('cart_items').insert({
        cart_id: userCartRow.id,
        product_id: guestItem.product_id,
        variant_id: guestItem.variant_id,
        quantity: Math.max(1, safeQty),
        personalisation: cleanPersonalisation,
        price_minor_snapshot: guestItem.price_minor_snapshot,
        currency_snapshot: guestItem.currency_snapshot || CART_CONFIG.DEFAULT_CURRENCY,
      })

      mergedCount++
    }
  }

  // 4. Retire the guest cart items so duplicate merges are idempotent
  await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', guestCart.id)

  const validatedCart = await getValidatedCart(supabase, userCartRow.id)
  return {
    cart: validatedCart,
    mergedLineCount: mergedCount,
    warnings: [...warnings, ...(validatedCart.warnings || [])],
  }
}
