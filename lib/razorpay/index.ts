// =============================================================================
// COBLEROAD — Razorpay Integration (Server-side only)
// Never expose the secret key to the browser.
// =============================================================================

import Razorpay from 'razorpay'
import crypto from 'crypto'

function getRazorpayInstance(): Razorpay {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export interface CreateRazorpayOrderInput {
  amountMinor: number        // Amount in smallest currency unit (paise for INR)
  currency: string           // ISO 4217 currency code
  receipt: string            // Your internal order reference
  notes?: Record<string, string>
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

/**
 * Create a Razorpay order on the server.
 * Called ONLY from server actions/route handlers — never from the browser.
 */
export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput
): Promise<RazorpayOrder> {
  const razorpay = getRazorpayInstance()

  const order = await razorpay.orders.create({
    amount: input.amountMinor,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  })

  return order as unknown as RazorpayOrder
}

/**
 * Verify the Razorpay payment signature.
 * Called server-side after the client sends back the payment response.
 * 
 * Signature is: HMAC-SHA256 of "<razorpay_order_id>|<razorpay_payment_id>" 
 * using the key_secret.
 */
export function verifyPaymentSignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured')
  }

  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex')

  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.razorpay_signature)
    )
  } catch {
    return false
  }
}

/**
 * Verify a Razorpay webhook signature.
 * The raw request body must be passed as-is (before JSON.parse).
 * 
 * Razorpay signs webhooks with HMAC-SHA256 of the raw body using the webhook secret.
 */
export function verifyWebhookSignature(params: {
  rawBody: string | Buffer
  signature: string
}): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured')
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(params.rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    )
  } catch {
    return false
  }
}

/**
 * Check if Razorpay is configured (credentials present).
 */
export function isRazorpayConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('your_key_id')
  )
}
