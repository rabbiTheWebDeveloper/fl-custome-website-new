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
  return (
    <>
      <ProductDescription product={product} />
    </>
  )
}

export default Details
