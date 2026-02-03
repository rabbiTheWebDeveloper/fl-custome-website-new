import { getDomainHeaders } from "@/lib/domain"
import ProductDescription from "../../_components/product-description"
import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"

const Details = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ id: string }>
}) => {
  // const productId = params.slug
  // const { id } = await params
  const { id } = await params
  const productId = Number(searchParams?.id)
  console.log("Product ID:", productId)
  const headers = await getDomainHeaders()

  const response = await api.get(`/customer/products/${productId}`, {
    headers,
  })
  const product: IProduct = (response.data as { data: IProduct }).data
  console.log("Product Details: ", product)

  return (
    <>
      <ProductDescription product={product} />
    </>
  )
}

export default Details
