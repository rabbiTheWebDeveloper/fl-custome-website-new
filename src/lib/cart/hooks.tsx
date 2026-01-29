/**
 * React hooks for cart management
 * Provides easy integration with React components using Zustand store
 */

"use client"

import { useEffect, useMemo, useCallback } from "react"
import type {
  CartState,
  CartItem,
  AddToCartOptions,
  UpdateCartItemOptions,
  CalculateTotalsOptions,
} from "./types"
import { useCartStore, createCartStore, type CartStoreConfig } from "./store"

/**
 * Cart context value
 */
export interface CartContextValue {
  cart: CartState
  items: CartItem[]
  totals: CartState["totals"]
  isLoading: boolean
  error: Error | null
  addItem: (options: AddToCartOptions) => Promise<CartItem>
  updateItem: (
    itemId: string,
    options: Omit<UpdateCartItemOptions, "itemId">
  ) => Promise<CartItem>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getItem: (itemId: string) => CartItem | undefined
  getItemByProduct: (
    productId: string | number,
    variants?: Array<{ key: string; value: string }>
  ) => CartItem | undefined
  recalculateTotals: (options?: CalculateTotalsOptions) => void
}

/**
 * Hook to use cart store
 * Uses Zustand store for reactive state management
 *
 * @example
 * ```tsx
 * function ProductPage() {
 *   const { addItem, items, totals } = useCart()
 *
 *   const handleAddToCart = async () => {
 *     await addItem({
 *       productId: 1,
 *       name: 'Product',
 *       price: 99.99,
 *       quantity: 1
 *     })
 *   }
 * }
 * ```
 */
export function useCart(config?: CartStoreConfig): CartContextValue {
  // Use default store or create custom one if config provided
  const store = useMemo(
    () => (config ? createCartStore(config) : useCartStore),
    [config]
  )

  // Select properties individually to avoid creating new objects in selectors
  const items = store((state) => state.items)
  const totals = store((state) => state.totals)
  const metadata = store((state) => state.metadata)
  const updatedAt = store((state) => state.updatedAt)
  const isLoading = store((state) => state.isLoading)
  const error = store((state) => state.error)
  const addItem = store((state) => state.addItem)
  const updateItem = store((state) => state.updateItem)
  const removeItem = store((state) => state.removeItem)
  const clearCart = store((state) => state.clearCart)
  const getItem = store((state) => state.getItem)
  const getItemByProduct = store((state) => state.getItemByProduct)
  const recalculateTotals = store((state) => state.recalculateTotals)
  const initialize = store((state) => state.initialize)

  // Construct cart object from selected properties (cached with useMemo)
  const cart = useMemo(
    () =>
      ({
        items,
        totals,
        metadata,
        updatedAt,
      }) as CartState,
    [items, totals, metadata, updatedAt]
  )

  // Initialize on mount if using custom config
  useEffect(() => {
    if (config) {
      initialize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  // Cache return value to avoid creating new object on every render
  return useMemo(
    () => ({
      cart,
      items: cart.items,
      totals: cart.totals,
      isLoading,
      error,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getItem,
      getItemByProduct,
      recalculateTotals,
    }),
    [
      cart,
      isLoading,
      error,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getItem,
      getItemByProduct,
      recalculateTotals,
    ]
  )
}

/**
 * Hook to get cart item count
 * Optimized selector to avoid unnecessary re-renders
 */
export function useCartItemCount(): number {
  return useCartStore((state) => state.totals.itemCount)
}

/**
 * Hook to check if cart is empty
 * Optimized selector to avoid unnecessary re-renders
 */
export function useIsCartEmpty(): boolean {
  return useCartStore((state) => state.items.length === 0)
}

/**
 * Hook to get cart total
 * Optimized selector to avoid unnecessary re-renders
 */
export function useCartTotal(): number {
  return useCartStore((state) => state.totals.total)
}

/**
 * Hook to get specific cart item
 * Optimized selector to avoid unnecessary re-renders
 */
export function useCartItem(itemId: string): CartItem | undefined {
  return useCartStore((state) => state.getItem(itemId))
}

/**
 * Hook to get all cart items
 * Optimized selector to avoid unnecessary re-renders
 */
export function useCartItems(): CartItem[] {
  return useCartStore((state) => state.items)
}

/**
 * Hook to get cart totals
 * Optimized selector to avoid unnecessary re-renders
 */
export function useCartTotals(): CartState["totals"] {
  return useCartStore((state) => state.totals)
}
