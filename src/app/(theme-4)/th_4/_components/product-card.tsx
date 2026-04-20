"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye, Plus } from "lucide-react"
import { IProduct } from "../types/product"
import { useCartStore } from "@/lib/cart"
import { toast } from "sonner"

export default function ProductCard({ product }: { product: IProduct }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Guard: skip rendering if product data is incomplete/undefined
  if (!product || product.price == null) return null

  const rawPrice = product.price ?? 0
  const rawDiscounted = product.discounted_price ?? rawPrice
  const displayPrice = rawPrice > rawDiscounted ? rawDiscounted : rawPrice
  const hasDiscount = rawPrice > rawDiscounted
  const discountPercent =
    hasDiscount && rawPrice > 0
      ? Math.round(((rawPrice - rawDiscounted) / rawPrice) * 100)
      : 0
  const isLowStock =
    (product.product_qty ?? 0) > 0 && (product.product_qty ?? 0) <= 5
  const isOutOfStock = (product.product_qty ?? 0) <= 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      toast("Please select options first", {
        description: "Navigating to product page...",
      })
      window.location.href = `/product/${product.ulid}?${product.slug}`
      return
    }
    if (isOutOfStock) {
      toast.error("This product is out of stock")
      return
    }
    setIsAdding(true)
    try {
      await addItem({
        productId: String(product.id),
        name: product.product_name,
        price: displayPrice,
        quantity: 1,
        metadata: {
          image: product?.main_image || "",
          slug: product.slug,
          maxQuantity: product.product_qty,
        },
      })
      toast.success("Added to cart!", {
        description: product.product_name,
      })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Link
      href={`/product/${product.ulid}?${product.slug}`}
      className="group relative flex flex-col w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-gray-50 dark:bg-zinc-900/80 overflow-hidden mb-3 sm:mb-4 border border-gray-100/80 dark:border-zinc-800/50">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <div className="px-2.5 py-1 text-[10px] font-black bg-black dark:bg-white text-white dark:text-black rounded-full uppercase tracking-wide shadow-lg">
              -{discountPercent}%
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="px-2.5 py-1 text-[10px] font-black bg-amber-500 text-white rounded-full uppercase tracking-wide shadow-lg">
              Low Stock
            </div>
          )}
          {isOutOfStock && (
            <div className="px-2.5 py-1 text-[10px] font-black bg-red-500 text-white rounded-full uppercase tracking-wide shadow-lg">
              Sold Out
            </div>
          )}
        </div>

        {/* Product Image */}
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.product_name}
            fill
            className={`object-contain p-4 sm:p-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isHovered ? "scale-108" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-200 dark:text-zinc-700">
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/3 transition-all duration-500`}
        />

        {/* Action Pill */}
        <div
          className={`absolute bottom-3 inset-x-3 flex justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center gap-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-full p-1.5 shadow-xl border border-black/5 dark:border-white/10">
            <button
              onClick={(e) => {
                e.preventDefault()
                window.location.href = `/product/${product.ulid}?${product.slug}`
              }}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-zinc-300 transition-colors"
              title="Quick View"
            >
              <Eye size={16} />
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700" />
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black tracking-wide transition-all active:scale-95 ${
                isOutOfStock
                  ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg"
              }`}
              title="Add to Cart"
            >
              {isAdding ? (
                <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              {isOutOfStock ? "Sold Out" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight tracking-tight line-clamp-2 group-hover:opacity-70 transition-opacity">
          {product.product_name}
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
            ৳{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm font-medium text-gray-400 dark:text-zinc-600 line-through">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
