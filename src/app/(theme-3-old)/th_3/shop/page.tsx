import { cookies } from "next/headers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"
// http://localhost:3000/shop?page=2

const ShopPage = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const { page = '1'} = await searchParams
  const headers = await getDomainHeaders()
  const { data: response } = await api.get<IProductsApiResponse>(
    `/customer/products?page=${page}`,
    { headers }
  )

  const products = response.data

  return (
    <>
      <Shop products={products} totalPages={response.last_page} />
    </>
  )
}

export default ShopPage
