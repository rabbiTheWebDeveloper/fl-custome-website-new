import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import {
  getDomainAndShopInfoOrderSuccess,
  getDomainInfo,
  getLandingPageData,
} from "@/utils/api-helpers"
import { notFound } from "next/navigation"
import LandingOrder from "../../_component/LandingOrder"
import ShadowRoot from "../../_component/ShadowRoot"
import parse from "html-react-parser"
import { getCleanDomain } from "@/utils/domain"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  return {
    title: slug + " | " + shopInfo?.shop_meta_title,
    description: shopInfo?.shop_meta_description || "",
  }
}
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const cleanDomain = await getCleanDomain()
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
  let htmlContent = landingPageInfo?.page_content || ""
  if (!landingPageInfo) return notFound()
  if (landingPageInfo.page_url) {
    const res = await fetch(landingPageInfo.page_url, {
      cache: "no-store", // important for dynamic pages
    })
    const html = await res.text()
    htmlContent = html
  }
  // If no page_content, fetch template
  if (!htmlContent) {
    try {
      const templateData = await fetch(
        `${API_ENDPOINTS.TEMPLATE_URL}/templates/${domainInfo.shop_id}/${landingPageInfo?.id}/`,
        {
          method: "GET",
          redirect: "follow",
        }
      )
      if (!templateData.ok) {
        notFound()
      }
      htmlContent = await templateData.text()
    } catch {
      notFound()
    }
  }

  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const headContent = headMatch ? headMatch[1] : ""
  const bodyContent = bodyMatch ? bodyMatch[1] : ""
  // Parse HTML strings into React components with trim option to remove whitespace text nodes
  const reactHead = parse(headContent.trim(), {
    trim: true,
  })
  const reactBody = parse(bodyContent.trim())

  return (
    <>
      <ShadowRoot>
        {reactHead}
        {reactBody}
      </ShadowRoot>
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
