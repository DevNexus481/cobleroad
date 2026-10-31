// =============================================================================
// COBLEROAD — Fallback & Demo Product Catalog
// Provides authoritative fallback pricing, stock, and names for preview/demo pieces
// when live Supabase records are not yet published.
// =============================================================================

import { REAL_PRODUCTS } from './catalogue'

export interface FallbackVariant {
  productId: string
  productName: string
  colour: string
  amountMinor: number
  stock: number
}

export const FALLBACK_VARIANTS: Record<string, FallbackVariant> = {
  // Advocate Briefcase
  'adv-cog': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Cognac', amountMinor: 1299900, stock: 12 },
  'adv-esp': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Espresso', amountMinor: 1299900, stock: 8 },
  'adv-blk': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Black', amountMinor: 1299900, stock: 10 },
  'adv-tan': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Tan', amountMinor: 1299900, stock: 6 },
  'advocate-briefcase-v1': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Cognac', amountMinor: 1299900, stock: 15 },
  'advocate-briefcase-0': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Cognac', amountMinor: 1299900, stock: 12 },
  'advocate-briefcase-1': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Espresso', amountMinor: 1299900, stock: 8 },
  'advocate-briefcase-2': { productId: 'advocate-briefcase', productName: 'The Advocate Briefcase', colour: 'Black', amountMinor: 1299900, stock: 10 },

  // Fielder Backpack
  'fie-tan': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Tan', amountMinor: 1199900, stock: 15 },
  'fie-esp': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Espresso', amountMinor: 1199900, stock: 10 },
  'fie-cog': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Cognac', amountMinor: 1199900, stock: 8 },
  'fie-blk': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Black', amountMinor: 1199900, stock: 12 },
  'fielder-backpack-v1': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Tan', amountMinor: 1199900, stock: 15 },
  'fielder-backpack-0': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Tan', amountMinor: 1199900, stock: 15 },
  'fielder-backpack-1': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Cognac', amountMinor: 1199900, stock: 8 },
  'fielder-backpack-2': { productId: 'fielder-backpack', productName: 'The Fielder Backpack', colour: 'Olive', amountMinor: 1199900, stock: 10 },

  // Marlow Tote
  'mar-esp': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Espresso', amountMinor: 899900, stock: 18 },
  'mar-cog': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Cognac', amountMinor: 899900, stock: 14 },
  'mar-blk': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Black', amountMinor: 899900, stock: 9 },
  'mar-tan': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Tan', amountMinor: 899900, stock: 11 },
  'marlow-tote-v1': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Espresso', amountMinor: 899900, stock: 18 },
  'marlow-tote-0': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Espresso', amountMinor: 899900, stock: 18 },
  'marlow-tote-1': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Cognac', amountMinor: 899900, stock: 14 },
  'marlow-tote-2': { productId: 'marlow-tote', productName: 'The Marlow Tote', colour: 'Tan', amountMinor: 899900, stock: 11 },

  // Meridian Duffle
  'mer-cog': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Cognac', amountMinor: 1599900, stock: 7 },
  'mer-esp': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Espresso', amountMinor: 1599900, stock: 5 },
  'mer-blk': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Black', amountMinor: 1599900, stock: 8 },
  'mer-olv': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Olive', amountMinor: 1599900, stock: 6 },
  'meridian-duffle-v1': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Cognac', amountMinor: 1599900, stock: 7 },
  'meridian-duffle-0': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Cognac', amountMinor: 1599900, stock: 7 },
  'meridian-duffle-1': { productId: 'meridian-duffle', productName: 'The Meridian Duffle', colour: 'Espresso', amountMinor: 1599900, stock: 5 },

  // Messenger / Telegraph
  'msg-cog': { productId: 'messenger-cognac', productName: 'The Ridge Messenger', colour: 'Cognac', amountMinor: 749900, stock: 10 },
  'telegraph-messenger-v1': { productId: 'telegraph-messenger', productName: 'The Telegraph Messenger', colour: 'Cognac', amountMinor: 799900, stock: 10 },
  'telegraph-messenger-0': { productId: 'telegraph-messenger', productName: 'The Telegraph Messenger', colour: 'Cognac', amountMinor: 799900, stock: 10 },
  'telegraph-messenger-1': { productId: 'telegraph-messenger', productName: 'The Telegraph Messenger', colour: 'Espresso', amountMinor: 799900, stock: 8 },
  'telegraph-messenger-2': { productId: 'telegraph-messenger', productName: 'The Telegraph Messenger', colour: 'Tan', amountMinor: 799900, stock: 6 },

  // Small Leather Goods & Others
  'folding-wallet-slim-0': { productId: 'folding-wallet-slim', productName: 'The Folding Wallet', colour: 'Cognac', amountMinor: 249900, stock: 25 },
  'folding-wallet-slim-1': { productId: 'folding-wallet-slim', productName: 'The Folding Wallet', colour: 'Espresso', amountMinor: 249900, stock: 20 },
  'folding-wallet-slim-2': { productId: 'folding-wallet-slim', productName: 'The Folding Wallet', colour: 'Tan', amountMinor: 249900, stock: 15 },
  'card-sleeve-0': { productId: 'card-sleeve', productName: 'The Card Sleeve', colour: 'Cognac', amountMinor: 149900, stock: 30 },
  'card-sleeve-1': { productId: 'card-sleeve', productName: 'The Card Sleeve', colour: 'Tan', amountMinor: 149900, stock: 20 },
  'atlas-weekender-0': { productId: 'atlas-weekender', productName: 'The Atlas Weekender', colour: 'Cognac', amountMinor: 1399900, stock: 8 },
  'transit-passport-wallet-0': { productId: 'transit-passport-wallet', productName: 'The Transit Passport Wallet', colour: 'Cognac', amountMinor: 299900, stock: 18 },
  'meridian-laptop-bag-0': { productId: 'meridian-laptop-bag', productName: 'The Meridian Laptop Bag', colour: 'Cognac', amountMinor: 1099900, stock: 12 },
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(str: string | null | undefined): boolean {
  return typeof str === 'string' && UUID_REGEX.test(str)
}

export function getFallbackVariant(variantId: string): FallbackVariant | null {
  if (FALLBACK_VARIANTS[variantId]) {
    return FALLBACK_VARIANTS[variantId]
  }

  // Check REAL_PRODUCTS catalogue
  for (const prod of REAL_PRODUCTS) {
    if (variantId === prod.slug || variantId.startsWith(`${prod.slug}-`)) {
      const variantIndexMatch = variantId.match(new RegExp(`^${prod.slug}-(\\d+)$`))
      const variantIndex = variantIndexMatch ? parseInt(variantIndexMatch[1], 10) : 0
      const variant = prod.variants[variantIndex] || prod.variants[0]
      return {
        productId: prod.slug,
        productName: prod.name,
        colour: variant ? variant.colour : 'Cognac',
        amountMinor: prod.priceINR || 999900,
        stock: 10,
      }
    }
  }

  return null
}

