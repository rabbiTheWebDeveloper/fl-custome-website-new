"use client"

import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import { BASE_URL_VISITOR } from "@/constant"
import { useEffect, useRef } from "react"

export default function WebsiteTraffic({
  shopId,
}: {
  shopId: string | null | number
}) {
  const hasTracked = useRef(false)
  console.log("shopId", shopId)
  useEffect(() => {
    if (!shopId || hasTracked.current) return

    // prevent duplicate tracking in same session
    const storageKey = `visitorTracked-${shopId}`
    if (sessionStorage.getItem(storageKey)) return
    sessionStorage.setItem(storageKey, "true")

    hasTracked.current = true

    const trackVisitorDay = async () => {
      try {
        await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.VISITOR_TRACK}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "shop-id": shopId.toString(),
          },
          body: JSON.stringify({ type: "website" }),
        })
      } catch (error) {
        console.error("Visitor track error:", error)
      }
    }

    const activeUsers = async () => {
      try {
        await fetch(`${BASE_URL_VISITOR}shop-current-visit/active-users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "shop-id": shopId.toString(),
          },
          body: JSON.stringify({
            shopId,
            type: "website",
          }),
        })
      } catch (error) {
        console.error("Active users error:", error)
      }
    }

    trackVisitorDay()
    activeUsers()
  }, [shopId])

  return null
}
