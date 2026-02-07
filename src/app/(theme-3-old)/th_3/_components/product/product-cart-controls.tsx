"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { VariantSelector } from "./variant-selector"
import { useCart, generateCartItemId } from "@/lib/cart"
import { useCartStore } from "@/lib/cart"
import type { IProduct } from "../../types/product"
import { useTranslations } from "next-intl"
import { CreditCard, ShoppingCart } from "lucide-react"
import AddToCartButton from "../carts/add-to-cart-button"

interface ProductCartControlsProps {
  product: IProduct
  swatches?: Array<{
    type: "color" | "size"
    key: string
    label: string
    options: Array<{ label: string; color?: string; selected?: boolean }>
  }>
}

/**
 * Product cart controls component
 * Manages cart input and add to cart button with variant support
 */
export function ProductCartControls({
  product,
  swatches = [],
}: ProductCartControlsProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const items = useCartStore((state) => state.items)
  const t = useTranslations("Theme2.buttons")

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() => {
    // Initialize with first value of each attribute if available
    const initial: Record<string, string> = {}
    if (Array.isArray(product.attributes)) {
      product.attributes.forEach((attr) => {
        if (attr.values && attr.values.length > 0) {
          initial[attr.key] = attr.values[0].value
        }
      })
    }
    return initial
  })

  // Convert selected variants to CartItemVariant format
  const cartVariants = useMemo(() => {
    return Object.entries(selectedVariants)
      .filter(([, value]) => value) // Filter out empty values
      .map(([key, value]) => ({
        key,
        value,
      }))
  }, [selectedVariants])

  // Get current quantity in cart for this product and variants
  const currentCartItem = useMemo(() => {
    const itemId = generateCartItemId(product.id, cartVariants)
    return items.find((item) => item.id === itemId)
  }, [items, product.id, cartVariants])

  const currentQuantity = currentCartItem?.quantity ?? 0

  // Handle variant change from variant selector
  const handleVariantChange = (key: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const showVariants =
    typeof product.variations === "object" &&
    typeof product.attributes === "object"

  const handleBuyNow = async () => {
    try {
      const maxQty = product.product_qty

      // Add item to cart if not already in cart
      if (currentQuantity === 0) {
        await addItem({
          productId: product.id,
          name: product.product_name,
          price: product.price,
          discountedPrice: product.discounted_price,
          quantity: 1,
          variants: cartVariants,
          metadata: {
            image: product.main_image,
            sku: product.product_code,
            maxQuantity: maxQty,
          },
          mergeIfExists: true,
          maxQuantity: maxQty,
        })
      }

      // Redirect to checkout
      router.push("/checkout")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  return (
    <>
      {showVariants && swatches.length > 0 && (
        <div className="mt-8">
          <VariantSelector
            product={product}
            swatches={swatches}
            onVariantChange={handleVariantChange}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        {/* <button className="flex items-center gap-2 px-6 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-green-600 transition">
                    <ShoppingCart size={20} /> ADD TO CART
                  </button> */}
        <AddToCartButton
          product={product}
          variants={cartVariants}
          maxQuantity={product.product_qty}
        />
        <button
          onClick={handleBuyNow}
          className="flex items-center gap-2 px-6 py-2 border-2 border-[#3BB77E] text-[#3BB77E] rounded-lg hover:bg-[#3BB77E] hover:text-white transition"
        >
          <CreditCard size={20} /> Buy Now
        </button>
      </div>
    </>
  )
}
