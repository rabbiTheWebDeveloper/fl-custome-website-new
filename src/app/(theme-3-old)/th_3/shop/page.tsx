import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"

const ShopPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) => {
  const { page = "1", search } = await searchParams
  const headers = await getDomainHeaders()
  let response: IProductsApiResponse
  if (search && search.trim()) {
    // Use search API when search query is present
    const searchResponse = await api.get<IProductsApiResponse>(
      `/customer/product-search?search=${encodeURIComponent(search.trim())}&page=1`,
      undefined,
      {
        headers,
      }
    )
    response = searchResponse.data
  } else {
    const data = await api.get<IProductsApiResponse>(
      `/customer/products?page=${page}`,
      { headers }
    )
    response = data.data
  }

  const products = response.data

  return (
    <>
      <Shop products={products} totalPages={response.last_page} />
    </>
  )
}

export default ShopPage
