/**
 * Cart Management System
 * A decoupled, secure, and reusable cart management solution
 * Uses Zustand for state management and storage adapters for persistence
 *
 * @example
 * ```tsx
 * import { useCart } from '@/lib/cart'
 *
 * function ProductPage() {
 *   const { addItem, items, totals } = useCart()
 *
 *   const handleAddToCart = async () => {
 *     await addItem({
 *       productId: 1,
 *       name: 'Product Name',
 *       price: 99.99,
 *       quantity: 1
 *     })
 *   }
 * }
 * ```
 */

// Core types
export type {
  CartItem,
  CartState,
  CartTotals,
  CartItemVariant,
  CartItemMetadata,
  AddToCartOptions,
  UpdateCartItemOptions,
  UpdateCartItemOptionsWithoutId,
  CalculateTotalsOptions,
  CartStorageAdapter,
} from "./types"

// Validation
export {
  validateProductId,
  validateQuantity,
  validatePrice,
  validateProductName,
  validateVariants,
  validateAddToCartOptions,
  validateUpdateCartItemOptions,
  validateCartItem,
  sanitizeString,
  generateCartItemId,
} from "./validation"

// Storage adapters
export {
  LocalStorageAdapter,
  SessionStorageAdapter,
  MemoryStorageAdapter,
  IndexedDBAdapter,
  CookieStorageAdapter,
  createDefaultStorageAdapter,
  isSyncAdapter,
  normalizeToAsyncAdapter,
} from "./storage"

// Storage adapter types
export type { CartStorageAdapterSync, CartStorageAdapterAny } from "./types"

// Zustand store
export { createCartStore, useCartStore, type CartStoreConfig } from "./store"

// React hooks
export {
  useCart,
  useCartItemCount,
  useIsCartEmpty,
  useCartTotal,
  useCartItem,
  useCartItems,
  useCartTotals,
  type CartContextValue,
} from "./hooks"

// Errors
export {
  CartError,
  CartValidationError,
  CartStorageError,
  CartItemNotFoundError,
  CartQuantityError,
  isCartError,
  getCartErrorMessage,
  getCartErrorCode,
} from "./errors"

// Cart Manager (class-based API wrapper)
export { CartManager, type CartManagerConfig } from "./manager"

// Legacy exports (for backward compatibility, but not recommended)
// API adapters - deprecated, cart is now store-based only
export type {
  CartApiAdapter,
  CartEvent,
  CartEventType,
  CartEventListener,
} from "./types"
