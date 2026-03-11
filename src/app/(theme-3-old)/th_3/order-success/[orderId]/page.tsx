import OrderSuccessfull from "../../_components/order-successfull"
import { api } from "@/lib/api-client"
import {
  IOrderSuccessfullApiResponse,
  IOrderSuccessfullData,
} from "../../types/order-successfull"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"

const OrderSuccessPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>
}) => {
  const { orderId } = await params
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  const response = await api.get<IOrderSuccessfullApiResponse>(
    `/customer/order/${orderId}/details`,
    {
      headers: { "shop-id": shopInfo?.shop_id || "" },
    }
  )
  const orderDetails: IOrderSuccessfullData = response?.data?.data
  if (!orderDetails) {
    return <div className="p-4 text-center">Order details not found.</div>
  }

  return (
    <OrderSuccessfull
      {...orderDetails}
      gtmHead={shopInfo?.other_script?.gtm_head as string}
      brandColor={
        (
          shopInfo as {
            theme_settings?: { brand_color?: string | null }
          } | null
        )?.theme_settings?.brand_color ||
        (shopInfo as { multipage_color?: string | null } | null)
          ?.multipage_color ||
        undefined
      }
    />
  )
}

export default OrderSuccessPage
