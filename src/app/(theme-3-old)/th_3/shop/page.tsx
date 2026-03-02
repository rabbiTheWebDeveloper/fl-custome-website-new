import { getDomainInfo } from "@/utils/api-helpers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"
import { getCleanDomain } from "@/utils/domain"
export const dynamic = "force-dynamic"
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
    const cleanDomain = await getCleanDomain()
    const shopInfo = await getDomainInfo(cleanDomain)
    const shopId = shopInfo?.shop_id || ""
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
          headers: { "shop-id": shopId },
          fetchOptions: { cache: "no-store" },
        }
      )
      response = searchResponse.data
    } else if (id && category) {
      const categoryResponse = await api.get<IProductsApiResponse>(
        `/customer/category-product/list/${id}?page=1`,
        undefined,
        {
          headers: { "shop-id": shopId },
          fetchOptions: { cache: "no-store" },
        }
      )
      response = categoryResponse.data
    } else {
      const data = await api.get<IProductsApiResponse>(
        `/customer/products?page=${page}`,
        undefined,
        {
          headers: { "shop-id": shopId },
          fetchOptions: { cache: "no-store" },
        }
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
