import { NextRequest, NextResponse } from "next/server"
import { getDomainInfo } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

export async function GET(request: NextRequest) {
  try {
    const cleanDomain = await getCleanDomain()
    const shopInfo = await getDomainInfo(cleanDomain)
    const favicon = shopInfo?.shop_favicon

    if (favicon) {
      const faviconUrl = favicon.startsWith("http")
        ? favicon
        : new URL(favicon, request.url).toString()

      // Prevent redirect loops if favicon path resolves back to /favicon.ico
      if (!faviconUrl.endsWith("/favicon.ico")) {
        return NextResponse.redirect(faviconUrl, 307)
      }
    }
  } catch {
    // Fall through to static fallback icon.
  }

  return NextResponse.redirect(new URL("/icon.svg", request.url), 307)
}
