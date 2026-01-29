"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { useCategories } from "../store/categories"
import { ICategory } from "../types/categories"

const CATEGORY_ICON_SIZE = 80
const PLACEHOLDER_IMAGE = "/placeholder-category.png"

export default function Category() {
  const categories: ICategory[] | null = useCategories(
    (state) => state.categories
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  /* ----------------------------
   Transform categories to slides
  ----------------------------- */
  const slides = useMemo(() => {
    if (!categories?.length) return []

    return categories.map((item) => {
      const slug = (item.name || "category")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      let image = item.image || PLACEHOLDER_IMAGE
      if (image.startsWith("//")) image = "https:" + image
      if (!image.startsWith("http") && !image.startsWith("/")) {
        image = PLACEHOLDER_IMAGE
      }

      return {
        ...item,
        image,
        href: `/shop?category=${encodeURIComponent(slug)}&shop=${
          item.shop_id || ""
        }&id=${item.id || ""}`,
        displayName: item.name || "Unnamed Category",
      }
    })
  }, [categories])

  /* ----------------------------
   Embla events
  ----------------------------- */
  useEffect(() => {
    if (!emblaApi) return

    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setSnapCount(emblaApi.scrollSnapList().length)
    }

    emblaApi.on("select", update)
    emblaApi.on("reInit", update)

    update()

    return () => {
      emblaApi.off("select", update)
      emblaApi.off("reInit", update)
    }
  }, [emblaApi])

  /* ----------------------------
   Autoplay (optional)
  ----------------------------- */
  useEffect(() => {
    if (!emblaApi || snapCount <= 1) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [emblaApi, snapCount])

  /* ----------------------------
   Helpers
  ----------------------------- */
  const truncate = (text: string, len = 28) =>
    text.length > len ? text.slice(0, len) + "…" : text

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE
  }

  /* ----------------------------
   Empty state
  ----------------------------- */
  if (!slides.length) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <p className="text-gray-500">No categories available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Browse Categories
        </h2>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 py-2">
              {slides.map((item, index) => (
                <div
                  key={item.id}
                  style={{ width: 140 }}
                  className="
                    flex-shrink-0
                    sm:w-[160px]
                    md:w-[180px]
                    bg-white
                    rounded-xl
                    p-4
                    text-center
                    border
                    hover:shadow-lg
                    transition
                  "
                >
                  {/* Image */}
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.displayName}
                      width={CATEGORY_ICON_SIZE}
                      height={CATEGORY_ICON_SIZE}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      priority={index < 4}
                    />
                  </div>

                  {/* Title */}
                  <Link href={item.href}>
                    <h5 className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 h-10">
                      {truncate(item.displayName)}
                    </h5>
                  </Link>

                  {/* Sub-category count */}
                  {item.sub_categories?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.sub_categories.length} sub-categories
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          {snapCount > 1 && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                ◀
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                ▶
              </button>
            </>
          )}
        </div>

        {/* Pagination */}
        {snapCount > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === index
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
