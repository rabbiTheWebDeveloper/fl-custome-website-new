import { api } from "@/lib/api-client"
import { IProduct, IProductsApiResponse } from "../types/product"
import ProductSection from "./product-section"

export default async function NewArrival({ shopId }: { shopId: string }) {
  let products: IProduct[] = []
  try {
    const { data } = await api.get<IProductsApiResponse>(
      "/customer/new_arrival",
      undefined,
      {
        headers: { "shop-id": shopId },
        fetchOptions: { cache: "no-store" },
      }
    )
    products = data?.data ?? []
  } catch {
    return null
  }

  if (!products.length) return null

  return (
    <ProductSection
      products={products}
      variant="new-arrival"
      sectionId="new-arrivals"
    />
  )
}
