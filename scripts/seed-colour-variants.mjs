import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const FINISHES = [
  { id: 'blind', name: 'Blind Deboss', color: '#1F1B18', type: 'deboss' },
  { id: 'gold', name: 'Gold Foil', color: '#C5A059', type: 'foil' },
  { id: 'silver', name: 'Silver Foil', color: '#C0C0C0', type: 'foil' },
]

const PRODUCTS_CONFIG = [
  {
    slug: 'marlow-tote',
    personalisation: {
      enabled: true,
      label: 'Make It Yours',
      sublabel: 'Add up to three initials, complimentary.',
      max_chars: 3,
      allowed_pattern: '^[A-Z0-9]{1,3}$',
      finishes: FINISHES,
      default_finish: 'blind',
      complimentary: true,
      placement: { x_percent: 50, y_percent: 66, scale: 1.0, rotation_deg: 0, max_width_percent: 30 },
    },
    variants: [
      {
        colour: 'Espresso',
        colour_hex: '#2B211D',
        sku: 'CBR-TOT-ESP-001',
        stock: 30,
        priceMinor: 899900,
        image: '/images/products/tote-espresso.jpg',
        sortOrder: 0,
      },
      {
        colour: 'Cognac',
        colour_hex: '#9A633F',
        sku: 'CBR-TOT-COG-001',
        stock: 22,
        priceMinor: 899900,
        image: '/images/products/variants/marlow-tote-cognac-front.jpg',
        sortOrder: 1,
      },
      {
        colour: 'Black',
        colour_hex: '#1F1B18',
        sku: 'CBR-TOT-BLK-001',
        stock: 18,
        priceMinor: 899900,
        image: '/images/products/variants/marlow-tote-black-front.jpg',
        sortOrder: 2,
      },
      {
        colour: 'Tan',
        colour_hex: '#B5784E',
        sku: 'CBR-TOT-TAN-001',
        stock: 14,
        priceMinor: 899900,
        image: '/images/products/variants/marlow-tote-tan-front.jpg',
        sortOrder: 3,
      },
    ],
  },
  {
    slug: 'advocate-briefcase',
    personalisation: {
      enabled: true,
      label: 'Make It Yours',
      sublabel: 'Add up to three initials, complimentary.',
      max_chars: 3,
      allowed_pattern: '^[A-Z0-9]{1,3}$',
      finishes: FINISHES,
      default_finish: 'blind',
      complimentary: true,
      placement: { x_percent: 42, y_percent: 44, scale: 0.9, rotation_deg: 0, max_width_percent: 28 },
    },
    variants: [
      {
        colour: 'Cognac',
        colour_hex: '#9A633F',
        sku: 'CBR-BRF-COG-001',
        stock: 15,
        priceMinor: 1299900,
        image: '/images/hero/hero-briefcase.jpg',
        sortOrder: 0,
      },
      {
        colour: 'Espresso',
        colour_hex: '#2B211D',
        sku: 'CBR-BRF-ESP-001',
        stock: 12,
        priceMinor: 1299900,
        image: '/images/products/variants/advocate-briefcase-espresso-front.jpg',
        sortOrder: 1,
      },
      {
        colour: 'Black',
        colour_hex: '#1F1B18',
        sku: 'CBR-BRF-BLK-001',
        stock: 10,
        priceMinor: 1299900,
        image: '/images/products/variants/advocate-briefcase-black-front.jpg',
        sortOrder: 2,
      },
      {
        colour: 'Tan',
        colour_hex: '#B5784E',
        sku: 'CBR-BRF-TAN-001',
        stock: 8,
        priceMinor: 1299900,
        image: '/images/products/variants/advocate-briefcase-tan-front.jpg',
        sortOrder: 3,
      },
    ],
  },
  {
    slug: 'fielder-backpack',
    personalisation: {
      enabled: true,
      label: 'Make It Yours',
      sublabel: 'Add up to three initials, complimentary.',
      max_chars: 3,
      allowed_pattern: '^[A-Z0-9]{1,3}$',
      finishes: FINISHES,
      default_finish: 'blind',
      complimentary: true,
      placement: { x_percent: 42, y_percent: 64, scale: 0.85, rotation_deg: 0, max_width_percent: 24 },
    },
    variants: [
      {
        colour: 'Tan',
        colour_hex: '#B5784E',
        sku: 'CBR-BCK-TAN-001',
        stock: 20,
        priceMinor: 1199900,
        image: '/images/products/backpack-tan.jpg',
        sortOrder: 0,
      },
      {
        colour: 'Espresso',
        colour_hex: '#2B211D',
        sku: 'CBR-BCK-ESP-001',
        stock: 14,
        priceMinor: 1199900,
        image: '/images/products/variants/fielder-backpack-espresso-front.jpg',
        sortOrder: 1,
      },
      {
        colour: 'Cognac',
        colour_hex: '#9A633F',
        sku: 'CBR-BCK-COG-001',
        stock: 16,
        priceMinor: 1199900,
        image: '/images/products/variants/fielder-backpack-cognac-front.jpg',
        sortOrder: 2,
      },
      {
        colour: 'Black',
        colour_hex: '#1F1B18',
        sku: 'CBR-BCK-BLK-001',
        stock: 10,
        priceMinor: 1199900,
        image: '/images/products/variants/fielder-backpack-black-front.jpg',
        sortOrder: 3,
      },
    ],
  },
  {
    slug: 'meridian-duffle',
    personalisation: {
      enabled: true,
      label: 'Make It Yours',
      sublabel: 'Add up to three initials, complimentary.',
      max_chars: 3,
      allowed_pattern: '^[A-Z0-9]{1,3}$',
      finishes: FINISHES,
      default_finish: 'blind',
      complimentary: true,
      placement: { x_percent: 62, y_percent: 63, scale: 0.85, rotation_deg: 0, max_width_percent: 24 },
    },
    variants: [
      {
        colour: 'Cognac',
        colour_hex: '#9A633F',
        sku: 'CBR-DFL-COG-001',
        stock: 12,
        priceMinor: 1599900,
        image: '/images/products/duffle-travel.jpg',
        sortOrder: 0,
      },
      {
        colour: 'Espresso',
        colour_hex: '#2B211D',
        sku: 'CBR-DFL-ESP-001',
        stock: 10,
        priceMinor: 1599900,
        image: '/images/products/variants/meridian-duffle-espresso-front.jpg',
        sortOrder: 1,
      },
      {
        colour: 'Black',
        colour_hex: '#1F1B18',
        sku: 'CBR-DFL-BLK-001',
        stock: 8,
        priceMinor: 1599900,
        image: '/images/products/variants/meridian-duffle-black-front.jpg',
        sortOrder: 2,
      },
      {
        colour: 'Olive',
        colour_hex: '#6D7155',
        sku: 'CBR-DFL-OLV-001',
        stock: 6,
        priceMinor: 1649900,
        image: '/images/products/variants/meridian-duffle-olive-front.jpg',
        sortOrder: 3,
      },
    ],
  },
]

async function seed() {
  console.log('Seeding colour variants and personalisation...')

  for (const item of PRODUCTS_CONFIG) {
    const { data: product, error: pErr } = await supabase
      .from('products')
      .select('id, name')
      .eq('slug', item.slug)
      .single()

    if (pErr || !product) {
      console.warn('Product not found:', item.slug, pErr?.message)
      continue
    }

    console.log(`Configuring ${product.name} (${item.slug})...`)

    // 1. Update product personalisation
    await supabase
      .from('products')
      .update({
        personalisation: item.personalisation,
        status: 'published',
        is_demo: false,
      })
      .eq('id', product.id)

    // 2. Insert or update variants
    for (const v of item.variants) {
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', product.id)
        .eq('sku', v.sku)
        .maybeSingle()

      let variantId = existingVariant?.id

      if (existingVariant) {
        await supabase
          .from('product_variants')
          .update({
            colour: v.colour,
            colour_hex: v.colour_hex,
            stock_quantity: v.stock,
            sort_order: v.sortOrder,
            is_active: true,
            personalisation_enabled: true,
          })
          .eq('id', existingVariant.id)
      } else {
        const { data: createdVariant, error: cErr } = await supabase
          .from('product_variants')
          .insert({
            product_id: product.id,
            sku: v.sku,
            colour: v.colour,
            colour_hex: v.colour_hex,
            stock_quantity: v.stock,
            sort_order: v.sortOrder,
            is_active: true,
            personalisation_enabled: true,
          })
          .select('id')
          .single()

        if (cErr) {
          console.error('Failed creating variant:', v.sku, cErr)
          continue
        }
        variantId = createdVariant.id
      }

      // 3. Upsert Price
      const { data: existingPrice } = await supabase
        .from('product_prices')
        .select('id')
        .eq('variant_id', variantId)
        .eq('currency', 'INR')
        .maybeSingle()

      if (existingPrice) {
        await supabase
          .from('product_prices')
          .update({ amount_minor: v.priceMinor })
          .eq('id', existingPrice.id)
      } else {
        await supabase.from('product_prices').insert({
          product_id: product.id,
          variant_id: variantId,
          currency: 'INR',
          amount_minor: v.priceMinor,
        })
      }

      // 4. Link or insert primary image for this variant
      const { data: existingImage } = await supabase
        .from('product_images')
        .select('id')
        .eq('variant_id', variantId)
        .maybeSingle()

      if (existingImage) {
        await supabase
          .from('product_images')
          .update({
            url: v.image,
            alt: `${product.name} in ${v.colour}`,
            is_primary: true,
            status: 'approved',
            sort_order: v.sortOrder,
          })
          .eq('id', existingImage.id)
      } else {
        await supabase.from('product_images').insert({
          product_id: product.id,
          variant_id: variantId,
          url: v.image,
          alt: `${product.name} in ${v.colour}`,
          sort_order: v.sortOrder,
          is_primary: true,
          status: 'approved',
        })
      }
    }
  }

  console.log('Seeding finished successfully!')
}

seed().catch(console.error)
