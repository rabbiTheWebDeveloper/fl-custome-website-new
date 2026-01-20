"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "../products/product-card"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"

// MOCK DATA. SHOULD BE REMOVED LATER
const featuredProducts = [
  {
    id: "1",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "2",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "3",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "4",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "5",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "6",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "7",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "8",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "9",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "10",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "11",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "12",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "13",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "14",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "15",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
  {
    id: "16",
    name: "Essential Hoodie",
    image: "/treats.jpg",
    hoverImage: "/product-placeholder.png",
    originalPrice: 0,
    discountedPrice: 99,
    discountPercentage: 0,
  },
]

// Split products into slides with 2 rows of 4 products each
const createSlides = (products: typeof featuredProducts) => {
  const slides = []
  const productsPerRow = 4
  const rowsPerSlide = 2
  const productsPerSlide = productsPerRow * rowsPerSlide

  for (let i = 0; i < products.length; i += productsPerSlide) {
    const slideProducts = products.slice(i, i + productsPerSlide)
    const row1 = slideProducts.slice(0, productsPerRow)
    const row2 = slideProducts.slice(productsPerRow, productsPerSlide)
    slides.push({ row1, row2 })
  }
  return slides
}

export const FeaturedSection = () => {
  const t = useTranslations("Theme2.featured")
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

  const slides = createSlides(featuredProducts)

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex md:items-center justify-between mb-8 max-md:flex-col max-md:gap-3">
          <h2 className="text-xl md:text-4xl font-bold">{t("title")}</h2>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="md:text-base font-semibold py-6"
              variant="secondary"
              asChild
            >
              <Link href="/featured">{t("seeAll")}</Link>
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
                <span className="sr-only">{t("slidePrevious")}</span>
              </Button>
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronRight className="size-6" />
                <span className="sr-only">{t("slideNext")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel with 2 rows per slide */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="flex-[0_0_100%] min-w-0">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {slide.row1.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {slide.row2.map((product) => (
                    <ProductCard key={product.id} {...product} />
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
