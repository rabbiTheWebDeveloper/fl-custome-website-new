import { getDomainHeaders } from "@/lib/domain"

import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"
import ProductDescription from "../../_components/product-description"

const Details = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const headers = await getDomainHeaders()
  const response = await api.get(`/customer/products/${id}`, {
    headers,
  })
  const product: IProduct = (response.data as { data: IProduct }).data

  const rawVideoUrl = product.video_url as unknown
  const videoUrls: string[] = Array.isArray(rawVideoUrl)
    ? rawVideoUrl
    : typeof rawVideoUrl === "string" && rawVideoUrl.trim()
      ? [rawVideoUrl]
      : []
  return (
    <>
      <ProductDescription product={product} videoUrls={videoUrls} />
    </>
  )
}

export default Details
