import { api } from "@/lib/api-client"
import {
  IOrderSuccessfullApiResponse,
  IOrderSuccessfullData,
} from "@/app/(theme-3-old)/th_3/types/order-successfull"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"
import OrderSuccessfull from "@/app/(theme-3-old)/th_3/_components/order-successfull"

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
  if (!orderDetails) {
    return <div className="p-4 text-center">Order details not found.</div>
  }
  console.log(orderDetails)

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
