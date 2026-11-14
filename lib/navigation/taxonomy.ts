// =============================================================================
// THE COBBLEROAD — Central Navigation & Category Taxonomy
// Single source of truth for Header navigation, mobile drawer & shop recommendation bar
// =============================================================================

export interface NavSubItem {
  label: string
  slug: string
  href: string
  keywords?: string[]
}

export interface NavParentItem {
  label: string
  slug: string
  href: string
  keywords?: string[]
  subItems?: NavSubItem[]
}

export interface RecommendationChip {
  label: string
  slug: string
  href: string
  isActive: boolean
}

export const NAV_TAXONOMY: NavParentItem[] = [
  {
    label: 'BAGS & LUGGAGE',
    slug: 'bags-and-luggage',
    href: '/unisex-bag',
    keywords: ['bag', 'backpack', 'duffle', 'tote', 'rucksack', 'luggage', 'weekender', 'laptop', 'messenger'],
    subItems: [
      {
        label: 'BACKPACK',
        slug: 'bagpack',
        href: '/unisex-bag/leather-backpack-travel-bag',
        keywords: ['backpack', 'rucksack'],
      },
      {
        label: 'HAND-HELD BAGS',
        slug: 'hand-held-bag',
        href: '/unisex-bag/THE-COBBLEROAD-LEATHER-HANDHELD-BAGS-BRIEFCASE-BAGS-TOTE-BAGS',
        keywords: ['tote', 'laptop-bag', 'unfold', 'briefcase'],
      },
      {
        label: 'LUGGAGE & WEEKENDER',
        slug: 'luggage-weekender',
        href: '/unisex-bag/travel-luggage-weekender-travel-bag',
        keywords: ['duffle', 'weekender', 'overnight', 'gym', 'travel'],
      },
      {
        label: 'MESSENGER BAGS',
        slug: 'messenger-bags',
        href: '/unisex-bag/LEATHER-MESSENGER-BAGS',
        keywords: ['messenger', 'fanny', 'bum', 'shoulder'],
      },
    ],
  },
  {
    label: 'WALLETS',
    slug: 'wallets',
    href: '/LEATHER-WALLETS-AND-ACCESSORIES',
    keywords: ['wallet', 'cardholder', 'passport'],
    subItems: [
      {
        label: 'TRAVEL ACCESSORIES',
        slug: 'travel-accessories',
        href: '/LEATHER-WALLETS-AND-ACCESSORIES/LEATHER-TRAVEL-ACCESSORIES',
        keywords: ['travel', 'passport', 'fanny', 'sleeve'],
      },
      {
        label: 'UNISEX WALLET',
        slug: 'unisex-wallet',
        href: '/LEATHER-WALLETS-AND-ACCESSORIES/men-wallet-women-wallet',
        keywords: ['wallet', 'cardholder'],
      },
    ],
  },
  {
    label: 'AEIOU',
    slug: 'aeiou',
    href: '/leather-wallet-LEATHER-holster',
    keywords: ['aeiou', 'bad boy', 'tube', 'joint', 'occult', 'winchester', 'hunter', 'flask', 'grimoire', 'devil'],
    subItems: [
      {
        label: 'BAD BOY ACCESSORIES',
        slug: 'bad-boy-accessories',
        href: '/leather-wallet-LEATHER-holster/LEATHER-HANDROLL-TUBE-JOINT-CASE',
        keywords: ['bad boy', 'winchester', 'hunter', 'flask', 'valet', 'grimoire', 'edc', 'sigil', 'knife'],
      },
      {
        label: 'THE "LEATHER HANDROLL TUBE" JOINT CASE TAN',
        slug: 'joint-case-tan',
        href: '/leather-wallet-LEATHER-holster/leather-roll-tube',
        keywords: ['tube', 'joint case', 'handroll', 'tan'],
      },
    ],
  },
  {
    label: 'THE HORECA',
    slug: 'the-horeca',
    href: '/THE-HoReCa',
    keywords: ['horeca', 'hospitality'],
  },
  {
    label: '#PETCARE',
    slug: 'petcare',
    href: '/petcare',
    keywords: ['pet', 'collar', 'leash'],
  },
  {
    label: 'GEAR / TOOL',
    slug: 'gear-tool',
    href: '/LEATHER-GEAR',
    keywords: ['gear', 'camera', 'tool', 'lifestyle'],
    subItems: [
      {
        label: 'CAMERA ACCESSORIES',
        slug: 'camera-accessories',
        href: '/LEATHER-GEAR/LEATHER-CAMERA-STRAP',
        keywords: ['camera strap', 'lens'],
      },
      {
        label: 'CAMERA BAG',
        slug: 'camera-bag',
        href: '/LEATHER-GEAR/CAMERA-ACCESSORIES',
        keywords: ['camera bag', 'camera'],
      },
      {
        label: 'LIFESTYLE & TRAVEL',
        slug: 'lifestyle-and-travel',
        href: '/LEATHER-GEAR/LIFESTYLE-STYLE',
        keywords: ['lifestyle', 'travel', 'duffle'],
      },
    ],
  },
]

/**
 * Locate a category node by slug, finding both parents and subcategories.
 */
export function findCategoryNode(slug: string): {
  parent: NavParentItem | null
  current: NavParentItem | NavSubItem | null
  isParent: boolean
} {
  if (!slug) return { parent: null, current: null, isParent: false }

  const lower = slug.toLowerCase()

  for (const parent of NAV_TAXONOMY) {
    if (parent.slug.toLowerCase() === lower || parent.href.toLowerCase() === lower) {
      return { parent, current: parent, isParent: true }
    }
    if (parent.subItems) {
      for (const sub of parent.subItems) {
        if (sub.slug.toLowerCase() === lower || sub.href.toLowerCase() === lower) {
          return { parent, current: sub, isParent: false }
        }
      }
    }
  }

  return { parent: null, current: null, isParent: false }
}

/**
 * Generate context-aware recommendation chips for the recommendation bar below search.
 */
export function getContextRecommendationChips(activeSlug: string = ''): {
  parentTitle: string
  currentTitle: string
  chips: RecommendationChip[]
} {
  const { parent, current } = findCategoryNode(activeSlug)

  // 1. If we are in a parent category that has subItems (e.g. BAGS & LUGGAGE, WALLETS, AEIOU, GEAR / TOOL)
  // or if we are in one of its subcategories (e.g. BACKPACK, TRAVEL ACCESSORIES)
  if (parent && parent.subItems && parent.subItems.length > 0) {
    const isAllParentActive = activeSlug === parent.slug || activeSlug === parent.href

    const chips: RecommendationChip[] = [
      {
        label: `ALL ${parent.label}`,
        slug: parent.slug,
        href: parent.href,
        isActive: isAllParentActive,
      },
      ...parent.subItems.map((sub) => ({
        label: sub.label,
        slug: sub.slug,
        href: sub.href,
        isActive: activeSlug === sub.slug || activeSlug === sub.href,
      })),
    ]

    return {
      parentTitle: parent.label,
      currentTitle: current ? current.label : parent.label,
      chips,
    }
  }

  // 2. If we are in a single top-level category without sub-items (e.g. THE HORECA, #PETCARE)
  if (parent && (!parent.subItems || parent.subItems.length === 0)) {
    return {
      parentTitle: parent.label,
      currentTitle: parent.label,
      chips: [
        {
          label: 'ALL PIECES',
          slug: '',
          href: '/shop',
          isActive: false,
        },
        {
          label: parent.label,
          slug: parent.slug,
          href: parent.href,
          isActive: true,
        },
      ],
    }
  }

  // 3. Root General Storefront (no active category or unrecognized category)
  // Show all top-level parent categories
  const chips: RecommendationChip[] = [
    {
      label: 'ALL PIECES',
      slug: '',
      href: '/shop',
      isActive: !activeSlug,
    },
    ...NAV_TAXONOMY.map((item) => ({
      label: item.label,
      slug: item.slug,
      href: `/shop?category=${item.slug}`,
      isActive: activeSlug === item.slug,
    })),
  ]

  return {
    parentTitle: 'All Handcrafted Pieces',
    currentTitle: 'The Collection',
    chips,
  }
}

