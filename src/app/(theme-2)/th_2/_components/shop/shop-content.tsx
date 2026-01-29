"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IProduct } from "../../types/product"
import { ICategory } from "../../types/categories"
import { ProductList } from "./product-list"
import { CategoryNavigation } from "./category-navigation"
import {
  getCategoryProducts,
  getAllProducts,
  searchProducts,
} from "@/lib/products"
import { IProductsApiResponse } from "../../types/product"
import { Button } from "../ui/button"
import { Filters } from "./filters"
import { FunnelIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { useTranslations } from "next-intl"

interface PaginationInfo {
  current_page: number
  last_page: number
  next_page_url: string | null
  per_page: number
  total: number
}

interface ShopContentProps {
  initialProducts: IProduct[]
  initialPagination: PaginationInfo
  categories: ICategory[]
  headers: {
    "shop-id": string
    "user-id": string
  }
  initialCategoryId?: number | null
  initialSearchQuery?: string | null
}

export function ShopContent({
  initialProducts,
  initialPagination,
  categories,
  headers,
  initialCategoryId,
  initialSearchQuery,
}: ShopContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("Theme2.buttons")
  const [products, setProducts] = useState<IProduct[]>(
    Array.isArray(initialProducts) ? initialProducts : []
  )
  const [pagination, setPagination] =
    useState<PaginationInfo>(initialPagination)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    initialCategoryId || null
  )
  const [searchQuery, setSearchQuery] = useState<string | null>(
    initialSearchQuery || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadCategoryProducts = async (categoryId: number, page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await getCategoryProducts(categoryId, headers, page)
      setProducts(Array.isArray(response?.data) ? response.data : [])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
      setSelectedCategoryId(categoryId)
      // Clear search when switching categories
      setSearchQuery(null)
    } catch (error) {
      console.error("Failed to fetch category products:", error)
      // Fallback to all products on error
      setProducts(Array.isArray(initialProducts) ? initialProducts : [])
      setPagination(initialPagination)
      setSelectedCategoryId(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSearchProducts = async (query: string, page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await searchProducts(query, headers, page)
      setProducts(Array.isArray(response?.data) ? response.data : [])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
      setSelectedCategoryId(null) // Clear category when searching
    } catch (error) {
      console.error("Failed to search products:", error)
      setProducts([])
      setPagination({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        per_page: 0,
        total: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreProducts = async () => {
    if (isLoadingMore || !pagination.next_page_url) return

    setIsLoadingMore(true)
    try {
      const nextPage = pagination.current_page + 1
      let response: IProductsApiResponse

      if (searchQuery) {
        response = await searchProducts(searchQuery, headers, nextPage)
      } else if (selectedCategoryId) {
        response = await getCategoryProducts(
          selectedCategoryId,
          headers,
          nextPage
        )
      } else {
        response = await getAllProducts(headers, nextPage)
      }

      // Append new products to existing ones
      const newProducts = Array.isArray(response?.data) ? response.data : []
      setProducts((prev) => [...prev, ...newProducts])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
    } catch (error) {
      console.error("Failed to load more products:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Load category products on mount if categoryId is in URL
  useEffect(() => {
    if (initialCategoryId) {
      // If categoryId is provided from URL, load those products
      loadCategoryProducts(initialCategoryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Handle URL changes (browser back/forward, direct navigation)
  useEffect(() => {
    const catId = searchParams.get("catId")
    const search = searchParams.get("search")
    const currentCatId = catId ? Number(catId) : null

    // Handle search query changes
    if (search !== searchQuery) {
      if (search && search.trim()) {
        // Load search results from API
        loadSearchProducts(search.trim())
        setSearchQuery(search)
        setSelectedCategoryId(null) // Clear category when searching
      } else if (!search && searchQuery) {
        // Search was cleared, show all products
        setProducts(Array.isArray(initialProducts) ? initialProducts : [])
        setPagination(initialPagination)
        setSearchQuery(null)
        setSelectedCategoryId(null)
      }
    }

    // Handle category changes (only if no search query)
    if (!search && currentCatId !== selectedCategoryId) {
      if (currentCatId && !isNaN(currentCatId)) {
        loadCategoryProducts(currentCatId)
      } else if (currentCatId === null && selectedCategoryId !== null) {
        // If catId was removed from URL, show all products
        setProducts(Array.isArray(initialProducts) ? initialProducts : [])
        setPagination(initialPagination)
        setSelectedCategoryId(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleCategorySelect = async (categoryId: number | null) => {
    // Update URL query parameter
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId === null) {
      // Clear category and search when showing all products
      params.delete("catId")
      params.delete("search")
      router.push(`/shop?${params.toString()}`, { scroll: false })

      // Reset to initial state immediately
      setProducts(Array.isArray(initialProducts) ? initialProducts : [])
      setPagination(initialPagination)
      setSelectedCategoryId(null)
      setSearchQuery(null)
      return
    } else {
      // Set category and clear search when selecting a category
      params.set("catId", String(categoryId))
      params.delete("search")
      router.push(`/shop?${params.toString()}`, { scroll: false })
    }

    await loadCategoryProducts(categoryId)
  }

  const handleLoadMore = async () => {
    await loadMoreProducts()
  }

  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {selectedCategory && (
            <h1 className="text-xl md:text-3xl font-semibold text-foreground truncate min-w-0">
              {selectedCategory.name}
            </h1>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  <FunnelIcon />
                  {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex flex-col gap-0 max-md:w-full max-h-[90svh] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>{t("filters")}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Filter products
                  </SheetDescription>
                </SheetHeader>
                <div>
                  <Filters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <CategoryNavigation
          categories={categories}
          onCategorySelect={handleCategorySelect}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      <div className="md:grid md:grid-cols-3 xl:grid-cols-5 mt-10 gap-12 md:gap-16 items-start">
        <div className="max-md:hidden">
          <Filters />
        </div>
        <div className="md:col-span-2 xl:col-span-4 pb-10">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : searchQuery && products.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20">
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-2">
                No products found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-muted-foreground mb-6">
                Try a different search term or view all products
              </p>
              <Button
                onClick={() => handleCategorySelect(null)}
                size="lg"
                className="px-8 py-6"
              >
                {t("viewAllProducts")}
              </Button>
            </div>
          ) : products.length === 0 && selectedCategoryId !== null ? (
            <div className="flex flex-col justify-center items-center py-20">
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-2">
                No products found in this category
              </p>
              <p className="text-muted-foreground mb-6">
                Try selecting a different category or view all products
              </p>
              <Button
                onClick={() => handleCategorySelect(null)}
                size="lg"
                className="px-8 py-6"
              >
                {t("viewAllProducts")}
              </Button>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {products.length} result
                    {products.length !== 1 ? "s" : ""} for &quot;
                    <span className="font-semibold text-foreground">
                      {searchQuery}
                    </span>
                    &quot;
                  </p>
                </div>
              )}
              <ProductList
                products={products}
                hasMore={!!pagination.next_page_url}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
