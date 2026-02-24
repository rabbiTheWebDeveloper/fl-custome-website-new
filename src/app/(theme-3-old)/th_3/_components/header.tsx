"use client"
import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  Menu,
  Search,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  X,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useDomain } from "../store/domain"
import { useCategories } from "../store/categories"
import { useGetCookie } from "cookies-next"
import { api } from "@/lib/api-client"
import { IShopResponse } from "../types/shop"
import { prepareDomain } from "@/lib/utils"
import { ICategoriesApiResponse, ICategory } from "../types/categories"
import { CartPopover } from "./carts/cart-popover"
import ThemeToggle from "./ThemeToggle"
import { LanguageSelector } from "@/app/(theme-2)/th_2/_components/header/language-selector"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { WhatsApp } from "@/app/(theme-2)/th_2/_components/ui/social-icons"

export default function Header() {
  const t = useTranslations("Theme3.header")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const domain = useDomain((state) => state.domain)
  const setDomain = useDomain((state) => state.setDomain)
  const categories: ICategory[] | null = useCategories(
    (state) => state.categories
  )
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const setCategories = useCategories((state) => state.setCategories)
  const setDomainAddress = useDomain((state) => state.setDomainAddress)
  const getCookie = useGetCookie()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns on click outside
  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".dropdown")) {
        setIsCategoriesOpen(false)
        setIsCartOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

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
        if (getCookie("domain") === undefined) {
          setDomain(res.data)
          setDomainAddress(window.location.origin)
          router.refresh()
        }
      }
    }

    getDomain()
  }, [getCookie, setDomain, setDomainAddress])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    setIsSearchOpen(false)
  }

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-0.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Phone size={12} className="text-[#3bb77e]" />
                <span>{domain?.phone || "+1 (555) 123-4567"}</span>
              </div>
              {domain?.whatsapp && (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <WhatsApp className="text-[#3bb77e]" />
                  <span>{domain?.whatsapp || "WhatsApp not available"}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300
          ${isScrolled ? "shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm" : "shadow-sm bg-white dark:bg-gray-900"}`}
      >
        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:block">
          {/* MAIN HEADER */}
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 group">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-[#3bb77e] transition-all">
                    <Image
                      src={domain?.shop_logo || "/placeholder.png"}
                      alt={domain?.name || "Logo"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-gray-900 dark:text-white">
                      {domain?.name || "Store Name"}
                    </h1>
                  </div>
                </div>
              </Link>

              {/* Search - Enhanced */}
              <form
                onSubmit={handleSearch}
                className="flex-1 max-w-2xl relative"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3bb77e] to-[#2d9c68] rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative flex rounded-full border-2 border-transparent bg-gradient-to-r from-[#3bb77e] to-[#2d9c68] p-0.5">
                    <div className="flex-1 flex rounded-full bg-white dark:bg-gray-800 overflow-hidden">
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchOpen(true)}
                        placeholder={t("search")}
                        className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <button
                        type="submit"
                        className="px-8 bg-gradient-to-r from-[#3bb77e] to-[#2d9c68] text-white font-medium hover:from-[#2d9c68] hover:to-[#3bb77e] transition-all flex items-center gap-2"
                      >
                        <Search size={20} />
                        <span className="hidden xl:inline">Search</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Suggestions */}
                {isSearchOpen && searchQuery && categories && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                      {t("popularCategories")}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {categories.slice(0, 5).map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(category.name)
                            router.push(`/shop?search=${category.name}`)
                          }}
                          className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#3bb77e] hover:text-white transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <CartPopover
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                />
              </div>
            </div>
          </div>

          {/* NAVIGATION BAR */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between">
                {/* Categories Dropdown */}
                <div className="relative" ref={categoriesDropdownRef}>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#3bb77e] to-[#2d9c68] text-white font-medium transition-all ${
                      isCategoriesOpen ? "rounded-t-lg" : "rounded-b-lg"
                    }`}
                  >
                    <Menu size={16} />
                    <span>{t("allCategories")}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Categories Mega Menu */}
                  {isCategoriesOpen && categories && (
                    <div
                      className="absolute top-full left-0 w-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      onMouseLeave={() => setIsCategoriesOpen(false)}
                    >
                      <div className="max-h-[350px] overflow-y-auto py-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              router.push(
                                `/shop?category=${encodeURIComponent(category.name)}&id=${category.id}`
                              )
                              setIsCategoriesOpen(false)
                            }}
                            onMouseEnter={() =>
                              setHoveredCategory(category.name)
                            }
                            className={`
          w-full text-left px-3 py-1.5 transition-all duration-200
          flex items-center justify-between group text-sm
          ${
            hoveredCategory === category.name
              ? "bg-[#3bb77e] text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`
            w-6 h-6 rounded-md flex items-center justify-center
            ${
              hoveredCategory === category.name
                ? "bg-white/20"
                : "bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20"
            }
          `}
                              >
                                {category.image ? (
                                  <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={18}
                                    height={18}
                                    className="object-contain"
                                  />
                                ) : (
                                  <span className="text-xs font-bold">
                                    {category.name.charAt(0)}
                                  </span>
                                )}
                              </div>

                              <span className="font-medium">
                                {category.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1">
                  {[
                    { href: "/", label: t("home") },
                    { href: "/shop", label: t("shop") },
                    { href: "/about", label: t("about") },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#3bb77e] transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Contact Info */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#3bb77e]/10 flex items-center justify-center">
                      <Phone size={16} className="text-[#3bb77e]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t("support")}
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {domain?.phone || "24/7 Support"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src={domain?.shop_logo || "/placeholder.png"}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {domain?.name || "Store"}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Search size={20} />
              </button>
              <CartPopover
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <form
              onSubmit={handleSearch}
              className="p-4 border-b dark:border-gray-800"
            >
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search")}
                  className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3bb77e] text-white rounded-lg"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="p-4 space-y-2 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
              <div className="border-t dark:border-gray-800 my-2 pt-2">
                <Link
                  href={`/`}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href={`/shop`}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href={`/about`}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4 mt-2 border-t dark:border-gray-800">
                <Facebook className="text-gray-600 dark:text-gray-400 hover:text-[#3bb77e] cursor-pointer" />
                <Instagram className="text-gray-600 dark:text-gray-400 hover:text-[#3bb77e] cursor-pointer" />
                <Youtube className="text-gray-600 dark:text-gray-400 hover:text-[#3bb77e] cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
