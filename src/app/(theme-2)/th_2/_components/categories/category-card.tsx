"use client"

import Image from "next/image"
import Link from "next/link"

// Default generic category placeholder image (SVG data URI)
const DEFAULT_CATEGORY_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)" rx="16" />
    <g transform="translate(400,380)" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
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
  const hasImage = image && image.trim() !== ""
  const displayImage = hasImage ? image : DEFAULT_CATEGORY_IMAGE

  return (
    <Link href={href} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-[4/3]">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            {...(!hasImage && { unoptimized: true })}
          />
        </div>
      </div>
      <p className="mt-2 text-center text-sm font-medium text-gray-700 line-clamp-1">
        {name}
      </p>
    </Link>
  )
}
