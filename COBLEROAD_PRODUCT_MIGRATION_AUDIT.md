# COBLEROAD — Product Migration Audit
**Date:** 2026-10-31
**Migration Phase:** Initial Audit & Image Extraction
**Source:** `BAG AND LUGGAGE.zip` (199 MB, Desktop)
**Target:** `public/images/products/real/`

---

## 1. Architecture Snapshot

| Item | Detail |
|------|--------|
| Framework | **Next.js 16.4.3** (App Router) |
| React | 19.3.0 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth + custom profiles table |
| Payments | Razorpay 2.9.8 |
| Styling | Tailwind CSS 4 |
| Image Component | next/image (Next.js Image optimization) |
| Package Manager | npm |

### Key Routes Found
- `/` - Homepage (featured products, hero banner)
- `/shop` - Full catalogue with filter/sort
- `/products/[slug]` - Product Detail Page (PDP)
- `/collections/[slug]` - Collection pages
- `/search` - Search page
- `/cart` - Cart page
- `/checkout` - Checkout + Razorpay
- `/account` - Customer account
- `/admin` - Admin panel (products, orders)
- `/personalisation` - Custom monogram page
- `/orders` - Order history

### Supabase Tables
- `products`, `product_images`, `product_variants`, `product_prices`
- `product_collections`, `collections`
- `orders`, `order_items`, `payments`, `carts`, `cart_items`
- `profiles`, `admin_audit_logs`, `site_settings`

---

## 2. Source Archive Analysis

- **Archive:** `C:\Users\hello\OneDrive\Desktop\BAG AND LUGGAGE.zip` (199 MB)
- **Total image files:** 186 (177 usable PNG/JPG/WebP)
- **Products found:** 14

---

## 3. Product Catalogue - 14 Final Products

| # | Source Folder | Product Name | Slug | Images | Collection |
|---|---|---|---|---|---|
| 1 | 2 UNFOLD LAPTOP BAG HERITAGE | 2 Unfold Laptop Bag Heritage | unfold-laptop-bag | 17 | Work Bags |
| 2 | ATLANTA LAPTOP SLEEVE | Atlanta Laptop Sleeve | atlanta-laptop-sleeve | 8 | Work Bags |
| 3 | HIPSTER fanny BUM BAG pack | Hipster Fanny Bum Bag | hipster-fanny-bag | 8 | Everyday Bags |
| 4 | METROPLOITAN BACKPACK | Metropolitan Backpack | metropolitan-backpack | 7 | Everyday Bags |
| 5 | OLD SCHOOL RUCKSACK | Old School Rucksack | old-school-rucksack | 10 | Everyday Bags |
| 6 | OPTIMUS TRANSFORMER BAG | Optimus Transformer Bag | optimus-transformer-bag | 18 | Work Bags |
| 7 | RIVIERA BACKPACK TRAVEL BAG | Riviera Backpack Travel Bag | riviera-backpack | 19 | Travel Essentials |
| 8 | SHOE COMPARTMENT DUFFLE BAG | Shoe Compartment Duffle Bag | shoe-compartment-duffle | 16 | Travel Essentials |
| 9 | THE BARREL GYM BAG | The Barrel Gym Bag | barrel-gym-bag | 19 | Travel Essentials |
| 10 | THE HIGHWAY OVERNIGHT TRAVEL BAG | The Highway Overnight Travel Bag | highway-overnight-bag | 9 | Travel Essentials |
| 11 | THE INAPPRECIABLE LEATHER TOTE BAG | The Inappreciable Leather Tote Bag | inappreciable-tote | 11 | Everyday Bags |
| 12 | THE SLUGGER BACKPACK | The Slugger Backpack | slugger-backpack | 9 | Everyday Bags |
| 13 | THE WILLOWY BACKPACK | The Willowy Backpack | willowy-backpack | 8 | Everyday Bags |
| 14 | WEEKENDER DUFFLE BAG | Weekender Duffle Bag | weekender-duffle | 18 | Travel Essentials |

---

## 4. Colour Variants Detected from Image Filenames

| Product | Colours |
|---------|---------|
| Atlanta Laptop Sleeve | Black, Brown, Cognac, Green |
| Optimus Transformer Bag | Black, Cognac, Green, Red, Blue |
| Riviera Backpack | Black, Cognac |
| Barrel Gym Bag | Black, Cognac |
| Weekender Duffle | Black, Cognac |
| Highway Overnight Bag | Cognac |
| All others | Single colour (Cognac/Tan) |

---

## 5. Migration Checklist

- [x] ZIP verified and extracted
- [x] 14 product folders identified
- [x] 177 images copied to public/images/products/real/
- [x] Audit documents created
- [x] Product data catalogue (TypeScript) created (`lib/products/catalogue.ts`)
- [x] Homepage updated with real products (`app/page.tsx`)
- [x] Shop page updated (`app/shop/page.tsx`)
- [x] PDP routes for all 14 products (`app/products/[slug]/page.tsx`)
- [x] Collections and search updated (`app/collections`, `app/search`, `QuickSearchModal`)
- [x] Supabase migration SQL created (`supabase/migrations/007_real_products.sql`)
- [x] Admin panel compatibility verified
- [x] QA pass & TypeScript zero-error validation completed

---

## 6. Owner Review Required Before Publishing

1. **Pricing** - No prices in ZIP. Set actual prices before publishing.
2. **Stock quantities** - Currently 10 (default). Update to actual stock.
3. **Personalisation** - Which products support monogramming? Currently disabled.
4. **Collections** - Confirm groupings above.
5. **Descriptions** - Review generated copy; update with official brand copy.
