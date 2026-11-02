// =============================================================================
// COBLEROAD — Currency Utilities
// All financial calculations use integer minor units to avoid floating-point errors.
// =============================================================================

import type { CurrencyCode, CurrencyConfig, Money } from '@/types'
import { CURRENCY_CONFIGS } from '@/types'

/**
 * Get currency configuration. Throws if currency is not supported.
 */
export function getCurrencyConfig(currency: CurrencyCode): CurrencyConfig {
  const config = CURRENCY_CONFIGS[currency]
  if (!config) throw new Error(`Unsupported currency: ${currency}`)
  return config
}

/**
 * Format a Money value for display.
 * Uses integer minor units to avoid float errors.
 */
export function formatMoney(money: Money): string {
  const config = getCurrencyConfig(money.currency)
  const divisor = Math.pow(10, config.minorUnitPrecision)
  const amount = money.amountMinor / divisor
  const locale = money.currency === 'USD' ? 'en-US' : 'en-IN'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: config.minorUnitPrecision,
    maximumFractionDigits: config.minorUnitPrecision,
  }).format(amount)
}

/**
 * Format a minor-unit amount for a given currency.
 */
export function formatAmount(amountMinor: number, currency: CurrencyCode): string {
  return formatMoney({ amountMinor, currency })
}

/**
 * Calculate the product price for a given currency.
 * For INR: returns base INR price in paise.
 * For USD: converts base INR to USD at standard conversion rate (1 USD = 85 INR),
 * doubles it (2x for international luxury export tier with DDP/DHL),
 * and rounds cleanly to clean luxury 5-dollar multiples in cents (e.g., $425.00).
 */
export function calculateProductPrice(baseInrMinor: number, currency: CurrencyCode): number {
  if (currency === 'INR' || !baseInrMinor) {
    return baseInrMinor
  }

  if (currency === 'USD') {
    const FX_RATE = 85
    const baseInr = baseInrMinor / 100 // rupees
    const baseUsd = baseInr / FX_RATE // USD
    const doubledUsd = baseUsd * 2 // 2x international pricing
    const roundedUsd = Math.max(1, Math.ceil(doubledUsd / 5) * 5)
    return roundedUsd * 100 // cents
  }

  return baseInrMinor
}

/**
 * Convert a decimal amount to minor units.
 * e.g. 1999.00 INR → 199900 paise
 */
export function toMinorUnits(amount: number, currency: CurrencyCode): number {
  const config = getCurrencyConfig(currency)
  const multiplier = Math.pow(10, config.minorUnitPrecision)
  // Round to avoid floating-point accumulation
  return Math.round(amount * multiplier)
}

/**
 * Convert minor units to decimal for display.
 */
export function fromMinorUnits(amountMinor: number, currency: CurrencyCode): number {
  const config = getCurrencyConfig(currency)
  const divisor = Math.pow(10, config.minorUnitPrecision)
  return amountMinor / divisor
}

/**
 * Add two Money values. Currencies must match.
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add ${a.currency} and ${b.currency}`)
  }
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency }
}

/**
 * Multiply money by a quantity (integer).
 */
export function multiplyMoney(money: Money, quantity: number): Money {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error('Quantity must be a non-negative integer')
  }
  return { amountMinor: money.amountMinor * quantity, currency: money.currency }
}

/**
 * Compare two Money values. Currencies must match.
 * Returns negative, 0, or positive like Array.sort comparator.
 */
export function compareMoney(a: Money, b: Money): number {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot compare ${a.currency} and ${b.currency}`)
  }
  return a.amountMinor - b.amountMinor
}

/**
 * Check if a currency is enabled for checkout.
 */
export function isCurrencyEnabled(currency: CurrencyCode): boolean {
  return CURRENCY_CONFIGS[currency]?.enabled ?? false
}

/**
 * Get the list of enabled currencies.
 */
export function getEnabledCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCY_CONFIGS).filter((c) => c.enabled)
}
