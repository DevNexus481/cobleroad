'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, CurrencyCode, ValidatedCart } from '@/types'
import { createClient } from '@/lib/supabase/client'
import {
  fetchRemoteCart,
  addRemoteCartItem,
  updateRemoteCartItem,
  removeRemoteCartItem,
  clearRemoteCart,
  mergeGuestCartServer,
} from '@/lib/cart/client'

// =============================================================================
// Cart State
// =============================================================================

export interface CartState {
  items: CartItem[]
  currency: CurrencyCode
  isOpen: boolean
  isHydrated: boolean
  warnings: string[]
  hasUnavailableItems: boolean
  hasPriceChanges: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; cartItemId: string }
  | { type: 'UPDATE_QUANTITY'; cartItemId: string; quantity: number }
  | { type: 'SET_CURRENCY'; currency: CurrencyCode }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'HYDRATE'; items: any[]; currency?: CurrencyCode }
  | {
      type: 'SET_VALIDATED_CART'
      cart: ValidatedCart
    }
  | { type: 'DISMISS_WARNINGS' }

function normalizeItem(raw: any): CartItem {
  const priceMinor =
    raw.price_snapshot?.amountMinor ??
    raw.price_snapshot?.amount_minor ??
    raw.price?.amount_minor ??
    raw.amount_minor ??
    0

  const currency = raw.price_snapshot?.currency ?? raw.currency ?? 'INR'
  const productName = raw.product?.name ?? raw.product_name ?? raw.name ?? 'Cobleroad Leather Piece'
  const productSlug = raw.product?.slug ?? raw.product_slug ?? raw.slug ?? ''
  const productId = raw.product?.id ?? raw.product_id ?? raw.id ?? 'prod'
  const variantId = raw.variant?.id ?? raw.variant_id ?? 'var'
  const colour = raw.variant?.colour ?? raw.variant_colour ?? null
  const imgUrl = raw.primary_image?.url ?? raw.product_image_url ?? raw.image ?? '/images/hero/hero-briefcase.jpg'

  return {
    id: raw.id || Math.random().toString(36).slice(2),
    product_id: productId,
    variant_id: variantId,
    quantity: typeof raw.quantity === 'number' && raw.quantity > 0 ? raw.quantity : 1,
    personalisation: raw.personalisation
      ? {
          text: raw.personalisation.text || '',
          style: raw.personalisation.style || null,
        }
      : null,
    price_snapshot: {
      amountMinor: Number.isFinite(priceMinor) ? priceMinor : 0,
      currency,
    },
    current_price: raw.current_price
      ? {
          amountMinor: raw.current_price.amountMinor ?? raw.current_price.amount_minor ?? priceMinor,
          currency: raw.current_price.currency ?? currency,
        }
      : undefined,
    product: {
      id: productId,
      slug: productSlug,
      name: productName,
      is_demo: Boolean(raw.product?.is_demo ?? raw.is_demo),
    },
    variant: {
      id: variantId,
      sku: raw.variant?.sku ?? null,
      colour,
      size: raw.variant?.size ?? null,
      stock_quantity: raw.variant?.stock_quantity ?? 10,
    },
    primary_image: {
      id: productId,
      url: imgUrl,
      alt: productName,
      product_id: productId,
      sort_order: 0,
      created_at: '',
    },
    is_available: raw.is_available !== false,
    unavailable_reason: raw.unavailable_reason ?? null,
    price_changed: Boolean(raw.price_changed),
    stock_limited: Boolean(raw.stock_limited),
    max_available: raw.max_available ?? raw.variant?.stock_quantity ?? 10,
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const cleanItem = normalizeItem(action.item)
      const existing = state.items.findIndex(
        (i) =>
          i.variant_id === cleanItem.variant_id &&
          JSON.stringify(i.personalisation) === JSON.stringify(cleanItem.personalisation)
      )
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = {
          ...items[existing],
          quantity: Math.min(10, items[existing].quantity + cleanItem.quantity),
        }
        return { ...state, items }
      }
      return { ...state, items: [...state.items, cleanItem] }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.cartItemId),
      }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.cartItemId),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.cartItemId
            ? { ...i, quantity: Math.min(10, action.quantity) }
            : i
        ),
      }
    }

    case 'SET_CURRENCY':
      return { ...state, currency: action.currency }

    case 'CLEAR':
      return { ...state, items: [], warnings: [], hasUnavailableItems: false }

    case 'OPEN_DRAWER':
      return { ...state, isOpen: true }

    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false }

    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen }

    case 'HYDRATE': {
      const rawItems = Array.isArray(action.items) ? action.items : []
      const items = rawItems.map(normalizeItem)
      return {
        ...state,
        items,
        currency: action.currency || state.currency,
        isHydrated: true,
      }
    }

    case 'SET_VALIDATED_CART': {
      const cleanItems = (action.cart.items || []).map(normalizeItem)
      return {
        ...state,
        items: cleanItems,
        currency: action.cart.currency || state.currency,
        isHydrated: true,
        warnings: action.cart.warnings || [],
        hasUnavailableItems: Boolean(action.cart.has_unavailable_items),
        hasPriceChanges: Boolean(action.cart.has_price_changes),
      }
    }

    case 'DISMISS_WARNINGS':
      return { ...state, warnings: [] }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  currency: 'INR',
  isOpen: false,
  isHydrated: false,
  warnings: [],
  hasUnavailableItems: false,
  hasPriceChanges: false,
}

// =============================================================================
// Context
// =============================================================================

export interface CartContextValue extends CartState {
  itemCount: number
  subtotalMinor: number
  addItem: (item: CartItem) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setCurrency: (currency: CurrencyCode) => void
  dismissWarnings: () => void
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_STORAGE_KEY = 'cobleroad-cart-v1'
const GUEST_SESSION_STORAGE_KEY = 'cobleroad-guest-session'

// =============================================================================
// Provider
// =============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const isMergingRef = useRef(false)

  // 1. Instant local hydration on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const rawItems = Array.isArray(parsed?.items) ? parsed.items : []
        dispatch({
          type: 'HYDRATE',
          items: rawItems,
          currency: parsed?.currency || 'INR',
        })
      } else {
        dispatch({ type: 'HYDRATE', items: [], currency: 'INR' })
      }
    } catch {
      dispatch({ type: 'HYDRATE', items: [], currency: 'INR' })
    }
  }, [])

  // 2. Persist local changes to localStorage safely
  useEffect(() => {
    if (!state.isHydrated) return

    try {
      const persistable = {
        items: state.items,
        currency: state.currency,
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistable))
    } catch {
      // Ignore quota errors
    }
  }, [state.items, state.currency, state.isHydrated])

  // 3. Revalidate cart with server on mount and check live availability
  const refreshCart = useCallback(async () => {
    try {
      const res = await fetchRemoteCart()
      if (res?.cart) {
        // Store guest session ID if returned
        if (res.guestSessionId) {
          localStorage.setItem(GUEST_SESSION_STORAGE_KEY, res.guestSessionId)
        }
        dispatch({ type: 'SET_VALIDATED_CART', cart: res.cart })
      }
    } catch (err) {
      console.warn('[CartProvider] Server revalidation failed:', err)
    }
  }, [])

  useEffect(() => {
    if (!state.isHydrated) return
    refreshCart()
  }, [state.isHydrated, refreshCart])

  // 4. Supabase Auth state listener for deterministic cart merge on login
  useEffect(() => {
    if (!state.isHydrated) return

    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user && !isMergingRef.current) {
          isMergingRef.current = true
          try {
            const guestSessionId = localStorage.getItem(GUEST_SESSION_STORAGE_KEY)
            const result = await mergeGuestCartServer(guestSessionId)
            if (result?.cart) {
              dispatch({ type: 'SET_VALIDATED_CART', cart: result.cart })
            }
          } catch (err) {
            console.error('[CartProvider] Cart merge on login error:', err)
          } finally {
            isMergingRef.current = false
          }
        } else if (event === 'SIGNED_OUT') {
          // On logout: Account cart stays safe on server!
          // Establish new guest session locally
          try {
            const newGuestId = crypto.randomUUID()
            localStorage.setItem(GUEST_SESSION_STORAGE_KEY, newGuestId)
          } catch {
            // Ignore
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [state.isHydrated])

  // Subtotal counts only available items
  const itemCount = state.items.reduce(
    (sum, i) => sum + (i.is_available !== false ? (i.quantity || 1) : 0),
    0
  )

  const subtotalMinor = state.items.reduce((sum, i) => {
    if (i.is_available === false) return sum
    const price = i.current_price?.amountMinor ?? i.price_snapshot?.amountMinor ?? 0
    return sum + (Number.isFinite(price) ? price : 0) * (i.quantity || 1)
  }, 0)

  // Actions
  const addItem = useCallback(
    (item: CartItem) => {
      // 1. Optimistic local update
      dispatch({ type: 'ADD_ITEM', item })
      dispatch({ type: 'OPEN_DRAWER' })

      // 2. Background server persistence
      addRemoteCartItem({
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
        personalisation: item.personalisation,
        priceSnapshot: item.price_snapshot,
      }).then((validated) => {
        if (validated) {
          dispatch({ type: 'SET_VALIDATED_CART', cart: validated })
        }
      })
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', cartItemId: id })
    removeRemoteCartItem(id).then((validated) => {
      if (validated) {
        dispatch({ type: 'SET_VALIDATED_CART', cart: validated })
      }
    })
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', cartItemId: id, quantity: qty })
    updateRemoteCartItem(id, qty).then((validated) => {
      if (validated) {
        dispatch({ type: 'SET_VALIDATED_CART', cart: validated })
      }
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    clearRemoteCart()
  }, [])

  const openCart = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), [])
  const setCurrency = useCallback(
    (currency: CurrencyCode) => dispatch({ type: 'SET_CURRENCY', currency }),
    []
  )
  const dismissWarnings = useCallback(() => dispatch({ type: 'DISMISS_WARNINGS' }), [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        itemCount,
        subtotalMinor,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        setCurrency,
        dismissWarnings,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// =============================================================================
// Hook
// =============================================================================

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
