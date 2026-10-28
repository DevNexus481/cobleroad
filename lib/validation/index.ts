// =============================================================================
// COBLEROAD — Zod Validation Schemas
// =============================================================================

import { z } from 'zod'

// --- Checkout ---

export const ShippingAddressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Valid email address required'),
  phone: z.string().min(10, 'Valid phone number required').max(20).optional(),
  line1: z.string().min(5, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  postal_code: z.string().min(4, 'Postal / PIN code required').max(20),
  country: z.string().length(2, 'Valid country code required'),
})

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>

// --- Cart item ---

export const CartItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid(),
  quantity: z.number().int().positive().max(50),
  personalisation_text: z.string().max(10).optional(),
})

// --- Order creation ---

export const CreateOrderSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Cart cannot be empty'),
  shipping_address: ShippingAddressSchema,
  currency: z.enum(['INR']), // Only INR enabled initially
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>

// --- Payment verification ---

export const PaymentVerificationSchema = z.object({
  order_id: z.string().uuid('Invalid order ID'),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export type PaymentVerificationInput = z.infer<typeof PaymentVerificationSchema>

// --- Auth ---

export const SignUpSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72),
})

export const SignInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Valid email required'),
})

// --- Personalisation ---

export const PersonalisationSchema = z.object({
  text: z.string().max(10, 'Personalisation text too long'),
  style: z.string().optional(),
})

// --- Newsletter ---

export const NewsletterSchema = z.object({
  email: z.string().email('Valid email required'),
})

// --- Admin: Product ---

export const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  short_description: z.string().max(300).optional(),
  description: z.string().max(10000).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  is_featured: z.boolean().default(false),
  material_description: z.string().max(500).optional(),
  care_instructions: z.string().max(1000).optional(),
  weight_grams: z.number().int().positive().optional(),
  dimensions_cm: z.string().max(50).optional(),
  seo_title: z.string().max(70).optional(),
  seo_description: z.string().max(160).optional(),
})

// --- Admin: Variant ---

export const VariantSchema = z.object({
  sku: z.string().max(50).optional(),
  colour: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  stock_quantity: z.number().int().min(0),
  allow_backorder: z.boolean().default(false),
})

// --- Admin: Price ---

export const PriceSchema = z.object({
  currency: z.enum(['INR', 'USD', 'GBP', 'EUR', 'AED', 'SGD', 'AUD']),
  amount_minor: z.number().int().min(0),
})

// --- Contact ---

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
})
