"use client"
import { CartPopover } from "../carts/cart-popover"
import Link from "next/link"
import { linkHrefs } from "../../_constants"
import { useTranslations } from "next-intl"
import { useState } from "react"
import Image from "next/image"
import { ChevronRight, X } from "lucide-react"
import { useCategories } from "../../store/categories"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDomain } from "../../store/domain"
import { SearchInput } from "./search-input"
import { LanguageSelector } from "./language-selector"
import { MobileNav } from "./mobile-nav"
import { IShopResponse } from "../../types/shop"

function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const t = useTranslations("Theme2.header")

  if (dismissed) return null

  return (
    <div className="bg-primary/70 text-primary-foreground text-center text-[10px] sm:text-xs py-0.5 px-2 relative">
      <span className="font-medium">{t("announcement")}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-primary-foreground/10 rounded-full transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

export const Header = ({
  initialDomain,
}: {
  initialDomain?: IShopResponse | null
}) => {
  const t = useTranslations("Theme2.header")
  const tHeaderFooter = useTranslations("Theme2.headerFooter")
  const storeDomain = useDomain((state) => state.domain)
  const domain = initialDomain ?? storeDomain
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null
  )
  const categories = useCategories((state) => state.categories)

  // Only show top-level categories (those without a parent_id)
  const topLevelCategories = categories?.filter((cat) => !cat.parent_id)

  // Get the hovered category's sub_categories
  const hoveredCategory = topLevelCategories?.find(
    (cat) => cat.id === hoveredCategoryId
  )
  const subCategories = hoveredCategory?.sub_categories ?? []

  return (
    <>
      <AnnouncementBar />
      <header className="py-1.5 border-b bg-background border-b-border sticky top-0 z-40">
        <div className="flex items-center justify-between container">
          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="block">
              <div className="relative h-8 w-8 md:h-9 md:w-20 max-h-full overflow-hidden">
                <Image
                  src={
                    domain?.shop_logo && domain.shop_logo.trim() !== ""
                      ? domain.shop_logo
                      : ""
                  }
                  alt={domain?.name || "Shop"}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation links (desktop only) */}
          <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-sm font-medium max-md:hidden">
            {linkHrefs.map((link, index) => (
              <li
                key={index}
                className="relative"
                onMouseEnter={() =>
                  link.key === "category" && setShowCategoryDropdown(true)
                }
                onMouseLeave={() =>
                  link.key === "category" && setShowCategoryDropdown(false)
                }
              >
                <Link
                  className="hover:text-primary transition-colors whitespace-nowrap"
                  href={link.href}
                >
                  {tHeaderFooter(link.key)}
                </Link>

                {link.key === "category" && showCategoryDropdown && (
                  <div className="absolute top-full -left-[calc(50%+25px)] pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex bg-background shadow-xl rounded-lg border">
                      <div className="min-w-[220px] p-1.5">
                        <ScrollArea className="h-72">
                          {topLevelCategories?.map((category) => (
                            <Link
                              key={category.id}
                              href={`/shop?category=${category.slug}`}
                              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                hoveredCategoryId === category.id
                                  ? "text-primary bg-primary/10"
                                  : "hover:text-primary hover:bg-primary/5"
                              }`}
                              onMouseEnter={() =>
                                setHoveredCategoryId(category.id)
                              }
                            >
                              <span>{category.name}</span>
                              {category.sub_categories?.length > 0 && (
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </Link>
                          ))}
                        </ScrollArea>
                      </div>

                      {subCategories.length > 0 && (
                        <div className="min-w-[220px] border-l p-1.5">
                          <ScrollArea className="h-72">
                            {subCategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/shop?category=${sub.slug}`}
                                className="block rounded-md px-2.5 py-1.5 text-xs hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <div className="max-md:hidden">
              <LanguageSelector />
            </div>
            <SearchInput />
            <CartPopover />
          </div>
        </div>
      </header>
    </>
  )
}
