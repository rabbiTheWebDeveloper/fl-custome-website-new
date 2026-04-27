import AboutUs from "../_components/about"
import { getDomainInfo, getOtherData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

const About = async () => {
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  const shopId = shopInfo?.shop_id || ""

  const data = await getOtherData(shopId, "about_us")
  return (
    <>
      <AboutUs domainInfo={data} pageheader={"about_us"} />
    </>
  )
}

export default About
