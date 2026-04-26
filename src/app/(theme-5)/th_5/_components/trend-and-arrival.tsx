import { api } from "@/lib/api-client"
import { IProduct, IProductsApiResponse } from "../types/product"
import ProductTabs from "./product-tabs"

export default async function Th5TrendAndArrival({
  shopId,
}: {
  shopId: string
}) {
  let trendingProducts: IProduct[] = []
  let newArrivalProducts: IProduct[] = []

  try {
    const [trendRes, arrivalRes] = await Promise.all([
      api.get<IProductsApiResponse>(
        "/customer/top_selling_products_for_website",
        undefined,
        { headers: { "shop-id": shopId }, fetchOptions: { cache: "no-store" } }
      ),
      api.get<IProductsApiResponse>("/customer/new_arrival", undefined, {
        headers: { "shop-id": shopId },
        fetchOptions: { cache: "no-store" },
      }),
    ])
    trendingProducts = trendRes.data?.data ?? []
    newArrivalProducts = arrivalRes.data?.data ?? []
  } catch {
    return null
  }

  return (
    <ProductTabs
      trendingProducts={trendingProducts}
      newArrivalProducts={newArrivalProducts}
    />
  )
}
