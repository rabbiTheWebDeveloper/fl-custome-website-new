"use client"
import React, { useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Th5ProductCard from "./product-card"
import { IProduct } from "../types/product"
import { useCartStore } from "@/lib/cart"
import { toast } from "sonner"
import {
  ChevronDown,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/* ─────────────────────────────────────────────────────────────────────────────
   StoryCard — matches thepatchee.com "STORIES THAT LEAD" cards exactly:
   • Tall portrait 9:16 card with rounded corners + border
   • Background = video (if video_url available) or lifestyle image
   • Bottom: small product thumbnail + name + price in dark bar
   • Below card: "Add To Cart" (black) / "Sold Out" + dropdown arrow button
───────────────────────────────────────────────────────────────────────────── */

function getYouTubeEmbedUrl(url: string) {
  let videoId = ""
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0]
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0]
  }
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`
    : url
}

function parseVideoUrls(videoUrl: unknown): string[] {
  if (!videoUrl) return []
  if (Array.isArray(videoUrl)) return videoUrl
  if (typeof videoUrl === "string") {
    try {
      const parsed = JSON.parse(videoUrl)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return [videoUrl]
    }
  }
  return []
}

interface StoryProduct {
  id: number
  ulid: string
  slug: string
  name: string
  thumbnail: string // small product image (main_image)
  mediaUrl: string // lifestyle image or video to fill the card
  mediaType: "video" | "image"
  price: number
  isOutOfStock: boolean
}

function StoryCard({ product }: { product: StoryProduct }) {
  const [adding, setAdding] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.isOutOfStock) return
    setAdding(true)
    try {
      await addItem({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        quantity: 1,
        metadata: {
          image: product.thumbnail,
          slug: product.slug,
          maxQuantity: undefined,
        },
      })
      toast.success("Added to cart!", { description: product.name })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* ── Card body (portrait 9:16) ── */}
      <div className="relative" style={{ aspectRatio: "9/16" }}>
        {/* Video or Image fill */}
        <div
          className="absolute inset-0 bg-gray-100 bg-cover bg-center"
          style={{
            backgroundImage: `url(${product.thumbnail || product.mediaUrl})`,
          }}
        >
          {product.mediaType === "video" && product.mediaUrl ? (
            product.mediaUrl.includes("youtube.com") ||
            product.mediaUrl.includes("youtu.be") ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <iframe
                  src={getYouTubeEmbedUrl(product.mediaUrl)}
                  className="absolute top-1/2 left-1/2 w-[350%] h-[150%] sm:h-[200%] -translate-x-1/2 -translate-y-1/2"
                  allow="autoplay; encrypted-media; fullscreen"
                  loading="lazy"
                  tabIndex={-1}
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={product.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )
          ) : product.mediaUrl ? (
            <Image
              src={product.mediaUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            /* Fallback: branded placeholder */
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2">
              <span className="text-xl font-black tracking-tight text-gray-800 uppercase">
                PATCHEE
              </span>
              <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                Own It. Lead It.
              </span>
            </div>
          )}
        </div>

        {/* Gradient + product info at bottom of card */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-10 pb-3 px-3">
          <div className="flex items-center gap-2">
            {/* Small product thumbnail */}
            <div className="w-9 h-9 rounded bg-white flex-shrink-0 overflow-hidden relative border border-white/20">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-contain p-0.5"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ShoppingCart size={12} className="text-gray-500" />
                </div>
              )}
            </div>
            {/* Name + Price */}
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-[10px] font-medium leading-tight line-clamp-2">
                {product.name}
              </span>
              <span className="text-white/80 text-[11px] font-semibold mt-0.5">
                ৳ {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add to Cart row ── */}
      <div className="flex border-t border-gray-200 relative">
        {product.isOutOfStock ? (
          <button
            disabled
            className="flex-1 py-3 text-[11px] font-bold tracking-widest uppercase text-center text-gray-400 bg-gray-100 cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 py-3 text-[11px] font-bold tracking-widest uppercase text-center text-white bg-black hover:bg-gray-900 transition-colors flex items-center justify-center gap-1.5"
          >
            {adding ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            Add To Cart
          </button>
        )}

        {/* Dropdown arrow */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((v) => !v)}
            className={`h-full px-3 border-l border-gray-200 flex items-center justify-center transition-colors ${
              product.isOutOfStock
                ? "bg-gray-100 text-gray-400"
                : "bg-black text-white hover:bg-gray-900"
            }`}
            aria-label="More options"
          >
            <ChevronDown size={14} />
          </button>

          {/* Dropdown menu */}
          {dropOpen && (
            <div className="absolute bottom-full right-0 mb-1 w-40 bg-white border border-gray-200 shadow-lg z-30 rounded">
              <Link
                href={`/product/${product.ulid}?${product.slug}`}
                className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropOpen(false)}
              >
                View Product
              </Link>
              <button
                onClick={(e) => {
                  handleAddToCart(e)
                  setDropOpen(false)
                }}
                disabled={product.isOutOfStock || adding}
                className="block w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors disabled:text-gray-300"
              >
                Quick Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   StoriesSection — picks best media:
   1. video_url[0]  → video card
   2. other_images[0] → lifestyle image card
   3. main_image    → fallback image card
───────────────────────────────────────────────────────────────────────────── */

function resolveMedia(p: IProduct): {
  mediaUrl: string
  mediaType: "video" | "image"
} {
  const videos = parseVideoUrls(p.video_url)
  if (videos.length > 0 && videos[0]) {
    return { mediaUrl: videos[0], mediaType: "video" }
  }
  if (
    Array.isArray(p.other_images) &&
    p.other_images.length > 0 &&
    p.other_images[0]
  ) {
    return { mediaUrl: p.other_images[0], mediaType: "image" }
  }
  return { mediaUrl: p.main_image || "", mediaType: "image" }
}

export default function StoriesSection({ products }: { products: IProduct[] }) {
  // ── Hooks MUST come before any conditional returns ──────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: false, dragFree: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  )
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  // ────────────────────────────────────────────────────────────────────────────

  if (!products.length) return null

  const storyProducts: StoryProduct[] = products.slice(0, 7).map((p) => {
    const { mediaUrl, mediaType } = resolveMedia(p)
    const displayPrice =
      p.discounted_price && p.discounted_price < p.price
        ? p.discounted_price
        : p.price
    return {
      id: p.id,
      ulid: p.ulid,
      slug: p.slug,
      name: p.product_name,
      thumbnail: p.main_image || "",
      mediaUrl,
      mediaType,
      price: displayPrice,
      isOutOfStock: (p.product_qty ?? 0) <= 0,
    }
  })

  return (
    <section className="py-6 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-gray-900">
            Stories That Lead
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="text-[11px] text-gray-500 hover:text-black font-medium"
            >
              See all
            </Link>
            {storyProducts.length > 2 && (
              <div className="hidden sm:flex gap-1.5">
                <button
                  onClick={scrollPrev}
                  className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={scrollNext}
                  className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slider — edge-to-edge on mobile */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2.5 sm:gap-4 touch-pan-y pl-4 sm:pl-6 pr-4 sm:pr-6">
            {storyProducts.map((sp) => (
              <div
                key={sp.id}
                className="flex-[0_0_48%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0"
              >
                <StoryCard product={sp} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Th5ProductSection — reusable grid section (New Arrivals, Flash Deals, etc.)
───────────────────────────────────────────────────────────────────────────── */
export function Th5ProductSection({
  products,
  title,
}: {
  products: IProduct[]
  title: string
}) {
  if (!products.length) return null
  return (
    <section className="py-6 sm:py-16 bg-[#fafafa] sm:bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-gray-900">
            {title}
          </h2>
          <Link
            href="/shop"
            className="text-[11px] text-gray-500 hover:text-black font-medium"
          >
            See all
          </Link>
        </div>
        {/* Grid — 2 cols mobile, expanding up */}
        <div className="px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {products.slice(0, 10).map((product) => (
            <Th5ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* View all CTA */}
        <div className="flex justify-center mt-6 sm:mt-10 px-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto text-center bg-black text-white px-12 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors rounded-xl sm:rounded-none"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  )
}
