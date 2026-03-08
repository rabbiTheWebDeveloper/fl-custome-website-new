// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCleanDomain } from "./utils/domain"
import { getDomainInfo } from "./utils/api-helpers"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const THEME_MAP: Record<string, string> = {
    "201": "th_3",
  }
  const resolveTheme = (name: string) => THEME_MAP[name] || name

  const defaultTheme = resolveTheme(
    process.env.NEXT_PUBLIC_DEFAULT_THEME || "th_3"
  )
  let theme = defaultTheme
  const cleanDomain = await getCleanDomain()
  const domain = await getDomainInfo(cleanDomain)
  if (domain) {
    try {
      if (domain?.theme_settings === null) {
        theme = "th_3"
      } else {
        const themeName = domain?.theme_settings?.theme_name
        const themeId = domain?.theme_id ? String(domain.theme_id).trim() : ""

        const resolvedName =
          typeof themeName === "string" && themeName.trim() !== ""
            ? themeName.trim()
            : themeId

        if (resolvedName) {
          theme = resolveTheme(resolvedName)
        }
      }
    } catch {
      // fall back to defaultTheme
    }
  }

  if (
    pathname === "/default" ||
    pathname === "/theme_1" ||
    pathname === "/th_2" ||
    pathname === "/th_3"
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
  if (pathname === "/online-payment-failed/") {
    return NextResponse.rewrite(
      new URL(`/${theme}/online-payment-failed/`, request.url)
    )
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
