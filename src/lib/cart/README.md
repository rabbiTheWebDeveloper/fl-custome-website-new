# Cart Management System

A decoupled, secure, and reusable cart management solution for any storefront. This system uses **Zustand** for state management and provides comprehensive cart functionality with validation, persistence, and React integration.

## Features

- ✅ **Zustand Store** - Reactive state management with Zustand
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Secure** - Input validation and sanitization
- ✅ **Flexible Storage** - Multiple storage adapters (localStorage, sessionStorage, IndexedDB, cookies, memory)
- ✅ **Store-Based** - No API calls for cart operations (add, update, delete)
- ✅ **React Hooks** - Easy React integration with optimized selectors
- ✅ **Automatic Persistence** - Zustand persist middleware handles localStorage automatically
- ✅ **Error Handling** - Comprehensive error types
- ✅ **Variant Support** - Handle product variants (size, color, etc.)
- ✅ **Performance** - Optimized selectors to prevent unnecessary re-renders

## Installation

The cart system is already included in the project. Zustand is required and already installed. Import from `@/lib/cart`:

```typescript
import { useCart, useCartStore } from "@/lib/cart"
```

## Quick Start

### React Hook Usage

```tsx
import { useCart } from "@/lib/cart"

function ProductPage() {
  const { addItem, items, totals, isLoading } = useCart()

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: 1,
        name: "Product Name",
        price: 99.99,
        discountedPrice: 89.99,
        quantity: 1,
        variants: [
          { key: "size", value: "L" },
          { key: "color", value: "Red" },
        ],
        metadata: {
          image: "/product.jpg",
          sku: "PROD-001",
        },
      })
    } catch (error) {
      console.error("Failed to add item:", error)
    }
  }

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <p>Items in cart: {totals.itemCount}</p>
      <p>Total: ${totals.total.toFixed(2)}</p>
    </div>
  )
}
```

### Direct Store Usage

```typescript
import { useCartStore, createCartStore } from "@/lib/cart"

// Use default store
const addItem = useCartStore.getState().addItem
const items = useCartStore.getState().items

// Or create custom store
const customStore = createCartStore({
  currency: "USD",
  taxRate: 0.1, // 10%
  storageKey: "my-cart",
})

// Add item
await customStore.getState().addItem({
  productId: 1,
  name: "Product",
  price: 99.99,
  quantity: 1,
})

// Get cart
const cart = customStore.getState()
console.log(cart.items, cart.totals)
```

## API Reference

### React Hooks

#### `useCart(config?)`

Main hook for cart management.

**Returns:**

- `cart: CartState` - Complete cart state
- `items: CartItem[]` - Cart items array
- `totals: CartTotals` - Calculated totals
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state
- `addItem(options)` - Add item to cart
- `updateItem(itemId, options)` - Update cart item
- `removeItem(itemId)` - Remove item from cart
- `clearCart()` - Clear entire cart
- `getItem(itemId)` - Get item by ID
- `getItemByProduct(productId, variants?)` - Get item by product
- `recalculateTotals()` - Manually recalculate totals

#### `useCartItemCount()`

Returns total item count (sum of quantities).

#### `useIsCartEmpty()`

Returns `true` if cart is empty.

#### `useCartTotal()`

Returns cart total amount.

#### `useCartItem(itemId)`

Returns specific cart item by ID.

### Zustand Store

#### Create Store

```typescript
createCartStore(config?: CartStoreConfig)
```

**Config Options:**

- `storage?: CartStorageAdapter` - Custom storage adapter (optional, defaults to localStorage via Zustand)
- `currency?: string` - Default currency (default: "USD")
- `taxRate?: number` - Tax rate 0-1 (default: 0)
- `shipping?: number` - Shipping cost (default: 0)
- `validateOnChange?: boolean` - Validate on changes (default: true)
- `validateItem?: (item: CartItem) => boolean | string` - Custom validator
- `storageKey?: string` - Storage key for persistence (default: "cart")

#### Store Methods

- `getState()` - Get current store state
- `addItem(options)` - Add item to cart
- `updateItem(itemId, options)` - Update cart item
- `removeItem(itemId)` - Remove item from cart
- `clearCart()` - Clear cart
- `getItem(itemId)` - Get item by ID
- `getItemByProduct(productId, variants?)` - Get item by product
- `recalculateTotals(options?)` - Recalculate totals
- `initialize()` - Initialize and load from custom storage (if provided)

## Storage Adapters

### LocalStorageAdapter

Persists cart across browser sessions.

```typescript
import { LocalStorageAdapter } from "@/lib/cart"

const adapter = new LocalStorageAdapter("cart-key")
```

### SessionStorageAdapter

Persists cart only for current session.

```typescript
import { SessionStorageAdapter } from "@/lib/cart"

const adapter = new SessionStorageAdapter("cart-key")
```

### MemoryStorageAdapter

Stores cart in memory only (no persistence).

```typescript
import { MemoryStorageAdapter } from "@/lib/cart"

const adapter = new MemoryStorageAdapter()
```

### IndexedDBAdapter

For larger carts or when localStorage quota is insufficient.

```typescript
import { IndexedDBAdapter } from "@/lib/cart"

const adapter = new IndexedDBAdapter("cart-db", "cart-store")
```

### CookieStorageAdapter

For SSR compatibility (limited size).

```typescript
import { CookieStorageAdapter } from "@/lib/cart"

const adapter = new CookieStorageAdapter("cart", 7 * 24 * 60 * 60 * 1000)
```

## Store-Based Architecture

The cart system is **store-based only** - no API calls are made for cart operations (add, update, delete). All cart state is managed in the Zustand store and persisted to localStorage automatically.

### Why Store-Based?

- **Performance** - Instant updates, no network latency
- **Offline Support** - Works without internet connection
- **Simplicity** - No need to manage API sync complexity
- **Reliability** - No API failures affecting cart operations

### When to Sync with Backend?

If you need to sync cart with your backend, you can:

1. Call your API when user proceeds to checkout
2. Sync on specific user actions (login, page load)
3. Use a separate service to sync cart state periodically

## Validation

All inputs are validated by default. Validation includes:

- Product ID validation
- Quantity validation (positive integers, max quantity checks)
- Price validation (non-negative numbers)
- Product name sanitization (XSS prevention, length limits)
- Variant validation (key/value sanitization)

Custom validation:

```typescript
const manager = new CartManager({
  validateItem: (item) => {
    if (item.quantity > 10) {
      return "Maximum 10 items allowed"
    }
    return true
  },
})
```

## Error Handling

```typescript
import {
  CartError,
  CartValidationError,
  isCartError,
  getCartErrorMessage,
} from "@/lib/cart"

try {
  await addItem(options)
} catch (error) {
  if (isCartError(error)) {
    console.error(getCartErrorMessage(error))
    // Handle cart-specific error
  }
}
```

**Error Types:**

- `CartError` - Base error
- `CartValidationError` - Validation failed
- `CartStorageError` - Storage operation failed
- `CartApiError` - API operation failed
- `CartItemNotFoundError` - Item not found
- `CartQuantityError` - Quantity error

## Events

Subscribe to cart events:

```typescript
const manager = new CartManager()

const unsubscribe = manager.subscribe((event) => {
  switch (event.type) {
    case "item_added":
      console.log("Item added:", event.item)
      break
    case "item_updated":
      console.log("Item updated:", event.item)
      break
    case "item_removed":
      console.log("Item removed:", event.itemId)
      break
    case "cart_cleared":
      console.log("Cart cleared")
      break
    case "error":
      console.error("Cart error:", event.error)
      break
  }
})
```

## Advanced Usage

### Custom Storage Adapter

```typescript
import { CartStorageAdapter, CartState, createCartStore } from "@/lib/cart"

class MyCustomStorage implements CartStorageAdapter {
  async getCart(): Promise<CartState | null> {
    // Your implementation
  }

  async saveCart(cart: CartState): Promise<void> {
    // Your implementation
  }

  async clearCart(): Promise<void> {
    // Your implementation
  }
}

// Use with custom storage
const store = createCartStore({
  storage: new MyCustomStorage(),
  storageKey: "my-cart",
})
```

### Custom Store Configuration

```typescript
import { createCartStore } from "@/lib/cart"

const store = createCartStore({
  currency: "EUR",
  taxRate: 0.2, // 20% VAT
  shipping: 5.99,
  validateOnChange: true,
  validateItem: (item) => {
    if (item.quantity > 10) {
      return "Maximum 10 items allowed"
    }
    return true
  },
  storageKey: "custom-cart-key",
})
```

### Using Store Outside React

```typescript
import { useCartStore } from "@/lib/cart"

// Subscribe to changes
const unsubscribe = useCartStore.subscribe((state) => {
  console.log("Cart updated:", state.items)
})

// Get current state
const currentCart = useCartStore.getState()

// Perform actions
await useCartStore.getState().addItem({
  productId: 1,
  name: "Product",
  price: 99.99,
  quantity: 1,
})
```

## Security Best Practices

1. **Input Validation** - All inputs are validated and sanitized
2. **XSS Prevention** - Product names and variants are sanitized
3. **Type Safety** - Full TypeScript support prevents type errors
4. **Storage Limits** - Handles storage quota exceeded errors
5. **Error Boundaries** - Comprehensive error handling

## Performance

- **Debounced Sync** - API sync is debounced to reduce requests
- **Optimistic Updates** - UI updates immediately, sync happens in background
- **Efficient Storage** - Only stores necessary data
- **Memory Management** - Proper cleanup of timeouts and listeners

## Browser Support

- Modern browsers with ES6+ support
- localStorage/sessionStorage support
- Optional IndexedDB for larger carts
- SSR compatible (uses memory adapter on server)

## License

Part of the project codebase.
