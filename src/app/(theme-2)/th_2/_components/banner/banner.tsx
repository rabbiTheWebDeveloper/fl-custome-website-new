"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "../ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDomain } from "../../store/domain"
import type { ThemeSettingsBannerSlide } from "../../types/shop"
import WebsiteTraffic from "@/app/(theme-3-old)/th_3/_components/website-traffic"

export const Banner = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayPlugin.current,
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const domain = useDomain((state) => state.domain)
  const slides = (domain?.theme_settings?.banner_slides ?? []).filter((s) =>
    s.image?.trim()
  )

  useEffect(() => {
    if (!emblaApi) return

    const updateIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", updateIndex)
    emblaApi.on("reInit", updateIndex)

    return () => {
      emblaApi.off("select", updateIndex)
      emblaApi.off("reInit", updateIndex)
    }
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext()
  }, [emblaApi])

  if (slides.length === 0) {
    return (
      <Link href="/shop" className="block">
        <img
          src="/default-banner.png"
          alt="Welcome! Happy Shopping!"
          className="w-full h-auto object-cover"
        />
      </Link>
    )
  }
  console.log("domain", domain)
  return (
    <div className="relative overflow-hidden group/banner">
      {domain?.shop_id && <WebsiteTraffic shopId={domain.shop_id} />}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <BannerSlide key={index} slide={slide} />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2.5 transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5 md:size-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2.5 transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5 md:size-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75 w-2.5"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function BannerSlide({ slide }: { slide: ThemeSettingsBannerSlide }) {
  const router = useRouter()
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const hasImage = !!slide.image
  const hasTitle = !!slide.image_title?.trim()
  const hasSubtitle = !!slide.image_subtitle?.trim()
  const hasButton = !!(slide.button_text?.trim() && slide.button_link?.trim())
  const hasImageLink = !!slide.image_link?.trim()
  const hasImageText = !!slide.image_text?.trim()

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!hasImageLink) return

    // If the click originated from the button area, don't navigate
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest("a")) return

    // Only navigate if pointer didn't move much (not a drag/swipe)
    if (pointerStart.current) {
      const dx = Math.abs(e.clientX - pointerStart.current.x)
      const dy = Math.abs(e.clientY - pointerStart.current.y)
      if (dx > 5 || dy > 5) return
    }

    // Check if it's an external URL
    const link = slide.image_link
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer")
    } else {
      router.push(link)
    }
  }

  return (
    <div
      className="relative min-w-0 flex-[0_0_100%] h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px]"
      style={{ cursor: hasImageLink ? "pointer" : undefined }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {hasImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        <div className="container mx-auto px-4 text-center text-white">
          {hasTitle && (
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4 max-w-2xl mx-auto leading-[140%]">
              {slide.image_title}
            </h1>
          )}
          {hasSubtitle && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 max-w-2xl mx-auto opacity-90">
              {slide.image_subtitle}
            </p>
          )}
          {hasImageText && !hasTitle && !hasSubtitle && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 max-w-2xl mx-auto opacity-90">
              {slide.image_text}
            </p>
          )}
          {hasButton && (
            <Button
              asChild
              size="lg"
              className="px-5 py-3 text-sm sm:px-8 sm:py-6 sm:text-lg rounded-md pointer-events-auto relative z-20"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Link
                href={slide.button_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {slide.button_text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
