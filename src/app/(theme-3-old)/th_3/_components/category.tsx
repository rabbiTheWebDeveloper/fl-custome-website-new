"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react"
import { useCategories } from "../store/categories"
import { ICategory } from "../types/categories"
import { useTranslations } from "next-intl"

const CATEGORY_ICON_SIZE = 100
const PLACEHOLDER_IMAGE = "/placeholder-category.png"

export default function Category() {
  const t = useTranslations("Theme3.categories")
  const categories: ICategory[] | null = useCategories(
    (state) => state.categories
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
    duration: 30, // Smoother transition
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

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

      let image = item.category_image || PLACEHOLDER_IMAGE
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
   Smooth Autoplay
  ----------------------------- */
  useEffect(() => {
    if (!emblaApi || snapCount <= 1 || isHovering) return

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 4000) // Slower autoplay for better UX

    return () => clearInterval(autoplay)
  }, [emblaApi, snapCount, isHovering])

  /* ----------------------------
   Navigation handlers
  ----------------------------- */
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  /* ----------------------------
   Helpers
  ----------------------------- */
  const truncate = (text: string, len = 25) =>
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
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <Grid3x3 className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t("empty")}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("subtitle") ||
              "Explore our wide range of categories and find what you're looking for"}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-6 py-4 px-2">
              {slides.map((item, index) => (
                <div
                  key={item.id}
                  className={`
                    flex-shrink-0
                    w-[160px] sm:w-[180px] md:w-[200px]
                    transform transition-all duration-300
                    ${selectedIndex === index ? "scale-105" : "scale-100"}
                  `}
                >
                  <Link href={item.href}>
                    <div
                      className="
                      bg-white dark:bg-gray-800
                      rounded-2xl
                      p-6
                      text-center
                      border-2 border-transparent
                      hover:border-[#38B27A] dark:hover:border-[#38B27A]
                      shadow-lg hover:shadow-xl
                      dark:shadow-gray-900/30
                      transition-all duration-300
                      group
                      cursor-pointer
                      h-full
                      flex flex-col
                      items-center
                      justify-center
                    "
                    >
                      {/* Image Container with Gradient */}
                      <div
                        className="
                        relative
                        w-24 h-24
                        mb-4
                        rounded-2xl
                        overflow-hidden
                        bg-gradient-to-br from-blue-100 to-purple-100
                        dark:from-blue-900/30 dark:to-purple-900/30
                        group-hover:scale-110
                        transition-transform duration-300
                      "
                      >
                        <Image
                          src={item.image}
                          alt={item.displayName}
                          width={CATEGORY_ICON_SIZE}
                          height={CATEGORY_ICON_SIZE}
                          className="w-full h-full object-cover"
                          priority={index < 6}
                          unoptimized
                        />

                        {/* Overlay on Hover */}
                        <div
                          className="
                          absolute inset-0
                          bg-gradient-to-t from-blue-600/20 to-transparent
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-300
                        "
                        />
                      </div>

                      {/* Category Name */}
                      <h3
                        className="
                        text-sm font-bold
                        text-gray-800 dark:text-gray-100
                        group-hover:text-[#38B27A] dark:group-hover:text-[#38B27A]
                        transition-colors duration-300
                        mb-2
                        line-clamp-2
                        min-h-[2.5rem]
                      "
                      >
                        {truncate(item.displayName)}
                      </h3>

                      {/* Sub-category Count Badge */}
                      {item.sub_categories?.length > 0 && (
                        <span
                          className="
                          inline-flex
                          items-center
                          px-2.5 py-0.5
                          rounded-full
                          text-xs font-medium
                          bg-gray-100 dark:bg-gray-700
                          text-gray-600 dark:text-gray-300
                          group-hover:bg-[#38B27A]/20 dark:group-hover:bg-[#38B27A]/50
                          group-hover:text-[#38B27A] dark:group-hover:text-[#38B27A]
                          transition-colors duration-300
                        "
                        >
                          {item.sub_categories.length} items
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than one slide */}
          {snapCount > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  -translate-x-4
                  w-12 h-12
                  bg-white dark:bg-gray-800
                  text-gray-800 dark:text-gray-200
                  rounded-full
                  shadow-lg
                  hover:shadow-xl
                  hover:scale-110
                  hover:bg-[#38B27A] hover:text-white
                  dark:hover:bg-[#38B27A]
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  border-2 border-gray-200 dark:border-gray-700
                  hover:border-[#38B27A] dark:hover:border-[#38B27A]
                  z-10
                  hidden md:flex
                "
                aria-label="Previous categories"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  translate-x-4
                  w-12 h-12
                  bg-white dark:bg-gray-800
                  text-gray-800 dark:text-gray-200
                  rounded-full
                  shadow-lg
                  hover:shadow-xl
                  hover:scale-110
                  hover:bg-[#38B27A] hover:text-white
                  dark:hover:bg-[#38B27A]
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  border-2 border-gray-200 dark:border-gray-700
                  hover:border-[#38B27A] dark:hover:border-[#38B27A]
                  z-10
                  hidden md:flex
                "
                aria-label="Next categories"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
