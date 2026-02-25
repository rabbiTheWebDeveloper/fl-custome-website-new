import OrderSuccessfull from "../../_components/order-successfull"
import { api } from "@/lib/api-client"
import {
  IOrderSuccessfullApiResponse,
  IOrderSuccessfullData,
} from "../../types/order-successfull"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"

const OrderSuccessfullPage = async ({
  params,
}: {
  params: Promise<{ orederdID: string }>
}) => {
  const { orederdID } = await params
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  const response = await api.get<IOrderSuccessfullApiResponse>(
    `/customer/order/${orederdID}/details`,
    {
      headers: { "shop-id": shopInfo?.shop_id || "" },
    }
  )
  const orderDetails: IOrderSuccessfullData = response?.data?.data
  console.log("Order Details:", orderDetails)
  if (!orderDetails) {
    return <div className="p-4 text-center">Order details not found.</div>
  }

  return (
    <>
      <OrderSuccessfull
        {...orderDetails}
        gtmHead={shopInfo?.other_script?.gtm_head as string}
      />
    </>
  )
}

export default OrderSuccessfullPage
