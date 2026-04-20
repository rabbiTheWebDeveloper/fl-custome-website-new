"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ICategory } from "../../types/categories"

export default function SidebarCategory({
  categories,
  activeCategoryId,
  onCategorySelect,
}: {
  categories: ICategory[]
  activeCategoryId: number | null
  onCategorySelect?: () => void
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Categories
      </h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/shop"
            onClick={onCategorySelect}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeCategoryId === null
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="font-medium">All Products</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/shop?category=${encodeURIComponent(cat.name)}&id=${cat.id}`}
              onClick={onCategorySelect}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeCategoryId === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
              }`}
            >
              {cat.image ? (
                <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-400 flex-shrink-0">
                  {cat.name.charAt(0)}
                </div>
              )}
              <span className="text-sm truncate">{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
