"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

// Default generic category placeholder image (SVG data URI)
const DEFAULT_CATEGORY_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#bg)" />
    <g transform="translate(400,450)" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <rect x="-60" y="-50" width="120" height="90" rx="8" />
      <circle cx="0" cy="-10" r="20" />
      <path d="M-40 30 L-15 0 L10 20 L30 5 L50 30" />
    </g>
  </svg>`
)}`

interface CategoryCardProps {
  name: string
  image: string
  href: string
}

export const CategoryCard = ({ name, image, href }: CategoryCardProps) => {
  const t = useTranslations("Theme2.buttons")
  const hasImage = image && image.trim() !== ""
  const displayImage = hasImage ? image : DEFAULT_CATEGORY_IMAGE

  return (
    <Link href={href} className="group relative block">
      <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          {...(!hasImage && { unoptimized: true })}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-center">
          <h3 className="text-white text-2xl font-semibold mb-3">{name}</h3>
          <Button
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 md:text-base font-medium"
          >
            {t("shopNow")}
          </Button>
        </div>
      </div>
    </Link>
  )
}
