import type { MetadataRoute } from "next"
import { getDomainInfo } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

function getSiteUrlFromHost(host: string): string {
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1")
  const protocol = isLocal ? "http" : "https"
  return `${protocol}://${host}`
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const cleanDomain = await getCleanDomain()
    const shopInfo = await getDomainInfo(cleanDomain)
    const siteUrl = getSiteUrlFromHost(cleanDomain)

    // If domain is unknown/unconfigured, prevent indexing.
    if (!shopInfo?.shop_id) {
      return {
        rules: {
          userAgent: "*",
          disallow: "/",
        },
      }
    }

    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    }
  } catch {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }
}
