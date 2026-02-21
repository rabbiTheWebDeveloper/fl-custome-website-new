"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { IProduct } from "../../types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

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
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  const hasDiscount =
    typeof flat_discount_percent === "string"
      ? flat_discount_percent !== "0%" && flat_discount_percent !== "0"
      : Number(flat_discount_percent) > 0
  const isStockOut = product_qty <= 0

  // Check current quantity in cart
  const cartItem = getItemByProduct(id)
  const currentQuantity = cartItem?.quantity ?? 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to product page

    // Check if product is out of stock
    if (product_qty === 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    // Check if we've reached max quantity
    const maxQty = product_qty
    if (maxQty && currentQuantity >= maxQty) {
      toast.warning(tToast("maxQuantityReached"))
      return
    }

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
    }
  }

  // Disable button if at max quantity or out of stock
  const isAtMax =
    product_qty === 0 || (product_qty ? currentQuantity >= product_qty : false)

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => router.push(`/product/${slug}?id=${ulid}`)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-5 left-3 z-10">
            <span className="bg-[#FFA01C] text-black text-sm font-semibold px-3 py-2 rounded-lg">
              {flat_discount_percent} OFF
            </span>
          </div>
        )}

        {/* Stock Out Badge */}
        {isStockOut && (
          <div className="absolute top-5 right-3 z-10">
            <span className="bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg">
              STOCK OUT
            </span>
          </div>
        )}

        {/* Default Product Image */}
        {main_image && main_image.trim() !== "" && (
          <Image
            src={main_image}
            alt={name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        )}
        {image && image.trim() !== "" && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        )}

        {/* Hover Product Image */}
        {main_image && main_image.trim() !== "" && (
          <Image
            src={main_image}
            alt={`${name} alternate view`}
            fill
            className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        )}
        <div className="size-full inset-0 absolute bg-linear-to-b from-transparent via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

        {/* Add to Cart Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 md:text-base"
            onClick={handleAddToCart}
            disabled={isAtMax}
          >
            {isAtMax ? t("maxQuantity") : t("addToCart")}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                ৳{originalPrice}
              </span>
              <span className="text-lg font-semibold text-primary">
                ৳{discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-primary">
              ৳{originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
