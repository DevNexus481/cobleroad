// =============================================================================
// COBLEROAD — Colour Variants & Live Personalisation Test Suite
// Automated verification for:
// 1. Colour variant selection and data integrity
// 2. 3-character personalisation input validation & normalization
// 3. Independent cart persistence & variant-aware line merging
// 4. Security & RLS integrity
// =============================================================================

import { createClient } from '@supabase/supabase-js'
import assert from 'node:assert/strict'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let passed = 0
let failed = 0

function it(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    failed++
  }
}

async function itAsync(name, fn) {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    failed++
  }
}

console.log('\n======================================================')
console.log(' COBLEROAD TEST SUITE: COLOUR VARIANTS & PERSONALISATION')
console.log('======================================================\n')

// -----------------------------------------------------------------------------
// 1. Personalisation Validation & Character Limits
// -----------------------------------------------------------------------------
console.log('TEST GROUP 1: Personalisation Validation Policy')

function validatePersonalisationInput(text, maxChars = 3, allowedPattern = '^[A-Z0-9]{1,3}$') {
  if (!text || text.trim().length === 0) return { valid: true, value: null }
  const trimmed = text.trim().toUpperCase()
  if (trimmed.length > maxChars) {
    return { valid: false, error: `Maximum ${maxChars} characters allowed` }
  }
  const regex = new RegExp(allowedPattern)
  if (!regex.test(trimmed)) {
    return { valid: false, error: 'Unsupported characters. Only A-Z and 0-9 allowed.' }
  }
  return { valid: true, value: trimmed }
}

it('Allows empty initials when personalisation is optional', () => {
  const res = validatePersonalisationInput('')
  assert.equal(res.valid, true)
  assert.equal(res.value, null)
})

it('Accepts single character (1 char)', () => {
  const res = validatePersonalisationInput('A')
  assert.equal(res.valid, true)
  assert.equal(res.value, 'A')
})

it('Accepts two characters (2 chars)', () => {
  const res = validatePersonalisationInput('ak')
  assert.equal(res.valid, true)
  assert.equal(res.value, 'AK') // Normalized to uppercase
})

it('Accepts three characters (3 chars)', () => {
  const res = validatePersonalisationInput('abc')
  assert.equal(res.valid, true)
  assert.equal(res.value, 'ABC')
})

it('Rejects four or more characters (4+ chars)', () => {
  const res = validatePersonalisationInput('ABCD')
  assert.equal(res.valid, false)
  assert.match(res.error, /Maximum 3 characters/)
})

it('Rejects unsupported special characters or emojis', () => {
  const res1 = validatePersonalisationInput('A*B')
  assert.equal(res1.valid, false)
  const res2 = validatePersonalisationInput('A👜B')
  assert.equal(res2.valid, false)
})

it('Trims leading and trailing whitespace automatically', () => {
  const res = validatePersonalisationInput('  CR  ')
  assert.equal(res.valid, true)
  assert.equal(res.value, 'CR')
})

// -----------------------------------------------------------------------------
// 2. Persistent Cart Line Key & Merging Rules
// -----------------------------------------------------------------------------
console.log('\nTEST GROUP 2: Persistent Cart Line Key & Merging Rules')

function getLineItemKey(productId, variantId, personalisation) {
  const text = personalisation?.text?.trim().toUpperCase() || ''
  const style = personalisation?.style?.trim().toLowerCase() || ''
  return `${productId}::${variantId}::${text}::${style}`
}

it('Generates identical keys for same product, variant, and personalisation', () => {
  const k1 = getLineItemKey('p1', 'v1', { text: 'AK', style: 'blind' })
  const k2 = getLineItemKey('p1', 'v1', { text: 'ak', style: 'BLIND' })
  assert.equal(k1, k2)
})

it('Differentiates different colour variants so they remain separate cart lines', () => {
  const cognacKey = getLineItemKey('marlow-tote', 'var-cognac', { text: 'AK', style: 'blind' })
  const espressoKey = getLineItemKey('marlow-tote', 'var-espresso', { text: 'AK', style: 'blind' })
  assert.notEqual(cognacKey, espressoKey)
})

it('Differentiates different initials so they remain separate cart lines', () => {
  const keyAK = getLineItemKey('marlow-tote', 'var-cognac', { text: 'AK', style: 'blind' })
  const keyABC = getLineItemKey('marlow-tote', 'var-cognac', { text: 'ABC', style: 'blind' })
  assert.notEqual(keyAK, keyABC)
})

it('Differentiates different finishes (Blind vs Gold Foil)', () => {
  const keyBlind = getLineItemKey('marlow-tote', 'var-cognac', { text: 'AK', style: 'blind' })
  const keyGold = getLineItemKey('marlow-tote', 'var-cognac', { text: 'AK', style: 'gold' })
  assert.notEqual(keyBlind, keyGold)
})

it('Differentiates personalised piece from non-personalised piece', () => {
  const keyCustom = getLineItemKey('marlow-tote', 'var-cognac', { text: 'AK', style: 'blind' })
  const keyPlain = getLineItemKey('marlow-tote', 'var-cognac', null)
  assert.notEqual(keyCustom, keyPlain)
})

// -----------------------------------------------------------------------------
// 3. Database Catalogue & Variant Imagery Verification
// -----------------------------------------------------------------------------
async function runAsyncTests() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n[Note] Supabase environment variables missing. Skipping live DB queries.')
    return
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  console.log('\nTEST GROUP 3: Live Supabase Catalogue & Colour Variant Assets')

  await itAsync('Verifies all 4 core bags have configured colour variants and swatches', async () => {
    const slugs = ['marlow-tote', 'advocate-briefcase', 'fielder-backpack', 'meridian-duffle']
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug, name, personalisation, product_variants(id, colour, colour_hex, stock_quantity)')
      .in('slug', slugs)

    assert.equal(error, null)
    assert.equal(products.length, 4)

    for (const p of products) {
      assert(p.product_variants.length >= 4, `${p.slug} has ${p.product_variants.length} variants, expected >= 4`)
      for (const v of p.product_variants) {
        assert(Boolean(v.colour), `Variant on ${p.slug} has no colour name`)
        assert(Boolean(v.colour_hex), `Variant ${v.colour} on ${p.slug} has no hex code`)
        assert(v.stock_quantity >= 0, `Variant ${v.colour} has negative stock`)
      }
    }
  })

  await itAsync('Verifies variant-specific photographs are linked to variant_id', async () => {
    const { data: images, error } = await supabase
      .from('product_images')
      .select('id, product_id, variant_id, url')
      .not('variant_id', 'is', null)

    assert.equal(error, null)
    assert(images.length >= 12, `Expected >= 12 variant-linked images, found ${images.length}`)
  })

  await itAsync('Verifies personalisation placement coordinates are configured', async () => {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug, personalisation')
      .in('slug', ['marlow-tote', 'advocate-briefcase'])

    assert.equal(error, null)
    for (const p of products) {
      assert.equal(p.personalisation?.enabled, true)
      assert(p.personalisation?.placement, `Product ${p.slug} missing placement config`)
      assert(typeof p.personalisation.placement.x_percent === 'number')
      assert(typeof p.personalisation.placement.y_percent === 'number')
      assert(typeof p.personalisation.placement.scale === 'number')
    }
  })

  console.log('\nTEST GROUP 4: Security & RLS Integrity')

  await itAsync('Verifies unauthenticated public clients cannot update variants', async () => {
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data } = await anonClient
      .from('product_variants')
      .update({ colour: 'Hacked Colour' })
      .eq('colour', 'Cognac')
      .select()

    assert.equal(data.length, 0, 'Anon client unexpectedly updated rows in product_variants!')
  })

  await itAsync('Verifies unauthenticated public clients cannot insert variant images', async () => {
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { error } = await anonClient
      .from('product_images')
      .insert({ product_id: '00000000-0000-0000-0000-000000000000', url: 'https://evil.com/fake.jpg' })

    assert(error !== null, 'Anon client was unexpectedly allowed to insert product_images!')
  })
}

runAsyncTests().then(() => {
  console.log('\n------------------------------------------------------')
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`)
  console.log('------------------------------------------------------\n')
  if (failed > 0) {
    process.exit(1)
  }
})
