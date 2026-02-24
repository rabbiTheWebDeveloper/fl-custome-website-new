import { getCleanDomain } from "@/utils/domain"
import Checkout from "../_components/checkout/checkout"
import { getDomainInfo } from "@/utils/api-helpers"

const CheckoutPage = async () => {
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  return (
    <>
      <Checkout shopInfo={shopInfo} />
    </>
  )
}

export default CheckoutPage
