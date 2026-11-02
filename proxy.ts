import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore static assets, images, and internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // 1. Check if user already set their preferred currency
  const existingCurrencyCookie = request.cookies.get('cobleroad_currency')?.value

  if (!existingCurrencyCookie) {
    // 2. Geolocation header check (Vercel, Cloudflare, or local header)
    const detectedCountry =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country-code') ||
      'IN'

    const isInternational = detectedCountry !== 'IN'
    const defaultCurrency = isInternational ? 'USD' : 'INR'
    const defaultMarket = isInternational ? 'INTL' : 'IN'

    // Set cookies with 1 year expiration
    response.cookies.set('cobleroad_currency', defaultCurrency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    response.cookies.set('cobleroad_market', defaultMarket, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    response.cookies.set('cobleroad_country', detectedCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const middleware = proxy

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
