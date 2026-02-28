"use client"
import React, { useState, useMemo } from "react"
import {
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  Check,
  Search,
} from "lucide-react"
import { IProduct } from "../types/product"
import { ProductCard } from "./products/product-card"
import Pagination from "./pagination"
import { ICategory } from "../types/categories"
import { useCategories } from "../store/categories"
import { useTranslations } from "next-intl"

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: 200000 },
  { id: "under-1000", name: "Under ৳1,000", min: 0, max: 1000 },
  { id: "1000-5000", name: "৳1,000 - ৳5,000", min: 1000, max: 5000 },
  { id: "5000-10000", name: "৳5,000 - ৳10,000", min: 5000, max: 10000 },
  { id: "10000-50000", name: "৳10,000 - ৳50,000", min: 10000, max: 50000 },
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
    brands: false,
  })

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["all"])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [inStockOnly, setInStockOnly] = useState(false)

  // Get unique categories from products
  const productCategories = useMemo(() => {
    if (!products) return []
    const categoryIds = [...new Set(products.map((p) => p.category_id))]
    return categoryIds
      .map((id) => categories?.find((c) => c.id === id))
      .filter((c): c is ICategory => c !== undefined)
  }, [products, categories])

  // Toggle filter sections
  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle category selection
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

  // Apply filters
  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = [...products]

    // Search filter
    if (searchQuery || mobileSearchQuery) {
      const query = searchQuery || mobileSearchQuery
      filtered = filtered.filter(
        (product) =>
          product.product_name.toLowerCase().includes(query.toLowerCase()) ||
          (product.product_code &&
            product.product_code.toLowerCase().includes(query.toLowerCase()))
      )
    }

    // Category filter
    if (!selectedCategories.includes("all") && selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id.toString())
      )
    }

    // Price filter
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.id === selectedPriceRange)
      if (range) {
        filtered = filtered.filter(
          (product) =>
            product.discounted_price >= range.min &&
            product.discounted_price <= range.max
        )
      }
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.product_qty > 0)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.discounted_price - b.discounted_price)
        break
      case "price-high":
        filtered.sort((a, b) => b.discounted_price - a.discounted_price)
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
          const discountA = a.discount ? (a.discount / a.price) * 100 : 0
          const discountB = b.discount ? (b.discount / b.price) * 100 : 0
          return discountB - discountA
        })
        break
      default:
        filtered.sort((a, b) => b.id - a.id)
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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories(["all"])
    setSelectedBrands(["all"])
    setSelectedPriceRange("all")
    setInStockOnly(false)
    setSearchQuery("")
    setMobileSearchQuery("")
  }

  // Get active filter count
  const activeFilterCount = [
    selectedCategories.includes("all") ? 0 : selectedCategories.length,
    selectedBrands.includes("all") ? 0 : selectedBrands.length,
    selectedPriceRange === "all" ? 0 : 1,
    inStockOnly ? 1 : 0,
    searchQuery || mobileSearchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sticky Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center justify-center p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              {mobileSearchQuery && (
                <button
                  onClick={() => setMobileSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div
              suppressHydrationWarning
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 xl:p-6 sticky top-24"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg xl:text-xl font-bold text-gray-900 dark:text-white">
                  {t("filters")}
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs xl:text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {t("clearAll")}
                  </button>
                )}
              </div>

              {/* Desktop Search */}
              <div className="mb-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-8 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {t("activeFilters")}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategories
                      .filter((c) => c !== "all")
                      .map((categoryId) => {
                        const category = categories?.find(
                          (c) => c.id.toString() === categoryId
                        )
                        return category ? (
                          <span
                            key={categoryId}
                            className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs"
                          >
                            {category.name}
                            <button
                              onClick={() => handleCategorySelect(categoryId)}
                              className="hover:bg-green-100 dark:hover:bg-green-800 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null
                      })}
                  </div>
                </div>
              )}

              {/* Filter Sections */}
              {/* Categories */}
              <div className="mb-5">
                <button
                  onClick={() => toggleFilterSection("categories")}
                  className="flex items-center justify-between w-full mb-2.5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm xl:text-base">
                    {t("categories")}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.categories ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.categories && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-sm">
                    <button
                      onClick={() => handleCategorySelect("all")}
                      className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            selectedCategories.includes("all")
                              ? "bg-green-600 border-green-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedCategories.includes("all") && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {t("allCategories")}
                        </span>
                      </div>
                    </button>

                    {productCategories.map((category) => {
                      const isSelected = selectedCategories.includes(
                        category.id.toString()
                      )
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1 ml-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-[120px]">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {
                              products?.filter(
                                (p) => p.category_id === category.id
                              ).length
                            }
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <button
                  onClick={() => toggleFilterSection("price")}
                  className="flex items-center justify-between w-full mb-2.5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm xl:text-base">
                    {t("priceRange")}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-sm">
                    {priceRanges.map((range) => {
                      const isSelected = selectedPriceRange === range.id
                      const count = products?.filter(
                        (p) =>
                          p.discounted_price >= range.min &&
                          p.discounted_price <= range.max
                      ).length

                      return (
                        <button
                          key={range.id}
                          onClick={() => setSelectedPriceRange(range.id)}
                          className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {range.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Stock Filter */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t("inStockOnly")}
                </span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    inStockOnly
                      ? "bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      inStockOnly ? "translate-x-5" : "translate-x-0.5"
                    } top-0.5`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Desktop Toolbar */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {filteredProducts.length} {t("products")}
                    {activeFilterCount > 0 && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                        ({activeFilterCount} filter
                        {activeFilterCount !== 1 ? "s" : ""})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Stats Bar */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-lg shadow p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {filteredProducts.length} {t("products")}
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                    ({activeFilterCount})
                  </span>
                )}
              </span>

              {/* Mobile Sort & View */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            <section className="transition-colors">
              <div className="container mx-auto px-0">
                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white ... flex flex-col h-full"
                        >
                          <ProductCard {...product} />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 sm:mt-8 lg:mt-10">
                      <Pagination totalPages={totalPages || 10} />
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 sm:p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <Search className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t("noProductsFound")}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        {t("noProductsDescription")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("filters")}
                </h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="mb-4 pb-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("activeFilters")} ({activeFilterCount})
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      {t("clearAll")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategories
                      .filter((c) => c !== "all")
                      .map((categoryId) => {
                        const category = categories?.find(
                          (c) => c.id.toString() === categoryId
                        )
                        return category ? (
                          <span
                            key={categoryId}
                            className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs"
                          >
                            {category.name}
                            <button
                              onClick={() => handleCategorySelect(categoryId)}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null
                      })}
                  </div>
                </div>
              )}

              {/* Mobile Filter Sections - Same as desktop but with mobile optimized styling */}
              {/* Categories */}
              <div className="mb-5">
                <button
                  onClick={() => toggleFilterSection("categories")}
                  className="flex items-center justify-between w-full mb-2.5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("categories")}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.categories ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.categories && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {/* Copy categories content from desktop */}
                    <button
                      onClick={() => handleCategorySelect("all")}
                      className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            selectedCategories.includes("all")
                              ? "bg-green-600 border-green-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedCategories.includes("all") && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {t("allCategories")}
                        </span>
                      </div>
                    </button>

                    {productCategories.map((category) => {
                      const isSelected = selectedCategories.includes(
                        category.id.toString()
                      )
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1.5 ml-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {
                              products?.filter(
                                (p) => p.category_id === category.id
                              ).length
                            }
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Price Range - Mobile */}
              <div className="mb-5">
                <button
                  onClick={() => toggleFilterSection("price")}
                  className="flex items-center justify-between w-full mb-2.5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("priceRange")}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-2">
                    {priceRanges.map((range) => {
                      const isSelected = selectedPriceRange === range.id
                      return (
                        <button
                          key={range.id}
                          onClick={() => setSelectedPriceRange(range.id)}
                          className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors py-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {range.name}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Stock Filter - Mobile */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-5">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t("inStockOnly")}
                </span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    inStockOnly
                      ? "bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      inStockOnly ? "translate-x-5" : "translate-x-0.5"
                    } top-0.5`}
                  />
                </button>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t("applyFilters")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shop
