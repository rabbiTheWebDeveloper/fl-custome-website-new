"use client"

import { useEffect, useRef } from "react"
import { trackBeginCheckout, trackViewItem } from "./gtm"
import type { CartItem as StoreCartItem } from "@/lib/cart"

export function useTrackBeginCheckout(
  items: StoreCartItem[],
  totalValue: number,
  gtmHead?: string | null
) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (items.length > 0 && gtmHead && !hasTracked.current) {
      const cartItemsForGTM = items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.discountedPrice ?? item.price,
        quantity: item.quantity,
      }))

      void trackBeginCheckout(cartItemsForGTM, totalValue)
      hasTracked.current = true
    }
  }, [items, totalValue, gtmHead])
}

export function useTrackViewItem(
  product: { id: string | number; product_name: string } | undefined | null,
  selectedPrice: number | undefined | null
) {
  const lastTrackedProductId = useRef<string | number | null>(null)

  useEffect(() => {
    if (!product?.id || selectedPrice == null) return
    if (lastTrackedProductId.current === product.id) return

    void trackViewItem(
      {
        id: product.id,
        name: product.product_name,
      },
      selectedPrice
    )

    lastTrackedProductId.current = product.id
  }, [product?.id, product?.product_name, selectedPrice])
}
