/**
 * Core types for cart management system
 * Framework-agnostic and reusable across any storefront
 */

/**
 * Cart item variant selection
 * Represents selected attributes like size, color, etc.
 */
export interface CartItemVariant {
  /** Attribute key (e.g., "size", "color") */
  key: string
  /** Selected value (e.g., "L", "Red") */
  value: string
  /** Optional attribute ID for API reference */
  attributeId?: number | string
}

/**
 * Cart item metadata
 * Additional information about the cart item
 */
export interface CartItemMetadata {
  /** Product image URL */
  image?: string | null
  /** Product slug for URL generation */
  slug?: string
  /** Product SKU/code */
  sku?: string
  /** Whether item is available */
  available?: boolean
  /** Stock quantity available */
  stock?: number
  /** Maximum quantity allowed per order */
  maxQuantity?: number
  /** Custom metadata key-value pairs */
  [key: string]: unknown
}

/**
 * Cart item in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the cart item (product ID + variant hash) */
  id: string
  /** Product ID */
  productId: string | number
  /** Product name */
  name: string
  /** Unit price (before discounts) */
  price: number
  /** Discounted unit price */
  discountedPrice?: number
  /** Quantity in cart */
  quantity: number
  /** Selected variants (size, color, etc.) */
  variants?: CartItemVariant[]
  /** Additional metadata */
  metadata?: CartItemMetadata
  /** Timestamp when item was added */
  addedAt?: string
  /** Timestamp when item was last updated */
  updatedAt?: string
}

/**
 * Cart totals calculation
 */
export interface CartTotals {
  /** Subtotal (sum of all item prices * quantities) */
  subtotal: number
  /** Total discount amount */
  discount: number
  /** Tax amount */
  tax: number
  /** Shipping cost */
  shipping: number
  /** Grand total */
  total: number
  /** Currency code */
  currency?: string
  /** Item count (total quantity) */
  itemCount: number
  /** Unique product count */
  productCount: number
}

/**
 * Complete cart state
 */
export interface CartState {
  /** Array of cart items */
  items: CartItem[]
  /** Calculated totals */
  totals: CartTotals
  /** Cart metadata */
  metadata?: {
    /** Cart ID from server (if synced) */
    cartId?: string | number
    /** User ID (if authenticated) */
    userId?: string | number
    /** Shop/store ID */
    shopId?: string | number
    /** Currency code */
    currency?: string
    /** Locale */
    locale?: string
    /** Custom metadata */
    [key: string]: unknown
  }
  /** Timestamp of last update */
  updatedAt?: string
}

/**
 * Options for adding item to cart
 */
export interface AddToCartOptions {
  /** Product ID */
  productId: string | number
  /** Product name */
  name: string
  /** Unit price */
  price: number
  /** Discounted price (optional) */
  discountedPrice?: number
  /** Initial quantity (default: 1) */
  quantity?: number
  /** Selected variants */
  variants?: CartItemVariant[]
  /** Additional metadata */
  metadata?: CartItemMetadata
  /** Whether to merge with existing item if variant matches */
  mergeIfExists?: boolean
  /** Maximum allowed quantity */
  maxQuantity?: number
}

/**
 * Options for updating cart item
 */
export interface UpdateCartItemOptions {
  /** Cart item ID */
  itemId: string
  /** New quantity (0 to remove) */
  quantity?: number
  /** New price (if changed) */
  price?: number
  /** New discounted price */
  discountedPrice?: number
  /** Update variants */
  variants?: CartItemVariant[]
  /** Update metadata */
  metadata?: Partial<CartItemMetadata>
}

/**
 * Options for updating cart item (without itemId)
 * Used when itemId is passed as a separate parameter
 */
export type UpdateCartItemOptionsWithoutId = Omit<
  UpdateCartItemOptions,
  "itemId"
>

/**
 * Options for calculating totals
 */
export interface CalculateTotalsOptions {
  /** Tax rate (0-1, e.g., 0.1 for 10%) */
  taxRate?: number
  /** Shipping cost */
  shipping?: number
  /** Discount amount (fixed) */
  discount?: number
  /** Currency code */
  currency?: string
}

/**
 * Synchronous storage adapter interface
 * For storage backends with synchronous operations (localStorage, sessionStorage)
 */
export interface CartStorageAdapterSync {
  /** Get cart from storage (synchronous) */
  getCart(): CartState | null
  /** Save cart to storage (synchronous) */
  saveCart(cart: CartState): void
  /** Clear cart from storage (synchronous) */
  clearCart(): void
}

/**
 * Asynchronous storage adapter interface
 * For storage backends with asynchronous operations (IndexedDB, API, etc.)
 */
export interface CartStorageAdapter {
  /** Get cart from storage */
  getCart(): Promise<CartState | null>
  /** Save cart to storage */
  saveCart(cart: CartState): Promise<void>
  /** Clear cart from storage */
  clearCart(): Promise<void>
}

/**
 * Union type for all storage adapters
 * Supports both sync and async adapters
 */
export type CartStorageAdapterAny = CartStorageAdapter | CartStorageAdapterSync

/**
 * API adapter interface
 * Implement this for backend synchronization
 */
export interface CartApiAdapter {
  /** Fetch cart from server */
  fetchCart(): Promise<CartState>
  /** Add item to cart on server */
  addItem(item: AddToCartOptions): Promise<CartItem>
  /** Update item in cart on server */
  updateItem(itemId: string, options: UpdateCartItemOptions): Promise<CartItem>
  /** Remove item from cart on server */
  removeItem(itemId: string): Promise<void>
  /** Clear cart on server */
  clearCart(): Promise<void>
  /** Sync local cart with server */
  syncCart(cart: CartState): Promise<CartState>
}

/**
 * Cart manager configuration
 */
export interface CartManagerConfig {
  /** Storage adapter for persistence */
  storage?: CartStorageAdapter
  /** API adapter for backend sync */
  api?: CartApiAdapter
  /** Default currency */
  currency?: string
  /** Default tax rate */
  taxRate?: number
  /** Default shipping cost */
  shipping?: number
  /** Whether to auto-sync with API */
  autoSync?: boolean
  /** Debounce time for auto-sync (ms) */
  syncDebounceMs?: number
  /** Whether to validate on add/update */
  validateOnChange?: boolean
  /** Custom validation function */
  validateItem?: (item: CartItem) => boolean | string
}

/**
 * Cart event types for observers
 */
export type CartEventType =
  | "item_added"
  | "item_updated"
  | "item_removed"
  | "cart_cleared"
  | "cart_loaded"
  | "cart_synced"
  | "error"

/**
 * Cart event payload
 */
export interface CartEvent {
  type: CartEventType
  item?: CartItem
  itemId?: string
  cart?: CartState
  error?: Error
  timestamp: string
}

/**
 * Cart event listener
 */
export type CartEventListener = (event: CartEvent) => void
