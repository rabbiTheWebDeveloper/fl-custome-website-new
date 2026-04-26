"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Menu,
  Search,
  X,
  ChevronDown,
  User,
  Home,
  ShoppingBag,
  Heart,
  Grid3X3,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useDomain } from "@/app/(theme-4)/th_4/store/domain"
import { useCategories } from "@/app/(theme-4)/th_4/store/categories"
import { api } from "@/lib/api-client"
import { IShopResponse } from "@/app/(theme-4)/th_4/types/shop"
import { CartPopover } from "@/app/(theme-4)/th_4/_components/carts/cart-popover"
import { useRouter, usePathname } from "next/navigation"
import {
  IProductsApiResponse,
  IProduct,
} from "@/app/(theme-4)/th_4/types/product"
import CountdownBar from "./countdown-bar"
import AnnouncementBar from "./announcement-bar"

const NAV_LINKS = [
  { label: "Bags", href: "/shop?category=Bags" },
  { label: "Shoes", href: "/shop?category=Shoes" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Sale", href: "/shop?sale=1" },
  { label: "New Arrivals", href: "/shop?sort=new" },
  { label: "Prime Bags", href: "/shop?tag=prime-bags" },
  { label: "Prime Shoes", href: "/shop?tag=prime-shoes" },
  { label: "Track my Order", href: "/track" },
]

const BOTTOM_NAV = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Grid3X3, label: "Shop", href: "/shop" },
  { icon: Search, label: "Search", href: "#search" },
  { icon: Heart, label: "Saved", href: "/wishlist" },
  { icon: ShoppingBag, label: "Cart", href: "#cart" },
]

export default function Th5Header({
  initialDomain,
}: {
  initialDomain?: IShopResponse | null
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopByOpen, setShopByOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchProducts, setSearchProducts] = useState<IProduct[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const storeDomain = useDomain((s) => s.domain)
  const domain = initialDomain ?? storeDomain
  const categories = useCategories((s) => s.categories)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => {
      setMobileOpen(false)
      setSearchOpen(false)
    }, 0)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = searchOpen || mobileOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [searchOpen, mobileOpen])

  useEffect(() => {
    if (!domain?.shop_id || searchQuery.trim().length < 2) {
      const clear = setTimeout(() => setSearchProducts([]), 0)
      return () => clearTimeout(clear)
    }
    const t = setTimeout(async () => {
      try {
        const res = await api.get<IProductsApiResponse>(
          `/customer/product-search?search=${searchQuery}`,
          { headers: { "shop-id": String(domain.shop_id) } }
        )
        setSearchProducts(res.data?.data || [])
      } catch {
        /* silent */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery, domain?.shop_id])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!searchQuery.trim()) return
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
    },
    [searchQuery, router]
  )

  return (
    <>
      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <CountdownBar />
        <div className="hidden sm:block">
          <AnnouncementBar />
        </div>

        <div className="relative flex items-center justify-between px-3 sm:px-4 lg:px-6 h-12 sm:h-14 max-w-[1440px] mx-auto">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2.5 -ml-1 text-gray-700 touch-manipulation"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mr-4 flex flex-col items-center sm:items-start shrink-0"
          >
            {domain?.shop_logo ? (
              <div className="relative h-8 w-20">
                <Image
                  src={domain.shop_logo}
                  alt={domain?.name || "Logo"}
                  fill
                  className="object-contain object-center sm:object-left"
                  priority
                />
              </div>
            ) : (
              <>
                <span
                  className="font-black tracking-tight leading-none text-black"
                  style={{ fontSize: "18px" }}
                >
                  {domain?.name?.toUpperCase() || "PATCHEE"}
                </span>
                <span className="text-[8px] tracking-[0.15em] text-gray-500 uppercase leading-tight mt-0.5">
                  Own It. Lead It.
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0 flex-1 min-w-0">
            <div
              className="relative"
              onMouseEnter={() => setShopByOpen(true)}
              onMouseLeave={() => setShopByOpen(false)}
            >
              <button className="flex items-center gap-1 px-2 py-4 text-[11px] xl:text-sm font-medium text-[#c8922a] whitespace-nowrap">
                Shop By Concern
                <ChevronDown
                  size={12}
                  className={`transition-transform ${shopByOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl transition-all duration-200 ${shopByOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="py-2">
                  {categories?.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${encodeURIComponent(cat.name)}&id=${cat.id}`}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                      onClick={() => setShopByOpen(false)}
                    >
                      {cat.image && (
                        <div className="w-6 h-6 relative shrink-0">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/shop"
                      className="block px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-2 py-4 text-[11px] xl:text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center ml-auto lg:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex p-2.5 text-gray-700 hover:text-black touch-manipulation"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              href="/account"
              className="p-2.5 text-gray-700 hover:text-black hidden sm:block touch-manipulation"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <CartPopover
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col pt-16 sm:pt-24 px-4 sm:px-6">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-4 right-4 p-3 text-gray-500 touch-manipulation"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center border-b-2 border-gray-900 pb-3 gap-3"
            >
              <Search size={18} className="text-gray-500 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-xl sm:text-3xl font-medium text-black outline-none placeholder:text-gray-300 bg-transparent"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}>
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </form>
            {searchProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.ulid}?${p.slug}`}
                    className="flex flex-col gap-2 group"
                    onClick={() => setSearchOpen(false)}
                  >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden rounded-xl">
                      {p.main_image && (
                        <Image
                          src={p.main_image}
                          alt={p.product_name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 uppercase">
                      {p.product_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ৳{p.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <span className="font-black text-lg tracking-tight text-black">
              {domain?.name?.toUpperCase() || "PATCHEE"}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 touch-manipulation"
              aria-label="Close"
            >
              <X size={22} className="text-gray-700" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => {
                setMobileOpen(false)
                setSearchOpen(true)
              }}
              className="w-full flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 text-gray-400 text-sm text-left touch-manipulation"
            >
              <Search size={16} />
              Search products...
            </button>
          </div>

          {/* Category chips */}
          {categories && categories.length > 0 && (
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Browse Categories
              </p>
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {categories.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${encodeURIComponent(cat.name)}&id=${cat.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2.5 min-w-[68px] touch-manipulation"
                  >
                    {cat.image && (
                      <div className="w-8 h-8 relative">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-2 flex-1">
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-4 text-sm font-semibold text-[#c8922a] border-b border-gray-100 touch-manipulation"
            >
              Shop By Concern
              <ChevronDown size={16} className="text-gray-400" />
            </Link>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-medium text-gray-800 border-b border-gray-100 touch-manipulation"
              >
                {l.label}
                <ChevronDown size={16} className="text-gray-300 -rotate-90" />
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="px-4 py-4 grid grid-cols-2 gap-3 border-t border-gray-100">
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3.5 text-xs font-semibold text-gray-700 touch-manipulation"
            >
              <User size={16} />
              My Account
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center bg-black rounded-xl py-3.5 text-xs font-semibold text-white touch-manipulation"
            >
              Track Order
            </Link>
          </div>
          <div
            className="px-4 py-3 text-center text-[10px] text-gray-400"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
          >
            © {new Date().getFullYear()} {domain?.name || "Patchee"}
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {BOTTOM_NAV.map(({ icon: Icon, label, href }) => {
          if (href === "#search") {
            return (
              <button
                key={label}
                onClick={() => setSearchOpen(true)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-500 touch-manipulation"
              >
                <Icon size={22} strokeWidth={1.8} />
                <span className="text-[9px] font-medium">{label}</span>
              </button>
            )
          }
          if (href === "#cart") {
            return (
              <div
                key={label}
                className="flex-1 flex flex-col items-center justify-center py-2.5 touch-manipulation"
              >
                <CartPopover
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                />
                <span className="text-[9px] font-medium text-gray-500 mt-0.5">
                  {label}
                </span>
              </div>
            )
          }
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 touch-manipulation transition-colors ${isActive ? "text-black" : "text-gray-400"}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Spacer for bottom nav */}
      <div className="lg:hidden h-16" />
    </>
  )
}
