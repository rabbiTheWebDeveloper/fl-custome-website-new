"use client"

import { useEffect, useRef } from "react"
import { api } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"

interface ProductVisitTrackerProps {
  productId: string | number
  shopId: string | number
}

export function ProductVisitTracker({
  productId,
  shopId,
}: ProductVisitTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per component mount
    if (!productId || !shopId || hasTracked.current) return

    hasTracked.current = true

    void api
      .get(`${API_ENDPOINTS.PRODUCT_WISE_VISITOR}/${productId}`, {
        headers: { "shop-id": shopId.toString() },
      })
      .catch((err) => {
        console.error("Failed to track product visit:", err)
      })
  }, [productId, shopId])

  return null
}
