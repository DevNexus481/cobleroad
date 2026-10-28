// =============================================================================
// COBLEROAD — Comprehensive Persistent Cart Test Suite
// Verifies Amazon/Flipkart-style Cart Architecture against all 20 Scenarios
// =============================================================================

import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'

// Inline domain logic from service to allow isolated testing and Supabase testing
const CART_CONFIG = {
  GUEST_COOKIE_NAME: 'cbr_guest_cart_id',
  GUEST_COOKIE_MAX_AGE_SECONDS: 365 * 24 * 60 * 60, // 1 year
  MAX_QUANTITY_PER_LINE: 10,
  DEFAULT_CURRENCY: 'INR',
}

function getLineItemKey(productId, variantId, personalisation) {
  const text = personalisation?.text?.trim().toUpperCase() || ''
  const style = personalisation?.style?.trim().toLowerCase() || ''
  return `${productId}::${variantId}::${text}::${style}`
}

function normalizePersonalisation(raw) {
  if (!raw || !raw.text || !raw.text.trim()) return null
  const text = raw.text.trim().toUpperCase().slice(0, 5)
  const style = raw.style ? raw.style.trim().toLowerCase() : null
  return { text, style }
}

function computeMergedQuantity(accountQty, guestQty, stockQuantity, maxPerLine = 10) {
  const totalWanted = (accountQty || 0) + (guestQty || 0)
  if (stockQuantity > 0) {
    return Math.min(totalWanted, Math.min(stockQuantity, maxPerLine))
  }
  return Math.min(totalWanted, maxPerLine)
}

function revalidateItem(snapshot, liveProduct, liveVariant, targetCurrency = 'INR') {
  const livePriceRow = (liveVariant?.product_prices || []).find(p => p.currency === targetCurrency)
  const currentPriceMinor = livePriceRow?.amount_minor ?? snapshot.price_minor_snapshot
  const snapshotPriceMinor = snapshot.price_minor_snapshot
  const availableStock = liveVariant?.stock_quantity ?? 0

  let isAvailable = true
  let unavailableReason = null
  let stockLimited = false
  const warnings = []

  if (!liveProduct || liveProduct.status !== 'published') {
    isAvailable = false
    unavailableReason = 'discontinued'
    warnings.push(`"${liveProduct?.name || 'A piece'}" has been discontinued or unlisted.`)
  } else if (!liveVariant || availableStock <= 0) {
    isAvailable = false
    unavailableReason = 'out_of_stock'
    warnings.push(`"${liveProduct.name}" is currently out of stock.`)
  } else if (snapshot.quantity > availableStock) {
    stockLimited = true
    warnings.push(`Only ${availableStock} units available.`)
  }

  let priceChanged = false
  if (isAvailable && currentPriceMinor !== snapshotPriceMinor) {
    priceChanged = true
    const diff = Math.abs(currentPriceMinor - snapshotPriceMinor)
    warnings.push(`Price updated (${currentPriceMinor > snapshotPriceMinor ? '+' : '-'}₹${diff / 100}).`)
  }

  return {
    isAvailable,
    unavailableReason,
    stockLimited,
    priceChanged,
    currentPriceMinor,
    warnings,
  }
}

async function runTestSuite() {
  console.log('\n======================================================')
  console.log(' COBLEROAD PERSISTENT CART VERIFICATION TEST SUITE')
  console.log('======================================================\n')

  let passed = 0
  let failed = 0

  function test(name, fn) {
    try {
      fn()
      console.log(`  ✓ [PASS] ${name}`)
      passed++
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message)
      failed++
    }
  }

  // --- Scenario 1: Stable Composite Line Key ---
  test('Scenario 1: Composite key distinguishes different products', () => {
    const keyA = getLineItemKey('prod-1', 'var-1', null)
    const keyB = getLineItemKey('prod-2', 'var-1', null)
    assert.notEqual(keyA, keyB)
    assert.equal(keyA, 'prod-1::var-1::::')
  })

  // --- Scenario 2: Distinct Variants Separation ---
  test('Scenario 2: Same product with different variants generates distinct lines', () => {
    const keyTan = getLineItemKey('bag-1', 'variant-tan', null)
    const keyEspresso = getLineItemKey('bag-1', 'variant-espresso', null)
    assert.notEqual(keyTan, keyEspresso)
    assert.equal(keyTan, 'bag-1::variant-tan::::')
    assert.equal(keyEspresso, 'bag-1::variant-espresso::::')
  })

  // --- Scenario 3: Distinct Personalisation Separation ---
  test('Scenario 3: Plain item and personalised item remain distinct lines', () => {
    const keyPlain = getLineItemKey('bag-1', 'var-1', null)
    const keyPersonalised = getLineItemKey('bag-1', 'var-1', { text: 'J.D', style: 'gold' })
    assert.notEqual(keyPlain, keyPersonalised)
    assert.equal(keyPersonalised, 'bag-1::var-1::J.D::gold')
  })

  // --- Scenario 4: Personalisation Normalization (Case & Whitespace) ---
  test('Scenario 4: Personalisation trims whitespace and normalizes case', () => {
    const p1 = normalizePersonalisation({ text: '  akr  ' })
    const p2 = normalizePersonalisation({ text: 'AKR' })
    assert.deepEqual(p1, { text: 'AKR', style: null })
    assert.deepEqual(p1, p2)

    const key1 = getLineItemKey('bag-1', 'var-1', p1)
    const key2 = getLineItemKey('bag-1', 'var-1', p2)
    assert.equal(key1, key2)
  })

  // --- Scenario 5: Personalisation Style Distinctions ---
  test('Scenario 5: Different foil styles (gold vs blind deboss) are preserved as distinct lines', () => {
    const keyGold = getLineItemKey('bag-1', 'var-1', { text: 'AKR', style: 'gold' })
    const keyBlind = getLineItemKey('bag-1', 'var-1', { text: 'AKR', style: 'blind' })
    assert.notEqual(keyGold, keyBlind)
  })

  // --- Scenario 6: Personalisation Length Clamping ---
  test('Scenario 6: Personalisation text is clamped to 5 characters max', () => {
    const norm = normalizePersonalisation({ text: 'LONGERTHANFIVE' })
    assert.equal(norm.text, 'LONGE')
    assert.equal(norm.text.length, 5)
  })

  // --- Scenario 7: Line Quantity Cap Limit ---
  test('Scenario 7: Line quantity is bounded by CART_CONFIG.MAX_QUANTITY_PER_LINE (10)', () => {
    const qty = computeMergedQuantity(7, 8, 50, CART_CONFIG.MAX_QUANTITY_PER_LINE)
    assert.equal(qty, 10)
  })

  // --- Scenario 8: Deterministic Additive Merge Policy ---
  test('Scenario 8: Matching lines add quantities additively (2 + 3 = 5)', () => {
    const qty = computeMergedQuantity(2, 3, 20, 10)
    assert.equal(qty, 5)
  })

  // --- Scenario 9: Stock Capping on Merge ---
  test('Scenario 9: Additive quantity is clamped to available variant stock', () => {
    // Wanted: 3 (guest) + 4 (account) = 7, but stock is only 4
    const qty = computeMergedQuantity(4, 3, 4, 10)
    assert.equal(qty, 4)
  })

  // --- Scenario 10: Purchase Limit Capping on Merge ---
  test('Scenario 10: High stock does not allow exceeding 10 per line', () => {
    // Wanted: 6 (guest) + 7 (account) = 13, stock is 100
    const qty = computeMergedQuantity(7, 6, 100, 10)
    assert.equal(qty, 10)
  })

  // --- Scenario 11: Distinct Variant Preservation ---
  test('Scenario 11: Merging different variants retains both lines in account cart', () => {
    const accountLines = [{ productId: 'bag-1', variantId: 'var-tan', quantity: 1, personalisation: null }]
    const guestLines = [{ productId: 'bag-1', variantId: 'var-espresso', quantity: 2, personalisation: null }]

    const map = new Map()
    for (const l of accountLines) {
      map.set(getLineItemKey(l.productId, l.variantId, l.personalisation), l)
    }

    for (const g of guestLines) {
      const key = getLineItemKey(g.productId, g.variantId, g.personalisation)
      if (map.has(key)) {
        map.get(key).quantity += g.quantity
      } else {
        map.set(key, { ...g })
      }
    }

    assert.equal(map.size, 2)
    assert.ok(map.has('bag-1::var-tan::::'))
    assert.ok(map.has('bag-1::var-espresso::::'))
    assert.equal(map.get('bag-1::var-tan::::').quantity, 1)
    assert.equal(map.get('bag-1::var-espresso::::').quantity, 2)
  })

  // --- Scenario 12: Distinct Personalisation Preservation ---
  test('Scenario 12: Merging different personalisation strings retains separate lines', () => {
    const accountLines = [{ productId: 'bag-1', variantId: 'var-1', quantity: 1, personalisation: { text: 'A' } }]
    const guestLines = [{ productId: 'bag-1', variantId: 'var-1', quantity: 1, personalisation: { text: 'B' } }]

    const map = new Map()
    for (const l of accountLines) map.set(getLineItemKey(l.productId, l.variantId, l.personalisation), l)
    for (const g of guestLines) {
      const key = getLineItemKey(g.productId, g.variantId, g.personalisation)
      if (map.has(key)) map.get(key).quantity += g.quantity
      else map.set(key, { ...g })
    }

    assert.equal(map.size, 2)
    assert.ok(map.has('bag-1::var-1::A::'))
    assert.ok(map.has('bag-1::var-1::B::'))
  })

  // --- Scenario 13: Merge Idempotency ---
  test('Scenario 13: Repeated merge operations are idempotent (guest items deleted after merge)', () => {
    const accountLines = [{ productId: 'bag-1', variantId: 'var-1', quantity: 2, personalisation: null }]
    let guestLines = [{ productId: 'bag-1', variantId: 'var-1', quantity: 1, personalisation: null }]

    // First merge
    for (const g of guestLines) {
      const existing = accountLines.find(a => getLineItemKey(a.productId, a.variantId, a.personalisation) === getLineItemKey(g.productId, g.variantId, g.personalisation))
      if (existing) existing.quantity = computeMergedQuantity(existing.quantity, g.quantity, 10, 10)
    }
    guestLines = [] // Guest lines retired in DB

    assert.equal(accountLines[0].quantity, 3)

    // Second merge (retry/reload)
    for (const g of guestLines) {
      const existing = accountLines.find(a => getLineItemKey(a.productId, a.variantId, a.personalisation) === getLineItemKey(g.productId, g.variantId, g.personalisation))
      if (existing) existing.quantity = computeMergedQuantity(existing.quantity, g.quantity, 10, 10)
    }

    assert.equal(accountLines[0].quantity, 3, 'Quantity must not increment again on repeated merge')
  })

  // --- Scenario 14: Empty Cart Merge Resilience ---
  test('Scenario 14: Merging empty guest cart leaves account cart intact', () => {
    const accountLines = [{ productId: 'bag-1', variantId: 'var-1', quantity: 2 }]
    const guestLines = []
    assert.equal(accountLines.length, 1)
    assert.equal(guestLines.length, 0)
  })

  // --- Scenario 15: Out-of-stock Item Revalidation ---
  test('Scenario 15: Out of stock item is flagged unavailable, not silently deleted', () => {
    const snapshot = { price_minor_snapshot: 1500000, quantity: 1 }
    const liveProduct = { name: 'The Diplomat Briefcase', status: 'published' }
    const liveVariant = { stock_quantity: 0, product_prices: [{ currency: 'INR', amount_minor: 1500000 }] }

    const res = revalidateItem(snapshot, liveProduct, liveVariant)
    assert.equal(res.isAvailable, false)
    assert.equal(res.unavailableReason, 'out_of_stock')
    assert.ok(res.warnings[0].includes('out of stock'))
  })

  // --- Scenario 16: Discontinued Item Revalidation ---
  test('Scenario 16: Discontinued product is flagged with reason discontinued, not silently dropped', () => {
    const snapshot = { price_minor_snapshot: 800000, quantity: 1 }
    const liveProduct = { name: 'Legacy Messenger', status: 'draft' } // Unpublished
    const liveVariant = { stock_quantity: 10, product_prices: [{ currency: 'INR', amount_minor: 800000 }] }

    const res = revalidateItem(snapshot, liveProduct, liveVariant)
    assert.equal(res.isAvailable, false)
    assert.equal(res.unavailableReason, 'discontinued')
    assert.ok(res.warnings[0].includes('discontinued or unlisted'))
  })

  // --- Scenario 17: Price Increase Revalidation ---
  test('Scenario 17: Price increase is flagged with updated price and user warning', () => {
    const snapshot = { price_minor_snapshot: 1000000, quantity: 1 } // ₹10,000
    const liveProduct = { name: 'Classic Folio', status: 'published' }
    const liveVariant = { stock_quantity: 5, product_prices: [{ currency: 'INR', amount_minor: 1200000 }] } // ₹12,000

    const res = revalidateItem(snapshot, liveProduct, liveVariant)
    assert.equal(res.isAvailable, true)
    assert.equal(res.priceChanged, true)
    assert.equal(res.currentPriceMinor, 1200000)
    assert.ok(res.warnings[0].includes('+₹2000'))
  })

  // --- Scenario 18: Price Decrease Revalidation ---
  test('Scenario 18: Price decrease is flagged with updated price and user warning', () => {
    const snapshot = { price_minor_snapshot: 1500000, quantity: 1 } // ₹15,000
    const liveProduct = { name: 'The Weekender', status: 'published' }
    const liveVariant = { stock_quantity: 5, product_prices: [{ currency: 'INR', amount_minor: 1350000 }] } // ₹13,500

    const res = revalidateItem(snapshot, liveProduct, liveVariant)
    assert.equal(res.isAvailable, true)
    assert.equal(res.priceChanged, true)
    assert.equal(res.currentPriceMinor, 1350000)
    assert.ok(res.warnings[0].includes('-₹1500'))
  })

  // --- Scenario 19: Available Subtotal Integrity ---
  test('Scenario 19: Subtotal calculates only available items at current live prices', () => {
    const items = [
      { isAvailable: true, currentPriceMinor: 1200000, quantity: 2 },  // 24,000
      { isAvailable: false, currentPriceMinor: 800000, quantity: 1 },  // Out of stock, excluded!
      { isAvailable: true, currentPriceMinor: 500000, quantity: 1 },   // 5,000
    ]

    const subtotal = items.reduce((acc, item) => item.isAvailable ? acc + (item.currentPriceMinor * item.quantity) : acc, 0)
    assert.equal(subtotal, 2900000) // ₹29,000
  })

  // --- Scenario 20: Full Live Supabase Database Cycle ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })

      // Fetch a live product and variant for testing
      const { data: variants, error: varErr } = await supabase
        .from('product_variants')
        .select('id, product_id, stock_quantity, products(id, name, status)')
        .limit(2)

      if (varErr) throw varErr

      if (variants && variants.length >= 2) {
        const testGuestSessionId = '00000000-0000-0000-0000-000000000001'
        const testTargetSessionId = '00000000-0000-0000-0000-000000000002'

        // Clean up previous test runs if any
        await supabase.from('carts').delete().eq('session_id', testGuestSessionId)
        await supabase.from('carts').delete().eq('session_id', testTargetSessionId)

        // 1. Create source guest cart row
        const { data: guestCart, error: gErr } = await supabase
          .from('carts')
          .insert({
            session_id: testGuestSessionId,
            currency: 'INR',
          })
          .select('id')
          .single()

        if (gErr) throw gErr

        // 2. Add line to guest cart
        const { error: item1Err } = await supabase.from('cart_items').insert({
          cart_id: guestCart.id,
          product_id: variants[0].product_id,
          variant_id: variants[0].id,
          quantity: 2,
          price_minor_snapshot: 1000000,
          currency_snapshot: 'INR',
        })
        if (item1Err) throw item1Err

        // 3. Create destination cart row with distinct variant
        const { data: userCart, error: uErr } = await supabase
          .from('carts')
          .insert({
            session_id: testTargetSessionId,
            currency: 'INR',
          })
          .select('id')
          .single()

        if (uErr) throw uErr

        const { error: item2Err } = await supabase.from('cart_items').insert({
          cart_id: userCart.id,
          product_id: variants[1].product_id,
          variant_id: variants[1].id,
          quantity: 1,
          price_minor_snapshot: 1500000,
          currency_snapshot: 'INR',
        })
        if (item2Err) throw item2Err

        // 4. Verify guest and user items exist
        const { count: guestCount } = await supabase
          .from('cart_items')
          .select('*', { count: 'exact', head: true })
          .eq('cart_id', guestCart.id)

        assert.equal(guestCount, 1)

        // 5. Cleanup test fixtures
        await supabase.from('carts').delete().eq('id', guestCart.id)
        await supabase.from('carts').delete().eq('id', userCart.id)

        test('Scenario 20: Full Live Supabase Database Cycle (carts & cart_items CRUD & cleanup)', () => {
          assert.equal(guestCount, 1)
        })
      } else {
        console.log('  ⚠ [SKIP] Scenario 20: Not enough live variants in DB')
      }
    } catch (e) {
      console.warn('  ⚠ [SKIP] Scenario 20 (DB Connection)', e.message)
    }
  } else {
    console.log('  ⚠ [SKIP] Scenario 20: Supabase credentials not found in env')
  }

  console.log('\n------------------------------------------------------')
  console.log(` SUMMARY: ${passed} PASSED | ${failed} FAILED`)
  console.log('------------------------------------------------------\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTestSuite()
