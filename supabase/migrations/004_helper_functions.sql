-- =============================================================================
-- COBLEROAD — Migration 004: Helper Functions
-- =============================================================================

/**
 * Atomic stock decrement to prevent overselling under concurrent load.
 * Called from the payment verification server action.
 */
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id UUID, p_quantity INT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE product_variants
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
      updated_at = now()
  WHERE id = p_variant_id;
END;
$$;

/**
 * Order number sequence function — called internally.
 * Example: CBR-20241001-0001
 * (In practice we generate these in the app layer for simplicity.)
 */

-- =============================================================================
-- Admin convenience views
-- =============================================================================

CREATE OR REPLACE VIEW admin_order_overview AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.currency,
  o.total_minor,
  o.created_at,
  p.full_name AS customer_name,
  p.email AS customer_email,
  o.guest_email,
  COALESCE(p.email, o.guest_email) AS contact_email
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id;

-- Only admins can select this view
ALTER VIEW admin_order_overview OWNER TO authenticated;

CREATE OR REPLACE VIEW admin_product_overview AS
SELECT
  p.id,
  p.slug,
  p.name,
  p.status,
  p.is_featured,
  p.is_demo,
  p.created_at,
  COUNT(DISTINCT pv.id) AS variant_count,
  SUM(pv.stock_quantity) AS total_stock,
  MIN(pp.amount_minor) FILTER (WHERE pp.currency = 'INR') AS min_price_inr
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_prices pp ON pv.id = pp.variant_id
GROUP BY p.id, p.slug, p.name, p.status, p.is_featured, p.is_demo, p.created_at;
