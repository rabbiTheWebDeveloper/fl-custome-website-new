"use client"
import Image from "next/image"
import { IProduct } from "../../types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import Link from "next/link"

export const ProductCard = ({
  product_name: name,
  wp_product_image_url: image,
  price: originalPrice,
  discounted_price: discountedPrice,
  id,
  main_image,
  product_qty,
  product_code,
  slug,
  variations,
}: IProduct) => {
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link
        href={`/product/${slug}?id=${id}`}
        className="relative w-full aspect-square"
      >
        <Image
          src={image || main_image || ""}
          alt={name}
          fill
          style={{ objectFit: "contain" }}
          className="transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-sm sm:text-base font-semibold mb-1 truncate">
          <Link href={`/product/${id}?${slug}`}>{name}</Link>
        </h4>

        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">৳{discountedPrice}</span>
          {originalPrice > discountedPrice && (
            <span className="text-gray-400 line-through text-sm">
              ৳{originalPrice}
            </span>
          )}
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            product_qty > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } mb-3`}
        >
          {product_qty > 0 ? "In Stock" : "Out of Stock"}
        </span>

        <div className="mt-auto flex gap-2">
          <button
            className={`flex-1 cursor-pointer border-2 rounded-md py-1 text-sm font-semibold transition ${
              product_qty > 0
                ? "border-[#3BB77E] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
                : "border-[#3BB77E] text-[#3BB77E] cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={isAtMax}
          >
            Add to Cart
          </button>
          <button
            className={`flex-1 cursor-pointer rounded-md py-1 text-sm font-semibold text-white transition ${
              product_qty > 0
                ? "bg-[#3BB77E] hover:bg-[#3BB77E]"
                : "bg-[#3BB77E] cursor-not-allowed"
            }`}
            disabled={product_qty === 0}
            onClick={OrderNow}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  )
}
