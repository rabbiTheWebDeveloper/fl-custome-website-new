import { api } from "@/lib/api-client"
import { IProduct, IProductsApiResponse } from "../types/product"
import { Th5ProductSection } from "./stories-section"

export default async function Th5FlashSale({ shopId }: { shopId: string }) {
  let products: IProduct[] = []
  try {
    const { data } = await api.get<IProductsApiResponse>(
      "/customer/flash_products",
      undefined,
      { headers: { "shop-id": shopId }, fetchOptions: { cache: "no-store" } }
    )
    products = data?.data ?? []
  } catch {
    return null
  }
  if (!products.length) return null
  return <Th5ProductSection products={products} title="Flash Deals" />
}
