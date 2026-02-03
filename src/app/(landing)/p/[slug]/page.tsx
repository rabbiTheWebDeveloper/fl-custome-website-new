import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import {
  getDomainAndShopInfoOrderSuccess,
  getLandingPageData,
} from "@/utils/api-helpers"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import LandingRenderer from "../../_component/LandingRenderer"
import LandingOrder from "../../_component/LandingOrder"
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const headerList = await headers()
  const host = headerList.get("host") as string
  const { slug } = await params
  const cleanDomain = host.replace(/^www\./, "")
  const domainData = await getDomainAndShopInfoOrderSuccess(cleanDomain)
  if (!domainData) return notFound()
  const { domainInfo, shopId } = domainData
  const { landingPageInfo } = await getLandingPageData(shopId, slug)
  const {
    checkout_b_color,
    checkout_button_color,
    checkout_button_text_color,
    checkout_text_color,
    order_title,
    product,
    checkout_button_text,
  } = landingPageInfo || {}

  if (!landingPageInfo) return notFound()

  let htmlContent = landingPageInfo?.page_content || ""

  // If no page_content, fetch template
  if (!htmlContent) {
    try {
      const templateData = await fetch(
        `${API_ENDPOINTS.TEMPLATE_URL}/templates/${domainInfo.shop_id}/${landingPageInfo.id}/`,
        {
          method: "GET",
          redirect: "follow",
        }
      )
      if (!templateData.ok) {
        // notFound();
      }
      console.log("Fetching template from:", templateData)
      htmlContent = await templateData.text()
    } catch {
      notFound()
    }
  }

  //   // Extract head and body content
  //   const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  //   const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  //   const headContent = headMatch ? headMatch[1] : "";
  //   const bodyContent = bodyMatch ? bodyMatch[1] : "";

  return (
    <>
      <LandingRenderer html={htmlContent} />
      <LandingOrder
        product={product}
        backgroundColor={checkout_b_color || "#f7f7f7"}
        fontColor={checkout_text_color || "#000000"}
        btnColor={checkout_button_color || "#000000"}
        btnTextColor={checkout_button_text_color || "#ffffff"}
        order_title={order_title}
        checkout_button_text={checkout_button_text}
      />
    </>
  )
}

export default page
