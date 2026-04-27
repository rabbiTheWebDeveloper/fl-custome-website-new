import React from "react"
import Link from "next/link"
import Image from "next/image"
import { getCategoriesData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"
import { ICategory } from "../types/categories"

const BG_FALLBACKS = ["bg-gray-900", "bg-[#d4c5b2]", "bg-[#e8ddd4]"]

export default async function CategoryGrid({ shopId }: { shopId: string }) {
  const cleanDomain = await getCleanDomain()
  const res = await getCategoriesData(cleanDomain, shopId)
  const categories = (res?.data as ICategory[]) || []

  if (categories.length === 0) return null

  // Take up to 3 categories to fit the 3-block layout
  const displayCategories = categories.slice(0, 3)

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
          {displayCategories.map((category, index) => {
            const isLarge = index === 0
            const bgFallback = BG_FALLBACKS[index % BG_FALLBACKS.length]
            const imgUrl =
              category.wp_category_image_url ||
              category.category_image ||
              category.image

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className={`relative overflow-hidden group block rounded-2xl sm:rounded-none ${
                  isLarge ? "row-span-2" : ""
                }`}
              >
                {/* Background image or fallback color */}
                {imgUrl ? (
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src={imgUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`absolute inset-0 ${bgFallback} transition-transform duration-700 group-hover:scale-105`}
                  />
                )}

                {/* Overlay gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isLarge
                      ? "from-black/70 via-black/20 to-transparent"
                      : "from-black/40 to-transparent"
                  }`}
                />

                {/* Text Content */}
                <div
                  className={`absolute text-white ${
                    isLarge
                      ? "bottom-4 sm:bottom-8 left-4 sm:left-6"
                      : "bottom-3 sm:bottom-4 left-3 sm:left-4"
                  }`}
                >
                  {isLarge && (
                    <p className="text-[9px] sm:text-xs tracking-widest uppercase text-white/70 mb-1 sm:mb-2">
                      Explore
                    </p>
                  )}
                  <h3
                    className={`font-serif font-normal leading-tight ${
                      isLarge
                        ? "text-base sm:text-3xl mb-0.5 sm:mb-1"
                        : "text-sm sm:text-xl"
                    }`}
                  >
                    {category.name}
                  </h3>
                  {isLarge && category.description && (
                    <p className="text-white/80 text-[10px] sm:text-xs italic hidden sm:block line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <p className="text-center mt-4 sm:mt-8 text-xs italic text-gray-500 tracking-wide font-serif">
          Precision. Poise. Patchee.
        </p>
      </div>
    </section>
  )
}
