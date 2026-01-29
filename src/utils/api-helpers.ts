import { api } from "@/lib/api-client"

export const getOtherData = async (shopId: string, typeOfPage: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.getTyped<any>(
    `/shops/content?type=${typeOfPage}`,
    {
      headers: {
        "shop-id": shopId,
      },
    }
  )

  const products = response?.data
  return products
}
