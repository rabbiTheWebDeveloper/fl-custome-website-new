"use client"

import Link from "next/link"
import { useState } from "react"
import { ICategory } from "../../types/categories"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryNavigationProps {
  categories: ICategory[]
  onCategorySelect?: (categoryId: number | null) => void
  selectedCategoryId?: number | null
}

export function CategoryNavigation({
  categories,
  onCategorySelect,
  selectedCategoryId,
}: CategoryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const firstThree = categories.slice(0, 3)
  const rest = categories.slice(3)

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLElement>,
    categoryId: number | null
  ) => {
    e.preventDefault()

    if (onCategorySelect) {
      onCategorySelect(categoryId)
    }
  }

  return (
    <ul className="flex items-center gap-8 overflow-x-auto [&>li]:text-nowrap">
      <li
        className={`text-xl md:text-3xl font-semibold ${
          selectedCategoryId === null
            ? "text-foreground"
            : "text-[#ACACAC] hover:text-primary transition-colors"
        }`}
      >
        {onCategorySelect ? (
          <button
            type="button"
            onClick={(e) => handleCategoryClick(e, null)}
            className="cursor-pointer"
          >
            All Products
          </button>
        ) : (
          <Link href="/shop">All Products</Link>
        )}
      </li>
      {firstThree.map((category) => (
        <li
          key={category.id}
          className={`text-xl md:text-3xl font-semibold ${
            selectedCategoryId === category.id
              ? "text-foreground"
              : "text-[#ACACAC] hover:text-primary transition-colors"
          }`}
        >
          {onCategorySelect ? (
            <button
              type="button"
              onClick={(e) => handleCategoryClick(e, category.id)}
              className="cursor-pointer"
            >
              {category.name}
            </button>
          ) : (
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          )}
        </li>
      ))}
      {rest.length > 0 && (
        <li className="text-xl md:text-3xl font-semibold text-[#ACACAC]">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hover:text-primary transition-colors cursor-pointer"
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(!isOpen)}
              >
                Others
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-4"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              align="start"
            >
              <h3 className="font-semibold mb-3 text-sm">More Categories</h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {rest.map((category) => (
                    <div key={category.id}>
                      {onCategorySelect ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            handleCategoryClick(e, category.id)
                            setIsOpen(false)
                          }}
                          className="w-full text-left block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          {category.name}
                        </button>
                      ) : (
                        <Link
                          href={`/categories/${category.slug}`}
                          className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </li>
      )}
    </ul>
  )
}
