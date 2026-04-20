"use client"
import React, { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import Link from "next/link"
import { useCategories } from "../store/categories"
import { ChevronRight } from "lucide-react"

export default function CategorySlider() {
  const categories = useCategories((state) => state.categories)

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  })

  if (!categories || categories.length === 0) return null

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 w-full max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8 lg:mb-10">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-zinc-600 mb-2">
            Browse
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
            Shop by <span className="italic font-light">Category</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white hover:opacity-70 transition-opacity group"
        >
          All Categories
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4"
        ref={emblaRef}
      >
        <div className="flex touch-pan-y gap-4 sm:gap-5">
          {categories.slice(0, 12).map((cat, index) => (
            <div
              key={cat.id || index}
              className="flex-[0_0_auto] min-w-0 w-36 sm:w-44 lg:w-52"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}&id=${cat.id}`}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative w-full aspect-square rounded-3xl bg-gray-50 dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-zinc-800 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/8 dark:group-hover:shadow-black/40 group-hover:-translate-y-1">
                  {cat.category_image ? (
                    <Image
                      src={cat.category_image}
                      alt={cat.name}
                      fill
                      className="object-contain p-5 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-200 dark:text-zinc-700 group-hover:text-gray-400 dark:group-hover:text-zinc-500 transition-colors">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-black/10 dark:group-hover:border-white/10 transition-all duration-500" />
                </div>
                <h3 className="font-bold text-center text-sm text-gray-800 dark:text-zinc-300 tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
                  {cat.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
        >
          Browse All Categories <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}
