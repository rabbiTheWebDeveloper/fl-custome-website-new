"use client"
import React, { useEffect, useCallback, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { IBannerItem } from "../types/banner"

export default function HeroBanner({
  banners,
  slides,
}: {
  banners?: IBannerItem[]
  slides?: IBannerItem[]
}) {
  const items = banners || slides || []
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 60 }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  if (!items || items.length === 0) {
    return (
      <div className="relative pt-28 pb-8 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="w-full h-[420px] md:h-[580px] rounded-[2.5rem] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center gap-6 border border-gray-200/50 dark:border-zinc-700/50">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white text-center max-w-lg leading-tight">
            Shop the Best Collection
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-center max-w-md text-lg">
            Discover premium products crafted for quality and elegance.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl"
          >
            Explore Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pt-28 pb-8 px-4 sm:px-6 w-full max-w-7xl mx-auto">
      <div
        className="overflow-hidden rounded-[2.5rem] shadow-2xl relative bg-gray-100 dark:bg-zinc-900 ring-1 ring-gray-900/5 dark:ring-white/10"
        ref={emblaRef}
      >
        <div className="flex touch-pan-y h-[420px] md:h-[620px]">
          {items.map((banner, index) => {
            const isActive = index === selectedIndex
            return (
              <div
                key={banner.id || index}
                className="relative flex-[0_0_100%] min-w-0 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${isActive ? "scale-110" : "scale-100"}`}
                >
                  <Image
                    src={banner.image}
                    alt={banner.title || `Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 lg:p-20">
                  <div
                    className={`max-w-2xl transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
                  >
                    {banner?.title && (
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 leading-[1.0] drop-shadow-xl">
                        {banner.title}
                      </h2>
                    )}
                    {banner?.description && (
                      <p className="text-base md:text-xl text-white/80 mb-8 max-w-lg font-light leading-relaxed">
                        {banner.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 flex-wrap">
                      <Link
                        href={banner.link || "/shop"}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-2xl"
                      >
                        Shop Now
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <div className="absolute bottom-8 right-8 items-center gap-2 z-10 hidden sm:flex">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20 shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20 shadow-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Slide Counter */}
        {items.length > 1 && (
          <div className="absolute top-8 right-8 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/10">
            {selectedIndex + 1} / {items.length}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === selectedIndex
                  ? "w-8 bg-gray-900 dark:bg-white"
                  : "w-1.5 bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
