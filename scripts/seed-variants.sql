-- =============================================================================
-- COBLEROAD — Seed Colour Variants & Variant Images
-- =============================================================================

DO $$
DECLARE
  v_marlow_id UUID;
  v_advocate_id UUID;
  v_fielder_id UUID;
  v_meridian_id UUID;
  
  -- Variant IDs
  v_var_id UUID;
BEGIN
  -- Get Product IDs
  SELECT id INTO v_marlow_id FROM products WHERE slug = 'marlow-tote';
  SELECT id INTO v_advocate_id FROM products WHERE slug = 'advocate-briefcase';
  SELECT id INTO v_fielder_id FROM products WHERE slug = 'fielder-backpack';
  SELECT id INTO v_meridian_id FROM products WHERE slug = 'meridian-duffle';

  -- 1. MARLOW TOTE
  IF v_marlow_id IS NOT NULL THEN
    UPDATE products SET
      status = 'published',
      is_demo = false,
      personalisation = jsonb_build_object(
        'enabled', true,
        'label', 'Make It Yours',
        'sublabel', 'Add up to three initials, complimentary.',
        'max_chars', 3,
        'allowed_pattern', '^[A-Z0-9]{1,3}$',
        'finishes', jsonb_build_array(
          jsonb_build_object('id', 'blind', 'name', 'Blind Deboss', 'color', '#1F1B18', 'type', 'deboss'),
          jsonb_build_object('id', 'gold', 'name', 'Gold Foil', 'color', '#C5A059', 'type', 'foil'),
          jsonb_build_object('id', 'silver', 'name', 'Silver Foil', 'color', '#C0C0C0', 'type', 'foil')
        ),
        'default_finish', 'blind',
        'complimentary', true,
        'placement', jsonb_build_object('x_percent', 50, 'y_percent', 66, 'scale', 1.0, 'rotation_deg', 0, 'max_width_percent', 30)
      )
    WHERE id = v_marlow_id;

    -- Update existing Espresso variant
    UPDATE product_variants SET
      colour = 'Espresso', colour_hex = '#2B211D', sort_order = 0, is_active = true, stock_quantity = 30
    WHERE product_id = v_marlow_id AND (sku = 'CBR-TOT-ESP-001' OR colour = 'Espresso');

    SELECT id INTO v_var_id FROM product_variants WHERE product_id = v_marlow_id AND colour = 'Espresso' LIMIT 1;
    UPDATE product_images SET variant_id = v_var_id, is_primary = true WHERE product_id = v_marlow_id AND url LIKE '%tote-espresso%';

    -- Cognac
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_marlow_id, 'CBR-TOT-COG-001', 'Cognac', '#9A633F', 22, 1, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Cognac', colour_hex = '#9A633F', stock_quantity = 22, sort_order = 1
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_marlow_id, v_var_id, 'INR', 899900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 899900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_marlow_id, v_var_id, '/images/products/variants/marlow-tote-cognac-front.jpg', 'The Marlow Tote in Cognac', 1, true, 'approved');

    -- Black
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_marlow_id, 'CBR-TOT-BLK-001', 'Black', '#1F1B18', 18, 2, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Black', colour_hex = '#1F1B18', stock_quantity = 18, sort_order = 2
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_marlow_id, v_var_id, 'INR', 899900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 899900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_marlow_id, v_var_id, '/images/products/variants/marlow-tote-black-front.jpg', 'The Marlow Tote in Black', 2, true, 'approved');

    -- Tan
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_marlow_id, 'CBR-TOT-TAN-001', 'Tan', '#B5784E', 14, 3, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Tan', colour_hex = '#B5784E', stock_quantity = 14, sort_order = 3
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_marlow_id, v_var_id, 'INR', 899900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 899900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_marlow_id, v_var_id, '/images/products/variants/marlow-tote-tan-front.jpg', 'The Marlow Tote in Tan', 3, true, 'approved');
  END IF;

  -- 2. ADVOCATE BRIEFCASE
  IF v_advocate_id IS NOT NULL THEN
    UPDATE products SET
      status = 'published',
      is_demo = false,
      personalisation = jsonb_build_object(
        'enabled', true,
        'label', 'Make It Yours',
        'sublabel', 'Add up to three initials, complimentary.',
        'max_chars', 3,
        'allowed_pattern', '^[A-Z0-9]{1,3}$',
        'finishes', jsonb_build_array(
          jsonb_build_object('id', 'blind', 'name', 'Blind Deboss', 'color', '#1F1B18', 'type', 'deboss'),
          jsonb_build_object('id', 'gold', 'name', 'Gold Foil', 'color', '#C5A059', 'type', 'foil'),
          jsonb_build_object('id', 'silver', 'name', 'Silver Foil', 'color', '#C0C0C0', 'type', 'foil')
        ),
        'default_finish', 'blind',
        'complimentary', true,
        'placement', jsonb_build_object('x_percent', 42, 'y_percent', 44, 'scale', 0.9, 'rotation_deg', 0, 'max_width_percent', 28)
      )
    WHERE id = v_advocate_id;

    -- Update Cognac
    UPDATE product_variants SET
      colour = 'Cognac', colour_hex = '#9A633F', sort_order = 0, is_active = true, stock_quantity = 15
    WHERE product_id = v_advocate_id AND (sku = 'CBR-BRF-COG-001' OR colour = 'Cognac');

    SELECT id INTO v_var_id FROM product_variants WHERE product_id = v_advocate_id AND colour = 'Cognac' LIMIT 1;
    UPDATE product_images SET variant_id = v_var_id, is_primary = true WHERE product_id = v_advocate_id AND (url LIKE '%hero-briefcase%' OR url LIKE '%briefcase%');

    -- Espresso
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_advocate_id, 'CBR-BRF-ESP-001', 'Espresso', '#2B211D', 12, 1, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Espresso', colour_hex = '#2B211D', stock_quantity = 12, sort_order = 1
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_advocate_id, v_var_id, 'INR', 1299900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1299900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_advocate_id, v_var_id, '/images/products/variants/advocate-briefcase-espresso-front.jpg', 'The Advocate Briefcase in Espresso', 1, true, 'approved');

    -- Black
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_advocate_id, 'CBR-BRF-BLK-001', 'Black', '#1F1B18', 10, 2, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Black', colour_hex = '#1F1B18', stock_quantity = 10, sort_order = 2
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_advocate_id, v_var_id, 'INR', 1299900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1299900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_advocate_id, v_var_id, '/images/products/variants/advocate-briefcase-black-front.jpg', 'The Advocate Briefcase in Black', 2, true, 'approved');

    -- Tan
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_advocate_id, 'CBR-BRF-TAN-001', 'Tan', '#B5784E', 8, 3, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Tan', colour_hex = '#B5784E', stock_quantity = 8, sort_order = 3
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_advocate_id, v_var_id, 'INR', 1299900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1299900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_advocate_id, v_var_id, '/images/products/variants/advocate-briefcase-tan-front.jpg', 'The Advocate Briefcase in Tan', 3, true, 'approved');
  END IF;

  -- 3. FIELDER BACKPACK
  IF v_fielder_id IS NOT NULL THEN
    UPDATE products SET
      status = 'published',
      is_demo = false,
      personalisation = jsonb_build_object(
        'enabled', true,
        'label', 'Make It Yours',
        'sublabel', 'Add up to three initials, complimentary.',
        'max_chars', 3,
        'allowed_pattern', '^[A-Z0-9]{1,3}$',
        'finishes', jsonb_build_array(
          jsonb_build_object('id', 'blind', 'name', 'Blind Deboss', 'color', '#1F1B18', 'type', 'deboss'),
          jsonb_build_object('id', 'gold', 'name', 'Gold Foil', 'color', '#C5A059', 'type', 'foil'),
          jsonb_build_object('id', 'silver', 'name', 'Silver Foil', 'color', '#C0C0C0', 'type', 'foil')
        ),
        'default_finish', 'blind',
        'complimentary', true,
        'placement', jsonb_build_object('x_percent', 42, 'y_percent', 64, 'scale', 0.85, 'rotation_deg', 0, 'max_width_percent', 24)
      )
    WHERE id = v_fielder_id;

    -- Update Tan
    UPDATE product_variants SET
      colour = 'Tan', colour_hex = '#B5784E', sort_order = 0, is_active = true, stock_quantity = 20
    WHERE product_id = v_fielder_id AND (sku = 'CBR-BCK-TAN-001' OR colour = 'Tan');

    SELECT id INTO v_var_id FROM product_variants WHERE product_id = v_fielder_id AND colour = 'Tan' LIMIT 1;
    UPDATE product_images SET variant_id = v_var_id, is_primary = true WHERE product_id = v_fielder_id AND url LIKE '%backpack-tan%';

    -- Espresso
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_fielder_id, 'CBR-BCK-ESP-001', 'Espresso', '#2B211D', 14, 1, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Espresso', colour_hex = '#2B211D', stock_quantity = 14, sort_order = 1
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_fielder_id, v_var_id, 'INR', 1199900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1199900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_fielder_id, v_var_id, '/images/products/variants/fielder-backpack-espresso-front.jpg', 'The Fielder Backpack in Espresso', 1, true, 'approved');

    -- Cognac
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_fielder_id, 'CBR-BCK-COG-001', 'Cognac', '#9A633F', 16, 2, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Cognac', colour_hex = '#9A633F', stock_quantity = 16, sort_order = 2
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_fielder_id, v_var_id, 'INR', 1199900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1199900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_fielder_id, v_var_id, '/images/products/variants/fielder-backpack-cognac-front.jpg', 'The Fielder Backpack in Cognac', 2, true, 'approved');

    -- Black
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_fielder_id, 'CBR-BCK-BLK-001', 'Black', '#1F1B18', 10, 3, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Black', colour_hex = '#1F1B18', stock_quantity = 10, sort_order = 3
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_fielder_id, v_var_id, 'INR', 1199900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1199900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_fielder_id, v_var_id, '/images/products/variants/fielder-backpack-black-front.jpg', 'The Fielder Backpack in Black', 3, true, 'approved');
  END IF;

  -- 4. MERIDIAN DUFFLE
  IF v_meridian_id IS NOT NULL THEN
    UPDATE products SET
      status = 'published',
      is_demo = false,
      personalisation = jsonb_build_object(
        'enabled', true,
        'label', 'Make It Yours',
        'sublabel', 'Add up to three initials, complimentary.',
        'max_chars', 3,
        'allowed_pattern', '^[A-Z0-9]{1,3}$',
        'finishes', jsonb_build_array(
          jsonb_build_object('id', 'blind', 'name', 'Blind Deboss', 'color', '#1F1B18', 'type', 'deboss'),
          jsonb_build_object('id', 'gold', 'name', 'Gold Foil', 'color', '#C5A059', 'type', 'foil'),
          jsonb_build_object('id', 'silver', 'name', 'Silver Foil', 'color', '#C0C0C0', 'type', 'foil')
        ),
        'default_finish', 'blind',
        'complimentary', true,
        'placement', jsonb_build_object('x_percent', 62, 'y_percent', 63, 'scale', 0.85, 'rotation_deg', 0, 'max_width_percent', 24)
      )
    WHERE id = v_meridian_id;

    -- Update Cognac
    UPDATE product_variants SET
      colour = 'Cognac', colour_hex = '#9A633F', sort_order = 0, is_active = true, stock_quantity = 12
    WHERE product_id = v_meridian_id AND (sku = 'CBR-DFL-COG-001' OR colour = 'Cognac');

    SELECT id INTO v_var_id FROM product_variants WHERE product_id = v_meridian_id AND colour = 'Cognac' LIMIT 1;
    UPDATE product_images SET variant_id = v_var_id, is_primary = true WHERE product_id = v_meridian_id AND url LIKE '%duffle-travel%';

    -- Espresso
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_meridian_id, 'CBR-DFL-ESP-001', 'Espresso', '#2B211D', 10, 1, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Espresso', colour_hex = '#2B211D', stock_quantity = 10, sort_order = 1
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_meridian_id, v_var_id, 'INR', 1599900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1599900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_meridian_id, v_var_id, '/images/products/variants/meridian-duffle-espresso-front.jpg', 'The Meridian Duffle in Espresso', 1, true, 'approved');

    -- Black
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_meridian_id, 'CBR-DFL-BLK-001', 'Black', '#1F1B18', 8, 2, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Black', colour_hex = '#1F1B18', stock_quantity = 8, sort_order = 2
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_meridian_id, v_var_id, 'INR', 1599900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1599900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_meridian_id, v_var_id, '/images/products/variants/meridian-duffle-black-front.jpg', 'The Meridian Duffle in Black', 2, true, 'approved');

    -- Olive
    INSERT INTO product_variants (product_id, sku, colour, colour_hex, stock_quantity, sort_order, is_active)
    VALUES (v_meridian_id, 'CBR-DFL-OLV-001', 'Olive', '#6D7155', 6, 3, true)
    ON CONFLICT (sku) DO UPDATE SET colour = 'Olive', colour_hex = '#6D7155', stock_quantity = 6, sort_order = 3
    RETURNING id INTO v_var_id;
    INSERT INTO product_prices (product_id, variant_id, currency, amount_minor)
    VALUES (v_meridian_id, v_var_id, 'INR', 1649900) ON CONFLICT (variant_id, currency) DO UPDATE SET amount_minor = 1649900;
    INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status)
    VALUES (v_meridian_id, v_var_id, '/images/products/variants/meridian-duffle-olive-front.jpg', 'The Meridian Duffle in Olive', 3, true, 'approved');
  END IF;
END $$;
