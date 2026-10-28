-- =============================================================================
-- COBLEROAD — Migration 003: Demo Seed Data (Development only)
-- All products marked is_demo = true. Admins must review and publish.
-- Prices are placeholders in INR minor units (paise).
-- =============================================================================

-- Collections
INSERT INTO collections (id, slug, name, description, image_url, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'work-bags', 'Work Bags', 'Structured leather bags designed for the modern professional.', '/images/products/laptop-bag.jpg', 1),
  ('11111111-0000-0000-0000-000000000002', 'everyday-bags', 'Everyday Bags', 'Versatile leather companions for daily life.', '/images/products/tote-espresso.jpg', 2),
  ('11111111-0000-0000-0000-000000000003', 'travel-essentials', 'Travel Essentials', 'Travel with intention. Leather built for the journey.', '/images/products/duffle-travel.jpg', 3),
  ('11111111-0000-0000-0000-000000000004', 'small-leather-goods', 'Small Leather Goods', 'Refined accessories for the essentials.', '/images/products/cardholder.jpg', 4)
ON CONFLICT (slug) DO NOTHING;

-- Products (20 entries, all demo/draft)
INSERT INTO products (id, slug, name, short_description, description, status, is_featured, is_demo, material_description, personalisation) VALUES
  -- Work Bags
  ('22222222-0000-0000-0000-000000000001', 'advocate-briefcase', 'The Advocate Briefcase', 'A structured leather briefcase with dual-buckle closure.', 'The Advocate is built for those who carry more than a laptop. With its dual-buckle top flap, reinforced base, and removable shoulder strap, it transitions from the boardroom to the evening with quiet authority.', 'draft', true, true, 'Genuine leather exterior', '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000002', 'meridian-laptop-bag', 'The Meridian Laptop Bag', 'A clean-lined leather laptop bag with front zip access.', 'The Meridian holds a 15-inch laptop in its padded sleeve while keeping documents flat and organised. The exterior wears beautifully over time.', 'draft', true, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000003', 'telegraph-messenger', 'The Telegraph Messenger', 'A crossbody messenger with a magnetic flap closure.', 'The Telegraph keeps essentials close and accessible. Its single-buckle closure and adjustable strap make it the ideal companion from desk to commute.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000004', 'portfolio-fold', 'The Portfolio Folio', 'A slim leather document folio with card pockets.', 'For meetings and presentations, the Portfolio Folio carries an A4 notepad, business cards, and a pen with nothing wasted.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Monogram", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  -- Everyday Bags
  ('22222222-0000-0000-0000-000000000005', 'marlow-tote', 'The Marlow Tote', 'An open-top leather tote with internal zip pocket.', 'The Marlow is a generous, unstructured tote with enough room for a day''s essentials plus a change of clothes. The double handles are substantial enough to carry comfortably on the shoulder.', 'draft', true, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000006', 'crossroads-crossbody', 'The Crossroads Crossbody', 'A compact crossbody with external and internal pockets.', 'The Crossroads is designed for those who prefer to carry less but carry it well. Fits a phone, cards, keys, and a small notebook with room to spare.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000007', 'fielder-backpack', 'The Fielder Backpack', 'A structured leather backpack with padded laptop sleeve.', 'The Fielder carries everything and announces nothing. Its padded back panel and adjustable straps distribute weight evenly without sacrificing style.', 'draft', true, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000008', 'brimfield-satchel', 'The Brimfield Satchel', 'A top-handle leather satchel with brass hardware.', 'A clean, timeless silhouette with enough space for a 13-inch laptop and daily documents. The Brimfield carries a quiet formality in any context.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  -- Travel
  ('22222222-0000-0000-0000-000000000009', 'meridian-duffle', 'The Meridian Duffle', 'A large leather travel duffle with reinforced base.', 'For those who travel with conviction. The Meridian Duffle is built wide and deep, with a double zipper and solid base feet to protect the leather during transit.', 'draft', true, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000010', 'atlas-weekender', 'The Atlas Weekender', 'A weekend bag sized for a thoughtful two-night trip.', 'Pack for a weekend and arrive looking effortless. The Atlas holds two days'' essentials in a structured frame with a detachable toiletry pouch included.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000011', 'venture-toiletry', 'The Venture Toiletry Bag', 'A leather dopp kit with water-resistant lining.', 'Keep your essentials organised. The Venture Toiletry Bag fits full-size bottles and features a water-resistant interior lining.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000012', 'transit-passport-wallet', 'The Transit Passport Wallet', 'A leather travel wallet for passport, cards, and boarding passes.', 'For the considered traveller, the Transit keeps passport, boarding passes, currency, and cards in one elegant leather holder.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Monogram", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  -- Small Leather Goods
  ('22222222-0000-0000-0000-000000000013', 'folding-wallet-slim', 'The Folding Wallet', 'A slim bifold wallet in genuine leather.', 'Clean, flat, and functional. The Folding Wallet holds eight cards and notes without the unnecessary bulk.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000014', 'card-sleeve', 'The Card Sleeve', 'A flat leather cardholder for minimal carry.', 'Four cards. That is all. The Card Sleeve is built for those who carry only what is necessary.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000015', 'key-holder', 'The Key Holder', 'A leather key fob organiser with four hooks.', 'Silence the jingle. The Key Holder organises four keys flat in a leather wrap with a carabiner loop.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000016', 'field-notebook-cover', 'The Field Notebook Cover', 'A leather notebook cover for A5 notebooks.', 'Protects a standard A5 notebook. Features a card slot and pen loop on the interior.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000017', 'cable-organiser', 'The Cable Organiser', 'A small leather pouch for cables and accessories.', 'Keeps cables, adapters, and earbuds from tangling in a bag. Simple zip closure, clean interior.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000018', 'luggage-tag', 'The Luggage Tag', 'A personalised leather luggage tag.', 'Identify your bag without compromise. Genuine leather with a clear cardholder window and secure loop.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": true, "label": "Add initials", "max_chars": 3, "allowed_pattern": "^[A-Z]{1,3}$", "styles": []}'),
  ('22222222-0000-0000-0000-000000000019', 'meridian-work-tote', 'The Meridian Work Tote', 'A structured leather work tote with shoulder and hand carry.', 'The Meridian Work Tote is built for the professional who needs to carry a laptop, documents, and lunch without looking dishevelled.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}'),
  ('22222222-0000-0000-0000-000000000020', 'expedition-backpack', 'The Expedition Backpack', 'A leather daypack built for longer carry.', 'More room, same refinement. The Expedition Backpack fits a 17-inch laptop and a day''s worth of equipment without losing its composure.', 'draft', false, true, 'Genuine leather exterior', '{"enabled": false, "label": "", "max_chars": 0, "allowed_pattern": null, "styles": []}')
ON CONFLICT (slug) DO NOTHING;

-- Product Images (using local placeholders that will be replaced)
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001', '/images/products/briefcase-cognac.jpg', 'The Advocate Briefcase in Cognac', 0),
  ('22222222-0000-0000-0000-000000000002', '/images/products/laptop-bag.jpg', 'The Meridian Laptop Bag', 0),
  ('22222222-0000-0000-0000-000000000003', '/images/products/messenger-cognac.jpg', 'The Telegraph Messenger in Cognac', 0),
  ('22222222-0000-0000-0000-000000000005', '/images/products/tote-espresso.jpg', 'The Marlow Tote in Espresso', 0),
  ('22222222-0000-0000-0000-000000000006', '/images/products/messenger-cognac.jpg', 'The Crossroads Crossbody', 0),
  ('22222222-0000-0000-0000-000000000007', '/images/products/backpack-tan.jpg', 'The Fielder Backpack in Tan', 0),
  ('22222222-0000-0000-0000-000000000008', '/images/products/laptop-bag.jpg', 'The Brimfield Satchel', 0),
  ('22222222-0000-0000-0000-000000000009', '/images/products/duffle-travel.jpg', 'The Meridian Duffle', 0),
  ('22222222-0000-0000-0000-000000000010', '/images/products/weekender.jpg', 'The Atlas Weekender', 0),
  ('22222222-0000-0000-0000-000000000013', '/images/products/wallet-slim.jpg', 'The Folding Wallet', 0),
  ('22222222-0000-0000-0000-000000000014', '/images/products/cardholder.jpg', 'The Card Sleeve', 0),
  ('22222222-0000-0000-0000-000000000012', '/images/products/passport-holder.jpg', 'The Transit Passport Wallet', 0)
ON CONFLICT DO NOTHING;

-- Product-Collection mappings
INSERT INTO product_collections (product_id, collection_id) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000019', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000020', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000014', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000015', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000016', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000017', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000018', '11111111-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Product Variants (one per product initially)
-- Prices are placeholder INR amounts for demo. Admin must review before publishing.
INSERT INTO product_variants (id, product_id, sku, colour, stock_quantity) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'CBR-BRF-COG-001', 'Cognac', 15),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'CBR-LAP-COG-001', 'Cognac', 20),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 'CBR-MSG-COG-001', 'Cognac', 25),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', 'CBR-PTF-TAN-001', 'Tan', 18),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 'CBR-TOT-ESP-001', 'Espresso', 30),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000006', 'CBR-CRS-COG-001', 'Cognac', 35),
  ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000007', 'CBR-BCK-TAN-001', 'Tan', 20),
  ('33333333-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000008', 'CBR-SAT-ESP-001', 'Espresso', 22),
  ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000009', 'CBR-DFL-COG-001', 'Cognac', 12),
  ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000010', 'CBR-WKN-TAN-001', 'Tan', 10),
  ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000011', 'CBR-TLT-TAN-001', 'Tan', 40),
  ('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000012', 'CBR-PSP-ESP-001', 'Espresso', 45),
  ('33333333-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000013', 'CBR-WLT-ESP-001', 'Espresso', 50),
  ('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000014', 'CBR-CDH-COG-001', 'Cognac', 60),
  ('33333333-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000015', 'CBR-KEY-TAN-001', 'Tan', 55),
  ('33333333-0000-0000-0000-000000000016', '22222222-0000-0000-0000-000000000016', 'CBR-NTC-TAN-001', 'Tan', 35),
  ('33333333-0000-0000-0000-000000000017', '22222222-0000-0000-0000-000000000017', 'CBR-CBL-TAN-001', 'Tan', 40),
  ('33333333-0000-0000-0000-000000000018', '22222222-0000-0000-0000-000000000018', 'CBR-LUG-COG-001', 'Cognac', 50),
  ('33333333-0000-0000-0000-000000000019', '22222222-0000-0000-0000-000000000019', 'CBR-WKT-ESP-001', 'Espresso', 18),
  ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000020', 'CBR-EXP-TAN-001', 'Tan', 15)
ON CONFLICT (sku) DO NOTHING;

-- Demo Prices in INR (paise). These are placeholder demo amounts.
-- Admin must review and confirm actual pricing before publishing.
INSERT INTO product_prices (product_id, variant_id, currency, amount_minor) VALUES
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', 'INR', 1299900),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002', 'INR', 1099900),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003', 'INR', 799900),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000004', 'INR', 599900),
  ('22222222-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000005', 'INR', 899900),
  ('22222222-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000006', 'INR', 699900),
  ('22222222-0000-0000-0000-000000000007', '33333333-0000-0000-0000-000000000007', 'INR', 1199900),
  ('22222222-0000-0000-0000-000000000008', '33333333-0000-0000-0000-000000000008', 'INR', 999900),
  ('22222222-0000-0000-0000-000000000009', '33333333-0000-0000-0000-000000000009', 'INR', 1599900),
  ('22222222-0000-0000-0000-000000000010', '33333333-0000-0000-0000-000000000010', 'INR', 1399900),
  ('22222222-0000-0000-0000-000000000011', '33333333-0000-0000-0000-000000000011', 'INR', 399900),
  ('22222222-0000-0000-0000-000000000012', '33333333-0000-0000-0000-000000000012', 'INR', 299900),
  ('22222222-0000-0000-0000-000000000013', '33333333-0000-0000-0000-000000000013', 'INR', 249900),
  ('22222222-0000-0000-0000-000000000014', '33333333-0000-0000-0000-000000000014', 'INR', 149900),
  ('22222222-0000-0000-0000-000000000015', '33333333-0000-0000-0000-000000000015', 'INR', 199900),
  ('22222222-0000-0000-0000-000000000016', '33333333-0000-0000-0000-000000000016', 'INR', 349900),
  ('22222222-0000-0000-0000-000000000017', '33333333-0000-0000-0000-000000000017', 'INR', 179900),
  ('22222222-0000-0000-0000-000000000018', '33333333-0000-0000-0000-000000000018', 'INR', 129900),
  ('22222222-0000-0000-0000-000000000019', '33333333-0000-0000-0000-000000000019', 'INR', 999900),
  ('22222222-0000-0000-0000-000000000020', '33333333-0000-0000-0000-000000000020', 'INR', 1499900)
ON CONFLICT (variant_id, currency) DO NOTHING;
