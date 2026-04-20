"use client"
import React, { useState, useMemo } from "react"
import {
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  Check,
  Search,
  ArrowRight,
} from "lucide-react"
import { IProduct } from "../types/product"
import ProductCard from "./product-card"
import Pagination from "./pagination"
import { ICategory } from "../types/categories"
import { useCategories } from "../store/categories"
import { useTranslations } from "next-intl"

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: 200000 },
  { id: "under-1000", name: "Under ৳1,000", min: 0, max: 1000 },
  { id: "1000-5000", name: "৳1,000 – ৳5,000", min: 1000, max: 5000 },
  { id: "5000-10000", name: "৳5,000 – ৳10,000", min: 5000, max: 10000 },
  { id: "10000-50000", name: "৳10,000 – ৳50,000", min: 10000, max: 50000 },
  { id: "above-50000", name: "Above ৳50,000", min: 50000, max: 200000 },
]

const sortOptions = [
  { id: "default", name: "Default" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "discount", name: "Best Discount" },
]

interface ShopProps {
  products: IProduct[]
  totalPages: number
}

// ── Reusable filter checkbox ──
const FilterCheckbox = ({
  checked,
  label,
  count,
  onClick,
}: {
  checked: boolean
  label: string
  count?: number
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full text-left py-2 group"
  >
    <div className="flex items-center gap-2.5">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${
            checked
              ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
              : "border-gray-300 dark:border-zinc-600 group-hover:border-gray-600 dark:group-hover:border-zinc-400"
          }`}
      >
        {checked && (
          <Check
            className="w-2.5 h-2.5 text-white dark:text-black"
            strokeWidth={3}
          />
        )}
      </div>
      <span
        className={`text-sm transition-colors ${checked ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
      >
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-400 dark:text-zinc-600 font-medium">
        {count}
      </span>
    )}
  </button>
)

// ── Reusable price radio ──
const PriceRadio = ({
  checked,
  label,
  count,
  onClick,
}: {
  checked: boolean
  label: string
  count?: number
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full text-left py-2 group"
  >
    <div className="flex items-center gap-2.5">
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${
            checked
              ? "border-gray-900 dark:border-white"
              : "border-gray-300 dark:border-zinc-600 group-hover:border-gray-600 dark:group-hover:border-zinc-400"
          }`}
      >
        {checked && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
        )}
      </div>
      <span
        className={`text-sm transition-colors ${checked ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
      >
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-400 dark:text-zinc-600 font-medium">
        {count}
      </span>
    )}
  </button>
)

// ── Collapsible filter section ──
const FilterSection = ({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <div className="border-b border-gray-100 dark:border-zinc-800 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full mb-1 group"
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {title}
      </h3>
      <ChevronDown
        className={`w-4 h-4 text-gray-400 dark:text-zinc-600 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
      />
    </button>
    {expanded && (
      <div className="mt-3 space-y-0.5 max-h-56 overflow-y-auto pr-1">
        {children}
      </div>
    )}
  </div>
)

const Shop = ({ products, totalPages }: ShopProps) => {
  const t = useTranslations("Theme3.shop")
  const [sortBy, setSortBy] = useState("default")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const categories: ICategory[] | null = useCategories(
    (state) => state.categories
  )
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [inStockOnly, setInStockOnly] = useState(false)

  const productCategories = useMemo(() => {
    if (!products) return []
    const categoryIds = [...new Set(products.map((p) => p.category_id))]
    return categoryIds
      .map((id) => categories?.find((c) => c.id === id))
      .filter((c): c is ICategory => c !== undefined)
  }, [products, categories])

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategorySelect = (categoryId: string | number) => {
    const categoryIdStr = categoryId.toString()
    if (categoryIdStr === "all") {
      setSelectedCategories(["all"])
    } else {
      setSelectedCategories((prev) => {
        const newSelection = prev.includes(categoryIdStr)
          ? prev.filter((id) => id !== categoryIdStr)
          : [...prev.filter((id) => id !== "all"), categoryIdStr]
        return newSelection.length === 0 ? ["all"] : newSelection
      })
    }
  }

  const filteredProducts = useMemo(() => {
    if (!products) return []
    let filtered = products.filter(
      (product) => product != null && typeof product.price !== "undefined"
    )

    if (searchQuery || mobileSearchQuery) {
      const query = (searchQuery || mobileSearchQuery).toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.product_name?.toLowerCase().includes(query) ||
          (product.product_code &&
            product.product_code.toLowerCase().includes(query))
      )
    }

    if (!selectedCategories.includes("all") && selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(String(product.category_id ?? ""))
      )
    }

    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.id === selectedPriceRange)
      if (range) {
        filtered = filtered.filter((product) => {
          const price = product.discounted_price ?? product.price ?? 0
          return price >= range.min && price <= range.max
        })
      }
    }

    if (inStockOnly) {
      filtered = filtered.filter((product) => (product.product_qty ?? 0) > 0)
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            (a.discounted_price ?? a.price ?? 0) -
            (b.discounted_price ?? b.price ?? 0)
        )
        break
      case "price-high":
        filtered.sort(
          (a, b) =>
            (b.discounted_price ?? b.price ?? 0) -
            (a.discounted_price ?? a.price ?? 0)
        )
        break
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
        break
      case "discount":
        filtered.sort((a, b) => {
          const discountA =
            a.price && a.discount ? (a.discount / a.price) * 100 : 0
          const discountB =
            b.price && b.discount ? (b.discount / b.price) * 100 : 0
          return discountB - discountA
        })
        break
      default:
        filtered.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        break
    }

    return filtered
  }, [
    products,
    searchQuery,
    mobileSearchQuery,
    selectedCategories,
    selectedPriceRange,
    inStockOnly,
    sortBy,
  ])

  const clearAllFilters = () => {
    setSelectedCategories(["all"])
    setSelectedPriceRange("all")
    setInStockOnly(false)
    setSearchQuery("")
    setMobileSearchQuery("")
  }

  const activeFilterCount = [
    selectedCategories.includes("all") ? 0 : selectedCategories.length,
    selectedPriceRange === "all" ? 0 : 1,
    inStockOnly ? 1 : 0,
    searchQuery || mobileSearchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  // ── Shared filter panel content ──
  const renderFilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "p-5 space-y-0" : ""}>
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search products…"
            value={mobile ? mobileSearchQuery : searchQuery}
            onChange={(e) =>
              mobile
                ? setMobileSearchQuery(e.target.value)
                : setSearchQuery(e.target.value)
            }
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-9 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
          />
          {(mobile ? mobileSearchQuery : searchQuery) && (
            <button
              onClick={() =>
                mobile ? setMobileSearchQuery("") : setSearchQuery("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {selectedCategories
            .filter((c) => c !== "all")
            .map((categoryId) => {
              const category = categories?.find(
                (c) => c.id.toString() === categoryId
              )
              return category ? (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {category.name}
                  <button
                    onClick={() => handleCategorySelect(categoryId)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null
            })}
        </div>
      )}

      {/* Categories */}
      <FilterSection
        title={t("categories")}
        expanded={expandedFilters.categories}
        onToggle={() => toggleFilterSection("categories")}
      >
        <FilterCheckbox
          checked={selectedCategories.includes("all")}
          label={t("allCategories")}
          onClick={() => handleCategorySelect("all")}
        />
        {productCategories.map((category) => (
          <FilterCheckbox
            key={category.id}
            checked={selectedCategories.includes(category.id.toString())}
            label={category.name}
            count={
              products?.filter((p) => p.category_id === category.id).length
            }
            onClick={() => handleCategorySelect(category.id)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title={t("priceRange")}
        expanded={expandedFilters.price}
        onToggle={() => toggleFilterSection("price")}
      >
        {priceRanges.map((range) => (
          <PriceRadio
            key={range.id}
            checked={selectedPriceRange === range.id}
            label={range.name}
            count={
              range.id === "all"
                ? undefined
                : products?.filter(
                    (p) =>
                      (p.discounted_price ?? p.price ?? 0) >= range.min &&
                      (p.discounted_price ?? p.price ?? 0) <= range.max
                  ).length
            }
            onClick={() => setSelectedPriceRange(range.id)}
          />
        ))}
      </FilterSection>

      {/* In Stock toggle */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-600 dark:text-zinc-400 font-medium">
          {t("inStockOnly")}
        </span>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            inStockOnly
              ? "bg-gray-900 dark:bg-white"
              : "bg-gray-200 dark:bg-zinc-700"
          }`}
        >
          <div
            className={`absolute w-4 h-4 bg-white dark:bg-black rounded-full shadow-sm transform transition-transform top-1 duration-200 ${
              inStockOnly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-28 pb-20">
      {/* ── Mobile Sticky Bar ── */}
      <div className="lg:hidden sticky top-[72px] z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Filter button */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="relative flex items-center justify-center w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search products…"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="w-full border border-gray-200 dark:border-zinc-800 rounded-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent text-sm font-medium transition-all"
            />
            {mobileSearchQuery && (
              <button
                onClick={() => setMobileSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* ══ Desktop Sidebar ══ */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div
              suppressHydrationWarning
              className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm p-6 xl:p-7 sticky top-28"
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Filter className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                  </div>
                  <h2 className="text-sm font-black tracking-tight text-gray-900 dark:text-white">
                    {t("filters")}
                  </h2>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t("clearAll")}
                  </button>
                )}
              </div>

              {renderFilterPanel({})}
            </div>
          </aside>

          {/* ══ Products Area ══ */}
          <div className="flex-1 min-w-0">
            {/* Desktop Toolbar */}
            <div className="hidden lg:flex items-center justify-between bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm px-6 py-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                  Results
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {filteredProducts.length} {t("products")}
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-xs font-bold text-gray-500 dark:text-zinc-400">
                      · {activeFilterCount} filter
                      {activeFilterCount !== 1 ? "s" : ""} active
                    </span>
                  )}
                </p>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-4 pr-9 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent cursor-pointer transition-all"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Stats Bar */}
            <div className="lg:hidden flex items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {filteredProducts.length} {t("products")}
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 text-xs font-bold text-gray-400 dark:text-zinc-500">
                    · {activeFilterCount} filter
                    {activeFilterCount !== 1 ? "s" : ""}
                  </span>
                )}
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl pl-3 pr-7 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Products Grid */}
            <section>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex flex-col h-full">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 lg:mt-10">
                    <Pagination totalPages={totalPages || 10} />
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-12 sm:p-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                    <Search className="w-7 h-7 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                    {t("noProductsFound")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                    {t("noProductsDescription")}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg"
                    >
                      {t("clearAll")} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilter(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-8 pb-5 border-b border-gray-100 dark:border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {t("filters")}
                  </h2>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                      {activeFilterCount} active
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto py-2">
              {renderFilterPanel({ mobile: true })}
            </div>

            {/* Footer CTA */}
            <div className="px-5 py-5 border-t border-gray-100 dark:border-zinc-800 space-y-3 flex-shrink-0 bg-white dark:bg-zinc-950">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-full py-4 font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
              >
                {t("applyFilters")} — {filteredProducts.length} results
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full text-center text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                >
                  {t("clearAll")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shop
