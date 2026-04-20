import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCleanDomain } from "./utils/domain"
import { getDomainInfo } from "./utils/api-helpers"

type DomainThemePayload = {
  theme_id?: string | number | null
  theme_settings?: {
    theme_id?: string | number | null
    theme_name?: string | null
  } | null
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const THEME_MAP: Record<string, string> = {
    "201": "th_3",
    "202": "th_3",
    theme_1: "th_3",
    theme_2: "th_2",
    theme_4: "th_4",
  }

  const resolveTheme = (name: string) => THEME_MAP[name] || name

  const getThemeFromDomain = (
    domain: DomainThemePayload | null | undefined
  ) => {
    if (!domain) return ""

    const themeName =
      typeof domain.theme_settings?.theme_name === "string"
        ? domain.theme_settings.theme_name.trim()
        : ""

    if (themeName) {
      return resolveTheme(themeName)
    }

    const themeIdRaw =
      domain.theme_id ?? domain.theme_settings?.theme_id ?? undefined
    const themeId =
      themeIdRaw !== undefined && themeIdRaw !== null
        ? String(themeIdRaw).trim()
        : ""

    return themeId ? resolveTheme(themeId) : ""
  }

  const defaultTheme = resolveTheme(
    process.env.NEXT_PUBLIC_DEFAULT_THEME || "th_3"
  )
  let theme = defaultTheme

  const domainCookie = request.cookies.get("domain")?.value
  if (domainCookie) {
    try {
      const raw = domainCookie.includes("%7B")
        ? decodeURIComponent(domainCookie)
        : domainCookie
      const parsed = JSON.parse(raw)
      const domain = parsed?.state?.domain
      const cookieTheme = getThemeFromDomain(domain)
      if (cookieTheme) {
        theme = cookieTheme
      }
    } catch {
      // fall back to defaultTheme
    }
  }

  // First visit usually has no "domain" cookie yet.
  // Resolve theme directly from domain API in that case.
  if (theme === defaultTheme) {
    try {
      const cleanDomain = await getCleanDomain()
      const shopInfo = await getDomainInfo(cleanDomain)
      const apiTheme = getThemeFromDomain(shopInfo)
      if (apiTheme) {
        theme = apiTheme
      }
    } catch {
      // fall back to theme resolved from cookie/default
    }
  }

  if (
    pathname === "/default" ||
    pathname === "/th_2" ||
    pathname === "/th_3" ||
    pathname === "/th_4"
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pathname === "/about") {
    return NextResponse.rewrite(new URL(`/${theme}/about`, request.url))
  }

  if (pathname === "/contact") {
    return NextResponse.rewrite(new URL(`/${theme}/contact`, request.url))
  }

  if (pathname === "/terms") {
    return NextResponse.rewrite(new URL(`/${theme}/terms`, request.url))
  }
  if (pathname === "/privacy") {
    return NextResponse.rewrite(new URL(`/${theme}/privacy`, request.url))
  }
  if (pathname === "/shop") {
    const rewriteUrl = new URL(`/${theme}${pathname}`, request.url)
    rewriteUrl.search = request.nextUrl.search
    return NextResponse.rewrite(rewriteUrl)
  }

  if (pathname === "/checkout") {
    return NextResponse.rewrite(new URL(`/${theme}/checkout`, request.url))
  }

  if (pathname === "/order-success") {
    return NextResponse.rewrite(new URL(`/${theme}/order-success`, request.url))
  }

  if (pathname.startsWith("/product/")) {
    const rewriteUrl = new URL(`/${theme}${pathname}`, request.url)
    rewriteUrl.search = request.nextUrl.search
    return NextResponse.rewrite(rewriteUrl)
  }
  if (pathname.startsWith("/order-successfull/")) {
    return NextResponse.rewrite(new URL(`/${theme}${pathname}`, request.url))
  }
  if (pathname.startsWith("/online-payment-failed/")) {
    return NextResponse.rewrite(new URL(`/${theme}${pathname}`, request.url))
  }

  if (pathname === "/") {
    const rewriteUrl = new URL(`/${theme}`, request.url)
    rewriteUrl.search = request.nextUrl.search
    return NextResponse.rewrite(rewriteUrl)
  }

  // If the condition is not met, let the request proceed to the default '/' page
  return NextResponse.next()
}

// Configure the matcher to run the middleware on the root path
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
