"use client"
import { SearchIcon } from "lucide-react"
import { Button } from "../ui/button"
import { CartPopover } from "../carts/cart-popover"
import Link from "next/link"
import { linkHrefs } from "../../_constants"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useDomain } from "../../store/domain"
import { IShopResponse } from "@/app/theme_2/types/shop"
import Image from "next/image"
import { api } from "@/lib/api-client"

// TODO: Remove this fake data in production - replace with proper data from API/database
const categoryDropdownItems = [
  { name: "Shirt", href: "/categories/shirt" },
  { name: "T-shirt", href: "/categories/tshirt" },
  { name: "Hoodie", href: "/categories/hoodie" },
  { name: "Pant", href: "/categories/pant" },
  { name: "Shorts", href: "/categories/shorts" },
  { name: "Jacket", href: "/categories/jacket" },
  { name: "Sweater", href: "/categories/sweater" },
]

export const Header = () => {
  const t = useTranslations("Theme2.header")
  const tHeaderFooter = useTranslations("Theme2.headerFooter")
  const domain = useDomain((state) => state.domain)
  const setDomain = useDomain((state) => state.setDomain)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const prepareDomain = (domain: string) => {
    if (domain === "http://localhost:3000/") {
      return "fldemo.store"
    }
    return domain
  }

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
      console.log(res.data)
      if (res.message === "success") {
        setDomain(res.data)
      }
    }
    getDomain()
    console.log(window.location.href, domain)
  }, [])
  console.log(domain)
  return (
    <header className="py-4 border-b bg-background border-b-[#E7E7E7] sticky top-0 z-40">
      <div className="flex items-center justify-between container">
        <ul className="flex items-center gap-5 font-medium max-md:hidden">
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
                className="hover:text-primary transition-colors"
                href={link.href}
              >
                {tHeaderFooter(link.key)}
              </Link>

              {link.key === "category" && showCategoryDropdown && (
                <div className="absolute top-full -left-[calc(50%+25px)] pt-2 z-50">
                  <div className="bg-white shadow-lg min-w-[250px] p-1 rounded-[12px] border">
                    {categoryDropdownItems.map((category, idx) => (
                      <Link
                        key={idx}
                        href={category.href}
                        className="block rounded-[8px] px-3 py-2.5 text-sm hover:text-primary hover:bg-primary/10 transition-colors font-semibold"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/" className="relative block h-12 w-12">
            <Image
              src={domain?.shop_logo || "/placeholder.png"}
              alt="My Insta"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="secondary" size="icon" className="size-10.5">
            <span className="sr-only">{t("search")}</span>
            <SearchIcon className="size-6" />
          </Button>
          <CartPopover />
        </div>
      </div>
    </header>
  )
}
