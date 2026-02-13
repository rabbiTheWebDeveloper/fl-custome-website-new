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
  searchProductsByPrice,
  searchProductsByCategories,
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
import { api } from "@/lib/api-client"
import {
  ISectionWiseProductsApiResponse,
  ISectionProduct,
} from "../../types/sections"

/**
 * Maps an ISectionProduct to an IProduct with defaults for missing fields
 */
function mapSectionProductToProduct(sp: ISectionProduct): IProduct {
  return {
    id: sp.id,
    ulid: sp.ulid,
    category_id: 0,
    shop_id: sp.shop_id,
    wp_product_id: 0,
    product_name: sp.product_name,
    product_code: sp.product_code,
    product_qty: sp.product_qty,
    slug: sp.slug,
    price: sp.price,
    discount: sp.discount,
    discounted_price: sp.discounted_price ?? sp.price,
    discount_type: sp.discount_type,
    flat_discount_percent: sp.flat_discount_percent ?? 0,
    delivery_charge: "0",
    inside_dhaka: 0,
    outside_dhaka: 0,
    status: sp.status,
    sub_area_charge: 0,
    default_delivery_location: null,
    attributes: false,
    variation_price_range: [],
    variations: false,
    created_at: "",
    main_image: sp.main_image,
    wp_product_image_url: sp.wp_product_image_url,
    short_description: null,
    long_description: null,
    other_images: [],
  }
}

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

  const sectionUlid = searchParams.get("section") ?? null

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
  const [priceFilter, setPriceFilter] = useState<{
    min: number
    max: number
  } | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<number[] | null>(null)
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined)

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

  const loadPriceFilteredProducts = async (
    minPrice: number,
    maxPrice: number,
    page: number = 1
  ) => {
    setIsLoading(true)
    try {
      const response = await searchProductsByPrice(
        minPrice,
        maxPrice,
        headers,
        page
      )
      setProducts(Array.isArray(response?.data) ? response.data : [])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
      setSelectedCategoryId(null)
      setSearchQuery(null)
      setPriceFilter({ min: minPrice, max: maxPrice })
    } catch (error) {
      console.error("Failed to filter products by price:", error)
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

  const loadCategoryFilteredProducts = async (
    categoryIds: number[],
    page: number = 1
  ) => {
    setIsLoading(true)
    try {
      const response = await searchProductsByCategories(
        categoryIds,
        headers,
        page
      )
      setProducts(Array.isArray(response?.data) ? response.data : [])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
      setSelectedCategoryId(null)
      setSearchQuery(null)
      setPriceFilter(null)
      setCategoryFilter(categoryIds)
    } catch (error) {
      console.error("Failed to filter products by categories:", error)
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

  const handleSortChange = async (
    column: string,
    direction: "asc" | "desc"
  ) => {
    setSortColumn(column)
    setSortDirection(direction)
    setIsLoading(true)
    try {
      const response = await getAllProducts(headers, 1, column, direction)
      setProducts(Array.isArray(response?.data) ? response.data : [])
      setPagination({
        current_page: response?.current_page ?? 1,
        last_page: response?.last_page ?? 1,
        next_page_url: response?.next_page_url ?? null,
        per_page: response?.per_page ?? 0,
        total: response?.total ?? 0,
      })
      setSelectedCategoryId(null)
      setSearchQuery(null)
      setPriceFilter(null)
      setCategoryFilter(null)
    } catch (error) {
      console.error("Failed to sort products:", error)
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

      if (categoryFilter && categoryFilter.length > 0) {
        response = await searchProductsByCategories(
          categoryFilter,
          headers,
          nextPage
        )
      } else if (priceFilter) {
        response = await searchProductsByPrice(
          priceFilter.min,
          priceFilter.max,
          headers,
          nextPage
        )
      } else if (searchQuery) {
        response = await searchProducts(searchQuery, headers, nextPage)
      } else if (selectedCategoryId) {
        response = await getCategoryProducts(
          selectedCategoryId,
          headers,
          nextPage
        )
      } else {
        response = await getAllProducts(
          headers,
          nextPage,
          sortColumn,
          sortDirection
        )
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

  // Load section products client-side when section param is in URL
  useEffect(() => {
    if (!sectionUlid) return

    let cancelled = false

    const loadSectionProducts = async () => {
      setIsLoading(true)
      try {
        const response = await api.getTyped<
          `/customer/section-wise-products/${string}`,
          ISectionWiseProductsApiResponse
        >(`/customer/section-wise-products/${sectionUlid}`, {
          headers,
        })

        if (cancelled) return

        const sectionProducts = Array.isArray(response?.data?.products)
          ? response.data.products.map(mapSectionProductToProduct)
          : []

        setProducts(sectionProducts)
        setPagination({
          current_page: 1,
          last_page: 1,
          next_page_url: null,
          per_page: sectionProducts.length,
          total: sectionProducts.length,
        })
      } catch (error) {
        if (cancelled) return
        console.error("Failed to fetch section products:", error)
        setProducts([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSectionProducts()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionUlid])

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
      // Clear category, search, price, and category filter when showing all products
      params.delete("catId")
      params.delete("search")
      params.delete("min_price")
      params.delete("max_price")
      params.delete("category_ids")
      router.push(`/shop?${params.toString()}`, { scroll: false })

      // Reset to initial state immediately
      setProducts(Array.isArray(initialProducts) ? initialProducts : [])
      setPagination(initialPagination)
      setSelectedCategoryId(null)
      setSearchQuery(null)
      setPriceFilter(null)
      setCategoryFilter(null)
      return
    } else {
      // Set category and clear search/price/category filter when selecting a category
      params.set("catId", String(categoryId))
      params.delete("search")
      params.delete("min_price")
      params.delete("max_price")
      params.delete("category_ids")
      setPriceFilter(null)
      setCategoryFilter(null)
      router.push(`/shop?${params.toString()}`, { scroll: false })
    }

    await loadCategoryProducts(categoryId)
  }

  const handlePriceRangeApply = async (minPrice: number, maxPrice: number) => {
    // Update URL params
    const params = new URLSearchParams(searchParams.toString())
    params.set("min_price", String(minPrice))
    params.set("max_price", String(maxPrice))
    params.delete("catId")
    params.delete("search")
    params.delete("category_ids")
    setCategoryFilter(null)
    router.push(`/shop?${params.toString()}`, { scroll: false })

    await loadPriceFilteredProducts(minPrice, maxPrice)
  }

  const handlePriceRangeReset = async () => {
    setPriceFilter(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("min_price")
    params.delete("max_price")
    router.push(`/shop?${params.toString()}`, { scroll: false })

    // Reset to all products
    setProducts(Array.isArray(initialProducts) ? initialProducts : [])
    setPagination(initialPagination)
    setSelectedCategoryId(null)
    setSearchQuery(null)
  }

  const handleCategoryFilterApply = async (categoryIds: number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("catId")
    params.delete("search")
    params.delete("min_price")
    params.delete("max_price")
    params.set("category_ids", categoryIds.join(","))
    router.push(`/shop?${params.toString()}`, { scroll: false })

    await loadCategoryFilteredProducts(categoryIds)
  }

  const handleCategoryFilterReset = async () => {
    setCategoryFilter(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category_ids")
    router.push(`/shop?${params.toString()}`, { scroll: false })

    // Reset to all products
    setProducts(Array.isArray(initialProducts) ? initialProducts : [])
    setPagination(initialPagination)
    setSelectedCategoryId(null)
    setSearchQuery(null)
  }

  const handleLoadMore = async () => {
    await loadMoreProducts()
  }

  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null

  // Section view: show section products without filters/categories
  if (sectionUlid) {
    return (
      <>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <Button
            variant="secondary"
            size="lg"
            className="md:text-base font-semibold py-6"
            onClick={() => router.push("/shop")}
          >
            {t("viewAllProducts")}
          </Button>
        </div>
        <div className="pb-10">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20">
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-2">
                No products found in this section
              </p>
              <Button
                onClick={() => router.push("/shop")}
                size="lg"
                className="px-8 py-6 mt-4"
              >
                {t("viewAllProducts")}
              </Button>
            </div>
          ) : (
            <ProductList
              products={products}
              hasMore={false}
              isLoadingMore={false}
            />
          )}
        </div>
      </>
    )
  }

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
                  <Filters
                    categories={categories}
                    onPriceRangeApply={handlePriceRangeApply}
                    onPriceRangeReset={handlePriceRangeReset}
                    isPriceFilterActive={!!priceFilter}
                    onCategoryFilterApply={handleCategoryFilterApply}
                    onCategoryFilterReset={handleCategoryFilterReset}
                    isCategoryFilterActive={!!categoryFilter}
                    onSortChange={handleSortChange}
                  />
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
          <Filters
            categories={categories}
            onPriceRangeApply={handlePriceRangeApply}
            onPriceRangeReset={handlePriceRangeReset}
            isPriceFilterActive={!!priceFilter}
            onCategoryFilterApply={handleCategoryFilterApply}
            onCategoryFilterReset={handleCategoryFilterReset}
            isCategoryFilterActive={!!categoryFilter}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="md:col-span-2 xl:col-span-4 pb-10">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : categoryFilter &&
            categoryFilter.length > 0 &&
            products.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20">
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-2">
                No products found in selected categories
              </p>
              <p className="text-muted-foreground mb-6">
                Try selecting different categories or view all products
              </p>
              <Button
                onClick={() => handleCategoryFilterReset()}
                size="lg"
                className="px-8 py-6"
              >
                {t("viewAllProducts")}
              </Button>
            </div>
          ) : priceFilter && products.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20">
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-2">
                No products found in this price range
              </p>
              <p className="text-muted-foreground mb-6">
                ৳{priceFilter.min.toLocaleString()} - ৳
                {priceFilter.max.toLocaleString()}
              </p>
              <Button
                onClick={() => handlePriceRangeReset()}
                size="lg"
                className="px-8 py-6"
              >
                {t("viewAllProducts")}
              </Button>
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
