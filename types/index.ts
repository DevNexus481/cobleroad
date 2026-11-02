// =============================================================================
// COBLEROAD — Core TypeScript Types
// =============================================================================

// --- Currency & Money ---

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR' | 'AED' | 'SGD' | 'AUD'

export interface Money {
  /** Amount in minor units (e.g. paise for INR, cents for USD) */
  amountMinor: number
  currency: CurrencyCode
}

export interface CurrencyConfig {
  code: CurrencyCode
  name: string
  symbol: string
  /** Number of decimal places (e.g. 2 for INR/USD, 0 for JPY) */
  minorUnitPrecision: number
  /** Whether this currency is enabled for checkout */
  enabled: boolean
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', minorUnitPrecision: 2, enabled: true },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', minorUnitPrecision: 2, enabled: true },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', minorUnitPrecision: 2, enabled: false },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', minorUnitPrecision: 2, enabled: false },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', minorUnitPrecision: 2, enabled: false },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', minorUnitPrecision: 2, enabled: false },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', minorUnitPrecision: 2, enabled: false },
}

// --- Market ---

export type MarketCode = 'IN' | 'INTL'

export interface Market {
  code: MarketCode
  name: string
  defaultCurrency: CurrencyCode
  enabled: boolean
}

export const MARKETS: Record<MarketCode, Market> = {
  IN: { code: 'IN', name: 'India', defaultCurrency: 'INR', enabled: true },
  INTL: { code: 'INTL', name: 'International', defaultCurrency: 'USD', enabled: true },
}

// --- Products ---

export type ProductStatus = 'draft' | 'published' | 'archived'

export interface ProductImage {
  id: string
  product_id: string
  variant_id?: string | null
  url: string
  alt: string | null
  sort_order: number
  is_primary?: boolean
  status?: 'draft_generated' | 'approved' | 'rejected'
  created_at: string
}

export interface ProductPrice {
  id: string
  product_id: string
  variant_id: string | null
  currency: CurrencyCode
  /** Price in minor units */
  amount_minor: number
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  colour: string | null
  colour_hex?: string | null
  size: string | null
  /** Stock available */
  stock_quantity: number
  /** If true, product can be oversold (for pre-orders etc.) */
  allow_backorder: boolean
  is_active?: boolean
  sort_order?: number
  personalisation_enabled?: boolean
  prices: ProductPrice[]
  images?: ProductImage[]
  created_at: string
}

export interface PersonalisationFinish {
  id: string
  name: string
  color: string
  type: 'deboss' | 'foil'
}

export interface PersonalisationPlacement {
  x_percent: number
  y_percent: number
  scale?: number
  rotation_deg?: number
  max_width_percent?: number
}

export interface PersonalisationConfig {
  enabled: boolean
  label: string
  sublabel?: string
  max_chars: number
  allowed_pattern: string | null
  finishes?: PersonalisationFinish[]
  styles?: string[] // backward compatibility
  default_finish?: string
  complimentary?: boolean
  placement?: PersonalisationPlacement
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  short_description: string | null
  status: ProductStatus
  is_featured: boolean
  is_demo: boolean
  personalisation: PersonalisationConfig | null
  seo_title: string | null
  seo_description: string | null
  weight_grams: number | null
  dimensions_cm: string | null
  material_description: string | null
  care_instructions: string | null
  created_at: string
  updated_at: string
  images: ProductImage[]
  variants: ProductVariant[]
  collections: Collection[]
}

export type ProductCard = Pick<
  Product,
  'id' | 'slug' | 'name' | 'short_description' | 'status' | 'is_featured' | 'is_demo' | 'personalisation'
> & {
  primary_image: ProductImage | null
  variants: (Pick<ProductVariant, 'id' | 'colour' | 'stock_quantity' | 'prices'> & {
    colour_hex?: string | null
    image_url?: string | null
  })[]
}

// --- Collections ---

export interface Collection {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at: string
}

// --- Cart ---

export interface CartPersonalisation {
  text: string
  style: string | null
}

export interface CartItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  personalisation: CartPersonalisation | null
  /** Price snapshot at time of adding to cart */
  price_snapshot: Money
  product: Pick<Product, 'id' | 'slug' | 'name' | 'is_demo'>
  variant: Pick<ProductVariant, 'id' | 'sku' | 'colour' | 'size' | 'stock_quantity'>
  primary_image: ProductImage | null
  /** Live revalidation metadata */
  is_available?: boolean
  unavailable_reason?: 'out_of_stock' | 'discontinued' | 'insufficient_stock' | null
  current_price?: Money | null
  price_changed?: boolean
  stock_limited?: boolean
  max_available?: number
}

export interface Cart {
  id: string
  items: CartItem[]
  currency: CurrencyCode
  /** Subtotal in minor units */
  subtotal_minor: number
  created_at: string
  updated_at: string
}

export interface ValidatedCart extends Cart {
  warnings?: string[]
  has_unavailable_items?: boolean
  has_price_changes?: boolean
}

// --- Orders ---

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded'

export interface ShippingAddress {
  full_name: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name_snapshot: string
  variant_sku_snapshot: string | null
  variant_colour_snapshot: string | null
  /** Unit price in minor units at time of purchase */
  unit_price_minor: number
  currency: CurrencyCode
  quantity: number
  personalisation: CartPersonalisation | null
  subtotal_minor: number
}

export interface Payment {
  id: string
  order_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  status: PaymentStatus
  amount_minor: number
  currency: CurrencyCode
  failure_reason: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  guest_email: string | null
  order_number: string
  status: OrderStatus
  currency: CurrencyCode
  subtotal_minor: number
  shipping_minor: number
  tax_minor: number
  discount_minor: number
  total_minor: number
  shipping_address: ShippingAddress
  tracking_number: string | null
  notes: string | null
  items: OrderItem[]
  payments: Payment[]
  created_at: string
  updated_at: string
}

// --- Auth ---

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
}

// --- Admin ---

export interface DashboardStats {
  total_products: number
  published_products: number
  low_stock_products: number
  total_orders: number
  pending_orders: number
  paid_orders: number
  total_revenue_minor: number
}

// --- Site Settings ---

export interface SiteSettings {
  announcement_text: string | null
  announcement_enabled: boolean
  instagram_url: string | null
  facebook_url: string | null
  whatsapp_number: string | null
  contact_email: string | null
}
