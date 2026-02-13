"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react" // Or use any icon library
import { api } from "@/lib/api-client"
import { useDomain } from "../store/domain"
import { ISliderApiResponse, ISliderItem } from "../types/slides"

// Local fallback image
const PLACEHOLDER_BANNER = "/banner-placeholder.jpg"

export default function Banner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    duration: 30,
    startIndex: 0,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const domain = useDomain((state) => state.domain)
  const [slides, setSlides] = useState<ISliderItem[]>()
  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  // Autoplay effect with pause on hover
  useEffect(() => {
    if (!emblaApi || !isPlaying) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    const onInit = () => {
      setSlideCount(emblaApi.slideNodes().length)
    }

    emblaApi.on("init", onInit)
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onInit)

    onInit()
    onSelect()

    return () => {
      clearInterval(interval)
      emblaApi.off("select", onSelect)
      emblaApi.off("init", onInit)
      emblaApi.off("reInit", onInit)
    }
  }, [emblaApi, isPlaying])

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_BANNER
  }
  useEffect(() => {
    const getBanners = async () => {
      const res = await api.getTyped<
        "/shops/media/content?type=slider",
        ISliderApiResponse
      >("/shops/media/content?type=slider", {
        headers: {
          "shop-id": String(domain?.shop_id) ?? "",
        },
      })

      if (res.success) {
        setSlides(res.data)
      }
    }
    getBanners()
  }, [domain?.shop_id])
  return (
    <section
      className="relative w-full mb-8 group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* ================= Carousel ================= */}
      <div
        ref={emblaRef}
        className="overflow-hidden w-full rounded-xl shadow-lg
                   bg-white dark:bg-gray-900"
      >
        <div className="flex">
          {slides?.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] h-[400px] md:h-[500px] lg:h-[600px]"
            >
              <Image
                src={slide.image}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                onError={handleImageError}
                unoptimized={slide.image.startsWith("https")}
                className="object-cover transition-transform duration-700
                           group-hover:scale-105"
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= Arrows ================= */}
      {slideCount > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       bg-white/80 dark:bg-gray-800/80
                       hover:bg-white dark:hover:bg-gray-700
                       p-2 rounded-full shadow-lg
                       opacity-0 group-hover:opacity-100
                       transition z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       bg-white/80 dark:bg-gray-800/80
                       hover:bg-white dark:hover:bg-gray-700
                       p-2 rounded-full shadow-lg
                       opacity-0 group-hover:opacity-100
                       transition z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          </button>
        </>
      )}

      {/* ================= Pagination ================= */}
      {slideCount > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2
                        flex gap-3 z-10"
        >
          {slides?.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all
                ${
                  selectedIndex === index
                    ? "bg-white dark:bg-gray-200 border-white dark:border-gray-200 scale-125"
                    : "bg-white/50 dark:bg-gray-400/50 border-white/70 dark:border-gray-400"
                }`}
            />
          ))}
        </div>
      )}

      {/* ================= Play / Pause ================= */}
      {slideCount > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4
                     bg-black/50 dark:bg-white/20
                     hover:bg-black/70 dark:hover:bg-white/30
                     text-white p-2 rounded-full shadow-lg z-10"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      )}

      {/* ================= Progress Bar ================= */}
      {slideCount > 1 && isPlaying && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1
                        bg-white/30 dark:bg-gray-700"
        >
          <div
            className="h-full bg-white dark:bg-gray-300 transition-all duration-[5000ms]"
            style={{
              width: `${((selectedIndex + 1) / slideCount) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  )
}
