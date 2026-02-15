"use client"

import { useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useCategories } from "../../store/categories"
import { CategoryCard } from "./category-card"

export const CategoriesSection = () => {
  const t = useTranslations("Theme2.categories")
  const tFeatured = useTranslations("Theme2.featured")
  const categories = useCategories((state) => state.categories)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [autoplayPlugin.current]
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  if (!categories || categories.length === 0) return null

  // Only show top-level categories (exclude sub-categories that have a parent_id)
  const topLevelCategories = categories.filter((cat) => !cat.parent_id)

  if (topLevelCategories.length === 0) return null

  // Repeat categories enough times to fill the carousel for seamless looping
  const MIN_ITEMS = 20
  const repeatCount = Math.max(
    1,
    Math.ceil(MIN_ITEMS / topLevelCategories.length)
  )
  const loopedCategories = Array.from(
    { length: repeatCount },
    () => topLevelCategories
  ).flat()

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex md:items-center justify-between mb-8 max-md:flex-col max-md:items-center max-md:text-center max-md:gap-4 overflow-hidden">
          <div className="min-w-0 md:shrink-0">
            <h2 className="text-xl md:text-4xl font-bold break-words">
              {t("title")}
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap max-md:justify-center">
            <Button
              size="lg"
              className="md:text-base font-semibold py-6"
              variant="secondary"
              asChild
            >
              <Link href="/shop">{tFeatured("seeAll")}</Link>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronLeft className="size-6" />
                <span className="sr-only">{tFeatured("slidePrevious")}</span>
              </Button>
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronRight className="size-6" />
                <span className="sr-only">{tFeatured("slideNext")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel — individual scrollable items */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {loopedCategories.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="min-w-0 flex-[0_0_36%] sm:flex-[0_0_24%] md:flex-[0_0_18%] lg:flex-[0_0_13%] pl-4"
              >
                <CategoryCard
                  name={category.name}
                  image={
                    category.wp_category_image_url ||
                    category.image ||
                    category.category_image ||
                    ""
                  }
                  href={`/shop?category=${category.slug}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
