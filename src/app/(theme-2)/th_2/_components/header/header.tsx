"use client"
import { CartPopover } from "../carts/cart-popover"
import Link from "next/link"
import { linkHrefs } from "../../_constants"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Image from "next/image"
import { api } from "@/lib/api-client"
import { ICategoriesApiResponse } from "../../types/categories"
import { useCategories } from "../../store/categories"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDomain } from "../../store/domain"
import { useSections } from "../../store/sections"
import { useGetCookie } from "cookies-next"
import { prepareDomain } from "@/lib/utils"
import { IShopResponse } from "../../types/shop"
import { ISectionsApiResponse } from "../../types/sections"
import { SearchInput } from "./search-input"
import { LanguageSelector } from "./language-selector"
import { MobileNav } from "./mobile-nav"

export const Header = () => {
  const t = useTranslations("Theme2.header")
  const tHeaderFooter = useTranslations("Theme2.headerFooter")
  const domain = useDomain((state) => state.domain)
  const setDomain = useDomain((state) => state.setDomain)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const categories = useCategories((state) => state.categories)
  const setCategories = useCategories((state) => state.setCategories)
  const setDomainAddress = useDomain((state) => state.setDomainAddress)
  const setSections = useSections((state) => state.setSections)
  const getCookie = useGetCookie()

  useEffect(() => {
    const getDomain = async () => {
      const res = await api.getTyped<
        "/shops/domain",
        { message: string; success: boolean; data: IShopResponse }
      >("/shops/domain", {
        headers: {
          domain: prepareDomain(window.location.href),
        },
      })
      if (res.message === "success") {
        setDomain(res.data)
        setDomainAddress(window.location.origin)

        // Fetch sections after domain loads
        const sectionsRes = await api.getTyped<
          "/customer/sections",
          ISectionsApiResponse
        >("/customer/sections", {
          headers: {
            domain: prepareDomain(window.location.href),
            "shop-id": String(res.data.shop_id),
          },
        })
        if (sectionsRes.success) {
          setSections(sectionsRes.data)
        }
      }
    }

    getDomain()
  }, [])

  useEffect(() => {
    const getCategories = async () => {
      const res = await api.getTyped<
        "/customer/categories",
        ICategoriesApiResponse
      >("/customer/categories", {
        headers: {
          domain: prepareDomain(window.location.href),
          "shop-id": String(domain?.shop_id) ?? "",
        },
      })
      setCategories(res)
    }
    if (domain?.shop_id) {
      getCategories()
    }
  }, [domain, setCategories])

  return (
    <header className="py-4 border-b bg-background border-b-[#E7E7E7] sticky top-0 z-40">
      <div className="flex items-center justify-between container">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link href="/" className="block">
            <div className="relative h-12 w-12 md:h-14 md:w-28 max-h-full overflow-hidden">
              <Image
                src={
                  domain?.shop_logo && domain.shop_logo.trim() !== ""
                    ? domain.shop_logo
                    : "/placeholder.png"
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
        <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 font-medium max-md:hidden">
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
                <div className="absolute top-full -left-[calc(50%+25px)] pt-2 z-50">
                  <div className="bg-white shadow-lg min-w-[250px] p-1 rounded-[12px] border">
                    <ScrollArea className="h-80">
                      {categories?.map((category, idx) => (
                        <Link
                          key={idx}
                          href={`/shop?category=${category.slug}`}
                          className="block rounded-[8px] px-3 py-2.5 text-sm hover:text-primary hover:bg-primary/10 transition-colors font-semibold"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="max-md:hidden">
            <LanguageSelector />
          </div>
          <SearchInput />
          <CartPopover />
        </div>
      </div>
    </header>
  )
}
