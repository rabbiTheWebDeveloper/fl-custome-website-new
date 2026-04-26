import React from "react"
import Link from "next/link"

const CATEGORIES = [
  {
    id: 1,
    title: "Backpack Series",
    subtitle: "Timeless. Bold. Unstoppable.",
    href: "/shop",
    bgClass: "bg-gray-900",
    size: "large",
  },
  {
    id: 2,
    title: "Shoulder Bags",
    subtitle: "Effortless everyday style",
    href: "/shop",
    bgClass: "bg-[#d4c5b2]",
    size: "small",
  },
  {
    id: 3,
    title: "Handbags",
    subtitle: "Precision. Poise. Patchee.",
    href: "/shop",
    bgClass: "bg-[#e8ddd4]",
    size: "small",
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-6 sm:py-14 bg-[#f8f4f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-gray-700">
            Categories
          </h2>
          <Link
            href="/shop"
            className="text-[11px] text-gray-500 hover:text-black font-medium"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 min-h-[280px] sm:min-h-[520px]">
          {/* Large left card */}
          <Link
            href={CATEGORIES[0].href}
            className="row-span-2 relative overflow-hidden group block rounded-2xl sm:rounded-none"
          >
            <div
              className={`absolute inset-0 ${CATEGORIES[0].bgClass} transition-transform duration-700 group-hover:scale-105`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-6 text-white">
              <p className="text-[9px] sm:text-xs tracking-widest uppercase text-white/70 mb-1 sm:mb-2">
                Explore
              </p>
              <h3 className="text-base sm:text-3xl font-serif font-normal leading-snug mb-0.5 sm:mb-1">
                {CATEGORIES[0].title}
              </h3>
              <p className="text-white/80 text-[10px] sm:text-xs italic hidden sm:block">
                {CATEGORIES[0].subtitle}
              </p>
            </div>
          </Link>

          {/* Top-right */}
          <Link
            href={CATEGORIES[1].href}
            className="relative overflow-hidden group block rounded-2xl sm:rounded-none"
          >
            <div
              className={`absolute inset-0 ${CATEGORIES[1].bgClass} transition-transform duration-700 group-hover:scale-105`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-sm sm:text-xl font-serif font-normal leading-tight">
                {CATEGORIES[1].title}
              </h3>
            </div>
          </Link>

          {/* Bottom-right */}
          <Link
            href={CATEGORIES[2].href}
            className="relative overflow-hidden group block rounded-2xl sm:rounded-none"
          >
            <div
              className={`absolute inset-0 ${CATEGORIES[2].bgClass} transition-transform duration-700 group-hover:scale-105`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-black/80">
              <h3 className="text-sm sm:text-xl font-serif font-normal leading-tight">
                {CATEGORIES[2].title}
              </h3>
            </div>
          </Link>
        </div>

        <p className="text-center mt-4 sm:mt-8 text-xs italic text-gray-500 tracking-wide font-serif">
          Precision. Poise. Patchee.
        </p>
      </div>
    </section>
  )
}
