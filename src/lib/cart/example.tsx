/**
 * Example usage of the Zustand-based cart system
 * This file demonstrates common cart operations
 */

"use client"

import { useCart, useCartItemCount, useCartTotal } from "@/lib/cart"
import type { AddToCartOptions } from "./types"

/**
 * Example: Basic cart usage in a product page
 */
export function ProductPageExample() {
  const { addItem, items, totals, isLoading, error } = useCart()

  const handleAddToCart = async () => {
    try {
      const options: AddToCartOptions = {
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
      }

      await addItem(options)
      console.log("Item added to cart!")
    } catch (err) {
      console.error("Failed to add item:", err)
    }
  }

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <p>Items in cart: {totals.itemCount}</p>
      <p>Total: ${totals.total.toFixed(2)}</p>
    </div>
  )
}

/**
 * Example: Using optimized selectors
 */
export function CartSummary() {
  // These hooks only re-render when their specific value changes
  const itemCount = useCartItemCount()
  const total = useCartTotal()

  return (
    <div>
      <p>Cart: {itemCount} items</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  )
}

/**
 * Example: Cart item management
 */
export function CartManagementExample() {
  const { items, updateItem, removeItem, clearCart, totals } = useCart()

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateItem(itemId, { quantity: newQuantity })
    } catch (err) {
      console.error("Failed to update item:", err)
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId)
    } catch (err) {
      console.error("Failed to remove item:", err)
    }
  }

  return (
    <div>
      <h2>Cart Items ({totals.itemCount})</h2>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button
            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
          <button
            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
      <p>Total: ${totals.total.toFixed(2)}</p>
    </div>
  )
}

/**
 * Example: Custom store configuration
 */
export function CustomStoreExample() {
  // You can create a custom store with specific configuration
  // This is useful for multi-shop scenarios or different cart contexts
  const { addItem, items } = useCart({
    currency: "EUR",
    taxRate: 0.2, // 20% VAT
    shipping: 5.99,
    storageKey: "custom-cart",
    validateItem: (item) => {
      if (item.quantity > 10) {
        return "Maximum 10 items allowed"
      }
      return true
    },
  })

  return (
    <div>
      <button
        onClick={() =>
          addItem({
            productId: 1,
            name: "Product",
            price: 99.99,
            quantity: 1,
          })
        }
      >
        Add to Cart
      </button>
      <p>Items: {items.length}</p>
    </div>
  )
}
