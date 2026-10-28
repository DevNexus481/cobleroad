-- =============================================================================
-- COBLEROAD — Migration 002: Row Level Security Policies
-- =============================================================================

-- =============================================================================
-- Enable RLS on all tables
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Helper function: check if current user is admin
-- =============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- =============================================================================
-- PROFILES
-- =============================================================================

-- Trigger / registration insert for profiles
CREATE POLICY "profiles_insert_trigger" ON profiles
  FOR INSERT WITH CHECK (true);

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (not role)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Admins can read all profiles
CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (is_admin());

-- Admins can update any profile (for role changes)
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (is_admin());

-- =============================================================================
-- COLLECTIONS — public read, admin write
-- =============================================================================

CREATE POLICY "collections_public_select" ON collections
  FOR SELECT USING (true);

CREATE POLICY "collections_admin_all" ON collections
  FOR ALL USING (is_admin());

-- =============================================================================
-- PRODUCTS — published only public, admin can see all
-- =============================================================================

CREATE POLICY "products_published_select" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin());

-- =============================================================================
-- PRODUCT IMAGES — follow product visibility
-- =============================================================================

CREATE POLICY "product_images_public_select" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id
        AND p.status = 'published'
    )
  );

CREATE POLICY "product_images_admin_all" ON product_images
  FOR ALL USING (is_admin());

-- =============================================================================
-- PRODUCT COLLECTIONS — follow product visibility
-- =============================================================================

CREATE POLICY "product_collections_public_select" ON product_collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_collections.product_id
        AND p.status = 'published'
    )
  );

CREATE POLICY "product_collections_admin_all" ON product_collections
  FOR ALL USING (is_admin());

-- =============================================================================
-- PRODUCT VARIANTS — follow product visibility
-- =============================================================================

CREATE POLICY "product_variants_public_select" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_variants.product_id
        AND p.status = 'published'
    )
  );

CREATE POLICY "product_variants_admin_all" ON product_variants
  FOR ALL USING (is_admin());

-- =============================================================================
-- PRODUCT PRICES — follow product visibility
-- =============================================================================

CREATE POLICY "product_prices_public_select" ON product_prices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_prices.product_id
        AND p.status = 'published'
    )
  );

CREATE POLICY "product_prices_admin_all" ON product_prices
  FOR ALL USING (is_admin());

-- =============================================================================
-- ADDRESSES — own only
-- =============================================================================

CREATE POLICY "addresses_own_all" ON addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "addresses_admin_select" ON addresses
  FOR SELECT USING (is_admin());

-- =============================================================================
-- CARTS — own only (by user_id or session_id via service role)
-- =============================================================================

CREATE POLICY "carts_own_all" ON carts
  FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- CART ITEMS — via cart ownership
-- =============================================================================

CREATE POLICY "cart_items_own_all" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM carts c
      WHERE c.id = cart_items.cart_id
        AND c.user_id = auth.uid()
    )
  );

-- =============================================================================
-- ORDERS — customers see own orders; admins see all
-- =============================================================================

CREATE POLICY "orders_own_select" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (is_admin());

-- =============================================================================
-- ORDER ITEMS — follow order access
-- =============================================================================

CREATE POLICY "order_items_own_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (is_admin());

-- =============================================================================
-- PAYMENTS — server-side via service role only
-- Customers can see their own payment records (no card data stored)
-- =============================================================================

CREATE POLICY "payments_own_select" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = payments.order_id
        AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "payments_admin_all" ON payments
  FOR ALL USING (is_admin());

-- =============================================================================
-- WEBHOOK EVENTS — server-side only (service role bypasses RLS)
-- No direct customer access
-- =============================================================================

CREATE POLICY "webhook_events_admin_select" ON webhook_events
  FOR SELECT USING (is_admin());

-- =============================================================================
-- NEWSLETTER SUBSCRIBERS — write-only for anon, admin can read
-- =============================================================================

CREATE POLICY "newsletter_insert_anon" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_admin_all" ON newsletter_subscribers
  FOR ALL USING (is_admin());

-- =============================================================================
-- SITE SETTINGS — public read, admin write
-- =============================================================================

CREATE POLICY "site_settings_public_select" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_all" ON site_settings
  FOR ALL USING (is_admin());

-- =============================================================================
-- ADMIN AUDIT LOGS — admin read only
-- =============================================================================

CREATE POLICY "audit_logs_admin_select" ON admin_audit_logs
  FOR SELECT USING (is_admin());

-- Server inserts audit logs via service role (bypasses RLS)
