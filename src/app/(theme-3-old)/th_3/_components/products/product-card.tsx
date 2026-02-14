"use client"
import Image from "next/image"
import { IProduct } from "../../types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import Link from "next/link"
import { useTranslations } from "next-intl"

export const ProductCard = ({
  product_name: name,
  wp_product_image_url: image,
  price: originalPrice,
  discounted_price: discountedPrice,
  id,
  ulid,
  main_image,
  product_qty,
  product_code,
  slug,
  variations,
}: IProduct) => {
  const t = useTranslations("Theme3.product")
  const router = useRouter()
  const { addItem, getItemByProduct } = useCart()
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
  const OrderNow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (variations) {
      router.push(`/product/${id}?${slug}`)
    } else {
      handleAddToCart(e)
    }
  }

  console.log(variations)
  return (
    <>
      {/* Product Image */}
      <Link
        href={`/product/${ulid}?${slug}`}
        className="relative w-full aspect-square bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden"
      >
        <Image
          src={image || main_image || ""}
          alt={name}
          fill
          style={{ objectFit: "contain" }}
          className="transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-b-xl transition-colors">
        {/* Name */}
        <h4 className="text-sm sm:text-base font-semibold mb-1 truncate text-gray-900 dark:text-white">
          <Link href={`/product/${ulid}?${slug}`}>{name}</Link>
        </h4>

        {/* Price */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">৳{discountedPrice}</span>
          {originalPrice > discountedPrice && (
            <span className="text-gray-400 dark:text-gray-500 line-through text-sm">
              ৳{originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded mb-3 ${
            product_qty > 0
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
          }`}
        >
          {product_qty > 0 ? t("inStock") : t("outOfStock")}
        </span>

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            className={`flex-1 border-2 rounded-md py-1 text-sm font-semibold transition
          ${
            product_qty > 0
              ? "border-[#3BB77E] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white dark:hover:bg-[#2f855a]"
              : "border-[#3BB77E] text-[#3BB77E] cursor-not-allowed"
          }`}
            onClick={handleAddToCart}
            disabled={isAtMax || product_qty === 0}
          >
            {isAtMax ? t("maxQuantityReached") : t("addToCart")}
          </button>

          <button
            className={`flex-1 rounded-md py-1 text-sm font-semibold text-white transition
          ${
            product_qty > 0
              ? "bg-[#3BB77E] hover:bg-[#2f855a]"
              : "bg-[#3BB77E] opacity-50 cursor-not-allowed"
          }`}
            onClick={OrderNow}
            disabled={product_qty === 0}
          >
            {product_qty > 0 ? t("orderNow") : t("outOfStock")}
          </button>
        </div>
      </div>
    </>
  )
}
