import { cookies } from "next/headers"
import AboutUs from "../_components/about"
import { getOtherData } from "@/utils/api-helpers"

const About = async () => {
  const cookie = cookies()
  const domain = (await cookie).get("domain")?.value || ""

  let shopId: string = ""
  try {
    shopId = domain ? String(JSON.parse(domain).state.domain.shop_id) : ""
  } catch {
    shopId = ""
  }

  const data = await getOtherData(shopId, "tos")
  return (
    <>
      <AboutUs domainInfo={data} pageheader={"terms_of_service"} />
    </>
  )
}

export default About
