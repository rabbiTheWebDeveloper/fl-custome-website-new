import { redirect } from "next/navigation"

const OrderSuccessfullPage = async ({
  params,
}: {
  params: Promise<{ orederdID: string }>
}) => {
  const { orederdID } = await params
  redirect(`/order-success/${orederdID}`)
}

export default OrderSuccessfullPage
