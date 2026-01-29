import { cookies } from "next/headers"

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
