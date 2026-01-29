/**
 * Zustand store for cart management
 * Provides reactive state management for cart operations
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  CartState,
  CartItem,
  AddToCartOptions,
  UpdateCartItemOptions,
  CalculateTotalsOptions,
  CartStorageAdapterAny,
} from "./types"
import { isSyncAdapter } from "./storage"
import {
  validateAddToCartOptions,
  validateUpdateCartItemOptions,
  validateCartItem,
  generateCartItemId,
} from "./validation"
import { CartValidationError } from "./errors"

/**
 * Cart store state
 */
interface CartStoreState extends CartState {
  isLoading: boolean
  error: Error | null
}

/**
 * Cart store actions
 */
interface CartStoreActions {
  // State getters
  getItem: (itemId: string) => CartItem | undefined
  getItemByProduct: (
    productId: string | number,
    variants?: Array<{ key: string; value: string }>
  ) => CartItem | undefined

  // Cart operations
  addItem: (options: AddToCartOptions) => Promise<CartItem>
  updateItem: (
    itemId: string,
    options: Omit<UpdateCartItemOptions, "itemId">
  ) => Promise<CartItem>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>

  // Totals
  recalculateTotals: (options?: CalculateTotalsOptions) => void

  // State management
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  initialize: () => Promise<void>
}

/**
 * Cart store configuration
 */
export interface CartStoreConfig {
  /** Storage adapter for persistence (supports both sync and async) */
  storage?: CartStorageAdapterAny
  /** Default currency */
  currency?: string
  /** Default tax rate */
  taxRate?: number
  /** Default shipping cost */
  shipping?: number
  /** Whether to validate on change */
  validateOnChange?: boolean
  /** Custom validation function */
  validateItem?: (item: CartItem) => boolean | string
  /** Storage key for persistence */
  storageKey?: string
}

/**
 * Create empty cart state
 */
function createEmptyCart(config: CartStoreConfig): CartState {
  return {
    items: [],
    totals: {
      subtotal: 0,
      discount: 0,
      tax: 0,
      shipping: config.shipping ?? 0,
      total: 0,
      itemCount: 0,
      productCount: 0,
      currency: config.currency || "USD",
    },
    metadata: {
      currency: config.currency || "USD",
    },
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Recalculate cart totals
 */
function calculateTotals(
  items: CartItem[],
  options: CalculateTotalsOptions & CartStoreConfig = {}
): CartState["totals"] {
  const taxRate = options.taxRate ?? 0
  const shipping = options.shipping ?? 0
  const discount = options.discount ?? 0
  const currency = options.currency || "USD"

  let subtotal = 0
  let itemCount = 0

  for (const item of items) {
    const itemPrice = item.discountedPrice ?? item.price
    const itemTotal = itemPrice * item.quantity
    subtotal += itemTotal
    itemCount += item.quantity
  }

  const tax = subtotal * taxRate
  const total = subtotal + tax + shipping - discount

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    currency,
    itemCount,
    productCount: items.length,
  }
}

/**
 * Create cart store with Zustand
 */
export function createCartStore(config: CartStoreConfig = {}) {
  const defaultConfig: Required<
    Pick<
      CartStoreConfig,
      "currency" | "taxRate" | "shipping" | "validateOnChange" | "storageKey"
    >
  > = {
    currency: "USD",
    taxRate: 0,
    shipping: 0,
    validateOnChange: true,
    storageKey: "cart",
  }

  const mergedConfig = { ...defaultConfig, ...config }

  return create<CartStoreState & CartStoreActions>()(
    persist(
      (set, get) => ({
        ...createEmptyCart(mergedConfig),
        isLoading: false,
        error: null,

        // State getters
        getItem: (itemId: string) => {
          return get().items.find((item) => item.id === itemId)
        },

        getItemByProduct: (
          productId: string | number,
          variants?: Array<{ key: string; value: string }>
        ) => {
          const itemId = generateCartItemId(productId, variants)
          return get().getItem(itemId)
        },

        // Cart operations
        addItem: async (options: AddToCartOptions) => {
          try {
            set({ error: null })

            // Validate input
            if (mergedConfig.validateOnChange) {
              validateAddToCartOptions(options)
            }

            const itemId = generateCartItemId(
              options.productId,
              options.variants
            )
            const existingItem = get().getItem(itemId)

            let item: CartItem

            if (existingItem && options.mergeIfExists !== false) {
              // Merge with existing item
              const newQuantity =
                existingItem.quantity + (options.quantity || 1)
              item = {
                ...existingItem,
                quantity: newQuantity,
                updatedAt: new Date().toISOString(),
              }

              // Update max quantity if provided
              if (options.maxQuantity !== undefined) {
                item.metadata = {
                  ...item.metadata,
                  maxQuantity: options.maxQuantity,
                }
              }

              // Validate merged item
              if (mergedConfig.validateOnChange) {
                validateCartItem(item)
                if (mergedConfig.validateItem) {
                  const validation = mergedConfig.validateItem(item)
                  if (validation !== true) {
                    throw new CartValidationError(
                      typeof validation === "string"
                        ? validation
                        : "Item validation failed",
                      "item",
                      item
                    )
                  }
                }
              }
            } else {
              // Create new item
              item = {
                id: itemId,
                productId: options.productId,
                name: options.name,
                price: options.price,
                discountedPrice: options.discountedPrice,
                quantity: options.quantity || 1,
                variants: options.variants,
                metadata: {
                  ...options.metadata,
                  maxQuantity: options.maxQuantity,
                },
                addedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }

              // Validate new item
              if (mergedConfig.validateOnChange) {
                validateCartItem(item)
                if (mergedConfig.validateItem) {
                  const validation = mergedConfig.validateItem(item)
                  if (validation !== true) {
                    throw new CartValidationError(
                      typeof validation === "string"
                        ? validation
                        : "Item validation failed",
                      "item",
                      item
                    )
                  }
                }
              }
            }

            // Update state
            const currentItems = get().items
            const updatedItems = existingItem
              ? currentItems.map((i) => (i.id === itemId ? item : i))
              : [...currentItems, item]

            const totals = calculateTotals(updatedItems, mergedConfig)

            const newState = {
              items: updatedItems,
              totals,
              updatedAt: new Date().toISOString(),
            }

            set(newState)

            // Sync with custom storage adapter if provided
            if (config.storage) {
              try {
                if (isSyncAdapter(config.storage)) {
                  config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                } else {
                  await config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                }
              } catch (error) {
                console.warn("Failed to sync cart to custom storage:", error)
              }
            }

            return item
          } catch (error) {
            const cartError =
              error instanceof Error ? error : new Error(String(error))
            set({ error: cartError })
            throw cartError
          }
        },

        updateItem: async (
          itemId: string,
          options: Omit<UpdateCartItemOptions, "itemId">
        ) => {
          try {
            set({ error: null })

            // Validate input
            if (mergedConfig.validateOnChange) {
              // itemId is passed separately, so we combine it with options for validation
              validateUpdateCartItemOptions({ ...options, itemId })
            }

            const existingItem = get().getItem(itemId)
            if (!existingItem) {
              throw new Error(`Cart item with ID ${itemId} not found`)
            }

            // If quantity is 0, remove item
            if (options.quantity === 0) {
              await get().removeItem(itemId)
              return existingItem
            }

            // Update item
            const item: CartItem = {
              ...existingItem,
              ...(options.quantity !== undefined && {
                quantity: options.quantity,
              }),
              ...(options.price !== undefined && { price: options.price }),
              ...(options.discountedPrice !== undefined && {
                discountedPrice: options.discountedPrice,
              }),
              ...(options.variants !== undefined && {
                variants: options.variants,
              }),
              ...(options.metadata !== undefined && {
                metadata: { ...existingItem.metadata, ...options.metadata },
              }),
              updatedAt: new Date().toISOString(),
            }

            // Validate updated item
            if (mergedConfig.validateOnChange) {
              validateCartItem(item)
              if (mergedConfig.validateItem) {
                const validation = mergedConfig.validateItem(item)
                if (validation !== true) {
                  throw new CartValidationError(
                    typeof validation === "string"
                      ? validation
                      : "Item validation failed",
                    "item",
                    item
                  )
                }
              }
            }

            // Update state
            const updatedItems = get().items.map((i) =>
              i.id === itemId ? item : i
            )
            const totals = calculateTotals(updatedItems, mergedConfig)

            const newState = {
              items: updatedItems,
              totals,
              updatedAt: new Date().toISOString(),
            }

            set(newState)

            // Sync with custom storage adapter if provided
            if (config.storage) {
              try {
                if (isSyncAdapter(config.storage)) {
                  config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                } else {
                  await config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                }
              } catch (error) {
                console.warn("Failed to sync cart to custom storage:", error)
              }
            }

            return item
          } catch (error) {
            const cartError =
              error instanceof Error ? error : new Error(String(error))
            set({ error: cartError })
            throw cartError
          }
        },

        removeItem: async (itemId: string) => {
          try {
            set({ error: null })

            const item = get().getItem(itemId)
            if (!item) {
              return // Item doesn't exist, nothing to remove
            }

            const updatedItems = get().items.filter((i) => i.id !== itemId)
            const totals = calculateTotals(updatedItems, mergedConfig)

            const newState = {
              items: updatedItems,
              totals,
              updatedAt: new Date().toISOString(),
            }

            set(newState)

            // Sync with custom storage adapter if provided
            if (config.storage) {
              try {
                if (isSyncAdapter(config.storage)) {
                  config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                } else {
                  await config.storage.saveCart({
                    ...get(),
                    ...newState,
                  } as CartState)
                }
              } catch (error) {
                console.warn("Failed to sync cart to custom storage:", error)
              }
            }
          } catch (error) {
            const cartError =
              error instanceof Error ? error : new Error(String(error))
            set({ error: cartError })
            throw cartError
          }
        },

        clearCart: async () => {
          try {
            set({ error: null })
            const emptyCart = createEmptyCart(mergedConfig)
            set(emptyCart)

            // Sync with custom storage adapter if provided
            if (config.storage) {
              try {
                if (isSyncAdapter(config.storage)) {
                  config.storage.clearCart()
                } else {
                  await config.storage.clearCart()
                }
              } catch (error) {
                console.warn("Failed to clear cart from custom storage:", error)
              }
            }
          } catch (error) {
            const cartError =
              error instanceof Error ? error : new Error(String(error))
            set({ error: cartError })
            throw cartError
          }
        },

        recalculateTotals: (options?: CalculateTotalsOptions) => {
          const items = get().items
          const totals = calculateTotals(items, { ...mergedConfig, ...options })
          set({
            totals,
            updatedAt: new Date().toISOString(),
          })
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading })
        },

        setError: (error: Error | null) => {
          set({ error })
        },

        initialize: async () => {
          set({ isLoading: true, error: null })
          try {
            // If using custom storage adapter, load from it and sync
            if (config.storage) {
              let storedCart: CartState | null
              if (isSyncAdapter(config.storage)) {
                // Synchronous adapter - call directly
                storedCart = config.storage.getCart()
              } else {
                // Asynchronous adapter - await
                storedCart = await config.storage.getCart()
              }

              if (storedCart) {
                const totals = calculateTotals(storedCart.items, mergedConfig)
                set({
                  ...storedCart,
                  totals,
                  isLoading: false,
                })
                return
              }
            }
            // Zustand persist middleware automatically handles localStorage
            // Recalculate totals in case items were loaded from storage
            const currentItems = get().items
            if (currentItems.length > 0) {
              const totals = calculateTotals(currentItems, mergedConfig)
              set({ totals, isLoading: false })
            } else {
              set({ isLoading: false })
            }
          } catch (error) {
            const cartError =
              error instanceof Error ? error : new Error(String(error))
            set({ error: cartError, isLoading: false })
          }
        },
      }),
      {
        name: mergedConfig.storageKey,
        storage: createJSONStorage(() => {
          // Default to localStorage (Zustand handles persistence automatically)
          if (typeof window !== "undefined") {
            return localStorage
          }
          // For SSR, return a no-op storage
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            get length() {
              return 0
            },
            clear: () => {},
            key: () => null,
          } as Storage
        }),
        partialize: (state) => ({
          items: state.items,
          totals: state.totals,
          metadata: state.metadata,
          updatedAt: state.updatedAt,
        }),
      }
    )
  )
}

/**
 * Default cart store instance
 * Can be customized by calling createCartStore with config
 */
export const useCartStore = createCartStore()
