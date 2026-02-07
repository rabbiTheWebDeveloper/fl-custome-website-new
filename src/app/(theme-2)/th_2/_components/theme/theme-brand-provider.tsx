"use client"

import { useEffect } from "react"
import { useDomain } from "../../store/domain"

const DEFAULT_PRIMARY_FOREGROUND = "oklch(0.985 0 0)"

function getBrandColorFromDomainCookie(): string | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("domain="))
    if (!match) return null

    const value = decodeURIComponent(match.split("=").slice(1).join("="))
    const parsed = JSON.parse(value) as {
      state?: { domain?: { theme_settings?: { brand_color?: string } } }
    }
    return parsed?.state?.domain?.theme_settings?.brand_color ?? null
  } catch {
    return null
  }
}

function getBrandColorFromThemeSettingsCookie(): string | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme_settings="))
    if (!match) return null

    const value = decodeURIComponent(match.split("=").slice(1).join("="))
    const parsed = JSON.parse(value) as { brand_color?: string }
    return typeof parsed?.brand_color === "string" ? parsed.brand_color : null
  } catch {
    return null
  }
}

function applyPrimaryColor(color: string | null) {
  const root = document.documentElement
  if (color) {
    root.style.setProperty("--primary", color)
    root.style.setProperty("--color-primary", color)
    root.style.setProperty("--primary-foreground", DEFAULT_PRIMARY_FOREGROUND)
  } else {
    root.style.removeProperty("--primary")
    root.style.removeProperty("--color-primary")
    root.style.removeProperty("--primary-foreground")
  }
}

export function ThemeBrandProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const domain = useDomain((state) => state.domain)

  useEffect(() => {
    // 1. From domain store (API response / hydrated from domain cookie)
    const fromDomain = domain?.theme_settings?.brand_color
    // 2. From domain cookie (before Zustand hydrates)
    const fromDomainCookie = getBrandColorFromDomainCookie()
    // 3. From theme_settings cookie
    const fromThemeSettingsCookie = getBrandColorFromThemeSettingsCookie()

    const brandColor =
      fromDomain ?? fromDomainCookie ?? fromThemeSettingsCookie ?? null

    applyPrimaryColor(brandColor)
  }, [domain])

  return <>{children}</>
}
