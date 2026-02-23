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
        <h4 className="font-bold text-muted-foreground mb-5 uppercase text-sm tracking-wide">
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
      <h4 className="font-bold text-muted-foreground mb-5 uppercase text-sm tracking-wide">
        {t("categories")}
      </h4>
      <ul className="space-y-3">
        {visibleCategories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
                <div className="bg-background shadow-lg min-w-[200px] p-1 rounded-xl border">
                  <ul className="max-h-60 overflow-y-auto">
                    {remainingCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/shop?category=${category.slug}`}
                          className="block rounded-lg px-3 py-2.5 text-sm hover:text-primary hover:bg-primary/5 transition-colors font-medium"
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
