import { NextResponse } from "next/server"
import { getDomainInfo } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

export async function GET() {
  try {
    const cleanDomain = await getCleanDomain()
    const shopInfo = await getDomainInfo(cleanDomain)

    return NextResponse.json(
      {
        domain: cleanDomain,
        name: shopInfo?.shop_meta_title || shopInfo?.name || "Shop",
        description: shopInfo?.shop_meta_description || "",
        favicon: shopInfo?.shop_favicon || "",
        domain_verify: shopInfo?.domain_verify || "",
        shop_id: shopInfo?.shop_id || "",
        theme_id: shopInfo?.theme_id || "",
        other_script: shopInfo?.other_script || {},
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch {
    return NextResponse.json(
      {
        name: "Shop",
        description: "",
        favicon: "",
        domain_verify: "",
        other_script: {},
      },
      { status: 200 }
    )
  }
}
