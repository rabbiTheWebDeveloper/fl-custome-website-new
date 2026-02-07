"use client"

import { useCart } from "@/lib/cart"
import { CartInput } from "./cart-input"
import type { IProduct } from "../../types/product"
import { generateCartItemId } from "@/lib/cart"
import { useMemo } from "react"
import { useCartStore } from "@/lib/cart"

interface CartInputConnectedProps {
  product: IProduct
  variants?: Array<{ key: string; value: string }>
  maxQuantity?: number
}

/**
 * CartInput component connected to the cart store
 * Automatically syncs with cart state and updates quantity
 */
export function CartInputConnected({
  product,
  variants,
  maxQuantity,
}: CartInputConnectedProps) {
  const { updateItem, removeItem } = useCart()

  // Get items from store reactively
  const items = useCartStore((state) => state.items)

  // Get current cart item for this product and variants (reactive)
  const cartItem = useMemo(() => {
    const itemId = generateCartItemId(product.id, variants)
    return items.find((item) => item.id === itemId)
  }, [items, product.id, variants])

  // Current quantity in cart (0 if not in cart)
  const currentQuantity = cartItem?.quantity ?? 0

  // Handle quantity change
  const handleQuantityChange = async (newQuantity: number) => {
    if (!cartItem) {
      // Item not in cart, this shouldn't happen but handle gracefully
      return
    }

    if (newQuantity === 0) {
      // Remove item from cart
      await removeItem(cartItem.id)
    } else {
      // Update quantity
      await updateItem(cartItem.id, { quantity: newQuantity })
    }
  }

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    if (cartItem) {
      await removeItem(cartItem.id)
    }
  }

  return (
    <CartInput
      value={currentQuantity}
      onChange={handleQuantityChange}
      removeFromCart={handleRemoveFromCart}
      productId={product.id}
      maxQuantity={maxQuantity ?? product.product_qty}
    />
  )
}
