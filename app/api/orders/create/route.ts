import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createRazorpayOrder, isRazorpayConfigured } from '@/lib/razorpay'
import { verifyProductPrice, getVariantStock } from '@/lib/products/queries'
import { CreateOrderSchema } from '@/lib/validation'
import { isCurrencyEnabled } from '@/lib/currency'
import { createClient } from '@/lib/supabase/server'

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CBR-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // --- Input validation ---
    const parsed = CreateOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, shipping_address, currency } = parsed.data

    // --- Currency validation ---
    if (!isCurrencyEnabled(currency)) {
      return NextResponse.json(
        { error: `Currency ${currency} is not enabled for checkout.` },
        { status: 400 }
      )
    }

    // --- Shipping destination validation ---
    if (shipping_address.country !== 'IN') {
      return NextResponse.json(
        { error: 'International shipping is not yet configured. Only India (IN) is currently supported.' },
        { status: 400 }
      )
    }

    // --- Server-side price and stock validation ---
    let subtotalMinor = 0
    const validatedItems: Array<{
      product_id: string
      variant_id: string
      product_name_snapshot: string
      variant_sku_snapshot: string | null
      variant_colour_snapshot: string | null
      unit_price_minor: number
      currency: string
      quantity: number
      personalisation: { text: string; style: null } | null
      subtotal_minor: number
    }> = []

    for (const item of items) {
      // Verify price server-side — never use client-submitted price
      const priceData = await verifyProductPrice(item.variant_id, currency)
      if (!priceData) {
        return NextResponse.json(
          { error: `Product variant ${item.variant_id} is not available in ${currency} or has been removed.` },
          { status: 400 }
        )
      }

      // Verify stock
      const stock = await getVariantStock(item.variant_id)
      if (stock === null || stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for one or more items in your bag.` },
          { status: 409 }
        )
      }

      const itemSubtotal = priceData.amountMinor * item.quantity
      subtotalMinor += itemSubtotal

      validatedItems.push({
        product_id: priceData.productId,
        variant_id: item.variant_id,
        product_name_snapshot: '', // will be fetched below
        variant_sku_snapshot: null,
        variant_colour_snapshot: null,
        unit_price_minor: priceData.amountMinor,
        currency,
        quantity: item.quantity,
        personalisation: item.personalisation_text
          ? { text: item.personalisation_text.toUpperCase().slice(0, 10), style: null }
          : null,
        subtotal_minor: itemSubtotal,
      })
    }

    // Fetch product/variant names for snapshots
    const supabase = await createAdminClient()
    for (const vi of validatedItems) {
      const { data: variantData } = await supabase
        .from('product_variants')
        .select('sku, colour, products(name)')
        .eq('id', vi.variant_id)
        .single()

      if (variantData) {
        vi.product_name_snapshot = (variantData.products as any)?.name ?? 'Product'
        vi.variant_sku_snapshot = variantData.sku
        vi.variant_colour_snapshot = variantData.colour
      }
    }

    // --- Shipping calculation (configured rule) ---
    const shippingThresholdMinor = 299900 // ₹2,999
    const shippingMinor = subtotalMinor >= shippingThresholdMinor ? 0 : 15000 // ₹150
    const taxMinor = 0 // GST handled separately when configured
    const discountMinor = 0
    const totalMinor = subtotalMinor + shippingMinor + taxMinor - discountMinor

    if (totalMinor <= 0) {
      return NextResponse.json({ error: 'Invalid order total.' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    // --- Get current user (optional — guest checkout supported) ---
    const userSupabase = await createClient()
    const { data: { user } } = await userSupabase.auth.getUser()

    // --- Create order in DB (pending state) ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        guest_email: user ? null : shipping_address.email,
        order_number: orderNumber,
        status: 'payment_pending',
        currency,
        subtotal_minor: subtotalMinor,
        shipping_minor: shippingMinor,
        tax_minor: taxMinor,
        discount_minor: discountMinor,
        total_minor: totalMinor,
        shipping_address: {
          full_name: shipping_address.full_name,
          line1: shipping_address.line1,
          line2: shipping_address.line2 ?? null,
          city: shipping_address.city,
          state: shipping_address.state,
          postal_code: shipping_address.postal_code,
          country: shipping_address.country,
          phone: shipping_address.phone ?? null,
        },
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('[create-order] DB error', orderError)
      return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 })
    }

    // --- Insert order items ---
    await supabase.from('order_items').insert(
      validatedItems.map((vi) => ({
        order_id: order.id,
        product_id: vi.product_id,
        variant_id: vi.variant_id,
        product_name_snapshot: vi.product_name_snapshot,
        variant_sku_snapshot: vi.variant_sku_snapshot,
        variant_colour_snapshot: vi.variant_colour_snapshot,
        unit_price_minor: vi.unit_price_minor,
        currency: vi.currency,
        quantity: vi.quantity,
        personalisation: vi.personalisation,
        subtotal_minor: vi.subtotal_minor,
      }))
    )

    // --- Create Razorpay order (if configured) ---
    if (!isRazorpayConfigured()) {
      return NextResponse.json({
        order_id: order.id,
        order_number: orderNumber,
        error: 'payment_not_configured',
        message: 'Razorpay is not configured. Order created but payment cannot proceed.',
      }, { status: 200 })
    }

    let razorpayOrder
    try {
      razorpayOrder = await createRazorpayOrder({
        amountMinor: totalMinor,
        currency,
        receipt: orderNumber,
        notes: { order_id: order.id },
      })
    } catch (rzpError) {
      console.error('[create-order] Razorpay error', rzpError)
      // Order exists but payment order failed — update status
      await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id)
      return NextResponse.json({ error: 'Could not create payment order. Please try again.' }, { status: 500 })
    }

    // --- Save Razorpay order reference ---
    await supabase.from('payments').insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      status: 'pending',
      amount_minor: totalMinor,
      currency,
    })

    return NextResponse.json({
      order_id: order.id,
      order_number: orderNumber,
      razorpay_order_id: razorpayOrder.id,
      razorpay_amount: totalMinor,
      currency,
    })
  } catch (err) {
    console.error('[create-order] unexpected', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
