"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { IProduct } from "../../types/product"
import type { CartItemVariant } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

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
  const [isAdding, setIsAdding] = useState(false)
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  if (!product) return null

  const cartItem = getItemByProduct(product.id, variants)
  const currentQuantity = cartItem?.quantity ?? 0

  const handleAddToCart = async () => {
    const maxQty = maxQuantity ?? product.product_qty

    if (maxQty === 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    if (maxQty && currentQuantity >= maxQty) {
      toast.warning(tToast("maxQuantityReached"))
      return
    }

    setIsAdding(true)
    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: product.price,
        discountedPrice: product.discounted_price,
        quantity: 1,
        variants: variants,
        metadata: {
          image: product.main_image,
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
      toast.success(tToast("addedToCart"))
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error(tToast("addToCartError"))
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
    <Button
      size="lg"
      className="h-13 rounded-xl text-base font-medium bg-black md:flex-1 min-w-0 max-md:w-full"
      onClick={handleAddToCart}
      disabled={isAtMax || isAdding}
    >
      {isAdding ? (
        <Loader2 className="size-5 animate-spin" />
      ) : isAtMax ? (
        t("maxQuantity")
      ) : (
        t("addToCart")
      )}
    </Button>
  )
}

export default AddToCartButton
