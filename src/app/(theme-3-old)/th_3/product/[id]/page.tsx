import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"
import ProductDescription from "../../_components/product-description"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"
import { notFound } from "next/navigation"

const Details = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)

  if (!id || !shopInfo?.shop_id) {
    notFound()
  }

  // Fetch product
  let product: IProduct | null = null
  try {
    const { data: productData } = await api.get<{ data: IProduct }>(
      `/customer/products/${id}`,
      {
        headers: {
          "shop-id": shopInfo.shop_id,
        },
      }
    )
    if (productData?.data) {
      product = productData.data
    }
  } catch (error) {
    console.error("Failed to fetch product:", error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Track product visit (fire-and-forget, must not crash the page)
  if (product?.id) {
    api
      .post(`${API_ENDPOINTS.PRODUCT_WISE_VISITOR}/${product.id}`, undefined, {
        headers: { "shop-id": shopInfo.shop_id },
      })
      .catch((err) => console.error("Failed to track product visit:", err))
  }

  const rawVideoUrl = (product.video_url ?? null) as unknown
  const videoUrls: string[] = Array.isArray(rawVideoUrl)
    ? rawVideoUrl
    : typeof rawVideoUrl === "string" && rawVideoUrl.trim()
      ? [rawVideoUrl]
      : []

  return <ProductDescription product={product} videoUrls={videoUrls} />
}

export default Details
