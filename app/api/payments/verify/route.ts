import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/server'
import { PaymentVerificationSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = PaymentVerificationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data

    // --- Verify signature server-side ---
    let signatureValid = false
    try {
      signatureValid = verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
    } catch (err) {
      console.error('[verify-payment] signature check failed', err)
      return NextResponse.json({ success: false, error: 'Payment verification failed.' }, { status: 400 })
    }

    if (!signatureValid) {
      console.warn('[verify-payment] invalid signature for order', order_id)
      return NextResponse.json({ success: false, error: 'Payment signature is invalid.' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // --- Verify order exists and is in expected state ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, total_minor, currency')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
    }

    if (!['payment_pending', 'pending'].includes(order.status)) {
      // Already processed (idempotent)
      if (order.status === 'paid') {
        return NextResponse.json({ success: true, order_id })
      }
      return NextResponse.json({ success: false, error: `Unexpected order status: ${order.status}` }, { status: 409 })
    }

    // --- Verify the payment record matches ---
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id, razorpay_order_id, amount_minor, status')
      .eq('order_id', order_id)
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ success: false, error: 'Payment record not found.' }, { status: 404 })
    }

    if (payment.status === 'captured') {
      // Already captured — idempotent
      return NextResponse.json({ success: true, order_id })
    }

    // --- Update payment and order in a transaction-like sequence ---
    const { error: updatePaymentErr } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updatePaymentErr) {
      console.error('[verify-payment] failed to update payment', updatePaymentErr)
      return NextResponse.json({ success: false, error: 'Failed to record payment.' }, { status: 500 })
    }

    const { error: updateOrderErr } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', order_id)

    if (updateOrderErr) {
      console.error('[verify-payment] failed to update order', updateOrderErr)
      return NextResponse.json({ success: false, error: 'Failed to update order status.' }, { status: 500 })
    }

    // --- Deduct inventory ---
    // Fetch order items and decrement stock
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('variant_id, quantity')
      .eq('order_id', order_id)

    if (orderItems) {
      for (const oi of orderItems) {
        if (!oi.variant_id) continue
        // Use RPC to avoid race conditions (atomic decrement)
        await supabase.rpc('decrement_stock', {
          p_variant_id: oi.variant_id,
          p_quantity: oi.quantity,
        })
      }
    }

    return NextResponse.json({ success: true, order_id })
  } catch (err) {
    console.error('[verify-payment] unexpected', err)
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 })
  }
}
