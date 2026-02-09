import { cookies } from "next/headers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"

const ShopPage = async () => {
  const headers = await getDomainHeaders()
  const { data: response } = await api.get<IProductsApiResponse>(
    `/customer/products`,
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
