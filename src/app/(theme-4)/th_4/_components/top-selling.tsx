import { api } from "@/lib/api-client"
import { IProduct, IProductsApiResponse } from "../types/product"
import ProductSection from "./product-section"

export default async function TopSelling({ shopId }: { shopId: string }) {
  let products: IProduct[] = []
  try {
    const { data } = await api.get<IProductsApiResponse>(
      "/customer/top_selling_products_for_website",
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
      variant="top-selling"
      sectionId="top-selling"
    />
  )
}
