"use client"

import { useEffect, useRef } from "react"
import { BASE_URL_VISITOR } from "@/constant"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"

interface PageInfo {
  shop_id: string
  id: string
  slug: string
  [key: string]: unknown
}

export default function LandingPageTracker({
  pageInfo,
}: {
  pageInfo: PageInfo
}) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (
      !pageInfo?.shop_id ||
      !pageInfo?.id ||
      !pageInfo?.slug ||
      hasTracked.current
    )
      return

    // Prevent duplicate tracking in the same session
    if (sessionStorage.getItem(`landingTracked-${pageInfo.id}`)) return
    sessionStorage.setItem(`landingTracked-${pageInfo.id}`, "true")

    hasTracked.current = true

    const trackVisitorDay = async () => {
      if (!API_ENDPOINTS.BASE_URL) {
        return
      }
      try {
        await fetch(`${API_ENDPOINTS.BASE_URL}/visitors/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "shop-id": pageInfo.shop_id,
          },
          body: JSON.stringify({
            landingPageId: pageInfo.id,
            landingPageSlug: pageInfo.slug,
            type: "landing",
          }),
        })
      } catch (error) {
        console.error("Landing page visitor track error:", error)
      }
    }

    const activeUsers = async () => {
      try {
        await fetch(`${BASE_URL_VISITOR}landing-page/active-users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shopId: pageInfo.shop_id,
            landingPageId: pageInfo.id,
            landingPageSlug: pageInfo.slug,
            type: "landing",
          }),
        })
      } catch (error) {
        console.error("Landing page active users error:", error)
      }
    }

    // Only run on first navigation to this page
    const navigationType = (
      window.performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming
    )?.type
    if (navigationType === "navigate") {
      trackVisitorDay()
      activeUsers()
    }
  }, [pageInfo?.shop_id, pageInfo?.id, pageInfo?.slug])

  return null
}
