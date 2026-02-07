"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import React from "react"
import { IProduct } from "../../types/product"
import type { CartItemVariant } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
  product: IProduct
  variants?: CartItemVariant[]
  maxQuantity?: number
}

function AddToCartButton({
  product,
  variants,
  maxQuantity,
}: AddToCartButtonProps) {
  const { addItem, getItemByProduct } = useCart()
  const t = useTranslations("Theme2.buttons")

  if (!product) return null

  // Check current quantity in cart
  const cartItem = getItemByProduct(product.id, variants)
  const currentQuantity = cartItem?.quantity ?? 0

  const handleAddToCart = async () => {
    // Check if we've reached max quantity
    const maxQty = maxQuantity ?? product.product_qty
    if (maxQty && currentQuantity >= maxQty) {
      return // Don't add if at max
    }

    await addItem({
      productId: product.id,
      name: product.product_name,
      price: product.price,
      discountedPrice: product.discounted_price,
      quantity: 1, // Always add 1, mergeIfExists will handle incrementing
      variants: variants,
      metadata: {
        image: product.main_image,
        sku: product.product_code,
        maxQuantity: maxQty,
        inside_dhaka: product.inside_dhaka,
        outside_dhaka: product.outside_dhaka,
      },
      mergeIfExists: true, // Merge with existing item if variant matches (increments quantity)
      maxQuantity: maxQty,
    })
  }

  // Disable button if at max quantity
  const isAtMax = maxQuantity
    ? currentQuantity >= maxQuantity
    : product.product_qty
      ? currentQuantity >= product.product_qty
      : false

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAtMax}
      className="
    flex h-11 w-full sm:w-auto items-center justify-center gap-2
    rounded-lg bg-[#3BB77E] px-6
    text-sm font-semibold text-white
    transition-all
    hover:bg-[#2fa36b]
    focus:outline-none focus:ring-2 focus:ring-[#3BB77E]/50
    disabled:cursor-not-allowed disabled:opacity-50
  "
    >
      <ShoppingCart className="h-5 w-5" />
      Add To Cart
    </button>
  )
}

export default AddToCartButton
