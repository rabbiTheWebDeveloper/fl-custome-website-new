"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CartInputConnected } from "../carts/cart-input-connected"
import AddToCartButton from "../carts/add-to-cart-button"
import { Button } from "../ui/button"
import { VariantSelector } from "./variant-selector"
import { useCart, generateCartItemId } from "@/lib/cart"
import { useCartStore } from "@/lib/cart"
import type { IProduct } from "../../types/product"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { trackAddToCart } from "@/lib/gtm"

interface ProductCartControlsProps {
  product: IProduct
}

export function ProductCartControls({ product }: ProductCartControlsProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const items = useCartStore((state) => state.items)
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

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

      // Check if product is out of stock
      if (maxQty === 0) {
        toast.error(tToast("outOfStock"))
        return
      }

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
            ulid: product.ulid,
            inside_dhaka: product.inside_dhaka,
            outside_dhaka: product.outside_dhaka,
            sub_area_charge: product.sub_area_charge,
          },
          mergeIfExists: true,
          maxQuantity: maxQty,
        })
        trackAddToCart({
          id: product.id,
          name: product.product_name,
          price: product.discounted_price ?? product.price,
          quantity: 1,
        })
      }

      // Redirect to checkout
      router.push("/checkout")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error(tToast("addToCartError"))
    }
  }

  return (
    <>
      {showVariants && (
        <div className="mt-8">
          <VariantSelector
            product={product}
            onVariantChange={handleVariantChange}
          />
        </div>
      )}
      <div className="mt-8 w-full">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 min-w-0">
            <CartInputConnected
              product={product}
              variants={cartVariants}
              maxQuantity={product.product_qty}
            />
          </div>
          <Button
            size="lg"
            className="h-13 rounded-xl text-base font-medium md:flex-1 min-w-0"
            onClick={handleBuyNow}
            disabled={product.product_qty <= 0}
          >
            {t("buyNow")}
          </Button>
          <AddToCartButton
            product={product}
            variants={cartVariants}
            maxQuantity={product.product_qty}
          />
        </div>
      </div>
    </>
  )
}
