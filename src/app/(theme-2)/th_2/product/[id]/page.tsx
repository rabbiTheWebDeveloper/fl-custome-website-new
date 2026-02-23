import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductImageCarousel } from "../../_components/product/product-image-carousel"
import { ProductsCarousel } from "../../_components/products/products-carousel"
import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"
import { getDomainHeaders } from "@/lib/domain"
import { ProductCartControls } from "../../_components/product/product-cart-controls"
import { SocialShareButtons } from "../../_components/product/social-share-buttons"
import { StickyMobileBar } from "../../_components/product/sticky-mobile-bar"
import { notFound } from "next/navigation"

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { id: slug } = await params
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
    product = (response.data as { data: IProduct })?.data
  } catch {
    product = undefined
  }

  if (!product) {
    notFound()
  }

  const rawVideoUrl = product.video_url as unknown
  const videoUrls: string[] = Array.isArray(rawVideoUrl)
    ? rawVideoUrl
    : typeof rawVideoUrl === "string" && rawVideoUrl.trim()
      ? [rawVideoUrl]
      : []

  const hasDiscount = product.price > product.discounted_price
  const isStockOut = product.product_qty <= 0

  return (
    <main className="animate-in fade-in duration-300">
      <div className="py-6 md:py-10 container">
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

        <div className="grid md:grid-cols-7 gap-6 md:gap-12 lg:gap-24">
          <div className="col-span-3">
            <ProductImageCarousel
              images={[product.main_image ?? "", ...product.other_images]}
              videoUrls={videoUrls}
            />
          </div>
          <div className="overflow-hidden col-span-4">
            <div>
              {isStockOut && (
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mb-3">
                  STOCK OUT
                </span>
              )}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-semibold mt-1 leading-tight">
                {product.product_name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                {hasDiscount ? (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xl md:text-3xl font-semibold text-primary">
                      ৳{product.discounted_price.toLocaleString()}
                    </span>
                    <span className="bg-[#FFA01C] text-black text-xs font-semibold px-2 py-1 rounded-md">
                      {product.flat_discount_percent} OFF
                    </span>
                  </>
                ) : (
                  <span className="text-xl md:text-3xl font-semibold text-primary">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <ProductCartControls product={product} />

            <SocialShareButtons productName={product.product_name} />

            {product.short_description && (
              <div
                className="mt-6 md:mt-8 prose prose-sm max-w-3xl break-words"
                dangerouslySetInnerHTML={{
                  __html: product.short_description,
                }}
              />
            )}
            {product.long_description && (
              <div
                className="mt-6 md:mt-8 prose prose-sm max-w-3xl break-words"
                dangerouslySetInnerHTML={{
                  __html: product.long_description,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <ProductsCarousel title="You may also like" product={product} />

      <StickyMobileBar product={product} />
    </main>
  )
}
