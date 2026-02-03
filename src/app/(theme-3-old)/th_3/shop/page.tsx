import { cookies } from "next/headers"
import Shop from "../_components/shop"
import { IProductsApiResponse } from "../types/product"
import { api } from "@/lib/api-client"

const ShopPage = async () => {
  const cookie = cookies()
  const domain = (await cookie).get("domain")?.value || ""
  const shopId = JSON.parse(domain).state.domain.shop_id
  const userId = JSON.parse(domain).state.domain.id
  const response = await api.getTyped<
    "/customer/products",
    IProductsApiResponse
  >("/customer/products", {
    headers: {
      "shop-id": shopId,
      "user-id": userId,
    },
  })

  const products = response.data

  return (
    <>
      <Shop products={products} totalPages={response.last_page} />
    </>
  )
}

export default ShopPage
