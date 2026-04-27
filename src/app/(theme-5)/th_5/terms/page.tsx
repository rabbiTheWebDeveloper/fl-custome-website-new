import AboutUs from "../_components/about"
import { getDomainInfo, getOtherData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

const About = async () => {
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  const shopId = shopInfo?.shop_id || ""

  const data = await getOtherData(shopId, "tos")
  return (
    <>
      <AboutUs domainInfo={data} pageheader={"terms_of_service"} />
    </>
  )
}

export default About
