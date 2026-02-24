"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "../ui/button"
import type { IProduct } from "../../types/product"
import { trackAddToCart } from "@/lib/gtm"

interface StickyMobileBarProps {
  product: IProduct
}

export function StickyMobileBar({ product }: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddToCart = async () => {
    if (product.product_qty <= 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: product.price,
        discountedPrice: product.discounted_price,
        quantity: 1,
        metadata: {
          image: product.main_image,
          sku: product.product_code,
          maxQuantity: product.product_qty,
          ulid: product.ulid,
        },
        mergeIfExists: true,
        maxQuantity: product.product_qty,
      })
      toast.success(tToast("addedToCart"))
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: product.discounted_price ?? product.price,
        quantity: 1,
      })
    } catch {
      toast.error(tToast("addToCartError"))
    }
  }

  const handleBuyNow = async () => {
    if (product.product_qty <= 0) {
      toast.error(tToast("outOfStock"))
      return
    }
    await handleAddToCart()
    router.push("/checkout")
  }

  if (!isVisible) return null

  const displayPrice =
    product.price > product.discounted_price
      ? product.discounted_price
      : product.price
  const isStockOut = product.product_qty <= 0

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
