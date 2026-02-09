"use client"
import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Menu,
  Search,
  Home,
  Store,
  User,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  X,
  Menu as MenuIcon,
  ChevronRight,
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
import { useCartStore } from "@/lib/cart"
import ThemeToggle from "./ThemeToggle"
import { LanguageSelector } from "@/app/(theme-2)/th_2/_components/header/language-selector"
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const domain = useDomain((state) => state.domain)
  const setDomain = useDomain((state) => state.setDomain)
  const categories: ICategory[] | null = useCategories(
    (state) => state.categories
  )
  const totals = useCartStore((state) => state.totals)

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

  // Search suggestions
  const searchSuggestions = [
    "Wireless Headphones",
    "Smart Watch",
    "Laptop",
    "Smartphone",
    "Running Shoes",
    "Winter Jacket",
    "Gaming Keyboard",
    "Coffee Maker",
  ]
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
  const totalProducts = totals?.itemCount
  return (
    <>
      {/* ================= MAIN HEADER ================= */}
      <header
        className={`sticky top-0 z-50 transition-all
      ${isScrolled ? "shadow-lg" : "shadow-sm"}
      bg-white dark:bg-gray-900`}
      >
        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:block">
          {/* TOP BAR */}
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src={domain?.shop_logo || "/placeholder.png"}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {domain?.name || "ShopHub"}
              </h1>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="flex rounded-full border-2 border-[#3bb77e]
                            bg-white dark:bg-gray-800 overflow-hidden">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
                  placeholder="Search products..."
                  className="flex-1 px-6 py-3 bg-transparent outline-none
                           text-gray-900 dark:text-white
                           placeholder-gray-400"
                />
                <button className="px-6 bg-[#3bb77e] text-white">
                  <Search size={20} />
                </button>
              </div>

              {isSearchOpen && searchQuery && (
                <div className="absolute top-full mt-2 w-full
                              bg-white dark:bg-gray-800
                              border border-gray-200 dark:border-gray-700
                              rounded-xl shadow-xl p-4 z-50">
                  <h3 className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                    Popular Searches
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {searchSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(s)}
                        className="px-3 py-1.5 rounded-full text-sm
                                 bg-gray-100 dark:bg-gray-700
                                 text-gray-900 dark:text-white
                                 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggle />
              <CartPopover
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>
          </div>

          {/* NAV BAR */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
              {/* Categories */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-2 px-6 py-3
                           bg-[#3bb77e] text-white rounded-lg"
                >
                  <Menu size={18} />
                  All Categories
                  <ChevronDown size={16} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full mt-2 w-[700px]
                                bg-white dark:bg-gray-800
                                border dark:border-gray-700
                                rounded-xl shadow-xl p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {categories?.map((c: any) => (
                        <Link
                          key={c.id}
                          href={`/category/${c.id}`}
                          className="flex justify-between items-center p-3
                                   hover:bg-gray-50 dark:hover:bg-gray-700
                                   rounded-lg text-gray-900 dark:text-white"
                        >
                          {c.name}
                          <ChevronRight size={18} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              <nav className="flex gap-8">
                <Link
                  href="/"
                  className="text-gray-700 dark:text-gray-300
                             hover:text-green-600 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                   className="text-gray-700 dark:text-gray-300
                             hover:text-green-600 font-medium"
                >
                  Shop
                </Link>

                <Link
                  href="/about"
                  className="text-gray-700 dark:text-gray-300
                             hover:text-green-600 font-medium"
                >
                  About Us
                </Link>
               
              </nav>

              {/* Support */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    24/7 Support
                  </div>
                  <div className="text-sm text-gray-500">
                    {domain?.phone}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Facebook className="text-gray-600 dark:text-gray-400" />
                  <Instagram className="text-gray-600 dark:text-gray-400" />
                  <Youtube className="text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <span className="font-bold text-gray-900 dark:text-white">
              {domain?.name}
            </span>
            <ShoppingCart />
          </div>

          {isMobileMenuOpen && (
            <div className="p-4 space-y-2">
              {["Home", "Shop", "About Us"].map((item) => (
                <Link
                  key={item}
                  href="/"
                  className="block p-3 rounded-lg
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           text-gray-900 dark:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  )
}
