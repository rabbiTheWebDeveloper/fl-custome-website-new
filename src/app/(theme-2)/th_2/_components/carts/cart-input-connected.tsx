"use client"

import { useCart } from "@/lib/cart"
import { CartInput } from "./cart-input"
import type { IProduct } from "../../types/product"
import { generateCartItemId } from "@/lib/cart"
import { useMemo } from "react"
import { useCartStore } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

interface CartInputConnectedProps {
  product: IProduct
  variants?: Array<{ key: string; value: string }>
  maxQuantity?: number
  onValuePreview?: (quantity: number) => void
}

/**
 * CartInput component connected to the cart store
 * Automatically syncs with cart state and updates quantity
 */
export function CartInputConnected({
  product,
  variants,
  maxQuantity,
  onValuePreview,
}: CartInputConnectedProps) {
  const { updateItem, removeItem } = useCart()
  const tToast = useTranslations("Theme2.toast")

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
      return
    }

    // Check max quantity before attempting update
    const maxQty = maxQuantity ?? product.product_qty
    if (maxQty !== undefined && newQuantity > maxQty) {
      if (maxQty === 0) {
        toast.error(tToast("outOfStock"))
      } else {
        toast.warning(tToast("maxQuantityReached"))
      }
      return
    }

    if (newQuantity === 0) {
      await removeItem(cartItem.id)
    } else {
      try {
        await updateItem(cartItem.id, { quantity: newQuantity })
      } catch (error) {
        console.error("Failed to update quantity:", error)
        toast.error(tToast("addToCartError"))
      }
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
      onValuePreview={onValuePreview}
    />
  )
}
