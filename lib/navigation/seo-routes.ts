// =============================================================================
// THE COBBLEROAD — Legacy & Canonical SEO Route Registry
// Maps indexed production Google URLs directly to internal routes for 100% SEO juice
// =============================================================================

export interface RouteResolution {
  destinationPath: string
  destinationQuery?: Record<string, string>
}

/**
 * Normalizes a URL path: trims, removes trailing slash (except root), and lowercases.
 */
export function normalizePath(path: string): string {
  if (!path) return '/'
  let clean = path.trim()
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1)
  }
  return clean.toLowerCase()
}

/**
 * 1. Category & Menu URL Mapping (Case-insensitive)
 * Maps indexed legacy/canonical category URLs to internal category filters
 */
export const SEO_CATEGORY_MAP: Record<string, string> = {
  // Bags & Luggage
  '/unisex-bag': 'bags-and-luggage',
  '/unisex-bag/leather-backpack-travel-bag': 'bagpack',
  '/unisex-bag/the-cobbleroad-leather-handheld-bags-briefcase-bags-tote-bags': 'hand-held-bag',
  '/unisex-bag/travel-luggage-weekender-travel-bag': 'luggage-weekender',
  '/unisex-bag/leather-messenger-bags': 'messenger-bags',

  // Wallets & Accessories
  '/leather-wallets-and-accessories': 'wallets',
  '/leather-wallets-and-accessories/leather-travel-accessories': 'travel-accessories',
  '/leather-wallets-and-accessories/men-wallet-women-wallet': 'unisex-wallet',

  // AEIOU & Bad Boy
  '/leather-wallet-leather-holster': 'aeiou',
  '/leather-wallet-leather-holster/leather-handroll-tube-joint-case': 'bad-boy-accessories',
  '/leather-wallet-leather-holster/leather-roll-tube': 'joint-case-tan',

  // HoReCa & PetCare
  '/the-horeca': 'the-horeca',
  '/petcare': 'petcare',

  // Gear / Tool
  '/leather-gear': 'gear-tool',
  '/leather-gear/leather-camera-strap': 'camera-accessories',
  '/leather-gear/camera-accessories': 'camera-bag',
  '/leather-gear/lifestyle-style': 'lifestyle-and-travel',
}

/**
 * 2. Static Pages (About Us, etc.)
 */
export const SEO_STATIC_MAP: Record<string, string> = {
  '/about-us-leather-the-cobbleroad-leather-bags-accessories': '/our-story',
  '/about-us': '/our-story',
}

/**
 * 3. Product URLs Mapping (Case-insensitive)
 * Maps legacy indexed product URLs to their corresponding catalog piece or category fallback
 */
export const SEO_PRODUCT_MAP: Record<string, string> = {
  // Bags & Luggage
  '/unisex-bag/the-sambalpur-layover-duffle-bag': 'highway-overnight-bag',
  '/unisex-bag/2pack-laptop-bag-convertible': 'optimus-transformer-bag',
  '/unisex-bag/2unfold-laptop-bag-the-cobbleroad': 'unfold-laptop-bag',
  '/unisex-bag/the-leather-tote-bag': 'inappreciable-tote',
  '/unisex-bag/2face-backpack-tan': 'optimus-transformer-bag',
  '/unisex-bag/the-classic-leather-tote-bag': 'inappreciable-tote',
  '/unisex-bag/the-drona-leather-backpack': 'metropolitan-backpack',
  '/unisex-bag/the-fanny-pack-leather-coal': 'hipster-fanny-bag',
  '/unisex-bag/the-fanny-pack-leather': 'hipster-fanny-bag',
  '/unisex-bag/waist-bag-leather': 'hipster-fanny-bag',
  '/unisex-bag/leather-duffle-bag-with-shoe-compartment-black': 'shoe-compartment-duffle',
  '/unisex-bag/the-cobbleroad-leather-duffle-bag': 'weekender-duffle',
  '/unisex-bag/the-legendary-bhisma-leather-roll-top-bag': 'old-school-rucksack',
  '/unisex-bag/leather-camera-bag-nomad': 'metropolitan-backpack',
  '/unisex-bag/leather-backpack-travel-backpack-riviera': 'riviera-backpack',
  '/unisex-bag/the-wanderer-backpack-leather-coal': 'metropolitan-backpack',
  '/unisex-bag/the-wayfarer-leather-backpack': 'willowy-backpack',
  '/unisex-bag/the-ek-lavya-leather-laptop-sleeve': 'atlanta-laptop-sleeve',
  '/unisex-bag/the-leather-classic-old-school-rucksack-heritage': 'old-school-rucksack',
  '/unisex-bag/leather-dslr-camera-box': 'shoe-compartment-duffle',
  '/unisex-bag/the-slugger-leather-backpack': 'slugger-backpack',
  '/unisex-bag/leather-messenger-bag': 'hipster-fanny-bag',
  '/unisex-bag/leather-gym-bag-casual': 'barrel-gym-bag',
  '/unisex-bag/leather-gym-bag-barrel': 'barrel-gym-bag',

  // Wallets
  '/leather-wallets-and-accessories/leather-jewellery-box-accessories': 'leather-jewellery-box-accessories',
  '/leather-wallets-and-accessories/the-leather-wine-case-wine-tote-bag': 'the-leather-wine-case-wine-tote-bag',
  '/leather-wallets-and-accessories/the-leather-wine-case-tote-bag': 'the-leather-wine-case-tote-bag',
  '/leather-wallets-and-accessories/leather-watch-case-coal': 'leather-watch-case-coal',
  '/leather-wallets-and-accessories/leather-watch-case': 'leather-watch-case',
  '/leather-wallets-and-accessories/leather-watch-case-walnut': 'leather-watch-case-walnut',
  '/leather-wallets-and-accessories/leather-wallet-bifold-the-cobbleroad': 'leather-wallet-bifold-the-cobbleroad',
  '/leather-wallets-and-accessories/the-leather-3-ring-binder-with-pencil': 'the-leather-3-ring-binder-with-pencil',
  '/leather-wallets-and-accessories/the-leather-box-card-case': 'the-leather-box-card-case',
  '/leather-wallets-and-accessories/the-leather-bifold-wallet': 'the-leather-bifold-wallet',
  '/leather-wallets-and-accessories/the-leather-bifold-wallet-heritage': 'the-leather-bifold-wallet-heritage',
  '/leather-wallets-and-accessories/the-ultra-slim-leather-card-holder': 'the-ultra-slim-leather-card-holder',

  // AEIOU
  '/leather-wallet-leather-holster/the-leather-tobacco-wallet-pouch-the-cobbleroad': 'the-leather-tobacco-wallet-pouch-the-cobbleroad',
  '/leather-wallet-leather-holster/the-handroll-tube-joint-case-leather': 'the-handroll-tube-joint-case-leather',

  // Gear / Tool
  '/leather-gear/leather-camera-bag-nomad': 'leather-camera-bag-nomad',
  '/leather-gear/the-leather-wine-case-tote-bag': 'the-leather-wine-case-tote-bag',
  '/leather-gear/leather-mask-holder': 'leather-mask-holder',
  '/leather-gear/leather-neckband-holder': 'leather-neckband-holder',
  '/leather-gear/leather-dslr-camera-box': 'leather-dslr-camera-box',
  '/leather-gear/the-leather-3-ring-binder-with-pencil': 'the-leather-3-ring-binder-with-pencil',
}

/**
 * Resolves any incoming path and search params against the SEO registry.
 * Returns destination route and query params for Next.js internal rewriting.
 */
export function matchSeoRoute(pathname: string, searchParams?: URLSearchParams): RouteResolution | null {
  const norm = normalizePath(pathname)

  // 1. Static page matches (e.g. /about-us-leather-the-cobbleroad-leather-bags-accessories)
  if (SEO_STATIC_MAP[norm]) {
    return {
      destinationPath: SEO_STATIC_MAP[norm],
    }
  }

  // 2. Specific product matches (e.g. /unisex-bag/THE-SAMBALPUR-LAYOVER-DUFFLE-BAG)
  if (SEO_PRODUCT_MAP[norm]) {
    const targetSlug = SEO_PRODUCT_MAP[norm]
    return {
      destinationPath: `/products/${targetSlug}`,
    }
  }

  // Handle legacy numeric product_id queries (e.g. ?product_id=97, ?product_id=120)
  if (searchParams?.get('product_id') === '97') {
    return { destinationPath: '/products/the-nomad-backpack-leather-camera-coal' }
  }
  if (searchParams?.get('product_id') === '120') {
    return { destinationPath: '/products/the-ashwathama-briefcase' }
  }

  // 3. Category matches (e.g. /unisex-bag, /unisex-bag/leather-backpack-travel-bag)
  if (SEO_CATEGORY_MAP[norm]) {
    const categorySlug = SEO_CATEGORY_MAP[norm]
    const destQuery: Record<string, string> = { category: categorySlug }

    // Preserve product_id query param if present (e.g. ?product_id=120 or ?product_id=97)
    if (searchParams?.has('product_id')) {
      destQuery.product_id = searchParams.get('product_id')!
    }

    return {
      destinationPath: '/shop',
      destinationQuery: destQuery,
    }
  }

  // 4. Fallback for dynamic sub-paths under known categories (e.g. any new product added to Supabase)
  const segments = norm.split('/').filter(Boolean)
  if (segments.length === 2) {
    const parent = `/${segments[0]}`
    const childSlug = segments[1]

    if (SEO_CATEGORY_MAP[parent]) {
      // If it looks like a product under that category
      return {
        destinationPath: `/products/${childSlug}`,
      }
    }
  }

  return null
}
