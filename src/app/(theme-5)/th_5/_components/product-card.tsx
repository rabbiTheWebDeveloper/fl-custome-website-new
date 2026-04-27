"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye } from "lucide-react"
import { IProduct } from "../types/product"
import { useCartStore } from "@/lib/cart"
import { toast } from "sonner"

export default function Th5ProductCard({ product }: { product: IProduct }) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  if (!product || product.price == null) return null

  const rawPrice = product.price ?? 0
  const rawDiscounted = product.discounted_price ?? rawPrice
  const displayPrice = rawPrice > rawDiscounted ? rawDiscounted : rawPrice
  const hasDiscount = rawPrice > rawDiscounted
  const discountPct =
    hasDiscount && rawPrice > 0
      ? Math.round(((rawPrice - rawDiscounted) / rawPrice) * 100)
      : 0
  const isOutOfStock = (product.product_qty ?? 0) <= 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      toast("Please select options first")
      window.location.href = `/product/${product.ulid}?${product.slug}`
      return
    }
    if (isOutOfStock) {
      toast.error("Out of stock")
      return
    }
    setAdding(true)
    try {
      await addItem({
        productId: String(product.id),
        name: product.product_name,
        price: displayPrice,
        quantity: 1,
        metadata: {
          image: product.main_image || "",
          slug: product.slug,
          maxQuantity: product.product_qty,
        },
      })
      toast.success("Added to cart!", { description: product.product_name })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link
      href={`/product/${product.ulid}?${product.slug}`}
      className="group flex flex-col bg-white transition-opacity duration-300 hover:opacity-90"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] w-full bg-gray-50 overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-20 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
            -{discountPct}%
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 z-20 bg-gray-500 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
            Sold Out
          </div>
        )}
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.product_name}
            fill
            className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}

        {/* Quick action overlay — desktop hover only */}
        <div
          className={`absolute inset-x-0 bottom-0 sm:flex hidden transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/product/${product.ulid}?${product.slug}`
            }}
            className="flex-1 bg-white/95 text-black text-[11px] font-semibold py-2.5 flex items-center justify-center gap-1.5 hover:bg-gray-50 border-r border-gray-200"
          >
            <Eye size={13} /> View
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`flex-1 text-[11px] font-bold py-2.5 flex items-center justify-center gap-1.5 ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
          >
            {adding ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag size={13} />
            )}
            {isOutOfStock ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 pt-3 pb-1 text-center">
        <h3 className="text-[10px] font-bold text-gray-900 leading-snug uppercase tracking-widest line-clamp-2">
          {product.product_name}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[11px] font-bold text-gray-900">
            ৳{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">
              ৳{rawPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Mobile CTA — always visible */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || adding}
        className={`sm:hidden mt-2 border border-gray-200 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 touch-manipulation transition-colors ${
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-black hover:text-white"
        }`}
      >
        {adding ? (
          <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : null}
        {isOutOfStock ? "Sold Out" : "Add to Cart"}
      </button>
    </Link>
  )
}
