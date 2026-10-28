'use server'

import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CreateProductInput {
  name: string
  slug: string
  collectionId: string
  shortDescription: string
  description: string
  status: 'draft' | 'published'
  isFeatured: boolean
  priceInr: number // rupees (e.g. 14999)
  colour: string // e.g. "Cognac"
  stockQuantity: number
  sku: string
  imageUrl: string
  secondaryImageUrl?: string
  materialDescription?: string
  dimensionsCm?: string
  weightGrams?: number
  personalisationEnabled: boolean
  personalisationMaxChars?: number
}

export async function createProductAction(formData: CreateProductInput) {
  await requireAdmin()
  const supabase = await createAdminClient()

  const cleanSlug = formData.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!cleanSlug || !formData.name.trim()) {
    return { error: 'Product name and slug are required.' }
  }

  // 1. Insert product
  const personalisation = formData.personalisationEnabled
    ? {
        enabled: true,
        label: 'Complimentary Monogramming',
        max_chars: formData.personalisationMaxChars || 3,
        allowed_pattern: '^[A-Za-z]{1,3}$',
        styles: ['blind', 'gold'],
      }
    : null

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: formData.name.trim(),
      slug: cleanSlug,
      short_description: formData.shortDescription.trim(),
      description: formData.description.trim(),
      status: formData.status,
      is_featured: formData.isFeatured,
      is_demo: false,
      personalisation,
      material_description: formData.materialDescription?.trim() || 'Full-grain vegetable-tanned bovine leather',
      dimensions_cm: formData.dimensionsCm?.trim() || null,
      weight_grams: formData.weightGrams ? Number(formData.weightGrams) : null,
    })
    .select('id, slug')
    .single()

  if (productError || !product) {
    console.error('Failed to create product:', productError)
    return { error: productError?.message || 'Failed to insert product record.' }
  }

  const productId = product.id

  // 2. Link collection if selected
  if (formData.collectionId) {
    await supabase.from('product_collections').insert({
      product_id: productId,
      collection_id: formData.collectionId,
    })
  }

  // 3. Insert primary variant
  const cleanSku = formData.sku.trim() || `CBR-${cleanSlug.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`
  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      sku: cleanSku,
      colour: formData.colour.trim() || 'Cognac',
      stock_quantity: Math.max(0, formData.stockQuantity),
      allow_backorder: false,
    })
    .select('id')
    .single()

  if (variantError || !variant) {
    console.error('Failed to create variant:', variantError)
  }

  // 4. Insert price in minor units (paise)
  const amountMinor = Math.round(Number(formData.priceInr) * 100)
  if (variant?.id && amountMinor > 0) {
    await supabase.from('product_prices').insert({
      product_id: productId,
      variant_id: variant.id,
      currency: 'INR',
      amount_minor: amountMinor,
    })
  }

  // 5. Insert images
  const primaryUrl = formData.imageUrl.trim() || '/images/hero/hero-briefcase.jpg'
  await supabase.from('product_images').insert({
    product_id: productId,
    url: primaryUrl,
    alt: formData.name.trim(),
    sort_order: 0,
  })

  if (formData.secondaryImageUrl?.trim()) {
    await supabase.from('product_images').insert({
      product_id: productId,
      url: formData.secondaryImageUrl.trim(),
      alt: `${formData.name.trim()} alternate view`,
      sort_order: 1,
    })
  }

  // Revalidate store catalogue
  revalidatePath('/shop')
  revalidatePath('/collections')
  revalidatePath('/admin/products')
  revalidatePath('/')

  return { success: true, slug: product.slug }
}
