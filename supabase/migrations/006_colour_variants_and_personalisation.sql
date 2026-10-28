-- =============================================================================
-- COBLEROAD — Migration 006: Colour Variants & Live Personalisation
-- Extends product variants with hex colours, active status, and customisation toggles.
-- Extends product images with variant relationships and approval status.
-- =============================================================================

-- 1. Extend product_variants
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS colour_hex TEXT;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS personalisation_enabled BOOLEAN NOT NULL DEFAULT true;

-- 2. Extend product_images
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('draft_generated', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_images_status ON product_images(status);
