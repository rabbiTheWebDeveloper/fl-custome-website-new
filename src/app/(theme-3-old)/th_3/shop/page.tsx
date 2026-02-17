import { getDomainInfo } from "@/utils/api-helpers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"
import { headers } from "next/headers"
const ShopPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) => {
  const host = (await headers()).get("host") || ""
  const cleanDomain = host.replace(/^www\./, "")
  const shopInfo = await getDomainInfo(cleanDomain)
  const { page = "1", search } = await searchParams
  let response: IProductsApiResponse
  if (search && search.trim()) {
    const searchResponse = await api.get<IProductsApiResponse>(
      `/customer/product-search?search=${encodeURIComponent(search.trim())}&page=1`,
      undefined,
      {
        headers: { "shop-id": shopInfo?.shop_id || "" },
      }
    )
    response = searchResponse.data
  } else {
    const data = await api.get<IProductsApiResponse>(
      `/customer/products?page=${page}`,
      { headers: { "shop-id": shopInfo?.shop_id || "" } }
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
