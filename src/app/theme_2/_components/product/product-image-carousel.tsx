"use client"

import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProductImage {
  id: string
  src: string
  alt: string
}

interface ProductImageCarouselProps {
  images: ProductImage[]
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel()
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return

    emblaMainApi
      .on("init", onSelect)
      .on("select", onSelect)
      .on("reInit", onSelect)

    return () => {
      emblaMainApi
        .off("init", onSelect)
        .off("select", onSelect)
        .off("reInit", onSelect)
    }
  }, [emblaMainApi, onSelect])

  return (
    <div className="space-y-4">
      {/* Main Image Viewport */}
      <div className="overflow-hidden rounded-3xl" ref={mainViewportRef}>
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative min-w-0 flex-[0_0_100%] aspect-4/5 md:aspect-auto md:h-[620px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={image.id === images[0].id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="overflow-hidden" ref={thumbViewportRef}>
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onThumbClick(index)}
              className={cn(
                "relative min-w-0 flex-[0_0_20%] aspect-square rounded-xl overflow-hidden transition-all",
                "border-2",
                index === selectedIndex
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              type="button"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
