-- =============================================================================
-- COBLEROAD — Migration 007: Real Product Catalogue
-- Replaces demo/fictional products with the 14 actual Cobleroad products.
-- Source: BAG AND LUGGAGE.zip (migrated 2026-10-31)
-- 
-- IMPORTANT: All products start as status='draft' and is_demo=false.
-- Admin must:
--   1. Set actual prices (currently 0)
--   2. Set actual stock quantities (currently 10)
--   3. Review all descriptions
--   4. Change status to 'published' when ready
-- =============================================================================

-- Step 1: Archive the old demo products (preserve referential integrity)
UPDATE products
SET status = 'archived', is_demo = true
WHERE id::text LIKE '22222222-%';

-- Step 2: Remove demo products from product_collections (cleanup junction)
DELETE FROM product_collections
WHERE product_id::text LIKE '22222222-%';

-- Step 3: Update collections to use real product images
UPDATE collections SET image_url = '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png'
WHERE slug = 'work-bags';

UPDATE collections SET image_url = '/images/products/real/inappreciable-tote/inappreciable-tote-05.png'
WHERE slug = 'everyday-bags';

UPDATE collections SET image_url = '/images/products/real/weekender-duffle/weekender-duffle-11.png'
WHERE slug = 'travel-essentials';

-- Step 4: Insert the 14 real products
INSERT INTO products (
  id, slug, name, short_description, description,
  status, is_featured, is_demo, material_description, personalisation
) VALUES

-- WORK BAGS
(
  'aaaaaaaa-0001-0000-0000-000000000001',
  'unfold-laptop-bag',
  '2 Unfold Laptop Bag Heritage',
  'A convertible heritage leather laptop bag that transforms between briefcase and backpack.',
  'The 2 Unfold is a testament to intelligent leather craftsmanship. Carry it as a structured briefcase for the boardroom, then unfold the rear panel to reveal hidden backpack straps for the commute. Fits laptops up to 15 inches with a padded sleeve, plus documents and daily essentials across multiple compartments.',
  'draft', true, false,
  'Genuine full-grain leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-0002-0000-0000-000000000002',
  'atlanta-laptop-sleeve',
  'Atlanta Laptop Sleeve',
  'A slim genuine leather laptop sleeve in four heritage colours.',
  'The Atlanta Laptop Sleeve offers protective elegance without bulk. Full-grain leather exterior with a soft microfibre lining keeps your laptop scratch-free. Available in Black, Brown, Cognac, and Green — each colour develops a unique patina over time.',
  'draft', false, false,
  'Genuine full-grain leather',
  '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'
),
(
  'aaaaaaaa-0006-0000-0000-000000000006',
  'optimus-transformer-bag',
  'Optimus Transformer Bag',
  'A multi-functional leather bag that converts between messenger, backpack, and briefcase.',
  'The Optimus is built for those who refuse to choose. Three carry modes — messenger crossbody, backpack, and top-handle briefcase — achieved through a modular strap and tuck system. Available in five premium leather colours, each with brass hardware.',
  'draft', true, false,
  'Genuine full-grain leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),

-- EVERYDAY BAGS
(
  'aaaaaaaa-0003-0000-0000-000000000003',
  'hipster-fanny-bag',
  'Hipster Fanny Bum Bag',
  'A compact genuine leather fanny pack worn at the hip or crossbody.',
  'The Hipster Fanny Bum Bag redefines the waist pack. Crafted in full-grain leather with a smooth zip closure, it carries cards, phone, keys, and a small wallet comfortably at the hip. Adjustable webbing belt fits all waist sizes. Wear it front, back, or slung across the chest.',
  'draft', false, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-0004-0000-0000-000000000004',
  'metropolitan-backpack',
  'Metropolitan Backpack',
  'A sleek structured leather backpack for the urban professional.',
  'The Metropolitan Backpack is engineered for city life. A padded laptop sleeve (up to 15"), organiser panel, and water bottle pocket keep your day structured. Padded back panel and adjustable straps distribute weight naturally across the shoulders.',
  'draft', true, false,
  'Genuine leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-0005-0000-0000-000000000005',
  'old-school-rucksack',
  'Old School Rucksack',
  'A classic roll-top leather rucksack with vintage military heritage.',
  'The Old School Rucksack draws from vintage military heritage. The roll-top closure seals your belongings securely while the wide body accommodates everything from a weekend kit to daily essentials. Side cinch straps keep the load tight. Wears beautifully with age.',
  'draft', false, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-000b-0000-0000-00000000000b',
  'inappreciable-tote',
  'The Inappreciable Leather Tote Bag',
  'An understated open-top tote in premium leather with interior organisation.',
  'Named for the quality that reveals itself only through use, the Inappreciable Tote is quietly exceptional. An open top with magnetic snap closure, internal zip pocket, and pen slip make it the ideal companion for those who prefer substance to display.',
  'draft', true, false,
  'Genuine full-grain leather',
  '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'
),
(
  'aaaaaaaa-000c-0000-0000-00000000000c',
  'slugger-backpack',
  'The Slugger Backpack',
  'A rugged, oversized leather backpack built for serious carry.',
  'The Slugger earns its name. Built wide and deep with a structured base, padded double straps, and a large main compartment that swallows everything you need and more. Side grab handles for quick lifts. The leather improves with every use, developing a rich personal patina.',
  'draft', false, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-000d-0000-0000-00000000000d',
  'willowy-backpack',
  'The Willowy Backpack',
  'A slender, minimal leather backpack for the essentials.',
  'The Willowy carries less so you carry it more. Its slim profile and clean lines make it the definitive urban backpack — lightweight, polished, and effortless. Single main compartment with a slim front slip pocket for quick access. Rolled leather grab handle at the top.',
  'draft', false, false,
  'Genuine leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),

-- TRAVEL ESSENTIALS
(
  'aaaaaaaa-0007-0000-0000-000000000007',
  'riviera-backpack',
  'Riviera Backpack Travel Bag',
  'A premium leather travel backpack with a structured frame and dual carry.',
  'The Riviera is a leather travel backpack that moves between the trails and the terminal without apology. A structured frame keeps its shape under load, while the padded laptop sleeve, multiple compartments, and detachable hip belt make it ready for long hauls. Available in Cognac and Black.',
  'draft', true, false,
  'Genuine full-grain leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-0008-0000-0000-000000000008',
  'shoe-compartment-duffle',
  'Shoe Compartment Duffle Bag',
  'A leather gym and travel duffle with a dedicated ventilated shoe compartment.',
  'The Shoe Compartment Duffle solves the oldest gym problem: keeping your shoes separate. A ventilated lower compartment houses footwear in isolation, while the spacious main body holds clothes, gear, and toiletries. Twin grab handles and a detachable shoulder strap offer carry flexibility.',
  'draft', false, false,
  'Genuine leather exterior',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-0009-0000-0000-000000000009',
  'barrel-gym-bag',
  'The Barrel Gym Bag',
  'A classic leather barrel duffel that goes from the gym to the weekend.',
  'The Barrel Gym Bag is shaped by purpose and refined by leather. The cylindrical silhouette maximises packing volume while the structured base protects the bag''s form. Twin zip closure runs the full length of the top for easy access. Available in Cognac and Black.',
  'draft', true, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-000a-0000-0000-00000000000a',
  'highway-overnight-bag',
  'The Highway Overnight Travel Bag',
  'A structured overnight bag in premium leather for the discerning traveller.',
  'The Highway is built for the 48-hour trip. Structured walls hold its shape whether packed or empty. A wide zip opening gives unobstructed access to the main compartment, while a front slip pocket and interior organiser keep essentials reachable.',
  'draft', false, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
),
(
  'aaaaaaaa-000e-0000-0000-00000000000e',
  'weekender-duffle',
  'Weekender Duffle Bag',
  'A generous leather weekender with twin-handle carry and shoulder strap.',
  'The Weekender Duffle is the quiet standard of leather travel bags. Spacious enough for a proper two-night trip with a separate end pocket for shoes or toiletries. The twin grab handles and adjustable shoulder strap offer three carry positions. Available in Cognac and Black leather.',
  'draft', true, false,
  'Genuine full-grain leather',
  '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'
)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      is_featured = EXCLUDED.is_featured,
      is_demo = EXCLUDED.is_demo,
      material_description = EXCLUDED.material_description,
      updated_at = now();

-- Step 5: Insert product variants
INSERT INTO product_variants (id, product_id, sku, colour, colour_hex, stock_quantity, is_active, sort_order) VALUES
-- Unfold Laptop Bag
('bbbbbbbb-0001-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', 'CBR-UNF-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Atlanta Laptop Sleeve (4 colours)
('bbbbbbbb-0002-0000-0000-000000000001', 'aaaaaaaa-0002-0000-0000-000000000002', 'CBR-ATL-COG-001', 'Cognac', '#9A633F', 10, true, 1),
('bbbbbbbb-0002-0000-0000-000000000002', 'aaaaaaaa-0002-0000-0000-000000000002', 'CBR-ATL-BLK-001', 'Black', '#1A1A1A', 10, true, 2),
('bbbbbbbb-0002-0000-0000-000000000003', 'aaaaaaaa-0002-0000-0000-000000000002', 'CBR-ATL-BRN-001', 'Brown', '#5C3A1E', 10, true, 3),
('bbbbbbbb-0002-0000-0000-000000000004', 'aaaaaaaa-0002-0000-0000-000000000002', 'CBR-ATL-GRN-001', 'Green', '#3D5A47', 10, true, 4),
-- Hipster Fanny Bag
('bbbbbbbb-0003-0000-0000-000000000001', 'aaaaaaaa-0003-0000-0000-000000000003', 'CBR-FNY-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Metropolitan Backpack
('bbbbbbbb-0004-0000-0000-000000000001', 'aaaaaaaa-0004-0000-0000-000000000004', 'CBR-MET-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Old School Rucksack
('bbbbbbbb-0005-0000-0000-000000000001', 'aaaaaaaa-0005-0000-0000-000000000005', 'CBR-OSR-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Optimus Transformer Bag (4 colours)
('bbbbbbbb-0006-0000-0000-000000000001', 'aaaaaaaa-0006-0000-0000-000000000006', 'CBR-OPT-COG-001', 'Cognac', '#9A633F', 10, true, 1),
('bbbbbbbb-0006-0000-0000-000000000002', 'aaaaaaaa-0006-0000-0000-000000000006', 'CBR-OPT-BLK-001', 'Black', '#1A1A1A', 10, true, 2),
('bbbbbbbb-0006-0000-0000-000000000003', 'aaaaaaaa-0006-0000-0000-000000000006', 'CBR-OPT-GRN-001', 'Green', '#3D5A47', 10, true, 3),
('bbbbbbbb-0006-0000-0000-000000000004', 'aaaaaaaa-0006-0000-0000-000000000006', 'CBR-OPT-RED-001', 'Red', '#8B2B2B', 10, true, 4),
-- Riviera Backpack (2 colours)
('bbbbbbbb-0007-0000-0000-000000000001', 'aaaaaaaa-0007-0000-0000-000000000007', 'CBR-RIV-COG-001', 'Cognac', '#9A633F', 10, true, 1),
('bbbbbbbb-0007-0000-0000-000000000002', 'aaaaaaaa-0007-0000-0000-000000000007', 'CBR-RIV-BLK-001', 'Black', '#1A1A1A', 10, true, 2),
-- Shoe Compartment Duffle
('bbbbbbbb-0008-0000-0000-000000000001', 'aaaaaaaa-0008-0000-0000-000000000008', 'CBR-SHD-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Barrel Gym Bag (2 colours)
('bbbbbbbb-0009-0000-0000-000000000001', 'aaaaaaaa-0009-0000-0000-000000000009', 'CBR-BRL-COG-001', 'Cognac', '#9A633F', 10, true, 1),
('bbbbbbbb-0009-0000-0000-000000000002', 'aaaaaaaa-0009-0000-0000-000000000009', 'CBR-BRL-BLK-001', 'Black', '#1A1A1A', 10, true, 2),
-- Highway Overnight Bag
('bbbbbbbb-000a-0000-0000-00000000000a', 'aaaaaaaa-000a-0000-0000-00000000000a', 'CBR-HWY-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Inappreciable Tote
('bbbbbbbb-000b-0000-0000-00000000000b', 'aaaaaaaa-000b-0000-0000-00000000000b', 'CBR-TOT-TAN-001', 'Tan', '#B5784E', 10, true, 1),
-- Slugger Backpack
('bbbbbbbb-000c-0000-0000-00000000000c', 'aaaaaaaa-000c-0000-0000-00000000000c', 'CBR-SLG-COG-001', 'Cognac', '#9A633F', 10, true, 1),
-- Willowy Backpack
('bbbbbbbb-000d-0000-0000-00000000000d', 'aaaaaaaa-000d-0000-0000-00000000000d', 'CBR-WLW-TAN-001', 'Tan', '#B5784E', 10, true, 1),
-- Weekender Duffle (2 colours)
('bbbbbbbb-000e-0000-0000-00000000000e', 'aaaaaaaa-000e-0000-0000-00000000000e', 'CBR-WKD-COG-001', 'Cognac', '#9A633F', 10, true, 1),
('bbbbbbbb-000e-0000-0000-000000000002', 'aaaaaaaa-000e-0000-0000-00000000000e', 'CBR-WKD-BLK-001', 'Black', '#1A1A1A', 10, true, 2)
ON CONFLICT (sku) DO UPDATE
  SET colour = EXCLUDED.colour, colour_hex = EXCLUDED.colour_hex, updated_at = now();

-- Step 6: Insert placeholder prices (0 paise = must be set by admin before publishing)
-- Admin: Go to /admin/products and set real prices before changing status to 'published'
INSERT INTO product_prices (product_id, variant_id, currency, amount_minor) VALUES
('aaaaaaaa-0001-0000-0000-000000000001', 'bbbbbbbb-0001-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000002', 'INR', 0),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000003', 'INR', 0),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000004', 'INR', 0),
('aaaaaaaa-0003-0000-0000-000000000003', 'bbbbbbbb-0003-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0004-0000-0000-000000000004', 'bbbbbbbb-0004-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0005-0000-0000-000000000005', 'bbbbbbbb-0005-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000002', 'INR', 0),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000003', 'INR', 0),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000004', 'INR', 0),
('aaaaaaaa-0007-0000-0000-000000000007', 'bbbbbbbb-0007-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0007-0000-0000-000000000007', 'bbbbbbbb-0007-0000-0000-000000000002', 'INR', 0),
('aaaaaaaa-0008-0000-0000-000000000008', 'bbbbbbbb-0008-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0009-0000-0000-000000000009', 'bbbbbbbb-0009-0000-0000-000000000001', 'INR', 0),
('aaaaaaaa-0009-0000-0000-000000000009', 'bbbbbbbb-0009-0000-0000-000000000002', 'INR', 0),
('aaaaaaaa-000a-0000-0000-00000000000a', 'bbbbbbbb-000a-0000-0000-00000000000a', 'INR', 0),
('aaaaaaaa-000b-0000-0000-00000000000b', 'bbbbbbbb-000b-0000-0000-00000000000b', 'INR', 0),
('aaaaaaaa-000c-0000-0000-00000000000c', 'bbbbbbbb-000c-0000-0000-00000000000c', 'INR', 0),
('aaaaaaaa-000d-0000-0000-00000000000d', 'bbbbbbbb-000d-0000-0000-00000000000d', 'INR', 0),
('aaaaaaaa-000e-0000-0000-00000000000e', 'bbbbbbbb-000e-0000-0000-00000000000e', 'INR', 0),
('aaaaaaaa-000e-0000-0000-00000000000e', 'bbbbbbbb-000e-0000-0000-000000000002', 'INR', 0)
ON CONFLICT (variant_id, currency) DO NOTHING;

-- Step 7: Insert product images (primary images for each product/variant)
INSERT INTO product_images (product_id, variant_id, url, alt, sort_order, is_primary, status) VALUES
-- Unfold Laptop Bag
('aaaaaaaa-0001-0000-0000-000000000001', 'bbbbbbbb-0001-0000-0000-000000000001', '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png', '2 Unfold Laptop Bag Heritage — Front', 1, true, 'ready'),
('aaaaaaaa-0001-0000-0000-000000000001', NULL, '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-02.png', '2 Unfold Laptop Bag Heritage — Back', 2, false, 'ready'),
('aaaaaaaa-0001-0000-0000-000000000001', NULL, '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-03.png', '2 Unfold Laptop Bag Heritage — Side', 3, false, 'ready'),
('aaaaaaaa-0001-0000-0000-000000000001', NULL, '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-04.png', '2 Unfold Laptop Bag Heritage — Detail', 4, false, 'ready'),
-- Atlanta Laptop Sleeve
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000001', '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-03.png', 'Atlanta Laptop Sleeve in Cognac', 1, true, 'ready'),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000002', '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png', 'Atlanta Laptop Sleeve in Black', 2, false, 'ready'),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000003', '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-02.png', 'Atlanta Laptop Sleeve in Brown', 3, false, 'ready'),
('aaaaaaaa-0002-0000-0000-000000000002', 'bbbbbbbb-0002-0000-0000-000000000004', '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-07.png', 'Atlanta Laptop Sleeve in Green', 4, false, 'ready'),
('aaaaaaaa-0002-0000-0000-000000000002', NULL, '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-04.png', 'Atlanta Laptop Sleeve — Studio Hero', 5, false, 'ready'),
-- Hipster Fanny Bag
('aaaaaaaa-0003-0000-0000-000000000003', 'bbbbbbbb-0003-0000-0000-000000000001', '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-01.png', 'Hipster Fanny Bum Bag — Front', 1, true, 'ready'),
('aaaaaaaa-0003-0000-0000-000000000003', NULL, '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-03.png', 'Hipster Fanny Bum Bag — Lifestyle', 2, false, 'ready'),
('aaaaaaaa-0003-0000-0000-000000000003', NULL, '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-04.png', 'Hipster Fanny Bum Bag — Side', 3, false, 'ready'),
-- Metropolitan Backpack
('aaaaaaaa-0004-0000-0000-000000000004', 'bbbbbbbb-0004-0000-0000-000000000001', '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png', 'Metropolitan Backpack — Front', 1, true, 'ready'),
('aaaaaaaa-0004-0000-0000-000000000004', NULL, '/images/products/real/metropolitan-backpack/metropolitan-backpack-02.png', 'Metropolitan Backpack — Back', 2, false, 'ready'),
('aaaaaaaa-0004-0000-0000-000000000004', NULL, '/images/products/real/metropolitan-backpack/metropolitan-backpack-03.png', 'Metropolitan Backpack — Side', 3, false, 'ready'),
-- Old School Rucksack
('aaaaaaaa-0005-0000-0000-000000000005', 'bbbbbbbb-0005-0000-0000-000000000001', '/images/products/real/old-school-rucksack/old-school-rucksack-01.png', 'Old School Rucksack — Front', 1, true, 'ready'),
('aaaaaaaa-0005-0000-0000-000000000005', NULL, '/images/products/real/old-school-rucksack/old-school-rucksack-02.png', 'Old School Rucksack — Side', 2, false, 'ready'),
('aaaaaaaa-0005-0000-0000-000000000005', NULL, '/images/products/real/old-school-rucksack/old-school-rucksack-09.png', 'Old School Rucksack — Lifestyle', 3, false, 'ready'),
-- Optimus Transformer Bag
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000001', '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-13.png', 'Optimus Transformer Bag in Cognac', 1, true, 'ready'),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000002', '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-10.png', 'Optimus Transformer Bag in Black', 2, false, 'ready'),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000003', '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-16.png', 'Optimus Transformer Bag in Green', 3, false, 'ready'),
('aaaaaaaa-0006-0000-0000-000000000006', 'bbbbbbbb-0006-0000-0000-000000000004', '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-18.png', 'Optimus Transformer Bag in Red', 4, false, 'ready'),
('aaaaaaaa-0006-0000-0000-000000000006', NULL, '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-01.png', 'Optimus Transformer Bag — Studio Detail', 5, false, 'ready'),
-- Riviera Backpack
('aaaaaaaa-0007-0000-0000-000000000007', 'bbbbbbbb-0007-0000-0000-000000000001', '/images/products/real/riviera-backpack/riviera-backpack-06.png', 'Riviera Backpack in Cognac — Front', 1, true, 'ready'),
('aaaaaaaa-0007-0000-0000-000000000007', 'bbbbbbbb-0007-0000-0000-000000000002', '/images/products/real/riviera-backpack/riviera-backpack-01.png', 'Riviera Backpack in Black — Front', 2, false, 'ready'),
('aaaaaaaa-0007-0000-0000-000000000007', NULL, '/images/products/real/riviera-backpack/riviera-backpack-07.png', 'Riviera Backpack — Side Carry', 3, false, 'ready'),
('aaaaaaaa-0007-0000-0000-000000000007', NULL, '/images/products/real/riviera-backpack/riviera-backpack-08.png', 'Riviera Backpack — Back Panel', 4, false, 'ready'),
-- Shoe Compartment Duffle
('aaaaaaaa-0008-0000-0000-000000000008', 'bbbbbbbb-0008-0000-0000-000000000001', '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png', 'Shoe Compartment Duffle Bag — Front', 1, true, 'ready'),
('aaaaaaaa-0008-0000-0000-000000000008', NULL, '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-02.png', 'Shoe Compartment Duffle Bag — Side', 2, false, 'ready'),
('aaaaaaaa-0008-0000-0000-000000000008', NULL, '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-06.png', 'Shoe Compartment Duffle Bag — Detail', 3, false, 'ready'),
-- Barrel Gym Bag
('aaaaaaaa-0009-0000-0000-000000000009', 'bbbbbbbb-0009-0000-0000-000000000001', '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png', 'The Barrel Gym Bag in Cognac', 1, true, 'ready'),
('aaaaaaaa-0009-0000-0000-000000000009', 'bbbbbbbb-0009-0000-0000-000000000002', '/images/products/real/barrel-gym-bag/barrel-gym-bag-01.png', 'The Barrel Gym Bag in Black', 2, false, 'ready'),
('aaaaaaaa-0009-0000-0000-000000000009', NULL, '/images/products/real/barrel-gym-bag/barrel-gym-bag-09.png', 'The Barrel Gym Bag — Lifestyle', 3, false, 'ready'),
-- Highway Overnight Bag
('aaaaaaaa-000a-0000-0000-00000000000a', 'bbbbbbbb-000a-0000-0000-00000000000a', '/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png', 'The Highway Overnight Travel Bag — Front', 1, true, 'ready'),
('aaaaaaaa-000a-0000-0000-00000000000a', NULL, '/images/products/real/highway-overnight-bag/highway-overnight-bag-07.png', 'The Highway Overnight Travel Bag — Lifestyle', 2, false, 'ready'),
('aaaaaaaa-000a-0000-0000-00000000000a', NULL, '/images/products/real/highway-overnight-bag/highway-overnight-bag-01.png', 'The Highway Overnight Travel Bag — Studio', 3, false, 'ready'),
-- Inappreciable Tote
('aaaaaaaa-000b-0000-0000-00000000000b', 'bbbbbbbb-000b-0000-0000-00000000000b', '/images/products/real/inappreciable-tote/inappreciable-tote-05.png', 'The Inappreciable Leather Tote Bag — Hero', 1, true, 'ready'),
('aaaaaaaa-000b-0000-0000-00000000000b', NULL, '/images/products/real/inappreciable-tote/inappreciable-tote-06.png', 'The Inappreciable Leather Tote Bag — Side', 2, false, 'ready'),
('aaaaaaaa-000b-0000-0000-00000000000b', NULL, '/images/products/real/inappreciable-tote/inappreciable-tote-01.png', 'The Inappreciable Leather Tote Bag — Studio', 3, false, 'ready'),
-- Slugger Backpack
('aaaaaaaa-000c-0000-0000-00000000000c', 'bbbbbbbb-000c-0000-0000-00000000000c', '/images/products/real/slugger-backpack/slugger-backpack-01.png', 'The Slugger Backpack — Front', 1, true, 'ready'),
('aaaaaaaa-000c-0000-0000-00000000000c', NULL, '/images/products/real/slugger-backpack/slugger-backpack-02.png', 'The Slugger Backpack — Side', 2, false, 'ready'),
('aaaaaaaa-000c-0000-0000-00000000000c', NULL, '/images/products/real/slugger-backpack/slugger-backpack-04.png', 'The Slugger Backpack — Detail', 3, false, 'ready'),
-- Willowy Backpack
('aaaaaaaa-000d-0000-0000-00000000000d', 'bbbbbbbb-000d-0000-0000-00000000000d', '/images/products/real/willowy-backpack/willowy-backpack-02.png', 'The Willowy Backpack — Hero', 1, true, 'ready'),
('aaaaaaaa-000d-0000-0000-00000000000d', NULL, '/images/products/real/willowy-backpack/willowy-backpack-05.png', 'The Willowy Backpack — Lifestyle', 2, false, 'ready'),
('aaaaaaaa-000d-0000-0000-00000000000d', NULL, '/images/products/real/willowy-backpack/willowy-backpack-07.png', 'The Willowy Backpack — Side', 3, false, 'ready'),
-- Weekender Duffle
('aaaaaaaa-000e-0000-0000-00000000000e', 'bbbbbbbb-000e-0000-0000-00000000000e', '/images/products/real/weekender-duffle/weekender-duffle-11.png', 'Weekender Duffle Bag in Cognac', 1, true, 'ready'),
('aaaaaaaa-000e-0000-0000-00000000000e', 'bbbbbbbb-000e-0000-0000-000000000002', '/images/products/real/weekender-duffle/weekender-duffle-08.png', 'Weekender Duffle Bag in Black', 2, false, 'ready'),
('aaaaaaaa-000e-0000-0000-00000000000e', NULL, '/images/products/real/weekender-duffle/weekender-duffle-15.png', 'Weekender Duffle Bag — Lifestyle', 3, false, 'ready'),
('aaaaaaaa-000e-0000-0000-00000000000e', NULL, '/images/products/real/weekender-duffle/weekender-duffle-16.png', 'Weekender Duffle Bag — Detail', 4, false, 'ready')
ON CONFLICT DO NOTHING;

-- Step 8: Map products to collections
INSERT INTO product_collections (product_id, collection_id) VALUES
-- Work Bags collection (id: 11111111-0000-0000-0000-000000000001)
('aaaaaaaa-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
('aaaaaaaa-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001'),
('aaaaaaaa-0006-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001'),
-- Everyday Bags (id: 11111111-0000-0000-0000-000000000002)
('aaaaaaaa-0003-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002'),
('aaaaaaaa-0004-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002'),
('aaaaaaaa-0005-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002'),
('aaaaaaaa-000b-0000-0000-00000000000b', '11111111-0000-0000-0000-000000000002'),
('aaaaaaaa-000c-0000-0000-00000000000c', '11111111-0000-0000-0000-000000000002'),
('aaaaaaaa-000d-0000-0000-00000000000d', '11111111-0000-0000-0000-000000000002'),
-- Metropolitan also in Work Bags
('aaaaaaaa-0004-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001'),
-- Travel Essentials (id: 11111111-0000-0000-0000-000000000003)
('aaaaaaaa-0007-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003'),
('aaaaaaaa-0008-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003'),
('aaaaaaaa-0009-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003'),
('aaaaaaaa-000a-0000-0000-00000000000a', '11111111-0000-0000-0000-000000000003'),
('aaaaaaaa-000e-0000-0000-00000000000e', '11111111-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ADMIN REMINDER: After running this migration
-- 1. Log in to /admin
-- 2. Open each of the 14 products
-- 3. Set real prices (currently 0 INR)
-- 4. Confirm stock quantities
-- 5. Change status from 'draft' to 'published'
-- 6. Products will appear on the live store only after publishing
-- =============================================================================
