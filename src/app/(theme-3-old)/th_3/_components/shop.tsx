"use client"

import React, { useState, useEffect } from "react"
import {
  Filter,
  X,
  Star,
  ChevronDown,
  SlidersHorizontal,
  Grid3x3,
  List,
  Check,
} from "lucide-react"
import AllProduct from "./all-product"
import { IProduct } from "../types/product"

// Sample products data (same as before)
const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    brand: "SonicBeats",
    category: "Electronics",
    subcategory: "Audio",
    price: 2999,
    discounted_price: 1999,
    discount_percentage: 33,
    qty: 15,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    rating: 4.5,
    reviews: 128,
    tags: ["Best Seller", "Wireless"],
    description: "Noise cancelling over-ear headphones with 30hr battery",
    colors: ["#000000", "#3b82f6", "#ef4444"],
    isNew: true,
  },
  {
    id: 2,
    name: "Ultra Slim Laptop Pro",
    slug: "ultra-slim-laptop-pro",
    brand: "TechNova",
    category: "Electronics",
    subcategory: "Computers",
    price: 89999,
    discounted_price: 74999,
    discount_percentage: 17,
    qty: 8,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w-800&h=800&fit=crop",
    rating: 4.7,
    reviews: 89,
    tags: ["Hot Deal", "Limited Stock"],
    description: "13-inch laptop with 16GB RAM, 512GB SSD",
    colors: ["#1f2937", "#f3f4f6"],
    isNew: false,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    brand: "EcoWear",
    category: "Fashion",
    subcategory: "Clothing",
    price: 1200,
    discounted_price: 899,
    discount_percentage: 25,
    qty: 0,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    rating: 4.2,
    reviews: 45,
    tags: ["Eco Friendly", "Sustainable"],
    description: "100% organic cotton, unisex fit",
    colors: ["#ffffff", "#000000", "#dc2626", "#2563eb"],
    isNew: true,
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    brand: "FitTrack",
    category: "Electronics",
    subcategory: "Wearables",
    price: 6999,
    discounted_price: 5499,
    discount_percentage: 21,
    qty: 20,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    rating: 4.4,
    reviews: 156,
    tags: ["Waterproof", "Heart Rate"],
    description: "Track workouts, sleep, and daily activities",
    colors: ["#000000", "#0ea5e9", "#10b981"],
    isNew: false,
  },
  {
    id: 5,
    name: "Premium Coffee Beans",
    slug: "premium-coffee-beans",
    brand: "BeanBliss",
    category: "Food & Beverage",
    subcategory: "Beverages",
    price: 1200,
    discounted_price: 999,
    discount_percentage: 17,
    qty: 50,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
    rating: 4.8,
    reviews: 203,
    tags: ["Organic", "Arabica"],
    description: "Single origin Colombian coffee beans",
    colors: [],
    isNew: true,
  },
  {
    id: 6,
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    brand: "ComfortPro",
    category: "Home & Living",
    subcategory: "Furniture",
    price: 18999,
    discounted_price: 15999,
    discount_percentage: 16,
    qty: 6,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
    rating: 4.6,
    reviews: 67,
    tags: ["Adjustable", "Lumbar Support"],
    description: "Premium mesh office chair with headrest",
    colors: ["#000000", "#6b7280"],
    isNew: false,
  },
  {
    id: 7,
    name: "Professional Camera Kit",
    slug: "professional-camera-kit",
    brand: "PhotoPro",
    category: "Electronics",
    subcategory: "Photography",
    price: 129999,
    discounted_price: 109999,
    discount_percentage: 15,
    qty: 3,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
    rating: 4.9,
    reviews: 34,
    tags: ["4K Video", "Bundle"],
    description: "Mirrorless camera with 24-70mm lens",
    colors: ["#000000"],
    isNew: true,
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    brand: "SoundWave",
    category: "Electronics",
    subcategory: "Audio",
    price: 3499,
    discounted_price: 2799,
    discount_percentage: 20,
    qty: 25,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
    rating: 4.3,
    reviews: 112,
    tags: ["Waterproof", "24h Battery"],
    description: "360° sound with IPX7 waterproof rating",
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    isNew: false,
  },
  {
    id: 9,
    name: "Natural Skincare Set",
    slug: "natural-skincare-set",
    brand: "PureGlow",
    category: "Beauty & Health",
    subcategory: "Skincare",
    price: 2499,
    discounted_price: 1999,
    discount_percentage: 20,
    qty: 18,
    image:
      "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=800&h=800&fit=crop",
    rating: 4.5,
    reviews: 89,
    tags: ["Cruelty Free", "Vegan"],
    description: "Complete skincare routine in one set",
    colors: [],
    isNew: true,
  },
  {
    id: 10,
    name: "Gaming Keyboard RGB",
    slug: "gaming-keyboard-rgb",
    brand: "GameMaster",
    category: "Electronics",
    subcategory: "Gaming",
    price: 5999,
    discounted_price: 4499,
    discount_percentage: 25,
    qty: 12,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop",
    rating: 4.4,
    reviews: 78,
    tags: ["Mechanical", "RGB"],
    description: "Cherry MX switches with per-key RGB",
    colors: ["#000000", "#9333ea"],
    isNew: false,
  },
  {
    id: 11,
    name: "Running Shoes Pro",
    slug: "running-shoes-pro",
    brand: "SportFlex",
    category: "Sports & Outdoors",
    subcategory: "Footwear",
    price: 4999,
    discounted_price: 3999,
    discount_percentage: 20,
    qty: 25,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    rating: 4.6,
    reviews: 189,
    tags: ["Running", "Comfort"],
    description: "Professional running shoes with cushion technology",
    colors: ["#000000", "#dc2626", "#0ea5e9"],
    isNew: true,
  },
  {
    id: 12,
    name: "Smartphone X Pro",
    slug: "smartphone-x-pro",
    brand: "TechNova",
    category: "Electronics",
    subcategory: "Mobile",
    price: 79999,
    discounted_price: 69999,
    discount_percentage: 12,
    qty: 15,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
    rating: 4.7,
    reviews: 234,
    tags: ["5G", "128GB"],
    description: "Latest flagship smartphone with advanced camera",
    colors: ["#1f2937", "#f3f4f6", "#dc2626"],
    isNew: false,
  },
]

// Filter options
const categories = [
  { id: "all", name: "All Categories", count: 12 },
  { id: "electronics", name: "Electronics", count: 6 },
  { id: "fashion", name: "Fashion", count: 1 },
  { id: "home-living", name: "Home & Living", count: 1 },
  { id: "beauty-health", name: "Beauty & Health", count: 1 },
  { id: "food-beverage", name: "Food & Beverage", count: 1 },
  { id: "sports-outdoors", name: "Sports & Outdoors", count: 1 },
]

const brands = [
  { id: "all", name: "All Brands", count: 12 },
  { id: "sonicbeats", name: "SonicBeats", count: 1 },
  { id: "technova", name: "TechNova", count: 2 },
  { id: "ecowear", name: "EcoWear", count: 1 },
  { id: "fittrack", name: "FitTrack", count: 1 },
  { id: "beanbliss", name: "BeanBliss", count: 1 },
  { id: "comfortpro", name: "ComfortPro", count: 1 },
  { id: "photopro", name: "PhotoPro", count: 1 },
  { id: "soundwave", name: "SoundWave", count: 1 },
  { id: "pureglow", name: "PureGlow", count: 1 },
  { id: "gamemaster", name: "GameMaster", count: 1 },
  { id: "sportflex", name: "SportFlex", count: 1 },
]

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: 200000 },
  { id: "under-1000", name: "Under ৳1,000", min: 0, max: 1000 },
  { id: "1000-5000", name: "৳1,000 - ৳5,000", min: 1000, max: 5000 },
  { id: "5000-10000", name: "৳5,000 - ৳10,000", min: 5000, max: 10000 },
  { id: "10000-50000", name: "৳10,000 - ৳50,000", min: 10000, max: 50000 },
  { id: "above-50000", name: "Above ৳50,000", min: 50000, max: 200000 },
]

const ratings = [
  { id: "all", value: 0, name: "All Ratings" },
  { id: "4.5", value: 4.5, name: "4.5 & above" },
  { id: "4", value: 4, name: "4.0 & above" },
  { id: "3.5", value: 3.5, name: "3.5 & above" },
  { id: "3", value: 3, name: "3.0 & above" },
]

const sortOptions = [
  { id: "default", name: "Default" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "newest", name: "Newest First" },
  { id: "discount", name: "Best Discount" },
]
interface ShopProps {
  products: IProduct[]
}

const Shop = ({ products }: ShopProps) => {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("default")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    brands: false,
    rating: false,
    tags: false,
  })

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["all"])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [selectedRating, setSelectedRating] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)

  // Get unique tags from products
  const allTags = Array.from(
    new Set(sampleProducts.flatMap((product) => product.tags))
  )

  // Toggle filter sections
  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"])
    } else {
      setSelectedCategories((prev) => {
        const newSelection = prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev.filter((id) => id !== "all"), categoryId]
        return newSelection.length === 0 ? ["all"] : newSelection
      })
    }
  }

  // Handle brand selection
  const handleBrandSelect = (brandId: string) => {
    if (brandId === "all") {
      setSelectedBrands(["all"])
    } else {
      setSelectedBrands((prev) => {
        const newSelection = prev.includes(brandId)
          ? prev.filter((id) => id !== brandId)
          : [...prev.filter((id) => id !== "all"), brandId]
        return newSelection.length === 0 ? ["all"] : newSelection
      })
    }
  }

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...sampleProducts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(
          product.category.toLowerCase().replace(/\s+/g, "-")
        )
      )
    }

    // Brand filter
    if (!selectedBrands.includes("all")) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand.toLowerCase())
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

    // Rating filter
    if (selectedRating !== "all") {
      const ratingValue = parseFloat(selectedRating)
      filtered = filtered.filter((product) => product.rating >= ratingValue)
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.some((tag) => product.tags.includes(tag))
      )
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.qty > 0)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.discounted_price - b.discounted_price)
        break
      case "price-high":
        filtered.sort((a, b) => b.discounted_price - a.discounted_price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "discount":
        filtered.sort(
          (a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0)
        )
        break
      default:
        break
    }

    // setFilteredProducts([...filtered]);
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedPriceRange,
    selectedRating,
    selectedTags,
    inStockOnly,
    sortBy,
  ])

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories(["all"])
    setSelectedBrands(["all"])
    setSelectedPriceRange("all")
    setSelectedRating("all")
    setSelectedTags([])
    setInStockOnly(false)
    setSearchQuery("")
  }

  // Toggle wishlist
  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Get active filter count
  const activeFilterCount = [
    selectedCategories.includes("all") ? 0 : selectedCategories.length,
    selectedBrands.includes("all") ? 0 : selectedBrands.length,
    selectedPriceRange === "all" ? 0 : 1,
    selectedRating === "all" ? 0 : 1,
    selectedTags.length,
    inStockOnly ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories
                      .filter((c) => c !== "all")
                      .map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {categories.find((c) => c.id === category)?.name}
                          <button
                            onClick={() => handleCategorySelect(category)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    {/* Add similar for other filters */}
                  </div>
                </div>
              )}

              {/* Categories Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection("categories")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedFilters.categories ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFilters.categories && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategories.includes(category.id) ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedCategories.includes(category.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection("price")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold text-gray-900">Price Range</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedFilters.price ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPriceRange === range.id ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedPriceRange === range.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-700">{range.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection("brands")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold text-gray-900">Brands</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedFilters.brands ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFilters.brands && (
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(brand.id)}
                        className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBrands.includes(brand.id) ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedBrands.includes(brand.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-700">{brand.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {brand.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection("rating")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold text-gray-900">Rating</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedFilters.rating ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFilters.rating && (
                  <div className="space-y-2">
                    {ratings.map((rating) => (
                      <button
                        key={rating.id}
                        onClick={() => setSelectedRating(rating.id)}
                        className="flex items-center justify-between w-full text-left hover:text-green-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedRating === rating.id ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedRating === rating.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-gray-700">{rating.name}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection("tags")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold text-gray-900">Tags</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedFilters.tags ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFilters.tags && (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Filter */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">In Stock Only</span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-10 h-5 rounded-full transition-colors ${inStockOnly ? "bg-green-600" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full transform transition-transform ${inStockOnly ? "translate-x-6" : "translate-x-1"} mt-1`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {filteredProducts.length} Products
                      {activeFilterCount > 0 && (
                        <span className="ml-2 text-green-600">
                          ({activeFilterCount} filter
                          {activeFilterCount !== 1 ? "s" : ""} active)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilter(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="List view"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          Sort by: {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <AllProduct products={products} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b z-10">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Copy all filter sections from desktop sidebar here */}
              {/* For brevity, I'm showing just the structure */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategories.includes(category.id) ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedCategories.includes(category.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span>{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPriceRange === range.id ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                          >
                            {selectedPriceRange === range.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span>{range.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="sticky bottom-0 bg-white pt-4 border-t">
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shop
