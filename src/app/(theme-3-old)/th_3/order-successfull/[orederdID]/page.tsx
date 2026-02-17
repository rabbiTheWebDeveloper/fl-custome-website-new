import { getDomainHeaders } from "@/lib/domain"
import OrderSuccessfull from "../../_components/order-successfull"
import { api } from "@/lib/api-client"
import {
  IOrderSuccessfullApiResponse,
  IOrderSuccessfullData,
} from "../../types/order-successfull"

const OrderSuccessfullPage = async ({
  params,
}: {
  params: Promise<{ orederdID: string }>
}) => {
  const { orederdID } = await params
  const headers = await getDomainHeaders()
  const response = await api.get<IOrderSuccessfullApiResponse>(
    `/customer/order/${orederdID}/details`,
    {
      headers,
    }
  )
  const orderDetails: IOrderSuccessfullData = response?.data?.data

  return (
    <>
      <OrderSuccessfull {...orderDetails} />
    </>
  )
}

export default OrderSuccessfullPage
