"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useCategories } from "../../store/categories"
import { CategoryCard } from "./category-card"

const ITEMS_PER_SLIDE = 4

const createSlides = <T,>(items: T[], perSlide: number) => {
  const slides: T[][] = []
  for (let i = 0; i < items.length; i += perSlide) {
    slides.push(items.slice(i, i + perSlide))
  }
  return slides
}

export const CategoriesSection = () => {
  const t = useTranslations("Theme2.categories")
  const tFeatured = useTranslations("Theme2.featured")
  const categories = useCategories((state) => state.categories)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

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

  const slides = createSlides(categories, ITEMS_PER_SLIDE)

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex md:items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
          <div className="shrink-0">
            <h2 className="text-xl md:text-4xl font-bold">{t("title")}</h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="flex-[0_0_100%] min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {slide.map((category) => (
                    <CategoryCard
                      key={category.id}
                      name={category.name}
                      image={
                        category.wp_category_image_url ||
                        category.image ||
                        category.category_image ||
                        ""
                      }
                      href={`/shop?category=${category.slug}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
