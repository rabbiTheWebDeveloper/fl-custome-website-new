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
    // <Button
    //   size="lg"
    //   className="h-13 rounded-xl text-base font-medium bg-black md:flex-1 min-w-0 max-md:w-full"
    //   onClick={handleAddToCart}
    //   disabled={isAtMax}
    // >
    //   {isAtMax ? t("maxQuantity") : t("addToCart")}
    // </Button>

    <button
      onClick={handleAddToCart}
      disabled={isAtMax}
      className="flex items-center gap-2 px-6 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-green-600 transition"
    >
      <ShoppingCart size={20} /> ADD TO CART
    </button>
  )
}

export default AddToCartButton
