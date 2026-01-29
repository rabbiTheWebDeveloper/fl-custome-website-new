"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useDomain } from "../../store/domain"
import { ISliderApiResponse, ISliderItem } from "../../types/slides"
import { api } from "@/lib/api-client"

export const Banner = () => {
  const t = useTranslations("Theme2.banner")
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const domain = useDomain((state) => state.domain)
  const [slides, setSlides] = useState<ISliderItem[]>()
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
    <div className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides?.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-0 flex-[0_0_100%] h-[600px] md:h-[800px]"
            >
              {/* <Image src={slide.image} alt="ss" height={140} width={140} /> */}
              {slide.image}
              asdfsadfsd
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    slide.image && slide.image.trim() !== ""
                      ? `url('${slide.image}')`
                      : undefined,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              {/* Content */}
              <div className="relative h-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl mx-auto leading-[150%]">
                    {slide.shop_id}
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    {slide.shop_id}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="px-8 py-6 text-lg rounded-md"
                  >
                    <Link href={slide.link}>{slide.link}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides?.map((_slide, index) => (
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
