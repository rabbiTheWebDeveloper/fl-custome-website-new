"use client"
import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BannerItem {
  id?: number | string
  image: string
  title?: string
  description?: string
  link?: string
}

export default function Th5HeroBanner({
  slides,
  banners,
}: {
  slides?: BannerItem[]
  banners?: BannerItem[]
}) {
  const items = slides?.length ? slides : banners?.length ? banners : []
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  if (!items.length) {
    return (
      <div className="relative w-full h-[340px] sm:h-[480px] lg:h-[600px] bg-gradient-to-br from-[#f5ede6] to-[#ece1d8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-serif font-normal text-gray-900 mb-4 leading-tight">
            Own It. Lead It.
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Premium bags, shoes & accessories for the bold.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex h-[340px] sm:h-[480px] lg:h-[600px]">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="relative flex-[0_0_100%] min-w-0"
            >
              <Image
                src={item.image}
                alt={item.title ?? `Banner ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-10 left-8 sm:left-16 text-white max-w-xl">
                {item.title && (
                  <h2 className="text-3xl sm:text-5xl font-serif font-normal mb-3 leading-tight drop-shadow-lg">
                    {item.title}
                  </h2>
                )}
                {item.description && (
                  <p className="text-white/80 text-base mb-6 drop-shadow">
                    {item.description}
                  </p>
                )}
                <Link
                  href={item.link ?? "/shop"}
                  className="inline-block bg-white text-black px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-black" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-black" />
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === selectedIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
