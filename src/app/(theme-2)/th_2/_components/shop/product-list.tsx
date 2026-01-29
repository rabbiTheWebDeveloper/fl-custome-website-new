"use client"

import { useEffect } from "react"
import { useProducts } from "../../store/products"
import { IProduct } from "../../types/product"
import { ProductCard } from "../products/product-card"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

interface ProductListProps {
  products: IProduct[]
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export const ProductList = ({
  products,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: ProductListProps) => {
  const setProducts = useProducts((state) => state.setProducts)
  const t = useTranslations("Theme2.buttons")

  useEffect(() => {
    // In real implementation, fetch products from API
    setProducts(products)
  }, [setProducts, products])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-12 py-6 text-base font-semibold rounded-[12px]"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? t("loading") : t("seeMore")}
          </Button>
        </div>
      )}
    </div>
  )
}
