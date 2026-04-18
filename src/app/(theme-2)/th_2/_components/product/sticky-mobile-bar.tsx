"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "../ui/button"
import type { IProduct, IVariation } from "../../types/product"
import { trackAddToCart } from "@/lib/gtm"

interface StickyMobileBarProps {
  product: IProduct
  selectedVariation?: IVariation | null
  selectedVariants?: Record<string, string>
}

export function StickyMobileBar({
  product,
  selectedVariation,
  selectedVariants = {},
}: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  const cartVariants = useMemo(() => {
    return Object.entries(selectedVariants)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        const resolvedVariationId = selectedVariation?.id
        return {
          key,
          value,
          variationId: resolvedVariationId,
          variantId: resolvedVariationId,
          attributeId: resolvedVariationId,
        }
      })
  }, [selectedVariants, selectedVariation?.id])

  const maxQty = selectedVariation?.quantity ?? product.product_qty
  const effectivePrice = selectedVariation?.price ?? product.price
  const effectiveImage = selectedVariation?.media || product.main_image

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 150)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddToCart = async () => {
    if (maxQty <= 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: effectivePrice,
        discountedPrice: effectivePrice,
        quantity: 1,
        variants: cartVariants,
        metadata: {
          image: effectiveImage,
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
      toast.success(tToast("addedToCart"))
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: effectivePrice,
        quantity: 1,
      })
    } catch {
      toast.error(tToast("addToCartError"))
    }
  }

  const handleBuyNow = async () => {
    if (maxQty <= 0) {
      toast.error(tToast("outOfStock"))
      return
    }
    await handleAddToCart()
    router.push("/checkout")
  }

  if (!isVisible) return null

  const displayPrice = effectivePrice
  const isStockOut = maxQty <= 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-3 md:hidden animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.product_name}</p>
          <p className="text-base font-semibold text-primary">
            ৳{displayPrice.toLocaleString()}
          </p>
        </div>
        {isStockOut ? (
          <span className="text-sm font-semibold text-red-600">Stock Out</span>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              className="rounded-lg"
            >
              {t("addToCart")}
            </Button>
            <Button size="sm" onClick={handleBuyNow} className="rounded-lg">
              {t("buyNow")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
