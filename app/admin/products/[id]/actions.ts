'use server'

import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PersonalisationPlacement, PersonalisationFinish } from '@/types'

export interface UpdateProductInput {
  productId: string
  name: string
  shortDescription?: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  personalisationEnabled: boolean
  personalisationMaxChars?: number
  personalisationStyles?: string[]
  placement?: PersonalisationPlacement
}

export interface UpsertVariantInput {
  variantId?: string // if missing, inserts new variant
  productId: string
  colour: string
  colourHex: string
  sku: string
  stockQuantity: number
  priceInr: number // rupees e.g. 12999
  personalisationEnabled: boolean
  isActive: boolean
}

export async function updateProductDetailsAction(input: UpdateProductInput) {
  await requireAdmin()
  const supabase = await createAdminClient()

  const personalisation = input.personalisationEnabled
    ? {
        enabled: true,
        label: 'Complimentary Monogramming',
        max_chars: input.personalisationMaxChars || 3,
        allowed_pattern: '^[A-Z0-9]{1,3}$',
        styles: input.personalisationStyles || ['blind', 'gold', 'silver'],
        placement: input.placement || {
          x_percent: 50,
          y_percent: 68,
          scale: 1.0,
          rotation_deg: 0,
          max_width_percent: 55,
        },
      }
    : null

  const { error } = await supabase
    .from('products')
    .update({
      name: input.name.trim(),
      short_description: input.shortDescription?.trim() || null,
      description: input.description?.trim() || null,
      status: input.status,
      personalisation,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.productId)

  if (error) {
    console.error('[updateProductDetailsAction]', error)
    return { error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${input.productId}`)
  return { success: true }
}

export async function upsertVariantAction(input: UpsertVariantInput) {
  await requireAdmin()
  const supabase = await createAdminClient()

  try {
    let variantId = input.variantId

    if (variantId) {
      // Update existing variant
      const { error: variantError } = await supabase
        .from('product_variants')
        .update({
          colour: input.colour.trim(),
          colour_hex: input.colourHex.trim(),
          sku: input.sku.trim(),
          stock_quantity: Math.max(0, input.stockQuantity),
          personalisation_enabled: input.personalisationEnabled,
          is_active: input.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', variantId)

      if (variantError) throw variantError
    } else {
      // Insert new variant
      const { data: created, error: createError } = await supabase
        .from('product_variants')
        .insert({
          product_id: input.productId,
          colour: input.colour.trim(),
          colour_hex: input.colourHex.trim(),
          sku: input.sku.trim(),
          stock_quantity: Math.max(0, input.stockQuantity),
          personalisation_enabled: input.personalisationEnabled,
          is_active: input.isActive,
        })
        .select('id')
        .single()

      if (createError || !created) throw createError
      variantId = created.id
    }

    // Upsert price for INR
    const amountMinor = Math.round(Number(input.priceInr) * 100)
    if (amountMinor > 0 && variantId) {
      const { data: existingPrice } = await supabase
        .from('product_prices')
        .select('id')
        .eq('variant_id', variantId)
        .eq('currency', 'INR')
        .maybeSingle()

      if (existingPrice?.id) {
        await supabase
          .from('product_prices')
          .update({ amount_minor: amountMinor })
          .eq('id', existingPrice.id)
      } else {
        await supabase.from('product_prices').insert({
          product_id: input.productId,
          variant_id: variantId,
          currency: 'INR',
          amount_minor: amountMinor,
        })
      }
    }

    revalidatePath('/shop')
    revalidatePath(`/admin/products/${input.productId}`)
    return { success: true, variantId }
  } catch (err: any) {
    console.error('[upsertVariantAction]', err)
    return { error: err.message || 'Failed to save variant' }
  }
}

export async function deleteVariantAction(variantId: string, productId: string) {
  await requireAdmin()
  const supabase = await createAdminClient()

  // First delete price records
  await supabase.from('product_prices').delete().eq('variant_id', variantId)

  // Unlink images from this variant
  await supabase.from('product_images').update({ variant_id: null }).eq('variant_id', variantId)

  // Delete variant
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function assignVariantImageAction(
  imageId: string,
  variantId: string | null,
  isPrimary: boolean,
  productId: string
) {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('product_images')
    .update({
      variant_id: variantId || null,
      is_primary: isPrimary,
      status: 'approved',
    })
    .eq('id', imageId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function updateImageStatusAction(
  imageId: string,
  status: 'approved' | 'draft' | 'rejected',
  productId: string
) {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('product_images')
    .update({ status })
    .eq('id', imageId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}
