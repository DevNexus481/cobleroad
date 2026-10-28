import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug } from '@/lib/products/queries'
import { formatAmount } from '@/lib/currency'
import { ProductDetailInteractive } from '@/components/storefront/ProductDetailInteractive'

// Demo product data for when Supabase is not configured
const DEMO_PRODUCTS: Record<string, {
  name: string; desc: string; shortDesc: string; price: number; image: string;
  personalisable: boolean; colour: string; stock: number; material: string | null;
}> = {
  'advocate-briefcase': {
    name: 'The Advocate Briefcase',
    desc: 'The Advocate is built for those who carry more than a laptop. With its dual-buckle top flap, reinforced base, and removable shoulder strap, it transitions from the boardroom to the evening with quiet authority. The interior features a structured document compartment and a padded laptop sleeve.',
    shortDesc: 'A structured leather briefcase with dual-buckle closure.',
    price: 1299900, image: '/images/hero/hero-briefcase.jpg',
    personalisable: true, colour: 'Cognac', stock: 15,
    material: 'Genuine leather exterior',
  },
  'fielder-backpack': {
    name: 'The Fielder Backpack',
    desc: 'The Fielder carries everything and announces nothing. Its padded back panel and adjustable straps distribute weight evenly without sacrificing style. A padded laptop sleeve fits up to 15 inches. The top grab handle is solid rolled leather.',
    shortDesc: 'A structured leather backpack with padded laptop sleeve.',
    price: 1199900, image: '/images/products/backpack-tan.jpg',
    personalisable: true, colour: 'Tan', stock: 20,
    material: 'Genuine leather exterior',
  },
  'marlow-tote': {
    name: 'The Marlow Tote',
    desc: 'The Marlow is a generous, unstructured tote with enough room for a day\'s essentials plus a change of clothes. The double handles are substantial enough to carry comfortably on the shoulder. An interior zip pocket keeps smaller items secured.',
    shortDesc: 'An open-top leather tote with internal zip pocket.',
    price: 899900, image: '/images/products/tote-espresso.jpg',
    personalisable: true, colour: 'Espresso', stock: 30,
    material: 'Genuine leather exterior',
  },
  'meridian-duffle': {
    name: 'The Meridian Duffle',
    desc: 'For those who travel with conviction. The Meridian Duffle is built wide and deep, with a double zipper and solid base feet to protect the leather during transit. A detachable shoulder strap and rolled top handles offer two carry options.',
    shortDesc: 'A large leather travel duffle with reinforced base.',
    price: 1599900, image: '/images/products/duffle-travel.jpg',
    personalisable: true, colour: 'Cognac', stock: 12,
    material: 'Genuine leather exterior',
  },
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const demo = DEMO_PRODUCTS[slug]

  const name = product?.name ?? demo?.name ?? 'Product'
  const desc = product?.seo_description ?? product?.short_description ?? demo?.shortDesc ?? ''

  return {
    title: product?.seo_title ?? `${name} — Cobleroad`,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: product?.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  // Try live DB first
  const product = await getProductBySlug(slug)

  // Fall back to demo data
  const demoData = DEMO_PRODUCTS[slug]

  if (!product && !demoData) {
    notFound()
  }

  const isDemo = !product

  return (
    <div style={{ backgroundColor: 'var(--colour-paper)' }}>
      {/* Demo notice */}
      {isDemo && (
        <div
          className="demo-notice"
          style={{ justifyContent: 'center', textAlign: 'center' }}
        >
          <span>ℹ</span>
          <span>
            <strong>Demo product.</strong> Connect Supabase to display live product data.
            This product is in draft status and cannot be purchased.
          </span>
        </div>
      )}

      <div className="container-site" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <ProductDetailInteractive
          product={product}
          demoData={
            demoData
              ? {
                  name: demoData.name,
                  desc: demoData.desc,
                  shortDesc: demoData.shortDesc,
                  price: demoData.price,
                  image: demoData.image,
                  personalisable: demoData.personalisable,
                  colour: demoData.colour,
                  stock: demoData.stock,
                  material: demoData.material,
                  variantId: `${slug}-v1`,
                  productId: slug,
                }
              : undefined
          }
          isDemo={isDemo}
        />
      </div>
    </div>
  )
}

