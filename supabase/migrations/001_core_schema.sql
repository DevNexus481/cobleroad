-- =============================================================================
-- COBLEROAD — Migration 001: Core Schema
-- Run via Supabase Dashboard > SQL Editor, or `supabase db push`
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    updated_at = now();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- COLLECTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- PRODUCTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  description          TEXT,
  short_description    TEXT,
  status               TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  is_demo              BOOLEAN NOT NULL DEFAULT true,
  -- Personalisation config (JSON)
  personalisation      JSONB,
  -- SEO
  seo_title            TEXT,
  seo_description      TEXT,
  -- Physical details (only set when verified)
  weight_grams         INT,
  dimensions_cm        TEXT,
  material_description TEXT,
  care_instructions    TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- PRODUCT IMAGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- =============================================================================
-- PRODUCT COLLECTIONS (junction)
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_collections (
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- =============================================================================
-- PRODUCT VARIANTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku              TEXT UNIQUE,
  colour           TEXT,
  size             TEXT,
  stock_quantity   INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  allow_backorder  BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- PRODUCT PRICES
-- Each currency is an explicit, admin-configured price in minor units.
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_prices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id   UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  currency     TEXT NOT NULL,
  amount_minor INT NOT NULL CHECK (amount_minor >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (variant_id, currency)
);

CREATE INDEX IF NOT EXISTS idx_product_prices_variant_id ON product_prices(variant_id);

CREATE TRIGGER product_prices_updated_at
  BEFORE UPDATE ON product_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ADDRESSES
-- =============================================================================

CREATE TABLE IF NOT EXISTS addresses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  line1        TEXT NOT NULL,
  line2        TEXT,
  city         TEXT NOT NULL,
  state        TEXT NOT NULL,
  postal_code  TEXT NOT NULL,
  country      TEXT NOT NULL DEFAULT 'IN',
  phone        TEXT,
  is_default   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- =============================================================================
-- CARTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS carts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id  TEXT, -- for guest carts
  currency    TEXT NOT NULL DEFAULT 'INR',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT carts_identity CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- CART ITEMS
-- =============================================================================

CREATE TABLE IF NOT EXISTS cart_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id             UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id          UUID NOT NULL REFERENCES products(id),
  variant_id          UUID NOT NULL REFERENCES product_variants(id),
  quantity            INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  personalisation     JSONB,
  -- Snapshot of price at time of adding
  price_minor_snapshot INT NOT NULL,
  currency_snapshot   TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, variant_id, personalisation)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ORDERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_email      TEXT,
  order_number     TEXT NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (
                     status IN ('pending','payment_pending','paid','processing',
                                'shipped','delivered','cancelled','refunded','failed')
                   ),
  currency         TEXT NOT NULL,
  subtotal_minor   INT NOT NULL DEFAULT 0,
  shipping_minor   INT NOT NULL DEFAULT 0,
  tax_minor        INT NOT NULL DEFAULT 0,
  discount_minor   INT NOT NULL DEFAULT 0,
  total_minor      INT NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL,
  tracking_number  TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ORDER ITEMS
-- All product/variant data is snapshotted to preserve historical records.
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                  UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id                UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id                UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name_snapshot     TEXT NOT NULL,
  variant_sku_snapshot      TEXT,
  variant_colour_snapshot   TEXT,
  unit_price_minor          INT NOT NULL,
  currency                  TEXT NOT NULL,
  quantity                  INT NOT NULL CHECK (quantity > 0),
  personalisation           JSONB,
  subtotal_minor            INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =============================================================================
-- PAYMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES orders(id),
  razorpay_order_id     TEXT NOT NULL UNIQUE,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (
                          status IN ('pending','authorized','captured','failed','refunded')
                        ),
  amount_minor          INT NOT NULL,
  currency              TEXT NOT NULL,
  failure_reason        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- WEBHOOK EVENTS (idempotency)
-- =============================================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      TEXT NOT NULL,
  event_id      TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  payload       JSONB,
  processed     BOOLEAN NOT NULL DEFAULT false,
  processed_at  TIMESTAMPTZ,
  error         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(provider, event_id);

-- =============================================================================
-- NEWSLETTER SUBSCRIBERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source       TEXT DEFAULT 'website'
);

-- =============================================================================
-- SITE SETTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_text     TEXT,
  announcement_enabled  BOOLEAN NOT NULL DEFAULT false,
  instagram_url         TEXT,
  facebook_url          TEXT,
  whatsapp_number       TEXT,
  contact_email         TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO site_settings (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ADMIN AUDIT LOG
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);
