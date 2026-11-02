import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navigation } from '@/components/storefront/Navigation'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/components/storefront/CartProvider'
import { CartDrawer } from '@/components/storefront/CartDrawer'
import { AdminToolbar } from '@/components/storefront/AdminToolbar'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Cobleroad — Premium Genuine Leather Bags & Accessories',
    template: '%s | Cobleroad',
  },
  description:
    'Cobleroad crafts premium genuine leather bags and accessories. Discover briefcases, totes, backpacks, wallets, and small leather goods built to last.',
  keywords: ['leather bags', 'genuine leather', 'premium bags', 'leather accessories', 'briefcase', 'leather tote', 'India'],
  authors: [{ name: 'Cobleroad' }],
  creator: 'Cobleroad',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Cobleroad',
    title: 'Cobleroad — Premium Genuine Leather Bags & Accessories',
    description:
      'Premium genuine leather bags, briefcases, totes, and accessories. Discover the Cobleroad collection.',
    images: [
      {
        url: '/images/hero/hero-briefcase.jpg',
        width: 1400,
        height: 788,
        alt: 'Cobleroad — Premium Leather Bags',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cobleroad — Premium Leather Bags & Accessories',
    description: 'Genuine leather bags and accessories crafted for the considered few.',
    images: ['/images/hero/hero-briefcase.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F4EE',
  width: 'device-width',
  initialScale: 1,
}

import { ThemeProvider } from '@/components/theme/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <Navigation />
            <main id="main-content">{children}</main>
            <Footer />
            <CartDrawer />
            <AdminToolbar />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
