import { getDomainInfo } from "@/utils/api-helpers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { headers } from "next/headers"
const ShopPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    id?: string
    category?: string
  }>
}) => {
  let products: IProductsApiResponse["data"] = []
  let totalPages = 1

  try {
    const host = (await headers()).get("host") || ""
    const cleanDomain = host.replace(/^www\./, "")
    const shopInfo = await getDomainInfo(cleanDomain)
    const { page = "1", search, id, category } = await searchParams
    console.log("[theme-3 Shop] Fetching products with params:", {
      page,
      search,
      id,
      category,
    })
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
    } else if (id && category) {
      const categoryResponse = await api.get<IProductsApiResponse>(
        `/customer/category-product/list/${id}?page=1`,
        undefined,
        {
          headers: { "shop-id": shopInfo?.shop_id || "" },
        }
      )
      response = categoryResponse.data
    } else {
      const data = await api.get<IProductsApiResponse>(
        `/customer/products?page=${page}`,
        { headers: { "shop-id": shopInfo?.shop_id || "" } }
      )
      response = data.data
    }

    products = response.data
    totalPages = response.last_page
  } catch (err) {
    console.warn("[theme-3 Shop] Failed to fetch products:", err)
  }

  return (
    <>
      <Shop products={products} totalPages={totalPages} />
    </>
  )
}

export default ShopPage
