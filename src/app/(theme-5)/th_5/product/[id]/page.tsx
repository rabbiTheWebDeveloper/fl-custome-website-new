import { notFound } from "next/navigation"
import { api } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"
import ProductDetailClient from "./ProductDetailClient"
import { IProduct } from "../../types/product"

type PageProps = {
  params: Promise<{ id: string }>
}

const Details = async ({ params }: PageProps) => {
  const { id: ulid } = await params
  const validUlid = ulid && !["undefined", "null"].includes(ulid) ? ulid : null

  if (!validUlid) {
    notFound()
  }
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)

  if (!validUlid || !shopInfo?.shop_id) {
    notFound()
  }

  let product: IProduct | null = null

  try {
    const { data } = await api.get<{ data: IProduct }>(
      `/customer/products/${ulid}`,
      {
        headers: { "shop-id": shopInfo.shop_id },
      }
    )
    product = data?.data ?? null
  } catch (error) {
    console.error("Failed to fetch product:", error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Fire-and-forget tracking (should not block rendering)
  void api
    .get(`${API_ENDPOINTS.PRODUCT_WISE_VISITOR}/${product.id}`, {
      headers: { "shop-id": shopInfo.shop_id },
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

  const relatedProducts: IProduct[] =
    product.relatedProducts ?? product.related_products ?? []

  return (
    <ProductDetailClient
      product={product}
      videoUrls={videoUrls}
      relatedProducts={relatedProducts}
    />
  )
}

export default Details
