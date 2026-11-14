// =============================================================================
// COBLEROAD — Real Product Catalogue
// Source: BAG AND LUGGAGE.zip (migrated 2026-10-31)
// This is the single source of truth for all 14 real products.
// Prices are DRAFT (0) — admin must set before publishing.
// Images live at /images/products/real/{slug}/{slug}-XX.ext
// =============================================================================

import SCRAPED_ITEMS from './scraped-catalogue.json'

export interface CatalogueVariant {
  colour: string
  colourHex: string
  /** relative URL from /public (e.g. /images/products/real/...) */
  imageUrl: string
  /** SKU pattern: CBR-{ABBR}-{COLOUR}-001 */
  sku: string
}

export interface CatalogueProduct {
  /** Unique SEO slug — maps to /products/[slug] */
  slug: string
  name: string
  shortDescription: string
  description: string
  /** Primary image — first gallery image */
  primaryImage: string
  /** Full gallery (local /public paths) */
  gallery: string[]
  /** Colour variants. If single colour, array with one entry */
  variants: CatalogueVariant[]
  /** Collection slugs this product belongs to */
  collections: string[]
  /** INR price in paise (amount_minor). 0 = draft, must be set by admin */
  priceINR: number
  /** Whether personalisation (monogram/initials) is supported */
  personalisable: boolean
  /** Featured on homepage? */
  featured: boolean
  /** Material description */
  material: string
}

const BASE_PRODUCTS: CatalogueProduct[] = [
  // ─── WORK BAGS ───────────────────────────────────────────────────────────────

  {
    slug: 'unfold-laptop-bag',
    name: '2 Unfold Laptop Bag Heritage',
    shortDescription: 'A convertible heritage leather laptop bag that transforms between briefcase and backpack.',
    description:
      'The 2 Unfold is a testament to intelligent leather craftsmanship. Carry it as a structured briefcase for the boardroom, then unfold the rear panel to reveal hidden backpack straps for the commute. Fits laptops up to 15 inches with a padded sleeve, plus documents and daily essentials across multiple compartments.',
    primaryImage: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
    gallery: [
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-02.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-03.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-04.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-05.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-06.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-07.png',
      '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-08.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
        sku: 'CBR-UNF-COG-001',
      },
    ],
    collections: ['work-bags'],
    priceINR: 1499900,
    personalisable: false,
    featured: true,
    material: 'Genuine full-grain leather exterior',
  },

  {
    slug: 'atlanta-laptop-sleeve',
    name: 'Atlanta Laptop Sleeve',
    shortDescription: 'A slim genuine leather laptop sleeve in four heritage colours.',
    description:
      'The Atlanta Laptop Sleeve offers protective elegance without bulk. Full-grain leather exterior with a soft microfibre lining keeps your laptop scratch-free. Available in Black, Brown, Cognac, and Green — each colour develops a unique patina over time.',
    primaryImage: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
    gallery: [
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-05.jpg',
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-06.png',
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-02.png',
      '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-03.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-03.png',
        sku: 'CBR-ATL-COG-001',
      },
      {
        colour: 'Black',
        colourHex: '#1A1A1A',
        imageUrl: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
        sku: 'CBR-ATL-BLK-001',
      },
      {
        colour: 'Brown',
        colourHex: '#5C3A1E',
        imageUrl: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-02.png',
        sku: 'CBR-ATL-BRN-001',
      },
      {
        colour: 'Green',
        colourHex: '#3D5A47',
        imageUrl: '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-08.png',
        sku: 'CBR-ATL-GRN-001',
      },
    ],
    collections: ['work-bags'],
    priceINR: 499900,
    personalisable: true,
    featured: false,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'optimus-transformer-bag',
    name: 'Optimus Transformer Bag',
    shortDescription: 'A multi-functional leather bag that converts between messenger, backpack, and briefcase.',
    description:
      'The Optimus is built for those who refuse to choose. Three carry modes — messenger crossbody, backpack, and top-handle briefcase — achieved through a modular strap and tuck system. Available in five premium leather colours, each with brass hardware.',
    primaryImage: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-10.png',
    gallery: [
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-10.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-02.jpg',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-03.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-04.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-05.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-06.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-07.png',
      '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-08.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-13.png',
        sku: 'CBR-OPT-COG-001',
      },
      {
        colour: 'Black',
        colourHex: '#1A1A1A',
        imageUrl: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-10.png',
        sku: 'CBR-OPT-BLK-001',
      },
      {
        colour: 'Green',
        colourHex: '#3D5A47',
        imageUrl: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-16.png',
        sku: 'CBR-OPT-GRN-001',
      },
      {
        colour: 'Red',
        colourHex: '#8B2B2B',
        imageUrl: '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-18.png',
        sku: 'CBR-OPT-RED-001',
      },
    ],
    collections: ['work-bags'],
    priceINR: 1699900,
    personalisable: false,
    featured: true,
    material: 'Genuine full-grain leather exterior',
  },

  // ─── EVERYDAY BAGS ───────────────────────────────────────────────────────────

  {
    slug: 'hipster-fanny-bag',
    name: 'Hipster Fanny Bum Bag',
    shortDescription: 'A compact genuine leather fanny pack worn at the hip or crossbody.',
    description:
      'The Hipster Fanny Bum Bag redefines the waist pack. Crafted in full-grain leather with a smooth zip closure, it carries cards, phone, keys, and a small wallet comfortably at the hip. Adjustable webbing belt fits all waist sizes. Wear it front, back, or slung across the chest.',
    primaryImage: '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-01.png',
    gallery: [
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-01.png',
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-02.png',
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-03.png',
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-04.png',
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-05.png',
      '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-06.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-01.png',
        sku: 'CBR-FNY-COG-001',
      },
    ],
    collections: ['everyday-bags'],
    priceINR: 449900,
    personalisable: false,
    featured: false,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'metropolitan-backpack',
    name: 'Metropolitan Backpack',
    shortDescription: 'A sleek structured leather backpack for the urban professional.',
    description:
      'The Metropolitan Backpack is engineered for city life. A padded laptop sleeve (up to 15"), organiser panel, and water bottle pocket keep your day structured. Padded back panel and adjustable straps distribute weight naturally across the shoulders.',
    primaryImage: '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
    gallery: [
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-02.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-03.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-04.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-05.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-06.png',
      '/images/products/real/metropolitan-backpack/metropolitan-backpack-07.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
        sku: 'CBR-MET-COG-001',
      },
    ],
    collections: ['everyday-bags', 'work-bags'],
    priceINR: 1299900,
    personalisable: false,
    featured: true,
    material: 'Genuine leather exterior',
  },

  {
    slug: 'old-school-rucksack',
    name: 'Old School Rucksack',
    shortDescription: 'A classic roll-top leather rucksack with vintage military heritage.',
    description:
      'The Old School Rucksack draws from vintage military heritage. The roll-top closure seals your belongings securely while the wide body accommodates everything from a weekend kit to daily essentials. Side cinch straps keep the load tight. Wears beautifully with age.',
    primaryImage: '/images/products/real/old-school-rucksack/old-school-rucksack-01.png',
    gallery: [
      '/images/products/real/old-school-rucksack/old-school-rucksack-01.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-02.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-03.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-04.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-05.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-06.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-07.png',
      '/images/products/real/old-school-rucksack/old-school-rucksack-08.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/old-school-rucksack/old-school-rucksack-01.png',
        sku: 'CBR-OSR-COG-001',
      },
    ],
    collections: ['everyday-bags'],
    priceINR: 1349900,
    personalisable: false,
    featured: false,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'inappreciable-tote',
    name: 'The Inappreciable Leather Tote Bag',
    shortDescription: 'An understated open-top tote in premium leather with interior organisation.',
    description:
      'Named for the quality that reveals itself only through use, the Inappreciable Tote is quietly exceptional. An open top with magnetic snap closure, internal zip pocket, and pen slip make it the ideal companion for those who prefer substance to display. The double leather handles are stitched and burnished for durability.',
    primaryImage: '/images/products/real/inappreciable-tote/inappreciable-tote-01.png',
    gallery: [
      '/images/products/real/inappreciable-tote/inappreciable-tote-01.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-06.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-07.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-01.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-02.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-03.png',
      '/images/products/real/inappreciable-tote/inappreciable-tote-04.png',
    ],
    variants: [
      {
        colour: 'Tan',
        colourHex: '#B5784E',
        imageUrl: '/images/products/real/inappreciable-tote/inappreciable-tote-05.png',
        sku: 'CBR-TOT-TAN-001',
      },
    ],
    collections: ['everyday-bags'],
    priceINR: 999900,
    personalisable: true,
    featured: true,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'slugger-backpack',
    name: 'The Slugger Backpack',
    shortDescription: 'A rugged, oversized leather backpack built for serious carry.',
    description:
      'The Slugger earns its name. Built wide and deep with a structured base, padded double straps, and a large main compartment that swallows everything you need and more. Side grab handles for quick lifts. The leather improves with every use, developing a rich, personal patina.',
    primaryImage: '/images/products/real/slugger-backpack/slugger-backpack-01.png',
    gallery: [
      '/images/products/real/slugger-backpack/slugger-backpack-01.png',
      '/images/products/real/slugger-backpack/slugger-backpack-02.png',
      '/images/products/real/slugger-backpack/slugger-backpack-03.png',
      '/images/products/real/slugger-backpack/slugger-backpack-04.png',
      '/images/products/real/slugger-backpack/slugger-backpack-05.png',
      '/images/products/real/slugger-backpack/slugger-backpack-06.png',
      '/images/products/real/slugger-backpack/slugger-backpack-07.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/slugger-backpack/slugger-backpack-01.png',
        sku: 'CBR-SLG-COG-001',
      },
    ],
    collections: ['everyday-bags'],
    priceINR: 1399900,
    personalisable: false,
    featured: false,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'willowy-backpack',
    name: 'The Willowy Backpack',
    shortDescription: 'A slender, minimal leather backpack for the essentials.',
    description:
      'The Willowy carries less so you carry it more. Its slim profile and clean lines make it the definitive urban backpack — lightweight, polished, and effortless. Single main compartment with a slim front slip pocket for quick access. Rolled leather grab handle at the top.',
    primaryImage: '/images/products/real/willowy-backpack/willowy-backpack-01.png',
    gallery: [
      '/images/products/real/willowy-backpack/willowy-backpack-01.png',
      '/images/products/real/willowy-backpack/willowy-backpack-05.png',
      '/images/products/real/willowy-backpack/willowy-backpack-07.png',
      '/images/products/real/willowy-backpack/willowy-backpack-08.png',
      '/images/products/real/willowy-backpack/willowy-backpack-01.png',
      '/images/products/real/willowy-backpack/willowy-backpack-04.png',
    ],
    variants: [
      {
        colour: 'Tan',
        colourHex: '#B5784E',
        imageUrl: '/images/products/real/willowy-backpack/willowy-backpack-02.png',
        sku: 'CBR-WLW-TAN-001',
      },
    ],
    collections: ['everyday-bags'],
    priceINR: 1149900,
    personalisable: false,
    featured: false,
    material: 'Genuine leather exterior',
  },

  // ─── TRAVEL ESSENTIALS ───────────────────────────────────────────────────────

  {
    slug: 'riviera-backpack',
    name: 'Riviera Backpack Travel Bag',
    shortDescription: 'A premium leather travel backpack with a structured frame and dual carry.',
    description:
      'The Riviera is a leather travel backpack that moves between the trails and the terminal without apology. A structured frame keeps its shape under load, while the padded laptop sleeve, multiple compartments, and detachable hip belt make it ready for long hauls. Available in Cognac and Black.',
    primaryImage: '/images/products/real/riviera-backpack/riviera-backpack-06.png',
    gallery: [
      '/images/products/real/riviera-backpack/riviera-backpack-06.png',
      '/images/products/real/riviera-backpack/riviera-backpack-07.png',
      '/images/products/real/riviera-backpack/riviera-backpack-08.png',
      '/images/products/real/riviera-backpack/riviera-backpack-01.png',
      '/images/products/real/riviera-backpack/riviera-backpack-02.png',
      '/images/products/real/riviera-backpack/riviera-backpack-03.png',
      '/images/products/real/riviera-backpack/riviera-backpack-04.png',
      '/images/products/real/riviera-backpack/riviera-backpack-09.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/riviera-backpack/riviera-backpack-06.png',
        sku: 'CBR-RIV-COG-001',
      },
      {
        colour: 'Black',
        colourHex: '#1A1A1A',
        imageUrl: '/images/products/real/riviera-backpack/riviera-backpack-01.png',
        sku: 'CBR-RIV-BLK-001',
      },
    ],
    collections: ['travel-essentials'],
    priceINR: 1599900,
    personalisable: false,
    featured: true,
    material: 'Genuine full-grain leather exterior',
  },

  {
    slug: 'shoe-compartment-duffle',
    name: 'Shoe Compartment Duffle Bag',
    shortDescription: 'A leather gym and travel duffle with a dedicated ventilated shoe compartment.',
    description:
      'The Shoe Compartment Duffle solves the oldest gym problem: keeping your shoes separate. A ventilated lower compartment houses footwear in isolation, while the spacious main body holds clothes, gear, and toiletries. Twin grab handles and a detachable shoulder strap offer carry flexibility.',
    primaryImage: '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
    gallery: [
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-02.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-03.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-04.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-05.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-06.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-07.png',
      '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-08.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
        sku: 'CBR-SHD-COG-001',
      },
    ],
    collections: ['travel-essentials'],
    priceINR: 1449900,
    personalisable: false,
    featured: false,
    material: 'Genuine leather exterior',
  },

  {
    slug: 'barrel-gym-bag',
    name: 'The Barrel Gym Bag',
    shortDescription: 'A classic leather barrel duffel that goes from the gym to the weekend.',
    description:
      'The Barrel Gym Bag is shaped by purpose and refined by leather. The cylindrical silhouette maximises packing volume while the structured base protects the bag\'s form. Twin zip closure runs the full length of the top for easy access. Available in Cognac and Black.',
    primaryImage: '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
    gallery: [
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-09.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-10.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-07.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-01.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-02.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-03.png',
      '/images/products/real/barrel-gym-bag/barrel-gym-bag-04.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
        sku: 'CBR-BRL-COG-001',
      },
      {
        colour: 'Black',
        colourHex: '#1A1A1A',
        imageUrl: '/images/products/real/barrel-gym-bag/barrel-gym-bag-01.png',
        sku: 'CBR-BRL-BLK-001',
      },
    ],
    collections: ['travel-essentials'],
    priceINR: 1249900,
    personalisable: false,
    featured: true,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'highway-overnight-bag',
    name: 'The Highway Overnight Travel Bag',
    shortDescription: 'A structured overnight bag in premium leather for the discerning traveller.',
    description:
      'The Highway is built for the 48-hour trip. Structured walls hold its shape whether packed or empty. A wide zip opening gives unobstructed access to the main compartment, while a front slip pocket and interior organiser keep essentials reachable. Rolled leather handles and a detachable shoulder strap.',
    primaryImage: '/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png',
    gallery: [
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-07.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-08.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-09.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-01.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-02.png',
      '/images/products/real/highway-overnight-bag/highway-overnight-bag-03.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png',
        sku: 'CBR-HWY-COG-001',
      },
    ],
    collections: ['travel-essentials'],
    priceINR: 1649900,
    personalisable: false,
    featured: false,
    material: 'Genuine full-grain leather',
  },

  {
    slug: 'weekender-duffle',
    name: 'Weekender Duffle Bag',
    shortDescription: 'A generous leather weekender with twin-handle carry and shoulder strap.',
    description:
      'The Weekender Duffle is the quiet standard of leather travel bags. Spacious enough for a proper two-night trip with a separate end pocket for shoes or toiletries. The twin grab handles and adjustable shoulder strap offer three carry positions. Available in Cognac and Black leather.',
    primaryImage: '/images/products/real/weekender-duffle/weekender-duffle-11.png',
    gallery: [
      '/images/products/real/weekender-duffle/weekender-duffle-11.png',
      '/images/products/real/weekender-duffle/weekender-duffle-15.png',
      '/images/products/real/weekender-duffle/weekender-duffle-16.png',
      '/images/products/real/weekender-duffle/weekender-duffle-17.png',
      '/images/products/real/weekender-duffle/weekender-duffle-08.png',
      '/images/products/real/weekender-duffle/weekender-duffle-09.png',
      '/images/products/real/weekender-duffle/weekender-duffle-10.png',
      '/images/products/real/weekender-duffle/weekender-duffle-12.png',
    ],
    variants: [
      {
        colour: 'Cognac',
        colourHex: '#9A633F',
        imageUrl: '/images/products/real/weekender-duffle/weekender-duffle-11.png',
        sku: 'CBR-WKD-COG-001',
      },
      {
        colour: 'Black',
        colourHex: '#1A1A1A',
        imageUrl: '/images/products/real/weekender-duffle/weekender-duffle-08.png',
        sku: 'CBR-WKD-BLK-001',
      },
    ],
    collections: ['travel-essentials'],
    priceINR: 1799900,
    personalisable: false,
    featured: true,
    material: 'Genuine full-grain leather',
  },
]

// Map scraped items from thecobbleroad.com into CatalogueProduct format
export const SCRAPED_PRODUCTS: CatalogueProduct[] = (SCRAPED_ITEMS as any[]).map((item) => {
  const nameLower = (item.name || '').toLowerCase()
  const colour = nameLower.includes('tan')
    ? 'Tan'
    : nameLower.includes('coal') || nameLower.includes('black')
    ? 'Black'
    : nameLower.includes('green')
    ? 'Olive Green'
    : nameLower.includes('walnut')
    ? 'Walnut'
    : nameLower.includes('mocha')
    ? 'Mocha'
    : 'Cognac'

  const colourHex =
    colour === 'Tan'
      ? '#C58F49'
      : colour === 'Black'
      ? '#1A1817'
      : colour === 'Olive Green'
      ? '#4F5D3E'
      : colour === 'Walnut'
      ? '#5C3826'
      : colour === 'Mocha'
      ? '#422B1E'
      : '#9A633F'

  const primary = item.primaryImage || (item.gallery && item.gallery[0]) || '/images/hero/hero-briefcase.jpg'

  return {
    slug: item.slug,
    name: item.name,
    shortDescription: item.shortDescription || item.description?.slice(0, 160) || '',
    description: item.description || '',
    primaryImage: primary,
    gallery: item.gallery && item.gallery.length > 0 ? item.gallery : [primary],
    variants: [
      {
        colour,
        colourHex,
        imageUrl: primary,
        sku: `CBR-${item.slug.slice(0, 3).toUpperCase()}-001`,
      },
    ],
    collections: Array.from(new Set([...(item.collections || []), item.category, item.subcategory].filter(Boolean))),
    priceINR: item.priceINR || 120000,
    personalisable: item.personalisable ?? true,
    featured: Boolean(item.featured),
    material: item.material || 'Genuine full-grain leather',
  }
})

// Unified product list prioritizing scraped genuine items
const SEEN_SLUGS = new Set<string>()
export const REAL_PRODUCTS: CatalogueProduct[] = []

for (const p of [...SCRAPED_PRODUCTS, ...BASE_PRODUCTS]) {
  if (!SEEN_SLUGS.has(p.slug)) {
    SEEN_SLUGS.add(p.slug)
    REAL_PRODUCTS.push(p)
  }
}

/** Quick lookup by slug (case-insensitive) */
export const PRODUCT_BY_SLUG: Record<string, CatalogueProduct> = Object.fromEntries([
  ...REAL_PRODUCTS.map((p) => [p.slug, p]),
  ...REAL_PRODUCTS.map((p) => [p.slug.toLowerCase(), p]),
  ...REAL_PRODUCTS.map((p) => [p.slug.toUpperCase(), p]),
])

/** Featured products for homepage */
export const FEATURED_PRODUCTS = REAL_PRODUCTS.filter((p) => p.featured)

/** Products by collection slug */
export function getProductsByCollection(collectionSlug: string): CatalogueProduct[] {
  return REAL_PRODUCTS.filter((p) => p.collections.includes(collectionSlug))
}

/** All unique collection slugs */
export const ALL_COLLECTION_SLUGS = [...new Set(REAL_PRODUCTS.flatMap((p) => p.collections))]
