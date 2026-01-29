"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { IProduct } from "../../types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useTranslations } from "next-intl"

export const ProductCard = ({
  product_name: name,
  wp_product_image_url: image,
  price: originalPrice,
  discounted_price: discountedPrice,
  flat_discount_percent: discountPercentage,
  id,
  main_image,
  product_qty,
  product_code,
}: IProduct) => {
  const router = useRouter()
  const { addItem, getItemByProduct } = useCart()
  const t = useTranslations("Theme2.buttons")

  // Check current quantity in cart
  const cartItem = getItemByProduct(id)
  const currentQuantity = cartItem?.quantity ?? 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to product page

    // Check if we've reached max quantity
    const maxQty = product_qty
    if (maxQty && currentQuantity >= maxQty) {
      return // Don't add if at max
    }

    try {
      await addItem({
        productId: id,
        name: name,
        price: originalPrice,
        discountedPrice: discountedPrice,
        quantity: 1, // Always add 1, mergeIfExists will handle incrementing
        metadata: {
          image: main_image,
          sku: product_code,
          maxQuantity: maxQty,
          // Note: inside_dhaka and outside_dhaka are not available in ProductCard props
          // They will be fetched from API if needed in checkout
        },
        mergeIfExists: true, // Merge with existing item if variant matches (increments quantity)
        maxQuantity: maxQty,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  // Disable button if at max quantity
  const isAtMax = product_qty ? currentQuantity >= product_qty : false

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {/* Discount Badge */}
        <div className="absolute top-5 left-3 z-10">
          <span className="bg-[#FFA01C] text-black text-sm font-semibold px-3 py-2 rounded-lg">
            {discountPercentage}% OFF
          </span>
        </div>

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
          <span className="text-sm text-gray-500 line-through">
            ৳{originalPrice}
          </span>
          <span className="text-lg font-semibold text-primary">
            ৳{discountedPrice}
          </span>
        </div>
      </div>
    </div>
  )
}
