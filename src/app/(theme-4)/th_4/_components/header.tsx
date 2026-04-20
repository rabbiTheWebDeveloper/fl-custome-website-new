"use client"
import { useState, useEffect } from "react"
import { Menu, Search, X, ShoppingBag, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useDomain } from "../store/domain"
import { useCategories } from "../store/categories"
import { api } from "@/lib/api-client"
import { IShopResponse } from "../types/shop"
import { CartPopover } from "./carts/cart-popover"
import { useRouter, usePathname } from "next/navigation"
import { IProductsApiResponse, IProduct } from "../types/product"
import ThemeToggle from "./ThemeToggle"

export default function Header({
  initialDomain,
}: {
  initialDomain?: IShopResponse | null
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchProducts, setSearchProducts] = useState<IProduct[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false)

  const storeDomain = useDomain((state) => state.domain)
  const domain = initialDomain ?? storeDomain
  const categories = useCategories((state) => state.categories)
  const router = useRouter()
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    const t = setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsSearchOpen(false)
    }, 0)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!domain?.shop_id || searchQuery.trim().length < 2) {
      const wait = setTimeout(() => setSearchProducts([]), 0)
      return () => clearTimeout(wait)
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get<IProductsApiResponse>(
          `/customer/product-search?search=${searchQuery}`,
          { headers: { "shop-id": String(domain.shop_id) } }
        )
        setSearchProducts(res.data?.data || [])
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [searchQuery, domain?.shop_id])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    setIsSearchOpen(false)
  }

  // Remove scroll on body when modal open
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isSearchOpen, isMobileMenuOpen])

  return (
    <>
      {/* Absolute container so it hovers over the page, not pushing content down */}
      <div className="fixed top-0 inset-x-0 z-50 pt-4 px-4 pointer-events-none flex justify-center">
        {/* Floating Glass Pill Header */}
        <header
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            flex items-center justify-between px-6 py-3 w-full max-w-6xl
            rounded-full border shadow-2xl backdrop-blur-2xl
            ${
              isScrolled
                ? "bg-white/70 dark:bg-black/70 border-gray-200/50 dark:border-white/10 shadow-black/10 dark:shadow-white/5 py-3"
                : "bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/5 shadow-transparent py-4"
            }
          `}
        >
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Menu size={22} className="text-gray-900 dark:text-white" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {domain?.shop_logo ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
                <Image
                  src={domain.shop_logo}
                  alt={domain?.name || "Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                <ShoppingBag size={14} className="text-white dark:text-black" />
              </div>
            )}
            <span className="font-bold tracking-tighter text-lg text-gray-900 dark:text-white hidden sm:block">
              {domain?.name || "Premium."}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative group h-full"
              onMouseEnter={() => setIsCategoriesHovered(true)}
              onMouseLeave={() => setIsCategoriesHovered(false)}
            >
              <Link
                href="/shop"
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                Categories
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCategoriesHovered ? "rotate-180" : ""}`}
                />
              </Link>

              {/* Floating Mega Menu Container */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-[22px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCategoriesHovered
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-4 invisible"
                }`}
              >
                {/* Visual Connector to prevent hover gap */}
                <div className="absolute top-0 inset-x-0 h-[22px] bg-transparent" />

                <div className="w-[600px] bg-white/95 dark:bg-black/95 backdrop-blur-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/10 rounded-[2rem] p-8 flex flex-col gap-6">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-500">
                    Shop by Category
                  </h3>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {categories?.slice(0, 9).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}&id=${cat.id}`}
                        className="flex items-center gap-3 group/cat p-2 -mx-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        {cat.image ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-transparent group-hover/cat:border-gray-200 dark:group-hover/cat:border-zinc-700 transition-colors relative flex-shrink-0">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              className="object-contain p-2.5 group-hover/cat:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-400 flex-shrink-0 group-hover/cat:text-black dark:group-hover/cat:text-white transition-colors">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover/cat:text-primary transition-colors line-clamp-2 leading-tight">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 my-2" />

                  <div className="text-center w-full">
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-semibold rounded-full text-gray-900 dark:text-white transition-colors w-full group"
                    >
                      View All Products{" "}
                      <span className="group-hover:translate-x-1 transition-transform ml-2">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm shadow-transparent"
            >
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
            >
              <Search size={20} />
            </button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            {/* The Cart Popover component requires some custom styling outside to fit the pill, 
                but we'll mount it cleanly here. */}
            <div className="relative">
              <CartPopover
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>
          </div>
        </header>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col pt-32 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-3xl mx-auto flex flex-col gap-12">
            <form onSubmit={handleSearch} className="relative group">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 pb-4 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-zinc-800 focus:border-black dark:focus:border-white transition-colors"
              />
            </form>

            {searchProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
                {searchProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.ulid}?${p.slug}`}
                    className="group/item flex flex-col gap-3"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <div className="relative aspect-[4/5] rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-transparent group-hover/item:border-gray-200 dark:group-hover/item:border-zinc-700 overflow-hidden transition-all duration-300">
                      {p.main_image && (
                        <Image
                          src={p.main_image}
                          alt={p.product_name}
                          fill
                          className="object-contain p-4 group-hover/item:scale-110 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white tracking-tight line-clamp-1">
                        {p.product_name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        ৳ {p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Full-Screen Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-black p-6 flex flex-col animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between mb-12">
            <span className="font-bold text-2xl tracking-tighter dark:text-white">
              Menu.
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-gray-100 dark:bg-zinc-900 rounded-full"
            >
              <X size={20} className="dark:text-white" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-4xl font-bold tracking-tight">
            <Link
              href="/"
              className="text-gray-400 hover:text-black dark:text-zinc-600 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-400 hover:text-black dark:text-zinc-600 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              href="/about"
              className="text-gray-400 hover:text-black dark:text-zinc-600 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </nav>

          <div className="mt-12 flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Collections
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {categories?.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.name)}&id=${
                    cat.id
                  }`}
                  className="p-4 rounded-3xl bg-gray-50 dark:bg-zinc-900 flex flex-col items-center gap-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.image && (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="font-medium text-sm dark:text-white">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto pb-8 pt-8 flex justify-between items-center border-t border-gray-100 dark:border-zinc-900">
            <ThemeToggle />
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {domain?.name}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
