import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Razorpay Webhook Handler.
 * 
 * IMPORTANT: The raw body must be read before parsing JSON.
 * Razorpay signs the raw body — parsing first corrupts the signature check.
 * 
 * Configure this URL in Razorpay Dashboard > Webhooks:
 *   https://yourdomain.com/api/webhooks/razorpay
 * 
 * Subscribe to:
 *   - payment.captured
 *   - payment.failed
 *   - refund.created
 *   - refund.processed
 *   - refund.failed
 */
export async function POST(req: NextRequest) {
  // Read raw body for signature verification
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  // Verify webhook signature
  let isValid = false
  try {
    isValid = verifyWebhookSignature({ rawBody, signature })
  } catch (err) {
    console.error('[webhook] signature verification error', err)
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  if (!isValid) {
    console.warn('[webhook] invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventId = payload.event_id ?? payload.id
  const eventType = payload.event ?? ''
  const supabase = await createAdminClient()

  // --- Idempotency check ---
  if (eventId) {
    const { data: existing } = await supabase
      .from('webhook_events')
      .select('id, processed')
      .eq('provider', 'razorpay')
      .eq('event_id', eventId)
      .single()

    if (existing?.processed) {
      // Already processed — acknowledge without re-processing
      return NextResponse.json({ received: true, status: 'already_processed' })
    }

    // Record event (upsert for idempotency)
    await supabase.from('webhook_events').upsert({
      provider: 'razorpay',
      event_id: eventId,
      event_type: eventType,
      payload,
      processed: false,
    }, { onConflict: 'provider,event_id' })
  }

  // --- Handle events ---
  try {
    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity
        if (!payment) break

        const { razorpay_order_id, id: razorpay_payment_id } = payment

        // Find matching payment record
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('id, order_id, status')
          .eq('razorpay_order_id', razorpay_order_id)
          .single()

        if (paymentRecord && paymentRecord.status !== 'captured') {
          await supabase.from('payments').update({
            razorpay_payment_id,
            status: 'captured',
          }).eq('id', paymentRecord.id)

          await supabase.from('orders').update({ status: 'paid' }).eq('id', paymentRecord.order_id)
        }
        break
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity
        if (!payment) break

        const { order_id: razorpay_order_id, id: razorpay_payment_id, error_description } = payment

        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('id, order_id')
          .eq('razorpay_order_id', razorpay_order_id)
          .single()

        if (paymentRecord) {
          await supabase.from('payments').update({
            razorpay_payment_id,
            status: 'failed',
            failure_reason: error_description ?? 'Payment failed',
          }).eq('id', paymentRecord.id)

          await supabase.from('orders').update({ status: 'failed' }).eq('id', paymentRecord.order_id)
        }
        break
      }

      case 'refund.processed': {
        const refund = payload.payload?.refund?.entity
        if (!refund) break
        // Update payment status
        const { payment_id: razorpay_payment_id } = refund
        if (razorpay_payment_id) {
          const { data: paymentRecord } = await supabase
            .from('payments')
            .select('id, order_id')
            .eq('razorpay_payment_id', razorpay_payment_id)
            .single()

          if (paymentRecord) {
            await supabase.from('payments').update({ status: 'refunded' }).eq('id', paymentRecord.id)
            await supabase.from('orders').update({ status: 'refunded' }).eq('id', paymentRecord.order_id)
          }
        }
        break
      }

      default:
        // Log unknown events but still acknowledge
        console.log('[webhook] unhandled event type:', eventType)
    }

    // Mark event as processed
    if (eventId) {
      await supabase.from('webhook_events').update({
        processed: true,
        processed_at: new Date().toISOString(),
      }).eq('provider', 'razorpay').eq('event_id', eventId)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] processing error', err)

    if (eventId) {
      await supabase.from('webhook_events').update({
        error: String(err),
      }).eq('provider', 'razorpay').eq('event_id', eventId)
    }

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
