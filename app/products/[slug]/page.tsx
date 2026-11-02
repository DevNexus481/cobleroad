import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products/queries'
import { ProductDetailInteractive } from '@/components/storefront/ProductDetailInteractive'
import { PRODUCT_BY_SLUG } from '@/lib/products/catalogue'

// Fallback product data (used when Supabase is not configured or product not in DB yet)
// Includes all 14 real products from the BAG AND LUGGAGE catalogue
const DEMO_PRODUCTS: Record<string, {
  name: string; desc: string; shortDesc: string; price: number; image: string;
  personalisable: boolean; colour: string; stock: number; material: string | null;
}> = Object.fromEntries(
  Object.values(PRODUCT_BY_SLUG).map((p) => [
    p.slug,
    {
      name: p.name,
      desc: p.description,
      shortDesc: p.shortDescription,
      price: p.priceINR,
      image: p.primaryImage,
      personalisable: p.personalisable,
      colour: p.variants[0]?.colour ?? 'Cognac',
      stock: 10,
      material: p.material,
    },
  ])
)

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
          product={
            product
              ? {
                  ...product,
                  // Inject real gallery images from catalogue when Supabase has no images yet
                  ...(!product.images || product.images.length === 0
                    ? (() => {
                        const catalogueProduct = PRODUCT_BY_SLUG[slug]
                        if (catalogueProduct) {
                          return {
                            images: catalogueProduct.gallery.map((url, i) => ({
                              id: `real-${slug}-${i}`,
                              product_id: product.id,
                              variant_id: null,
                              url,
                              alt: `${catalogueProduct.name} — View ${i + 1}`,
                              sort_order: i + 1,
                              is_primary: i === 0,
                              status: 'approved' as const,
                              created_at: new Date().toISOString(),
                            })),
                          }
                        }
                        return {}
                      })()
                    : {}),
                }
              : null
          }
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

