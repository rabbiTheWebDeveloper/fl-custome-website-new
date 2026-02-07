"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useDomain } from "../../store/domain"
import type { ThemeSettingsBannerSlide } from "../../types/shop"

export const Banner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
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

  if (slides.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <BannerSlide key={index} slide={slide} />
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
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
  const hasImage = !!slide.image
  const hasTitle = !!slide.image_title?.trim()
  const hasSubtitle = !!slide.image_subtitle?.trim()
  const hasButton = !!(slide.button_text?.trim() && slide.button_link?.trim())
  const hasImageLink = !!slide.image_link?.trim()
  const hasImageText = !!slide.image_text?.trim()

  const backgroundContent = (
    <>
      {hasImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
    </>
  )

  return (
    <div className="relative min-w-0 flex-[0_0_100%] h-[600px] md:h-[800px]">
      {hasImageLink ? (
        <Link href={slide.image_link} className="absolute inset-0 z-0 block">
          {backgroundContent}
        </Link>
      ) : (
        backgroundContent
      )}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          {hasTitle && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl mx-auto leading-[150%]">
              {slide.image_title}
            </h1>
          )}
          {hasSubtitle && (
            <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {slide.image_subtitle}
            </p>
          )}
          {hasImageText && !hasTitle && !hasSubtitle && (
            <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {slide.image_text}
            </p>
          )}
          {hasButton && (
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-md">
              <Link href={slide.button_link}>{slide.button_text}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
