"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { IProduct } from "../../types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export const ProductCard = ({
  product_name: name,
  wp_product_image_url: image,
  price: originalPrice,
  discounted_price: discountedPrice,
  flat_discount_percent,
  id,
  ulid,
  main_image,
  product_qty,
  product_code,
  slug,
  discount,
}: IProduct) => {
  const router = useRouter()
  const { addItem, getItemByProduct } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  const hasDiscount =
    typeof flat_discount_percent === "string"
      ? flat_discount_percent !== "0%" && flat_discount_percent !== "0"
      : Number(flat_discount_percent) > 0
  const isStockOut = product_qty <= 0

  const cartItem = getItemByProduct(id)
  const currentQuantity = cartItem?.quantity ?? 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (product_qty === 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    const maxQty = product_qty
    if (maxQty && currentQuantity >= maxQty) {
      toast.warning(tToast("maxQuantityReached"))
      return
    }

    setIsAdding(true)
    try {
      await addItem({
        productId: id,
        name: name,
        price: originalPrice,
        discountedPrice: discountedPrice,
        quantity: 1,
        metadata: {
          image: main_image,
          sku: product_code,
          maxQuantity: maxQty,
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

  // Disable button if at max quantity or out of stock
  const isAtMax =
    product_qty === 0 || (product_qty ? currentQuantity >= product_qty : false)
  console.log(ulid, id)
  return (
    <div
      className="group relative cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-2xl p-2 bg-card"
      onClick={() => {
        const productId = ulid
        if (productId) router.push(`/product/${slug}?id=${productId}`)
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          const productId = ulid
          if (productId) router.push(`/product/${slug}?id=${productId}`)
        }
      }}
    >
      {/* Product Image Container */}
      <div
        className={cn(
          "relative aspect-3/4 rounded-xl overflow-hidden bg-muted",
          isStockOut && "opacity-60 grayscale"
        )}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FFA01C] text-black text-xs md:text-sm font-semibold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg">
              {flat_discount_percent} OFF
            </span>
          </div>
        )}

        {/* Stock Out Badge */}
        {isStockOut && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-600 text-white text-xs md:text-sm font-semibold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg">
              STOCK OUT
            </span>
          </div>
        )}

        {/* Product Image */}
        {main_image && main_image.trim() !== "" && (
          <Image
            src={main_image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {image && image.trim() !== "" && !main_image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <div className="size-full inset-0 absolute bg-linear-to-b from-transparent via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

        {/* Add to Cart Button - always visible on mobile, hover on desktop */}
        {!isStockOut && (
          <div className="absolute bottom-2 left-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-gray-100 rounded-lg text-xs md:text-sm py-2"
              onClick={handleAddToCart}
              disabled={isAtMax || isAdding}
            >
              {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isAtMax ? (
                t("maxQuantity")
              ) : (
                t("addToCart")
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 pt-2">
        <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
              <span className="text-base md:text-lg font-semibold text-primary">
                ৳{discountedPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-base md:text-lg font-semibold text-primary">
              ৳{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
