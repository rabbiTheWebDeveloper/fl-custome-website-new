"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "../products/product-card"
import { Button } from "../ui/button"
import Link from "next/link"

// MOCK DATA. SHOULD BE REMOVED LATER
const products = [
  {
    id: "1",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "2",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "3",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "4",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "5",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
]

export const WinterProductsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  })

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

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex md:items-center justify-between mb-8 max-md:flex-col max-md:gap-3">
          <h2 className="text-xl md:text-4xl font-bold">Winter 25/26</h2>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="md:text-base font-semibold py-6"
              variant="secondary"
              asChild
            >
              <Link href="/products">SEE ALL</Link>
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
                <span className="sr-only">Slide previous</span>
              </Button>
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronRight className="size-6" />
                <span className="sr-only">Slider next</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(25%-18px)]"
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
