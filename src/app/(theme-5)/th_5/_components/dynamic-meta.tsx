"use client"

import { useEffect, useRef } from "react"
import { useDomain } from "../store/domain"

export function DynamicMeta() {
  const domain = useDomain((state) => state.domain)
  // Track links we created so we only touch our own DOM nodes
  const ownedLinksRef = useRef<HTMLLinkElement[]>([])

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

    // Update favicon
    if (domain.shop_favicon) {
      // Determine MIME type from URL extension
      const ext = domain.shop_favicon
        .split(".")
        .pop()
        ?.split("?")[0]
        ?.toLowerCase()
      let mimeType = "image/x-icon"
      if (ext === "png") mimeType = "image/png"
      else if (ext === "svg") mimeType = "image/svg+xml"
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg"
      else if (ext === "webp") mimeType = "image/webp"

      // Update any existing favicon link in-place (safe for React-managed nodes)
      const existingIcon =
        document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (existingIcon) {
        existingIcon.href = domain.shop_favicon
        existingIcon.type = mimeType
      }

      // Remove only links we previously created, then recreate
      ownedLinksRef.current.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el)
      })
      ownedLinksRef.current = []

      // If no existing icon link was found, create one
      if (!existingIcon) {
        const link = document.createElement("link")
        link.rel = "icon"
        link.type = mimeType
        link.href = domain.shop_favicon
        document.head.appendChild(link)
        ownedLinksRef.current.push(link)
      }

      // Ensure a shortcut icon exists for older browsers
      const existingShortcut = document.querySelector<HTMLLinkElement>(
        'link[rel="shortcut icon"]'
      )
      if (existingShortcut) {
        existingShortcut.href = domain.shop_favicon
        existingShortcut.type = mimeType
      } else {
        const shortcutLink = document.createElement("link")
        shortcutLink.rel = "shortcut icon"
        shortcutLink.type = mimeType
        shortcutLink.href = domain.shop_favicon
        document.head.appendChild(shortcutLink)
        ownedLinksRef.current.push(shortcutLink)
      }
    }
  }, [domain])

  // Cleanup: remove only links we created
  useEffect(() => {
    return () => {
      ownedLinksRef.current.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el)
      })
      ownedLinksRef.current = []
    }
  }, [])

  return null
}
