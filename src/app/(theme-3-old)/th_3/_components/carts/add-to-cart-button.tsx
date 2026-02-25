"use client"
import { useCart } from "@/lib/cart"
import React, { useState } from "react"
import { IProduct } from "../../types/product"
import type { CartItemVariant } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { ShoppingCart } from "lucide-react"
import { trackAddToCart } from "@/lib/gtm"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: IProduct
  variants?: CartItemVariant[]
  maxQuantity?: number
  selectedPrice?: number
  selectedImage?: string | null
  selectedQuantity?: number
}

function AddToCartButton({
  product,
  variants,
  maxQuantity,
  selectedPrice,
  selectedImage,
  selectedQuantity = 1,
}: AddToCartButtonProps) {
  const { addItem, getItemByProduct } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const t = useTranslations("Theme2.buttons")

  if (!product) return null

  // Check current quantity in cart
  const cartItem = getItemByProduct(product.id, variants)
  const currentQuantity = cartItem?.quantity ?? 0
  const effectivePrice = selectedPrice ?? product.price
  const effectiveImage = selectedImage ?? product.main_image

  const handleAddToCart = async () => {
    const maxQty = maxQuantity ?? product.product_qty
    const requestedQuantity = Math.max(1, Math.floor(selectedQuantity || 1))
    const quantityToAdd = currentQuantity === 0 ? requestedQuantity : 1
    if (maxQty === 0) {
      toast.error("Sorry, this product is currently out of stock.")
      return
    }

    if (maxQty && currentQuantity >= maxQty) {
      toast.warning(
        `You have already added the maximum quantity of this product to your cart.`
      )
      return
    }
    if (maxQty && currentQuantity + quantityToAdd > maxQty) {
      toast.warning(
        `You can only add up to ${maxQty} of this product to your cart. You currently have ${currentQuantity} in your cart.`
      )
      return
    }
    setIsAdding(true)
    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: effectivePrice,
        discountedPrice: effectivePrice,
        quantity: quantityToAdd,
        variants: variants,
        metadata: {
          image: effectiveImage,
          sku: product.product_code,
          ulid: product.ulid,
          maxQuantity: maxQty,
          inside_dhaka: product.inside_dhaka,
          outside_dhaka: product.outside_dhaka,
          sub_area_charge: product.sub_area_charge,
        },
        mergeIfExists: true,
        maxQuantity: maxQty,
      })
      toast.success("Item added to cart!")
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: effectivePrice,
        quantity: quantityToAdd,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  const isAtMax =
    (maxQuantity ?? product.product_qty) === 0 ||
    (maxQuantity
      ? currentQuantity >= maxQuantity
      : product.product_qty
        ? currentQuantity >= product.product_qty
        : false)

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAtMax || isAdding}
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
