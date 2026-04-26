import { api } from "@/lib/api-client"
import { IProduct, IProductsApiResponse } from "../types/product"
import StoriesSection from "./stories-section"

export default async function Th5TopSelling({ shopId }: { shopId: string }) {
  let products: IProduct[] = []
  try {
    const { data } = await api.get<IProductsApiResponse>(
      "/customer/products",
      undefined,
      { headers: { "shop-id": shopId }, fetchOptions: { cache: "no-store" } }
    )
    products = data?.data ?? []
  } catch {
    return null
  }
  if (!products.length) return null
  return <StoriesSection products={products} />
}
