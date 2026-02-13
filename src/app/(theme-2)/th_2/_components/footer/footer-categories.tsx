"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useCategories } from "../../store/categories"

const VISIBLE_COUNT = 2

export function FooterCategories() {
  const t = useTranslations("Theme2.footer")
  const categories = useCategories((state) => state.categories)
  const [showOthers, setShowOthers] = useState(false)

  if (!categories || categories.length === 0) {
    return (
      <div>
        <h4 className="font-bold text-[#595959] mb-4 uppercase">
          {t("categories")}
        </h4>
        <p className="text-sm text-muted-foreground">No categories</p>
      </div>
    )
  }

  const visibleCategories = categories.slice(0, VISIBLE_COUNT)
  const remainingCategories = categories.slice(VISIBLE_COUNT)

  return (
    <div>
      <h4 className="font-bold text-[#595959] mb-4 uppercase">
        {t("categories")}
      </h4>
      <ul className="space-y-4">
        {visibleCategories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          </li>
        ))}

        {remainingCategories.length > 0 && (
          <li
            className="relative"
            onMouseEnter={() => setShowOthers(true)}
            onMouseLeave={() => setShowOthers(false)}
          >
            <button className="hover:text-primary transition-colors cursor-pointer">
              {t("others")} ({remainingCategories.length})
            </button>

            {showOthers && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <div className="bg-white shadow-lg min-w-[200px] p-1 rounded-[12px] border">
                  <ul className="max-h-60 overflow-y-auto">
                    {remainingCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/shop?category=${category.slug}`}
                          className="block rounded-[8px] px-3 py-2.5 text-sm hover:text-primary hover:bg-primary/10 transition-colors font-medium"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  )
}
