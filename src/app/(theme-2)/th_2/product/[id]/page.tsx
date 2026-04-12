import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductsCarousel } from "../../_components/products/products-carousel"
import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"
import { getDomainHeaders } from "@/lib/domain"
import { notFound } from "next/navigation"
import { ProductDetailsClient } from "../../_components/product/product-details-client"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ id?: string }>
}) {
  await params
  const { id: ulid } = await searchParams
  const validUlid =
    ulid && ulid !== "undefined" && ulid !== "null" ? ulid : null

  if (!validUlid) {
    notFound()
  }

  const headers = await getDomainHeaders()

  let product: IProduct | undefined
  try {
    const response = await api.get(`/customer/products/${validUlid}`, {
      headers,
    })
    const productResponse = (response.data as { data?: IProduct })?.data
    console.log(
      "[Theme2] Product detail variations:",
      productResponse?.variations
    )
    console.log(
      "[Theme2] Product detail variations count:",
      Array.isArray(productResponse?.variations)
        ? productResponse?.variations.length
        : 0
    )
    product = (response.data as { data: IProduct })?.data
  } catch {
    product = undefined
  }

  if (!product) {
    notFound()
  }

  void api
    .get(`${API_ENDPOINTS.PRODUCT_WISE_VISITOR}/${product.id}`, {
      headers: { "shop-id": product.shop_id.toString() },
    })
    .catch((err) => {
      console.error("Failed to track product visit:", err)
    })

  const rawVideoUrl = product.video_url as unknown
  const videoUrls: string[] = Array.isArray(rawVideoUrl)
    ? rawVideoUrl
    : typeof rawVideoUrl === "string" && rawVideoUrl.trim()
      ? [rawVideoUrl]
      : []

  return (
    <main className="animate-in fade-in duration-300">
      <div className="container py-6 md:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link
            href="/shop"
            className="hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground line-clamp-1">
            {product.product_name}
          </span>
        </nav>
      </div>

      <ProductDetailsClient product={product} videoUrls={videoUrls} />

      <div className="container py-6 md:py-10">
        <ProductsCarousel title="You may also like" product={product} />
      </div>
    </main>
  )
}
