/**
 * Storage adapters for cart persistence
 * Supports localStorage, sessionStorage, and custom storage backends
 */

import type {
  CartState,
  CartStorageAdapter,
  CartStorageAdapterSync,
} from "./types"

/**
 * Base storage adapter using Web Storage API (synchronous)
 * localStorage and sessionStorage operations are synchronous
 */
abstract class WebStorageAdapter implements CartStorageAdapterSync {
  protected abstract storage: Storage

  protected abstract getStorageKey(): string

  getCart(): CartState | null {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const data = this.storage.getItem(this.getStorageKey())
      if (!data) {
        return null
      }

      const parsed = JSON.parse(data) as CartState

      // Validate basic structure
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !Array.isArray(parsed.items) ||
        !parsed.totals
      ) {
        console.warn("Invalid cart data in storage, clearing")
        this.clearCart()
        return null
      }

      return parsed
    } catch (error) {
      console.error("Error reading cart from storage:", error)
      return null
    }
  }

  saveCart(cart: CartState): void {
    if (typeof window === "undefined") {
      return
    }

    try {
      const data = JSON.stringify(cart)
      this.storage.setItem(this.getStorageKey(), data)
    } catch (error) {
      // Handle quota exceeded error
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.error("Storage quota exceeded, clearing old cart data")
        this.clearCart()
        // Try again with smaller data
        try {
          const minimalCart: CartState = {
            ...cart,
            items: cart.items.map((item) => ({
              ...item,
              metadata: undefined, // Remove metadata to save space
            })),
          }
          this.storage.setItem(
            this.getStorageKey(),
            JSON.stringify(minimalCart)
          )
        } catch (retryError) {
          console.error("Failed to save cart even after clearing:", retryError)
          throw new Error("Failed to save cart: storage quota exceeded")
        }
      } else {
        console.error("Error saving cart to storage:", error)
        throw error
      }
    }
  }

  clearCart(): void {
    if (typeof window === "undefined") {
      return
    }

    try {
      this.storage.removeItem(this.getStorageKey())
    } catch (error) {
      console.error("Error clearing cart from storage:", error)
      throw error
    }
  }
}

/**
 * LocalStorage adapter
 * Persists cart across browser sessions
 */
export class LocalStorageAdapter extends WebStorageAdapter {
  protected storage: Storage =
    typeof window !== "undefined" ? localStorage : ({} as Storage)

  constructor(private key: string = "cart") {
    super()
  }

  protected getStorageKey(): string {
    return this.key
  }
}

/**
 * SessionStorage adapter
 * Persists cart only for current browser session
 */
export class SessionStorageAdapter extends WebStorageAdapter {
  protected storage: Storage =
    typeof window !== "undefined" ? sessionStorage : ({} as Storage)

  constructor(private key: string = "cart") {
    super()
  }

  protected getStorageKey(): string {
    return this.key
  }
}

/**
 * Memory storage adapter
 * Stores cart in memory only (no persistence)
 * Useful for SSR or testing
 */
export class MemoryStorageAdapter implements CartStorageAdapterSync {
  private cart: CartState | null = null

  getCart(): CartState | null {
    return this.cart
  }

  saveCart(cart: CartState): void {
    this.cart = cart
  }

  clearCart(): void {
    this.cart = null
  }
}

/**
 * IndexedDB storage adapter
 * For larger carts or when localStorage quota is insufficient
 */
export class IndexedDBAdapter implements CartStorageAdapter {
  private dbName: string
  private storeName: string
  private db: IDBDatabase | null = null

  constructor(dbName: string = "cart-db", storeName: string = "cart") {
    this.dbName = dbName
    this.storeName = storeName
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB is not available"))
        return
      }

      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  async getCart(): Promise<CartState | null> {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.get("cart")

        request.onsuccess = () => {
          const data = request.result as CartState | null
          resolve(data || null)
        }

        request.onerror = () => {
          reject(new Error("Failed to read cart from IndexedDB"))
        }
      })
    } catch (error) {
      console.error("Error reading cart from IndexedDB:", error)
      return null
    }
  }

  async saveCart(cart: CartState): Promise<void> {
    if (typeof window === "undefined") {
      return
    }

    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.put(cart, "cart")

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = () => {
          reject(new Error("Failed to save cart to IndexedDB"))
        }
      })
    } catch (error) {
      console.error("Error saving cart to IndexedDB:", error)
      throw error
    }
  }

  async clearCart(): Promise<void> {
    if (typeof window === "undefined") {
      return
    }

    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.delete("cart")

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = () => {
          reject(new Error("Failed to clear cart from IndexedDB"))
        }
      })
    } catch (error) {
      console.error("Error clearing cart from IndexedDB:", error)
      throw error
    }
  }
}

/**
 * Cookie storage adapter
 * For SSR compatibility (limited size)
 * Uses synchronous interface since cookie operations are synchronous
 */
export class CookieStorageAdapter implements CartStorageAdapterSync {
  constructor(
    private key: string = "cart",
    private maxAge: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  ) {}

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") {
      return null
    }

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null
    }

    return null
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    if (typeof document === "undefined") {
      return
    }

    document.cookie = `${name}=${value}; max-age=${Math.floor(
      maxAge / 1000
    )}; path=/; SameSite=Lax`
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") {
      return
    }

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  getCart(): CartState | null {
    try {
      const data = this.getCookie(this.key)
      if (!data) {
        return null
      }

      const decoded = decodeURIComponent(data)
      const parsed = JSON.parse(decoded) as CartState

      // Validate basic structure
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !Array.isArray(parsed.items) ||
        !parsed.totals
      ) {
        return null
      }

      return parsed
    } catch (error) {
      console.error("Error reading cart from cookie:", error)
      return null
    }
  }

  saveCart(cart: CartState): void {
    try {
      const data = JSON.stringify(cart)
      const encoded = encodeURIComponent(data)

      // Check size limit (4096 bytes per cookie)
      if (encoded.length > 4000) {
        console.warn("Cart data too large for cookie, truncating items")
        const minimalCart: CartState = {
          ...cart,
          items: cart.items.slice(0, 5), // Keep only first 5 items
        }
        const minimalData = JSON.stringify(minimalCart)
        const minimalEncoded = encodeURIComponent(minimalData)
        this.setCookie(this.key, minimalEncoded, this.maxAge)
      } else {
        this.setCookie(this.key, encoded, this.maxAge)
      }
    } catch (error) {
      console.error("Error saving cart to cookie:", error)
      throw error
    }
  }

  clearCart(): void {
    this.deleteCookie(this.key)
  }
}

/**
 * Helper function to check if adapter is synchronous
 */
export function isSyncAdapter(
  adapter: CartStorageAdapter | CartStorageAdapterSync
): adapter is CartStorageAdapterSync {
  // Check if adapter has synchronous methods (no Promise return types)
  const testAdapter = adapter as unknown as {
    getCart: () => unknown
  }
  const result = testAdapter.getCart()
  return !(result instanceof Promise)
}

/**
 * Helper function to normalize adapter to async interface
 * Wraps sync adapters in async functions for compatibility
 */
export function normalizeToAsyncAdapter(
  adapter: CartStorageAdapter | CartStorageAdapterSync
): CartStorageAdapter {
  if (isSyncAdapter(adapter)) {
    return {
      getCart: async () => adapter.getCart(),
      saveCart: async (cart: CartState) => adapter.saveCart(cart),
      clearCart: async () => adapter.clearCart(),
    }
  }
  return adapter
}

/**
 * Create default storage adapter based on environment
 * Returns synchronous adapter for better performance
 */
export function createDefaultStorageAdapter(): CartStorageAdapterSync {
  if (typeof window === "undefined") {
    return new MemoryStorageAdapter()
  }

  // Try localStorage first
  try {
    const test = "__cart_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return new LocalStorageAdapter()
  } catch {
    // Fallback to sessionStorage
    try {
      const test = "__cart_test__"
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return new SessionStorageAdapter()
    } catch {
      // Fallback to memory
      return new MemoryStorageAdapter()
    }
  }
}
