import { cookies } from "next/headers"
import AboutUs from "../_components/about"
import { getOtherData } from "@/utils/api-helpers"

const About = async () => {
  const cookie = cookies()
  const domain = (await cookie).get("domain")?.value || ""
  const shopId = JSON.parse(domain).state.domain.shop_id
  const data = await getOtherData(shopId, "privacy_policy")
  return (
    <>
      <AboutUs domainInfo={data} pageheader={"privacy_policy"} />
    </>
  )
}

export default About
