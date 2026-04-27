"use client"
import { useCart } from "@/lib/cart"
import React, { useState } from "react"
import { IProduct } from "../../types/product"
import type { CartItemVariant } from "@/lib/cart"

import { ShoppingBag, Check } from "lucide-react"
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
  const [justAdded, setJustAdded] = useState(false)

  if (!product) return null

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
      toast.warning("Maximum quantity already in cart.")
      return
    }
    if (maxQty && currentQuantity + quantityToAdd > maxQty) {
      toast.warning(`You can only add up to ${maxQty} of this product.`)
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
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
      toast.success("Added to cart!")
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: effectivePrice,
        quantity: quantityToAdd,
      })
    } catch {
      toast.error("Failed to add to cart. Please try again.")
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
      className={`
        flex w-full items-center justify-center gap-2
        rounded-full py-3.5 px-5 text-xs font-black uppercase tracking-widest
        transition-all duration-300 active:scale-[0.97] hover:scale-[1.02]
        disabled:cursor-not-allowed disabled:opacity-40
        ${
          justAdded
            ? "bg-emerald-500 text-white shadow-lg"
            : isAtMax
              ? "bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500"
              : "bg-white dark:bg-zinc-900 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black shadow-sm"
        }
      `}
    >
      {isAdding ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : justAdded ? (
        <Check size={14} />
      ) : (
        <ShoppingBag size={14} />
      )}
      {isAdding ? "Adding…" : justAdded ? "Added!" : "Add to Cart"}
    </button>
  )
}

export default AddToCartButton
