import { cookies, headers } from "next/headers"

/**
 * Domain cookie structure
 */
interface DomainCookie {
  state: {
    domain: {
      shop_id: string
      id: string
    }
  }
}

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000/api"

/**
 * Extracts shop ID and user ID from the domain cookie
 * @returns Object containing shopId and userId, or empty strings if cookie is missing/invalid
 */
export async function getDomainFromCookies(): Promise<{
  shopId: string
  userId: string
}> {
  const cookieStore = await cookies()
  const domainCookie = cookieStore.get("domain")?.value || ""

  if (!domainCookie) {
    // Return empty strings if cookie is not found (cookie might not be set yet)
    return {
      shopId: "",
      userId: "",
    }
  }

  try {
    const domain: DomainCookie = JSON.parse(domainCookie)
    const shopId = domain.state?.domain?.shop_id || ""
    const userId = domain.state?.domain?.id || ""

    return {
      shopId,
      userId,
    }
  } catch (error) {
    // If parsing fails, return empty strings instead of throwing
    // This allows the application to continue even if cookie is malformed
    console.warn("Failed to parse domain cookie:", error)
    return {
      shopId: "",
      userId: "",
    }
  }
}

/**
 * Gets API headers with shop-id and user-id from domain cookie
 * @returns Headers object ready to use with API requests
 */
export async function getDomainHeaders(): Promise<{
  "shop-id": string
  "user-id": string
}> {
  const { shopId, userId } = await getDomainFromCookies()
  return {
    "shop-id": shopId,
    "user-id": userId,
  }
}

/**
 * Extracts site metadata from the domain cookie (persisted by Zustand).
 * Falls back to a direct API call if the cookie is empty (e.g. first visit).
 * @returns Object with shop_meta_title, shop_meta_description, shop_favicon
 */
export async function getDomainMeta(): Promise<{
  title: string
  description: string
  favicon: string
  other_script?: Record<string, object> | undefined
}> {
  // 1. Try reading from the persisted Zustand cookie
  const cookieStore = await cookies()
  const raw = cookieStore.get("domain")?.value || ""

  if (!raw) {
    return { title: "", description: "", favicon: "", other_script: {} }
  }

  try {
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded)
    const domain = parsed?.state?.domain
    console.log("domain favicon", domain)

    return {
      title: domain?.shop_meta_title || "",
      description: domain?.shop_meta_description || "",
      favicon: domain?.shop_favicon || "",
    }
  } catch {
    return { title: "", description: "", favicon: "" }
  }

  return { title: "", description: "", favicon: "" }
}
