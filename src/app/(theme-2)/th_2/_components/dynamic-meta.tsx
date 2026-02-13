"use client"

import { useEffect } from "react"
import { useDomain } from "../store/domain"

export function DynamicMeta() {
  const domain = useDomain((state) => state.domain)

  useEffect(() => {
    if (!domain) return

    // Update document title
    if (domain.shop_meta_title) {
      document.title = domain.shop_meta_title
    }

    // Update meta description
    if (domain.shop_meta_description) {
      let metaDesc = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      )
      if (!metaDesc) {
        metaDesc = document.createElement("meta")
        metaDesc.name = "description"
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = domain.shop_meta_description
    }

    // Update favicon — update existing link or create a new one
    if (domain.shop_favicon) {
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"], link[rel="shortcut icon"]'
      )
      if (!link) {
        link = document.createElement("link")
        link.rel = "icon"
        document.head.appendChild(link)
      }
      link.href = domain.shop_favicon

      // Set type hint based on URL extension
      const ext = domain.shop_favicon
        .split(".")
        .pop()
        ?.split("?")[0]
        ?.toLowerCase()
      if (ext === "png") link.type = "image/png"
      else if (ext === "svg") link.type = "image/svg+xml"
      else if (ext === "ico") link.type = "image/x-icon"
    }
  }, [domain])

  return null
}
