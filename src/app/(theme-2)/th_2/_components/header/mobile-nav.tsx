"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MenuIcon,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Globe2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { linkHrefs } from "../../_constants"
import { useCategories } from "../../store/categories"
import { useDomain } from "../../store/domain"

const localeMap: Record<
  string,
  { label: string; next: string; nextLabel: string }
> = {
  en: { label: "English", next: "bn", nextLabel: "বাংলা" },
  bn: { label: "বাংলা", next: "en", nextLabel: "English" },
}

export function MobileNav() {
  const tHeaderFooter = useTranslations("Theme2.headerFooter")
  const categories = useCategories((state) => state.categories)
  const domain = useDomain((state) => state.domain)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [expandedSubCategoryId, setExpandedSubCategoryId] = useState<
    number | null
  >(null)
  const [open, setOpen] = useState(false)

  // Only show top-level categories (those without a parent_id)
  const topLevelCategories = categories?.filter((cat) => !cat.parent_id)
  const locale = useLocale()
  const router = useRouter()
  const current = localeMap[locale] ?? localeMap.en

  const handleLanguageToggle = () => {
    setCookie("NEXT_LOCALE", current.next, {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    })
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden size-10"
          aria-label="Open menu"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-[300px] p-0">
        {/* Header with logo */}
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center">
            <Link href="/" className="block" onClick={() => setOpen(false)}>
              <div className="relative h-10 w-24 overflow-hidden">
                <Image
                  src={
                    domain?.shop_logo && domain.shop_logo.trim() !== ""
                      ? domain.shop_logo
                      : ""
                  }
                  alt={domain?.name || "Shop"}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation links */}
        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav className="flex flex-col py-2">
            {linkHrefs.map((link, index) => {
              if (link.key === "category") {
                return (
                  <div key={index}>
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] font-medium hover:bg-accent transition-colors"
                    >
                      <span>{tHeaderFooter(link.key)}</span>
                      {isCategoryOpen ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* Category submenu */}
                    {isCategoryOpen && (
                      <div className="bg-accent/50">
                        {topLevelCategories && topLevelCategories.length > 0 ? (
                          topLevelCategories.map((category) => (
                            <div key={category.id}>
                              <div className="flex items-center">
                                <SheetClose asChild>
                                  <Link
                                    href={`/shop?category=${category.slug}`}
                                    className="flex-1 block px-8 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                                  >
                                    {category.name}
                                  </Link>
                                </SheetClose>
                                {category.sub_categories?.length > 0 && (
                                  <button
                                    onClick={() =>
                                      setExpandedSubCategoryId(
                                        expandedSubCategoryId === category.id
                                          ? null
                                          : category.id
                                      )
                                    }
                                    className="px-3 py-2.5 text-muted-foreground hover:text-primary"
                                  >
                                    {expandedSubCategoryId === category.id ? (
                                      <ChevronDown className="size-3.5" />
                                    ) : (
                                      <ChevronRight className="size-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {/* Sub-categories */}
                              {expandedSubCategoryId === category.id &&
                                category.sub_categories?.length > 0 && (
                                  <div className="bg-accent/80">
                                    {category.sub_categories.map((sub) => (
                                      <SheetClose asChild key={sub.id}>
                                        <Link
                                          href={`/shop?category=${sub.slug}`}
                                          className="block px-12 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                                        >
                                          {sub.name}
                                        </Link>
                                      </SheetClose>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))
                        ) : (
                          <p className="px-8 py-2.5 text-sm text-muted-foreground">
                            No categories
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <SheetClose asChild key={index}>
                  <Link
                    href={link.href}
                    className="px-5 py-3.5 text-[15px] font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    {tHeaderFooter(link.key)}
                  </Link>
                </SheetClose>
              )
            })}

            {/* Language Switcher */}
            <div className="border-t mt-2 pt-2">
              <button
                onClick={handleLanguageToggle}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-[15px] font-medium hover:bg-accent hover:text-primary transition-colors"
              >
                <Globe2 className="size-5 text-muted-foreground" />
                <span>{current.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  → {current.nextLabel}
                </span>
              </button>
            </div>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
