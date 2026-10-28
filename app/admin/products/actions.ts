'use server'

import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Toggle a product between 'published' (visible to customers) and 'draft' (hidden from store)
 */
export async function toggleProductStatusAction(productId: string, currentStatus: string) {
  await requireAdmin()
  const supabase = await createAdminClient()

  const newStatus = currentStatus === 'published' ? 'draft' : 'published'

  const { error } = await supabase
    .from('products')
    .update({ status: newStatus })
    .eq('id', productId)

  if (error) {
    console.error('Failed to toggle product status:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true, newStatus }
}

/**
 * Permanently delete or unlist a product and its associated variants/prices
 */
export async function deleteProductAction(productId: string) {
  await requireAdmin()
  const supabase = await createAdminClient()

  // Delete product (cascades to variants, prices, images, and collections)
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Failed to delete product:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/collections')
  revalidatePath('/')
  return { success: true }
}
