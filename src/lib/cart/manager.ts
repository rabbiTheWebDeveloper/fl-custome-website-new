/**
 * Cart Manager
 * Class-based API wrapper around Zustand store
 * Provides a traditional class interface while using Zustand for state management
 */

import type {
  CartState,
  CartItem,
  AddToCartOptions,
  UpdateCartItemOptions,
  CalculateTotalsOptions,
  CartEvent,
  CartEventListener,
  CartStorageAdapterAny,
} from "./types"
import { createCartStore, useCartStore, type CartStoreConfig } from "./store"

/**
 * Cart Manager configuration
 * Compatible with CartStoreConfig
 */
export interface CartManagerConfig {
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
 * Cart Manager class
 * Wraps Zustand store with a class-based API
 */
export class CartManager {
  private store: ReturnType<typeof createCartStore>
  private listeners: Set<CartEventListener> = new Set()
  private unsubscribeStore: (() => void) | null = null

  constructor(config: CartManagerConfig = {}) {
    // Convert CartManagerConfig to CartStoreConfig
    const storeConfig: CartStoreConfig = {
      storage: config.storage,
      currency: config.currency,
      taxRate: config.taxRate,
      shipping: config.shipping,
      validateOnChange: config.validateOnChange,
      validateItem: config.validateItem,
      storageKey: config.storageKey,
    }

    // Create or use default store
    // If custom config is provided, create a new store, otherwise use default
    this.store =
      config.storage || config.currency || config.taxRate !== undefined
        ? createCartStore(storeConfig)
        : useCartStore

    // Subscribe to store changes and emit events
    // Zustand subscribe works differently - we track previous state manually
    let prevState = this.store.getState()
    this.unsubscribeStore = this.store.subscribe((state) => {
      // Detect what changed and emit appropriate events
      if (state.items.length > prevState.items.length) {
        // Item was added
        const newItem = state.items.find(
          (item) => !prevState.items.some((prevItem) => prevItem.id === item.id)
        )
        if (newItem) {
          this.emitEvent({
            type: "item_added",
            item: newItem,
            cart: this.getCart(),
            timestamp: new Date().toISOString(),
          })
        }
      } else if (state.items.length < prevState.items.length) {
        // Item was removed
        const removedItem = prevState.items.find(
          (item) =>
            !state.items.some((currentItem) => currentItem.id === item.id)
        )
        if (removedItem) {
          this.emitEvent({
            type: "item_removed",
            item: removedItem,
            itemId: removedItem.id,
            cart: this.getCart(),
            timestamp: new Date().toISOString(),
          })
        }
      } else if (state.items.length === prevState.items.length) {
        // Item might have been updated
        const updatedItem = state.items.find(
          (item, index) =>
            prevState.items[index] &&
            prevState.items[index].id === item.id &&
            prevState.items[index].quantity !== item.quantity
        )
        if (updatedItem) {
          this.emitEvent({
            type: "item_updated",
            item: updatedItem,
            itemId: updatedItem.id,
            cart: this.getCart(),
            timestamp: new Date().toISOString(),
          })
        }
      }

      // Check for errors
      if (state.error && !prevState.error) {
        this.emitEvent({
          type: "error",
          error: state.error,
          cart: this.getCart(),
          timestamp: new Date().toISOString(),
        })
      }

      // Update previous state
      prevState = state
    })
  }

  /**
   * Initialize cart manager
   * Loads cart from storage
   */
  async initialize(): Promise<void> {
    await this.store.getState().initialize()
    this.emitEvent({
      type: "cart_loaded",
      cart: this.getCart(),
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Get current cart state
   */
  getCart(): CartState {
    const state = this.store.getState()
    return {
      items: state.items,
      totals: state.totals,
      metadata: state.metadata,
      updatedAt: state.updatedAt,
    }
  }

  /**
   * Get cart items
   */
  getItems(): CartItem[] {
    return this.store.getState().items
  }

  /**
   * Get cart totals
   */
  getTotals(): CartState["totals"] {
    return this.store.getState().totals
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): CartItem | undefined {
    return this.store.getState().getItem(itemId)
  }

  /**
   * Get item by product ID and variants
   */
  getItemByProduct(
    productId: string | number,
    variants?: Array<{ key: string; value: string }>
  ): CartItem | undefined {
    return this.store.getState().getItemByProduct(productId, variants)
  }

  /**
   * Add item to cart
   */
  async addItem(options: AddToCartOptions): Promise<CartItem> {
    try {
      return await this.store.getState().addItem(options)
    } catch (error) {
      this.emitEvent({
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  /**
   * Update cart item
   */
  async updateItem(
    itemId: string,
    options: Omit<UpdateCartItemOptions, "itemId">
  ): Promise<CartItem> {
    try {
      return await this.store.getState().updateItem(itemId, options)
    } catch (error) {
      this.emitEvent({
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<void> {
    try {
      await this.store.getState().removeItem(itemId)
    } catch (error) {
      this.emitEvent({
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    try {
      await this.store.getState().clearCart()
      this.emitEvent({
        type: "cart_cleared",
        cart: this.getCart(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      this.emitEvent({
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  /**
   * Recalculate cart totals
   */
  recalculateTotals(options?: CalculateTotalsOptions): void {
    this.store.getState().recalculateTotals(options)
  }

  /**
   * Subscribe to cart events
   */
  subscribe(listener: CartEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Emit cart event
   */
  private emitEvent(event: CartEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch (error) {
        console.error("Error in cart event listener:", error)
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore()
      this.unsubscribeStore = null
    }
    this.listeners.clear()
  }
}
