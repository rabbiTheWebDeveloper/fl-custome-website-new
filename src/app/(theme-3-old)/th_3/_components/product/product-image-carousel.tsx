"use client"

import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

/**
 * Extracts a YouTube video ID from various URL formats or raw IDs.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/,
 * youtube.com/shorts/, youtube.com/live/, and raw 11-char video IDs.
 */
function getYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null
  // Unescape JSON-escaped slashes (API may return "https:\/\/...")
  const trimmed = url.trim().replace(/\\\//g, "/")
  if (!trimmed) return null

  // If it looks like a raw YouTube video ID (11 alphanumeric chars with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || null
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null
      }
      if (parsed.pathname.startsWith("/live/")) {
        return parsed.pathname.split("/live/")[1]?.split("/")[0] || null
      }
      return parsed.searchParams.get("v")
    }
  } catch {
    // not a valid URL — try regex fallback
  }

  // Regex fallback for partial / malformed URLs
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (match) return match[1]

  return null
}

type SlideItem =
  | { type: "image"; src: string }
  | { type: "video"; url: string; youtubeId: string }

export function ProductImageCarousel({
  images,
  videoUrls = [],
}: {
  images: string[]
  videoUrls?: string[]
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel()
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  // Ensure videoUrls is always an array (API may return null/string)
  const safeVideoUrls = Array.isArray(videoUrls) ? videoUrls : []

  // Build a unified slide list: images first, then videos
  const slides: SlideItem[] = [
    ...images
      .filter((img) => img && img.trim() !== "")
      .map((src): SlideItem => ({ type: "image", src })),
    ...safeVideoUrls
      .map((url): SlideItem | null => {
        const youtubeId = getYouTubeId(url)
        if (!youtubeId) return null
        return { type: "video", url, youtubeId }
      })
      .filter((v): v is SlideItem => v !== null),
  ]

  const onThumbClick = (index: number) => {
    if (!emblaMainApi || !emblaThumbsApi) return
    emblaMainApi.scrollTo(index)
  }

  const onSelect = () => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }

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
      {/* Main Viewport */}
      <div className="overflow-hidden rounded-3xl" ref={mainViewportRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.type === "image" ? slide.src : slide.youtubeId}
              className="relative min-w-0 flex-[0_0_100%] h-[200px] md:h-[500px] lg:h-[620px]"
            >
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-contain md:object-cover"
                  priority={index === 0}
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0`}
                  title={`Product video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="hidden md:block overflow-hidden" ref={thumbViewportRef}>
        <div className="flex gap-3">
          {slides.map((slide, index) => (
            <button
              key={
                slide.type === "image"
                  ? `thumb-${slide.src}`
                  : `thumb-${slide.youtubeId}`
              }
              onClick={() => onThumbClick(index)}
              className={cn(
                "relative min-w-0 flex-[0_0_20%] aspect-square rounded-xl overflow-hidden transition-all",
                "border-2 cursor-pointer",
                index === selectedIndex
                  ? "border-[#3BB77E] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              type="button"
            >
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-900">
                  <Image
                    src={`https://img.youtube.com/vi/${slide.youtubeId}/mqdefault.jpg`}
                    alt={`Video thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="size-6 text-white fill-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
